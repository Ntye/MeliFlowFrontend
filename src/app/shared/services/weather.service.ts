import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { WeatherData } from '../types/dashboard.types';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Get weather for a specific location
   */
  getWeather(latitude: number, longitude: number): Observable<WeatherData> {
    // Determine location name based on coordinates (simplified)
    let locationName = 'Unknown';
    
    if (Math.abs(latitude - 48.8566) < 0.5 && Math.abs(longitude - 2.3522) < 0.5) {
      locationName = 'Paris';
    } else if (Math.abs(latitude - 45.7640) < 0.5 && Math.abs(longitude - 4.8357) < 0.5) {
      locationName = 'Lyon';
    } else if (Math.abs(latitude - 43.6047) < 0.5 && Math.abs(longitude - 1.4442) < 0.5) {
      locationName = 'Toulouse';
    }

    const weatherData = this.mockDataService.generateWeatherData(locationName);
    return of(weatherData).pipe(delay(300));
  }

  /**
   * Get weather for an apiary location
   */
  getWeatherByRucher(rucher_id: number): Observable<WeatherData> {
    const rucher = this.mockDataService.findRucherById(rucher_id);
    
    if (!rucher) {
      return of(this.mockDataService.generateWeatherData('Unknown')).pipe(delay(300));
    }

    let latitude: number, longitude: number;
    
    if (rucher.geom.type === 'Point') {
      [longitude, latitude] = rucher.geom.coordinates;
    } else {
      // For polygon, use center of first point
      [longitude, latitude] = rucher.geom.coordinates[0][0];
    }

    return this.getWeather(latitude, longitude);
  }
}
