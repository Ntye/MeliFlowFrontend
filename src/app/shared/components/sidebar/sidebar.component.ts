import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
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
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'My Hives', route: '/hives' },
    { label: 'My Apiaries', route: '/apiaries' },
    { label: 'Alerts', route: '/alerts' },
    { label: 'Configuration', route: '/config' }
  ];

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}
