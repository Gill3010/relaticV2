import { useApi } from '../../../hooks/useApi';
import { fetchHeroSlides } from '../api/heroApi';
import { DEFAULT_HERO_SLIDES } from '../data/heroSlides';
import type { HeroSlide } from '../types';

export function useHeroSlides() {
  const { data, loading, error, execute } = useApi<HeroSlide[]>(fetchHeroSlides, {
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
