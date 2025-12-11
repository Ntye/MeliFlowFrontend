import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDataPoint } from '../../types/common.types';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnChanges {
  @Input() data: ChartDataPoint[] = [];
  @Input() title?: string;
  @Input() type: 'line' | 'bar' | 'area' = 'line';
  @Input() height: string = '300px';

  // SVG Paths
  areaPath: string = '';
  linePath: string = '';
  gainPath: string = '';

  // Render helpers
  points: { x: number, y: number, index: number }[] = [];
  midIndex: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data.length > 0) {
      this.generatePaths();
    }
  }

  generatePaths() {
    if (!this.data.length) return;

    this.midIndex = Math.floor(this.data.length / 2);

    const width = 1000;
    const height = 300;
    const padding = 20;

    // Find min/max for scaling
    const weights = this.data.map(d => d.value);
    // Ensure we have some range to avoid division by zero
    let minVal = Math.min(...weights) * 0.95;
    let maxVal = Math.max(...weights) * 1.05;

    if (minVal === maxVal) {
      minVal = minVal - 10;
      maxVal = maxVal + 10;
    }

    const getX = (index: number) => (index / (this.data.length - 1)) * (width - padding * 2) + padding;
    const getY = (val: number) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);

    // Generate points
    this.points = this.data.map((d, i) => ({
      x: getX(i),
      y: getY(d.value),
      index: i
    }));

    const pathPoints = this.points.map(p => `${p.x},${p.y}`);

    // Create paths
    this.linePath = `M ${pathPoints.join(' L ')}`;
    this.areaPath = `${this.linePath} L ${width - padding},${height} L ${padding},${height} Z`;

    // Simulate a second "Gain" line for visual variety (using random variation of weight)
    const gainPoints = this.data.map((d, i) => {
      const gainY = getY(d.value * 0.2 + (Math.sin(i) * 5) + minVal);
      return `${getX(i)},${gainY}`;
    });
    this.gainPath = `M ${gainPoints.join(' L ')}`;
  }
}
