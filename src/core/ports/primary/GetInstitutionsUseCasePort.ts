import type { Institution } from '../../domain/Institution';

export interface GetInstitutionsUseCasePort {
  execute(): Promise<Institution[]>;
}
