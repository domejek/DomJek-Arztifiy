import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Appointment, AppointmentData } from '../models/appointment.interface';
import { DailyStats, WeeklyStats, TreatmentStat } from '../models/stats.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly dataUrl = 'assets/data/data.json';
  private readonly WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  private readonly MINUTEN_PRO_ARZT = 540;

  constructor(private http: HttpClient) {}

  loadAppointments(): Observable<Appointment[]> {
    return this.http.get<AppointmentData>(this.dataUrl).pipe(
      map(data => data.termine)
    );
  }

  getWeeklyStats(appointments: Appointment[]): WeeklyStats[] {
    const wochenMap = new Map<string, Appointment[]>();
    for (const term of appointments) {
      const datum = new Date(term.datum);
      const kw = this.getKW(datum);
      const jahr = datum.getFullYear();
      const key = `${jahr}-W${kw}`;
      if (!wochenMap.has(key)) wochenMap.set(key, []);
      wochenMap.get(key)!.push(term);
    }

    const stats: WeeklyStats[] = [];
    for (const [key, termine] of wochenMap) {
      const [jahrStr, kwStr] = key.split('-W');
      const jahr = parseInt(jahrStr);
      const kw = parseInt(kwStr);
      const tage = this.berechneTagesStats(termine);
      const durchschnittsAuslastung = tage.length > 0
        ? tage.reduce((s, t) => s + t.auslastungProzent, 0) / tage.length
        : 0;
      const gesamteNoShowRate = this.berechneNoShowRate(termine);
      const startDatum = this.getStartOfWeek(datumFromFirstAppointment(termine));

      stats.push({
        kw,
        jahr,
        startDatum,
        tage,
        durchschnittsAuslastung,
        gesamteNoShowRate,
      });
    }

    return stats.sort((a, b) => a.jahr !== b.jahr ? a.jahr - b.jahr : a.kw - b.kw);
  }

  getTreatmentDistribution(appointments: Appointment[]): TreatmentStat[] {
    const map = new Map<string, number>();
    let total = 0;
    for (const term of appointments) {
      if (term.status === 'wahrgenommen') {
        const art = term.behandlungsart;
        map.set(art, (map.get(art) || 0) + 1);
        total++;
      }
    }
    return Array.from(map.entries())
      .map(([behandlungsart, anzahl]) => ({
        behandlungsart,
        anzahl,
        prozent: total > 0 ? Math.round((anzahl / total) * 100) : 0,
      }))
      .sort((a, b) => b.anzahl - a.anzahl);
  }

  private berechneTagesStats(termine: Appointment[]): DailyStats[] {
    const tageMap = new Map<string, Appointment[]>();
    for (const term of termine) {
      const tag = term.datum.slice(0, 10);
      if (!tageMap.has(tag)) tageMap.set(tag, []);
      tageMap.get(tag)!.push(term);
    }

    return Array.from(tageMap.entries())
      .map(([datum, terms]) => {
        const d = new Date(datum);
        const wochentag = this.WOCHENTAGE[d.getDay()];
        const uniqueDocs = new Set(terms.map(t => t.arzt)).size;
        const isSaturday = d.getDay() === 6;
        const maxMinuten = uniqueDocs * (isSaturday ? 240 : this.MINUTEN_PRO_ARZT);

        const wahrgenommene = terms
          .filter(t => t.status === 'wahrgenommen')
          .reduce((s, t) => s + t.dauer_minuten, 0);
        const geplante = terms
          .filter(t => t.status !== 'abgesagt')
          .reduce((s, t) => s + t.dauer_minuten, 0);
        const noShows = terms.filter(t => t.status === 'no_show').length;
        const abgesagt = terms.filter(t => t.status === 'abgesagt').length;

        const aktiveTermine = terms.filter(t => t.status !== 'abgesagt');
        const noShowRate = aktiveTermine.length > 0
          ? Math.round((noShows / aktiveTermine.length) * 100)
          : 0;

        return {
          datum,
          wochentag,
          auslastungProzent: maxMinuten > 0
            ? Math.round((wahrgenommene / maxMinuten) * 100)
            : 0,
          geplanteMinuten: geplante,
          wahrgenommeneMinuten: wahrgenommene,
          terminAnzahl: terms.length,
          noShowAnzahl: noShows,
          noShowRate,
          abgesagtAnzahl: abgesagt,
        };
      })
      .sort((a, b) => a.datum.localeCompare(b.datum));
  }

  private berechneNoShowRate(termine: Appointment[]): number {
    const aktive = termine.filter(t => t.status !== 'abgesagt');
    const noShows = termine.filter(t => t.status === 'no_show').length;
    return aktive.length > 0 ? Math.round((noShows / aktive.length) * 100) : 0;
  }

  private getKW(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  private getStartOfWeek(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  }
}

function datumFromFirstAppointment(termine: Appointment[]): Date {
  const sorted = [...termine].sort((a, b) => a.datum.localeCompare(b.datum));
  return new Date(sorted[0].datum);
}
