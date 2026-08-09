export interface IdentityPayload {
  nombre_completo?: string;
  cedula?: string;
}

export interface ChatUser {
  id: number;
  nombre_completo: string;
  cedula: string | null;
  source?: 'doctorado' | 'maestria';
}

export interface ChatDocument {
  id: number;
  source?: 'doctorado' | 'maestria';
  tipo: string;
  titulo: string;
  fecha: string;
  download_url?: string | null;
  external_url?: string | null;
}

export interface LookupResponse {
  success: boolean;
  found: boolean;
  match?: string;
  message?: string;
  note?: string;
  user?: ChatUser | null;
  documents: ChatDocument[];
  offer_register: boolean;
}
