import { useCallback } from 'react';
import { useApi } from '../../../hooks/useApi';
import { container } from '../../../container/container';
import type { ServiceItem } from '../../../core/domain/ServiceItem';
import { DEFAULT_SERVICES } from '../../../features/services/data/servicesData';

export function useServicesAdapter() {
  const fetchServicesFn = useCallback(() => container.getServicesUseCase.execute(), []);

  const { data, loading, error, execute } = useApi<ServiceItem[]>(fetchServicesFn, {

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
