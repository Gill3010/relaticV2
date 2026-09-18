export type AdminUser = {
  id: number;
  username: string;
};

export type AdminCarta = {
  source: 'doctorado' | 'maestria';
  user_id: number;
  document_id: number;
  nombre_completo: string;
  cedula: string | null;
  tipo: string;
  titulo: string;
  fecha: string | null;
  created_at?: string;
  has_file?: boolean;
};

export type SessionResponse = {
  success: boolean;
  authenticated?: boolean;
  user?: AdminUser;
  message?: string;
};

export type CartasListResponse = {
  success: boolean;
  items: AdminCarta[];
  total?: number;
  message?: string;
};

export type CartaCreateResponse = {
  success: boolean;
  message: string;
  item?: AdminCarta;
};
