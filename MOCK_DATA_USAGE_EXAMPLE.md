# Mock Data Services - Usage Examples

This document demonstrates how to use the newly implemented mock data services in the MeliFlow frontend.

## Quick Start

All services are provided at the root level and can be injected into any component:

```typescript
import { Component, OnInit } from '@angular/core';
import { RuchesService } from './shared/services/ruches.service';
import { RuchersService } from './shared/services/ruchers.service';
import { MeasurementsService } from './shared/services/measurements.service';
import { AlertsService } from './shared/services/alerts.service';
import { WeatherService } from './shared/services/weather.service';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent implements OnInit {
  constructor(
    private ruchesService: RuchesService,
    private ruchersService: RuchersService,
    private measurementsService: MeasurementsService,
    private alertsService: AlertsService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Examples below...
  }
}
```

## Example 1: Display All Hives

```typescript
// Get all hives with their current status
this.ruchesService.getRuches().subscribe(ruches => {
  console.log(`Found ${ruches.length} hives`);
  
  ruches.forEach(ruche => {
    console.log(`
      Hive: ${ruche.name}
      Weight: ${ruche.current_weight?.toFixed(2)} kg
      Battery: ${ruche.battery_level}%
      Signal: ${ruche.signal_quality?.toFixed(0)}%
      Location: [${ruche.geom.coordinates[1]}, ${ruche.geom.coordinates[0]}]
      Active: ${ruche.active}
    `);
  });
});
```

## Example 2: Display Apiaries with Hive Count

```typescript
// Get all apiaries and their hives
this.ruchersService.getRuchers().subscribe(ruchers => {
  ruchers.forEach(rucher => {
    console.log(`\nApiary: ${rucher.name}`);
    console.log(`Description: ${rucher.description}`);
    console.log(`Location Type: ${rucher.geom.type}`);
    
    // Get hives for this apiary
    this.ruchesService.getRuchesByRucher(rucher.id).subscribe(hives => {
      console.log(`Number of hives: ${hives.length}`);
      console.log(`Active hives: ${hives.filter(h => h.active).length}`);
    });
  });
});
```

## Example 3: View Recent Measurements for a Hive

```typescript
// Get last 10 measurements for hive 1
this.measurementsService.getMeasurements(1, 10).subscribe(measurements => {
  console.log(`\nRecent measurements for Hive 1:`);
  
  measurements.forEach(m => {
    console.log(`
      Time: ${m.recorded_at.toLocaleString()}
      Weight: ${m.weight} kg
      Temperature: ${m.temperature}°C
      Humidity: ${m.humidity}%
      Signal: ${m.signal}%
    `);
  });
});
```

## Example 4: Get Daily Statistics

```typescript
// Get aggregated metrics for the last day
this.measurementsService.getAggregatedMetrics(1, 'daily').subscribe(metrics => {
  console.log(`\nDaily Statistics for Hive 1:`);
  console.log(`Number of readings: ${metrics.count}`);
  console.log(`Average weight: ${metrics.avgWeight} kg`);
  console.log(`Average temperature: ${metrics.avgTemperature}°C`);
  console.log(`Average humidity: ${metrics.avgHumidity}%`);
  console.log(`Weight range: ${metrics.minWeight} - ${metrics.maxWeight} kg`);
  console.log(`Temperature range: ${metrics.minTemperature} - ${metrics.maxTemperature}°C`);
});
```

## Example 5: Monitor Active Alerts

```typescript
// Get all alert rules
this.alertsService.getAlertRules().subscribe(rules => {
  console.log(`\nTotal alert rules: ${rules.length}`);
  console.log(`Active rules: ${rules.filter(r => r.active).length}`);
  
  rules.forEach(rule => {
    console.log(`
      Type: ${rule.rule_type}
      Target: ${rule.ruche_id ? `Hive ${rule.ruche_id}` : 'All hives'}
      Threshold: ${rule.params.threshold || rule.params.variation_percentage}
      Notifications: ${rule.notify_in_app ? 'App' : ''} ${rule.notify_whatsapp ? 'WhatsApp' : ''}
      Status: ${rule.active ? 'Active' : 'Inactive'}
    `);
  });
});

// Get recent triggered alerts
this.alertsService.getTriggeredAlerts(5).subscribe(alerts => {
  console.log(`\nRecent triggered alerts: ${alerts.length}`);
  
  alerts.forEach(alert => {
    console.log(`
      Hive: ${alert.ruche_id}
      Triggered: ${alert.triggered_at.toLocaleString()}
      Message: ${alert.payload.message}
      WhatsApp sent: ${alert.sent_whatsapp}
    `);
  });
});
```

## Example 6: Get Weather Data

