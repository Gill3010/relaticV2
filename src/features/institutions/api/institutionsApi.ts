import { request } from '../../../lib/api-client';
import { DEFAULT_INSTITUTIONS } from '../data/institutionsData';
import type { Institution } from '../types';

export async function fetchInstitutions(): Promise<Institution[]> {
  try {
    const list = await request<Institution[]>('/institutions');
    return list && list.length > 0 ? list : DEFAULT_INSTITUTIONS;
  } catch {
    // Graceful fallback to static data if API endpoint does not exist or fails
    return DEFAULT_INSTITUTIONS;
  }
}
