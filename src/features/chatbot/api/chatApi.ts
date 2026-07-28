import type {
  ChatApiError,
  IdentityPayload,
  LookupResponse,
  RegisterResponse,
} from '../types';

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || 'https://relaticpanama.org/api/chat'
).replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

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
    const error = new Error(message) as ChatApiError;
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

function buildIdentityBody({ nombre_completo, cedula }: IdentityPayload) {
  const body: IdentityPayload = {};
  if (nombre_completo && String(nombre_completo).trim()) {
    body.nombre_completo = String(nombre_completo).trim();
  }
  if (cedula && String(cedula).trim()) {
    body.cedula = String(cedula).trim();
  }
  return body;
}

export function lookupIdentity(payload: IdentityPayload) {
  return request<LookupResponse>('/lookup', {
    method: 'POST',
    body: JSON.stringify(buildIdentityBody(payload)),
  });
}

export function registerIdentity(payload: IdentityPayload) {
  return request<RegisterResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(buildIdentityBody(payload)),
  });
}
