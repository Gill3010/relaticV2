import type { ServiceItem } from '../../domain/ServiceItem';

export interface GetServicesUseCasePort {
  execute(): Promise<ServiceItem[]>;
}
