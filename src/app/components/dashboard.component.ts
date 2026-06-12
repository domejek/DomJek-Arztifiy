import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../services/data.service';
import { Appointment } from '../models/appointment.interface';
import { WeeklyStats, TreatmentStat } from '../models/stats.interface';
import { KpiCardsComponent } from '../components/kpi-cards.component';
import { UtilizationChartComponent } from '../components/utilization-chart.component';
import { NoShowRateComponent } from '../components/no-show-rate.component';
import { TreatmentDistributionComponent } from '../components/treatment-distribution.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    KpiCardsComponent,
    UtilizationChartComponent,
    NoShowRateComponent,
    TreatmentDistributionComponent,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Arztpraxis am Stadtpark – Auslastungs-Dashboard</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button (click)="vorherigeWoche()" [disabled]="wochenIndex >= wochen.length - 1">
        <mat-icon>chevron_left</mat-icon>
      </button>
      <span class="woche-label">KW {{ aktuelleWoche?.kw }} / {{ aktuelleWoche?.jahr }}</span>
      <button mat-icon-button (click)="naechsteWoche()" [disabled]="wochenIndex <= 0">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </mat-toolbar>

    <div class="content" *ngIf="aktuelleWoche; else loading">
      <app-kpi-cards
        [durchschnittsAuslastung]="aktuelleWoche.durchschnittsAuslastung"
        [noShowRate]="aktuelleWoche.gesamteNoShowRate"
        [gesamtTermine]="gesamtTermine"
        [wahrgenommenProzent]="wahrgenommenProzent"
      ></app-kpi-cards>

      <div class="chart-grid">
        <mat-card class="chart-card full-width">
          <mat-card-content>
            <app-utilization-chart
              [tage]="aktuelleWoche.tage"
              [kw]="aktuelleWoche.kw"
            ></app-utilization-chart>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-content>
            <app-no-show-rate
              [tage]="aktuelleWoche.tage"
            ></app-no-show-rate>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-content>
            <app-treatment-distribution
              [stats]="treatmentStats"
            ></app-treatment-distribution>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">Daten werden geladen...</div>
    </ng-template>
  `,
  styles: [`
    .toolbar-spacer { flex: 1 1 auto; }
    .woche-label { margin: 0 8px; font-size: 14px; }
    .content { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .chart-card { padding: 8px; }
    .full-width { grid-column: 1 / -1; }
    .loading { text-align: center; padding: 48px; font-size: 18px; color: #666; }
    @media (max-width: 768px) {
      .content { padding: 12px; }
      .chart-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  wochen: WeeklyStats[] = [];
  wochenIndex = 0;
  alleTermine: Appointment[] = [];
  treatmentStats: TreatmentStat[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.loadAppointments().subscribe(termine => {
      this.alleTermine = termine;
      this.wochen = this.dataService.getWeeklyStats(termine);
      this.wochenIndex = this.wochen.length - 1;
      this.treatmentStats = this.dataService.getTreatmentDistribution(termine);
    });
  }

  get aktuelleWoche(): WeeklyStats | undefined {
    return this.wochen[this.wochenIndex];
  }

  get gesamtTermine(): number {
    return this.aktuelleWoche?.tage.reduce((s, t) => s + t.terminAnzahl, 0) ?? 0;
  }

  get wahrgenommenProzent(): number {
    if (!this.aktuelleWoche) return 0;
    const total = this.aktuelleWoche.tage.reduce((s, t) => s + t.terminAnzahl, 0);
    const wahrgenommen = this.aktuelleWoche.tage.reduce(
      (s, t) => s + t.terminAnzahl - t.noShowAnzahl - t.abgesagtAnzahl, 0
    );
    return total > 0 ? Math.round((wahrgenommen / total) * 100) : 0;
  }

  vorherigeWoche() {
    if (this.wochenIndex < this.wochen.length - 1) this.wochenIndex++;
  }

  naechsteWoche() {
    if (this.wochenIndex > 0) this.wochenIndex--;
  }
}
