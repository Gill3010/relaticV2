import type {
  AdminCarta,
  CartaCreateResponse,
  CartasListResponse,
  SessionResponse,
} from './types';

function adminBaseUrl(): string {
  if (import.meta.env.DEV) {
    return '/api/chat';
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin.replace(/\/$/, '')}/api/chat`;
  }
  return '/api/chat';
}

export class AdminApiError extends Error {
  status?: number;
}

async function parseJson<T>(res: Response): Promise<T> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : `Error HTTP ${res.status}`;
    const error = new AdminApiError(message);
    error.status = res.status;
    throw error;
  }
  return data as T;
}

export async function adminLogin(username: string, password: string): Promise<SessionResponse> {
  const res = await fetch(`${adminBaseUrl()}/admin/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return parseJson<SessionResponse>(res);
}

export async function adminLogout(): Promise<void> {
  await fetch(`${adminBaseUrl()}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function adminSession(): Promise<SessionResponse> {
  const res = await fetch(`${adminBaseUrl()}/admin/session`, {
    credentials: 'include',
  });
  if (res.status === 401) {
    return { success: false, authenticated: false };
  }
  return parseJson<SessionResponse>(res);
}

export async function listCartas(q = '', nivel = ''): Promise<CartasListResponse> {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (nivel) params.set('nivel', nivel);
  const qs = params.toString();
  const res = await fetch(`${adminBaseUrl()}/admin/cartas${qs ? `?${qs}` : ''}`, {
    credentials: 'include',
  });
  return parseJson<CartasListResponse>(res);
}

export function cartaDownloadUrl(source: AdminCarta['source'] | string, documentId: number): string {
  return `${adminBaseUrl()}/admin/cartas/${encodeURIComponent(source)}/${documentId}/download`;
}

export async function createCarta(form: FormData): Promise<CartaCreateResponse> {
  const res = await fetch(`${adminBaseUrl()}/admin/cartas`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  return parseJson<CartaCreateResponse>(res);
}
