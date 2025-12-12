import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { BreadcrumbItem, RucheWithStats, Rucher } from '../../shared/types/common.types';

@Component({
  selector: 'app-ruches-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    CardComponent
  ],
  templateUrl: './ruches-list.component.html'
})
export class RuchesListComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Hives', icon: '🐝' }
  ];

  ruches: RucheWithStats[] = [];
  filteredRuches: RucheWithStats[] = [];
  ruchers: Rucher[] = [];

  // Filters
  searchQuery = '';
  selectedStatus: 'all' | 'active' | 'alert' | 'offline' = 'all';
  selectedRucherId = 'all';

  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  // View mode
  viewMode: 'grid' | 'list' = 'grid';

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
    
    // Load ruches with stats
    this.mockDataService.getRuchesWithStats().subscribe(ruches => {
      this.ruches = ruches;
      this.applyFilters();
      this.loading = false;
    });

    // Load ruchers for filter dropdown
    this.mockDataService.getRuchers().subscribe(ruchers => {
      this.ruchers = ruchers;
    });
  }

  applyFilters(): void {
    let filtered = [...this.ruches];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === this.selectedStatus);
    }

    // Apply rucher filter
    if (this.selectedRucherId !== 'all') {
      filtered = filtered.filter(r => r.rucherId === this.selectedRucherId);
    }

    this.filteredRuches = filtered;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = 1;
  }

  getPaginatedRuches(): RucheWithStats[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredRuches.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  viewRucheDetail(ruche: RucheWithStats): void {
    this.router.navigate(['/hives', ruche.id]);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'active': '#10B981',
      'alert': '#F59E0B',
      'offline': '#EF4444'
    };
    return colors[status] || '#6B7280';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'active': 'bg-success-light text-success-dark',
      'alert': 'bg-warning-light text-warning-dark',
      'offline': 'bg-error-light text-error-dark'
    };
    return classes[status] || 'bg-neutral-200 text-neutral-700';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  Math = Math;
}
