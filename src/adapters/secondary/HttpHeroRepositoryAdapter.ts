import { request } from '../../lib/api-client';
import type { HeroSlide } from '../../core/domain/HeroSlide';
import type { HeroRepositoryPort } from '../../core/ports/secondary/HeroRepositoryPort';
import { DEFAULT_HERO_SLIDES } from '../../features/hero/data/heroSlides';

export class HttpHeroRepositoryAdapter implements HeroRepositoryPort {
  async getSlides(): Promise<HeroSlide[]> {
    try {
      const slides = await request<HeroSlide[]>('/slides');
      return slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
    } catch {
      return DEFAULT_HERO_SLIDES;
    }
  }
}
