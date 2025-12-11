import { TestBed } from '@angular/core/testing';
import { MockDataService } from './mock-data.service';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate ruchers (apiaries)', () => {
    const ruchers = service.getRuchers();
    expect(ruchers.length).toBeGreaterThan(0);
    expect(ruchers[0]).toHaveProperty('id');
    expect(ruchers[0]).toHaveProperty('name');
    expect(ruchers[0]).toHaveProperty('geom');
  });

  it('should generate ruches (hives)', () => {
    const ruches = service.getRuches();
    expect(ruches.length).toBe(12);
    expect(ruches[0]).toHaveProperty('id');
    expect(ruches[0]).toHaveProperty('name');
    expect(ruches[0]).toHaveProperty('rucher_id');
    expect(ruches[0]).toHaveProperty('geom');
    expect(ruches[0].geom.type).toBe('Point');
  });

  it('should generate measurements', () => {
    const measurements = service.getMeasurements();
    expect(measurements.length).toBeGreaterThan(0);
    expect(measurements[0]).toHaveProperty('weight');
    expect(measurements[0]).toHaveProperty('temperature');
    expect(measurements[0]).toHaveProperty('humidity');
  });

  it('should generate alert rules', () => {
    const rules = service.getAlertRules();
    expect(rules.length).toBeGreaterThan(0);
    expect(rules[0]).toHaveProperty('rule_type');
    expect(rules[0]).toHaveProperty('params');
  });

  it('should find ruche by id', () => {
    const ruche = service.findRucheById(1);
    expect(ruche).toBeTruthy();
    expect(ruche?.id).toBe(1);
  });

  it('should find ruches by rucher id', () => {
    const ruches = service.findRuchesByRucherId(1);
    expect(ruches.length).toBeGreaterThan(0);
    expect(ruches.every(r => r.rucher_id === 1)).toBe(true);
  });
});
