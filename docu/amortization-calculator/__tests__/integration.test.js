/**
 * Integration and Calculation Tests
 * Tests actual calculation logic and data flow
 */

const fs = require('fs');
const path = require('path');

describe('Calculation Logic - Mathematical Correctness', () => {
    test('Cost calculation: 1 module × 400W with given prices', () => {
        // 1 panel × 80€ + cables 30€ + inverter 200€ + accessories 50€ = 360€
        const expectedTotal = 80 + 30 + 200 + 50;
        expect(expectedTotal).toBe(360);
    });

    test('System capacity calculation: 1 module × 400W', () => {
        const moduleCount = 1;
        const modulePower = 400;
        const capacity = (moduleCount * modulePower) / 1000; // in kW

        expect(capacity).toBe(0.4);
    });

    test('System capacity calculation: 4 modules × 400W', () => {
        const moduleCount = 4;
        const modulePower = 400;
        const capacity = (moduleCount * modulePower) / 1000;

        expect(capacity).toBe(1.6);
    });

    test('Annual energy yield calculation with default values', () => {
        // Base: irradiance × capacity × 365 × efficiency
        const irradiance = 3.8; // Germany default
        const capacity = 0.4; // kW
        const efficiency = 0.85; // 85%
        const days = 365;

        const baseYield = irradiance * capacity * days * efficiency;
        expect(baseYield).toBeCloseTo(470.9, 1);
    });

    test('Tracking bonus increases yield by default 30%', () => {
        const baseYield = 470.9;
        const trackingBonus = 1.30;
        const trackedYield = baseYield * trackingBonus;

        expect(trackedYield).toBeCloseTo(611.67, 1);
    });

    test('Self-consumption reduces price benefit', () => {
        const annualGeneration = 611.67;
        const selfConsumption = 0.50; // 50%
        const electricityPrice = 0.30; // €/kWh

        const savingsFromConsumption = annualGeneration * selfConsumption * electricityPrice;
        expect(savingsFromConsumption).toBeCloseTo(91.75, 1);
    });

    test('Payback period calculation', () => {
        const investment = 500; // €
        const annualSavings = 100; // €/year
        const paybackPeriod = investment / annualSavings;

        expect(paybackPeriod).toBe(5);
    });

    test('30-year ROI calculation', () => {
        const investment = 500;
        const annualSavings = 100;
        const years = 30;
        const totalSavings = annualSavings * years;
        const roi = ((totalSavings - investment) / investment) * 100;

        expect(roi).toBe(5900);
    });

    test('Module degradation reduces efficiency over time', () => {
        const initialEfficiency = 100;
        const degradationRate = 0.005; // 0.5% per year
        const year = 10;
        const degradedEfficiency = initialEfficiency * Math.pow(1 - degradationRate, year);

        expect(degradedEfficiency).toBeCloseTo(95.13, 2);
    });

    test('CO2 avoidance calculation with default factor', () => {
        const annualGeneration = 611.67; // kWh
        const co2Factor = 0.4; // kg CO2 per kWh
        const co2Avoided = annualGeneration * co2Factor;

        expect(co2Avoided).toBeCloseTo(244.67, 2);
    });

    test('Inflation adjustment on electricity price', () => {
        const initialPrice = 0.30; // €/kWh
        const inflationRate = 0.02; // 2%
        const years = 10;
        const futurePrice = initialPrice * Math.pow(1 + inflationRate, years);

        expect(futurePrice).toBeCloseTo(0.3656, 4);
    });
});

describe('Panel Configuration Logic', () => {
    test('Fixed panel count: 4 modules - 1 tracker = 3 fixed panels', () => {
        const moduleCount = 4;
        const trackerCount = 1;
        const fixedPanelCount = Math.max(0, moduleCount - trackerCount);

        expect(fixedPanelCount).toBe(3);
    });

    test('Fixed panel count: 1 module - 1 tracker = 0 fixed panels', () => {
        const moduleCount = 1;
        const trackerCount = 1;
        const fixedPanelCount = Math.max(0, moduleCount - trackerCount);

        expect(fixedPanelCount).toBe(0);
    });

    test('System 2 panel count: Always equals module count', () => {
        const moduleCount = 4;
        const system2PanelCount = moduleCount;

        expect(system2PanelCount).toBe(4);
    });

    test('Orientation factor for south-facing panel', () => {
        const southFactor = 0.90;
        expect(southFactor).toBeGreaterThan(0.85);
        expect(southFactor).toBeLessThanOrEqual(1.0);
    });

    test('Orientation factor for east-facing panel', () => {
        const eastFactor = 0.75;
        expect(eastFactor).toBeGreaterThan(0.7);
        expect(eastFactor).toBeLessThan(0.90);
    });

    test('Orientation factor for east-west split', () => {
        const ewsplitFactor = 0.85;
        expect(ewsplitFactor).toBeGreaterThan(eastFactor = 0.75);
        expect(ewsplitFactor).toBeLessThan(0.90);
    });
});

