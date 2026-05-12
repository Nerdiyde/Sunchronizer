// ============================================================================
// Sunchronizer ROI & Amortization Calculator
// ============================================================================

// Constants
const SYSTEM_EFFICIENCY = 85; // % (inverter, wiring losses)
const TRACKING_BONUS_DEFAULT = 30; // % additional yield vs fixed
const CO2_EMISSION_FACTOR = 0.4; // kg CO2 per kWh (Europe average)
const INFLATION_RATE = 0.02; // 2% annual inflation

// Fixed Installation Types - Yield factors relative to South-facing at optimal tilt
const FIXED_INSTALLATION_TYPES = {
    'south-custom': { name: 'South-Facing (Custom tilt)', factor: 0.90, baseEff: 1.0, customTilt: true },
    'east-custom': { name: 'East-Facing (Custom tilt)', factor: 0.75, baseEff: 0.75, customTilt: true },
    'west-custom': { name: 'West-Facing (Custom tilt)', factor: 0.75, baseEff: 0.75, customTilt: true }
};

const FIXED_ORIENTATION_OPTIONS = ['south-custom', 'east-custom', 'west-custom'];

// Location Database with Annual Average GHI (kWh/m²/day)
// Data sources: PVGIS (https://pvgis.ec.europa.eu/), NASA POWER (https://power.larc.nasa.gov/)
const LOCATION_DATABASE = {
    custom: { name: 'Custom', lat: 52.5, lon: 13.4, ghi: 3.8 },
    // Europe
    germany: { name: 'Germany (Berlin)', lat: 52.5, lon: 13.4, ghi: 3.8 },
    spain: { name: 'Spain (Madrid)', lat: 40.4, lon: -3.7, ghi: 5.1 },
    italy: { name: 'Italy (Rome)', lat: 41.9, lon: 12.5, ghi: 4.7 },
    greece: { name: 'Greece (Athens)', lat: 37.9, lon: 23.7, ghi: 5.3 },
    portugal: { name: 'Portugal (Lisbon)', lat: 38.7, lon: -9.1, ghi: 5.0 },
    uk: { name: 'United Kingdom (London)', lat: 51.5, lon: -0.1, ghi: 3.3 },
    france: { name: 'France (Paris)', lat: 48.9, lon: 2.3, ghi: 3.6 },
    sweden: { name: 'Sweden (Stockholm)', lat: 59.3, lon: 18.1, ghi: 3.2 },
    // Middle East & Africa
    'middle-east': { name: 'Middle East (Dubai)', lat: 25.2, lon: 55.3, ghi: 6.0 },
    egypt: { name: 'Egypt (Cairo)', lat: 30.0, lon: 31.2, ghi: 6.2 },
    'south-africa': { name: 'South Africa (Cape Town)', lat: -33.9, lon: 18.4, ghi: 5.4 },
    morocco: { name: 'Morocco (Marrakech)', lat: 31.6, lon: -8.0, ghi: 5.8 },
    // Asia
    india: { name: 'India (Delhi)', lat: 28.6, lon: 77.2, ghi: 5.5 },
    japan: { name: 'Japan (Tokyo)', lat: 35.7, lon: 139.7, ghi: 4.1 },
    china: { name: 'China (Shanghai)', lat: 31.2, lon: 121.5, ghi: 4.0 },
    thailand: { name: 'Thailand (Bangkok)', lat: 13.7, lon: 100.5, ghi: 5.2 },
    // Americas
    'usa-south': { name: 'USA South (Miami)', lat: 25.8, lon: -80.2, ghi: 5.4 },
    'usa-north': { name: 'USA North (New York)', lat: 40.7, lon: -74.0, ghi: 4.0 },
    canada: { name: 'Canada (Toronto)', lat: 43.7, lon: -79.4, ghi: 3.5 },
    mexico: { name: 'Mexico (Mexico City)', lat: 19.4, lon: -99.1, ghi: 5.5 },
    brazil: { name: 'Brazil (São Paulo)', lat: -23.5, lon: -46.6, ghi: 5.0 },
    chile: { name: 'Chile (Santiago)', lat: -33.4, lon: -70.7, ghi: 5.7 },
    // Oceania
    australia: { name: 'Australia (Sydney)', lat: -33.9, lon: 151.2, ghi: 5.2 },
    newzealand: { name: 'New Zealand (Auckland)', lat: -37.0, lon: 174.9, ghi: 4.3 }
};

// Currency symbols
const CURRENCY_SYMBOLS = {
    EUR: '€',
    USD: '$',
    GBP: '£'
};

// Language Translations
let currentLanguage = localStorage.getItem('calculatorLanguage') || 'en';

