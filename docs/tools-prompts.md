# Tools & Prompts – Speicherung

Dokumentation des KI-Workflows für das Arztpraxis-Dashboard.

---

## Verwendete KI-Tools

| Tool | Version / Modell | Einsatzbereich |
|---|---|---|
| Claude Code (opencode) | big-pickle | Planung, Code-Generierung, Refactoring, Troubleshooting |
| GitHub Copilot | - | Autocomplete während der Entwicklung |

---

## Prompt-Log

### Prompt 1: Projektanalyse & Planung
**Ziel**: Aufgabenstellung verstehen und Lösungsansatz skizzieren
```
Analysiere und verstehe das Projekt und liste mir auf,
wie der Plan aussieht und sag, sobald wir beginnen können!
```
**Ergebnis**: Projekt-Struktur-Analyse, 7-Phasen-Plan vorgestellt, Fragen zu Auslastungs-Definition geklärt

### Prompt 2: Entscheidungen zu Architektur
**Ziel**: Auslastungs-Metrik und Dashboard-Aufbau festlegen
```
Was wäre besser bzw. übersichtlicher?
(minutenbasierte vs. anzahlbasierte Auslastung)
```
**Ergebnis**: Minutenbasierte Auslastung gewählt (45min Gesundheitscheck ≠ 10min Blutabnahme), Dashboard-Layout definiert

### Prompt 3: Projekt-Setup
**Ziel**: Angular-Projekt initialisieren + Dependencies
```
Perfekt, lege los!
```
**Ergebnis**: Angular 17 Standalone + Material + Chart.js installiert, Interfaces (`Appointment`, `DailyStats`, `WeeklyStats`, `TreatmentStat`) erstellt, data.json in assets kopiert

### Prompt 4: DataService
**Ziel**: Service zum Laden und Transformieren der Daten inkl. Tests
```
(automatisch generiert während der Umsetzung)
```
**Ergebnis**: DataService mit Methoden für Auslastung, No-Show-Rate, Treatment-Distribution + 9 Unit-Tests

### Prompt 5: UI-Komponenten
**Ziel**: Dashboard mit KPI-Karten, Charts, No-Show-Rate, Behandlungsarten
```
(automatisch generiert während der Umsetzung)
```
**Ergebnis**: DashboardComponent, KpiCardsComponent, UtilizationChartComponent (Chart.js direkt), NoShowRateComponent, TreatmentDistributionComponent

### Prompt 6: GitHub Actions & Deployment-Troubleshooting
**Ziel**: CI/CD + Deployment-Fehler beheben
```
(mehrere Iterationen – deploy.yml, outputPath, permissions, Pages-Settings)
```
**Ergebnis**: Fixes für:
- Angular 17 App-Builder → `outputPath` erzeugt `browser/`-Subfolder
- `actions/deploy-pages` → doppelte Artefakte → `peaceiris/actions-gh-pages`
- Fehlende `contents: write` Permission
- Asset-Path `data/data.json` → `data.json`

### Prompt 7: Docs aktualisieren
**Ziel**: Dokumentation auf aktuellen Stand bringen
```
passe nur noch die docs dateien an, offene sachen muss du mir markieren!!
```
**Ergebnis**: `zeitplan-todo.md` und `tools-prompts.md` aktualisiert

---

## Manuelle Eingriffe & Änderungen

### 1. Abgelehnt / Geändert: Chart-Bibliothek (ng2-charts → Chart.js direkt)
**KI-Vorschlag**: ng2-charts (Chart.js Wrapper)
**Entscheidung**: Chart.js direkt verwendet
**Begründung**: ng2-charts v5 ist nicht standalone-kompatibel mit Angular 17 (BaseChartDirective ist kein standalone-Directive). Stattdessen wurde Chart.js direkt per Canvas-Element und `new Chart()` eingebunden – das ist sogar schlanker und gibt mehr Kontrolle.

