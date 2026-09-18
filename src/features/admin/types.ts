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
  deleted_at?: string | null;
  days_left?: number | null;
  has_file?: boolean;
};

export type AdminAuditItem = {
  id: number;
  username: string;
  action: string;
  source: string | null;
  document_id: number | null;
  nombre_completo: string | null;
  cedula: string | null;
  detail: string | null;
  created_at: string;
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
  papelera?: boolean;
  trash_days?: number;
  message?: string;
};

export type ActividadResponse = {
  success: boolean;
  items: AdminAuditItem[];
  message?: string;
};

export type CartaCreateResponse = {
  success: boolean;
  message: string;
  item?: AdminCarta;
};
