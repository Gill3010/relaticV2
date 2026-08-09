import type { IdentityPayload, LookupResponse } from '../../domain/Chatbot';

export interface LookupChatbotUserUseCasePort {
  execute(payload: IdentityPayload): Promise<LookupResponse>;
}
