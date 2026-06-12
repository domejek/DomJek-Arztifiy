# DomJek-Arztifiy

**Terminauslastung einer Arztpraxis – Dashboard**

Ein Angular 17+ Dashboard zur Visualisierung der Terminauslastung einer Hausarztpraxis. Zeigt wöchentliche Auslastung, No-Show-Raten und Behandlungsarten-Verteilung auf Basis synthetischer Beispieldaten.

## Features

- **Wöchentliche Auslastung**: Balkendiagramm mit Auslastung pro Tag (minutenbasiert)
- **No-Show-Rate**: Farbcodierte Ansicht der No-Show-Quote pro Tag
- **Behandlungsarten**: Kuchendiagramm mit Verteilung der Behandlungen
- **KPI-Karten**: Auf einen Blick: Ø Auslastung, No-Show-Rate, Terminanzahl, Wahrgenommen-Quote
- **Wochen-Navigation**: Vor- und zurückspringen zwischen den Kalenderwochen
- **Responsive Design**: Optimiert für Desktop und Mobile

## Stack

- Angular 17 (Standalone Components)
- Angular Material
- Chart.js
- Jasmine / Karma (Unit-Tests)
- GitHub Actions (CI/CD)
- GitHub Pages (Deployment)

## Entwicklung

```bash
npm install
npm start          # ng serve
npm test           # ng test
npm run build      # ng build
```

## Deployment

Automatisches Deployment auf GitHub Pages bei Push auf `main` via GitHub Actions.

## Auslastungs-Definition

Auslastung = `(wahrgenommene Minuten / max. verfügbare Minuten pro Tag) × 100`

- Maximale Kapazität: 540 Minuten pro Arzt und Tag (Mo–Fr, 08:00–18:00, 1h Pause)
- Samstage: 240 Minuten pro Arzt
- No-Show-Rate: `no_shows / (wahrgenommen + no_shows) × 100`