const TRANSLATIONS = {
    en: {
        // Header
        title: 'Sunchronizer ROI Calculator',
        subtitle: 'Calculate the payback period and return on investment for your dual-axis solar tracking system',
        
        // Sections
        systemConfig: 'System Configuration',
        investmentAnalysis: 'Investment Analysis',
        plannedPVSystem: 'Planned PV System',
        sharedSettingsTitle: 'Shared System Settings',
        sharedSettingsHint: 'These settings apply to both System 1 and System 2',
        system1Title: 'System 1: Sunchronizer System',
        system1TotalCostLabel: 'Total System 1 Investment',
        system2Title: 'System 2: Reference System (Pure Fixed Installation)',
        system2TotalCostLabel: 'Total System 2 Investment',
        system2FixedPanels: 'System 2: Fixed Panel System',
        locationTitle: 'Location',
        location: 'Location',
        economics: 'Economics',
        simpleExplanation: 'Explanation',
        detailedBreakdown: 'Detailed Breakdown',
        comparisonTitle: 'Comparison: Sunchronizer vs. Fixed Installation',
        
        // Input labels
        numberOfModules: 'Number of Modules',
        modulePower: 'Module Power (W)',
        moduleCountTooltip: 'How many PV panels? (1-4 typical for balcony systems)',
        modulePowerTooltip: 'Nominal power per panel. Standard: 300-600W',
        modulePowerHint: 'Adjustable in 25W steps (typical: 300-600W)',
        totalSystemCapacity: 'Total System Capacity',
        pvSystemCosts: 'PV System Costs',
        pvSystemCostsTooltip: 'Breakdown of component costs',
        costForOneSolarPanel: 'Cost for one solar panel',
        cablesAndConnectors: 'Cables & Connectors',
        inverter: 'Inverter',
        accessoriesAndInstallation: 'Accessories & Installation',
        totalPVSystemCost: 'Total PV System Cost',
        totalSystemInvestment: 'Total System Investment',
        annualIrradianceLabel: 'Annual Irradiance',
        totalSystemInvestmentLabel: 'Total System Investment',
        numberOfTrackers: 'Number of Sunchronizer Trackers',
        trackerCountTooltip: 'How many dual-axis tracking systems? Use multiple for larger installations with separate trackers',
        sunchronizerTrackerCost: 'Sunchronizer Dual-Axis Tracker Cost',
        sunchronizerTrackerCostPerUnit: 'Sunchronizer Dual-Axis Tracker Cost (per unit)',
        system1Title: 'System 1: Sunchronizer System',
        system1Description: 'Configure your dual-axis tracking system with Sunchronizer trackers. This system can consist of both tracked and fixed panels: the trackers handle the movable panels, while the remaining panels can be fixed installations. System 2 below consists exclusively of fixed panels with configurable orientations and tilt angles for comparison.',
        system1PanelConfigTitle: 'System 1: Panel Configuration (Tracked by Sunchronizer)',
        system1PanelConfigTooltip: 'Configure orientation and tilt for panels NOT covered by trackers. These panels remain in fixed position while trackers automatically adjust the other panels.',
        system1PanelConfigHint: 'Shows N panels where N = Total Modules - Number of Trackers. These fixed panels are included in your Sunchronizer system.',
        system2Title: 'System 2: Reference System (Pure Fixed Installation)',
        system2Description: 'Configure a comparison system with the SAME module count, power, and location as System 1, but with different panel orientations and tilt angles. This is your "no tracking" baseline.',
        system2Shares: 'System 2 shares these values with System 1: Module count, module power, location, electricity price, self-consumption rate, maintenance costs, degradation, system efficiency.',
        system2PanelConfigTitle: 'System 2: Panel Configuration (Fixed Installation)',
        system2PanelConfigTooltip: 'Configure orientation and tilt for ALL panels in the reference system. Use different angles than System 1 to see how orientation affects performance.',
        system2PanelConfigHint: 'All modules in System 2 are configured here with fixed orientations and tilt angles (no tracking).',
        sunchronizerTrackerCostPerUnit: 'Sunchronizer Dual-Axis Tracker Cost (per unit)',
        trackerCostTooltip: 'Cost of one Sunchronizer tracking system, 2-axis motors, sensors, and electronics. See FAQ for payback details',
        fixedPanelSettingsTitle: 'Fixed Installation Panel Settings (per panel)',
        fixedPanelSettingsHint: 'Use this to compare mixed fixed installations (for example east + west) against Sunchronizer tracking.',
        fixedPanelSettingsTooltip: 'For comparison: define orientation and tilt angle for each fixed panel. With multiple panels, configure each panel separately.',
        panelLabel: 'Panel',
        orientation: 'Orientation',
        tiltAngle: 'Tilt (°)',
        moduleCountPlaceholder: 'e.g., 1',
        modulePowerPlaceholder: 'e.g., 400',
        trackerCountPlaceholder: 'e.g., 1',
        trackerCostPlaceholder: 'Tracker cost per unit',
        latitudePlaceholder: 'North positive',
        longitudePlaceholder: 'East positive',
        pricePerKwhPlaceholder: 'Price per kWh',
        percentagePlaceholder: 'Percentage',
        customLocationOption: 'Custom (Enter Coordinates)',
        presetLocation: 'Preset Location',
        locationPresetTooltip: 'Select a city to auto-populate coordinates and irradiance',
        latitude: 'Latitude (°)',
        latitudeTooltip: 'North positive, South negative. Affects solar irradiance and optimal tilt',
        longitude: 'Longitude (°)',
        longitudeTooltip: 'East positive, West negative. Used for precise location mapping',
        annualIrradiance: 'Annual Irradiance',
        annualIrradianceTooltip: 'Global Horizontal Irradiance (GHI) from PVGIS and NASA POWER databases. Represents average daily solar radiation at your location.',
        coordinateHintHtml: 'Need to find exact coordinates? Use <a href="https://maps.google.com" target="_blank">Google Maps</a>, <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a>, or <a href="https://pvgis.ec.europa.eu/pvgis.php" target="_blank">PVGIS</a> to get your location\'s precise latitude/longitude.',
        electricityPrice: 'Electricity Price',
        electricityPriceTooltip: 'Cost per kWh. Check your utility bill',
        selfConsumptionRate: 'Self-Consumption Rate',
        selfConsumptionTooltip: 'What % of generated electricity do you use directly? (50% typical for home use)',
        feedInTariff: 'Feed-In Tariff (Grid Export Rate)',
        feedInTariffTooltip: 'Price per kWh for electricity sold back to grid. Leave 0 if not applicable',
        maintenanceCost: 'Annual Maintenance Cost',
        moduleDegradation: 'Module Degradation',
        systemEfficiency: 'System Efficiency',
        trackingBonus: 'Tracking Bonus',
        environmentalLosses: 'Environmental Losses',
        comparisonType: 'Comparison Type',
        panelTilt: 'Panel Tilt Angle',
        calculate: 'Calculate',
        withSunchronizer: 'with Sunchronizer',
        fixedInstallationShort: 'fixed installation',
        
        // Result labels
        paybackPeriodTracker: 'Payback Period (with Sunchronizer)',
        paybackPeriodFixed: 'Payback Period (fixed installation)',
        annualEnergyYield: 'Annual Energy Yield',
        annualSavings: 'Annual Savings',
        roiLabel: '30-Year ROI',
        cumulativeSavings: 'Cumulative Savings (30 years)',
        co2Avoided: 'CO₂ Emissions Avoided (30 years)',
        savingsChartTitle: 'Cumulative Savings Over Time',
        yieldChartTitle: 'Annual Energy Yield by Year',
        co2ChartTitle: 'CO₂ Emissions Avoided (30 Years)',
        annualEnergyYieldComparison: 'Annual Energy Yield Comparison',
        
        // Units
        years: 'years',
        kwhPerYear: 'kWh/year',
        tons: 'tons',
        perYear: '/year',
        perKwh: '/kWh',
        perYearLabel: 'per year',
        percentPerYear: '% /year',
        cumulativeLabel: 'Cumulative',
        breakEvenPoint: 'Break-Even Point',
        maintenanceCostTooltip: 'Yearly costs for cleaning, inspection, repairs (typically 0-50€/year)',
        maintenanceCostPlaceholder: 'Currency/year',
        moduleDegradationTooltip: 'How much efficiency is lost per year. Typical: 0.5% for quality panels',
        moduleDegradationPlaceholder: 'Percentage per year',
        systemEfficiencyHint: 'Typical: 85% (includes inverter losses and wiring)',
        trackingBonusTooltip: 'Additional yield vs fixed panels. See Measurements Data',
        trackingBonusHint: 'Typical: 25-40% vs. fixed installation. See Measurements Data for real-world values.',
        environmentalLossesTooltip: 'Power loss due to dust, dirt, snow, and other soiling. Varies by climate (1-5% typical). See NREL studies or local PV data',
        environmentalLossesHint: 'Climate guide: Mediterranean 2-3%, Sahara 4-5%, Tropical 3-4%, Temperate 1-2%',
        methodologyHeader: 'How does the calculator work?',
        methodologyHtml: '<p><strong>Calculation Method:</strong></p><ol><li><strong>System Capacity:</strong> Number of modules × Power per module = Total capacity (kW)</li><li><strong>Tracker Yield:</strong> Irradiance (from <a href="https://pvgis.ec.europa.eu/" target="_blank" style="color: #3498db; text-decoration: underline;">PVGIS</a> / <a href="https://power.larc.nasa.gov/" target="_blank" style="color: #3498db; text-decoration: underline;">NASA POWER</a>) × System capacity × 365 × System efficiency × Tracking bonus × Environmental losses</li><li><strong>Fixed Yield (new):</strong> Each fixed panel gets its own orientation and tilt setup. The fixed benchmark uses the average factor over all configured panels.</li><li><strong>Module Degradation:</strong> Each year, panels lose 0.5% (default) efficiency due to aging</li><li><strong>Inflation Adjustment:</strong> Electricity prices increase 2% annually (default)</li><li><strong>Annual Savings:</strong> Self-consumed energy × Electricity price + Feed-in energy × Feed-in tariff - Annual maintenance costs</li><li><strong>Payback Period:</strong> Total investment ÷ Annual savings (Year 1)</li><li><strong>30-Year ROI:</strong> (Total savings - Investment) ÷ Investment × 100%</li><li><strong>CO₂ Avoidance:</strong> Generated energy × 0.4 kg CO₂/kWh (European average)</li></ol><p style="margin-top: 15px;"><strong>Comparison:</strong> Sunchronizer is compared against the configured per-panel fixed setup (orientation + tilt per panel). See <a href="https://github.com/nerdiy/Sunchronizer" target="_blank" style="color: #3498db; text-decoration: underline;">Sunchronizer repository</a> for details.</p>',
        
        // Comparison table
        fixedInstallation: 'Fixed Installation',
        dualAxisTracker: 'Dual-Axis Tracker',
        additionalBenefit: 'Additional Benefit',
        compareWithFixedInstallation: 'Compare with Fixed Installation:',
        annualYield: 'Annual Yield (Year 1)',
        paybackPeriod: 'Payback Period',
        yearsLabel: 'years',
        thirtyYearRevenue: '30-Year Revenue',
        faster: 'faster',
        notAvailable: 'N/A',
        southFacingPanel: 'South-Facing Panel (Adjustable tilt)',
        eastFacingPanel: 'East-Facing Panel (Adjustable tilt)',
        westFacingPanel: 'West-Facing Panel (Adjustable tilt)',
        mixedInstallation: 'Mixed fixed orientation',
        systemCapacityLabel: 'System Capacity',
        locationIrradiance: 'Location Irradiance',
        annualGenerationYear1: 'Annual Generation (Year 1)',
        annualSavingsYear1BeforeDegradation: 'Annual Savings (Year 1, before degradation)',
        total30YearEnergy: 'Total 30-Year Energy (with degradation)',
        total30YearMaintenanceCosts: 'Total 30-Year Maintenance Costs',
        net30YearProfit: 'Net 30-Year Profit',
        
        // Location regions
        europeRegion: 'Europe',
        middleEastAfricaRegion: 'Middle East & Africa',
        asiaRegion: 'Asia',
        americasRegion: 'Americas',
        oceaniaRegion: 'Oceania',
        
        // Tooltips and hints
        needToFindCoordinates: 'Need to find exact coordinates? Use'
    },
    de: {
        // Header
        title: 'Sunchronizer ROI Rechner',
        subtitle: 'Berechnen Sie die Amortisationszeit und Kapitalrendite für Ihr dual-axis Solarverfolgungssystem',
        
        // Sections
        systemConfig: 'Systemkonfiguration',
        investmentAnalysis: 'Investitionsanalyse',
        plannedPVSystem: 'Geplantes PV-System',
        sharedSettingsTitle: 'Gemeinsame Systemeinstellungen',
        sharedSettingsHint: 'Diese Einstellungen gelten für System 1 und System 2',
        system1Title: 'System 1: Sunchronizer-System',
        system1TotalCostLabel: 'Gesamtinvestition System 1',
        system2Title: 'System 2: Referenzsystem (reine Festinstallation)',
        system2TotalCostLabel: 'Gesamtinvestition System 2',
        system2FixedPanels: 'System 2: Festinstallations-Panelsystem',
        locationTitle: 'Standort',
        location: 'Standort',
        economics: 'Wirtschaft',
        simpleExplanation: 'Erklärung',
        detailedBreakdown: 'Detaillierte Aufschlüsselung',
        comparisonTitle: 'Vergleich: Sunchronizer vs. Festinstallation',
        
        // Input labels
        numberOfModules: 'Anzahl der Module',
        modulePower: 'Modulleistung (W)',
        moduleCountTooltip: 'Wie viele PV-Module? (1-4 typisch für Balkonanlagen)',
        modulePowerTooltip: 'Nennleistung pro Modul. Standard: 300-600W',
        modulePowerHint: 'In 25W-Schritten einstellbar (typisch: 300-600W)',
        totalSystemCapacity: 'Gesamtsystemkapazität',
        system1Title: 'System 1: Sunchronizer-System',
        system1Description: 'Konfigurieren Sie Ihr Dual-Axis-Verfolgungssystem mit Sunchronizer-Trackern. Dieses System kann aus verfolgten und festen Panelen bestehen: Die Tracker handhaben die beweglichen Panels, während die verbleibenden Panels als Festinstallationen fungieren können. System 2 unten besteht ausschließlich aus festen Panels mit konfigurierbaren Ausrichtungen und Neigungswinkeln zum Vergleich.',
        system1PanelConfigTitle: 'System 1: Panel-Konfiguration (verfolgt durch Sunchronizer)',
        system1PanelConfigTooltip: 'Konfigurieren Sie Ausrichtung und Neigung für Panels, die NICHT von Trackern abgedeckt sind. Diese Panels bleiben in einer festen Position, während Tracker die anderen Panels automatisch anpassen.',
        system1PanelConfigHint: 'Zeigt N Panels an, wobei N = Gesamtmodule - Anzahl der Tracker. Diese festen Panels sind in Ihrem Sunchronizer-System enthalten.',
        system2Title: 'System 2: Referenzsystem (reine Festinstallation)',
        system2Description: 'Konfigurieren Sie ein Vergleichssystem mit denselben Modulanzahl, Leistung und Standort wie System 1, aber mit anderen Panel-Ausrichtungen und Neigungswinkeln. Dies ist Ihr "nicht-verfolgtes" Basis-Vergleichssystem.',
        system2Shares: 'System 2 teilt diese Werte mit System 1: Modulanzahl, Modulleistung, Standort, Strompreis, Eigenverbrauchsquote, Wartungskosten, Degradation, Systemeffizienz.',
        system2PanelConfigTitle: 'System 2: Panel-Konfiguration (Festinstallation)',
        system2PanelConfigTooltip: 'Konfigurieren Sie Ausrichtung und Neigung für ALLE Panels im Referenzsystem. Verwenden Sie andere Winkel als System 1, um zu sehen, wie die Ausrichtung die Leistung beeinflusst.',
        system2PanelConfigHint: 'Alle Module in System 2 werden hier mit festen Ausrichtungen und Neigungswinkeln konfiguriert (kein Tracking).',
        pvSystemCosts: 'PV-Systemkosten',
        pvSystemCostsTooltip: 'Aufschlüsselung der Komponentenpreise',
        costForOneSolarPanel: 'Kosten für ein Solarmodul',
        cablesAndConnectors: 'Kabel & Stecker',
        inverter: 'Wechselrichter',
        accessoriesAndInstallation: 'Zubehör & Installation',
        totalPVSystemCost: 'Gesamtkosten PV-System',
        totalSystemInvestment: 'Gesamtinvestition',
        annualIrradianceLabel: 'Jährliche Globalstrahlung',
        totalSystemInvestmentLabel: 'Gesamtinvestition',
        numberOfTrackers: 'Anzahl der Sunchronizer',
        trackerCountTooltip: 'Wie viele Dual-Axis-Tracker werden genutzt? Für größere Anlagen mit getrennten Trackern mehrere verwenden.',
        sunchronizerTrackerCost: 'Kosten für Sunchronizer Dual-Axis Tracker',
        sunchronizerTrackerCostPerUnit: 'Kosten für Sunchronizer Dual-Axis Tracker (pro Einheit)',
        trackerCostTooltip: 'Kosten eines Sunchronizer-Trackers inkl. 2-Achsen-Motoren, Sensorik und Elektronik. Siehe FAQ für Amortisationsdetails',
        fixedPanelSettingsTitle: 'Einstellungen Festinstallation je Panel',
        fixedPanelSettingsHint: 'Damit lassen sich gemischte Festinstallationen (z. B. Ost + West) gegen Sunchronizer vergleichen.',
        fixedPanelSettingsTooltip: 'Für den Vergleich: Ausrichtung und Neigung für jedes feste Panel definieren. Bei mehreren Panels jedes separat konfigurieren.',
        panelLabel: 'Panel',
        orientation: 'Ausrichtung',
        tiltAngle: 'Neigung (°)',
        moduleCountPlaceholder: 'z. B. 1',
        modulePowerPlaceholder: 'z. B. 400',
        trackerCountPlaceholder: 'z. B. 1',
        trackerCostPlaceholder: 'Tracker-Kosten pro Einheit',
        latitudePlaceholder: 'Nord positiv',
        longitudePlaceholder: 'Ost positiv',
        pricePerKwhPlaceholder: 'Preis pro kWh',
        percentagePlaceholder: 'Prozent',
        customLocationOption: 'Benutzerdefiniert (Koordinaten eingeben)',
        presetLocation: 'Vordefinierter Standort',
        locationPresetTooltip: 'Wählen Sie eine Stadt, um Koordinaten und Einstrahlung automatisch zu setzen',
        latitude: 'Breitengrad (°)',
        latitudeTooltip: 'Nord positiv, Süd negativ. Beeinflusst Einstrahlung und optimale Neigung',
        longitude: 'Längengrad (°)',
        longitudeTooltip: 'Ost positiv, West negativ. Wird für die Standortbestimmung genutzt',
        annualIrradiance: 'Jährliche Globalstrahlung',
        annualIrradianceTooltip: 'Globale horizontale Einstrahlung (GHI) aus PVGIS- und NASA-POWER-Datenbanken. Zeigt die mittlere tägliche Solarstrahlung am Standort.',
        coordinateHintHtml: 'Benötigen Sie die genauen Koordinaten? Verwenden Sie <a href="https://maps.google.com" target="_blank">Google Maps</a>, <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> oder <a href="https://pvgis.ec.europa.eu/pvgis.php" target="_blank">PVGIS</a>, um exakte Breiten-/Längengrade zu finden.',
        electricityPrice: 'Strompreis',
        electricityPriceTooltip: 'Preis pro kWh. In der Regel auf der Stromrechnung zu finden',
        selfConsumptionRate: 'Eigenverbrauchsquote',
        selfConsumptionTooltip: 'Welcher Anteil der erzeugten Energie wird direkt selbst genutzt? (typisch 50% im Haushalt)',
        feedInTariff: 'Einspeisevergütung',
        feedInTariffTooltip: 'Preis pro kWh für ins Netz eingespeisten Strom. Bei Nichtnutzung 0 lassen',
        maintenanceCost: 'Jährliche Wartungskosten',
        moduleDegradation: 'Modulabbau',
        systemEfficiency: 'Systemeffizienz',
        trackingBonus: 'Tracking-Bonus',
        environmentalLosses: 'Umweltverluste',
        comparisonType: 'Vergleichstyp',
        panelTilt: 'Neigungswinkel des Panels',
        calculate: 'Berechnen',
        withSunchronizer: 'mit Sunchronizer',
        fixedInstallationShort: 'Festinstallation',
        
        // Result labels
        paybackPeriodTracker: 'Amortisationszeit (mit Sunchronizer)',
        paybackPeriodFixed: 'Amortisationszeit (Festinstallation)',
        annualEnergyYield: 'Jährliche Energieerzeugung',
        annualSavings: 'Jährliche Einsparungen',
        roiLabel: '30-Jahres-ROI',
        cumulativeSavings: 'Kumulierte Einsparungen (30 Jahre)',
        co2Avoided: 'Vermiedene CO₂-Emissionen (30 Jahre)',
        savingsChartTitle: 'Kumulierte Einsparungen im Zeitverlauf',
        yieldChartTitle: 'Jährlicher Energieertrag pro Jahr',
        co2ChartTitle: 'Vermiedene CO₂-Emissionen (30 Jahre)',
        annualEnergyYieldComparison: 'Vergleich des jährlichen Energieertrags',
        
        // Units
        years: 'Jahre',
        kwhPerYear: 'kWh/Jahr',
        tons: 'Tonnen',
        perYear: '/Jahr',
        perKwh: '/kWh',
        perYearLabel: 'pro Jahr',
        percentPerYear: '% /Jahr',
        cumulativeLabel: 'kumuliert',
        breakEvenPoint: 'Break-Even-Punkt',
        maintenanceCostTooltip: 'Jährliche Kosten für Reinigung, Inspektion und Reparaturen (typisch 0-50€/Jahr)',
        maintenanceCostPlaceholder: 'Währung/Jahr',
        moduleDegradationTooltip: 'Wie viel Effizienz pro Jahr verloren geht. Typisch: 0,5% für hochwertige Module',
        moduleDegradationPlaceholder: 'Prozent pro Jahr',
        systemEfficiencyHint: 'Typisch: 85% (einschließlich Wechselrichter- und Leitungsverlusten)',
        trackingBonusTooltip: 'Zusätzlicher Ertrag gegenüber Festinstallationen. Siehe Messdaten',
        trackingBonusHint: 'Typisch: 25-40% gegenüber einer Festinstallation. Siehe Messdaten für Praxiswerte.',
        environmentalLossesTooltip: 'Leistungsverlust durch Staub, Schmutz, Schnee und andere Verschmutzungen. Je nach Klima typischerweise 1-5%. Siehe NREL-Studien oder lokale PV-Daten',
        environmentalLossesHint: 'Klimaleitfaden: Mittelmeer 2-3%, Sahara 4-5%, Tropen 3-4%, gemäßigt 1-2%',
        methodologyHeader: 'Wie funktioniert der Rechner?',
        methodologyHtml: '<p><strong>Berechnungsmethode:</strong></p><ol><li><strong>Systemkapazität:</strong> Anzahl der Module × Leistung pro Modul = Gesamtkapazität (kW)</li><li><strong>Tracker-Ertrag:</strong> Einstrahlung (von <a href="https://pvgis.ec.europa.eu/" target="_blank" style="color: #3498db; text-decoration: underline;">PVGIS</a> / <a href="https://power.larc.nasa.gov/" target="_blank" style="color: #3498db; text-decoration: underline;">NASA POWER</a>) × Systemkapazität × 365 × Systemeffizienz × Tracking-Bonus × Umweltverluste</li><li><strong>Festinstallations-Ertrag (neu):</strong> Für jedes Panel werden Ausrichtung und Neigung separat bewertet. Der Referenzwert nutzt den Durchschnitt aller konfigurierten Panel-Faktoren.</li><li><strong>Modulabbau:</strong> Jedes Jahr verlieren die Module durch Alterung standardmäßig 0,5% Effizienz</li><li><strong>Inflationsanpassung:</strong> Strompreise steigen standardmäßig um 2% pro Jahr</li><li><strong>Jährliche Einsparungen:</strong> Eigenverbrauch × Strompreis + Einspeisung × Einspeisevergütung - Wartungskosten</li><li><strong>Amortisationszeit:</strong> Gesamtinvestition ÷ jährliche Einsparungen (Jahr 1)</li><li><strong>30-Jahres-ROI:</strong> (Gesamte Einsparungen - Investition) ÷ Investition × 100%</li><li><strong>CO₂-Vermeidung:</strong> Erzeugte Energie × 0,4 kg CO₂/kWh (europäischer Durchschnitt)</li></ol><p style="margin-top: 15px;"><strong>Vergleich:</strong> Sunchronizer wird mit dem konfigurierten Fest-Setup verglichen (Ausrichtung + Neigung je Panel). Siehe <a href="https://github.com/nerdiy/Sunchronizer" target="_blank" style="color: #3498db; text-decoration: underline;">Sunchronizer Repository</a> für Details.</p>',
        
        // Comparison table
        fixedInstallation: 'Festinstallation',
        dualAxisTracker: 'Dual-Axis Tracker',
        additionalBenefit: 'Zusätzlicher Vorteil',
        compareWithFixedInstallation: 'Vergleich mit Festinstallation:',
        annualYield: 'Jährliche Erzeugung (Jahr 1)',
        paybackPeriod: 'Amortisationszeit',
        yearsLabel: 'Jahre',
        thirtyYearRevenue: '30-Jahres-Umsatz',
        faster: 'schneller',
        notAvailable: 'k. A.',
        southFacingPanel: 'Südpanel (Neigung einstellbar)',
        eastFacingPanel: 'Ostpanel (Neigung einstellbar)',
        westFacingPanel: 'Westpanel (Neigung einstellbar)',
        mixedInstallation: 'Gemischte Festausrichtung',
        systemCapacityLabel: 'Systemkapazität',
        locationIrradiance: 'Standortstrahlung',
        annualGenerationYear1: 'Jährliche Erzeugung (Jahr 1)',
        annualSavingsYear1BeforeDegradation: 'Jährliche Einsparungen (Jahr 1, vor Degradation)',
        total30YearEnergy: 'Gesamtenergie über 30 Jahre (mit Degradation)',
        total30YearMaintenanceCosts: 'Gesamte Wartungskosten über 30 Jahre',
        net30YearProfit: 'Nettogewinn über 30 Jahre',
        
        // Location regions
        europeRegion: 'Europa',
        middleEastAfricaRegion: 'Naher Osten & Afrika',
        asiaRegion: 'Asien',
        americasRegion: 'Amerika',
        oceaniaRegion: 'Ozeanien',
        
        // Tooltips and hints
        needToFindCoordinates: 'Benötigen Sie die genauen Koordinaten? Verwenden Sie'
    }
};

