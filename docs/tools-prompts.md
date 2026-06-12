# Tools & Prompts – Speicherung

Dokumentation des KI-Workflows für das Arztpraxis-Dashboard.

---

## Verwendete KI-Tools

| Tool | Version / Modell | Einsatzbereich |
|---|---|---|
| Claude Code (opencode) | big-pickle | Planung, Code-Generierung, Refactoring |
| GitHub Copilot | - | Autocomplete während der Entwicklung |
| Claude | Sonnet | Architektur-Entscheidungen, Prompt-Design |

---

## Prompt-Log

### Prompt 1: Projektanalyse & Planung
**Ziel**: Aufgabenstellung verstehen und Lösungsansatz skizzieren
```
Lies dir task.md durch, wie würdest du das komplette Projekt angehen?
Dabei sind mir folgendes wichtig: verwende Angular, Unit-Tests sowie
GitHub Actions. Gerne auch als Zeitplan mit einer Eingrenzung auf bis zu 3h.
```
**Ergebnis**: Detaillierter Architektur-Plan, Zeitplan (7 Phasen), Komponenten-Struktur

### Prompt 2: Dokumentation anlegen
**Ziel**: Planung dokumentieren und ToDo-Liste erstellen
```
Baue mir mehrere md-Dateien unter /docs: 1. Zeitplan/ToDo-Plan,
2. Tools/Prompts Speicherung
```
**Ergebnis**: `docs/zeitplan-todo.md`, `docs/tools-prompts.md`

### Prompt 3: Projekt-Setup
**Ziel**: Angular-Projekt initialisieren
```
Erstelle ein Angular 17+ Projekt mit Standalone Components
```
**Ergebnis**: Projekt-Struktur mit `ng new`

### Prompt 4: Datenmodell
**Ziel**: TypeScript-Interfaces aus JSON ableiten
```
Generiere TypeScript-Interfaces für die JSON-Daten (Termine mit Datum,
Uhrzeit, Patient, Behandlungsart, Status)
```
**Ergebnis**: Interfaces: `Appointment`, `WeeklyStats`

### Prompt 5: DataService
**Ziel**: Service zum Laden und Transformieren der Daten
```
Baue einen DataService, der die JSON-Daten lädt und in Chart-kompatible
Formate transformiert inkl. Unit-Tests.
```
**Ergebnis**: DataService mit Methoden für Auslastung, No-Show-Rate, Treatment-Distribution

### Prompt 6: UI-Komponenten
**Ziel**: Dashboard mit Charts generieren
```
Generiere eine Angular Dashboard-Komponente mit Chart.js-Charts für
wöchentliche Auslastung, No-Show-Rate und Behandlungsarten-Verteilung.
Verwende Angular Material für das Layout.
```
**Ergebnis**: DashboardComponent, UtilizationChartComponent, NoShowRateComponent, TreatmentDistributionComponent

### Prompt 7: GitHub Actions
**Ziel**: CI/CD Pipeline erstellen
```
Erstelle GitHub Actions Workflows für CI (lint, test, build) und
Deployment auf GitHub Pages.
```
**Ergebnis**: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

---

## Manuelle Eingriffe & Änderungen

### 1. Abgelehnt / Geändert: Chart-Bibliothek
**KI-Vorschlag**: D3.js für Charts
**Entscheidung**: Stattdessen `ng2-charts` (Chart.js Wrapper)
**Begründung**: D3.js ist mächtiger aber aufwändiger. ng2-charts bietet für Balken- und Kuchendiagramme eine schnellere Integration mit Angular — bei 3h Budget der richtige Trade-off.

### 2. Geändert: Standalone Components vs. NgModules
**KI-Vorschlag**: NgModule-Architektur (Angular <15 Standard)
**Entscheidung**: Standalone Components (Angular 17+)
**Begründung**: Moderner, weniger Boilerplate, zukunftssicherer. Da keine Legacy-Kompatibilität nötig ist.

### 3. Geändert: State Management
**KI-Vorschlag**: NgRx / Signal Store
**Entscheidung**: Kein State Management, einfacher Service
**Begründung**: Für ein Single-Page Dashboard mit statischen Daten wäre NgRx Overkill. Der DataService + RxJS Subject reicht völlig aus.

---

## Trade-offs & Annahmen

1. **Statische Daten statt API**: Das JSON wird aus `assets/data/` geladen. In der Realität würde ein Backend die Daten liefern – für die Aufgabe ist das eine sinnvolle Vereinfachung.

2. **Kein Routing**: Da es nur eine Dashboard-Ansicht gibt, wird auf Angular Routing verzichtet.

3. **Auslastungs-Definition**: Wir definieren Auslastung als `(durchgeführte Termine / max. mögliche Termine)`. Die maximale Kapazität leiten wir aus dem Datensatz ab (höchste Termindichte = 100%). Alternativ könnte man feste Praxis-Öffnungszeiten annehmen.

4. **GitHub Pages als Hosting**: Kostenlos, einfach per Actions-Deploy, erfordert keine weitere Infrastruktur. Nachteil: Kein SSR, nur statisches Hosting.

5. **Mobile First**: Wird priorisiert aber nicht perfektioniert – das Budget von 3h erlaubt keine pixelgenaue responsive Optimierung.
