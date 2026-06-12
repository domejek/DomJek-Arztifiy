import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DailyStats } from '../models/stats.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-utilization-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3>Auslastung pro Tag (KW {{ kw }})</h3>
      <div class="chart-wrapper"><canvas #canvas></canvas></div>
    </div>
  `,
  styles: [`
    .chart-container { margin-bottom: 24px; }
    .chart-container h3 { margin: 0 0 12px; font-size: 16px; font-weight: 500; color: #333; }
    .chart-wrapper { height: 300px; }
  `]
})
export class UtilizationChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() tage: DailyStats[] = [];
  @Input() kw = 0;
  private chart?: Chart;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges() {
    if (this.canvas) this.createChart();
  }

  private createChart() {
    if (this.chart) this.chart.destroy();
    if (!this.canvas) return;

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.tage.map(t => `${t.wochentag}\n${t.datum.slice(5)}`),
        datasets: [{
          label: 'Auslastung (%)',
          data: this.tage.map(t => t.auslastungProzent),
          backgroundColor: this.tage.map(t =>
            t.auslastungProzent > 80 ? '#ef5350' :
            t.auslastungProzent > 60 ? '#ffa726' :
            '#66bb6a'
          ),
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value) => `${value}%` },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }
}
