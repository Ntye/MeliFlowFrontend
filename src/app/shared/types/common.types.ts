// Common types for the MeliFlow application

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

export interface StatsData {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}

// Database Schema Types

export interface Rucher {
  id: string;
  name: string;
  location: {
    type: 'Polygon';
    coordinates: number[][][]; // Polygon coordinates
  };
  address?: string;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ruche {
  id: string;
  name: string;
  rucherId: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  status: 'active' | 'alert' | 'offline';
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: Date;
  createdAt: Date;
}

export interface Measurement {
  id: string;
  rucheId: string;
  timestamp: Date;
  weight: number;
  temperature: number;
  humidity: number;
  signal: number;
}

export interface AlertRule {
  id: string;
  name: string;
  rucheId?: string; // undefined means global rule
  type: 'weight_min' | 'weight_variation' | 'temperature_high' | 'temperature_low' | 'humidity_high' | 'humidity_low';
  threshold: number;
  enabled: boolean;
  notificationChannels: ('in_app' | 'whatsapp')[];
  whatsappNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  alertRuleId: string;
  rucheId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  resolved: boolean;
  triggeredAt: Date;
  resolvedAt?: Date;
}

// Legacy/UI Types (for backward compatibility)

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

// Chart and Table Types

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

// Computed/Aggregated Types

export interface RucheWithStats extends Ruche {
  currentWeight?: number;
  currentTemperature?: number;
  currentHumidity?: number;
  dailyGain?: number;
  weeklyGain?: number;
  totalGain?: number;
  fillingPercentage?: number;
}

export interface RucherWithStats extends Rucher {
  ruchesCount: number;
  activeRuchesCount: number;
  totalWeight: number;
  averageWeight: number;
  weeklyGain: number;
  status: 'healthy' | 'warning' | 'critical';
}
