export interface Appointment {
  termin_id: string;
  datum: string;
  dauer_minuten: number;
  behandlungsart: string;
  arzt: string;
  status: 'wahrgenommen' | 'no_show' | 'abgesagt' | null;
  neupatient: boolean;
}

export interface AppointmentData {
  praxis: string;
  zeitraum: { von: string; bis: string };
  oeffnungszeiten_hinweis: string;
  termine: Appointment[];
}
