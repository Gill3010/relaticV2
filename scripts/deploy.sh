#!/usr/bin/env bash
# Deploy de relaticV2 (SPA) + chatbot-api (Passenger) hacia GoDaddy / cPanel.
#
# Uso:
#   ./scripts/deploy.sh              # deploy real (requiere autorización humana)
#   DEPLOY_DRY_RUN=1 ./scripts/deploy.sh
#
# Variables opcionales:
#   SSH_HOST=50.63.3.2
#   SSH_USER=zts5eyzr4hri
#   SSH_PORT=22
#   REMOTE_ROOT=/home/zts5eyzr4hri/public_html
#   BACKEND_LOCAL=/Users/israelsamuels/chatbot-api
#   DEPLOY_DRY_RUN=1
#   SKIP_FRONTEND=1
#   SKIP_BACKEND=1
#   SKIP_HEALTH=1

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="${ROOT_DIR}"
BACKEND_LOCAL="${BACKEND_LOCAL:-/Users/israelsamuels/chatbot-api}"

# Preferir el Host de ~/.ssh/config (IdentityFile). Override: SSH_HOST=50.63.3.2
SSH_HOST="${SSH_HOST:-myserver}"
SSH_USER="${SSH_USER:-zts5eyzr4hri}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_ROOT="${REMOTE_ROOT:-/home/zts5eyzr4hri/public_html}"
REMOTE="${SSH_USER}@${SSH_HOST}"

DRY_RUN="${DEPLOY_DRY_RUN:-0}"
SKIP_FRONTEND="${SKIP_FRONTEND:-0}"
SKIP_BACKEND="${SKIP_BACKEND:-0}"
SKIP_HEALTH="${SKIP_HEALTH:-0}"

RSYNC_FLAGS=(-az --human-readable --itemize-changes)
SSH_CMD=(ssh -p "${SSH_PORT}" -o StrictHostKeyChecking=accept-new)
RSYNC_SSH="ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new"

if [[ "${DRY_RUN}" == "1" ]]; then
  RSYNC_FLAGS+=(--dry-run)
  echo "==> MODO DRY-RUN: no se escribirá nada en el servidor"
fi

# Directorios/archivos del hosting que NUNCA deben borrarse ni sobrescribirse por la SPA.
PROTECTED_EXCLUDES=(
  --exclude 'api/'
  --exclude 'api.zip'
  --exclude 'chatbot/'
  --exclude 'PHP/'
  --exclude '_blog/'
  --exclude '_classroom/'
  --exclude '_books/'
  --exclude '_journals/'
  --exclude '_posters/'
  --exclude '_events/'
  --exclude '_speakers/'
  --exclude '_index/'
  --exclude '_protect/'
  --exclude 'editorialecuador.org/'
  --exclude 'revistas.editorialecuador.org/'
  --exclude 'laboratorio.editorialecuador.org/'
  --exclude 'dev/'
  --exclude 'mail/'
  --exclude 'cgi-bin/'
  --exclude '.well-known/'
  --exclude 'error_log'
  --exclude '.htpasswds/'
  --exclude '.trash/'
  --exclude 'tmp/'
)

log() { printf '\n==> %s\n' "$*"; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Falta el comando: $1"
}

require_cmd npm
require_cmd rsync
require_cmd ssh
require_cmd curl

[[ -d "${FRONTEND_DIR}" ]] || die "No existe frontend: ${FRONTEND_DIR}"
[[ -d "${BACKEND_LOCAL}" ]] || die "No existe backend local: ${BACKEND_LOCAL}"

log "Preflight SSH (${REMOTE})"
if [[ "${DRY_RUN}" == "1" ]]; then
  echo "(dry-run) se omitiría la prueba de conexión SSH"
else
  "${SSH_CMD[@]}" "${REMOTE}" "test -d '${REMOTE_ROOT}' && echo OK_REMOTE_ROOT"
fi

# ── 1) Build frontend ───────────────────────────────────────────────────────
if [[ "${SKIP_FRONTEND}" != "1" ]]; then
  log "Build frontend (npm run build)"
  (
    cd "${FRONTEND_DIR}"
    npm run build
  )
  [[ -d "${FRONTEND_DIR}/dist" ]] || die "No se generó dist/"
