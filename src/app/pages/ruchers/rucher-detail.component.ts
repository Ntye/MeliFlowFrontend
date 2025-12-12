import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { BreadcrumbItem, RucherWithStats, RucheWithStats } from '../../shared/types/common.types';

@Component({
  selector: 'app-rucher-detail',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    CardComponent,
    ChartComponent,
    SectionTitleComponent
  ],
  templateUrl: './rucher-detail.component.html'
})
export class RucherDetailComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Apiaries', url: '/apiaries', icon: '🏞️' },
    { label: 'Loading...', icon: '📊' }
  ];

  rucher?: RucherWithStats;
  ruches: RucheWithStats[] = [];
  
  selectedTab: 'overview' | 'hives' | 'statistics' = 'overview';
  loading = true;
  showEditModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRucherData(id);
    }
  }

  private loadRucherData(id: string): void {
    this.loading = true;

    // Load rucher with stats
    this.mockDataService.getRucherWithStats(id).subscribe(rucher => {
      if (rucher) {
        this.rucher = rucher;
        this.breadcrumbs[2] = { label: rucher.name, icon: '🏞️' };

        // Load ruches with stats for this rucher
        this.mockDataService.getRuchesWithStats().subscribe(allRuches => {
          this.ruches = allRuches.filter(r => r.rucherId === id);
        });
      } else {
        this.router.navigate(['/apiaries']);
      }
      this.loading = false;
    });
  }

  selectTab(tab: 'overview' | 'hives' | 'statistics'): void {
    this.selectedTab = tab;
  }

  toggleEditModal(): void {
    this.showEditModal = !this.showEditModal;
  }

  viewRucheDetail(ruche: RucheWithStats): void {
    this.router.navigate(['/hives', ruche.id]);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'active': '#10B981',
      'alert': '#F59E0B',
      'offline': '#EF4444',
      'healthy': '#10B981',
      'warning': '#F59E0B',
      'critical': '#EF4444'
    };
    return colors[status] || '#6B7280';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'active': 'bg-success-light text-success-dark',
      'alert': 'bg-warning-light text-warning-dark',
      'offline': 'bg-error-light text-error-dark',
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

  getActiveHives(): RucheWithStats[] {
    return this.ruches.filter(r => r.status === 'active');
  }

  getAlertHives(): RucheWithStats[] {
    return this.ruches.filter(r => r.status === 'alert');
  }

  getOfflineHives(): RucheWithStats[] {
    return this.ruches.filter(r => r.status === 'offline');
  }

  getTotalGain(): number {
    return this.ruches.reduce((sum, r) => sum + (r.totalGain || 0), 0);
  }

  getAverageDailyGain(): number {
    if (this.ruches.length === 0) return 0;
    const total = this.ruches.reduce((sum, r) => sum + (r.dailyGain || 0), 0);
    return total / this.ruches.length;
  }
}
