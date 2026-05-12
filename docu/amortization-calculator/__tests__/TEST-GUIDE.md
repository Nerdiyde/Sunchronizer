# 🧪 Sunchronizer Amortization Calculator - Test Suite

Umfassende automatisierte und manuelle Test-Suite für den ROI & Amortization Calculator.

## 📚 Überblick

Diese Test-Suite umfasst:
- **Unit Tests** (Jest) - Translations, Default-Werte, Konstanten
- **Struktur-Tests** (Jest) - HTML DOM, Element-IDs, Accessibility
- **Integrations-Tests** (Jest) - Berechnungslogik, Panel-Konfiguration
- **Manuelle Tests** (Node.js) - Schnelle Validierung ohne Jest
- **Browser-Tests** (HTML) - Interaktive Überprüfung im Browser

## 🚀 Schnellstart

### Option 1: Jest (Empfohlen für CI/CD)

```bash
# Dependencies installieren
npm install

# Alle Tests ausführen
npm test

# Tests im Watch-Modus
npm run test:watch

# Coverage-Report
npm run test:coverage
```

### Option 2: Manuelle Node.js Tests (Schnell, keine Installation)

```bash
# Keine Installation erforderlich
node __tests__/manual-tests.js
```

### Option 3: Browser-Tests (Visuell, interaktiv)

```bash
# 1. Browser öffnen
# 2. Öffnen Sie: __tests__/browser-tests.html
# 3. Klicken Sie: "Alle Tests ausführen"
```

## 📋 Test-Struktur

```
amortization-calculator/
├── __tests__/
│   ├── calculator.test.js       # Unit & Translation Tests
│   ├── html-structure.test.js   # DOM & Struktur Tests
│   ├── integration.test.js      # Berechnungs-Logik Tests
│   ├── setup.js                 # Jest Setup
│   ├── manual-tests.js          # Node.js Schnelltests
│   ├── browser-tests.html       # Browser UI Tests
│   └── README.md                # Detaillierte Dokumentation
├── package.json                 # NPM Dependencies
├── jest.config.js              # Jest Konfiguration
├── calculator.js               # Main JavaScript
├── index.html                  # Main HTML
└── styles.css                  # Main CSS
```

## 🧬 Test-Kategorien

### 1️⃣ Calculator Tests (`calculator.test.js`)
- ✅ Englische Translations validieren
- ✅ Deutsche Translations validieren
- ✅ Default-Werte (Kosten, Module, etc.)
- ✅ Location-Datenbank
- ✅ Panel-Konfiguration & Orientierungen
- ✅ HTML Element-IDs

**Laufzeit:** ~200ms  
**Tests:** 30+

### 2️⃣ HTML-Struktur Tests (`html-structure.test.js`)
- ✅ Page Title & Metadaten
- ✅ Input-Panels & Container
- ✅ Sektions-Überschriften & Reihenfolge
- ✅ Alle Input-Felder mit Attributen
- ✅ Panel-Konfiguration Container
- ✅ Tooltips & Hinweise
- ✅ Accessibility (Labels, Header-Hierarchie, keine Emojis)
- ✅ Styles & Scripts verlinkt

**Laufzeit:** ~300ms  
**Tests:** 40+

### 3️⃣ Integrations-Tests (`integration.test.js`)
- ✅ Kostenberechnung (Panel + Zubehör + Inverter)
- ✅ System-Kapazität (Module × Leistung)
- ✅ Energieertrag-Berechnung
- ✅ Tracking-Bonus (30%)
- ✅ Amortisationszeit
- ✅ 30-Jahres-ROI
- ✅ Degradation über Zeit
- ✅ CO2-Einsparungen
- ✅ Panel-Logik (System 1 vs 2)
- ✅ Randfälle & Grenzbedingungen

**Laufzeit:** ~400ms  
**Tests:** 35+

### 4️⃣ Manuelle Tests (`manual-tests.js`)
- ✅ Nur Node.js, keine Zusatz-Abhängigkeiten
- ✅ Farbige Konsolen-Ausgabe
- ✅ Schnelle Grundvalidierung

**Laufzeit:** ~50ms  
**Tests:** 50+

### 5️⃣ Browser-Tests (`browser-tests.html`)
- ✅ Visuelle Test-UI
- ✅ Interaktiv im Browser
- ✅ Echtzeit-Validierung

## 📊 Beispiel Test-Ergebnisse

```
PASS  __tests__/calculator.test.js
  Amortization Calculator - Translations
    ✓ English translations contain all required keys (5ms)
    ✓ German translations contain all required keys (2ms)
  Amortization Calculator - Default Values
    ✓ Default inverter cost is 200€ (3ms)
    ✓ Default accessories cost is 50€ (2ms)

PASS  __tests__/html-structure.test.js
  HTML Structure - Sections and Headings
    ✓ Page has correct title (4ms)
    ✓ First section is System 1 (2ms)
    ✓ System 1 section has description (1ms)

PASS  __tests__/integration.test.js
  Calculation Logic - Mathematical Correctness
    ✓ Cost calculation: 1 module × 400W (1ms)
    ✓ Tracking bonus increases yield by default 30% (1ms)

Test Suites: 3 passed, 3 total
Tests:      105 passed, 105 total
Time:       2.345 s
```

