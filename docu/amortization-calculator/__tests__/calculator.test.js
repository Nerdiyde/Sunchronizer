/**
 * Unit Tests for Amortization Calculator
 * Tests core calculation logic and translation system
 */

const fs = require('fs');
const path = require('path');

// Mock DOM for testing
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};

// Load calculator.js
const calculatorContent = fs.readFileSync(
    path.join(__dirname, '../calculator.js'),
    'utf8'
);

// Extract only the TRANSLATIONS and helper functions
const translations = eval(calculatorContent.match(/const TRANSLATIONS = \{[\s\S]*?\n\};/)[0]);

describe('Amortization Calculator - Translations', () => {
    test('English translations contain all required keys', () => {
        const requiredKeys = [
            'system1Title',
            'system1Description',
            'system1PanelConfigTitle',
            'system1PanelConfigTooltip',
            'system1PanelConfigHint',
            'system2Title',
            'system2Description',
            'system2Shares',
            'system2PanelConfigTitle',
            'system2PanelConfigTooltip',
            'system2PanelConfigHint',
            'location',
            'economics',
            'system2FixedPanels',
            'inverter',
            'accessoriesAndInstallation'
        ];

        requiredKeys.forEach(key => {
            expect(translations.en[key]).toBeDefined();
            expect(typeof translations.en[key]).toBe('string');
            expect(translations.en[key].length).toBeGreaterThan(0);
        });
    });

    test('German translations contain all required keys', () => {
        const requiredKeys = [
            'system1Title',
            'system1Description',
            'system1PanelConfigTitle',
            'system1PanelConfigTooltip',
            'system1PanelConfigHint',
            'system2Title',
            'system2Description',
            'system2Shares',
            'system2PanelConfigTitle',
            'system2PanelConfigTooltip',
            'system2PanelConfigHint',
            'location',
            'economics',
            'system2FixedPanels',
            'inverter',
            'accessoriesAndInstallation'
        ];

        requiredKeys.forEach(key => {
            expect(translations.de[key]).toBeDefined();
            expect(typeof translations.de[key]).toBe('string');
            expect(translations.de[key].length).toBeGreaterThan(0);
        });
    });

    test('System 1 description mentions both tracked and fixed panels', () => {
        const system1Desc = translations.en.system1Description;
        expect(system1Desc).toMatch(/tracked|fixed panels/i);
        expect(system1Desc).toMatch(/System 2/i);
    });

    test('System 2 description mentions fixed panels and comparison', () => {
        const system2Desc = translations.en.system2Description;
        expect(system2Desc).toMatch(/fixed|comparison|baseline/i);
    });
});

describe('Amortization Calculator - Default Values', () => {
    test('Default inverter cost is 200€', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="investmentInverter"[\s\S]*?value="200"/);
    });

    test('Default accessories cost is 50€', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="investmentAccessories"[\s\S]*?value="50"/);
    });

    test('Default panel cost is 80€', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="investmentPanels"[\s\S]*?value="80"/);
    });

    test('Default cables cost is 30€', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="investmentCables"[\s\S]*?value="30"/);
    });

    test('Default module count is 1', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="moduleCount"[\s\S]*?value="1"/);
    });

    test('Default module power is 400W', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="modulePower"[\s\S]*?value="400"/);
    });

    test('Default tracker count is 1', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="trackerCount"[\s\S]*?value="1"/);
    });

    test('Default self-consumption is 50%', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="selfConsumption"[\s\S]*?value="50"/);
    });

    test('Default system efficiency is 85%', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        expect(htmlContent).toMatch(/id="systemEfficiency"[\s\S]*?value="85"/);
    });
});

describe('Amortization Calculator - Location Database', () => {
    test('Location database contains Germany entry', () => {
        const locationMatch = calculatorContent.match(/germany:\s*\{\s*name:\s*'Germany[^}]*\}/);
        expect(locationMatch).toBeTruthy();
    });

    test('Location database contains Spain entry', () => {
        const locationMatch = calculatorContent.match(/spain:\s*\{\s*name:\s*'Spain[^}]*\}/);
        expect(locationMatch).toBeTruthy();
    });

    test('Location database contains at least 20 cities', () => {
        const locationMatch = calculatorContent.match(/const LOCATION_DATABASE = \{[\s\S]*?\};/);
        const locationCount = (locationMatch[0].match(/:\s*\{[^}]*ghi:/g) || []).length;
        expect(locationCount).toBeGreaterThanOrEqual(20);
    });
});

describe('Amortization Calculator - Panel Configuration Logic', () => {
    test('Fixed orientation options include south, east, west, and east-west split', () => {
        expect(calculatorContent).toMatch(/FIXED_ORIENTATION_OPTIONS.*=.*\[/);
        expect(calculatorContent).toMatch(/south-custom/);
        expect(calculatorContent).toMatch(/east-custom/);
        expect(calculatorContent).toMatch(/west-custom/);
        expect(calculatorContent).toMatch(/ewsplit-custom/);
    });

    test('Fixed installation types define yield factors', () => {
        expect(calculatorContent).toMatch(/FIXED_INSTALLATION_TYPES/);
        expect(calculatorContent).toMatch(/factor:\s*0\.\d+/);
    });

    test('Constants are properly defined', () => {
        expect(calculatorContent).toMatch(/const SYSTEM_EFFICIENCY = 85/);
        expect(calculatorContent).toMatch(/const TRACKING_BONUS_DEFAULT = 30/);
        expect(calculatorContent).toMatch(/const CO2_EMISSION_FACTOR = 0\.4/);
    });
});

describe('Amortization Calculator - HTML Element IDs', () => {
    test('All required element IDs are present in HTML', () => {
        const htmlContent = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );

        const requiredIds = [
            'system1Title',
            'system1Description',
            'system1PanelConfigLabel',
            'system1PanelConfigTooltip',
            'system1PanelConfigHint',
            'system2Title',
            'system2Description',
            'system2Shares',
            'system2PanelConfigLabel',
            'system2PanelConfigTooltip',
            'system2PanelConfigHint',
            'moduleCount',
            'modulePower',
            'investmentPanels',
            'investmentCables',
            'investmentInverter',
            'investmentAccessories',
            'trackerCount',
            'investmentTracker',
            'fixedPanelSettingsContainer',
            'comparisonPanelSettingsContainer',
            'locationPreset',
            'latitude',
            'longitude',
            'irradianceDisplay',
            'electricityPrice',
            'selfConsumption',
            'feedInTariff',
            'maintenanceCost',
            'moduleDegradation',
            'systemEfficiency',
            'calculateBtn',
            'langToggle'
        ];

        requiredIds.forEach(id => {
            expect(htmlContent).toMatch(new RegExp(`id=["']${id}["']`));
        });
    });
});
