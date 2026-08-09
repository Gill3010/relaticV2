import { useState, useEffect, useCallback, useRef } from 'react';


interface UseApiOptions<T> {
  immediate?: boolean;
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFn: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> {
  const { immediate = false, initialData = null, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const apiFnRef = useRef(apiFn);
  apiFnRef.current = apiFn;

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFnRef.current(...args);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const normalizedError = err instanceof Error ? err : new Error(String(err));
        setError(normalizedError);
        onError?.(normalizedError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);



  return { data, loading, error, execute, reset };
}
