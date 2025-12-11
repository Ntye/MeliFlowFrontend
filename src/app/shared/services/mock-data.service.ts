import { Injectable } from '@angular/core';
import { Ruche, GeoPoint } from '../types/ruche.types';
import { Rucher, GeoPolygon } from '../types/rucher.types';
import { Measurement } from '../types/measurement.types';
import { AlertRule, TriggeredAlert } from '../types/alert.types';
import { WeatherData } from '../types/dashboard.types';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private ruchers: Rucher[] = [];
  private ruches: Ruche[] = [];
  private measurements: Measurement[] = [];
  private alertRules: AlertRule[] = [];
  private triggeredAlerts: TriggeredAlert[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.generateRuchers();
    this.generateRuches();
    this.generateMeasurements();
    this.generateAlertRules();
    this.generateTriggeredAlerts();
  }

  private generateRuchers() {
    // Apiary 1: Rucher des Jardins (Paris area) - Will contain Alpha and Beta
    this.ruchers.push({
      id: 1,
      name: 'Rucher des Jardins',
      description: 'Main apiary in the botanical gardens',
      geom: {
        type: 'Point',
        coordinates: [2.3522, 48.8566] // Paris
      },
      created_at: new Date('2024-01-15')
    });

    // Apiary 2: Rucher de la Colline (Lyon area) - Will contain Gamma
    this.ruchers.push({
      id: 2,
      name: 'Rucher de la Colline',
      description: 'Hill apiary with scenic views',
      geom: {
        type: 'Polygon',
        coordinates: [[
          [4.8357, 45.7640],
          [4.8370, 45.7640],
          [4.8370, 45.7650],
          [4.8357, 45.7650],
          [4.8357, 45.7640]
        ]]
      } as GeoPolygon,
      created_at: new Date('2024-02-20')
    });

    // Apiary 3: Rucher du Sud (Toulouse area)
    this.ruchers.push({
      id: 3,
      name: 'Rucher du Sud',
      description: 'Southern apiary with lavender fields',
      geom: {
        type: 'Point',
        coordinates: [1.4442, 43.6047] // Toulouse
      },
      created_at: new Date('2024-03-10')
    });
  }

  private generateRuches() {
    const hiveNames = [
      'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta',
      'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu'
    ];

    // Generate 12 hives
    for (let i = 0; i < 12; i++) {
      let rucherId: number;
      let coords: [number, number]; // [lng, lat]

      // SPECIFIC LOGIC: Group Alpha & Beta in Rucher 1, Gamma in Rucher 2
      if (i === 0) {
        // Alpha -> Rucher 1
        rucherId = 1;
        coords = [2.3522, 48.8566]; // Center of Rucher 1
      } else if (i === 1) {
        // Beta -> Rucher 1 (Very close to Alpha)
        rucherId = 1;
        coords = [2.3526, 48.8568]; // Slightly offset
      } else if (i === 2) {
        // Gamma -> Rucher 2
        rucherId = 2;
        coords = [4.8357, 45.7640]; // Center of Rucher 2
      } else {
        // Others distributed randomly
        rucherId = (i % 3) + 1;
        const rucherGeom = this.ruchers[rucherId - 1].geom;
        let baseLng: number, baseLat: number;

        if (rucherGeom.type === 'Point') {
          [baseLng, baseLat] = rucherGeom.coordinates;
        } else {
          // For polygon, use center of first point
          [baseLng, baseLat] = rucherGeom.coordinates[0][0];
        }

        // Add larger random offset for others to make them distinct on map
        const lngOffset = (Math.random() - 0.5) * 0.05;
        const latOffset = (Math.random() - 0.5) * 0.05;
        coords = [baseLng + lngOffset, baseLat + latOffset];
      }

      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180));
      const isActive = i < 10 ? true : Math.random() > 0.1;

      this.ruches.push({
        id: i + 1,
        name: `Hive ${hiveNames[i]}`,
        rucher_id: rucherId,
        queen_info: Math.random() > 0.5 ? `Queen marked ${2023 + Math.floor(Math.random() * 2)}` : undefined,
        created_at: createdDate,
        geom: {
          type: 'Point',
          coordinates: coords
        },
        active: isActive,
        current_weight: isActive ? 40 + Math.random() * 40 : undefined,
        battery_level: isActive ? 20 + Math.random() * 80 : undefined,
        signal_quality: isActive ? Math.random() * 100 : undefined,
        last_measurement: isActive ? new Date(Date.now() - Math.random() * 6 * 3600000) : undefined
      });
    }
  }

  private generateMeasurements() {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 3600000);
    const measurementInterval = 6 * 3600000; // 6 hours in milliseconds

    // Generate measurements for each active hive
    this.ruches.filter(r => r.active).forEach(ruche => {
      let currentTime = thirtyDaysAgo;
      let measurementId = this.measurements.length + 1;
      let baseWeight = 45 + Math.random() * 20; // Starting weight

      while (currentTime <= now) {
        // Realistic weight pattern: gradual increase with daily fluctuations
        const daysSinceStart = (currentTime - thirtyDaysAgo) / (24 * 3600000);
        const growthTrend = daysSinceStart * 0.1; // Gradual increase
        const hourOfDay = new Date(currentTime).getHours();
        const dailyFluctuation = Math.sin((hourOfDay / 24) * Math.PI * 2) * 0.5; // Daily cycle

        const weight = baseWeight + growthTrend + dailyFluctuation + (Math.random() - 0.5) * 0.3;

        // Temperature: cooler at night, warmer during day (28-36°C)
        const baseTemp = 32;
        const tempVariation = Math.sin((hourOfDay / 24) * Math.PI * 2) * 3;
        const temperature = baseTemp + tempVariation + (Math.random() - 0.5) * 1;

        // Humidity: inverse correlation with temperature (50-80%)
        const humidity = 70 - (temperature - 32) * 2 + (Math.random() - 0.5) * 5;

        // Signal: random variations
        const signal = 60 + Math.random() * 40;

        this.measurements.push({
          id: measurementId++,
          ruche_id: ruche.id,
          recorded_at: new Date(currentTime),
          weight: Math.round(weight * 100) / 100,
          temperature: Math.round(temperature * 10) / 10,
          humidity: Math.round(Math.max(40, Math.min(90, humidity)) * 10) / 10,
          signal: Math.round(signal),
          raw: {
            sensor_version: '1.2.3',
            battery_voltage: 3.7 + Math.random() * 0.5
          }
        });

        currentTime += measurementInterval;
      }
    });
  }

  private generateAlertRules() {
    // Global weight drop alert
    this.alertRules.push({
      id: 1,
      ruche_id: undefined,
      rule_type: 'weight',
      params: {
        threshold: 35,
        duration: 24
      },
      notify_in_app: true,
      notify_whatsapp: true,
      whatsapp_number: '+33612345678',
      active: true
    });

    // Temperature alert for hive 1
    this.alertRules.push({
      id: 2,
      ruche_id: 1,
      rule_type: 'temperature',
      params: {
        threshold: 38,
        duration: 2
      },
      notify_in_app: true,
      notify_whatsapp: false,
      active: true
    });

    // Humidity alert for hive 2
    this.alertRules.push({
      id: 3,
      ruche_id: 2,
      rule_type: 'humidity',
      params: {
        threshold: 85,
        duration: 12
      },
      notify_in_app: true,
      notify_whatsapp: true,
      whatsapp_number: '+33612345679',
      active: true
    });

    // Signal quality alert (global)
    this.alertRules.push({
      id: 4,
      ruche_id: undefined,
      rule_type: 'signal',
      params: {
        threshold: 20,
        duration: 6
      },
      notify_in_app: true,
      notify_whatsapp: false,
      active: true
    });

    // Weight variation alert for hive 3
    this.alertRules.push({
      id: 5,
      ruche_id: 3,
      rule_type: 'variation',
      params: {
        variation_percentage: 10,
        duration: 24
      },
      notify_in_app: true,
      notify_whatsapp: true,
      whatsapp_number: '+33612345680',
      active: true
    });

    // Inactive temperature alert for hive 4
    this.alertRules.push({
      id: 6,
      ruche_id: 4,
      rule_type: 'temperature',
      params: {
        threshold: 25,
        duration: 6
      },
      notify_in_app: true,
      notify_whatsapp: false,
      active: false
    });
  }

  private generateTriggeredAlerts() {
    const now = Date.now();

    // Recent weight drop alert
    this.triggeredAlerts.push({
      id: 1,
      rule_id: 1,
      ruche_id: 5,
      triggered_at: new Date(now - 2 * 3600000), // 2 hours ago
      payload: {
        current_weight: 33.5,
        previous_weight: 42.1,
        threshold: 35,
        message: 'Weight dropped below threshold'
      },
      sent_whatsapp: true
    });

    // Temperature alert
    this.triggeredAlerts.push({
      id: 2,
      rule_id: 2,
      ruche_id: 1,
      triggered_at: new Date(now - 5 * 3600000), // 5 hours ago
      payload: {
        current_temperature: 39.2,
        threshold: 38,
        message: 'Temperature exceeded threshold'
      },
      sent_whatsapp: false
    });

    // Humidity alert
    this.triggeredAlerts.push({
      id: 3,
      rule_id: 3,
      ruche_id: 2,
      triggered_at: new Date(now - 12 * 3600000), // 12 hours ago
      payload: {
        current_humidity: 87.5,
        threshold: 85,
        message: 'Humidity exceeded threshold'
      },
      sent_whatsapp: true
    });

    // Signal quality alert
    this.triggeredAlerts.push({
      id: 4,
      rule_id: 4,
      ruche_id: 7,
      triggered_at: new Date(now - 18 * 3600000), // 18 hours ago
      payload: {
        current_signal: 15,
        threshold: 20,
        message: 'Signal quality below threshold'
      },
      sent_whatsapp: false
    });

    // Weight variation alert
    this.triggeredAlerts.push({
      id: 5,
      rule_id: 5,
      ruche_id: 3,
      triggered_at: new Date(now - 24 * 3600000), // 24 hours ago
      payload: {
        current_weight: 48.5,
        previous_weight: 55.2,
        variation_percentage: 12.1,
        threshold: 10,
        message: 'Weight variation exceeded threshold'
      },
      sent_whatsapp: true
    });
  }

  // Getter methods
  getRuchers(): Rucher[] {
    return [...this.ruchers];
  }

  getRuches(): Ruche[] {
    return [...this.ruches];
  }

  getMeasurements(): Measurement[] {
    return [...this.measurements];
  }

  getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  getTriggeredAlerts(): TriggeredAlert[] {
    return [...this.triggeredAlerts];
  }

  // Weather data generator
  generateWeatherData(location: string): WeatherData {
    const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'];
    return {
      temperature: 18 + Math.random() * 10,
      humidity: 40 + Math.random() * 40,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      location
    };
  }

  // Find methods
  findRucherById(id: number): Rucher | undefined {
    return this.ruchers.find(r => r.id === id);
  }

  findRucheById(id: number): Ruche | undefined {
    return this.ruches.find(r => r.id === id);
  }

  findRuchesByRucherId(rucherId: number): Ruche[] {
    return this.ruches.filter(r => r.rucher_id === rucherId);
  }

  findMeasurementsByRucheId(rucheId: number): Measurement[] {
    return this.measurements.filter(m => m.ruche_id === rucheId);
  }

  findAlertRuleById(id: number): AlertRule | undefined {
    return this.alertRules.find(r => r.id === id);
  }

  // Add/Update methods
  addRucher(rucher: Rucher): Rucher {
    const maxId = this.ruchers.length > 0
      ? Math.max(...this.ruchers.map(r => r.id))
      : 0;
    const newRucher = { ...rucher, id: maxId + 1 };
    this.ruchers.push(newRucher);
    return newRucher;
  }

  updateRucher(id: number, updates: Partial<Rucher>): Rucher | undefined {
    const index = this.ruchers.findIndex(r => r.id === id);
    if (index !== -1) {
      this.ruchers[index] = { ...this.ruchers[index], ...updates };
      return this.ruchers[index];
    }
    return undefined;
  }

  addRuche(ruche: Ruche): Ruche {
    const maxId = this.ruches.length > 0
      ? Math.max(...this.ruches.map(r => r.id))
      : 0;
    const newRuche = { ...ruche, id: maxId + 1 };
    this.ruches.push(newRuche);
    return newRuche;
  }

  updateRuche(id: number, updates: Partial<Ruche>): Ruche | undefined {
    const index = this.ruches.findIndex(r => r.id === id);
    if (index !== -1) {
      this.ruches[index] = { ...this.ruches[index], ...updates };
      return this.ruches[index];
    }
    return undefined;
  }

  addAlertRule(rule: AlertRule): AlertRule {
    const maxId = this.alertRules.length > 0
      ? Math.max(...this.alertRules.map(r => r.id))
      : 0;
    const newRule = { ...rule, id: maxId + 1 };
    this.alertRules.push(newRule);
    return newRule;
  }

  updateAlertRule(id: number, updates: Partial<AlertRule>): AlertRule | undefined {
    const index = this.alertRules.findIndex(r => r.id === id);
    if (index !== -1) {
      this.alertRules[index] = { ...this.alertRules[index], ...updates };
      return this.alertRules[index];
    }
    return undefined;
  }

  deleteAlertRule(id: number): boolean {
    const index = this.alertRules.findIndex(r => r.id === id);
    if (index !== -1) {
      this.alertRules.splice(index, 1);
      return true;
    }
    return false;
  }
}
