import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardHiveComponent } from '../../shared/components/card-hive/card-hive.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { BreadcrumbItem, StatsData, HiveData } from '../../shared/types/common.types';

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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Dashboard', icon: '📊' }
  ];

  stats: StatsData[] = [
    {
      label: 'Total Hives',
      value: 24,
      icon: '🐝',
      trend: { value: 12, direction: 'up' },
      color: '#FDF4E6'
    },
    {
      label: 'Active Apiaries',
      value: 5,
      icon: '🏞️',
      color: '#D1FAE5'
    },
    {
      label: 'Total Weight',
      value: '1,234 kg',
      icon: '⚖️',
      trend: { value: 8, direction: 'up' },
      color: '#DBEAFE'
    },
    {
      label: 'Alerts',
      value: 3,
      icon: '🔔',
      trend: { value: 2, direction: 'down' },
      color: '#FEE2E2'
    }
  ];

  recentHives: HiveData[] = [
    {
      id: 'H001',
      name: 'Hive Alpha',
      status: 'healthy',
      weight: 45.2,
      batteryLevel: 85,
      signalStrength: 92,
      lastUpdate: new Date(),
      temperature: 34.5,
      humidity: 65
    },
    {
      id: 'H002',
      name: 'Hive Beta',
      status: 'warning',
      weight: 38.7,
      batteryLevel: 45,
      signalStrength: 78,
      lastUpdate: new Date(),
      temperature: 32.1
    },
    {
      id: 'H003',
      name: 'Hive Gamma',
      status: 'healthy',
      weight: 52.3,
      batteryLevel: 92,
      signalStrength: 88,
      lastUpdate: new Date(),
      temperature: 35.2
    }
  ];

  onHiveClick(hive: HiveData) {
    console.log('Hive clicked:', hive);
  }
}
