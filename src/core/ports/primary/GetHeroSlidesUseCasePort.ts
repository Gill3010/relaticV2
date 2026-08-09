import type { HeroSlide } from '../../domain/HeroSlide';

export interface GetHeroSlidesUseCasePort {
  execute(): Promise<HeroSlide[]>;
}
