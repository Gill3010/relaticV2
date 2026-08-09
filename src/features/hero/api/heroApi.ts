import { request } from '../../../lib/api-client';
import { DEFAULT_HERO_SLIDES } from '../data/heroSlides';
import type { HeroSlide } from '../types';

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const slides = await request<HeroSlide[]>('/slides');
    return slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  } catch {
    // Graceful fallback to static data if API endpoint does not exist or fails
    return DEFAULT_HERO_SLIDES;
  }
}
