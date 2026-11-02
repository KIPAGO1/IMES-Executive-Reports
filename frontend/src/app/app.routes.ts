
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EducationComponent } from './pages/education/education.component';
import { RevenueComponent } from './pages/revenue/revenue.component';
import { ExpendituresComponent } from './pages/expenditures/expenditures.component';
import { ChwComponent } from './pages/chw/chw.component';
import { HealthComponent } from './pages/health/health.component';
import { PlanningImplementationsComponent } from './pages/planning_and_implementations/planning-and-implementations.component';
import { LoansComponent } from './pages/loans/loans.component';

// Push Data to Dashboard / Reports
import { PushDataComponent } from './pages/push-data/push-data.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'education',
    component: EducationComponent,
    canActivate: [authGuard]
  },
  {
    path: 'revenue',
    component: RevenueComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expenditures',
    component: ExpendituresComponent,
    canActivate: [authGuard]
  },
  {
    path: 'chw',
    component: ChwComponent,
    canActivate: [authGuard]
  },
  {
    path: 'health',
    component: HealthComponent,
    canActivate: [authGuard]
  },
  {
    path: 'planning_and_implementations',
    component: PlanningImplementationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'loans',
    component: LoansComponent,
    canActivate: [authGuard]
  },

  // Business Expert: Push Data Confirmation
  {
    path: 'push-data',
    component: PushDataComponent,
    canActivate: [authGuard],
    title: 'Push Data to Dashboard / Reports | IMES'
  },

  // Default route
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
