# Amortization Calculator - Test Suite

Automatisierte Tests für den Sunchronizer ROI & Amortization Calculator.

## 📋 Übersicht

Die Test-Suite überprüft:
- **Translations & Mehrsprachigkeit**: EN/DE Sprachpaare, vollständige Schlüssel
- **Default-Werte**: Standardpreise, Einstellungen, Konfigurationen
- **HTML-Struktur**: Elemente, Überschriften, IDs, Accessibility
- **Berechnungslogik**: ROI, Amortisation, CO2, Degradation
- **Panel-Konfiguration**: System 1 vs System 2, Tracker vs Fixed
- **Datenvalidierung**: Typen, Grenzen, Plausibilität
- **Edge Cases**: Minimale/maximale Werte, Grenzbedingungen

## 🚀 Installation

```bash
# Dependencies installieren
npm install

# oder mit yarn
yarn install
```

## ▶️ Tests ausführen

### Alle Tests
```bash
npm test
```

### Tests im Watch-Modus (Auto-Reload bei Änderungen)
```bash
npm run test:watch
```

### Tests mit Coverage-Report
```bash
npm run test:coverage
```

### Verbose Ausgabe (detaillierte Ausgabe)
```bash
npm run test:verbose
```

## 📊 Test-Kategorien

### 1. **calculator.test.js** - Kern-Funktionalität

| Test | Beschreibung |
|------|-------------|
| Translations EN | Prüft alle englischen Übersetzungsschlüssel |
| Translations DE | Prüft alle deutschen Übersetzungsschlüssel |
| System 1 Description | Validiert, dass Beschreibung beide Panel-Typen erwähnt |
| System 2 Description | Validiert Vergleichssystem-Beschreibung |
| Default Values | Überprüft Standard-Kosteneinstellungen |
| Location Database | Validiert Standortdaten (GHI, Koordinaten) |
| Panel Configuration | Prüft Orientierungsoptionen und Yield-Faktoren |
| HTML Element IDs | Sichert ab, dass alle erforderlichen IDs vorhanden sind |

**Beispiel-Testlauf:**
```
PASS  __tests__/calculator.test.js
  Amortization Calculator - Translations
    ✓ English translations contain all required keys (5ms)
    ✓ German translations contain all required keys (2ms)
    ✓ System 1 description mentions both tracked and fixed panels (1ms)
    ✓ System 2 description mentions fixed panels and comparison (1ms)
  Amortization Calculator - Default Values
    ✓ Default inverter cost is 200€ (3ms)
    ✓ Default accessories cost is 50€ (2ms)
    ✓ Default panel cost is 80€ (2ms)
    ✓ Default module count is 1 (1ms)
```

### 2. **html-structure.test.js** - HTML & DOM

| Test | Beschreibung |
|------|-------------|
| Page Title | Prüft Seitentitel |
| Input Panel | Validiert Input-Container |
| Results Panel | Validiert Ergebnis-Container |
| Section Order | Überprüft Überschriften-Reihenfolge |
| Element Accessibility | Prüft Labels, Headers, Emojis |
| Input Validation | Sichert ab, dass Eingabefelder korrekt sind |
| Tooltips & Hints | Validiert Hilfe-Texte |
| Style & Script Tags | Prüft CSS und Script-Verknüpfungen |

**Beispiel-Testlauf:**
```
PASS  __tests__/html-structure.test.js
  HTML Structure - Sections and Headings
    ✓ Page has correct title (4ms)
    ✓ First section is System 1 (2ms)
    ✓ System 1 section has description (1ms)
    ✓ System 2 section has description (1ms)
  HTML Structure - Input Groups
    ✓ Module count input exists with correct attributes (1ms)
    ✓ All cost inputs exist (2ms)
    ✓ Location inputs exist (1ms)
```

### 3. **integration.test.js** - Berechnungen & Logik

| Test | Beschreibung |
|------|-------------|
| Cost Calculation | Prüft Kostenberechnung (Panel + Zubehör + Inverter) |
| System Capacity | Validiert kW-Berechnung aus Modulanzahl × Leistung |
| Energy Yield | Prüft Energieertrag basierend auf Bestrahlungsstärke |
| Tracking Bonus | Validiert 30% Bonus für Tracker |
| Payback Period | Berechnet Amortisationszeit |
| ROI Calculation | Prüft 30-Jahres-Return |
| Degradation | Validiert jährlichen Effizienzrückgang |
| CO2 Avoidance | Prüft CO2-Einsparungen |
| Panel Logic | System 1 (N = moduleCount - trackerCount) vs System 2 (alle Module) |
| Edge Cases | Grenzbedingungen (min/max Werte, negative Werte) |

