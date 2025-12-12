import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { BreadcrumbItem, RucherWithStats } from '../../shared/types/common.types';

@Component({
  selector: 'app-ruchers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    CardComponent
  ],
  templateUrl: './ruchers-list.component.html'
})
export class RuchersListComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Apiaries', icon: '🏞️' }
  ];

  ruchers: RucherWithStats[] = [];
  filteredRuchers: RucherWithStats[] = [];

  // Filters
  searchQuery = '';
  selectedRegion = 'all';

  loading = true;

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    
    this.mockDataService.getRuchersWithStats().subscribe(ruchers => {
      this.ruchers = ruchers;
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters(): void {
    let filtered = [...this.ruchers];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.id.toLowerCase().includes(query) ||
        (r.address && r.address.toLowerCase().includes(query))
      );
    }

    // Apply region filter
    if (this.selectedRegion !== 'all') {
      filtered = filtered.filter(r => r.region === this.selectedRegion);
    }

    this.filteredRuchers = filtered;
  }

  getUniqueRegions(): string[] {
    const regions = this.ruchers
      .map(r => r.region)
      .filter((region): region is string => !!region);
    return Array.from(new Set(regions));
  }

  viewRucherDetail(rucher: RucherWithStats): void {
    this.router.navigate(['/apiaries', rucher.id]);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'healthy': '#10B981',
      'warning': '#F59E0B',
      'critical': '#EF4444'
    };
    return colors[status] || '#6B7280';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'healthy': 'bg-success-light text-success-dark',
      'warning': 'bg-warning-light text-warning-dark',
      'critical': 'bg-error-light text-error-dark'
    };
    return classes[status] || 'bg-neutral-200 text-neutral-700';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
