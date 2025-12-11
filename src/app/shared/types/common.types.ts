// Common types for the MeliFlow application

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface MenuItem {
  label: string;
  route: string;
  active?: boolean;
}

export interface StatsData {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}

export interface HiveData {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  weight: number;
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: Date;
  temperature?: number;
  humidity?: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ApiaryData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  hivesCount: number;
  activeHives: number;
  totalWeight: number;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdate: Date;
}

export interface AlertConfig {
  id: string;
  type: 'weight' | 'temperature' | 'humidity' | 'battery' | 'signal';
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  enabled: boolean;
  message?: string;
}

export interface ChartDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}
