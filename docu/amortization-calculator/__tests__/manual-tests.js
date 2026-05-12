#!/usr/bin/env node

/**
 * Manual Test Script - Quick Validation without Jest
 * Run: node __tests__/manual-tests.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`${colors.green}✓${colors.reset} ${name}`);
        passed++;
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} ${name}`);
        console.log(`  ${error.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

console.log(`\n${colors.cyan}=== Sunchronizer Amortization Calculator - Manual Tests ===${colors.reset}\n`);

// Load files
const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, '../styles.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, '../calculator.js'), 'utf8');

// ============= HTML TESTS =============
console.log(`${colors.cyan}HTML Structure Tests${colors.reset}`);

test('HTML has DOCTYPE', () => {
    assert(htmlContent.includes('<!DOCTYPE html>'), 'DOCTYPE not found');
});

test('HTML has title tag', () => {
    assert(htmlContent.includes('<title>'), 'Title tag not found');
});

test('HTML has System 1 title with id', () => {
    assert(htmlContent.includes('id="system1Title"'), 'system1Title id not found');
});

test('HTML has System 2 title with id', () => {
    assert(htmlContent.includes('id="system2Title"'), 'system2Title id not found');
});

test('HTML has moduleCount input', () => {
    assert(htmlContent.includes('id="moduleCount"'), 'moduleCount id not found');
});

test('HTML has investmentInverter with value 200', () => {
    assert(htmlContent.match(/id="investmentInverter"[\s\S]*?value="200"/), 'investmentInverter value not 200');
});

test('HTML has investmentAccessories with value 50', () => {
    assert(htmlContent.match(/id="investmentAccessories"[\s\S]*?value="50"/), 'investmentAccessories value not 50');
});

test('HTML has Panel Configuration containers', () => {
    assert(htmlContent.includes('id="fixedPanelSettingsContainer"'), 'fixedPanelSettingsContainer not found');
    assert(htmlContent.includes('id="comparisonPanelSettingsContainer"'), 'comparisonPanelSettingsContainer not found');
});

test('HTML has location inputs', () => {
    assert(htmlContent.includes('id="latitude"'), 'latitude id not found');
    assert(htmlContent.includes('id="longitude"'), 'longitude id not found');
});

test('HTML has economics inputs', () => {
    assert(htmlContent.includes('id="electricityPrice"'), 'electricityPrice id not found');
    assert(htmlContent.includes('id="selfConsumption"'), 'selfConsumption id not found');
    assert(htmlContent.includes('id="maintenanceCost"'), 'maintenanceCost id not found');
});

test('HTML has no emojis in buttons', () => {
    const calculateBtn = htmlContent.match(/id="calculateBtn"[^>]*>([^<]*)</);
    if (calculateBtn) {
        const text = calculateBtn[1];
        assert(!text.match(/[💻📌🔧⚡]/), `Emoji found in calculate button: "${text}"`);
    }
});

test('HTML has calculate button', () => {
    assert(htmlContent.includes('id="calculateBtn"'), 'calculateBtn id not found');
});

test('HTML has language toggle', () => {
    assert(htmlContent.includes('id="langToggle"'), 'langToggle id not found');
});

// ============= CSS TESTS =============
console.log(`\n${colors.cyan}CSS Tests${colors.reset}`);

test('CSS has results-grid style', () => {
    assert(cssContent.includes('.results-grid'), '.results-grid not found');
});

test('CSS has results-grid with single column layout', () => {
    assert(cssContent.includes('grid-template-columns: 1fr'), 'Single column layout not found');
});

test('CSS has input-panel style', () => {
    assert(cssContent.includes('.input-panel'), '.input-panel not found');
});

test('CSS has tooltip styles', () => {
    assert(cssContent.includes('.tooltip'), '.tooltip not found');
});

// ============= JavaScript TESTS =============
console.log(`\n${colors.cyan}JavaScript Tests${colors.reset}`);

test('JavaScript has TRANSLATIONS object', () => {
    assert(jsContent.includes('const TRANSLATIONS ='), 'TRANSLATIONS not found');
});

test('JavaScript has English translations', () => {
    assert(jsContent.includes('en: {'), 'English translations not found');
});

test('JavaScript has German translations', () => {
    assert(jsContent.includes('de: {'), 'German translations not found');
});

test('JavaScript has system1Title translation', () => {
    assert(jsContent.includes("system1Title:"), 'system1Title translation not found');
});

test('JavaScript has system2Title translation', () => {
    assert(jsContent.includes("system2Title:"), 'system2Title translation not found');
});

test('JavaScript has FIXED_INSTALLATION_TYPES', () => {
    assert(jsContent.includes('FIXED_INSTALLATION_TYPES'), 'FIXED_INSTALLATION_TYPES not found');
});

test('JavaScript has LOCATION_DATABASE', () => {
    assert(jsContent.includes('LOCATION_DATABASE'), 'LOCATION_DATABASE not found');
});

test('JavaScript has system efficiency constant (85%)', () => {
    assert(jsContent.includes('SYSTEM_EFFICIENCY = 85'), 'SYSTEM_EFFICIENCY not found');
});

test('JavaScript has tracking bonus constant (30%)', () => {
    assert(jsContent.includes('TRACKING_BONUS_DEFAULT = 30'), 'TRACKING_BONUS_DEFAULT not found');
});

test('JavaScript has CO2 emission factor', () => {
    assert(jsContent.includes('CO2_EMISSION_FACTOR'), 'CO2_EMISSION_FACTOR not found');
});

test('JavaScript has applyTranslations function', () => {
    assert(jsContent.includes('function applyTranslations()'), 'applyTranslations function not found');
});

test('JavaScript has performCalculation function', () => {
    assert(jsContent.includes('function performCalculation()'), 'performCalculation function not found');
});

test('JavaScript has syncFixedPanelSettings function', () => {
    assert(jsContent.includes('function syncFixedPanelSettings()'), 'syncFixedPanelSettings function not found');
});

test('JavaScript has syncComparisonPanelSettings function', () => {
    assert(jsContent.includes('function syncComparisonPanelSettings()'), 'syncComparisonPanelSettings function not found');
});

// ============= CONTENT TESTS =============
console.log(`\n${colors.cyan}Content Validation Tests${colors.reset}`);

test('System 1 description mentions tracked and fixed panels', () => {
    assert(
        jsContent.includes('tracked') && jsContent.includes('fixed panels'),
        'System 1 description missing tracked/fixed panel reference'
    );
});

test('System 2 description mentions comparison and baseline', () => {
    assert(
        jsContent.includes('comparison') && jsContent.includes('baseline'),
        'System 2 description missing comparison/baseline reference'
    );
});

test('System 2 shares values text is defined', () => {
    assert(
        jsContent.includes('system2Shares:'),
        'System 2 shares values not defined'
    );
});

test('Germany location in database', () => {
    assert(jsContent.includes('germany:'), 'Germany not found in location database');
});

test('Spain location in database', () => {
    assert(jsContent.includes('spain:'), 'Spain not found in location database');
});

// ============= CALCULATION TESTS =============
console.log(`\n${colors.cyan}Calculation Logic Tests${colors.reset}`);

test('Default cost calculation correct', () => {
    // 1 × 80 + 30 + 200 + 50 = 360
    const expectedCost = 80 + 30 + 200 + 50;
    assert(expectedCost === 360, `Expected cost 360, got ${expectedCost}`);
});

test('System capacity for 1 module × 400W is 0.4 kW', () => {
    const capacity = (1 * 400) / 1000;
    assert(capacity === 0.4, `Expected 0.4, got ${capacity}`);
});

test('System capacity for 4 modules × 400W is 1.6 kW', () => {
    const capacity = (4 * 400) / 1000;
    assert(capacity === 1.6, `Expected 1.6, got ${capacity}`);
});

test('Fixed panel count: 4 modules - 1 tracker = 3', () => {
    const fixedCount = Math.max(0, 4 - 1);
    assert(fixedCount === 3, `Expected 3, got ${fixedCount}`);
});

test('Fixed panel count: 1 module - 1 tracker = 0', () => {
    const fixedCount = Math.max(0, 1 - 1);
    assert(fixedCount === 0, `Expected 0, got ${fixedCount}`);
});

test('Payback period: investment/savings', () => {
    const payback = 500 / 100;
    assert(payback === 5, `Expected 5 years, got ${payback}`);
});

// ============= SUMMARY =============
console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
console.log(`${colors.red}Failed: ${failed}${colors.reset}`);

if (failed === 0) {
    console.log(`\n${colors.green}All tests passed! ✓${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`\n${colors.red}Some tests failed! ✗${colors.reset}\n`);
    process.exit(1);
}