// ============================================================================
// UI Elements
// ============================================================================

const elements = {
    // Investment elements
    investmentPanels: document.getElementById('investmentPanels'),
    investmentCables: document.getElementById('investmentCables'),
    investmentInverter: document.getElementById('investmentInverter'),
    investmentAccessories: document.getElementById('investmentAccessories'),
    investmentTracker: document.getElementById('investmentTracker'),
    pvSystemTotal: document.getElementById('pvSystemTotal'),
    system1TotalCost: document.getElementById('system1TotalCost'),
    system2TotalCost: document.getElementById('system2TotalCost'),
    
    // Input elements
    currency: document.getElementById('currency'),
    locationPreset: document.getElementById('locationPreset'),
    latitude: document.getElementById('latitude'),
    longitude: document.getElementById('longitude'),
    moduleCount: document.getElementById('moduleCount'),
    modulePower: document.getElementById('modulePower'),
    trackerCount: document.getElementById('trackerCount'),
    electricityPrice: document.getElementById('electricityPrice'),
    selfConsumption: document.getElementById('selfConsumption'),
    feedInTariff: document.getElementById('feedInTariff'),
    maintenanceCost: document.getElementById('maintenanceCost'),
    moduleDegradation: document.getElementById('moduleDegradation'),
    systemEfficiency: document.getElementById('systemEfficiency'),
    trackingBonus: document.getElementById('trackingBonus'),
    environmentalLosses: document.getElementById('environmentalLosses'),
    fixedPanelSettingsContainer: document.getElementById('fixedPanelSettingsContainer'),
    comparisonPanelSettingsContainer: document.getElementById('comparisonPanelSettingsContainer'),
    calculateBtn: document.getElementById('calculateBtn'),

    // Display elements
    irradianceDisplay: document.getElementById('irradianceDisplay'),
    capacityDisplay: document.getElementById('capacityDisplay'),
    paybackPeriod: document.getElementById('paybackPeriod'),
    paybackPeriodFixed: document.getElementById('paybackPeriodFixed'),
    annualYield: document.getElementById('annualYield'),
    annualYieldFixed: document.getElementById('annualYieldFixed'),
    annualSavings: document.getElementById('annualSavings'),
    annualSavingsFixed: document.getElementById('annualSavingsFixed'),
    roiValue: document.getElementById('roiValue'),
    roiValueFixed: document.getElementById('roiValueFixed'),
    cumulativeSavings: document.getElementById('cumulativeSavings'),
    cumulativeSavingsFixed: document.getElementById('cumulativeSavingsFixed'),
    co2Avoided: document.getElementById('co2Avoided'),
    co2AvoidedFixed: document.getElementById('co2AvoidedFixed'),

    // Detail elements
    detailCapacity: document.getElementById('detailCapacity'),
    detailIrradiance: document.getElementById('detailIrradiance'),
    detailGeneration: document.getElementById('detailGeneration'),
    detailSavingsYear1: document.getElementById('detailSavingsYear1'),
    detailTotalEnergy: document.getElementById('detailTotalEnergy'),
    detailMaintenance: document.getElementById('detailMaintenance'),
    detailNetProfit: document.getElementById('detailNetProfit'),

    // Comparison elements
    compareFixedYield: document.getElementById('compareFixedYield'),
    compareTrackerYield: document.getElementById('compareTrackerYield'),
    compareYieldDiff: document.getElementById('compareYieldDiff'),
    compareFixedPayback: document.getElementById('compareFixedPayback'),
    compareTrackerPayback: document.getElementById('compareTrackerPayback'),
    comparePaybackDiff: document.getElementById('comparePaybackDiff'),
    compareFixedRevenue: document.getElementById('compareFixedRevenue'),
    compareTrackerRevenue: document.getElementById('compareTrackerRevenue'),
    compareRevenueDiff: document.getElementById('compareRevenueDiff'),

    // Chart elements
    savingsChart: document.getElementById('savingsChart'),
    yieldChart: document.getElementById('yieldChart'),
    co2Chart: document.getElementById('co2Chart'),
    comparisonChart: document.getElementById('comparisonChart'),
    explanationText: document.getElementById('explanationText'),

    // Currency symbols
    currencySymbols: document.querySelectorAll('#currencySymbol, #currencySymbol2, #currencySymbolInvest, #currencySymbolSystem1, #currencySymbolSystem2')
};

