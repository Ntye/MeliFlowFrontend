import { TestBed } from '@angular/core/testing';
import { MeasurementsService } from './measurements.service';
import { firstValueFrom } from 'rxjs';

describe('MeasurementsService', () => {
  let service: MeasurementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get measurements for a ruche', async () => {
    const measurements = await firstValueFrom(service.getMeasurements(1));
    expect(measurements.length).toBeGreaterThan(0);
    expect(measurements[0]).toHaveProperty('weight');
    expect(measurements[0]).toHaveProperty('temperature');
  });

  it('should get latest measurement', async () => {
    const measurement = await firstValueFrom(service.getLatestMeasurement(1));
    expect(measurement).toBeTruthy();
    expect(measurement).toHaveProperty('recorded_at');
  });

  it('should get aggregated metrics', async () => {
    const metrics = await firstValueFrom(service.getAggregatedMetrics(1, 'daily'));
    expect(metrics).toHaveProperty('avgWeight');
    expect(metrics).toHaveProperty('avgTemperature');
    expect(metrics).toHaveProperty('count');
  });
});
