import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreatmentDistributionComponent } from './treatment-distribution.component';
import { TreatmentStat } from '../models/stats.interface';

describe('TreatmentDistributionComponent', () => {
  let component: TreatmentDistributionComponent;
  let fixture: ComponentFixture<TreatmentDistributionComponent>;

  const mockStats: TreatmentStat[] = [
    { behandlungsart: 'EKG', anzahl: 10, prozent: 40 },
    { behandlungsart: 'Blutabnahme', anzahl: 8, prozent: 32 },
    { behandlungsart: 'Impfung', anzahl: 7, prozent: 28 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentDistributionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreatmentDistributionComponent);
    component = fixture.componentInstance;
    component.stats = mockStats;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show chart heading', () => {
    const heading = fixture.nativeElement.querySelector('h3');
    expect(heading.textContent).toContain('Behandlungsarten');
  });

  it('should have canvas element', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });
});
