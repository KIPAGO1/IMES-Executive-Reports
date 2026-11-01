import { Injectable } from '@angular/core';
import {
  HealthData,
  HealthFilters,
  HealthRecord,
  HealthInventory
} from './health.model';

@Injectable({ providedIn: 'root' })
export class HealthService {

  private readonly dataUrl = 'assets/data/health-demo.json';

  async load(): Promise<HealthData> {
    const response = await fetch(this.dataUrl);

    if (!response.ok) {
      throw new Error(
        `Health data loading failed: HTTP ${response.status}`
      );
    }

    const data: HealthData = await response.json();

    if (!Array.isArray(data.records) || !Array.isArray(data.inventory)) {
      throw new Error('Invalid health-demo.json structure');
    }

    return data;
  }

  filterRecords(rows: HealthRecord[], f: HealthFilters): HealthRecord[] {
    return rows.filter(r =>
      (f.year === 'All' || r.year === Number(f.year)) &&
      (f.region === 'All' || r.region === f.region) &&
      (f.district === 'All' || r.district === f.district)
    );
  }

  filterInventory(rows: HealthInventory[], f: HealthFilters): HealthInventory[] {
    return rows.filter(r =>
      (f.year === 'All' || r.year === Number(f.year)) &&
      (f.region === 'All' || r.region === f.region) &&
      (f.district === 'All' || r.district === f.district)
    );
  }
}