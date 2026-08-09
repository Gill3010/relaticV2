import type { Institution } from '../domain/Institution';
import type { GetInstitutionsUseCasePort } from '../ports/primary/GetInstitutionsUseCasePort';
import type { InstitutionRepositoryPort } from '../ports/secondary/InstitutionRepositoryPort';

export class GetInstitutionsUseCase implements GetInstitutionsUseCasePort {
  private readonly institutionRepository: InstitutionRepositoryPort;

  constructor(institutionRepository: InstitutionRepositoryPort) {
    this.institutionRepository = institutionRepository;
  }

  async execute(): Promise<Institution[]> {
    return this.institutionRepository.getInstitutions();
  }
}
