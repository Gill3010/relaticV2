import { request } from '../../lib/api-client';
import type { ServiceItem } from '../../core/domain/ServiceItem';
import type { ServiceRepositoryPort } from '../../core/ports/secondary/ServiceRepositoryPort';
import { DEFAULT_SERVICES } from '../../features/services/data/servicesData';

export class HttpServiceRepositoryAdapter implements ServiceRepositoryPort {
  async getServices(): Promise<ServiceItem[]> {
    try {
      const list = await request<ServiceItem[]>('/services');
      return list && list.length > 0 ? list : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  }
}
