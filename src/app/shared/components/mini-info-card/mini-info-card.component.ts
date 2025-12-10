import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-info-card.component.html',
  styleUrl: './mini-info-card.component.scss'
})
export class MiniInfoCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() icon?: string;
  @Input() color: string = '#FDF4E6';
}
