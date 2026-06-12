import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilizationChartComponent } from './utilization-chart.component';
import { DailyStats } from '../models/stats.interface';

describe('UtilizationChartComponent', () => {
  let component: UtilizationChartComponent;
  let fixture: ComponentFixture<UtilizationChartComponent>;

  const mockTage: DailyStats[] = [
    {
      datum: '2026-06-15',
      wochentag: 'Mo',
      auslastungProzent: 75,
      geplanteMinuten: 200,
      wahrgenommeneMinuten: 180,
      terminAnzahl: 10,
      noShowAnzahl: 1,
      noShowRate: 10,
      abgesagtAnzahl: 1,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilizationChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilizationChartComponent);
    component = fixture.componentInstance;
    component.tage = mockTage;
    component.kw = 25;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show week number', () => {
    const heading = fixture.nativeElement.querySelector('h3');
    expect(heading.textContent).toContain('KW 25');
  });

  it('should render canvas element', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });
});
