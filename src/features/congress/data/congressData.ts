import type { CongressEvent } from '../../../core/domain/CongressEvent';


export const RELATIC_CONGRESS_2026: CongressEvent = {
  name: 'Congreso RELATIC',
  edition: 'IV',
  startDate: new Date('2026-10-07T09:00:00-06:00'), // Yucatán = CST (UTC-6)
  endDate: new Date('2026-10-09T18:00:00-06:00'),
  venue: 'ITSVA',
  location: 'Valladolid, Yucatán',
  modality: 'Presencial y Virtual',
};
