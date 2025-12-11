// Matches: Table measurements (time series)
export interface Measurement {
  id: number;
  ruche_id: number;
  recorded_at: Date;
  weight: number;
  temperature: number;
  humidity: number;
  signal: number;
  raw?: Record<string, any>; // JSONB optional
}