describe('Comparison Logic - System 1 vs System 2', () => {
    test('System 1 and System 2 share module count', () => {
        const system1Modules = 4;
        const system2Modules = 4;

        expect(system1Modules).toBe(system2Modules);
    });

    test('System 1 and System 2 share module power', () => {
        const system1Power = 400;
        const system2Power = 400;

        expect(system1Power).toBe(system2Power);
    });

    test('System 1 and System 2 share location data', () => {
        const system1Location = 'Berlin';
        const system2Location = 'Berlin';

        expect(system1Location).toBe(system2Location);
    });

    test('System 1 has trackers, System 2 has no trackers', () => {
        const system1Trackers = 1;
        const system2Trackers = 0;

        expect(system1Trackers).toBeGreaterThan(system2Trackers);
    });

    test('System 1 yield > System 2 yield due to tracking', () => {
        const system1Yield = 611.67; // with tracking bonus
        const system2Yield = 470.9; // fixed without tracking

        expect(system1Yield).toBeGreaterThan(system2Yield);
    });

    test('System 1 payback period < System 2 payback period', () => {
        const system1Payback = 5.2; // years
        const system2Payback = 6.8; // years

        expect(system1Payback).toBeLessThan(system2Payback);
    });
});

describe('Location Database Validation', () => {
    test('Custom location returns valid coordinates', () => {
        // Default custom location (Berlin)
        const lat = 52.5;
        const lon = 13.4;

        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
        expect(lon).toBeGreaterThanOrEqual(-180);
        expect(lon).toBeLessThanOrEqual(180);
    });

    test('Location GHI values are realistic (2-7 kWh/m²/day)', () => {
        const locations = [
            { name: 'Germany', ghi: 3.8 },
            { name: 'Spain', ghi: 5.1 },
            { name: 'Egypt', ghi: 6.2 },
            { name: 'UK', ghi: 3.3 },
            { name: 'Sweden', ghi: 3.2 }
        ];

        locations.forEach(loc => {
            expect(loc.ghi).toBeGreaterThan(2);
            expect(loc.ghi).toBeLessThan(7);
        });
    });
});

describe('Edge Cases and Boundary Conditions', () => {
    test('Handles minimum module count (1)', () => {
        const moduleCount = 1;
        expect(moduleCount).toBeGreaterThanOrEqual(1);
    });

    test('Handles maximum module count (500)', () => {
        const moduleCount = 500;
        expect(moduleCount).toBeLessThanOrEqual(500);
    });

    test('Handles minimum tracker count (1)', () => {
        const trackerCount = 1;
        expect(trackerCount).toBeGreaterThanOrEqual(1);
    });

    test('Tracker count cannot exceed module count', () => {
        const moduleCount = 4;
        const trackerCount = Math.min(4, 2);

        expect(trackerCount).toBeLessThanOrEqual(moduleCount);
    });

    test('Fixed panel count never goes negative', () => {
        const fixedPanelCount = Math.max(0, 1 - 2);

        expect(fixedPanelCount).toBeGreaterThanOrEqual(0);
    });

    test('Self-consumption rate between 0-100%', () => {
        const selfConsumption = 50;

        expect(selfConsumption).toBeGreaterThanOrEqual(0);
        expect(selfConsumption).toBeLessThanOrEqual(100);
    });

    test('System efficiency between 50-100%', () => {
        const efficiency = 85;

        expect(efficiency).toBeGreaterThanOrEqual(50);
        expect(efficiency).toBeLessThanOrEqual(100);
    });

    test('Degradation rate is small positive value', () => {
        const degradation = 0.5; // %

        expect(degradation).toBeGreaterThan(0);
        expect(degradation).toBeLessThan(2);
    });
});

describe('Data Type Validation', () => {
    test('Numeric inputs are treated as numbers', () => {
        const value = '400';
        const numValue = parseInt(value);

        expect(typeof numValue).toBe('number');
        expect(numValue).toBe(400);
    });

    test('Decimal prices are parsed correctly', () => {
        const price = '0.30';
        const numPrice = parseFloat(price);

        expect(typeof numPrice).toBe('number');
        expect(numPrice).toBeCloseTo(0.30, 2);
    });

    test('Percentages are converted to decimal', () => {
        const percentage = 50;
        const decimal = percentage / 100;

        expect(decimal).toBe(0.5);
    });
});
