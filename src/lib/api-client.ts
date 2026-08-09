export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

const DEFAULT_API_BASE = (
  import.meta.env.VITE_API_BASE_URL || 'https://relaticpanama.org/api/chat'
).replace(/\/$/, '');

export async function request<T>(
  path: string,
  options: RequestInit = {},
  baseUrl: string = DEFAULT_API_BASE
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
