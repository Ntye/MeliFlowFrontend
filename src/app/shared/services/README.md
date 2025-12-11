# Mock Data Services

This directory contains comprehensive mock data services for the MeliFlow frontend that match the PostGIS-enabled database schema.

## Overview

The mock data services provide realistic sample data for development and testing before backend integration. All services return Observables for async operations and include realistic delays to simulate network requests.

## Services

### MockDataService
Master service that generates and manages all mock data including:
- **3 Apiaries** (Ruchers) with different geographic locations
- **12 Hives** (Ruches) distributed across the apiaries
- **100+ Measurements** per hive over 30 days with realistic patterns
- **Alert Rules** with various configurations
- **Triggered Alerts** with sample data

### RuchesService
Provides hive operations:
```typescript
getRuches(): Observable<Ruche[]>
getRuche(id: number): Observable<Ruche | undefined>
getRuchesByRucher(rucher_id: number): Observable<Ruche[]>
createRuche(ruche: Ruche): Observable<Ruche>
updateRuche(id: number, ruche: Partial<Ruche>): Observable<Ruche | undefined>
```

### RuchersService
Provides apiary operations:
```typescript
getRuchers(): Observable<Rucher[]>
getRucher(id: number): Observable<Rucher | undefined>
createRucher(rucher: Rucher): Observable<Rucher>
updateRucher(id: number, rucher: Partial<Rucher>): Observable<Rucher | undefined>
```

### MeasurementsService
Provides time series data operations:
```typescript
getMeasurements(ruche_id: number, limit?: number): Observable<Measurement[]>
getMeasurementsByTimeRange(ruche_id: number, startDate: Date, endDate: Date): Observable<Measurement[]>
getLatestMeasurement(ruche_id: number): Observable<Measurement | undefined>
getAggregatedMetrics(ruche_id: number, period: 'daily' | 'weekly' | 'monthly'): Observable<any>
```

### AlertsService
Provides alert rule management:
```typescript
getAlertRules(): Observable<AlertRule[]>
getTriggeredAlerts(limit?: number): Observable<TriggeredAlert[]>
createAlertRule(rule: AlertRule): Observable<AlertRule>
updateAlertRule(id: number, rule: Partial<AlertRule>): Observable<AlertRule | undefined>
deleteAlertRule(id: number): Observable<void>
testAlert(rule_id: number): Observable<any>
```

### WeatherService
Provides weather data:
```typescript
getWeather(latitude: number, longitude: number): Observable<WeatherData>
getWeatherByRucher(rucher_id: number): Observable<WeatherData>
```

## Usage Example

```typescript
import { Component, OnInit } from '@angular/core';
import { RuchesService } from './shared/services/ruches.service';
import { MeasurementsService } from './shared/services/measurements.service';

@Component({
  selector: 'app-my-component',
  template: `...`
})
export class MyComponent implements OnInit {
  constructor(
    private ruchesService: RuchesService,
    private measurementsService: MeasurementsService
  ) {}

  ngOnInit() {
    // Get all hives
    this.ruchesService.getRuches().subscribe(ruches => {
      console.log('All hives:', ruches);
    });

    // Get latest measurement for hive 1
    this.measurementsService.getLatestMeasurement(1).subscribe(measurement => {
      console.log('Latest measurement:', measurement);
    });

    // Get aggregated metrics for hive 1
    this.measurementsService.getAggregatedMetrics(1, 'weekly').subscribe(metrics => {
      console.log('Weekly metrics:', metrics);
    });
  }
}
```

## Data Characteristics

### Realistic Patterns
- **Weight**: Gradual increase with daily fluctuations (bees collecting nectar)
- **Temperature**: Daily cycles (cooler at night, warmer during day: 28-36°C)
- **Humidity**: Inverse correlation with temperature (50-80%)
- **Signal**: Random variations (0-100%)
- **Measurements**: One measurement every 6 hours per active hive

### Geographic Data
All locations use GeoJSON format (WGS84, EPSG:4326):
- **Point**: `{ type: 'Point', coordinates: [longitude, latitude] }`
- **Polygon**: `{ type: 'Polygon', coordinates: [[[lng, lat], ...]] }`

### Sample Locations
- **Paris area**: ~48.8566°N, 2.3522°E
- **Lyon area**: ~45.7640°N, 4.8357°E
- **Toulouse area**: ~43.6047°N, 1.4442°E

## Testing

All services have comprehensive unit tests. Run tests with:
```bash
npm test
```

## Transition to Real API

To transition to a real backend API:

1. Replace Observable returns with HttpClient calls
2. Update service methods to use real API endpoints
3. Add error handling for HTTP errors
4. Keep the same interface so components don't need changes

Example:
```typescript
// Mock version
getRuches(): Observable<Ruche[]> {
  return of(this.mockDataService.getRuches()).pipe(delay(200));
}

// Real API version
getRuches(): Observable<Ruche[]> {
  return this.http.get<Ruche[]>(`${this.apiUrl}/ruches`);
}
```
