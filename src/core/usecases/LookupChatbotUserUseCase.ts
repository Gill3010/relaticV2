import type { IdentityPayload, LookupResponse } from '../domain/Chatbot';
import type { LookupChatbotUserUseCasePort } from '../ports/primary/LookupChatbotUserUseCasePort';
import type { ChatbotRepositoryPort } from '../ports/secondary/ChatbotRepositoryPort';

export class LookupChatbotUserUseCase implements LookupChatbotUserUseCasePort {
  private readonly chatbotRepository: ChatbotRepositoryPort;

  constructor(chatbotRepository: ChatbotRepositoryPort) {
    this.chatbotRepository = chatbotRepository;
  }

  async execute(payload: IdentityPayload): Promise<LookupResponse> {
    return this.chatbotRepository.lookup(payload);
  }
}
