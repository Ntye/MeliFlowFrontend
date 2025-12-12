import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Rucher, Ruche, Measurement, AlertRule, Alert, RucheWithStats, RucherWithStats } from '../types/common.types';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private ruchers: Rucher[] = [
    {
      id: 'rucher-1',
      name: 'Apiary Valley',
      location: {
        type: 'Polygon',
        coordinates: [[[2.3522, 48.8566], [2.3540, 48.8566], [2.3540, 48.8580], [2.3522, 48.8580], [2.3522, 48.8566]]]
      },
      address: '123 Bee Street, Paris, France',
      region: 'Île-de-France',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-10')
    },
    {
      id: 'rucher-2',
      name: 'Mountain Meadows',
      location: {
        type: 'Polygon',
        coordinates: [[[6.1294, 46.2044], [6.1310, 46.2044], [6.1310, 46.2060], [6.1294, 46.2060], [6.1294, 46.2044]]]
      },
      address: '456 Alpine Road, Geneva, Switzerland',
      region: 'Geneva',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-12-09')
    },
    {
      id: 'rucher-3',
      name: 'Coastal Hives',
      location: {
        type: 'Polygon',
        coordinates: [[[-1.5536, 47.2184], [-1.5520, 47.2184], [-1.5520, 47.2200], [-1.5536, 47.2200], [-1.5536, 47.2184]]]
      },
      address: '789 Ocean View, Nantes, France',
      region: 'Pays de la Loire',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-12-11')
    }
  ];

  private ruches: Ruche[] = [
    {
      id: 'ruche-1',
      name: 'Alpha Hive',
      rucherId: 'rucher-1',
      location: { type: 'Point', coordinates: [2.3530, 48.8570] },
      status: 'active',
      batteryLevel: 85,
      signalStrength: 92,
      lastUpdate: new Date('2024-12-12T00:30:00'),
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'ruche-2',
      name: 'Beta Hive',
      rucherId: 'rucher-1',
      location: { type: 'Point', coordinates: [2.3532, 48.8572] },
      status: 'alert',
      batteryLevel: 45,
      signalStrength: 78,
      lastUpdate: new Date('2024-12-12T00:25:00'),
      createdAt: new Date('2024-01-20')
    },
    {
      id: 'ruche-3',
      name: 'Gamma Hive',
      rucherId: 'rucher-2',
      location: { type: 'Point', coordinates: [6.1300, 46.2050] },
      status: 'active',
      batteryLevel: 92,
      signalStrength: 88,
      lastUpdate: new Date('2024-12-12T00:35:00'),
      createdAt: new Date('2024-02-20')
    },
    {
      id: 'ruche-4',
      name: 'Delta Hive',
      rucherId: 'rucher-2',
      location: { type: 'Point', coordinates: [6.1305, 46.2052] },
      status: 'active',
      batteryLevel: 88,
      signalStrength: 85,
      lastUpdate: new Date('2024-12-12T00:33:00'),
      createdAt: new Date('2024-02-25')
    },
    {
      id: 'ruche-5',
      name: 'Epsilon Hive',
      rucherId: 'rucher-3',
      location: { type: 'Point', coordinates: [-1.5528, 47.2192] },
      status: 'offline',
      batteryLevel: 15,
      signalStrength: 20,
      lastUpdate: new Date('2024-12-11T15:00:00'),
      createdAt: new Date('2024-03-10')
    },
    {
      id: 'ruche-6',
      name: 'Zeta Hive',
      rucherId: 'rucher-3',
      location: { type: 'Point', coordinates: [-1.5530, 47.2195] },
      status: 'active',
      batteryLevel: 95,
      signalStrength: 95,
      lastUpdate: new Date('2024-12-12T00:40:00'),
      createdAt: new Date('2024-03-15')
    }
  ];

  private measurements: Measurement[] = [];

  private alertRules: AlertRule[] = [
    {
      id: 'rule-1',
      name: 'Low Weight Alert',
      rucheId: undefined, // Global rule
      type: 'weight_min',
      threshold: 30,
      enabled: true,
      notificationChannels: ['in_app', 'whatsapp'],
      whatsappNumber: '+33612345678',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'rule-2',
      name: 'High Temperature Alert',
      rucheId: 'ruche-2',
      type: 'temperature_high',
      threshold: 38,
      enabled: true,
      notificationChannels: ['in_app'],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'rule-3',
      name: 'Rapid Weight Loss',
      rucheId: undefined,
      type: 'weight_variation',
      threshold: -5,
      enabled: false,
      notificationChannels: ['in_app', 'whatsapp'],
      whatsappNumber: '+33612345678',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-11-15')
    }
  ];

  private alerts: Alert[] = [
    {
      id: 'alert-1',
      alertRuleId: 'rule-1',
      rucheId: 'ruche-2',
      message: 'Weight below minimum threshold (28.5 kg)',
      severity: 'warning',
      resolved: false,
      triggeredAt: new Date('2024-12-11T14:30:00')
    },
    {
      id: 'alert-2',
      alertRuleId: 'rule-2',
      rucheId: 'ruche-2',
      message: 'Temperature above threshold (39.2°C)',
      severity: 'critical',
      resolved: true,
      triggeredAt: new Date('2024-12-10T10:15:00'),
      resolvedAt: new Date('2024-12-10T16:20:00')
    },
    {
      id: 'alert-3',
      alertRuleId: 'rule-1',
      rucheId: 'ruche-5',
      message: 'Hive offline - no data received',
      severity: 'critical',
      resolved: false,
      triggeredAt: new Date('2024-12-11T15:00:00')
    }
  ];

  constructor() {
    this.generateMeasurements();
  }

  private generateMeasurements(): void {
    const now = new Date();
    const daysToGenerate = 30;
    const measurementsPerDay = 24; // One per hour

    this.ruches.forEach(ruche => {
      const baseWeight = 35 + Math.random() * 20;
      const baseTemp = 33 + Math.random() * 4;
      const baseHumidity = 60 + Math.random() * 15;
      
      for (let day = 0; day < daysToGenerate; day++) {
        for (let hour = 0; hour < measurementsPerDay; hour++) {
          const timestamp = new Date(now);
          timestamp.setDate(timestamp.getDate() - (daysToGenerate - day));
          timestamp.setHours(hour, 0, 0, 0);

          // Add some variation and trend
          const dayProgress = day / daysToGenerate;
          const weightTrend = dayProgress * 5; // Gradual weight increase
          const dailyVariation = Math.sin((hour / 24) * Math.PI * 2) * 1.5;
          const randomNoise = (Math.random() - 0.5) * 0.5;

          this.measurements.push({
            id: `meas-${ruche.id}-${day}-${hour}`,
            rucheId: ruche.id,
            timestamp,
            weight: baseWeight + weightTrend + dailyVariation + randomNoise,
            temperature: baseTemp + Math.sin((hour / 24) * Math.PI * 2) * 2 + (Math.random() - 0.5),
            humidity: baseHumidity + Math.cos((hour / 24) * Math.PI * 2) * 5 + (Math.random() - 0.5) * 2,
            signal: ruche.signalStrength + (Math.random() - 0.5) * 10
          });
        }
      }
    });
  }

  // Ruchers API
  getRuchers(): Observable<Rucher[]> {
    return of(this.ruchers).pipe(delay(300));
  }

  getRucherById(id: string): Observable<Rucher | undefined> {
    return of(this.ruchers.find(r => r.id === id)).pipe(delay(200));
  }

  getRucherWithStats(id: string): Observable<RucherWithStats | undefined> {
    const rucher = this.ruchers.find(r => r.id === id);
    if (!rucher) return of(undefined);

    const rucherRuches = this.ruches.filter(r => r.rucherId === id);
    const activeRuches = rucherRuches.filter(r => r.status === 'active');
    
    const totalWeight = rucherRuches.reduce((sum, ruche) => {
      const latestMeasurement = this.getLatestMeasurement(ruche.id);
      return sum + (latestMeasurement?.weight || 0);
    }, 0);

    const averageWeight = rucherRuches.length > 0 ? totalWeight / rucherRuches.length : 0;
    
    // Calculate weekly gain
    const weeklyGain = this.calculateWeeklyGain(rucherRuches.map(r => r.id));

    const hasAlerts = rucherRuches.some(r => r.status === 'alert');
    const hasOffline = rucherRuches.some(r => r.status === 'offline');
    const status: 'healthy' | 'warning' | 'critical' = hasOffline ? 'critical' : hasAlerts ? 'warning' : 'healthy';

    return of({
      ...rucher,
      ruchesCount: rucherRuches.length,
      activeRuchesCount: activeRuches.length,
      totalWeight,
      averageWeight,
      weeklyGain,
      status
    }).pipe(delay(200));
  }

  getRuchersWithStats(): Observable<RucherWithStats[]> {
    const ruchersWithStats = this.ruchers.map(rucher => {
      const rucherRuches = this.ruches.filter(r => r.rucherId === rucher.id);
      const activeRuches = rucherRuches.filter(r => r.status === 'active');
      
      const totalWeight = rucherRuches.reduce((sum, ruche) => {
        const latestMeasurement = this.getLatestMeasurement(ruche.id);
        return sum + (latestMeasurement?.weight || 0);
      }, 0);

      const averageWeight = rucherRuches.length > 0 ? totalWeight / rucherRuches.length : 0;
      const weeklyGain = this.calculateWeeklyGain(rucherRuches.map(r => r.id));

      const hasAlerts = rucherRuches.some(r => r.status === 'alert');
      const hasOffline = rucherRuches.some(r => r.status === 'offline');
      const status: 'healthy' | 'warning' | 'critical' = hasOffline ? 'critical' : hasAlerts ? 'warning' : 'healthy';

      return {
        ...rucher,
        ruchesCount: rucherRuches.length,
        activeRuchesCount: activeRuches.length,
        totalWeight,
        averageWeight,
        weeklyGain,
        status
      };
    });

    return of(ruchersWithStats).pipe(delay(300));
  }

  // Ruches API
  getRuches(): Observable<Ruche[]> {
    return of(this.ruches).pipe(delay(300));
  }

  getRucheById(id: string): Observable<Ruche | undefined> {
    return of(this.ruches.find(r => r.id === id)).pipe(delay(200));
  }

  getRuchesByRucherId(rucherId: string): Observable<Ruche[]> {
    return of(this.ruches.filter(r => r.rucherId === rucherId)).pipe(delay(200));
  }

  getRucheWithStats(id: string): Observable<RucheWithStats | undefined> {
    const ruche = this.ruches.find(r => r.id === id);
    if (!ruche) return of(undefined);

    const latestMeasurement = this.getLatestMeasurement(id);
    const dailyGain = this.calculateDailyGain(id);
    const weeklyGain = this.calculateWeeklyGain([id]);
    const totalGain = this.calculateTotalGain(id);

    const rucheWithStats: RucheWithStats = {
      ...ruche,
      currentWeight: latestMeasurement?.weight,
      currentTemperature: latestMeasurement?.temperature,
      currentHumidity: latestMeasurement?.humidity,
      dailyGain,
      weeklyGain,
      totalGain,
      fillingPercentage: latestMeasurement ? Math.min(100, (latestMeasurement.weight / 60) * 100) : 0
    };

    return of(rucheWithStats).pipe(delay(200));
  }

  getRuchesWithStats(): Observable<RucheWithStats[]> {
    const ruchesWithStats = this.ruches.map(ruche => {
      const latestMeasurement = this.getLatestMeasurement(ruche.id);
      const dailyGain = this.calculateDailyGain(ruche.id);
      const weeklyGain = this.calculateWeeklyGain([ruche.id]);
      const totalGain = this.calculateTotalGain(ruche.id);

      return {
        ...ruche,
        currentWeight: latestMeasurement?.weight,
        currentTemperature: latestMeasurement?.temperature,
        currentHumidity: latestMeasurement?.humidity,
        dailyGain,
        weeklyGain,
        totalGain,
        fillingPercentage: latestMeasurement ? Math.min(100, (latestMeasurement.weight / 60) * 100) : 0
      };
    });

    return of(ruchesWithStats).pipe(delay(300));
  }

  // Measurements API
  getMeasurementsByRucheId(rucheId: string, limit?: number): Observable<Measurement[]> {
    let measurements = this.measurements
      .filter(m => m.rucheId === rucheId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (limit) {
      measurements = measurements.slice(0, limit);
    }

    return of(measurements).pipe(delay(300));
  }

  getMeasurementsInRange(rucheId: string, startDate: Date, endDate: Date): Observable<Measurement[]> {
    const measurements = this.measurements
      .filter(m => 
        m.rucheId === rucheId && 
        m.timestamp >= startDate && 
        m.timestamp <= endDate
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return of(measurements).pipe(delay(300));
  }

  // Alert Rules API
  getAlertRules(): Observable<AlertRule[]> {
    return of(this.alertRules).pipe(delay(300));
  }

  getAlertRuleById(id: string): Observable<AlertRule | undefined> {
    return of(this.alertRules.find(r => r.id === id)).pipe(delay(200));
  }

  createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): Observable<AlertRule> {
    const newRule: AlertRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.alertRules.push(newRule);
    return of(newRule).pipe(delay(300));
  }

  updateAlertRule(id: string, updates: Partial<AlertRule>): Observable<AlertRule | undefined> {
    const index = this.alertRules.findIndex(r => r.id === id);
    if (index === -1) return of(undefined);

    this.alertRules[index] = {
      ...this.alertRules[index],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.alertRules[index]).pipe(delay(300));
  }

  deleteAlertRule(id: string): Observable<boolean> {
    const index = this.alertRules.findIndex(r => r.id === id);
    if (index === -1) return of(false);

    this.alertRules.splice(index, 1);
    return of(true).pipe(delay(300));
  }

  // Alerts API
  getAlerts(): Observable<Alert[]> {
    return of(this.alerts.sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())).pipe(delay(300));
  }

  getAlertsByRucheId(rucheId: string): Observable<Alert[]> {
    return of(
      this.alerts
        .filter(a => a.rucheId === rucheId)
        .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
    ).pipe(delay(300));
  }

  getActiveAlerts(): Observable<Alert[]> {
    return of(
      this.alerts
        .filter(a => !a.resolved)
        .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
    ).pipe(delay(300));
  }

  // Helper methods
  private getLatestMeasurement(rucheId: string): Measurement | undefined {
    return this.measurements
      .filter(m => m.rucheId === rucheId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  private calculateDailyGain(rucheId: string): number {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentMeasurements = this.measurements
      .filter(m => m.rucheId === rucheId && m.timestamp >= oneDayAgo)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (recentMeasurements.length < 2) return 0;

    return recentMeasurements[recentMeasurements.length - 1].weight - recentMeasurements[0].weight;
  }

  private calculateWeeklyGain(rucheIds: string[]): number {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let totalGain = 0;
    
    rucheIds.forEach(rucheId => {
      const weekMeasurements = this.measurements
        .filter(m => m.rucheId === rucheId && m.timestamp >= oneWeekAgo)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      if (weekMeasurements.length >= 2) {
        totalGain += weekMeasurements[weekMeasurements.length - 1].weight - weekMeasurements[0].weight;
      }
    });

    return totalGain;
  }

  private calculateTotalGain(rucheId: string): number {
    const allMeasurements = this.measurements
      .filter(m => m.rucheId === rucheId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (allMeasurements.length < 2) return 0;

    return allMeasurements[allMeasurements.length - 1].weight - allMeasurements[0].weight;
  }

  // Global statistics
  getGlobalStats(): Observable<{
    totalRuches: number;
    totalRuchers: number;
    activeAlerts: number;
    totalWeight: number;
    averageTemperature: number;
    averageHumidity: number;
  }> {
    const activeAlerts = this.alerts.filter(a => !a.resolved).length;
    
    let totalWeight = 0;
    let totalTemp = 0;
    let totalHumidity = 0;
    let count = 0;

    this.ruches.forEach(ruche => {
      const latest = this.getLatestMeasurement(ruche.id);
      if (latest) {
        totalWeight += latest.weight;
        totalTemp += latest.temperature;
        totalHumidity += latest.humidity;
        count++;
      }
    });

    return of({
      totalRuches: this.ruches.length,
      totalRuchers: this.ruchers.length,
      activeAlerts,
      totalWeight,
      averageTemperature: count > 0 ? totalTemp / count : 0,
      averageHumidity: count > 0 ? totalHumidity / count : 0
    }).pipe(delay(200));
  }
}
