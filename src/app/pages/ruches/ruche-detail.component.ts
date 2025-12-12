import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { BreadcrumbItem, RucheWithStats, Measurement, Rucher } from '../../shared/types/common.types';

@Component({
  selector: 'app-ruche-detail',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    CardComponent,
    ChartComponent,
    SectionTitleComponent
  ],
  templateUrl: './ruche-detail.component.html'
})
export class RucheDetailComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Hives', url: '/hives', icon: '🐝' },
    { label: 'Loading...', icon: '📊' }
  ];

  ruche?: RucheWithStats;
  rucher?: Rucher;
  recentMeasurements: Measurement[] = [];
  allRuches: RucheWithStats[] = [];
  
  selectedTab: 'overview' | 'measurements' | 'comparison' = 'overview';
  loading = true;
  showQRCode = false;

  // Chart data
  weightChartData: any[] = [];
  temperatureChartData: any[] = [];
  humidityChartData: any[] = [];
  signalChartData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRucheData(id);
    }
  }

  private loadRucheData(id: string): void {
    this.loading = true;

    // Load ruche with stats
    this.mockDataService.getRucheWithStats(id).subscribe(ruche => {
      if (ruche) {
        this.ruche = ruche;
        this.breadcrumbs[2] = { label: ruche.name, icon: '🐝' };

        // Load rucher
        this.mockDataService.getRucherById(ruche.rucherId).subscribe(rucher => {
          this.rucher = rucher;
        });

        // Load measurements for charts
        this.loadMeasurements(id);
      } else {
        this.router.navigate(['/hives']);
      }
      this.loading = false;
    });

    // Load all ruches for comparison
    this.mockDataService.getRuchesWithStats().subscribe(ruches => {
      this.allRuches = ruches;
    });
  }

  private loadMeasurements(rucheId: string): void {
    // Get last 30 days of measurements
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    this.mockDataService.getMeasurementsInRange(rucheId, startDate, endDate).subscribe(measurements => {
      // Sample data for charts (take every 6th measurement to reduce points)
      const sampledMeasurements = measurements.filter((_, index) => index % 6 === 0);
      
      this.weightChartData = sampledMeasurements.map(m => ({
        timestamp: m.timestamp,
        value: m.weight,
        label: new Date(m.timestamp).toLocaleDateString()
      }));

      this.temperatureChartData = sampledMeasurements.map(m => ({
        timestamp: m.timestamp,
        value: m.temperature,
        label: new Date(m.timestamp).toLocaleDateString()
      }));

      this.humidityChartData = sampledMeasurements.map(m => ({
        timestamp: m.timestamp,
        value: m.humidity,
        label: new Date(m.timestamp).toLocaleDateString()
      }));

      this.signalChartData = sampledMeasurements.map(m => ({
        timestamp: m.timestamp,
        value: m.signal,
        label: new Date(m.timestamp).toLocaleDateString()
      }));
    });

    // Get recent measurements for table
    this.mockDataService.getMeasurementsByRucheId(rucheId, 10).subscribe(measurements => {
      this.recentMeasurements = measurements;
    });
  }

  selectTab(tab: 'overview' | 'measurements' | 'comparison'): void {
    this.selectedTab = tab;
  }

  toggleQRCode(): void {
    this.showQRCode = !this.showQRCode;
  }

  generateQRCodeData(): string {
    if (!this.ruche) return '';
    return `https://meliflow.app/hives/${this.ruche.id}`;
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatShortDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getComparisonRuches(): RucheWithStats[] {
    if (!this.ruche) return [];
    return this.allRuches.filter(r => r.id !== this.ruche!.id);
  }

  navigateToRucher(): void {
    if (this.ruche) {
      this.router.navigate(['/apiaries', this.ruche.rucherId]);
    }
  }

  Math = Math;
}
