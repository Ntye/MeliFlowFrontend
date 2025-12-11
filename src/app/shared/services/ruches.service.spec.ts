import { TestBed } from '@angular/core/testing';
import { RuchesService } from './ruches.service';
import { firstValueFrom } from 'rxjs';

describe('RuchesService', () => {
  let service: RuchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all ruches', async () => {
    const ruches = await firstValueFrom(service.getRuches());
    expect(ruches.length).toBe(12);
  });

  it('should get a single ruche by id', async () => {
    const ruche = await firstValueFrom(service.getRuche(1));
    expect(ruche).toBeTruthy();
    expect(ruche?.id).toBe(1);
  });

  it('should get ruches by rucher id', async () => {
    const ruches = await firstValueFrom(service.getRuchesByRucher(1));
    expect(ruches.length).toBeGreaterThan(0);
    expect(ruches.every(r => r.rucher_id === 1)).toBe(true);
  });
});