else
  log "SKIP_FRONTEND=1 — se omite build/rsync de la SPA"
fi

# ── 2) Subir SPA (dist/) ────────────────────────────────────────────────────
if [[ "${SKIP_FRONTEND}" != "1" ]]; then
  log "rsync dist/ → ${REMOTE}:${REMOTE_ROOT}/"
  rsync "${RSYNC_FLAGS[@]}" --delete \
    "${PROTECTED_EXCLUDES[@]}" \
    -e "${RSYNC_SSH}" \
    "${FRONTEND_DIR}/dist/" \
    "${REMOTE}:${REMOTE_ROOT}/"

  # ── 3) .htaccess raíz (SPA + excepciones api/chatbot) ──────────────────────
  # Fuente canónica: public/.htaccess (también llega vía dist/ si Vite lo copia).
  # Se fuerza de nuevo para garantizar las reglas de rewrite.
  if [[ -f "${FRONTEND_DIR}/public/.htaccess" ]]; then
    log "Subir public/.htaccess → ${REMOTE_ROOT}/.htaccess"
    rsync "${RSYNC_FLAGS[@]}" \
      -e "${RSYNC_SSH}" \
      "${FRONTEND_DIR}/public/.htaccess" \
      "${REMOTE}:${REMOTE_ROOT}/.htaccess"
  else
    echo "AVISO: no existe public/.htaccess; se omite este paso"
  fi
fi

# ── 4) Subir backend Node ───────────────────────────────────────────────────
if [[ "${SKIP_BACKEND}" != "1" ]]; then
  log "rsync chatbot-api → ${REMOTE}:${REMOTE_ROOT}/chatbot/backend/"
  # Sin --delete agresivo sobre storage/ para no borrar documentos subidos.
  rsync "${RSYNC_FLAGS[@]}" \
    --exclude 'node_modules/' \
    --exclude '.env' \
    --exclude '.env.*' \
    --exclude 'tmp/' \
    --exclude '.git/' \
    --exclude '.DS_Store' \
    -e "${RSYNC_SSH}" \
    "${BACKEND_LOCAL}/" \
    "${REMOTE}:${REMOTE_ROOT}/chatbot/backend/"

  # ── 5) Reinicio Passenger ─────────────────────────────────────────────────
  log "Reiniciar Passenger (touch tmp/restart.txt)"
  if [[ "${DRY_RUN}" == "1" ]]; then
    echo "(dry-run) mkdir -p .../tmp && touch .../tmp/restart.txt"
  else
    "${SSH_CMD[@]}" "${REMOTE}" \
      "mkdir -p '${REMOTE_ROOT}/chatbot/backend/tmp' && touch '${REMOTE_ROOT}/chatbot/backend/tmp/restart.txt' && echo RESTART_OK"
  fi
else
  log "SKIP_BACKEND=1 — se omite backend/Passenger"
fi

# ── 6) Health check ─────────────────────────────────────────────────────────
if [[ "${SKIP_HEALTH}" != "1" ]]; then
  log "Health check → https://relaticpanama.org/api/chat/health"
  if [[ "${DRY_RUN}" == "1" ]]; then
    echo "(dry-run) se omitiría el health check post-deploy"
  else
    # Pequeña espera para que Passenger levante
    sleep 2
    HEALTH_JSON="$(curl -fsS --max-time 20 https://relaticpanama.org/api/chat/health)"
    echo "${HEALTH_JSON}"
    echo "${HEALTH_JSON}" | grep -q '"status":"ok"' || die "Health check falló"
    echo "HEALTH_OK"
  fi
fi

if [[ "${DRY_RUN}" == "1" ]]; then
  log "Deploy finalizado (dry-run)"
else
  log "Deploy finalizado"
fi
echo "Frontend: https://relaticpanama.org/"
echo "API:      https://relaticpanama.org/api/chat/health"
echo "UI temp:  https://relaticpanama.org/chatbot/"
