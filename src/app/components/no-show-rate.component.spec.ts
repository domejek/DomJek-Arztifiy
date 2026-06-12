import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoShowRateComponent } from './no-show-rate.component';
import { DailyStats } from '../models/stats.interface';

describe('NoShowRateComponent', () => {
  let component: NoShowRateComponent;
  let fixture: ComponentFixture<NoShowRateComponent>;

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
    {
      datum: '2026-06-16',
      wochentag: 'Di',
      auslastungProzent: 50,
      geplanteMinuten: 150,
      wahrgenommeneMinuten: 100,
      terminAnzahl: 8,
      noShowAnzahl: 3,
      noShowRate: 38,
      abgesagtAnzahl: 0,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoShowRateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoShowRateComponent);
    component = fixture.componentInstance;
    component.tage = mockTage;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render no-show items for each day', () => {
    const items = fixture.nativeElement.querySelectorAll('.no-show-item');
    expect(items.length).toBe(2);
  });

  it('should display correct percentages', () => {
    const rates = fixture.nativeElement.querySelectorAll('.rate');
    expect(rates[0].textContent).toContain('10');
    expect(rates[1].textContent).toContain('38');
  });

  it('should return appropriate color for rate', () => {
    expect(component.getColor(38)).toBe('#ef5350');
    expect(component.getColor(20)).toBe('#ffa726');
    expect(component.getColor(5)).toBe('#66bb6a');
    expect(component.getColor(0)).toBe('#9e9e9e');
  });
});
