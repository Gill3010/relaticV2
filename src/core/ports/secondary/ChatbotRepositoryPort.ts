import type { IdentityPayload, LookupResponse } from '../../domain/Chatbot';

export interface ChatbotRepositoryPort {
  lookup(payload: IdentityPayload): Promise<LookupResponse>;
}
