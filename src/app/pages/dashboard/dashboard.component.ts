import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardHiveComponent } from '../../shared/components/card-hive/card-hive.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { MapContainerComponent } from '../../shared/components/map-container/map-container.component';
import { WeatherWidgetComponent } from '../../shared/components/weather-widget/weather-widget.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { BreadcrumbItem, StatsData, HiveData, ChartDataPoint } from '../../shared/types/common.types';
import { WeatherData } from '../../shared/types/dashboard.types';
import { RuchesService } from '../../shared/services/ruches.service';
import { RuchersService } from '../../shared/services/ruchers.service';
import { AlertsService } from '../../shared/services/alerts.service';
import { WeatherService } from '../../shared/services/weather.service';
import { MeasurementsService } from '../../shared/services/measurements.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    StatsCardComponent,
    CardComponent,
    ChartComponent,
    MapContainerComponent,
    WeatherWidgetComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Dashboard' }
  ];

  stats: StatsData[] = [];
  recentHives: HiveData[] = [];
  allHives: HiveData[] = [];
  chartData: ChartDataPoint[] = [];
  weatherData: WeatherData | null = null;
  loading = true;

  constructor(
      private ruchesService: RuchesService,
      private ruchersService: RuchersService,
      private alertsService: AlertsService,
      private weatherService: WeatherService,
      private measurementsService: MeasurementsService
  ) {}

  async ngOnInit() {
    try {
      await this.loadDashboardData();
    } finally {
      this.loading = false;
    }
  }

  async loadDashboardData() {
    // 1. Fetch Hives & Ruchers
    const ruches = (await firstValueFrom(this.ruchesService.getRuches())) as any[];
    const ruchers = (await firstValueFrom(this.ruchersService.getRuchers())) as any[];
    const alerts = (await firstValueFrom(this.alertsService.getAlertRules())) as any[];
    const triggeredAlerts = (await firstValueFrom(this.alertsService.getTriggeredAlerts())) as any[];

    // 2. Map to HiveData for UI
    this.allHives = ruches.map((r: any) => ({
      id: r.id.toString(),
      name: r.name,
      status: r.active ? 'healthy' : 'offline', // Simplified status logic
      weight: r.current_weight || 0,
      batteryLevel: r.battery_level || 0,
      signalStrength: r.signal_quality || 0,
      lastUpdate: r.last_measurement || new Date(),
      temperature: 34.5, // Mock default if missing
      humidity: 65, // Mock default if missing
      location: {
        lat: r.geom.coordinates[1],
        lng: r.geom.coordinates[0]
      }
    }));

    // Add some variation to status for demo
    if (this.allHives.length > 1) this.allHives[1].status = 'warning';
    if (this.allHives.length > 3) this.allHives[3].status = 'critical';

    this.recentHives = this.allHives.slice(0, 3);

    // 3. Calculate Stats
    const totalWeight = ruches.reduce((acc: number, r: any) => acc + (r.current_weight || 0), 0);
    const activeApiaries = ruchers.length;

    this.stats = [
      {
        label: 'Total Hives',
        value: ruches.length,
        trend: { value: 2, direction: 'up' },
        color: '#FDF4E6'
      },
      {
        label: 'Active Apiaries',
        value: activeApiaries,
        color: '#D1FAE5'
      },
      {
        label: 'Total Honey',
        value: `${totalWeight.toFixed(0)} kg`,
        trend: { value: 12, direction: 'up' },
        color: '#DBEAFE'
      },
      {
        label: 'Active Alerts',
        value: triggeredAlerts.length,
        trend: { value: 1, direction: 'down' },
        color: '#FEE2E2'
      }
    ];

    // 4. Fetch Weather (using first apiary location or default)
    if (ruchers.length > 0) {
      this.weatherData = await firstValueFrom(this.weatherService.getWeatherByRucher(ruchers[0].id));
    }

    // 5. Generate Chart Data (Mocking history for now based on total weight)
    const now = new Date();
    this.chartData = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (29 - i));
      return {
        timestamp: d,
        value: 1200 + (i * 5) + (Math.random() * 50 - 25), // Simulated growth trend
        label: d.toLocaleDateString()
      };
    });
  }

  onHiveClick(hive: HiveData) {
    console.log('Hive clicked:', hive);
  }
}
