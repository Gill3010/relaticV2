import { request } from '../../../lib/api-client';
import type {
  IdentityPayload,
  LookupResponse,
  RegisterResponse,
} from '../types';


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
