# Zeitplan & ToDo-Plan

**Projekt**: Arztpraxis-Dashboard (Terminauslastung)
**Gesamtbudget**: 3 Stunden
**Stack**: Angular 17+, Angular Material, Chart.js (ng2-charts), Jasmine/Karma
**Deployment**: GitHub Pages via GitHub Actions

---

## ToDo-Liste (Checkliste)

### Phase 1: Setup & Datenmodell (0:00 – 0:20)

- [ ] **Angular-Projekt erstellen**: `ng new` mit Standalone Components, Routing deaktiviert
- [ ] **Dependencies installieren**: `@angular/material`, `ng2-charts`, `chart.js`
- [ ] **Datenmodell definieren**: TypeScript-Interfaces in `src/app/models/`
  - `Appointment` (Datum, Uhrzeit, Patient, Behandlungsart, Status)
  - `WeeklyStats` (aggregierte Kennzahlen pro Woche/Tag)
- [ ] **Mock-JSON anlegen**: `src/assets/data/termindaten.json`
- [ ] **Git initialisieren**: Erster Commit nach Projekt-Setup

### Phase 2: DataService & Logik (0:20 – 0:50)

- [ ] **DataService** (`src/app/services/data.service.ts`):
  - HTTP-Client / Fetch für JSON laden
  - Transformations-Methoden (Rohdaten → Chart-kompatibel)
  - Berechnung: Auslastung pro Tag/Woche
  - Berechnung: No-Show-Rate
  - Berechnung: Verteilung nach Behandlungsart
- [ ] **DataService Unit-Tests** (`data.service.spec.ts`):
  - Laden von Mock-Daten
  - Korrekte Aggregation
  - Edge Cases (leere Tage, fehlende Werte)

### Phase 3: Dashboard & Charts (0:50 – 1:30)

- [ ] **Dashboard-Component** (`DashboardComponent`):
  - Layout: Header + KPI-Karten + Chart-Bereich
  - Weekly-Utilization-View als primäre Ansicht
- [ ] **UtilizationChart-Component**:
  - Balkendiagramm: Auslastung pro Tag (Wochensicht)
  - Wochen-Navigation (vor/zurück)
- [ ] **Angular Material** integrieren:
  - `MatCard` für KPI-Karten
  - `MatToolbar` für Header
  - `MatButton` für Navigation

### Phase 4: Zusatz-Views (1:30 – 2:00)

- [ ] **NoShowRate-Component**:
  - Zeigt No-Show-Quote pro Tag/Woche
  - Farbskala (grün = niedrig, rot = hoch)
- [ ] **TreatmentDistribution-Component**:
  - Kuchendiagramm: Anteil der Behandlungsarten
- [ ] **Responsive Layout**: Material Grid für mobile Ansicht

### Phase 5: Component Unit-Tests (2:00 – 2:20)

- [ ] **DashboardComponent Tests**:
  - Korrekte Initialisierung
  - Anzeige bei leeren Daten
- [ ] **UtilizationChartComponent Tests**:
  - Chart-Daten korrekt übergeben
  - Navigation funktioniert
- [ ] **NoShowRateComponent Tests**
- [ ] **TreatmentDistributionComponent Tests**

### Phase 6: GitHub Actions & CI/CD (2:20 – 2:35)

- [ ] **CI Workflow** (`.github/workflows/ci.yml`):
  - Trigger: push, pull_request
  - Steps: checkout, node setup, npm ci, lint, test:ci, build
- [ ] **Deploy Workflow** (`.github/workflows/deploy.yml`):
  - Trigger: push to main
  - Build Angular App (──base-href)
  - Deploy to GitHub Pages
- [ ] **GitHub Pages Settings**: Branch `gh-pages` als Source

### Phase 7: Dokumentation & Abschluss (2:35 – 3:00)

- [ ] **README.md** aktualisieren
- [ ] **KI-Workflow-Dokumentation** (`docs/tools-prompts.md`)
- [ ] **Trade-offs & Annahmen** dokumentieren
- [ ] **Finaler Commit** + Push zu GitHub

---

## Meilensteine

| Meilenstein | Zeit | Definition of Done |
|---|---|---|
| Setup abgeschlossen | 0:20 | `ng serve` läuft, Datenmodell steht |
| Daten geladen & transformiert | 0:50 | DataService liefert aggregierte Daten, Tests grün |
| Dashboard sichtbar | 1:30 | Charts zeigen Auslastung, Wochen-Navigation |
| Alle Komponenten fertig | 2:00 | No-Show + Behandlungsarten visualisiert |
| Tests komplett | 2:20 | Alle Specs grün (`npm run test:ci`) |
| CI/CD läuft | 2:35 | GitHub Actions Workflows getestet |
| Abgabebereit | 3:00 | Alles dokumentiert, gedeployt auf GitHub Pages |

---

## Risiken & Puffer

| Risiko | Puffer | Maßnahme |
|---|---|---|
| SharePoint-JSON unzugänglich | 5 min | Mock-Daten aus Aufgabenbeschreibung generieren |
| Angular/Chart-Library-Konflikte | 5 min | Auf stabile Versionen setzen (Chart.js 4.x) |
| GitHub Pages Deployment | 5 min | Vorab dokumentieren, `angular-cli-ghpages` als Alternative |
| Unerwartete UI-Probleme | 10 min | Minimalistisches Design → Material Defaults |
