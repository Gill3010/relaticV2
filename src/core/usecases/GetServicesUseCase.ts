import type { ServiceItem } from '../domain/ServiceItem';
import type { GetServicesUseCasePort } from '../ports/primary/GetServicesUseCasePort';
import type { ServiceRepositoryPort } from '../ports/secondary/ServiceRepositoryPort';

export class GetServicesUseCase implements GetServicesUseCasePort {
  private readonly serviceRepository: ServiceRepositoryPort;

  constructor(serviceRepository: ServiceRepositoryPort) {
    this.serviceRepository = serviceRepository;
  }

  async execute(): Promise<ServiceItem[]> {
    return this.serviceRepository.getServices();
  }
}
