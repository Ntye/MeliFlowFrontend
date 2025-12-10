import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsData } from '../../types/common.types';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent {
  @Input() data!: StatsData;
}