**Beispiel-Testlauf:**
```
PASS  __tests__/integration.test.js
  Calculation Logic - Mathematical Correctness
    ✓ Cost calculation: 1 module × 400W with given prices (1ms)
    ✓ System capacity calculation: 1 module × 400W (1ms)
    ✓ Annual energy yield calculation with default values (2ms)
    ✓ Tracking bonus increases yield by default 30% (1ms)
    ✓ Payback period calculation (1ms)
  Panel Configuration Logic
    ✓ Fixed panel count: 4 modules - 1 tracker = 3 fixed panels (1ms)
    ✓ Fixed panel count: 1 module - 1 tracker = 0 fixed panels (1ms)
```

## 📈 Coverage-Bericht

Nach der Ausführung von `npm run test:coverage` wird ein detaillierter Coverage-Report erstellt:

```
✓ Lines: 70%+ coverage erforderlich
✓ Functions: 60%+ coverage erforderlich
✓ Branches: 60%+ coverage erforderlich
✓ Statements: 70%+ coverage erforderlich
```

Coverage-Bericht öffnen (nach Test-Lauf):
```bash
# HTML Report generieren
npm run test:coverage
# Im Browser öffnen: coverage/lcov-report/index.html
```

## 🔍 Wichtige Test-Szenarien

### Szenario 1: Basis-Konfiguration
- 1 Modul × 400W
- 1 Tracker
- 0 Festinstallations-Panels (System 1)
- 1 Festinstallations-Panel (System 2)
- Location: Berlin (3.8 kWh/m²/day)
- Erwarteter Ertrag: ~470 kWh/Jahr (System 2), ~612 kWh/Jahr (System 1)

### Szenario 2: Gemischte Installation
- 4 Module × 400W = 1.6 kW
- 1 Tracker
- 3 Festinstallations-Panels (System 1)
- 4 Festinstallations-Panels (System 2)
- Location: Spain (5.1 kWh/m²/day)
- Erwarteter Ertrag: ~2500 kWh/Jahr (System 2), ~3250 kWh/Jahr (System 1)

### Szenario 3: Nur Festinstallation
- 4 Module × 400W = 1.6 kW
- 0 Tracker
- 4 Festinstallations-Panels (System 1)
- 4 Festinstallations-Panels (System 2)
- Ertrag identisch in System 1 und System 2

## 🐛 Häufige Probleme

### Problem: "Cannot find module 'jsdom'"
**Lösung:**
```bash
npm install jsdom --save-dev
```

### Problem: "Jest timeout"
**Lösung:** Timeout erhöhen in `jest.config.js`:
```javascript
testTimeout: 30000 // 30 Sekunden
```

### Problem: "Snapshot mismatch"
**Lösung:** Snapshots aktualisieren:
```bash
npm test -- -u
```

## 📝 Test hinzufügen

Neuen Test in `__tests__/calculator.test.js` hinzufügen:

```javascript
test('Example test description', () => {
    const value = someFunction();
    expect(value).toBe(expectedValue);
});
```

Für komplexere Szenarien, siehe bestehende Tests als Vorlage.

## 🔧 Continuous Integration (CI)

Tests in CI-Pipeline integrieren (GitHub Actions, GitLab CI, etc.):

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## 📋 Checkliste vor Deployment

- [ ] Alle Tests lokal bestätigt: `npm test`
- [ ] Coverage-Schwellwerte erreicht: `npm run test:coverage`
- [ ] Keine Warnungen oder Fehler
- [ ] Neue Features getestet
- [ ] Alte Tests aktualisiert
- [ ] README aktualisiert

## 📚 Zusätzliche Ressourcen

- [Jest Dokumentation](https://jestjs.io/)
- [JSDOM Dokumentation](https://github.com/jsdom/jsdom)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## 📞 Support

Bei Fragen zu den Tests:
1. Bestehende Tests durchsuchen
2. Jest Dokumentation konsultieren
3. Issue öffnen im Repository
