import type { Institution } from '../../domain/Institution';

export interface InstitutionRepositoryPort {
  getInstitutions(): Promise<Institution[]>;
}