// Chart instances
let savingsChartInstance = null;
let yieldChartInstance = null;
let co2ChartInstance = null;
let comparisonChartInstance = null;

// ============================================================================
// Event Listeners
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Set initial language button
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'en' ? 'DE' : 'EN';
        langBtn.addEventListener('click', function() {
            const newLang = currentLanguage === 'en' ? 'de' : 'en';
            changeLanguage(newLang);
        });
    }
    
    // Investment listeners
    elements.investmentPanels.addEventListener('input', updateInvestmentTotals);
    elements.investmentCables.addEventListener('input', updateInvestmentTotals);
    elements.investmentInverter.addEventListener('input', updateInvestmentTotals);
    elements.investmentAccessories.addEventListener('input', updateInvestmentTotals);
    elements.investmentTracker.addEventListener('input', updateInvestmentTotals);
    elements.trackerCount.addEventListener('input', () => {
        updateInvestmentTotals();
        syncFixedPanelSettings();
    });
    
    // Other listeners
    elements.locationPreset.addEventListener('change', updateLocationFromPreset);
    elements.latitude.addEventListener('change', updateIrradianceDisplay);
    elements.longitude.addEventListener('change', updateIrradianceDisplay);
    elements.moduleCount.addEventListener('input', () => {
        updateCapacityDisplay();
        updateTrackerCountMaxAttribute();
        syncFixedPanelSettings();
        syncComparisonPanelSettings();
        updateInvestmentTotals();
    });
    elements.modulePower.addEventListener('input', () => {
        updateCapacityDisplay();
        performCalculation();
    });
    elements.currency.addEventListener('change', () => {
        updateCurrencySymbols();
        updateInvestmentTotals();
    });
    elements.electricityPrice.addEventListener('input', performCalculation);
    elements.selfConsumption.addEventListener('input', performCalculation);
    elements.feedInTariff.addEventListener('input', performCalculation);
    elements.calculateBtn.addEventListener('click', performCalculation);

    // Methodology section toggle
    const methodologyHeader = document.querySelector('.methodology-header');
    if (methodologyHeader) {
        methodologyHeader.addEventListener('click', toggleMethodology);
    }

    // Initial setup
    applyTranslations();
    updateCapacityDisplay();
    updateTrackerCountMaxAttribute();
    syncFixedPanelSettings();
    syncComparisonPanelSettings();
    updateIrradianceDisplay();
    updateCurrencySymbols();
    updateInvestmentTotals();
    performCalculation();
    
    console.log('Sunchronizer ROI Calculator loaded successfully');
    console.log('Current language:', currentLanguage);
});

// ============================================================================
// Methodology Toggle
// ============================================================================

function toggleMethodology() {
    const header = document.querySelector('.methodology-header');
    const content = document.querySelector('.methodology-content');
    header.classList.toggle('open');
    content.classList.toggle('open');
}

// ============================================================================
// Investment Management
// ============================================================================

function updateInvestmentTotals() {
    const moduleCount = parseInt(elements.moduleCount.value) || 1;
    const panelCostPerModule = parseFloat(elements.investmentPanels.value) || 0;
    const totalPanelsCost = panelCostPerModule * moduleCount;
    
    const cables = parseFloat(elements.investmentCables.value) || 0;
    const inverter = parseFloat(elements.investmentInverter.value) || 0;
    const accessories = parseFloat(elements.investmentAccessories.value) || 0;
    const trackerCostPerUnit = parseFloat(elements.investmentTracker.value) || 0;
    const trackerCount = parseInt(elements.trackerCount.value) || 1;
    const totalTrackerCost = trackerCostPerUnit * trackerCount;
    
    const pvTotal = totalPanelsCost + cables + inverter + accessories;
    const system1Total = pvTotal + totalTrackerCost;  // PV System + Trackers
    const system2Total = pvTotal;                       // PV System only (no trackers)
    
    elements.pvSystemTotal.textContent = Math.round(pvTotal);
    elements.system1TotalCost.textContent = Math.round(system1Total);
    elements.system2TotalCost.textContent = Math.round(system2Total);
    
    // Trigger calculation when investment changes
    performCalculation();
}

// ============================================================================
// Location Management
// ============================================================================

function updateLocationFromPreset() {
    const preset = LOCATION_DATABASE[elements.locationPreset.value];
    if (preset) {
        elements.latitude.value = preset.lat;
        elements.longitude.value = preset.lon;
        applyDefaultTiltToAllFixedPanels();
        updateIrradianceDisplay();
    }
}

function updateIrradianceDisplay() {
    const ghi = getIrradianceForLocation(
        parseFloat(elements.latitude.value),
        parseFloat(elements.longitude.value)
    );
    elements.irradianceDisplay.textContent = ghi.toFixed(2);
}

function getIrradianceForLocation(lat, lon) {
    // Simplified irradiance model based on latitude
    // Actual values should come from PVGIS API for production use
    
    const absLat = Math.abs(lat);
    
    // Base model: irradiance decreases with latitude
    let baseGhi = 6.0 - (absLat / 90) * 2.0;
    
    // Adjust for hemisphere seasonality
    if (lat > 40) {
        baseGhi = Math.max(3.5, baseGhi * 0.9);
    } else if (lat < -40) {
        baseGhi = Math.max(3.5, baseGhi * 0.9);
    } else if (absLat < 25) {
        baseGhi = Math.min(6.5, baseGhi * 1.1);
    }
    
    return Math.max(2.5, Math.min(7.0, baseGhi));
}

// ============================================================================
// Display Updates
// ============================================================================

function updateCapacityDisplay() {
    const capacity = (parseInt(elements.moduleCount.value) * parseInt(elements.modulePower.value)) / 1000;
    elements.capacityDisplay.textContent = capacity.toFixed(2);
}

function updateTrackerCountMaxAttribute() {
    const moduleCount = Math.max(1, parseInt(elements.moduleCount.value) || 1);
    elements.trackerCount.max = moduleCount;
    
    // If current tracker count exceeds module count, limit it
    if (parseInt(elements.trackerCount.value) > moduleCount) {
        elements.trackerCount.value = moduleCount;
    }
}

function getDefaultFixedTilt() {
    const latitude = parseFloat(elements.latitude.value) || 30;
    return Math.min(45, Math.max(15, Math.abs(latitude)));
}

function buildOrientationOptionsHtml(selected) {
    return FIXED_ORIENTATION_OPTIONS.map(option => {
        const selectedAttr = selected === option ? ' selected' : '';
        return `<option value="${option}"${selectedAttr}>${getFixedInstallationLabel(option)}</option>`;
    }).join('');
}

function createFixedPanelSettingsRow(index, orientation = 'south-custom', tilt = getDefaultFixedTilt()) {
    const row = document.createElement('div');
    row.className = 'fixed-panel-row';
    row.dataset.panelIndex = String(index + 1);

    row.innerHTML = `
        <div class="fixed-panel-index">${t('panelLabel')} ${index + 1}</div>
        <select class="fixed-panel-orientation" aria-label="${t('orientation')} ${index + 1}">
            ${buildOrientationOptionsHtml(orientation)}
        </select>
        <input type="number" class="fixed-panel-tilt" min="-90" max="90" step="5" value="${Number(tilt)}" aria-label="${t('tiltAngle')} ${index + 1}">
    `;

    const orientationSelect = row.querySelector('.fixed-panel-orientation');
    const tiltInput = row.querySelector('.fixed-panel-tilt');
    if (orientationSelect) orientationSelect.addEventListener('change', performCalculation);
    if (tiltInput) tiltInput.addEventListener('input', performCalculation);

    return row;
}

function getFixedPanelSettings() {
    if (!elements.fixedPanelSettingsContainer) {
        return [{ orientation: 'south-custom', tilt: getDefaultFixedTilt() }];
    }

    const rows = elements.fixedPanelSettingsContainer.querySelectorAll('.fixed-panel-row');
    if (rows.length === 0) {
        return [{ orientation: 'south-custom', tilt: getDefaultFixedTilt() }];
    }

    return Array.from(rows).map(row => {
        const orientationEl = row.querySelector('.fixed-panel-orientation');
        const tiltEl = row.querySelector('.fixed-panel-tilt');
        return {
            orientation: orientationEl ? orientationEl.value : 'south-custom',
            tilt: tiltEl ? (parseFloat(tiltEl.value) || getDefaultFixedTilt()) : getDefaultFixedTilt()
        };
    });
}

function syncFixedPanelSettings() {
    if (!elements.fixedPanelSettingsContainer) {
        return;
    }

    let moduleCount = Math.max(1, parseInt(elements.moduleCount.value) || 1);
    let trackerCount = Math.max(1, parseInt(elements.trackerCount.value) || 1);
    
    // VALIDATION: Tracker count cannot exceed module count
    if (trackerCount > moduleCount) {
        trackerCount = moduleCount;
        elements.trackerCount.value = moduleCount;
    }
    
    const fixedPanelCount = Math.max(0, moduleCount - trackerCount);
    const existingSettings = getFixedPanelSettings();

    elements.fixedPanelSettingsContainer.innerHTML = '';

    for (let i = 0; i < fixedPanelCount; i++) {
        const previous = existingSettings[i] || { orientation: 'south-custom', tilt: getDefaultFixedTilt() };
        const row = createFixedPanelSettingsRow(i, previous.orientation, previous.tilt);
        elements.fixedPanelSettingsContainer.appendChild(row);
    }

    performCalculation();
}

function applyDefaultTiltToAllFixedPanels() {
    if (!elements.fixedPanelSettingsContainer) {
        return;
    }

    const defaultTilt = getDefaultFixedTilt();
    const tiltInputs = elements.fixedPanelSettingsContainer.querySelectorAll('.fixed-panel-tilt');
    tiltInputs.forEach(input => {
        input.value = String(defaultTilt);
    });
}

function getComparisonPanelSettings() {
    if (!elements.comparisonPanelSettingsContainer) {
        return [{ orientation: 'south-custom', tilt: getDefaultFixedTilt() }];
    }

    const rows = elements.comparisonPanelSettingsContainer.querySelectorAll('.fixed-panel-row');
    if (rows.length === 0) {
        return [{ orientation: 'south-custom', tilt: getDefaultFixedTilt() }];
    }

    return Array.from(rows).map(row => {
        const orientationEl = row.querySelector('.fixed-panel-orientation');
        const tiltEl = row.querySelector('.fixed-panel-tilt');
        return {
            orientation: orientationEl ? orientationEl.value : 'south-custom',
            tilt: tiltEl ? (parseFloat(tiltEl.value) || getDefaultFixedTilt()) : getDefaultFixedTilt()
        };
    });
}

