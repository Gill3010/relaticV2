import { request } from '../../lib/api-client';
import type { Institution } from '../../core/domain/Institution';
import type { InstitutionRepositoryPort } from '../../core/ports/secondary/InstitutionRepositoryPort';
import { DEFAULT_INSTITUTIONS } from '../../features/institutions/data/institutionsData';

export class HttpInstitutionRepositoryAdapter implements InstitutionRepositoryPort {
  async getInstitutions(): Promise<Institution[]> {
    try {
      const list = await request<Institution[]>('/institutions');
      return list && list.length > 0 ? list : DEFAULT_INSTITUTIONS;
    } catch {
      return DEFAULT_INSTITUTIONS;
    }
  }
}
