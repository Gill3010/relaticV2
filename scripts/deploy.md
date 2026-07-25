# Deploy — Relatic Panamá (GoDaddy / cPanel)

Despliega la SPA de `relaticV2` y, opcionalmente, el backend Node del chatbot
(`chatbot-api`) hacia `public_html`, **sin tocar** otros sitios del hosting.

> **Importante:** no ejecutes un deploy real hasta autorizarlo explícitamente.
> Usa siempre `DEPLOY_DRY_RUN=1` primero.

## Arquitectura en el servidor

| Ruta local (Mac) | Destino remoto |
|---|---|
| `relaticV2/dist/` | `/home/zts5eyzr4hri/public_html/` |
| `relaticV2/public/.htaccess` | `/home/zts5eyzr4hri/public_html/.htaccess` |
| `chatbot-api/` | `/home/zts5eyzr4hri/public_html/chatbot/backend/` |
| Passenger config (solo servidor) | `/home/zts5eyzr4hri/public_html/api/chat/.htaccess` |

- SPA: `https://relaticpanama.org/`
- API: `https://relaticpanama.org/api/chat`
- UI temporal del chatbot: `https://relaticpanama.org/chatbot/` (no se borra)

## 1) Configurar SSH desde esta Mac

```bash
# Generar llave (si no tienes una)
ssh-keygen -t ed25519 -C "relatic-deploy" -f ~/.ssh/relatic_godaddy

# Ver la clave pública para pegarla en cPanel
cat ~/.ssh/relatic_godaddy.pub
```

Prueba de conexión:

```bash
ssh -i ~/.ssh/relatic_godaddy -p 22 zts5eyzr4hri@50.63.3.2 'echo OK && pwd'
```

Si usas esa llave de forma fija, añade a `~/.ssh/config`:

```
Host relatic-godaddy
  HostName 50.63.3.2
  User zts5eyzr4hri
  Port 22
  IdentityFile ~/.ssh/relatic_godaddy
```

El script usa por defecto `zts5eyzr4hri@50.63.3.2`. Si configuras el `Host`
anterior, puedes sobreescribir:

```bash
SSH_HOST=relatic-godaddy SSH_USER=zts5eyzr4hri ./scripts/deploy.sh
```

## 2) Autorizar la llave en cPanel

1. Entra a cPanel → **SSH Access** / **Manage SSH Keys**.
2. **Import Key** (o sube la `.pub`).
3. Pulsa **Authorize** en la llave pública.
4. Confirma acceso: `ssh zts5eyzr4hri@50.63.3.2`.

Alternativa: pega el contenido de `*.pub` en `~/.ssh/authorized_keys` del usuario
de cPanel (vía File Manager o Terminal).

## 3) Variables de entorno del frontend (local)

Copia `.env.example` → `.env` y define:

```bash
VITE_API_BASE_URL=https://relaticpanama.org/api/chat
VITE_USERWAY_ACCOUNT_ID=tu_id
```

Para desarrollar contra un backend local:

```bash
VITE_API_BASE_URL=http://127.0.0.1:3000/api/chat
```

La API pública ya tiene DB y seeds; si local no tiene MySQL configurado, usa la
URL de producción para probar el widget.

## 4) Pruebas pre-deploy (obligatorias)

### API

```bash
curl -sS https://relaticpanama.org/api/chat/health

curl -sS -X POST https://relaticpanama.org/api/chat/lookup \
  -H 'Content-Type: application/json' \
  -d '{"nombre_completo":"Persona Inexistente XYZ 999"}'

curl -sS -X POST https://relaticpanama.org/api/chat/lookup \
  -H 'Content-Type: application/json' \
  -d '{"nombre_completo":"Ana Pérez Gómez","cedula":"8-123-456"}'
```

Esperado:

1. `status: ok`
2. `found: false`, `offer_register: true`
3. `found: true` y `documents[].download_url`

### Frontend local

```bash
cd /Users/israelsamuels/relaticV2
npm run dev
# Abrir http://localhost:5173 → botón amarillo abajo a la derecha
npm run build
```

### Dry-run del deploy

```bash
cd /Users/israelsamuels/relaticV2
chmod +x scripts/deploy.sh
DEPLOY_DRY_RUN=1 ./scripts/deploy.sh
```

## 5) Ejecutar deploy (solo con autorización)

```bash
cd /Users/israelsamuels/relaticV2
./scripts/deploy.sh
```

Solo frontend:

```bash
SKIP_BACKEND=1 ./scripts/deploy.sh
```

Solo backend + restart Passenger:

```bash
SKIP_FRONTEND=1 ./scripts/deploy.sh
```

## 6) Checklist post-deploy

- [ ] `https://relaticpanama.org/` carga la SPA nueva (hard refresh).
- [ ] El widget del chatbot abre a la derecha y completa lookup.
- [ ] Seed Ana Pérez Gómez muestra documentos y descarga funciona.
- [ ] `https://relaticpanama.org/api/chat/health` → `ok`.
- [ ] `https://relaticpanama.org/chatbot/` sigue accesible (no borrada).
- [ ] Moodle `_classroom`, `_blog`, `_journals`, `_books` intactos.
- [ ] `editorialecuador.org` y sitios hermanos intactos.
- [ ] No se sobrescribió `public_html/api/chat/.htaccess` (secretos Passenger).

## Qué NO se debe borrar en `public_html`

El script excluye (y con `--delete` **no** elimina) entre otros:

- `api/` — montaje Passenger del chatbot
- `chatbot/` — backend + UI temporal
- `PHP/`, `_blog/`, `_classroom/`, `_books/`, `_journals/`, `_posters/`
- `editorialecuador.org/`, `revistas.editorialecuador.org/`, `laboratorio.editorialecuador.org/`
- `dev/`, `mail/`, `cgi-bin/`, `.well-known/`

**Nunca** subas ni commits el `.htaccess` de Passenger con `DB_PASSWORD` /
`DOWNLOAD_TOKEN_SECRET`. Usa solo
`deploy/passenger-api/chat/.htaccess.example` como plantilla.

## Troubleshooting

| Síntoma | Qué revisar |
|---|---|
| 503 en `/api/chat` | `touch chatbot/backend/tmp/restart.txt`; logs Passenger en cPanel |
| CORS en local | `CORS_ORIGINS` en el `.htaccess` de Passenger debe incluir `http://localhost:5173` |
| SPA 404 en rutas | `.htaccess` raíz con rewrite a `index.html` y excepciones `api/` / `chatbot/` |
| Descarga 403 | Token expirado (~1h); vuelve a hacer lookup |
| rsync borra algo ajeno | Abortar; restaurar desde backup cPanel; ampliar `PROTECTED_EXCLUDES` en `deploy.sh` |
