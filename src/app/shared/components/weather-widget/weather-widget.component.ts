import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../types/dashboard.types';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gradient-to-br from-honey-400 to-honey-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-full">
      <!-- Decorative circles -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full"></div>

      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-honey-50 font-medium text-sm mb-1">{{ data.location }}</h3>
            <p class="text-4xl font-bold">{{ data.temperature | number:'1.0-0' }}°C</p>
          </div>
          <span class="text-4xl opacity-90">⛅</span>
        </div>

        <div class="mt-4 flex gap-3">
          <div class="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm flex-1">
            <span class="text-sm">💧</span>
            <span class="text-sm font-medium">{{ data.humidity | number:'1.0-0' }}%</span>
          </div>
          <div class="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm flex-1">
            <span class="text-sm">🌡️</span>
            <span class="text-sm font-medium">Normal</span>
          </div>
        </div>

        <div class="mt-2 text-xs text-honey-50 opacity-80">
          {{ data.condition }}
        </div>
      </div>
    </div>
  `
})
export class WeatherWidgetComponent {
  @Input() data!: WeatherData;
}
