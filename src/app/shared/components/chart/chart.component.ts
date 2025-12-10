import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDataPoint } from '../../types/common.types';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() data: ChartDataPoint[] = [];
  @Input() title?: string;
  @Input() type: 'line' | 'bar' | 'area' = 'line';
  @Input() height: string = '300px';

  ngOnInit() {
    // Chart initialization will be implemented when Chart.js is added
  }

  ngOnDestroy() {
    // Cleanup chart instance
  }
}
