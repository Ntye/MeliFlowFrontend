import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardHiveComponent } from '../../shared/components/card-hive/card-hive.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { BreadcrumbItem, StatsData, HiveData, RucheWithStats, Alert } from '../../shared/types/common.types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    StatsCardComponent,
    CardComponent,
    CardHiveComponent,
    ChartComponent,
    SectionTitleComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Dashboard', icon: '📊' }
  ];

  stats: StatsData[] = [];
  recentHives: HiveData[] = [];
  activeAlerts: Alert[] = [];

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Load global stats
    this.mockDataService.getGlobalStats().subscribe(globalStats => {
      this.stats = [
        {
          label: 'Total Hives',
          value: globalStats.totalRuches,
          icon: '🐝',
          color: '#FDF4E6'
        },
        {
          label: 'Total Apiaries',
          value: globalStats.totalRuchers,
          icon: '🏞️',
          color: '#D1FAE5'
        },
        {
          label: 'Total Weight',
          value: `${Math.round(globalStats.totalWeight)} kg`,
          icon: '⚖️',
          color: '#DBEAFE'
        },
        {
          label: 'Active Alerts',
          value: globalStats.activeAlerts,
          icon: '🔔',
          color: globalStats.activeAlerts > 0 ? '#FEE2E2' : '#D1FAE5'
        }
      ];
    });

    // Load recent hives with stats
    this.mockDataService.getRuchesWithStats().subscribe(ruches => {
      this.recentHives = this.convertToHiveData(ruches.slice(0, 3));
    });

    // Load active alerts
    this.mockDataService.getActiveAlerts().subscribe(alerts => {
      this.activeAlerts = alerts.slice(0, 3);
    });
  }

  private convertToHiveData(ruches: RucheWithStats[]): HiveData[] {
    return ruches.map(ruche => ({
      id: ruche.id,
      name: ruche.name,
      status: ruche.status === 'active' ? 'healthy' : ruche.status === 'alert' ? 'warning' : 'offline',
      weight: ruche.currentWeight || 0,
      batteryLevel: ruche.batteryLevel,
      signalStrength: ruche.signalStrength,
      lastUpdate: ruche.lastUpdate,
      temperature: ruche.currentTemperature,
      humidity: ruche.currentHumidity,
      location: {
        lat: ruche.location.coordinates[1],
        lng: ruche.location.coordinates[0]
      }
    }));
  }

  onHiveClick(hive: HiveData): void {
    this.router.navigate(['/hives', hive.id]);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
