import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  protected isCollapsed = signal(false);
  
  protected navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/dashboard'
    },
    {
      label: 'My Hives',
      icon: '🐝',
      route: '/hives'
    },
    {
      label: 'My Apiaries',
      icon: '🏞️',
      route: '/apiaries'
    },
    {
      label: 'Alerts',
      icon: '🔔',
      route: '/alerts'
    },
    {
      label: 'Configuration',
      icon: '⚙️',
      route: '/config'
    }
  ];

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}
