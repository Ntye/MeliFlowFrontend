import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiveData } from '../../types/common.types';

@Component({
  selector: 'app-card-hive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-hive.component.html',
  styleUrl: './card-hive.component.scss'
})
export class CardHiveComponent {
  @Input() hive!: HiveData;
  @Output() cardClick = new EventEmitter<HiveData>();

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'healthy': '#10B981',
      'warning': '#F59E0B',
      'critical': '#EF4444',
      'offline': '#6B7280'
    };
    return colors[status] || colors['offline'];
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'healthy': 'badge-success',
      'warning': 'badge-warning',
      'critical': 'badge-error',
      'offline': 'bg-neutral-200 text-neutral-700'
    };
    return classes[status] || classes['offline'];
  }

  onClick() {
    this.cardClick.emit(this.hive);
  }
}
