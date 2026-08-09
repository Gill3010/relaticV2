import type { ServiceItem } from '../../domain/ServiceItem';

export interface ServiceRepositoryPort {
  getServices(): Promise<ServiceItem[]>;
}
