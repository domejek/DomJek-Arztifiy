import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { TreatmentStat } from '../models/stats.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-treatment-distribution',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3>Behandlungsarten-Verteilung (wahrgenommen)</h3>
      <div class="chart-wrapper"><canvas #canvas></canvas></div>
    </div>
  `,
  styles: [`
    .chart-container { margin-bottom: 24px; }
    .chart-container h3 { margin: 0 0 12px; font-size: 16px; font-weight: 500; color: #333; }
    .chart-wrapper { height: 300px; }
  `]
})
export class TreatmentDistributionComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() stats: TreatmentStat[] = [];
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

    const colors = ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#8d6e63', '#78909c'];

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.stats.map(s => `${s.behandlungsart} (${s.prozent}%)`),
        datasets: [{
          data: this.stats.map(s => s.anzahl),
          backgroundColor: this.stats.map((_, i) => colors[i % colors.length]),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { font: { size: 12 } } },
        },
      },
    });
  }
}
