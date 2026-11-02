
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  modules = [
    {
      route: '/education',
      name: 'education',
      icon: 'assets/elimu.png'
    },
    {
      route: '/health',
      name: 'health',
      icon: 'assets/afya.png'
    },
    {
      route: '/chw',
      name: 'chw',
      icon: 'assets/chw.png'
    },
    {
      route: '/revenue',
      name: 'revenue',
      icon: 'assets/mapato.png'
    },
    {
      route: '/expenditures',
      name: 'expenditures',
      icon: 'assets/matumizi.png'
    },
    {
      route: '/loans',
      name: 'loans',
      icon: 'assets/mikopo.png'
    },
    {
      route: '/planning_and_implementations',
      name: 'planning',
      icon: 'assets/mipango.png'
    },

    // Business Expert Workspace
    {
      route: '/push-data',
      name: 'BUSINESS EXPERT WORKSPACE',
      icon: 'assets/icons/business-expert.svg'
    }
  ];

}
