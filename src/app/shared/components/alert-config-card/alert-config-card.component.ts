import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertConfig } from '../../types/common.types';

@Component({
  selector: 'app-alert-config-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-config-card.component.html',
  styleUrl: './alert-config-card.component.scss'
})
export class AlertConfigCardComponent {
  @Input() alert!: AlertConfig;
  @Output() toggleAlert = new EventEmitter<AlertConfig>();
  @Output() editAlert = new EventEmitter<AlertConfig>();

  getAlertIcon(type: string): string {
    const icons: Record<string, string> = {
      'weight': '⚖️',
      'temperature': '🌡️',
      'humidity': '💧',
      'battery': '🔋',
      'signal': '📡'
    };
    return icons[type] || '🔔';
  }

  onToggle() {
    this.toggleAlert.emit(this.alert);
  }

  onEdit() {
    this.editAlert.emit(this.alert);
  }
}
