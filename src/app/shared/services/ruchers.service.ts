import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Rucher } from '../types/rucher.types';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RuchersService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Get all apiaries
   */
  getRuchers(): Observable<Rucher[]> {
    return of(this.mockDataService.getRuchers()).pipe(delay(200));
  }

  /**
   * Get a single apiary by ID
   */
  getRucher(id: number): Observable<Rucher | undefined> {
    return of(this.mockDataService.findRucherById(id)).pipe(delay(100));
  }

  /**
   * Create a new apiary (mock)
   */
  createRucher(rucher: Rucher): Observable<Rucher> {
    const newRucher = this.mockDataService.addRucher(rucher);
    return of(newRucher).pipe(delay(300));
  }

  /**
   * Update an apiary (mock)
   */
  updateRucher(id: number, rucher: Partial<Rucher>): Observable<Rucher | undefined> {
    const updated = this.mockDataService.updateRucher(id, rucher);
    return of(updated).pipe(delay(250));
  }
}