function syncComparisonPanelSettings() {
    if (!elements.comparisonPanelSettingsContainer) {
        return;
    }

    const moduleCount = Math.max(1, parseInt(elements.moduleCount.value) || 1);
    const existingSettings = getComparisonPanelSettings();

    elements.comparisonPanelSettingsContainer.innerHTML = '';

    for (let i = 0; i < moduleCount; i++) {
        const previous = existingSettings[i] || { orientation: 'south-custom', tilt: getDefaultFixedTilt() };
        const row = createFixedPanelSettingsRow(i, previous.orientation, previous.tilt);
        elements.comparisonPanelSettingsContainer.appendChild(row);
    }

    performCalculation();
}

function applyDefaultTiltToAllComparisonPanels() {
    if (!elements.comparisonPanelSettingsContainer) {
        return;
    }

    const defaultTilt = getDefaultFixedTilt();
    const tiltInputs = elements.comparisonPanelSettingsContainer.querySelectorAll('.fixed-panel-tilt');
    tiltInputs.forEach(input => {
        input.value = String(defaultTilt);
    });
}

function updateCurrencySymbols() {
    const symbol = CURRENCY_SYMBOLS[elements.currency.value];
    elements.currencySymbols.forEach(el => el.textContent = symbol);
}

function getSelectedLocationName() {
    const selectedKey = elements.locationPreset.value;
    if (selectedKey !== 'custom' && LOCATION_DATABASE[selectedKey]) {
        const locationName = LOCATION_DATABASE[selectedKey].name;
        const cityMatch = locationName.match(/\(([^)]+)\)/);
        return cityMatch ? cityMatch[1] : locationName;
    }

    const lat = parseFloat(elements.latitude.value) || 0;
    const lon = parseFloat(elements.longitude.value) || 0;
    return `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
}

function t(key) {
    return TRANSLATIONS[currentLanguage][key] || key;
}

function getFixedInstallationLabel(type) {
    switch (type) {
        case 'south-custom':
            return t('southFacingPanel');
        case 'east-custom':
            return t('eastFacingPanel');
        case 'west-custom':
            return t('westFacingPanel');
        case 'ewsplit-custom':
            return t('eastWestSplitInstallation');
        default:
            return t('fixedInstallation');
    }
}

function getFixedComparisonLabel(panelSettings) {
    if (!panelSettings || panelSettings.length === 0) {
        return t('fixedInstallation');
    }

    const uniqueOrientations = [...new Set(panelSettings.map(panel => panel.orientation))];
    if (uniqueOrientations.length === 1) {
        return getFixedInstallationLabel(uniqueOrientations[0]);
    }

    return t('mixedInstallation');
}

function formatCurrency(amount, decimals = 0) {
    return `${Number(amount).toFixed(decimals)} ${CURRENCY_SYMBOLS[elements.currency.value]}`;
}

function setText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function setLabelText(selector, text) {
    const element = document.querySelector(selector);
    if (!element) {
        return;
    }

    const textNode = Array.from(element.childNodes).find(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
    );

    if (textNode) {
        textNode.textContent = ` ${text} `;
    } else {
        element.prepend(document.createTextNode(`${text} `));
    }
}

function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = currentLanguage === 'de'
        ? 'Sunchronizer ROI & Amortisationsrechner'
        : 'Sunchronizer ROI & Amortization Calculator';

    setText('h1', t('title'));
    setText('.subtitle', t('subtitle'));
    setText('.input-panel > h2', t('systemConfig'));
    setText('.results-panel > h2', t('investmentAnalysis'));

    elements.moduleCount.placeholder = t('moduleCountPlaceholder');
    elements.modulePower.placeholder = t('modulePowerPlaceholder');
    elements.trackerCount.placeholder = t('trackerCountPlaceholder');
    elements.investmentTracker.placeholder = t('trackerCostPlaceholder');
    elements.latitude.placeholder = t('latitudePlaceholder');
    elements.longitude.placeholder = t('longitudePlaceholder');
    elements.electricityPrice.placeholder = t('pricePerKwhPlaceholder');
    elements.feedInTariff.placeholder = t('pricePerKwhPlaceholder');
    elements.selfConsumption.placeholder = t('percentagePlaceholder');
    elements.systemEfficiency.placeholder = t('percentagePlaceholder');
    elements.trackingBonus.placeholder = t('percentagePlaceholder');
    elements.environmentalLosses.placeholder = t('percentagePlaceholder');

    const customLocationOption = elements.locationPreset.querySelector('option[value="custom"]');
    if (customLocationOption) customLocationOption.textContent = t('customLocationOption');

    // Update location region groups
    const optgroups = elements.locationPreset.querySelectorAll('optgroup');
    if (optgroups.length >= 5) {
        optgroups[0].label = t('europeRegion');
        optgroups[1].label = t('middleEastAfricaRegion');
        optgroups[2].label = t('asiaRegion');
        optgroups[3].label = t('americasRegion');
        optgroups[4].label = t('oceaniaRegion');
    }

    // Translate section headings using IDs (now available with new layout)
    setText('#sharedSettingsTitle', t('sharedSettingsTitle'));
    setText('#system1Title', t('system1Title'));
    setText('#system2Title', t('system2Title'));
    setText('#locationTitle', t('locationTitle'));
    
    // Note: Other section headings like "Economics" are translated via later selectors
    
    // System 1 and System 2 descriptions
    const system1DescEl = document.getElementById('system1Description');
    if (system1DescEl) system1DescEl.textContent = t('system1Description');
    const system2DescEl = document.getElementById('system2Description');
    if (system2DescEl) system2DescEl.textContent = t('system2Description');
    
    // System 2 shared values info
    const system2SharesEl = document.getElementById('system2Shares');
    if (system2SharesEl) {
        system2SharesEl.innerHTML = `<strong>${currentLanguage === 'de' ? 'System 2 teilt mit System 1:' : 'System 2 shares with System 1:'}</strong> ${t('system2Shares').replace(/^System 2[^:]*:\s*/, '')}`;
    }
    
    // System 1 panel config
    const system1PanelLabel = document.getElementById('system1PanelConfigLabel');
    if (system1PanelLabel) setLabelText('#system1PanelConfigLabel', t('system1PanelConfigTitle'));
    const system1PanelTooltip = document.getElementById('system1PanelConfigTooltip');
    if (system1PanelTooltip) system1PanelTooltip.textContent = t('system1PanelConfigTooltip');
    const system1PanelHint = document.getElementById('system1PanelConfigHint');
    if (system1PanelHint) system1PanelHint.textContent = t('system1PanelConfigHint');
    
    // System 2 panel config
    const system2PanelLabel = document.getElementById('system2PanelConfigLabel');
    if (system2PanelLabel) setLabelText('#system2PanelConfigLabel', t('system2PanelConfigTitle'));
    const system2PanelTooltip = document.getElementById('system2PanelConfigTooltip');
    if (system2PanelTooltip) system2PanelTooltip.textContent = t('system2PanelConfigTooltip');
    const system2PanelHint = document.getElementById('system2PanelConfigHint');
    if (system2PanelHint) system2PanelHint.textContent = t('system2PanelConfigHint');

    setLabelText('label[for="moduleCount"]', t('numberOfModules'));
    setLabelText('label[for="modulePower"]', t('modulePower'));
    const moduleCountTooltip = document.querySelector('label[for="moduleCount"] .tooltip-text');
    if (moduleCountTooltip) moduleCountTooltip.textContent = t('moduleCountTooltip');
    const modulePowerTooltip = document.querySelector('label[for="modulePower"] .tooltip-text');
    if (modulePowerTooltip) modulePowerTooltip.textContent = t('modulePowerTooltip');
    const modulePowerHint = document.getElementById('modulePowerHint');
    if (modulePowerHint) modulePowerHint.textContent = t('modulePowerHint');
    setText('label[for="totalCapacity"]', `${t('totalSystemCapacity')}:`);
    setLabelText('.input-panel .section:first-of-type .input-group:nth-of-type(4) > label', t('pvSystemCosts'));
    const pvSystemTooltip = document.querySelector('.input-panel .section:first-of-type .input-group:nth-of-type(4) .tooltip-text');
    if (pvSystemTooltip) pvSystemTooltip.textContent = t('pvSystemCostsTooltip');
    const componentLabels = document.querySelectorAll('.investment-components .component-label');
    if (componentLabels[0]) componentLabels[0].textContent = t('costForOneSolarPanel');
    if (componentLabels[1]) componentLabels[1].textContent = t('cablesAndConnectors');
    if (componentLabels[2]) componentLabels[2].textContent = t('inverter');
    if (componentLabels[3]) componentLabels[3].textContent = t('accessoriesAndInstallation');
    setText('.investment-components .total-cost-label', `${t('totalPVSystemCost')}:`);
    setLabelText('label[for="trackerCount"]', t('numberOfTrackers'));
    const trackerCountTooltip = document.querySelector('label[for="trackerCount"] .tooltip-text');
    if (trackerCountTooltip) trackerCountTooltip.textContent = t('trackerCountTooltip');
    setLabelText('.input-panel .section:first-of-type .input-group:nth-of-type(6) > label', t('sunchronizerTrackerCostPerUnit'));
    const trackerCostTooltip = document.querySelector('.input-panel .section:first-of-type .input-group:nth-of-type(6) .tooltip-text');
    if (trackerCostTooltip) {
        trackerCostTooltip.innerHTML = `${t('trackerCostTooltip').replace('FAQ', '<a href="../../FAQ.md#q-when-does-the-sunchronizer-pay-for-itself" target="_blank" style="color: white; text-decoration: underline;">FAQ</a>')}`;
    }
    // Translate new section labels and totals
    const sharedSettingsTitle = document.getElementById('sharedSettingsTitle');
    if (sharedSettingsTitle) sharedSettingsTitle.textContent = t('sharedSettingsTitle');
    const sharedSettingsHint = document.getElementById('sharedSettingsHint');
    if (sharedSettingsHint) sharedSettingsHint.textContent = t('sharedSettingsHint');
    
    const system1TotalCostLabel = document.getElementById('system1TotalCostLabel');
    if (system1TotalCostLabel) system1TotalCostLabel.textContent = t('system1TotalCostLabel') + ':';
    const system2TotalCostLabel = document.getElementById('system2TotalCostLabel');
    if (system2TotalCostLabel) system2TotalCostLabel.textContent = t('system2TotalCostLabel') + ':';
    
    const locationTitle = document.getElementById('locationTitle');
    if (locationTitle) locationTitle.textContent = t('locationTitle');
    
    setText('.input-panel .section:first-of-type > .total-cost-display .total-cost-label', `${t('totalSystemInvestment')}:`);
    
    // Translate Annual Irradiance label
    const annualIrradianceLabel = document.getElementById('annualIrradianceLabel');
    if (annualIrradianceLabel) annualIrradianceLabel.textContent = t('annualIrradianceLabel');
    
    // Translate Total System Investment label
    const totalSystemInvestmentLabel = document.getElementById('totalSystemInvestmentLabel');
    if (totalSystemInvestmentLabel) totalSystemInvestmentLabel.textContent = t('totalSystemInvestmentLabel');
    
    // Translate System Efficiency hint (using the label ID now)
    const systemEfficiencyHintLabel = document.getElementById('systemEfficiencyHintLabel');
    if (systemEfficiencyHintLabel) systemEfficiencyHintLabel.textContent = t('systemEfficiencyHint');
    
    // Translate Tracking Bonus hint (using the label ID now)
    const trackingBonusHintLabel = document.getElementById('trackingBonusHintLabel');
    if (trackingBonusHintLabel) trackingBonusHintLabel.innerHTML = `${t('trackingBonusHint').replace('Measurements Data', '<a href="https://github.com/nerdiy/Sunchronizer/tree/main/docu/measurements" target="_blank">Measurements Data</a>')}`;
    
    // Translate Environmental Losses hint (using the label ID now)
    const environmentalLossesHintLabel = document.getElementById('environmentalLossesHintLabel');
    if (environmentalLossesHintLabel) environmentalLossesHintLabel.textContent = t('environmentalLossesHint');
    setLabelText('label[for="locationPreset"]', t('presetLocation'));
    const locationPresetTooltip = document.querySelector('label[for="locationPreset"] .tooltip-text');
    if (locationPresetTooltip) locationPresetTooltip.textContent = t('locationPresetTooltip');
    setText('#coordinatesHint', '');
    const coordinatesHint = document.getElementById('coordinatesHint');
    if (coordinatesHint) coordinatesHint.innerHTML = t('coordinateHintHtml');
    setLabelText('label[for="latitude"]', t('latitude'));
    const latitudeTooltip = document.querySelector('label[for="latitude"] .tooltip-text');
    if (latitudeTooltip) latitudeTooltip.textContent = t('latitudeTooltip');
    setLabelText('label[for="longitude"]', t('longitude'));
    const longitudeTooltip = document.querySelector('label[for="longitude"] .tooltip-text');
    if (longitudeTooltip) longitudeTooltip.textContent = t('longitudeTooltip');
    setLabelText('label[for="electricityPrice"]', t('electricityPrice'));
    const electricityTooltip = document.querySelector('label[for="electricityPrice"] .tooltip-text');
    if (electricityTooltip) electricityTooltip.textContent = t('electricityPriceTooltip');
    setLabelText('label[for="selfConsumption"]', t('selfConsumptionRate'));
    const selfConsumptionTooltip = document.querySelector('label[for="selfConsumption"] .tooltip-text');
    if (selfConsumptionTooltip) selfConsumptionTooltip.textContent = t('selfConsumptionTooltip');
    setLabelText('label[for="feedInTariff"]', t('feedInTariff'));
    const feedInTooltip = document.querySelector('label[for="feedInTariff"] .tooltip-text');
    if (feedInTooltip) feedInTooltip.textContent = t('feedInTariffTooltip');
    setLabelText('label[for="maintenanceCost"]', t('maintenanceCost'));
    setLabelText('label[for="moduleDegradation"]', t('moduleDegradation'));
    setLabelText('label[for="systemEfficiency"]', `${t('systemEfficiency')} (Inverter, Wiring):`);
    setLabelText('label[for="trackingBonus"]', t('trackingBonus'));
    setLabelText('label[for="environmentalLosses"]', t('environmentalLosses'));
    setText('#calculateBtn', t('calculate'));

    elements.maintenanceCost.placeholder = t('maintenanceCostPlaceholder');
    elements.moduleDegradation.placeholder = t('moduleDegradationPlaceholder');

    const maintenanceUnit = document.querySelector('#maintenanceCost + .unit');
    if (maintenanceUnit) maintenanceUnit.textContent = t('perYear');

    const degradationUnit = document.querySelector('#moduleDegradation + .unit');
    if (degradationUnit) degradationUnit.textContent = t('percentPerYear');

    const maintenanceTooltip = document.querySelector('label[for="maintenanceCost"] .tooltip-text');
    if (maintenanceTooltip) maintenanceTooltip.textContent = t('maintenanceCostTooltip');

    const degradationTooltip = document.querySelector('label[for="moduleDegradation"] .tooltip-text');
    if (degradationTooltip) degradationTooltip.textContent = t('moduleDegradationTooltip');

    const performanceHints = document.querySelectorAll('.input-panel .section:nth-of-type(4) small');
    // These are now handled via IDs above, but keep for backward compatibility
    if (performanceHints[0] && !performanceHints[0].id) performanceHints[0].textContent = t('systemEfficiencyHint');
    if (performanceHints[1] && !performanceHints[1].id) performanceHints[1].innerHTML = `${t('trackingBonusHint').replace('Measurements Data', '<a href="https://github.com/nerdiy/Sunchronizer/tree/main/docu/measurements" target="_blank">Measurements Data</a>')}`;
    if (performanceHints[2] && !performanceHints[2].id) performanceHints[2].textContent = t('environmentalLossesHint');

    const trackingTooltip = document.querySelector('label[for="trackingBonus"] .tooltip-text');
    if (trackingTooltip) trackingTooltip.innerHTML = `${t('trackingBonusTooltip').replace('Measurements Data', '<a href="../../docu/measurements" target="_blank" style="color: #f39c12; text-decoration: underline;">Measurements Data</a>')}`;

    const environmentalTooltip = document.querySelector('label[for="environmentalLosses"] .tooltip-text');
    if (environmentalTooltip) environmentalTooltip.innerHTML = `${t('environmentalLossesTooltip').replace('NREL studies', '<a href="https://www.nrel.gov/docs/fy14osti/61693.pdf" target="_blank" style="color: white; text-decoration: underline;">NREL studies</a>')}`;

    const annualIrradianceTooltip = document.querySelector('.info-box .tooltip-text');
    if (annualIrradianceTooltip) annualIrradianceTooltip.textContent = t('annualIrradianceTooltip');

    setText('.methodology-header span:first-child', t('methodologyHeader'));
    const methodologyContent = document.querySelector('.methodology-content');
    if (methodologyContent) methodologyContent.innerHTML = t('methodologyHtml');

    const resultLabels = document.querySelectorAll('.results-grid .result-label');
    if (resultLabels[0]) resultLabels[0].textContent = t('paybackPeriod');
    if (resultLabels[1]) resultLabels[1].textContent = t('annualEnergyYield');
    if (resultLabels[2]) resultLabels[2].textContent = t('annualSavings');
    if (resultLabels[3]) resultLabels[3].textContent = t('roiLabel');
    if (resultLabels[4]) resultLabels[4].textContent = t('cumulativeSavings');
    if (resultLabels[5]) resultLabels[5].textContent = t('co2Avoided');

    const compareLabels = document.querySelectorAll('.result-compare-label');
    compareLabels.forEach((label, index) => {
        label.textContent = index % 2 === 0 ? t('withSunchronizer') : t('fixedInstallationShort');
    });

    const resultUnits = document.querySelectorAll('.results-grid .result-unit');
    if (resultUnits[0]) resultUnits[0].textContent = t('years');
    if (resultUnits[1]) resultUnits[1].textContent = t('years');
    if (resultUnits[2]) resultUnits[2].textContent = t('kwhPerYear');
    if (resultUnits[3]) resultUnits[3].textContent = t('kwhPerYear');
    if (resultUnits[4]) resultUnits[4].textContent = t('perYearLabel');
    if (resultUnits[5]) resultUnits[5].textContent = t('perYearLabel');
    if (resultUnits[6]) resultUnits[6].textContent = '%';
    if (resultUnits[7]) resultUnits[7].textContent = '%';
    if (resultUnits[8]) resultUnits[8].textContent = '';
    if (resultUnits[9]) resultUnits[9].textContent = '';
    if (resultUnits[10]) resultUnits[10].textContent = t('tons');
    if (resultUnits[11]) resultUnits[11].textContent = t('tons');

    setText('.explanation-section h3', t('simpleExplanation'));

    const chartTitles = document.querySelectorAll('.results-panel .chart-container h3');
    if (chartTitles[0]) chartTitles[0].textContent = t('savingsChartTitle');
    if (chartTitles[1]) chartTitles[1].textContent = t('yieldChartTitle');
    if (chartTitles[2]) chartTitles[2].textContent = t('co2ChartTitle');
    setText('.comparison-section .chart-container h4', t('annualEnergyYieldComparison'));

    setText('.details-section h3', t('detailedBreakdown'));
    const detailLabels = document.querySelectorAll('.details-table td:first-child');
    if (detailLabels[0]) detailLabels[0].textContent = t('systemCapacityLabel');
    if (detailLabels[1]) detailLabels[1].textContent = t('locationIrradiance');
    if (detailLabels[2]) detailLabels[2].textContent = t('annualGenerationYear1');
    if (detailLabels[3]) detailLabels[3].textContent = t('annualSavingsYear1BeforeDegradation');
    if (detailLabels[4]) detailLabels[4].textContent = t('total30YearEnergy');
    if (detailLabels[5]) detailLabels[5].textContent = t('total30YearMaintenanceCosts');
    if (detailLabels[6]) detailLabels[6].textContent = t('net30YearProfit');

    setText('.comparison-section > h3', t('comparisonTitle'));
    const fixedRows = document.querySelectorAll('.fixed-panel-row');
    fixedRows.forEach((row, index) => {
        const indexCell = row.querySelector('.fixed-panel-index');
        if (indexCell) indexCell.textContent = `${t('panelLabel')} ${index + 1}`;

        const orientationSelect = row.querySelector('.fixed-panel-orientation');
        if (orientationSelect) {
            const selected = orientationSelect.value;
            orientationSelect.innerHTML = buildOrientationOptionsHtml(selected);
            orientationSelect.setAttribute('aria-label', `${t('orientation')} ${index + 1}`);
        }

        const tiltInput = row.querySelector('.fixed-panel-tilt');
        if (tiltInput) {
            tiltInput.setAttribute('aria-label', `${t('tiltAngle')} ${index + 1}`);
            tiltInput.placeholder = t('tiltAngle');
        }
    });

    const comparisonHeaders = document.querySelectorAll('.comparison-table th');
    if (comparisonHeaders[1]) comparisonHeaders[1].textContent = t('fixedInstallation');
    if (comparisonHeaders[2]) comparisonHeaders[2].textContent = t('dualAxisTracker');
    if (comparisonHeaders[3]) comparisonHeaders[3].textContent = t('additionalBenefit');

    const comparisonLabels = document.querySelectorAll('.comparison-table td:first-child');
    if (comparisonLabels[0]) comparisonLabels[0].textContent = t('annualYield');
    if (comparisonLabels[1]) comparisonLabels[1].textContent = t('paybackPeriod');
    if (comparisonLabels[2]) comparisonLabels[2].textContent = t('thirtyYearRevenue');
}

// ============================================================================
// Main Calculation Engine
// ============================================================================

// Convert decimal years to formatted string (e.g., 4.6 -> "4y 7m")
function formatPaybackPeriod(years) {
    if (years <= 0 || isNaN(years)) return '--';
    const wholeYears = Math.floor(years);
    const months = Math.round((years - wholeYears) * 12);
    if (months === 0) {
        return `${wholeYears}y`;
    } else if (wholeYears === 0) {
        return `${months}m`;
    } else {
        return `${wholeYears}y ${months}m`;
    }
}

function performCalculation() {
    // Investment calculation from components
    let moduleCount = parseInt(elements.moduleCount.value) || 1;
    let trackerCount = parseInt(elements.trackerCount.value) || 1;
    
    // VALIDATION: Tracker count cannot exceed module count
    if (trackerCount > moduleCount) {
        trackerCount = moduleCount;
        elements.trackerCount.value = moduleCount;
    }
    
    const pvCost = (parseFloat(elements.investmentPanels.value) || 0) * moduleCount;
    const cablesCost = parseFloat(elements.investmentCables.value) || 0;
    const inverterCost = parseFloat(elements.investmentInverter.value) || 0;
    const accessoriesCost = parseFloat(elements.investmentAccessories.value) || 0;
    const trackerCost = (parseFloat(elements.investmentTracker.value) || 0) * trackerCount;
    
    const pvSystemCost = pvCost + cablesCost + inverterCost + accessoriesCost;
    const totalSystemCost = pvSystemCost + trackerCost;
    
    // Separate costs for comparison: without tracker
    const fixedSystemCost = pvSystemCost;
    
    // Module and location inputs
    const modulePower = parseInt(elements.modulePower.value) || 400;
    
    // CRITICAL FIX: System 1 Tracker capacity = trackerCount (not moduleCount)
    // System 2 and Fixed panels capacity = moduleCount (or moduleCount - trackerCount for System 1 fixed)
    const trackerSystemCapacity = (trackerCount * modulePower) / 1000; // kWp for trackers
    const fixedSystemCapacity = ((moduleCount - trackerCount) * modulePower) / 1000; // kWp for fixed panels in System 1
    const totalSystemCapacity = (moduleCount * modulePower) / 1000; // kWp for System 2 (all fixed)
    const systemCapacity = totalSystemCapacity; // For display/explanation purposes
    
    const latitude = parseFloat(elements.latitude.value) || 52.5;
    const longitude = parseFloat(elements.longitude.value) || 13.4;
    const ghi = getIrradianceForLocation(latitude, longitude);
    
    const electricityPrice = parseFloat(elements.electricityPrice.value) || 0.30;
    const maintenanceCost = parseFloat(elements.maintenanceCost.value) || 0;
    const moduleDegradation = parseFloat(elements.moduleDegradation.value) || 0.5;
    const systemEfficiency = parseFloat(elements.systemEfficiency.value) || 85;
    const trackingBonus = parseFloat(elements.trackingBonus.value) || 30;
    const environmentalLosses = parseFloat(elements.environmentalLosses.value) || 2;

    const panelSettings = getFixedPanelSettings();
    
    // ========== TRACKER CALCULATIONS ==========
    
    const poa_irradiance = ghi * 1.05; // Slight POA increase due to tracking
    const systemEfficiencyFactor = systemEfficiency / 100;
    const trackingBonusFactor = (100 + trackingBonus) / 100;
    const environmentalLossesFactor = (100 - environmentalLosses) / 100;
    
    const annualYieldYear1Tracker = (poa_irradiance * trackerSystemCapacity * 365 * systemEfficiencyFactor * trackingBonusFactor * environmentalLossesFactor);
    
    // Calculate yield for System 1 FIXED PANELS (modules that are not tracked)
    // These use the same panel settings as System 2 comparison panels
    let system1FixedPanelFactorSum = 0;
    const system1FixedPanelCount = Math.max(0, moduleCount - trackerCount);
    
    if (system1FixedPanelCount > 0) {
        // Use first (moduleCount - trackerCount) panels from fixed settings for System 1 fixed panels
        const fixedPanelSettings = getFixedPanelSettings();
        for (let i = 0; i < system1FixedPanelCount; i++) {
            const panelConfig = fixedPanelSettings[i] || { orientation: 'south-custom', tilt: getDefaultFixedTilt() };
            const fixedInstallation = FIXED_INSTALLATION_TYPES[panelConfig.orientation] || FIXED_INSTALLATION_TYPES['south-custom'];
            let panelEfficiencyFactor = fixedInstallation.baseEff;

            if (fixedInstallation.customTilt) {
                const tiltDiff = Math.abs((parseFloat(panelConfig.tilt) || 30) - Math.abs(latitude));
                panelEfficiencyFactor *= (1.0 - (tiltDiff / 90) * 0.15);
            }

            system1FixedPanelFactorSum += fixedInstallation.factor * panelEfficiencyFactor;
        }
    }

    const system1FixedAverageFactor = system1FixedPanelCount > 0 ? (system1FixedPanelFactorSum / system1FixedPanelCount) : 0.9;
    const annualYieldYear1System1Fixed = system1FixedPanelCount > 0 ? 
        (ghi * fixedSystemCapacity * 365 * systemEfficiencyFactor * system1FixedAverageFactor * environmentalLossesFactor) : 0;
    
    // Total System 1 yield = Tracked modules + Fixed modules in System 1
    const annualYieldYear1System1Total = annualYieldYear1Tracker + annualYieldYear1System1Fixed;
    
    // Self-consumption & Feed-in logic
    const selfConsumptionRate = (parseFloat(elements.selfConsumption.value) || 50) / 100;
    const feedInTariffRate = parseFloat(elements.feedInTariff.value) || 0;
    
    // System 1: Use TOTAL yield (tracked + fixed)
    const selfConsumedTrackerYear1 = annualYieldYear1System1Total * selfConsumptionRate;
    const fedBackTrackerYear1 = annualYieldYear1System1Total * (1 - selfConsumptionRate);
    const annualSavingsYear1Tracker = (selfConsumedTrackerYear1 * electricityPrice) + (fedBackTrackerYear1 * feedInTariffRate);
    const paybackPeriodTracker = totalSystemCost / annualSavingsYear1Tracker;
    
    // 30-year calculations with degradation - SYSTEM 1 (WITH TRACKER + FIXED PANELS)
    let totalEnergyTracker = 0;
    let cumulativeSavingsTracker = 0;
    let cumulativeCo2Tracker = 0;
    let annualSavingsDataTracker = [];
    
    for (let year = 1; year <= 30; year++) {
        const degradationFactor = Math.pow((100 - moduleDegradation) / 100, year - 1);
        const annualYield = annualYieldYear1System1Total * degradationFactor;
        totalEnergyTracker += annualYield;
        
        const inflationFactor = Math.pow(1 + INFLATION_RATE, year - 1);
        const adjustedElectricityPrice = electricityPrice * inflationFactor;
        const adjustedFeedInTariff = feedInTariffRate * inflationFactor;
        
        // Self-consumption revenue
        const selfConsumedYield = annualYield * selfConsumptionRate;
        const selfConsumptionRevenue = selfConsumedYield * adjustedElectricityPrice;
        
        // Feed-in revenue
        const fedBackYield = annualYield * (1 - selfConsumptionRate);
        const feedInRevenue = fedBackYield * adjustedFeedInTariff;
        
        const annualSaving = selfConsumptionRevenue + feedInRevenue - maintenanceCost;
        
        cumulativeSavingsTracker += annualSaving;
        cumulativeCo2Tracker += annualYield * CO2_EMISSION_FACTOR;
        annualSavingsDataTracker.push({
            year: year,
            savingsTracker: cumulativeSavingsTracker - totalSystemCost,
            savingsFixed: 0,
            yieldTracker: annualYield,
            yieldFixed: 0,
            co2Tracker: cumulativeCo2Tracker,
            co2Fixed: 0
        });
    }
    
    const netProfitTracker = cumulativeSavingsTracker - totalSystemCost;
    const roiTracker = (netProfitTracker / totalSystemCost) * 100;
    const co2AvoidedKgTracker = totalEnergyTracker * CO2_EMISSION_FACTOR;
    const co2AvoidedTonsTracker = co2AvoidedKgTracker / 1000;
    
    // ========== FIXED INSTALLATION CALCULATION (SYSTEM 2 - WITHOUT TRACKER) ==========
    // System 2 uses ALL modules as fixed installation with custom orientations
    
    const comparisonPanelSettings = getComparisonPanelSettings();
    let comparisonPanelFactorSum = 0;
    
    // Calculate factor for each panel in System 2
    for (let i = 0; i < moduleCount; i++) {
        const panelConfig = comparisonPanelSettings[i] || { orientation: 'south-custom', tilt: getDefaultFixedTilt() };
        const fixedInstallation = FIXED_INSTALLATION_TYPES[panelConfig.orientation] || FIXED_INSTALLATION_TYPES['south-custom'];
        let panelEfficiencyFactor = fixedInstallation.baseEff;

        if (fixedInstallation.customTilt) {
            const tiltDiff = Math.abs((parseFloat(panelConfig.tilt) || 30) - Math.abs(latitude));
            panelEfficiencyFactor *= (1.0 - (tiltDiff / 90) * 0.15);
        }

        comparisonPanelFactorSum += fixedInstallation.factor * panelEfficiencyFactor;
    }

    const comparisonAverageFactor = comparisonPanelFactorSum / Math.max(1, moduleCount);
    const annualYieldYear1Fixed = ghi * totalSystemCapacity * 365 * systemEfficiencyFactor * comparisonAverageFactor * environmentalLossesFactor;
    const selfConsumedFixedYear1 = annualYieldYear1Fixed * selfConsumptionRate;
    const fedBackFixedYear1 = annualYieldYear1Fixed * (1 - selfConsumptionRate);
    const annualSavingsYear1Fixed = (selfConsumedFixedYear1 * electricityPrice) + (fedBackFixedYear1 * feedInTariffRate);
    const paybackPeriodFixed = fixedSystemCost / annualSavingsYear1Fixed;
    
    let totalEnergyFixed = 0;
    let cumulativeSavingsFixed = 0;
    let cumulativeCo2Fixed = 0;
    
    for (let year = 1; year <= 30; year++) {
        const degradationFactor = Math.pow((100 - moduleDegradation) / 100, year - 1);
        const annualYield = annualYieldYear1Fixed * degradationFactor;
        totalEnergyFixed += annualYield;
        
        const inflationFactor = Math.pow(1 + INFLATION_RATE, year - 1);
        const adjustedElectricityPrice = electricityPrice * inflationFactor;
        const adjustedFeedInTariff = feedInTariffRate * inflationFactor;
        
        // Self-consumption revenue
        const selfConsumedYield = annualYield * selfConsumptionRate;
        const selfConsumptionRevenue = selfConsumedYield * adjustedElectricityPrice;
        
        // Feed-in revenue
        const fedBackYield = annualYield * (1 - selfConsumptionRate);
        const feedInRevenue = fedBackYield * adjustedFeedInTariff;
        
        const annualSaving = selfConsumptionRevenue + feedInRevenue - maintenanceCost;
        
        cumulativeSavingsFixed += annualSaving;
        cumulativeCo2Fixed += annualYield * CO2_EMISSION_FACTOR;
        
        // Update cumulative data for both tracker and fixed
        annualSavingsDataTracker[year - 1].savingsFixed = cumulativeSavingsFixed - fixedSystemCost;
        annualSavingsDataTracker[year - 1].yieldFixed = annualYield;
        annualSavingsDataTracker[year - 1].co2Fixed = cumulativeCo2Fixed;
    }
    
    const netProfitFixed = cumulativeSavingsFixed - fixedSystemCost;
    
    // ========== GENERATE EXPLANATION TEXT ==========
    const locationName = getSelectedLocationName();

    const explanation = generateExplanation(
        paybackPeriodTracker,
        paybackPeriodFixed,
        roiTracker,
        (netProfitFixed / fixedSystemCost) * 100,
        annualYieldYear1System1Total,
        annualYieldYear1Fixed,
        annualSavingsYear1Tracker,
        annualSavingsYear1Fixed,
        cumulativeSavingsTracker,
        cumulativeSavingsFixed,
        totalEnergyTracker,
        co2AvoidedTonsTracker,
        totalEnergyFixed * CO2_EMISSION_FACTOR / 1000,
        systemCapacity,
        electricityPrice,
        selfConsumptionRate * 100,
        feedInTariffRate,
        totalSystemCost,
        locationName
    );
    elements.explanationText.textContent = explanation;
    
    // ========== UPDATE UI ==========
    
    // Main results
    elements.paybackPeriod.textContent = formatPaybackPeriod(paybackPeriodTracker);
    elements.paybackPeriodFixed.textContent = formatPaybackPeriod(paybackPeriodFixed);
    elements.annualYield.textContent = annualYieldYear1System1Total.toFixed(0);
    elements.annualYieldFixed.textContent = annualYieldYear1Fixed.toFixed(0);
    elements.annualSavings.textContent = formatCurrency(annualSavingsYear1Tracker);
    elements.annualSavingsFixed.textContent = formatCurrency(annualSavingsYear1Fixed);
    elements.roiValue.textContent = roiTracker.toFixed(0);
    elements.roiValueFixed.textContent = ((netProfitFixed / fixedSystemCost) * 100).toFixed(0);
    elements.cumulativeSavings.textContent = formatCurrency(cumulativeSavingsTracker);
    elements.cumulativeSavingsFixed.textContent = formatCurrency(cumulativeSavingsFixed);
    elements.co2Avoided.textContent = co2AvoidedTonsTracker.toFixed(1);
    elements.co2AvoidedFixed.textContent = (totalEnergyFixed * CO2_EMISSION_FACTOR / 1000).toFixed(1);
    
    // Details
    elements.detailCapacity.textContent = `${systemCapacity.toFixed(2)} kWp (${moduleCount}× ${modulePower}W)`;
    elements.detailIrradiance.textContent = `${ghi.toFixed(2)} kWh/m²/day`;
    elements.detailGeneration.textContent = `${annualYieldYear1System1Total.toFixed(0)} kWh`;
    elements.detailSavingsYear1.textContent = formatCurrency(annualSavingsYear1Tracker);
    elements.detailTotalEnergy.textContent = `${totalEnergyTracker.toFixed(0)} kWh`;
    elements.detailMaintenance.textContent = formatCurrency(maintenanceCost * 30);
    elements.detailNetProfit.textContent = formatCurrency(netProfitTracker);
    
    // Comparison
    elements.compareFixedYield.textContent = `${annualYieldYear1Fixed.toFixed(0)} kWh`;
    elements.compareTrackerYield.textContent = `${annualYieldYear1Tracker.toFixed(0)} kWh`;
    const yieldBonusPercent = ((annualYieldYear1Tracker - annualYieldYear1Fixed) / annualYieldYear1Fixed * 100);
    elements.compareYieldDiff.textContent = `+${yieldBonusPercent.toFixed(1)}%`;
    
    elements.compareFixedPayback.textContent = formatPaybackPeriod(paybackPeriodFixed);
    elements.compareTrackerPayback.textContent = formatPaybackPeriod(paybackPeriodTracker);
    const paybackDiff = paybackPeriodFixed - paybackPeriodTracker;
    elements.comparePaybackDiff.textContent = paybackDiff > 0 ? `${formatPaybackPeriod(paybackDiff)} ${t('faster')}` : t('notAvailable');
    
    elements.compareFixedRevenue.textContent = formatCurrency(cumulativeSavingsFixed);
    elements.compareTrackerRevenue.textContent = formatCurrency(cumulativeSavingsTracker);
    const revenueBonusPercent = ((cumulativeSavingsTracker - cumulativeSavingsFixed) / cumulativeSavingsFixed * 100);
    elements.compareRevenueDiff.textContent = `+${revenueBonusPercent.toFixed(0)}%`;
    
    // Update charts with dual datasets + CO2 data
    const totalCo2Fixed = totalEnergyFixed * CO2_EMISSION_FACTOR / 1000;
    updateCharts(annualSavingsDataTracker, annualYieldYear1Tracker, annualYieldYear1Fixed, getFixedComparisonLabel(panelSettings), co2AvoidedTonsTracker, totalCo2Fixed);
}

// ============================================================================
// Generate User-Friendly Explanation Text
// ============================================================================

function generateExplanation(paybackYears, paybackYearsFixed, roi, roiFixed, yield1, yieldFixed, annualSavingsTracker, annualSavingsFixed, cumulativeSavingsTracker, cumulativeSavingsFixed, totalEnergy, co2Avoided, co2AvoidedFixed, capacity, pricePerKwh, selfConsumption, feedInTariff, investment, locationName) {
    const trackerAdvantage = yield1 - yieldFixed;
    const trackerAdvantagePercent = ((trackerAdvantage / yieldFixed) * 100).toFixed(1);
    const paybackDifference = (paybackYearsFixed - paybackYears).toFixed(1);
    const roiPercentage = roi.toFixed(0);

    if (currentLanguage === 'de') {
        let text = `Ihr Sunchronizer-System mit ${capacity.toFixed(2)} kWp erzeugt am Standort ${locationName} im ersten Jahr voraussichtlich `;
        text += `${yield1.toFixed(0)} kWh und damit ${trackerAdvantagePercent}% mehr als eine Festinstallation. `;

        if (selfConsumption > 0) {
            text += `Bei einem Eigenverbrauch von ${selfConsumption.toFixed(0)}% sparen Sie dadurch etwa `;
            text += `${formatCurrency(yield1 * selfConsumption / 100 * pricePerKwh)}${t('perYear')} beim Netzbezug. `;
        }

        if (feedInTariff > 0) {
            const feedInIncome = yield1 * (1 - selfConsumption / 100) * feedInTariff;
            text += `Die restlichen ${(100 - selfConsumption).toFixed(0)}% werden zu ${formatCurrency(feedInTariff, 2)}${t('perKwh')} eingespeist `;
            text += `und bringen etwa ${formatCurrency(feedInIncome)}${t('perYear')} ein. `;
        }

        text += `Die Anfangsinvestition von ${formatCurrency(investment)} amortisiert sich nach etwa ${formatPaybackPeriod(paybackYears)}. `;

        if (paybackDifference > 0) {
            text += `Das ist ${formatPaybackPeriod(paybackDifference)} ${t('faster')} als bei einer Festinstallation. `;
        }

        text += `Über 30 Jahre erzeugt das System ${totalEnergy.toFixed(0)} kWh und vermeidet etwa `;
        text += `${co2Avoided.toFixed(1)} ${t('tons')} CO₂. `;
        text += `Mit einem ROI von ${roiPercentage}% ist das eine wirtschaftlich interessante Investition in saubere Energie.`;
        return text;
    }

    let text = `Your Sunchronizer system with ${capacity.toFixed(2)} kWp capacity at ${locationName} will generate approximately `;
    text += `${yield1.toFixed(0)} kWh in the first year, which is ${trackerAdvantagePercent}% more than a fixed installation. `;

    if (selfConsumption > 0) {
        text += `Since you self-consume ${selfConsumption.toFixed(0)}% of the generated electricity, `;
        text += `you save approximately ${formatCurrency(yield1 * selfConsumption / 100 * pricePerKwh)}${t('perYear')} from grid purchases. `;
    }

    if (feedInTariff > 0) {
        const feedInIncome = yield1 * (1 - selfConsumption / 100) * feedInTariff;
        text += `The remaining ${(100 - selfConsumption).toFixed(0)}% is sold back to the grid at ${formatCurrency(feedInTariff, 2)}${t('perKwh')}, `;
        text += `earning approximately ${formatCurrency(feedInIncome)}${t('perYear')}. `;
    }

    text += `Your initial investment of ${formatCurrency(investment)} will pay for itself in approximately ${formatPaybackPeriod(paybackYears)}. `;

    if (paybackDifference > 0) {
        text += `That's ${formatPaybackPeriod(paybackDifference)} ${t('faster')} than a fixed installation. `;
    }

    text += `Over 30 years, your Sunchronizer system will generate ${totalEnergy.toFixed(0)} kWh and avoid approximately `;
    text += `${co2Avoided.toFixed(1)} ${t('tons')} of CO₂ emissions. `;
    text += `With an ROI of ${roiPercentage}%, your system is a solid investment in clean energy and long-term savings.`;

    return text;
}

