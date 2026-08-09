export interface CongressEvent {
  name: string;
  edition: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  location: string;
  modality: string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
