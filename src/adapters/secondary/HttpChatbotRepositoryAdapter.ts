import { request } from '../../lib/api-client';
import type { IdentityPayload, LookupResponse } from '../../core/domain/Chatbot';
import type { ChatbotRepositoryPort } from '../../core/ports/secondary/ChatbotRepositoryPort';

export class HttpChatbotRepositoryAdapter implements ChatbotRepositoryPort {
  async lookup(payload: IdentityPayload): Promise<LookupResponse> {
    const body: IdentityPayload = {};
    if (payload.nombre_completo && String(payload.nombre_completo).trim()) {
      body.nombre_completo = String(payload.nombre_completo).trim();
    }
    if (payload.cedula && String(payload.cedula).trim()) {
      body.cedula = String(payload.cedula).trim();
    }

    return request<LookupResponse>('/lookup', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}
