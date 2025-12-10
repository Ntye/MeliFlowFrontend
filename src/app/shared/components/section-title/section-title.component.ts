import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-title.component.html'
})
export class SectionTitleComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
}