// ============================================================================
// Chart Management
// ============================================================================

function updateCharts(annualSavingsData, trackerYield, fixedYield, fixedName, co2Tracker, co2Fixed) {
    // Prepare data
    const years = annualSavingsData.map(d => d.year);
    const savingsTracker = annualSavingsData.map(d => d.savingsTracker);
    const savingsFixed = annualSavingsData.map(d => d.savingsFixed);
    const yieldsTracker = annualSavingsData.map(d => d.yieldTracker);
    const yieldsFixed = annualSavingsData.map(d => d.yieldFixed);
    
    // Cumulative Savings Chart - WITH AND WITHOUT TRACKER
    if (savingsChartInstance) {
        savingsChartInstance.destroy();
    }
    
    savingsChartInstance = new Chart(elements.savingsChart, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: `${t('dualAxisTracker')} (${t('cumulativeLabel')})`,
                    data: savingsTracker,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#27ae60',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: `${t('fixedInstallation')} (${t('cumulativeLabel')})`,
                    data: savingsFixed,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 5],
                    pointRadius: 3,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: t('breakEvenPoint'),
                    data: Array(30).fill(0),
                    borderColor: 'rgba(200, 0, 0, 0.5)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' ' + CURRENCY_SYMBOLS[elements.currency.value];
                        }
                    }
                }
            }
        }
    });
    
    // Annual Yield Chart - WITH AND WITHOUT TRACKER
    if (yieldChartInstance) {
        yieldChartInstance.destroy();
    }
    
    yieldChartInstance = new Chart(elements.yieldChart, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: `${t('dualAxisTracker')} (kWh)`,
                    data: yieldsTracker,
                    backgroundColor: 'rgba(39, 174, 96, 0.7)',
                    borderColor: '#27ae60',
                    borderWidth: 1
                },
                {
                    label: `${t('fixedInstallation')} (kWh)`,
                    data: yieldsFixed,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: '#3498db',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' kWh';
                        }
                    }
                }
            }
        }
    });
    
    // Comparison Chart (Year 1 Yield - Bar)
    if (comparisonChartInstance) {
        comparisonChartInstance.destroy();
    }
    
    comparisonChartInstance = new Chart(elements.comparisonChart, {
        type: 'bar',
        data: {
            labels: [t('annualYield')],
            datasets: [
                {
                    label: fixedName,
                    data: [fixedYield],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: '#3498db',
                    borderWidth: 2
                },
                {
                    label: t('dualAxisTracker'),
                    data: [trackerYield],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: '#27ae60',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' kWh';
                        }
                    }
                }
            }
        }
    });
    
    // CO₂ Comparison Chart - TRACKER VS FIXED (ALL 30 YEARS, LINE CHART)
    if (elements.co2Chart) {
        if (window.co2ChartInstance) {
            window.co2ChartInstance.destroy();
        }
        
        const years = annualSavingsData.map(d => d.year);
        const co2Tracker = annualSavingsData.map(d => d.co2Tracker / 1000);
        const co2Fixed = annualSavingsData.map(d => d.co2Fixed / 1000);
        
        window.co2ChartInstance = new Chart(elements.co2Chart, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: `${t('dualAxisTracker')} CO₂ Avoided (${t('cumulativeLabel')})`,
                        data: co2Tracker,
                        borderColor: '#1abc9c',
                        backgroundColor: 'rgba(27, 188, 155, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#1abc9c',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: `${fixedName} CO₂ Avoided (${t('cumulativeLabel')})`,
                        data: co2Fixed,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.05)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        borderDash: [5, 5],
                        pointRadius: 3,
                        pointBackgroundColor: '#3498db',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(0) + ' tons CO₂';
                            }
                        }
                    }
                }
            }
        });
    }
}

// ============================================================================
// Language Switching
// ============================================================================

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('calculatorLanguage', lang);
    
    // Update button text
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = lang === 'en' ? 'DE' : 'EN';
    }
    
    applyTranslations();
    performCalculation();
}

// ============================================================================
// Initialization
// ============================================================================

console.log('Sunchronizer ROI Calculator loaded successfully');
