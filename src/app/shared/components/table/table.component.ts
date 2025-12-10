import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../types/common.types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html'
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() hoverable: boolean = true;
  @Output() rowClick = new EventEmitter<any>();

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
}
