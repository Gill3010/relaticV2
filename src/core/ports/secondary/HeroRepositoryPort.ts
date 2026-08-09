import type { HeroSlide } from '../../domain/HeroSlide';

export interface HeroRepositoryPort {
  getSlides(): Promise<HeroSlide[]>;
}
