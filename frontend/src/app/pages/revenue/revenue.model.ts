export interface RevenueRecord {
  financialYear: string;
  quarter: number;
  region: string;
  district: string;
  mainSource: string;
  protection: 'Protected' | 'Unprotected';
  plan: number;
  collected: number;
}
export interface RevenueFilters {
  financialYear: string;
  quarter: string;
  mainSource: string;
  region: string;
  district: string;
}
export interface RevenueBreakdown { label: string; plan: number; collected: number; percent: number; }
