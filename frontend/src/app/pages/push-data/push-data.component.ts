import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PushItem {
  id: number;
  dashboard: string;
  description: string;
  asOf: string;
  existing: number | null;
  aggregated: number | null;
  confirmedBy: string;
  selected: boolean;
  status: 'Pending' | 'Confirmed' | 'No Data';
}

@Component({
  selector: 'app-push-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './push-data.component.html',
  styleUrl: './push-data.component.css'
})


export class PushDataComponent {

  // Current date and time
  currentDate = new Date();
  
  items: PushItem[] = [
    { id: 1, dashboard: 'REVENUE', description: 'Collected', asOf: '02-10-2026 19:25', existing: 160293233500, aggregated: 169293233500, confirmedBy: 'majaliwa.sangu', selected: false, status: 'Pending' },
    { id: 2, dashboard: 'REVENUE', description: 'Collected Quarter 1', asOf: '02-10-2026 19:26', existing: 40073308375, aggregated: 41073308375, confirmedBy: 'majaliwa.sangu', selected: false, status: 'Pending' },
    { id: 3, dashboard: 'REVENUE', description: 'Collected Quarter 2', asOf: '02-10-2026 19:27', existing: 39073308375, aggregated: 41073308375, confirmedBy: 'majaliwa.sangu', selected: false, status: 'Pending' },
    { id: 4, dashboard: 'REVENUE', description: 'Collected Quarter 3', asOf: '02-10-2026 19:28', existing: 42073308375, aggregated: 43073308375, confirmedBy: 'majaliwa.sangu', selected: false, status: 'Pending' },
    { id: 5, dashboard: 'REVENUE', description: 'Collected Quarter 4', asOf: '02-10-2026 19:29', existing: null, aggregated: null, confirmedBy: '', selected: false, status: 'No Data' },
    { id: 6, dashboard: 'REVENUE', description: 'Annual Estimation', asOf: '02-10-2026 19:30', existing: null, aggregated: null, confirmedBy: '', selected: false, status: 'No Data' },
    { id: 7, dashboard: 'HEALTH', description: 'Total Facilities', asOf: '02-10-2026 19:35', existing: null, aggregated: null, confirmedBy: '', selected: false, status: 'No Data' },
    { id: 8, dashboard: 'HEALTH', description: 'Dispensaries', asOf: '02-10-2026 19:36', existing: null, aggregated: null, confirmedBy: '', selected: false, status: 'No Data' },
    { id: 9, dashboard: 'HEALTH', description: 'Hospitals', asOf: '02-10-2026 19:37', existing: null, aggregated: null, confirmedBy: '', selected: false, status: 'No Data' }
  ];

  dialogItems: PushItem[] = [];
  showDialog = false;
  successMessage = '';

  get selectedItems(): PushItem[] {
    return this.items.filter(x => x.selected && x.status === 'Pending');
  }

  get pendingCount(): number {
    return this.items.filter(x => x.status === 'Pending').length;
  }

  get confirmedCount(): number {
    return this.items.filter(x => x.status === 'Confirmed').length;
  }

  get selectableItems(): PushItem[] {
    return this.items.filter(x => x.status === 'Pending');
  }

  get allSelected(): boolean {
    return this.selectableItems.length > 0 &&
      this.selectableItems.every(x => x.selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectableItems.forEach(x => x.selected = checked);
  }

  openConfirm(item?: PushItem): void {
    const target = item ? [item] : this.selectedItems;
    if (!target.length) return;

    this.dialogItems = [...target];
    this.showDialog = true;
    this.successMessage = '';
  }

  cancel(): void {
    this.showDialog = false;
    this.dialogItems = [];
  }

  confirm(): void {
    const count = this.dialogItems.length;

    this.dialogItems.forEach(x => {
      x.existing = x.aggregated;
      x.status = 'Confirmed';
      x.selected = false;
      x.confirmedBy = 'Demo Business Expert';
    });

    this.cancel();
    this.successMessage = `${count} item(s) confirmed successfully. Demo data updated.`;
  }

  difference(item: PushItem): number | null {
    return item.existing === null || item.aggregated === null
      ? null
      : item.aggregated - item.existing;
  }

  totalDifference(): number {
    return this.dialogItems.reduce((sum, x) =>
      sum + (this.difference(x) ?? 0), 0);
  }
}
