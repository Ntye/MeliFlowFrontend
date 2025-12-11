import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Measurement } from '../types/measurement.types';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Get measurements for a hive with optional limit
   */
  getMeasurements(ruche_id: number, limit?: number): Observable<Measurement[]> {
    let measurements = this.mockDataService.findMeasurementsByRucheId(ruche_id);
    
    // Sort by recorded_at descending (most recent first)
    measurements = measurements.sort((a, b) => 
      b.recorded_at.getTime() - a.recorded_at.getTime()
    );

    if (limit) {
      measurements = measurements.slice(0, limit);
    }

    return of(measurements).pipe(delay(200));
  }

  /**
   * Get measurements by time range
   */
  getMeasurementsByTimeRange(
    ruche_id: number, 
    startDate: Date, 
    endDate: Date
  ): Observable<Measurement[]> {
    const measurements = this.mockDataService.findMeasurementsByRucheId(ruche_id);
    
    const filtered = measurements.filter(m => 
      m.recorded_at >= startDate && m.recorded_at <= endDate
    );

    return of(filtered).pipe(delay(200));
  }

  /**
   * Get the latest measurement for a hive
   */
  getLatestMeasurement(ruche_id: number): Observable<Measurement | undefined> {
    const measurements = this.mockDataService.findMeasurementsByRucheId(ruche_id);
    
    if (measurements.length === 0) {
      return of(undefined).pipe(delay(100));
    }

    const latest = measurements.reduce((prev, current) => 
      current.recorded_at > prev.recorded_at ? current : prev
    );

    return of(latest).pipe(delay(100));
  }

  /**
   * Get aggregated metrics for a hive
   */
  getAggregatedMetrics(
    ruche_id: number, 
    period: 'daily' | 'weekly' | 'monthly'
  ): Observable<any> {
    const measurements = this.mockDataService.findMeasurementsByRucheId(ruche_id);
    
    if (measurements.length === 0) {
      return of({
        period,
        count: 0,
        avgWeight: 0,
        avgTemperature: 0,
        avgHumidity: 0,
        avgSignal: 0
      }).pipe(delay(150));
    }

    // Calculate period start date
    const now = new Date();
    let periodStart: Date;
    switch (period) {
      case 'daily':
        periodStart = new Date(now.getTime() - 24 * 3600000);
        break;
      case 'weekly':
        periodStart = new Date(now.getTime() - 7 * 24 * 3600000);
        break;
      case 'monthly':
        periodStart = new Date(now.getTime() - 30 * 24 * 3600000);
        break;
    }

    const periodMeasurements = measurements.filter(m => m.recorded_at >= periodStart);

    if (periodMeasurements.length === 0) {
      return of({
        period,
        count: 0,
        avgWeight: 0,
        avgTemperature: 0,
        avgHumidity: 0,
        avgSignal: 0
      }).pipe(delay(150));
    }

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const aggregated = {
      period,
      count: periodMeasurements.length,
      avgWeight: Math.round(avg(periodMeasurements.map(m => m.weight)) * 100) / 100,
      avgTemperature: Math.round(avg(periodMeasurements.map(m => m.temperature)) * 10) / 10,
      avgHumidity: Math.round(avg(periodMeasurements.map(m => m.humidity)) * 10) / 10,
      avgSignal: Math.round(avg(periodMeasurements.map(m => m.signal))),
      minWeight: Math.min(...periodMeasurements.map(m => m.weight)),
      maxWeight: Math.max(...periodMeasurements.map(m => m.weight)),
      minTemperature: Math.min(...periodMeasurements.map(m => m.temperature)),
      maxTemperature: Math.max(...periodMeasurements.map(m => m.temperature))
    };

    return of(aggregated).pipe(delay(150));
  }
}
