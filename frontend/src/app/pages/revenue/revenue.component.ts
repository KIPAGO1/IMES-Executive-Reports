import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevenueService } from './revenue.service';
import { RevenueRecord, RevenueFilters, RevenueBreakdown } from './revenue.model';
import { TranslatePipe } from '../../core/translate.pipe';

@Component({
  standalone: true,
  selector: 'app-revenue',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css'
})
export class RevenueComponent implements OnInit {
  rows: RevenueRecord[] = [];
  filtered: RevenueRecord[] = [];
  loading = true;
  error = '';
  filters: RevenueFilters = {financialYear: '2026/2027', quarter: 'All', mainSource: 'All', region: 'All', district: 'All'};
  years: string[] = [];
  regions: string[] = [];
  sources: string[] = [];
  districts: string[] = [];
  plan = 0;
  collected = 0;
  uncollected = 0;
  percent = 0;
  quarters: RevenueBreakdown[] = [];
  regionPerformance: RevenueBreakdown[] = [];
  sourcePerformance: RevenueBreakdown[] = [];
  protectionPerformance: RevenueBreakdown[] = [];
  constructor(private revenue: RevenueService) {}
  async ngOnInit(): Promise<void> {
    try {
      this.rows = await this.revenue.load();
      this.years = this.unique(this.rows.map(r => r.financialYear));
      this.regions = this.unique(this.rows.map(r => r.region));
      this.sources = this.unique(this.rows.map(r => r.mainSource));
      this.updateDistricts();
      this.apply();
    } catch (e) { this.error = e instanceof Error ? e.message : 'Unable to load revenue data'; }
    finally { this.loading = false; }
  }
  unique(values: string[]): string[] { return [...new Set(values)].sort(); }
  updateDistricts(): void {
    this.districts = this.unique(this.rows.filter(r => this.filters.region === 'All' || r.region === this.filters.region).map(r => r.district));
    if (this.filters.district !== 'All' && !this.districts.includes(this.filters.district)) this.filters.district = 'All';
    this.apply();
  }
  apply(): void {
    this.filtered = this.revenue.filter(this.rows, this.filters);
    this.plan = this.revenue.sum(this.filtered, 'plan');
    this.collected = this.revenue.sum(this.filtered, 'collected');
    this.uncollected = Math.max(0, this.plan - this.collected);
    this.percent = this.plan ? this.collected / this.plan * 100 : 0;
    const quarterData = this.revenue.group(this.filtered, 'quarter');
    this.quarters = [1,2,3,4].map(q => quarterData.find(d => d.label === 'Quarter ' + q) || {label:'Quarter '+q, plan:0, collected:0, percent:0});
    this.regionPerformance = this.revenue.group(this.filtered, 'region').sort((a,b) => b.percent - a.percent);
    this.sourcePerformance = this.revenue.group(this.filtered, 'mainSource').sort((a,b) => b.collected - a.collected);
    this.protectionPerformance = this.revenue.group(this.filtered, 'protection');
  }
  get remainingPercent(): number { return this.plan ? this.uncollected / this.plan * 100 : 0; }
  get maxQuarter(): number { return Math.max(1, ...this.quarters.map(q => q.collected)); }
  money(value: number): string { return new Intl.NumberFormat('en-TZ', {maximumFractionDigits:0}).format(value); }
  compact(value: number): string { return value >= 1e12 ? (value / 1e12).toFixed(2)+'T' : value >= 1e9 ? (value / 1e9).toFixed(2)+'B' : value >= 1e6 ? (value / 1e6).toFixed(1)+'M' : this.money(value); }
  performanceColor(value: number): string { return value < 25 ? '#df3535' : value < 50 ? '#f2c12e' : value < 75 ? '#2984d6' : '#0ca765'; }
  get planDonut(): string { return `conic-gradient(#00a9e7 0% ${this.percent}%,#f43b44 ${this.percent}% 100%)`; }
  get protectionDonut(): string {
    const protectedAmount = this.protectionPerformance.find(p => p.label === 'Protected')?.collected || 0;
    const share = this.collected ? protectedAmount / this.collected * 100 : 0;
    return `conic-gradient(#0ca765 0% ${share}%,#1e86d4 ${share}% 100%)`;
  }
  get protectedShare(): number { return this.collected ? (this.protectionPerformance.find(p => p.label === 'Protected')?.collected || 0) / this.collected * 100 : 0; }
}
