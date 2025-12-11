import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Ruche } from '../types/ruche.types';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RuchesService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Get all hives
   */
  getRuches(): Observable<Ruche[]> {
    return of(this.mockDataService.getRuches()).pipe(delay(200));
  }

  /**
   * Get a single hive by ID
   */
  getRuche(id: number): Observable<Ruche | undefined> {
    return of(this.mockDataService.findRucheById(id)).pipe(delay(100));
  }

  /**
   * Get hives by apiary ID
   */
  getRuchesByRucher(rucher_id: number): Observable<Ruche[]> {
    return of(this.mockDataService.findRuchesByRucherId(rucher_id)).pipe(delay(150));
  }

  /**
   * Create a new hive (mock)
   */
  createRuche(ruche: Ruche): Observable<Ruche> {
    const newRuche = this.mockDataService.addRuche(ruche);
    return of(newRuche).pipe(delay(300));
  }

  /**
   * Update a hive (mock)
   */
  updateRuche(id: number, ruche: Partial<Ruche>): Observable<Ruche | undefined> {
    const updated = this.mockDataService.updateRuche(id, ruche);
    return of(updated).pipe(delay(250));
  }
}
