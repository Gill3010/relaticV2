// Secondary Adapters (Driven Adapters)
import { HttpHeroRepositoryAdapter } from '../adapters/secondary/HttpHeroRepositoryAdapter';
import { HttpInstitutionRepositoryAdapter } from '../adapters/secondary/HttpInstitutionRepositoryAdapter';
import { HttpServiceRepositoryAdapter } from '../adapters/secondary/HttpServiceRepositoryAdapter';
import { HttpChatbotRepositoryAdapter } from '../adapters/secondary/HttpChatbotRepositoryAdapter';

// Primary Ports (Driving Ports)
import type { GetHeroSlidesUseCasePort } from '../core/ports/primary/GetHeroSlidesUseCasePort';
import type { GetInstitutionsUseCasePort } from '../core/ports/primary/GetInstitutionsUseCasePort';
import type { GetServicesUseCasePort } from '../core/ports/primary/GetServicesUseCasePort';
import type { LookupChatbotUserUseCasePort } from '../core/ports/primary/LookupChatbotUserUseCasePort';

// Use Cases
import { GetHeroSlidesUseCase } from '../core/usecases/GetHeroSlidesUseCase';
import { GetInstitutionsUseCase } from '../core/usecases/GetInstitutionsUseCase';
import { GetServicesUseCase } from '../core/usecases/GetServicesUseCase';
import { LookupChatbotUserUseCase } from '../core/usecases/LookupChatbotUserUseCase';

// Composition Root (Dependency Injection Container)
class Container {
  // Instantiating Secondary Adapters
  private heroRepository = new HttpHeroRepositoryAdapter();
  private institutionRepository = new HttpInstitutionRepositoryAdapter();
  private serviceRepository = new HttpServiceRepositoryAdapter();
  private chatbotRepository = new HttpChatbotRepositoryAdapter();

  // Instantiating Use Cases (Binding Ports & Adapters)
  public readonly getHeroSlidesUseCase: GetHeroSlidesUseCasePort = new GetHeroSlidesUseCase(
    this.heroRepository
  );

  public readonly getInstitutionsUseCase: GetInstitutionsUseCasePort = new GetInstitutionsUseCase(
    this.institutionRepository
  );

  public readonly getServicesUseCase: GetServicesUseCasePort = new GetServicesUseCase(
    this.serviceRepository
  );

  public readonly lookupChatbotUserUseCase: LookupChatbotUserUseCasePort = new LookupChatbotUserUseCase(
    this.chatbotRepository
  );
}

export const container = new Container();