```typescript
// Get weather for a specific location
this.weatherService.getWeather(48.8566, 2.3522).subscribe(weather => {
  console.log(`\nWeather in ${weather.location}:`);
  console.log(`Temperature: ${weather.temperature.toFixed(1)}°C`);
  console.log(`Humidity: ${weather.humidity.toFixed(0)}%`);
  console.log(`Condition: ${weather.condition}`);
});

// Get weather for an apiary
this.weatherService.getWeatherByRucher(1).subscribe(weather => {
  console.log(`\nWeather at apiary:`);
  console.log(`Location: ${weather.location}`);
  console.log(`Temperature: ${weather.temperature.toFixed(1)}°C`);
  console.log(`Humidity: ${weather.humidity.toFixed(0)}%`);
  console.log(`Condition: ${weather.condition}`);
});
```

## Example 7: Create New Alert Rule

```typescript
// Create a new alert rule
const newRule = {
  id: 0, // Will be auto-generated
  ruche_id: 1,
  rule_type: 'temperature' as const,
  params: {
    threshold: 40,
    duration: 2
  },
  notify_in_app: true,
  notify_whatsapp: false,
  active: true
};

this.alertsService.createAlertRule(newRule).subscribe(created => {
  console.log(`Created alert rule with ID: ${created.id}`);
});
```

## Example 8: Update Hive Information

```typescript
// Update a hive's information
this.ruchesService.updateRuche(1, {
  queen_info: 'Queen marked 2024',
  active: true
}).subscribe(updated => {
  if (updated) {
    console.log(`Updated hive: ${updated.name}`);
    console.log(`New queen info: ${updated.queen_info}`);
  }
});
```

## Example 9: Time Range Query

```typescript
// Get measurements from the last 7 days
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);

this.measurementsService.getMeasurementsByTimeRange(1, startDate, endDate)
  .subscribe(measurements => {
    console.log(`\nMeasurements from last 7 days: ${measurements.length}`);
    
    // Calculate average weight over the period
    const avgWeight = measurements.reduce((sum, m) => sum + m.weight, 0) / measurements.length;
    console.log(`Average weight: ${avgWeight.toFixed(2)} kg`);
  });
```

## Example 10: Dashboard Overview

```typescript
// Get complete overview for dashboard
async loadDashboard() {
  // Get all data in parallel
  const [ruchers, ruches, alertRules, triggeredAlerts] = await Promise.all([
    firstValueFrom(this.ruchersService.getRuchers()),
    firstValueFrom(this.ruchesService.getRuches()),
    firstValueFrom(this.alertsService.getAlertRules()),
    firstValueFrom(this.alertsService.getTriggeredAlerts(10))
  ]);

  console.log(`\n=== Dashboard Overview ===`);
  console.log(`Total apiaries: ${ruchers.length}`);
  console.log(`Total hives: ${ruches.length}`);
  console.log(`Active hives: ${ruches.filter(r => r.active).length}`);
  console.log(`Alert rules: ${alertRules.length}`);
  console.log(`Recent alerts: ${triggeredAlerts.length}`);
  
  // Calculate total weight
  const totalWeight = ruches
    .filter(r => r.current_weight)
    .reduce((sum, r) => sum + (r.current_weight || 0), 0);
  console.log(`Total weight: ${totalWeight.toFixed(2)} kg`);
}
```

## Data Structure Reference

### Ruche (Hive)
```typescript
{
  id: number;
  name: string;
  rucher_id: number;
  queen_info?: string;
  created_at: Date;
  geom: { type: 'Point', coordinates: [longitude, latitude] };
  active: boolean;
  current_weight?: number;
  battery_level?: number;
  signal_quality?: number;
  last_measurement?: Date;
}
```

### Measurement
```typescript
{
  id: number;
  ruche_id: number;
  recorded_at: Date;
  weight: number;
  temperature: number;
  humidity: number;
  signal: number;
  raw?: Record<string, any>;
}
```

### AlertRule
```typescript
{
  id: number;
  ruche_id?: number; // null for global rules
  rule_type: 'weight' | 'temperature' | 'humidity' | 'signal' | 'variation';
  params: {
    threshold?: number;
    variation_percentage?: number;
    duration?: number;
  };
  notify_in_app: boolean;
  notify_whatsapp: boolean;
  whatsapp_number?: string;
  active: boolean;
}
```

## Notes

- All services return RxJS Observables for async operations
- Realistic delays are included (100-500ms) to simulate network requests
- Data is generated once on service initialization
- IDs are auto-generated using max existing ID + 1
- All geographic coordinates use GeoJSON format (WGS84, EPSG:4326)
- Dates are JavaScript Date objects
- Services are stateful - created/updated items persist during the session
