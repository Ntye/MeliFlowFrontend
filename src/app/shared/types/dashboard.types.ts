export interface DashboardStats {
  total_ruches: number;
  total_ruchers: number;
  active_alerts: number;
  last_update: Date;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  location: string;
}
