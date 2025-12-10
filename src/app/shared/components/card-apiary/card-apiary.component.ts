import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiaryData } from '../../types/common.types';

@Component({
  selector: 'app-card-apiary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-apiary.component.html'
})
export class CardApiaryComponent {
  @Input() apiary!: ApiaryData;
  @Output() cardClick = new EventEmitter<ApiaryData>();

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'healthy': 'badge-success',
      'warning': 'badge-warning',
      'critical': 'badge-error'
    };
    return classes[status] || 'badge-info';
  }

  onClick() {
    this.cardClick.emit(this.apiary);
  }
}
