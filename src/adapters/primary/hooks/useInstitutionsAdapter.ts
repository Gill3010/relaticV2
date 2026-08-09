import { useApi } from '../../../hooks/useApi';
import { container } from '../../../container/container';
import type { Institution } from '../../../core/domain/Institution';
import { DEFAULT_INSTITUTIONS } from '../../../features/institutions/data/institutionsData';

export function useInstitutionsAdapter() {
  const fetchInstitutionsFn = () => container.getInstitutionsUseCase.execute();

  const { data, loading, error, execute } = useApi<Institution[]>(fetchInstitutionsFn, {
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
