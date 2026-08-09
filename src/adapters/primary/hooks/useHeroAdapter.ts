import { useCallback } from 'react';
import { useApi } from '../../../hooks/useApi';
import { container } from '../../../container/container';
import type { HeroSlide } from '../../../core/domain/HeroSlide';
import { DEFAULT_HERO_SLIDES } from '../../../features/hero/data/heroSlides';

export function useHeroAdapter() {
  const fetchSlidesFn = useCallback(() => container.getHeroSlidesUseCase.execute(), []);

  const { data, loading, error, execute } = useApi<HeroSlide[]>(fetchSlidesFn, {

    immediate: true,
    initialData: DEFAULT_HERO_SLIDES,
  });

  return {
    slides: data || DEFAULT_HERO_SLIDES,
    loading,
    error,
    refetch: execute,
  };
}
