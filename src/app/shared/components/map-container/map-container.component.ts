import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HiveData } from '../../types/common.types';

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() hives: HiveData[] = [];
  @Input() height: string = '400px';

  private map: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hives'] && this.map) {
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private async initMap() {
    // Dynamic import to avoid SSR issues
    const L = await import('leaflet');

    // Fix default icon issue with webpack/angular
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';

    // We use a custom icon definition to avoid needing assets present (using CDNs for demo reliability if assets missing)
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    // Create map
    this.map = L.map('map').setView([47.0, 2.5], 5); // Default view of France

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.updateMarkers();

    // Force map to re-render its size after view is initialized
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  private async updateMarkers() {
    if (!this.map) return;
    const L = await import('leaflet');

    // Clear existing markers (basic implementation - for prod use a LayerGroup)
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    const bounds = L.latLngBounds([]);

    this.hives.forEach(hive => {
      if (hive.location) {
        const marker = L.marker([hive.location.lat, hive.location.lng])
          .addTo(this.map)
          .bindPopup(`
            <div class="font-sans">
              <h3 class="font-bold text-honey-700">${hive.name}</h3>
              <p>Weight: <b>${hive.weight} kg</b></p>
              <p>Status: <span style="color:${this.getStatusColor(hive.status)}">${hive.status}</span></p>
            </div>
          `);

        bounds.extend([hive.location.lat, hive.location.lng]);
      }
    });

    if (this.hives.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'healthy': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#9CA3AF';
    }
  }
}
