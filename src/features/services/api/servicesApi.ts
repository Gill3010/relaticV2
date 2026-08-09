import { request } from '../../../lib/api-client';
import { DEFAULT_SERVICES } from '../data/servicesData';
import type { ServiceItem } from '../types';

export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const list = await request<ServiceItem[]>('/services');
    return list && list.length > 0 ? list : DEFAULT_SERVICES;
  } catch {
    // Graceful fallback to static data if API endpoint does not exist or fails
    return DEFAULT_SERVICES;
  }
}
