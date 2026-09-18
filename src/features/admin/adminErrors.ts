export const SESSION_EXPIRED_MESSAGE = 'Tu sesión expiró. Vuelve a entrar.';
export const INACTIVITY_MESSAGE =
  'Por seguridad, cerramos la sesión por inactividad. Vuelve a entrar.';
export const CARTA_GONE_MESSAGE = 'Esta carta ya no está. Actualizamos el listado.';
export const PDF_INVALID_MESSAGE = 'Este archivo no es un PDF. Elige el de la carta.';
export const PDF_TOO_LARGE_MESSAGE = 'El PDF no puede superar 10 MB.';
export const PDF_OFFICE_MESSAGE = 'Este archivo parece Word u Office. Elige el PDF de la carta.';
export const PDF_IMAGE_MESSAGE = 'Este archivo es una imagen. Elige el PDF de la carta.';
export const NETWORK_MESSAGE = 'No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.';
export const GENERIC_ERROR_MESSAGE = 'No se pudo completar. Inténtalo de nuevo.';

export type AdminErrorKind = 'session' | 'gone' | 'network' | 'generic';
export type AdminErrorContext = 'login' | 'list' | 'carta';

export class AdminApiError extends Error {
  status?: number;
  kind: AdminErrorKind;

  constructor(message: string, options?: { status?: number; kind?: AdminErrorKind }) {
    super(message);
    this.name = 'AdminApiError';
    this.status = options?.status;
    this.kind = options?.kind || 'generic';
  }
}

function serverMessage(data: unknown): string | null {
  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string'
  ) {
    const text = (data as { message: string }).message.trim();
    return text || null;
  }
  return null;
}

function rewriteServerMessage(message: string): { message: string; kind: AdminErrorKind } | null {
  if (/documento no encontrado/i.test(message)) {
    return { message: CARTA_GONE_MESSAGE, kind: 'gone' };
  }
  if (/pdf válido|solo se permiten archivos pdf/i.test(message)) {
    return { message: PDF_INVALID_MESSAGE, kind: 'generic' };
  }
  if (/no puede superar 10 mb|file too large|limit_file_size/i.test(message)) {
    return { message: PDF_TOO_LARGE_MESSAGE, kind: 'generic' };
  }
  return null;
}

export function messageFromResponse(
  status: number,
  data: unknown,
  context: AdminErrorContext,
): { message: string; kind: AdminErrorKind } {
  const fromServer = serverMessage(data);

  if (status === 401 && context === 'login') {
    return { message: fromServer || 'Usuario o clave incorrectos.', kind: 'generic' };
  }
  if (status === 401) {
    return { message: SESSION_EXPIRED_MESSAGE, kind: 'session' };
  }

  if (fromServer) {
    return rewriteServerMessage(fromServer) || { message: fromServer, kind: 'generic' };
  }

  if (status === 404) {
    if (context === 'carta') return { message: CARTA_GONE_MESSAGE, kind: 'gone' };
    if (context === 'list') {
      return { message: 'No se pudo cargar el listado. Inténtalo de nuevo.', kind: 'generic' };
    }
  }
  if (status === 413) return { message: PDF_TOO_LARGE_MESSAGE, kind: 'generic' };
  if (status === 429) {
    return { message: 'Demasiados intentos. Espera unos minutos.', kind: 'generic' };
  }
  if (status >= 500) return { message: GENERIC_ERROR_MESSAGE, kind: 'generic' };

  return { message: GENERIC_ERROR_MESSAGE, kind: 'generic' };
}

export function isSessionError(err: unknown): boolean {
  return err instanceof AdminApiError && err.kind === 'session';
}

export function isCartaGoneError(err: unknown): boolean {
  return err instanceof AdminApiError && err.kind === 'gone';
}

export function adminErrorMessage(err: unknown, fallback = GENERIC_ERROR_MESSAGE): string {
  if (err instanceof AdminApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
