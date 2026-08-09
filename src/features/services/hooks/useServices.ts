import { useApi } from '../../../hooks/useApi';
import { fetchServices } from '../api/servicesApi';
import { DEFAULT_SERVICES } from '../data/servicesData';
import type { ServiceItem } from '../types';

export function useServices() {
  const { data, loading, error, execute } = useApi<ServiceItem[]>(fetchServices, {
    immediate: true,
    initialData: DEFAULT_SERVICES,
  });

  return {
    services: data || DEFAULT_SERVICES,
    loading,
    error,
    refetch: execute,
  };
}
