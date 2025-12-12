import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { BreadcrumbItem, AlertRule, Alert, Ruche } from '../../shared/types/common.types';

@Component({
  selector: 'app-alerts-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    CardComponent,
    SectionTitleComponent
  ],
  templateUrl: './alerts-config.component.html'
})
export class AlertsConfigComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Alerts Configuration', icon: '🔔' }
  ];

  alertRules: AlertRule[] = [];
  recentAlerts: Alert[] = [];
  ruches: Ruche[] = [];

  selectedTab: 'rules' | 'history' = 'rules';
  showCreateModal = false;
  showEditModal = false;
  editingRule?: AlertRule;

  // Form fields
  newRule = {
    name: '',
    rucheId: undefined as string | undefined,
    type: 'weight_min' as AlertRule['type'],
    threshold: 30,
    enabled: true,
    notificationChannels: ['in_app'] as ('in_app' | 'whatsapp')[],
    whatsappNumber: ''
  };

  loading = true;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;

    // Load alert rules
    this.mockDataService.getAlertRules().subscribe(rules => {
      this.alertRules = rules;
      this.loading = false;
    });

    // Load recent alerts
    this.mockDataService.getAlerts().subscribe(alerts => {
      this.recentAlerts = alerts.slice(0, 10);
    });

    // Load ruches for dropdown
    this.mockDataService.getRuches().subscribe(ruches => {
      this.ruches = ruches;
    });
  }

  selectTab(tab: 'rules' | 'history'): void {
    this.selectedTab = tab;
  }

  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  openEditModal(rule: AlertRule): void {
    this.editingRule = rule;
    this.newRule = {
      name: rule.name,
      rucheId: rule.rucheId,
      type: rule.type,
      threshold: rule.threshold,
      enabled: rule.enabled,
      notificationChannels: [...rule.notificationChannels],
      whatsappNumber: rule.whatsappNumber || ''
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingRule = undefined;
    this.resetForm();
  }

  resetForm(): void {
    this.newRule = {
      name: '',
      rucheId: undefined,
      type: 'weight_min',
      threshold: 30,
      enabled: true,
      notificationChannels: ['in_app'],
      whatsappNumber: ''
    };
  }

  createRule(): void {
    this.mockDataService.createAlertRule(this.newRule).subscribe(rule => {
      this.alertRules.push(rule);
      this.closeCreateModal();
    });
  }

  updateRule(): void {
    if (!this.editingRule) return;

    this.mockDataService.updateAlertRule(this.editingRule.id, this.newRule).subscribe(updatedRule => {
      if (updatedRule) {
        const index = this.alertRules.findIndex(r => r.id === updatedRule.id);
        if (index !== -1) {
          this.alertRules[index] = updatedRule;
        }
      }
      this.closeEditModal();
    });
  }

  deleteRule(rule: AlertRule): void {
    // TODO: Replace with custom confirmation modal for better UX
    if (confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
      this.mockDataService.deleteAlertRule(rule.id).subscribe(success => {
        if (success) {
          this.alertRules = this.alertRules.filter(r => r.id !== rule.id);
        }
      });
    }
  }

  toggleRuleEnabled(rule: AlertRule): void {
    this.mockDataService.updateAlertRule(rule.id, { enabled: !rule.enabled }).subscribe(updatedRule => {
      if (updatedRule) {
        const index = this.alertRules.findIndex(r => r.id === updatedRule.id);
        if (index !== -1) {
          this.alertRules[index] = updatedRule;
        }
      }
    });
  }

  testAlert(rule: AlertRule): void {
    // TODO: Replace with toast notification system for better UX
    alert(`Test notification sent for rule: ${rule.name}\nThis would send a test message to the configured channels.`);
  }

  toggleChannel(channel: 'in_app' | 'whatsapp'): void {
    const index = this.newRule.notificationChannels.indexOf(channel);
    if (index === -1) {
      this.newRule.notificationChannels.push(channel);
    } else {
      this.newRule.notificationChannels.splice(index, 1);
    }
  }

  hasChannel(channel: 'in_app' | 'whatsapp'): boolean {
    return this.newRule.notificationChannels.includes(channel);
  }

  getAlertTypeLabel(type: AlertRule['type']): string {
    const labels: Record<AlertRule['type'], string> = {
      'weight_min': 'Minimum Weight',
      'weight_variation': 'Rapid Weight Variation',
      'temperature_high': 'High Temperature',
      'temperature_low': 'Low Temperature',
      'humidity_high': 'High Humidity',
      'humidity_low': 'Low Humidity'
    };
    return labels[type];
  }

  getRucheNameById(id?: string): string {
    if (!id) return 'All Hives (Global)';
    const ruche = this.ruches.find(r => r.id === id);
    return ruche ? ruche.name : 'Unknown';
  }

  getSeverityBadgeClass(severity: string): string {
    const classes: Record<string, string> = {
      'info': 'bg-info-light text-info-dark',
      'warning': 'bg-warning-light text-warning-dark',
      'critical': 'bg-error-light text-error-dark'
    };
    return classes[severity] || 'bg-neutral-200 text-neutral-700';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getActiveAlertsCount(): number {
    return this.recentAlerts.filter(a => !a.resolved).length;
  }
}
