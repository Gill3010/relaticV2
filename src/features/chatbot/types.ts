export type IdentityPayload = {
  nombre_completo?: string;
  cedula?: string;
};

export type ChatUser = {
  id: number;
  nombre_completo: string;
  cedula: string | null;
};

export type ChatDocument = {
  id: number;
  tipo: string;
  titulo: string;
  fecha: string;
  download_url?: string | null;
  external_url?: string | null;
};

export type LookupResponse = {
  success: boolean;
  found: boolean;
  match?: string;
  message?: string;
  note?: string;
  user?: ChatUser | null;
  documents: ChatDocument[];
  offer_register: boolean;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user: ChatUser;
};

export type ChatApiError = Error & {
  status?: number;
  data?: unknown;
};

export type ChatStep = 'identity' | 'result';
