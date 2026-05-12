#!/usr/bin/env node

/**
 * Test Environment Checker & Quick Setup
 * Validates test environment and helps with setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

console.log(`\n${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}║  Amortization Calculator - Test Environment Checker    ║${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

// Check 1: Node.js version
console.log(`${colors.cyan}1. Checking Node.js...${colors.reset}`);
try {
    const nodeVersion = execSync('node --version').toString().trim();
    const nodeVersionNum = parseInt(nodeVersion.substring(1).split('.')[0]);
    if (nodeVersionNum >= 14) {
        console.log(`${colors.green}✓${colors.reset} Node.js ${nodeVersion} ${colors.green}(OK)${colors.reset}`);
    } else {
        console.log(`${colors.red}✗${colors.reset} Node.js ${nodeVersion} ${colors.red}(requires 14+)${colors.reset}`);
    }
} catch (e) {
    console.log(`${colors.red}✗${colors.reset} Node.js ${colors.red}not found${colors.reset}`);
}

// Check 2: npm version
console.log(`\n${colors.cyan}2. Checking npm...${colors.reset}`);
try {
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`${colors.green}✓${colors.reset} npm ${npmVersion} ${colors.green}(OK)${colors.reset}`);
} catch (e) {
    console.log(`${colors.red}✗${colors.reset} npm ${colors.red}not found${colors.reset}`);
}

// Check 3: Test files
console.log(`\n${colors.cyan}3. Checking test files...${colors.reset}`);
const testFiles = [
    'calculator.test.js',
    'html-structure.test.js',
    'integration.test.js',
    'manual-tests.js',
    'browser-tests.html',
    'setup.js'
];

const testsDir = path.join(__dirname);
testFiles.forEach(file => {
    const filePath = path.join(testsDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? colors.green + '✓' : colors.red + '✗'}${colors.reset} ${file}`);
});

// Check 4: Calculator files
console.log(`\n${colors.cyan}4. Checking calculator files...${colors.reset}`);
const calcFiles = ['calculator.js', 'index.html', 'styles.css'];
const calcDir = path.join(__dirname, '..');

calcFiles.forEach(file => {
    const filePath = path.join(calcDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? colors.green + '✓' : colors.red + '✗'}${colors.reset} ${file}`);
});

// Check 5: package.json
console.log(`\n${colors.cyan}5. Checking package.json...${colors.reset}`);
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
    console.log(`${colors.green}✓${colors.reset} package.json found`);
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.scripts && packageJson.scripts.test) {
            console.log(`${colors.green}✓${colors.reset} test script configured`);
        } else {
            console.log(`${colors.yellow}⚠${colors.reset} test script not found`);
        }
    } catch (e) {
        console.log(`${colors.red}✗${colors.reset} Invalid package.json`);
    }
} else {
    console.log(`${colors.yellow}⚠${colors.reset} package.json not found (will create if needed)`);
}

// Check 6: Dependencies
console.log(`\n${colors.cyan}6. Checking dependencies...${colors.reset}`);
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    const jestPath = path.join(nodeModulesPath, 'jest');
    const jsdomPath = path.join(nodeModulesPath, 'jsdom');
    
    console.log(`${fs.existsSync(jestPath) ? colors.green + '✓' : colors.yellow + '⚠'}${colors.reset} jest`);
    console.log(`${fs.existsSync(jsdomPath) ? colors.green + '✓' : colors.yellow + '⚠'}${colors.reset} jsdom`);
    
    if (!fs.existsSync(jestPath) || !fs.existsSync(jsdomPath)) {
        console.log(`\n${colors.yellow}Tip: Run ${colors.bold}npm install${colors.reset}${colors.yellow} to install dependencies${colors.reset}`);
    }
} else {
    console.log(`${colors.yellow}⚠${colors.reset} node_modules not found`);
    console.log(`${colors.yellow}Tip: Run ${colors.bold}npm install${colors.reset}${colors.yellow} to install dependencies${colors.reset}`);
}

// Check 7: jest.config.js
console.log(`\n${colors.cyan}7. Checking jest configuration...${colors.reset}`);
const jestConfigPath = path.join(__dirname, '..', 'jest.config.js');
if (fs.existsSync(jestConfigPath)) {
    console.log(`${colors.green}✓${colors.reset} jest.config.js found`);
} else {
    console.log(`${colors.yellow}⚠${colors.reset} jest.config.js not found`);
}

// Quick tests
console.log(`\n${colors.cyan}8. Running quick validation tests...${colors.reset}`);
try {
    // Check HTML structure
    const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const hasSystem1Title = htmlContent.includes('id="system1Title"');
    const hasSystem2Title = htmlContent.includes('id="system2Title"');
    const invertorPrice = htmlContent.match(/id="investmentInverter"[\s\S]*?value="(\d+)"/);
    const accessoriesPrice = htmlContent.match(/id="investmentAccessories"[\s\S]*?value="(\d+)"/);
    
    console.log(`${hasSystem1Title ? colors.green + '✓' : colors.red + '✗'}${colors.reset} System 1 title found`);
    console.log(`${hasSystem2Title ? colors.green + '✓' : colors.red + '✗'}${colors.reset} System 2 title found`);
    
    if (invertorPrice && invertorPrice[1] === '200') {
        console.log(`${colors.green}✓${colors.reset} Inverter price: 200€`);
    } else {
        console.log(`${colors.red}✗${colors.reset} Inverter price incorrect (expected 200€)`);
    }
    
    if (accessoriesPrice && accessoriesPrice[1] === '50') {
        console.log(`${colors.green}✓${colors.reset} Accessories price: 50€`);
    } else {
        console.log(`${colors.red}✗${colors.reset} Accessories price incorrect (expected 50€)`);
    }
} catch (e) {
    console.log(`${colors.red}✗${colors.reset} Error reading HTML: ${e.message}`);
}

// Summary and recommendations
console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}Test Options:${colors.reset}\n`);

console.log(`${colors.green}Option 1: Jest Tests (Recommended for CI/CD)${colors.reset}`);
console.log(`  $ npm install     # Install dependencies`);
console.log(`  $ npm test        # Run all tests\n`);

console.log(`${colors.green}Option 2: Manual Tests (No installation required)${colors.reset}`);
console.log(`  $ node __tests__/manual-tests.js\n`);

console.log(`${colors.green}Option 3: Browser Tests (Visual interactive)${colors.reset}`);
console.log(`  1. Open: __tests__/browser-tests.html in browser`);
console.log(`  2. Click: "Alle Tests ausführen"\n`);

console.log(`${colors.bold}Documentation:${colors.reset}`);
console.log(`  - __tests__/TEST-GUIDE.md     (Complete test guide)`);
console.log(`  - __tests__/README.md         (Detailed test information)\n`);

console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