### 2. Geändert: Standalone Components vs. NgModules
**KI-Vorschlag**: NgModule-Architektur (Angular <15 Standard)
**Entscheidung**: Standalone Components (Angular 17+)
**Begründung**: Moderner, weniger Boilerplate, zukunftssicherer. Da keine Legacy-Kompatibilität nötig ist.

### 3. Geändert: State Management
**KI-Vorschlag**: NgRx / Signal Store
**Entscheidung**: Kein State Management, einfacher Service
**Begründung**: Für ein Single-Page Dashboard mit statischen Daten wäre NgRx Overkill. Der DataService + RxJS Subject reicht völlig aus.

### 4. Geändert: GitHub Pages Deployment-Strategie
**KI-Vorschlag**: actions/deploy-pages (GitHub-native)
**Entscheidung**: peaceiris/actions-gh-pages
**Begründung**: Der native `actions/deploy-pages`-Workflow erzeugte mehrfach doppelte Artefakte ("Multiple artifacts named github-pages"), was zu Deployment-Fehlern führte. `peaceiris/actions-gh-pages` deployed direkt in den `gh-pages`-Branch – simpler und zuverlässiger.

### 5. Geändert / Fix: Angular 17 Application Builder outputPath
**Problem**: Der neue Angular 17 Application Builder legt Build-Artefakte in einem `browser/`-Subfolder ab, selbst wenn `outputPath` gesetzt ist.
**Fix**: `outputPath: "dist"` → Build liegt in `dist/browser/` → `publish_dir: ./dist/browser` deployed die richtigen Dateien auf Pages-Root-Ebene.

### 6. Geändert / Fix: Asset-Path
**Problem**: data.json wurde als `assets/data/data.json` geladen, lag aber als `assets/data.json` im Build.
**Fix**: DataService-URL von `assets/data/data.json` auf `assets/data.json` geändert.

---

## Trade-offs & Annahmen

1. **Auslastungs-Definition (minutenbasiert)**: Wir definieren Auslastung als `(wahrgenommene Minuten / max. verfügbare Minuten pro Tag) × 100`. Die maximale Kapazität pro Arzt beträgt 540min (Mo–Fr 08:00–18:00 minus 1h Pause), Samstage 240min. Eine anzahlbasierte Zählung (Anzahl Termine) würde verzerren, da ein 45min-Check mehr Kapazität bindet als eine 10min-Blutabnahme.

2. **Statische Daten statt API**: Das JSON wird aus `assets/data.json` geladen. In der Realität würde ein Backend die Daten liefern – für die Aufgabe ist das eine sinnvolle Vereinfachung. Ein API-Proxy oder Backend wäre mit dem 3h-Budget nicht realisierbar.

3. **Kein Routing**: Da es nur eine Dashboard-Ansicht gibt, wird auf Angular Routing verzichtet. Das reduziert Bundle-Size und Komplexität.

4. **GitHub Pages als Hosting**: Kostenlos, einfach per Actions-Deploy, erfordert keine weitere Infrastruktur. Nachteil: Kein SSR, nur statisches Hosting. Für ein reines Dashboard ohne SEO-Anforderungen ausreichend.

5. **Mobile First**: Wird priorisiert aber nicht perfektioniert – das Budget von 3h erlaubt keine pixelgenaue responsive Optimierung. CSS Grid mit `auto-fit` skaliert grundsätzlich, aber Feinjustierung fehlt.

6. **Chart.js direkt statt ng2-charts**: Die fehlende Standalone-Kompatibilität von ng2-charts zwang zur direkten Chart.js-Nutzung. Dies erwies sich als Vorteil: weniger Abhängigkeiten, mehr Kontrolle über Chart-Konfiguration.

7. **Node 26 vs. Angular 17**: Die lokale Node.js-Version 26 ist mit Angular 17 CLI nicht voll kompatibel (CLI sucht `./bootstrap` relativ zum Symlink). Workaround: direkter Aufruf über `node node_modules/@angular/cli/bin/ng.js`. Auf CI (Node 20) tritt das Problem nicht auf.
