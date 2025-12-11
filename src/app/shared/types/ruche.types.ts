// Matches: Table ruches (hives) with PostGIS support
export interface Ruche {
  id: number;
  name: string;
  rucher_id: number;
  queen_info?: string;
  created_at: Date;
  geom: GeoPoint; // GEOMETRY(Point, 4326)
  active: boolean;
  // Computed fields for frontend
  current_weight?: number;
  battery_level?: number;
  signal_quality?: number;
  last_measurement?: Date;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}
