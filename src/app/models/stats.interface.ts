export interface DailyStats {
  datum: string;
  wochentag: string;
  auslastungProzent: number;
  geplanteMinuten: number;
  wahrgenommeneMinuten: number;
  terminAnzahl: number;
  noShowAnzahl: number;
  noShowRate: number;
  abgesagtAnzahl: number;
}

export interface WeeklyStats {
  kw: number;
  jahr: number;
  startDatum: string;
  tage: DailyStats[];
  durchschnittsAuslastung: number;
  gesamteNoShowRate: number;
}

export interface TreatmentStat {
  behandlungsart: string;
  anzahl: number;
  prozent: number;
}
