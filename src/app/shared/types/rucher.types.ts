import { GeoPoint } from './ruche.types';

// Matches: Table ruchers (apiaries) with PostGIS support
export interface Rucher {
  id: number;
  name: string;
  description?: string;
  geom: GeoPoint | GeoPolygon; // Can be Point or Polygon
  created_at: Date;
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}
