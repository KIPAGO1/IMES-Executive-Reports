import { Injectable } from '@angular/core';
import { RevenueRecord, RevenueFilters, RevenueBreakdown } from './revenue.model';

@Injectable({ providedIn: 'root' })
export class RevenueService {
  private recordsPromise?: Promise<RevenueRecord[]>;
  load(): Promise<RevenueRecord[]> {
    if (!this.recordsPromise) {
      this.recordsPromise = fetch('assets/data/revenue-demo.json')
        .then(response => { if (!response.ok) throw new Error('Unable to load revenue-demo.json'); return response.json(); })
        .catch(error => { this.recordsPromise = undefined; throw error; });
    }
    return this.recordsPromise;
  }
  filter(rows: RevenueRecord[], f: RevenueFilters): RevenueRecord[] {
    return rows.filter(r =>
      (f.financialYear === 'All' || r.financialYear === f.financialYear) &&
      (f.quarter === 'All' || r.quarter === Number(f.quarter)) &&
      (f.mainSource === 'All' || r.mainSource === f.mainSource) &&
      (f.region === 'All' || r.region === f.region) &&
      (f.district === 'All' || r.district === f.district)
    );
  }
  sum(rows: RevenueRecord[], key: 'plan' | 'collected'): number { return rows.reduce((total, row) => total + row[key], 0); }
  group(rows: RevenueRecord[], key: 'region' | 'mainSource' | 'protection' | 'quarter'): RevenueBreakdown[] {
    const groups = new Map<string, {plan: number; collected: number}>();
    rows.forEach(r => {
      const label = key === 'quarter' ? 'Quarter ' + r.quarter : String(r[key]);
      const g = groups.get(label) || {plan: 0, collected: 0};
      g.plan += r.plan; g.collected += r.collected; groups.set(label, g);
    });
    return [...groups.entries()].map(([label, g]) => ({label, ...g, percent: g.plan ? g.collected / g.plan * 100 : 0}));
  }
}
