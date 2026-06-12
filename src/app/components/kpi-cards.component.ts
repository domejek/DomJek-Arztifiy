import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DailyStats } from '../models/stats.interface';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="kpi-grid">
      <mat-card class="kpi-card">
        <mat-card-content>
          <mat-icon class="kpi-icon" color="primary">calendar_today</mat-icon>
          <div class="kpi-value">{{ durchschnittsAuslastung }}%</div>
          <div class="kpi-label">Ø Auslastung (Woche)</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="kpi-card">
        <mat-card-content>
          <mat-icon class="kpi-icon" [color]="noShowRate > 15 ? 'warn' : 'primary'">event_busy</mat-icon>
          <div class="kpi-value">{{ noShowRate }}%</div>
          <div class="kpi-label">No-Show-Rate (Woche)</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="kpi-card">
        <mat-card-content>
          <mat-icon class="kpi-icon" color="primary">people</mat-icon>
          <div class="kpi-value">{{ gesamtTermine }}</div>
          <div class="kpi-label">Termine (Woche)</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="kpi-card">
        <mat-card-content>
          <mat-icon class="kpi-icon" color="primary">assignment_turned_in</mat-icon>
          <div class="kpi-value">{{ wahrgenommenProzent }}%</div>
          <div class="kpi-label">Wahrgenommen (Woche)</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card { text-align: center; }
    .kpi-icon { font-size: 32px; height: 32px; width: 32px; margin-bottom: 8px; }
    .kpi-value { font-size: 28px; font-weight: 500; color: #333; }
    .kpi-label { font-size: 13px; color: #666; margin-top: 4px; }
  `]
})
export class KpiCardsComponent {
  @Input() durchschnittsAuslastung = 0;
  @Input() noShowRate = 0;
  @Input() gesamtTermine = 0;
  @Input() wahrgenommenProzent = 0;
}
