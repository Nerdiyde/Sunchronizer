/**
 * Jest Setup File
 * Global configuration for all tests
 */

// Suppress console warnings during tests if needed
global.console = {
    ...console,
    // uncomment to suppress console logs during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
};

// Set default timeout
jest.setTimeout(10000);

// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock Chart.js if needed
global.Chart = jest.fn();