## 🎯 Test-Szenarien

### Basis-Setup (1 Modul)
```
Input:
- Module: 1 × 400W = 0.4 kW
- Tracker: 1
- Location: Berlin (3.8 kWh/m²)
- Electricity: 0.30 €/kWh

Expected:
- System 1: ~612 kWh/year (with tracking)
- System 2: ~471 kWh/year (fixed)
- Payback: ~5.2 years (System 1)
```

### Größere Installation (4 Module)
```
Input:
- Module: 4 × 400W = 1.6 kW
- Tracker: 1
- Fixed panels (System 1): 3
- Fixed panels (System 2): 4
- Location: Spain (5.1 kWh/m²)

Expected:
- System 1: ~2448 kWh/year (612 × 4)
- System 2: ~1884 kWh/year (471 × 4)
```

## ✨ Coverage-Schwellwerte

Nach `npm run test:coverage`:
- **Lines:** ≥70%
- **Functions:** ≥60%
- **Branches:** ≥60%
- **Statements:** ≥70%

## 🔍 Spezielle Test-Checks

### Translations
```javascript
✓ EN: system1Title, system1Description, system1PanelConfigTitle
✓ DE: system1Title, system1Description, system1PanelConfigTitle
✓ EN/DE Pairings vollständig
```

### Default-Werte
```javascript
✓ Inverter: 200€ (nicht 300€)
✓ Accessories: 50€ (nicht 100€)
✓ Panels: 80€
✓ Cables: 30€
✓ Module: 1
✓ Power: 400W
✓ Tracker: 1
✓ Efficiency: 85%
```

### Panel-Logik
```javascript
✓ System 1: Fixed Panels = moduleCount - trackerCount
✓ System 2: Fixed Panels = moduleCount (alle)
✓ No negative values (Math.max(0, ...))
```

### Berechnung
```javascript
✓ Investment = Panels × count + Cables + Inverter + Accessories
✓ Capacity = Modules × Power / 1000
✓ Yield = GHI × Capacity × 365 × Efficiency
✓ With Tracking = Yield × 1.30
✓ Payback = Investment / Annual Savings
```

## 🛠️ Debugging

### Test fehlgeschlagen?

1. **Überprüfen Sie den Calculator**
   ```bash
   # Im Terminal: npm test -- --verbose
   ```

2. **Siehe detaillierte Fehler**
   ```bash
   npm test -- --verbose 2>&1 | grep -A 5 "FAIL\|●"
   ```

3. **Einzelnen Test ausführen**
   ```bash
   npm test -- calculator.test.js -t "Default inverter"
   ```

4. **Watch-Modus für Entwicklung**
   ```bash
   npm run test:watch
   ```

## 📈 Continuous Integration

### GitHub Actions Beispiel

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run test:coverage
```

## 🎓 Lernen & Testen

### Tests hinzufügen
```javascript
// In __tests__/calculator.test.js
test('My new test name', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
});
```

### Tests lokal debuggen
```bash
node --inspect-brk __tests__/manual-tests.js
# Öffnen Sie: chrome://inspect in Chrome DevTools
```

## 📞 Häufige Fragen

**F: Welcher Test-Type sollte ich verwenden?**
- Für CI/CD: Jest (`npm test`)
- Für schnelle Checks: Manuelle Tests (`node __tests__/manual-tests.js`)
- Für visuelle Überprüfung: Browser-Tests (HTML)

**F: Wie lange dauern Tests?**
- Jest: ~2-3 Sekunden
- Manuelle Tests: ~50ms
- Browser-Tests: ~1 Sekunde

**F: Was wenn ein Test fehlschlägt?**
1. Fehler lesen
2. Code inspizieren
3. Test-Datei konsultieren
4. Issue öffnen wenn nötig

**F: Wie teste ich während der Entwicklung?**
```bash
npm run test:watch
# Ändere Code, Tests laufen automatisch
```

## 📚 Ressourcen

- [Jest Dokumentation](https://jestjs.io/)
- [JSDOM Dokumentation](https://github.com/jsdom/jsdom)
- [Calculator Quelle](../calculator.js)
- [HTML Struktur](../index.html)
- [Test Detailinformation](__tests__/README.md)

## ✅ Pre-Deployment Checkliste

- [ ] `npm test` - Alle Tests bestanden
- [ ] `npm run test:coverage` - Coverage erfüllt
- [ ] `node __tests__/manual-tests.js` - Alle grün
- [ ] Browser-Tests manuell überprüft
- [ ] Keine Warnungen in Konsole
- [ ] Performance OK (< 2s für alle Tests)

---

**Test-Suite Version:** 1.0  
**Letztes Update:** 2026-05-11  
**Wartung:** GitHub Copilot
