import type {
  AdminAuditItem,
  AdminCarta,
  CartaCreateResponse,
  CartasListResponse,
  SessionResponse,
} from './types';
import {
  AdminApiError,
  NETWORK_MESSAGE,
  messageFromResponse,
  type AdminErrorContext,
} from './adminErrors';

export { AdminApiError } from './adminErrors';

function adminBaseUrl(): string {
  if (import.meta.env.DEV) {
    return '/api/chat';
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin.replace(/\/$/, '')}/api/chat`;
  }
  return '/api/chat';
}

async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new AdminApiError(NETWORK_MESSAGE, { status: 0, kind: 'network' });
  }
}

async function parseJson<T>(res: Response, context: AdminErrorContext): Promise<T> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const { message, kind } = messageFromResponse(res.status, data, context);
    throw new AdminApiError(message, { status: res.status, kind });
  }
  return data as T;
}

export async function adminLogin(username: string, password: string): Promise<SessionResponse> {
  const res = await adminFetch(`${adminBaseUrl()}/admin/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return parseJson<SessionResponse>(res, 'login');
}

export async function adminLogout(): Promise<void> {
  await adminFetch(`${adminBaseUrl()}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => undefined);
}

export async function adminSession(): Promise<SessionResponse> {
  const res = await adminFetch(`${adminBaseUrl()}/admin/session`, {
    credentials: 'include',
  });
  if (res.status === 401) {
    return { success: false, authenticated: false };
  }
  return parseJson<SessionResponse>(res, 'list');
}

export async function listCartas(
  q = '',
  opts?: { papelera?: boolean },
): Promise<CartasListResponse> {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (opts?.papelera) params.set('papelera', '1');
  const qs = params.toString();
  const res = await adminFetch(`${adminBaseUrl()}/admin/cartas${qs ? `?${qs}` : ''}`, {
    credentials: 'include',
  });
  return parseJson<CartasListResponse>(res, 'list');
}

export function cartaDownloadUrl(source: AdminCarta['source'] | string, documentId: number): string {
  return `${adminBaseUrl()}/admin/cartas/${encodeURIComponent(source)}/${documentId}/download`;
}

export async function fetchCartaPdfObjectUrl(
  source: AdminCarta['source'] | string,
  documentId: number,
): Promise<string> {
  const url = `${cartaDownloadUrl(source, documentId)}?inline=1`;
  const res = await adminFetch(url, {
    credentials: 'include',
  });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || type.includes('application/json')) {
    await parseJson(res, 'carta');
    throw new AdminApiError('No se pudo abrir el PDF.', { kind: 'generic' });
  }
  // URL autenticada (misma cookie). Un blob: deja el visor en gris en Chrome.
  return url;
}

export async function createCarta(form: FormData): Promise<CartaCreateResponse> {
  const res = await adminFetch(`${adminBaseUrl()}/admin/cartas`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  return parseJson<CartaCreateResponse>(res, 'carta');
}

export async function updateCarta(
  source: AdminCarta['source'] | string,
  documentId: number,
  form: FormData
): Promise<CartaCreateResponse> {
  const res = await adminFetch(
    `${adminBaseUrl()}/admin/cartas/${encodeURIComponent(source)}/${documentId}`,
    {
      method: 'PATCH',
      credentials: 'include',
      body: form,
    }
  );
  return parseJson<CartaCreateResponse>(res, 'carta');
}

export async function deleteCarta(
  source: AdminCarta['source'] | string,
  documentId: number
): Promise<{ success: boolean; message: string }> {
  const res = await adminFetch(
    `${adminBaseUrl()}/admin/cartas/${encodeURIComponent(source)}/${documentId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );
  return parseJson<{ success: boolean; message: string }>(res, 'carta');
}

export async function restoreCarta(
  source: AdminCarta['source'] | string,
  documentId: number,
): Promise<{ success: boolean; message: string }> {
  const res = await adminFetch(
    `${adminBaseUrl()}/admin/cartas/${encodeURIComponent(source)}/${documentId}/restaurar`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  return parseJson<{ success: boolean; message: string }>(res, 'carta');
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  const res = await adminFetch(`${adminBaseUrl()}/admin/password`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  return parseJson<{ success: boolean; message: string }>(res, 'carta');
}

export async function listActividad(): Promise<{ success: boolean; items: AdminAuditItem[] }> {
  const res = await adminFetch(`${adminBaseUrl()}/admin/actividad`, {
    credentials: 'include',
  });
  return parseJson<{ success: boolean; items: AdminAuditItem[] }>(res, 'list');
}
