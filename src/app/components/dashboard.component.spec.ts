import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { AppointmentData } from '../models/appointment.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  const mockData: AppointmentData = {
    praxis: 'Testpraxis',
    zeitraum: { von: '2026-06-15', bis: '2026-06-19' },
    oeffnungszeiten_hinweis: 'Mo-Fr 08:00-18:00',
    termine: [
      {
        termin_id: 'T-001',
        datum: '2026-06-15T08:00:00',
        dauer_minuten: 30,
        behandlungsart: 'Erstgespräch',
        arzt: 'Dr. Brandt',
        status: 'wahrgenommen',
        neupatient: false,
      },
      {
        termin_id: 'T-002',
        datum: '2026-06-15T09:00:00',
        dauer_minuten: 10,
        behandlungsart: 'Blutabnahme',
        arzt: 'Dr. Yilmaz',
        status: 'no_show',
        neupatient: false,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    httpMock.expectOne('assets/data/data.json').flush(mockData);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load appointments and compute weeks', () => {
    expect(component.wochen.length).toBeGreaterThan(0);
    expect(component.alleTermine.length).toBe(2);
  });

  it('should show toolbar with week navigation', () => {
    const toolbar = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(toolbar).toBeTruthy();
    expect(toolbar.nativeElement.textContent).toContain('KW');
  });

  it('should show KPI cards', () => {
    fixture.detectChanges();
    const kpiCards = fixture.debugElement.queryAll(By.css('.kpi-card'));
    expect(kpiCards.length).toBe(4);
  });

  it('should navigate weeks', () => {
    const initialIndex = component.wochenIndex;
    component.vorherigeWoche();
    expect(component.wochenIndex).toBe(initialIndex >= component.wochen.length - 1 ? initialIndex : initialIndex + 1);
  });
});
