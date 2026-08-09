export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.PROD) {
    if (!envUrl || envUrl.includes('127.0.0.1') || envUrl.includes('localhost')) {
      if (typeof window !== 'undefined' && window.location?.origin) {
        return `${window.location.origin.replace(/\/$/, '')}/api/chat`;
      }
      return 'https://relaticpanama.org/api/chat';
    }
  }
  return (envUrl || 'https://relaticpanama.org/api/chat').replace(/\/$/, '');
}


export async function request<T>(
  path: string,
  options: RequestInit = {},
  baseUrl: string = getApiBaseUrl()
): Promise<T> {

  const url = path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
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
    const error = new Error(message) as ApiError;
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
