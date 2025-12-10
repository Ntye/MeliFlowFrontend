import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
  icon?: string;
}

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-container.component.html',
  styleUrl: './map-container.component.scss'
})
export class MapContainerComponent implements OnInit, OnDestroy {
  @Input() markers: MapMarker[] = [];
  @Input() center: { lat: number; lng: number } = { lat: 0, lng: 0 };
  @Input() zoom: number = 10;
  @Input() height: string = '400px';

  ngOnInit() {
    // Leaflet map initialization will be implemented when Leaflet is added
  }

  ngOnDestroy() {
    // Cleanup map instance
  }
}
