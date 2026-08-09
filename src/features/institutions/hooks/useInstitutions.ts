import { useApi } from '../../../hooks/useApi';
import { fetchInstitutions } from '../api/institutionsApi';
import { DEFAULT_INSTITUTIONS } from '../data/institutionsData';
import type { Institution } from '../types';

export function useInstitutions() {
  const { data, loading, error, execute } = useApi<Institution[]>(fetchInstitutions, {
    immediate: true,
    initialData: DEFAULT_INSTITUTIONS,
  });

  return {
    institutions: data || DEFAULT_INSTITUTIONS,
    loading,
    error,
    refetch: execute,
  };
}
