import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsData } from '../../types/common.types';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html'
})
export class StatsCardComponent {
  @Input() data!: StatsData;
}
