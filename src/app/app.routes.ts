import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'hives',
    loadComponent: () => import('./pages/ruches/ruches-list.component').then(m => m.RuchesListComponent)
  },
  {
    path: 'hives/:id',
    loadComponent: () => import('./pages/ruches/ruche-detail.component').then(m => m.RucheDetailComponent)
  },
  {
    path: 'apiaries',
    loadComponent: () => import('./pages/ruchers/ruchers-list.component').then(m => m.RuchersListComponent)
  },
  {
    path: 'apiaries/:id',
    loadComponent: () => import('./pages/ruchers/rucher-detail.component').then(m => m.RucherDetailComponent)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'config',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  }
];
