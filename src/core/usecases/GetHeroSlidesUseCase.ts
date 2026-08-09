import type { HeroSlide } from '../domain/HeroSlide';
import type { GetHeroSlidesUseCasePort } from '../ports/primary/GetHeroSlidesUseCasePort';
import type { HeroRepositoryPort } from '../ports/secondary/HeroRepositoryPort';

export class GetHeroSlidesUseCase implements GetHeroSlidesUseCasePort {
  private readonly heroRepository: HeroRepositoryPort;

  constructor(heroRepository: HeroRepositoryPort) {
    this.heroRepository = heroRepository;
  }

  async execute(): Promise<HeroSlide[]> {
    return this.heroRepository.getSlides();
  }
}
