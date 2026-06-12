import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyStats } from '../models/stats.interface';

@Component({
  selector: 'app-no-show-rate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="no-show-container">
      <h3>No-Show-Rate pro Tag</h3>
      <div class="no-show-grid">
        <div *ngFor="let tag of tage" class="no-show-item" [style.background]="getColor(tag.noShowRate)">
          <div class="day">{{ tag.wochentag }}</div>
          <div class="rate">{{ tag.noShowRate }}%</div>
          <div class="count">{{ tag.noShowAnzahl }} von {{ tag.terminAnzahl - tag.abgesagtAnzahl }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .no-show-container { margin-bottom: 24px; }
    .no-show-container h3 { margin: 0 0 12px; font-size: 16px; font-weight: 500; color: #333; }
    .no-show-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; }
    .no-show-item { text-align: center; padding: 12px 8px; border-radius: 8px; color: white; font-weight: 500; }
    .day { font-size: 13px; opacity: 0.9; }
    .rate { font-size: 22px; font-weight: 700; }
    .count { font-size: 11px; opacity: 0.8; }
  `]
})
export class NoShowRateComponent {
  @Input() tage: DailyStats[] = [];

  getColor(rate: number): string {
    if (rate >= 30) return '#ef5350';
    if (rate >= 15) return '#ffa726';
    if (rate > 0) return '#66bb6a';
    return '#9e9e9e';
  }
}
