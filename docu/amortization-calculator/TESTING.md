# Amortization Calculator Testing

Umfassende automatisierte Test-Suite für den Sunchronizer ROI & Amortization Calculator.

## 🚀 Schnellstart

### Option 1: Schnelle Validierung (keine Installation)
```bash
cd __tests__
node manual-tests.js
```

### Option 2: Vollständige Jest Tests (empfohlen)
```bash
npm install
npm test
```

### Option 3: Browser-Tests (visuell interaktiv)
```bash
# Öffne im Browser: __tests__/browser-tests.html
```

## 📋 Test-Dateien

| Datei | Typ | Zweck | Laufzeit |
|-------|-----|-------|----------|
| `calculator.test.js` | Jest | Translations, Default-Werte | 200ms |
| `html-structure.test.js` | Jest | DOM, Struktur, Accessibility | 300ms |
| `integration.test.js` | Jest | Berechnungen, Logik | 400ms |
| `manual-tests.js` | Node.js | Schnelle Validierung | 50ms |
| `browser-tests.html` | HTML | Interaktive UI-Tests | 1s |
| `check-environment.js` | Node.js | Umgebungs-Check | 100ms |

## 🧪 Test-Übersicht

### ✅ Was wird getestet?

**Translations & i18n**
- Alle EN/DE Translation-Keys
- System 1 & System 2 Beschreibungen
- Sprachenwechsel-Logik

**Default-Werte**
- Inverter: 200€ ✓
- Zubehör: 50€ ✓
- Panels: 80€, Cables: 30€
- Tracker: 1, Module: 1, Power: 400W

**HTML-Struktur**
- Sektions-Überschriften korrekt
- Alle Input-Felder vorhanden
- IDs für Translations-System
- Keine Emojis ✓

**Berechnungen**
- Kostenberechnung (80+30+200+50=360€)
- System-Kapazität (1×400W=0.4kW)
- Energieertrag (GHI × Capacity × 365 × Efficiency)
- Tracking-Bonus (30%)
- Amortisationszeit & ROI
- Degradation & CO2

**Panel-Logik**
- System 1: Fixed = moduleCount - trackerCount
- System 2: Fixed = moduleCount
- Keine negativen Werte

## 📊 Test-Statistik

```
Jest Tests:          105+ Tests
├─ calculator.test.js      30+
├─ html-structure.test.js  40+
└─ integration.test.js     35+

Manual Tests:        50+ Tests
Browser Tests:       20+ Checks

Total Coverage:      175+ automatisierte Tests
Laufzeit:           ~2-3 Sekunden
```

## 🎯 Kommandos

```bash
# Alle Tests mit Jest
npm test

# Tests im Watch-Modus (Auto-Reload)
npm run test:watch

# Mit Coverage-Report
npm run test:coverage

# Verbose Ausgabe
npm run test:verbose

# Schnelle Validierung ohne Installation
node __tests__/manual-tests.js

# Umgebung prüfen
node __tests__/check-environment.js
```

## 📈 Beispiel Test-Ergebnisse

```
PASS  __tests__/calculator.test.js
PASS  __tests__/html-structure.test.js
PASS  __tests__/integration.test.js

Test Suites: 3 passed, 3 total
Tests:      105 passed, 105 total
Coverage:    Line: 72% | Function: 65% | Branch: 62%
Time:        2.345 s
```

## 🔍 Überprüfte Szenarien

### Basis (1 Modul)
- 1 Module × 400W = 0.4 kW
- 1 Tracker
- Location: Berlin
- System 1: ~612 kWh/year | System 2: ~471 kWh/year

### Größer (4 Module)
- 4 Module × 400W = 1.6 kW
- 1 Tracker (3 Fixed in System 1)
- Location: Spain (5.1 kWh/m²)
- System 1: ~2448 kWh/year | System 2: ~1884 kWh/year

### Grenzen
- Min/Max Module (1-500)
- Min/Max Tracker (1-50)
- Keine negativen Werte
- Degradation über 30 Jahre

## 📚 Dokumentation

Siehe:
- `__tests__/TEST-GUIDE.md` - Komplette Test-Dokumentation
- `__tests__/README.md` - Detaillierte Test-Information
- `__tests__/OVERVIEW.md` - Test-Übersicht

## ✨ Highlights

✅ **175+ automatisierte Tests**  
✅ **Jest + Node.js + Browser Tests**  
✅ **EN/DE Translations getestet**  
✅ **HTML-Struktur validiert**  
✅ **Berechnungen überprüft**  
✅ **Keine Dependencies erforderlich** (manual-tests.js)  
✅ **CI/CD ready**  
✅ **Coverage Reports**  

## 🛠️ Setup

### Mit Jest (Empfohlen)
```bash
npm install
npm test
```

### Ohne Installation (Schnell)
```bash
node __tests__/manual-tests.js
```

### Im Browser
```bash
Öffne: __tests__/browser-tests.html
```

## 🐛 Debugging

```bash
# Detaillierte Fehler
npm test -- --verbose

# Einzelnen Test
npm test -- -t "inverter"

# Watch-Modus
npm run test:watch

# Mit Stack-Traces
npm test -- --no-coverage
```

## 📞 Häufige Fragen

**F: Welcher Test-Type?**
- Schnell: `node __tests__/manual-tests.js`
- Complete: `npm test`
- Visuell: Browser-Tests HTML

**F: Tests fehlgeschlagen?**
- Siehe `__tests__/TEST-GUIDE.md`
- Mit `--verbose` Flag
- Console Fehler lesen

**F: Coverage nicht erfüllt?**
- `npm run test:coverage`
- HTML Report öffnen
- Neue Tests hinzufügen

**F: Wie tests hinzufügen?**
- Edit `__tests__/*.test.js`
- Neue Test-Function
- `npm test -- --watch`

## ✅ Pre-Deployment

- [ ] `npm test` - Alle bestanden
- [ ] `npm run test:coverage` - Schwellwert erfüllt
- [ ] `node __tests__/manual-tests.js` - Alle grün
- [ ] Browser-Tests OK
- [ ] Keine Warnungen

## 📝 Nächste Schritte

1. Installation (optional):
   ```bash
   npm install
   ```

2. Tests ausführen:
   ```bash
   npm test
   ```

3. Coverage anschauen:
   ```bash
   npm run test:coverage
   # coverage/lcov-report/index.html
   ```

4. Entwicklung:
   ```bash
   npm run test:watch
   ```

---

**Test Suite Version:** 1.0  
**Tests:** 175+  
**Coverage:** 70%+ target  
**Wartung:** Automated
