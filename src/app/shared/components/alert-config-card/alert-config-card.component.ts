import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertConfig } from '../../types/common.types';

@Component({
  selector: 'app-alert-config-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-config-card.component.html'
})
export class AlertConfigCardComponent {
  @Input() alert!: AlertConfig;
  @Output() toggleAlert = new EventEmitter<AlertConfig>();
  @Output() editAlert = new EventEmitter<AlertConfig>();

  onToggle() {
    this.toggleAlert.emit(this.alert);
  }

  onEdit() {
    this.editAlert.emit(this.alert);
  }
}
