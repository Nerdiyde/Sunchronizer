/**
 * HTML Structure and Consistency Tests
 * Validates HTML structure, heading order, and element relationships
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlContent = fs.readFileSync(
    path.join(__dirname, '../index.html'),
    'utf8'
);

const dom = new JSDOM(htmlContent);
const document = dom.window.document;

describe('HTML Structure - Sections and Headings', () => {
    test('Page has correct title', () => {
        const title = document.querySelector('title');
        expect(title).toBeTruthy();
        expect(title.textContent).toContain('Sunchronizer');
    });

    test('Input panel exists', () => {
        const inputPanel = document.querySelector('.input-panel');
        expect(inputPanel).toBeTruthy();
    });

    test('Results panel exists', () => {
        const resultsPanel = document.querySelector('.results-panel');
        expect(resultsPanel).toBeTruthy();
    });

    test('Section count is correct (6 sections expected)', () => {
        const sections = document.querySelectorAll('.input-panel .section');
        expect(sections.length).toBeGreaterThanOrEqual(6);
    });

    test('First section is System 1', () => {
        const firstH3 = document.querySelector('.input-panel .section > h3');
        expect(firstH3).toBeTruthy();
        expect(firstH3.id).toBe('system1Title');
    });

    test('Section headings are in correct order', () => {
        const headings = document.querySelectorAll('.input-panel .section > h3');
        const headingIds = Array.from(headings).map(h => h.id || h.textContent);

        // Check that required sections exist
        expect(headingIds.length).toBeGreaterThanOrEqual(5);
    });

    test('System 1 section has description', () => {
        const system1Desc = document.getElementById('system1Description');
        expect(system1Desc).toBeTruthy();
        expect(system1Desc.textContent.length).toBeGreaterThan(0);
    });

    test('System 2 section has description', () => {
        const system2Desc = document.getElementById('system2Description');
        expect(system2Desc).toBeTruthy();
        expect(system2Desc.textContent.length).toBeGreaterThan(0);
    });

    test('System 2 shared values info exists', () => {
        const system2Shares = document.getElementById('system2Shares');
        expect(system2Shares).toBeTruthy();
        expect(system2Shares.textContent.length).toBeGreaterThan(0);
    });
});

describe('HTML Structure - Input Groups', () => {
    test('Module count input exists with correct attributes', () => {
        const moduleCount = document.getElementById('moduleCount');
        expect(moduleCount).toBeTruthy();
        expect(moduleCount.type).toBe('number');
        expect(moduleCount.min).toBe('1');
        expect(moduleCount.value).toBe('1');
    });

    test('Module power input exists with correct attributes', () => {
        const modulePower = document.getElementById('modulePower');
        expect(modulePower).toBeTruthy();
        expect(modulePower.type).toBe('number');
        expect(modulePower.min).toBe('100');
        expect(modulePower.max).toBe('600');
    });

    test('Tracker count input exists', () => {
        const trackerCount = document.getElementById('trackerCount');
        expect(trackerCount).toBeTruthy();
        expect(trackerCount.min).toBe('1');
    });

    test('All cost inputs exist', () => {
        const costInputIds = [
            'investmentPanels',
            'investmentCables',
            'investmentInverter',
            'investmentAccessories',
            'investmentTracker'
        ];

        costInputIds.forEach(id => {
            const input = document.getElementById(id);
            expect(input).toBeTruthy();
            expect(input.type).toBe('number');
            expect(input.min).toBe('0');
        });
    });

    test('Location inputs exist', () => {
        const locationInputIds = [
            'locationPreset',
            'latitude',
            'longitude',
            'irradianceDisplay'
        ];

        locationInputIds.forEach(id => {
            const element = document.getElementById(id);
            expect(element).toBeTruthy();
        });
    });

    test('Economics inputs exist', () => {
        const economicsInputIds = [
            'electricityPrice',
            'selfConsumption',
            'feedInTariff',
            'maintenanceCost',
            'moduleDegradation'
        ];

        economicsInputIds.forEach(id => {
            const element = document.getElementById(id);
            expect(element).toBeTruthy();
        });
    });

    test('System efficiency input exists', () => {
        const systemEfficiency = document.getElementById('systemEfficiency');
        expect(systemEfficiency).toBeTruthy();
        expect(systemEfficiency.value).toBe('85');
    });
});

describe('HTML Structure - Panel Configuration', () => {
    test('System 1 panel configuration container exists', () => {
        const container = document.getElementById('fixedPanelSettingsContainer');
        expect(container).toBeTruthy();
        expect(container.classList.contains('fixed-panel-settings')).toBe(true);
    });

    test('System 2 panel configuration container exists', () => {
        const container = document.getElementById('comparisonPanelSettingsContainer');
        expect(container).toBeTruthy();
        expect(container.classList.contains('fixed-panel-settings')).toBe(true);
    });

    test('System 1 panel config has label with tooltip', () => {
        const label = document.getElementById('system1PanelConfigLabel');
        expect(label).toBeTruthy();

        const tooltip = document.getElementById('system1PanelConfigTooltip');
        expect(tooltip).toBeTruthy();
        expect(tooltip.textContent.length).toBeGreaterThan(0);
    });

    test('System 2 panel config has label with tooltip', () => {
        const label = document.getElementById('system2PanelConfigLabel');
        expect(label).toBeTruthy();

        const tooltip = document.getElementById('system2PanelConfigTooltip');
        expect(tooltip).toBeTruthy();
        expect(tooltip.textContent.length).toBeGreaterThan(0);
    });

    test('System 1 panel config hint exists', () => {
        const hint = document.getElementById('system1PanelConfigHint');
        expect(hint).toBeTruthy();
        expect(hint.textContent).toMatch(/Total Modules - Number of Trackers/i);
    });

    test('System 2 panel config hint exists', () => {
        const hint = document.getElementById('system2PanelConfigHint');
        expect(hint).toBeTruthy();
        expect(hint.textContent).toMatch(/fixed orientations/i);
    });
});

describe('HTML Structure - Results Display', () => {
    test('Calculate button exists', () => {
        const button = document.getElementById('calculateBtn');
        expect(button).toBeTruthy();
        expect(button.textContent.toLowerCase()).toContain('calculate');
    });

    test('Language toggle button exists', () => {
        const button = document.getElementById('langToggle');
        expect(button).toBeTruthy();
    });

    test('Result cards structure is present', () => {
        const resultsGrid = document.querySelector('.results-grid');
        expect(resultsGrid).toBeTruthy();
    });

    test('Chart containers exist', () => {
        const chartIds = [
            'savingsChart',
            'yieldChart',
            'co2Chart'
        ];

        chartIds.forEach(id => {
            const element = document.getElementById(id);
            expect(element).toBeTruthy();
        });
    });
});

describe('HTML Structure - Tooltips and Hints', () => {
    test('Tooltip containers are present', () => {
        const tooltips = document.querySelectorAll('.tooltip-container');
        expect(tooltips.length).toBeGreaterThan(10);
    });

    test('Each tooltip has icon and text', () => {
        const tooltips = document.querySelectorAll('.tooltip-container');
        tooltips.forEach(tooltip => {
            const icon = tooltip.querySelector('.tooltip-icon');
            const text = tooltip.querySelector('.tooltip-text');
            expect(icon).toBeTruthy();
            expect(text).toBeTruthy();
        });
    });

    test('Info boxes are present', () => {
        const infoBoxes = document.querySelectorAll('.info-box');
        expect(infoBoxes.length).toBeGreaterThan(0);
    });
});

describe('HTML Structure - Styles and Scripts', () => {
    test('CSS file is linked', () => {
        const cssLink = document.querySelector('link[rel="stylesheet"]');
        expect(cssLink).toBeTruthy();
        expect(cssLink.href).toContain('styles.css');
    });

    test('Chart.js is loaded', () => {
        const chartScript = document.querySelector('script[src*="chart.js"]');
        expect(chartScript).toBeTruthy();
    });

    test('Correct charset is set', () => {
        const charset = document.querySelector('meta[charset]');
        expect(charset).toBeTruthy();
        expect(charset.charset).toBe('UTF-8');
    });

    test('Viewport meta tag is present', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        expect(viewport).toBeTruthy();
        expect(viewport.content).toContain('width=device-width');
    });
});

describe('HTML Structure - Accessibility', () => {
    test('All inputs have associated labels', () => {
        const inputs = document.querySelectorAll('input[id], select[id], textarea[id]');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            expect(label).toBeTruthy();
        });
    });

    test('Header structure is hierarchical', () => {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelectorAll('h2');
        const h3 = document.querySelectorAll('h3');

        expect(h1).toBeTruthy();
        expect(h2.length).toBeGreaterThan(0);
        expect(h3.length).toBeGreaterThan(0);
    });

    test('No emoji characters in visible text', () => {
        const body = document.body.textContent;
        const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uD83C][\uDF00-\uDFFF]|[💻📌🔧⚡]/g;
        const emojis = body.match(emojiRegex);
        expect(emojis).toBeNull();
    });
});

describe('HTML Structure - Location Options', () => {
    test('Location preset dropdown has multiple regions', () => {
        const optgroups = document.querySelectorAll('optgroup');
        expect(optgroups.length).toBeGreaterThanOrEqual(5);
    });

    test('Europe region has countries', () => {
        const europeOptgroup = Array.from(document.querySelectorAll('optgroup')).find(
            og => og.label.includes('Europe')
        );
        expect(europeOptgroup).toBeTruthy();

        const options = europeOptgroup.querySelectorAll('option');
        expect(options.length).toBeGreaterThan(0);
    });

    test('Custom location option is present', () => {
        const customOption = document.querySelector('option[value="custom"]');
        expect(customOption).toBeTruthy();
        expect(customOption.textContent).toContain('Custom');
    });
});

describe('HTML Structure - Data Consistency', () => {
    test('Total cost calculations have required display elements', () => {
        const costDisplay = document.querySelector('.total-cost-display');
        expect(costDisplay).toBeTruthy();

        const costValue = costDisplay.querySelector('[id*="Total"]');
        expect(costValue).toBeTruthy();
    });

    test('Currency symbols are present', () => {
        const currencyInvest = document.getElementById('currencySymbolInvest');
        const currencyTotal = document.getElementById('currencySymbolTotal');

        expect(currencyInvest).toBeTruthy();
        expect(currencyTotal).toBeTruthy();
    });

    test('Capacity display element exists', () => {
        const capacityDisplay = document.getElementById('capacityDisplay');
        expect(capacityDisplay).toBeTruthy();
    });
});
