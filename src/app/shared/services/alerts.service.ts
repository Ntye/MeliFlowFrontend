import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AlertRule, TriggeredAlert } from '../types/alert.types';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Get all alert rules
   */
  getAlertRules(): Observable<AlertRule[]> {
    return of(this.mockDataService.getAlertRules()).pipe(delay(200));
  }

  /**
   * Get recent triggered alerts with optional limit
   */
  getTriggeredAlerts(limit?: number): Observable<TriggeredAlert[]> {
    let alerts = this.mockDataService.getTriggeredAlerts();
    
    // Sort by triggered_at descending (most recent first)
    alerts = alerts.sort((a, b) => 
      b.triggered_at.getTime() - a.triggered_at.getTime()
    );

    if (limit) {
      alerts = alerts.slice(0, limit);
    }

    return of(alerts).pipe(delay(200));
  }

  /**
   * Create a new alert rule (mock)
   */
  createAlertRule(rule: AlertRule): Observable<AlertRule> {
    const newRule = this.mockDataService.addAlertRule(rule);
    return of(newRule).pipe(delay(300));
  }

  /**
   * Update an alert rule (mock)
   */
  updateAlertRule(id: number, rule: Partial<AlertRule>): Observable<AlertRule | undefined> {
    const updated = this.mockDataService.updateAlertRule(id, rule);
    return of(updated).pipe(delay(250));
  }

  /**
   * Delete an alert rule (mock)
   */
  deleteAlertRule(id: number): Observable<void> {
    this.mockDataService.deleteAlertRule(id);
    return of(void 0).pipe(delay(200));
  }

  /**
   * Test an alert notification (mock)
   */
  testAlert(rule_id: number): Observable<any> {
    const rule = this.mockDataService.findAlertRuleById(rule_id);
    
    if (!rule) {
      return of({ success: false, message: 'Alert rule not found' }).pipe(delay(100));
    }

    // Simulate sending test notification
    return of({
      success: true,
      message: 'Test notification sent successfully',
      rule_type: rule.rule_type,
      notify_in_app: rule.notify_in_app,
      notify_whatsapp: rule.notify_whatsapp,
      timestamp: new Date()
    }).pipe(delay(500));
  }
}
