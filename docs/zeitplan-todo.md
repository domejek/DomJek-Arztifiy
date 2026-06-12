# Zeitplan & ToDo-Plan

**Projekt**: Arztpraxis-Dashboard (Terminauslastung)
**Gesamtbudget**: 3 Stunden
**Stack**: Angular 17+, Angular Material, Chart.js (direkt, ohne ng2-charts), Jasmine/Karma
**Deployment**: GitHub Pages via peaceiris/actions-gh-pages

---

## ToDo-Liste (Checkliste)

### Phase 1: Setup & Datenmodell

- [x] **Angular-Projekt erstellen**: `ng new` mit Standalone Components, Routing deaktiviert
- [x] **Dependencies installieren**: `@angular/material`, `chart.js`, `puppeteer`
- [x] **Datenmodell definieren**: TypeScript-Interfaces in `src/app/models/`
  - `Appointment` (Datum, Uhrzeit, Dauer, Behandlungsart, Arzt, Status, Neupatient)
  - `DailyStats` / `WeeklyStats` / `TreatmentStat`
- [x] **Mock-JSON anlegen**: `src/assets/data.json`
- [x] **Git initialisieren**: Erster Commit nach Projekt-Setup

### Phase 2: DataService & Logik

- [x] **DataService** (`src/app/services/data.service.ts`):
  - HTTP-Client für JSON laden
  - Transformations-Methoden (Rohdaten → Chart-kompatibel)
  - Berechnung: Auslastung pro Tag/Woche (minutenbasiert)
  - Berechnung: No-Show-Rate
  - Berechnung: Verteilung nach Behandlungsart
- [x] **DataService Unit-Tests** (`data.service.spec.ts`):
  - Laden von Mock-Daten
  - Korrekte Aggregation
  - Edge Cases (leere Tage, fehlende Werte)

### Phase 3: Dashboard & Charts

- [x] **Dashboard-Component** (`DashboardComponent`):
  - Layout: Toolbar + KPI-Karten + Chart-Bereich
  - Weekly-Utilization-View als primäre Ansicht
- [x] **UtilizationChart-Component**:
  - Balkendiagramm: Auslastung pro Tag (Wochensicht)
  - Farbcodierung: grün (<60%), gelb (<80%), rot (>80%)
  - Wochen-Navigation (vor/zurück)
- [x] **Angular Material** integrieren:
  - `MatCard` für KPI-Karten
  - `MatToolbar` für Header
  - `MatButton` + `MatIcon` für Navigation

### Phase 4: Zusatz-Views

- [x] **NoShowRate-Component**:
  - Zeigt No-Show-Quote pro Tag
  - Farbskala (grün = niedrig, gelb = mittel, rot = hoch, grau = 0)
- [x] **TreatmentDistribution-Component**:
  - Kuchendiagramm: Anteil der Behandlungsarten
- [x] **Responsive Layout**: CSS Grid mit `auto-fit` für mobile Ansicht

### Phase 5: Component Unit-Tests

- [x] **DashboardComponent Tests**:
  - Korrekte Initialisierung
  - Daten laden und Wochen berechnen
  - Navigation funktioniert
- [x] **UtilizationChartComponent Tests**:
  - Chart-Daten korrekt übergeben
  - Canvas-Element vorhanden
- [x] **NoShowRateComponent Tests**:
  - Items pro Tag rendern
  - Prozentwerte korrekt anzeigen
  - Farb-Funktion testen
- [x] **TreatmentDistributionComponent Tests**:
  - Überschrift und Canvas vorhanden

### Phase 6: GitHub Actions & CI/CD

- [x] **CI Workflow** (`.github/workflows/ci.yml`):
  - Trigger: push, pull_request
  - Steps: checkout, node setup, npm ci, lint, test, build
- [x] **Deploy Workflow** (`.github/workflows/deploy.yml`):
  - Trigger: push to main
  - Build Angular App mit --base-href
  - Deploy zu GitHub Pages via peaceiris/actions-gh-pages
- [x] **GitHub Pages Settings**: Branch `gh-pages` als Source

### Phase 7: Dokumentation & Abschluss

- [x] **README.md** aktualisiert
- [x] **KI-Workflow-Dokumentation** (`docs/tools-prompts.md`)
- [x] **Trade-offs & Annahmen** dokumentiert
- [x] **Finaler Commit** + Push zu GitHub

---

## Meilensteine

| Meilenstein | Zeit | Definition of Done |
|---|---|---|
| Setup abgeschlossen | ~0:20 | `ng serve` läuft, Datenmodell steht |
| Daten geladen & transformiert | ~0:50 | DataService liefert aggregierte Daten, Tests grün |
| Dashboard sichtbar | ~1:30 | Charts zeigen Auslastung, Wochen-Navigation |
| Alle Komponenten fertig | ~2:00 | No-Show + Behandlungsarten visualisiert |
| Tests komplett | ~2:20 | 23 Specs grün |
| CI/CD läuft | ~2:35 | GitHub Actions Workflows getestet |
| Abgabebereit | ~3:00 | Alles dokumentiert, gedeployt auf GitHub Pages |

---

## Risiken & Puffer – was tatsächlich aufgetreten ist

| Risiko | Eingetreten? | Maßnahme |
|---|---|---|
| SharePoint-JSON unzugänglich | Nein | Daten lagen bereits als `data.json` im Repo |
| Angular/Chart-Library-Konflikte | **Ja** | ng2-charts nicht standalone-kompatibel → Chart.js direkt genutzt |
| Node.js-Version | **Ja** | Node 26 inkompatibel mit Angular 17 CLI → Workaround mit direktem node-Aufruf |
| GitHub Pages Deployment | **Ja** | outputPath mehrfach korrigiert, von actions/deploy-pages auf peaceiris gewechselt |
| Asset-Path falsch | **Ja** | data.json wurde als `assets/data/data.json` gesucht, lag aber in `assets/data.json` |
