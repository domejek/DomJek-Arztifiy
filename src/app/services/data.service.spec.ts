import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Appointment } from '../models/appointment.interface';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockAppointments: Appointment[] = [
    {
      termin_id: 'T-001',
      datum: '2026-06-15T08:30:00',
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
    {
      termin_id: 'T-003',
      datum: '2026-06-15T10:00:00',
      dauer_minuten: 20,
      behandlungsart: 'Wundversorgung',
      arzt: 'Dr. Sommer',
      status: 'abgesagt',
      neupatient: true,
    },
    {
      termin_id: 'T-004',
      datum: '2026-06-22T08:00:00',
      dauer_minuten: 15,
      behandlungsart: 'Kontrolluntersuchung',
      arzt: 'Dr. Brandt',
      status: 'wahrgenommen',
      neupatient: false,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load appointments from JSON', () => {
    service.loadAppointments().subscribe(data => {
      expect(data.length).toBe(4);
      expect(data[0].termin_id).toBe('T-001');
    });

    const req = httpMock.expectOne('assets/data.json');
    expect(req.request.method).toBe('GET');
    req.flush({ termine: mockAppointments });
  });

  it('should compute weekly stats correctly', () => {
    const stats = service.getWeeklyStats(mockAppointments);

    expect(stats.length).toBe(2);

    const firstWeek = stats[0];
    expect(firstWeek.tage.length).toBe(1);
    expect(firstWeek.tage[0].datum).toBe('2026-06-15');
    expect(firstWeek.tage[0].auslastungProzent).toBeGreaterThan(0);
  });

  it('should compute no-show rate', () => {
    const noShows = mockAppointments.filter(a => a.status === 'no_show');
    const aktive = mockAppointments.filter(a => a.status !== 'abgesagt');
    expect(noShows.length / aktive.length).toBe(1 / 3);
  });

  it('should compute treatment distribution', () => {
    const distribution = service.getTreatmentDistribution(mockAppointments);
    const erstgespraech = distribution.find(d => d.behandlungsart === 'Erstgespräch');
    expect(erstgespraech).toBeDefined();
    expect(erstgespraech!.anzahl).toBe(1);
  });

  it('should handle empty appointments', () => {
    const stats = service.getWeeklyStats([]);
    expect(stats.length).toBe(0);

    const dist = service.getTreatmentDistribution([]);
    expect(dist.length).toBe(0);
  });
});
