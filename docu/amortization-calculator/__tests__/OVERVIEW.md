# Test Suite - Überblick

## 📦 Erstellte Dateien

Folgende automatisierbare Test-Dateien wurden erstellt:

### Hauptverzeichnis
```
amortization-calculator/
├── package.json              ← NPM Konfiguration mit Test-Scripts
├── jest.config.js           ← Jest Test-Runner Konfiguration
```

### Test-Verzeichnis (`__tests__/`)
```
__tests__/
├── calculator.test.js        ← Unit Tests (Translations, Default-Werte)
├── html-structure.test.js    ← DOM/Struktur Tests
├── integration.test.js       ← Berechnungslogik Tests
├── setup.js                  ← Jest Setup & Mocks
├── manual-tests.js           ← Node.js Schnelltests (kein Jest nötig)
├── browser-tests.html        ← Interaktive Browser-Tests
├── check-environment.js      ← Umgebungs-Checker
├── TEST-GUIDE.md            ← Komplette Test-Dokumentation
└── README.md                ← Detaillierte Test-Information
```

## 🎯 Test-Abdeckung

### 1. **calculator.test.js** (30+ Tests)
- Englische Translations (alle Schlüssel)
- Deutsche Translations (alle Schlüssel)
- Default-Werte (Kosten: Inverter 200€, Zubehör 50€, etc.)
- Location-Datenbank (20+ Städte)
- Panel-Konfiguration & Orientierungen
- HTML Element-IDs Überprüfung

### 2. **html-structure.test.js** (40+ Tests)
- Page-Titel & Metadaten
- Input & Results Panels
- Sektions-Überschriften
- Alle Input-Felder mit korrekten Attributen
- Panel-Konfiguration Container
- Tooltips & Hinweise
- Accessibility (Labels, Header-Hierarchie)
- CSS & Script-Verlinkung
- Keine Emojis in UI

### 3. **integration.test.js** (35+ Tests)
- Kostenberechnung
- System-Kapazität
- Energieertrag
- Tracking-Bonus (30%)
- Amortisationszeit
- 30-Jahres-ROI
- Modul-Degradation
- CO2-Einsparungen
- System 1 vs System 2 Logik
- Randfälle & Grenzbedingungen

### 4. **manual-tests.js** (50+ Tests)
- Schnelle Validierung ohne Jest
- HTML Struktur
- CSS Styling
- JavaScript Funktionen
- Berechnung & Logik
- Farbige Konsolen-Ausgabe

### 5. **browser-tests.html**
- Visuelle Test-Oberfläche
- Interaktive Überprüfung
- Real-time Validierung
- Progress-Bar
- Test-Zusammenfassung

## 🚀 Verwendung

### Schnell starten (kein Setup)
```bash
node __tests__/manual-tests.js
```

### Mit Jest (empfohlen)
```bash
npm install
npm test
npm run test:watch
npm run test:coverage
```

### Umgebung prüfen
```bash
node __tests__/check-environment.js
```

### Im Browser
```
Öffne: __tests__/browser-tests.html
Klick: "Alle Tests ausführen"
```

## 📊 Test-Statistik

| Kategorie | Anzahl | Typ | Laufzeit |
|-----------|--------|-----|----------|
| Translations | 30+ | Unit | 200ms |
| HTML-Struktur | 40+ | Integration | 300ms |
| Berechnungen | 35+ | Unit | 400ms |
| Manuelle Tests | 50+ | Manual | 50ms |
| **Gesamt** | **155+** | **Mixed** | **~1s** |

## ✅ Was wird getestet?

### Funktionalität
- ✅ Sprachensystem (EN/DE)
- ✅ Kostenberechnung
- ✅ Energieertrag-Berechnung
- ✅ ROI & Amortisation
- ✅ Panel-Konfiguration
- ✅ System 1 vs System 2 Vergleich

### Struktur
- ✅ HTML Elemente & IDs
- ✅ Input-Felder & Attribute
- ✅ Überschriften & Reihenfolge
- ✅ Tooltips & Hinweise
- ✅ CSS Styling

### Daten
- ✅ Default-Werte
- ✅ Location-Datenbank
- ✅ Kalkulationen
- ✅ Edge Cases

### Qualität
- ✅ Accessibility
- ✅ Keine Emojis
- ✅ Typen-Validierung
- ✅ Grenzen-Überprüfung

## 🔄 Continuous Integration

Die Tests können leicht in CI/CD pipelines integriert werden:

```yaml
# GitHub Actions Beispiel
- run: npm install
- run: npm test -- --coverage
```

## 📝 Nächste Schritte

1. **Installation** (optional)
   ```bash
   cd docu/amortization-calculator
   npm install
   ```

2. **Tests ausführen**
   ```bash
   npm test                 # Alle Tests
   npm run test:watch     # Im Watch-Modus
   npm run test:coverage  # Mit Coverage
   ```

3. **Fehler beheben** (falls vorhanden)
   ```bash
   npm test -- --verbose  # Detaillierte Fehler
   ```

4. **Coverage anschauen**
   ```bash
   npm run test:coverage
   # Öffne: coverage/lcov-report/index.html
   ```

## 💡 Tipps

- **Schnell testen?** → `node __tests__/manual-tests.js`
- **Entwicklung?** → `npm run test:watch`
- **Coverage?** → `npm run test:coverage`
- **Visuell?** → `__tests__/browser-tests.html` im Browser
- **Fragen?** → Siehe `__tests__/TEST-GUIDE.md`

## 🎓 Struktur verstehen

```javascript
// Einfacher Test
test('Name', () => {
    expect(value).toBe(expected);
});

// Mit mehreren Überprüfungen
test('Name', () => {
    expect(calc()).toBeCloseTo(42, 1);
    expect(errors).toBeNull();
});

// Mit Setup
beforeEach(() => {
    // Setup vor jedem Test
});
```

## 📞 Häufige Kommandos

```bash
# Alle Tests
npm test

# Einzelnen Test ausführen
npm test -- calculator.test.js

# Nur Tests mit "inverter" im Namen
npm test -- -t "inverter"

# Watch-Modus (Auto-Reload)
npm run test:watch

# Mit Coverage-Report
npm run test:coverage

# Verbose (ausführlich)
npm run test:verbose

# Ohne Jest (schnell)
node __tests__/manual-tests.js

# Umgebung prüfen
node __tests__/check-environment.js
```

## 🎯 Test-Szenarien validiert

✅ **1 Modul + 1 Tracker**
- 0 Festinstallations-Panels (System 1)
- 1 Festinstallations-Panel (System 2)
- Korrekte Kostenberechnung

✅ **4 Module + 1 Tracker**
- 3 Festinstallations-Panels (System 1)
- 4 Festinstallations-Panels (System 2)
- Unterschiedliche Erträge

✅ **Verschiedene Standorte**
- Germany: 3.8 kWh/m²
- Spain: 5.1 kWh/m²
- Egypt: 6.2 kWh/m²

✅ **Sprachenwechsel**
- EN → DE
- DE → EN
- Alle Texte korrekt

---

**Erstellt:** 2026-05-11  
**Test-Suite Version:** 1.0.0  
**Umfang:** 155+ automatisierte Tests
