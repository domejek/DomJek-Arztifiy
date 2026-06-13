import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { catchError, of } from 'rxjs';
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

    <div class="content" *ngIf="loading; else loaded">
      <div class="loading">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
        <p>Daten werden geladen...</p>
      </div>
    </div>

    <ng-template #loaded>
      <div class="content error-state" *ngIf="error; else dashboard">
        <mat-icon color="warn" class="error-icon">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadData()">Erneut versuchen</button>
      </div>
    </ng-template>

    <ng-template #dashboard>
      <div class="content" *ngIf="aktuelleWoche">
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
    </ng-template>
  `,
  styles: [`
    .toolbar-spacer { flex: 1 1 auto; }
    .woche-label { margin: 0 8px; font-size: 14px; }
    .content { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .chart-card { padding: 8px; }
    .full-width { grid-column: 1 / -1; }
    .loading { text-align: center; padding: 80px 24px; font-size: 18px; color: #666; }
    .loading-icon { font-size: 48px; height: 48px; width: 48px; margin-bottom: 16px; }
    .error-state { text-align: center; padding: 80px 24px; }
    .error-icon { font-size: 48px; height: 48px; width: 48px; margin-bottom: 16px; }
    .error-state p { font-size: 16px; color: #666; margin-bottom: 24px; }
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
  loading = true;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = null;
    this.dataService.loadAppointments().pipe(
      catchError(() => {
        this.error = 'Daten konnten nicht geladen werden. Bitte versuche es später erneut.';
        this.loading = false;
        return of([]);
      })
    ).subscribe(termine => {
      if (termine.length === 0 && !this.error) {
        this.error = 'Keine Termindaten verfügbar.';
        this.loading = false;
        return;
      }
      if (termine.length > 0) {
        this.alleTermine = termine;
        this.wochen = this.dataService.getWeeklyStats(termine);
        this.wochenIndex = this.wochen.length - 1;
        this.updateTreatmentStats();
      }
      this.loading = false;
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

  private updateTreatmentStats() {
    if (!this.aktuelleWoche) return;
    const start = this.aktuelleWoche.startDatum;
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const endStr = end.toISOString().slice(0, 10);
    const gefiltert = this.alleTermine.filter(t => {
      const d = t.datum.slice(0, 10);
      return d >= start && d <= endStr;
    });
    this.treatmentStats = this.dataService.getTreatmentDistribution(gefiltert);
  }

  vorherigeWoche() {
    if (this.wochenIndex < this.wochen.length - 1) {
      this.wochenIndex++;
      this.updateTreatmentStats();
    }
  }

  naechsteWoche() {
    if (this.wochenIndex > 0) {
      this.wochenIndex--;
      this.updateTreatmentStats();
    }
  }
}
