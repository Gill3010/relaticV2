import { container } from '../../../container/container';
import type { IdentityPayload, LookupResponse } from '../../../core/domain/Chatbot';

export function useChatbotAdapter() {
  const lookupIdentity = (payload: IdentityPayload): Promise<LookupResponse> => {
    return container.lookupChatbotUserUseCase.execute(payload);
  };

  return {
    lookupIdentity,
  };
}
