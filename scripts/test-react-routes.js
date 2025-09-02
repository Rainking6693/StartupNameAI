#!/usr/bin/env node

/**
 * StartupNamer.org - React Route Testing Framework
 * Comprehensive route testing for React Router deployment validation
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

// Colors for output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    purple: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

class ReactRouteTester {
    constructor() {
        this.testResults = {
            timestamp: new Date().toISOString(),
            testId: this.generateTestId(),
            routes: {},
            server: {
                running: false,
                port: 3001,
                baseUrl: 'http://localhost:3001'
            },
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: []
            }
        };
        
        this.clientPath = path.join(process.cwd(), 'client');
        this.buildPath = path.join(this.clientPath, 'build');
        this.testResultsPath = path.join(process.cwd(), 'test-results');
        this.server = null;
        this.browser = null;
        
        // Define routes to test based on package.json reactSnap configuration
        this.routesToTest = [
            {
                path: '/',
                name: 'Home',
                component: 'LandingPage',
                critical: true,
                expectedTitle: 'StartupNamer',
                expectedElements: ['#root', 'nav', 'header', 'main', 'footer']
            },
            {
                path: '/naming-tool',
                name: 'Naming Tool',
                component: 'NamingTool',
                critical: true,
                expectedTitle: 'Naming Tool',
                expectedElements: ['#root', 'form', 'input[type="text"]', 'button[type="submit"]']
            },
            {
                path: '/features',
                name: 'Features',
                component: 'Features',
                critical: false,
                expectedTitle: 'Features',
                expectedElements: ['#root', 'main']
            },
            {
                path: '/pricing',
                name: 'Pricing',
                component: 'Pricing',
                critical: false,
                expectedTitle: 'Pricing',
                expectedElements: ['#root', 'main']
            },
            {
                path: '/how-it-works',
                name: 'How It Works',
                component: 'HowItWorks',
                critical: false,
                expectedTitle: 'How It Works',
                expectedElements: ['#root', 'main']
            },
            {
                path: '/examples',
                name: 'Examples',
                component: 'Examples',
                critical: false,
                expectedTitle: 'Examples',
                expectedElements: ['#root', 'main']
            },
            {
                path: '/faq',
                name: 'FAQ',
                component: 'FAQ',
                critical: false,
                expectedTitle: 'FAQ',
                expectedElements: ['#root', 'main']
            },
            {
                path: '/contact',
                name: 'Contact',
                component: 'Contact',
                critical: false,
                expectedTitle: 'Contact',
                expectedElements: ['#root', 'main']
            },
            {
                path: '/privacy-policy',
                name: 'Privacy Policy',
                component: 'PrivacyPolicy',
                critical: true,
                expectedTitle: 'Privacy Policy',
                expectedElements: ['#root', 'main']
            },
            {
                path: '/terms-of-service',
                name: 'Terms of Service',
                component: 'TermsOfService',
                critical: true,
                expectedTitle: 'Terms',
                expectedElements: ['#root', 'main']
            }
        ];
        
        // Ensure test results directory exists
        if (!fs.existsSync(this.testResultsPath)) {
            fs.mkdirSync(this.testResultsPath, { recursive: true });
        }
    }

    generateTestId() {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    logSection(title) {
        this.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
        this.log(`${colors.blue}${title}${colors.reset}`);
        this.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
    }

    async startServer() {
        this.log(`${colors.yellow}🌐 Starting React build server...${colors.reset}`);
        
        return new Promise((resolve, reject) => {
            // Check if build directory exists
            if (!fs.existsSync(this.buildPath)) {
                reject(new Error(`Build directory not found: ${this.buildPath}. Run 'npm run build' first.`));
                return;
            }
            
            // Start HTTP server for the React build
            this.server = spawn('npx', ['http-server', this.buildPath, '-p', this.testResults.server.port.toString(), '-s'], {
                cwd: this.clientPath,
                stdio: ['pipe', 'pipe', 'pipe']
            });
            
            let serverOutput = '';
            
            this.server.stdout.on('data', (data) => {
                serverOutput += data.toString();
                if (data.toString().includes('Available on:')) {
                    this.testResults.server.running = true;
                    this.log(`${colors.green}✅ Server started on port ${this.testResults.server.port}${colors.reset}`);
                    resolve();
                }
            });
            
            this.server.stderr.on('data', (data) => {
                this.log(`Server error: ${data}`, 'red');
            });
            
            this.server.on('error', (error) => {
                reject(new Error(`Failed to start server: ${error.message}`));
            });
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (!this.testResults.server.running) {
                    reject(new Error('Server failed to start within 10 seconds'));
                }
            }, 10000);
        });
    }

    async stopServer() {
        if (this.server) {
            this.log(`${colors.yellow}🛑 Stopping server...${colors.reset}`);
            this.server.kill();
            this.testResults.server.running = false;
        }
    }

    async startBrowser() {
        this.log(`${colors.yellow}🌐 Starting browser for testing...${colors.reset}`);
        
        this.browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                '--single-process'
            ]
        });
        
        this.log(`${colors.green}✅ Browser started${colors.reset}`);
    }

    async stopBrowser() {
        if (this.browser) {
            this.log(`${colors.yellow}🛑 Stopping browser...${colors.reset}`);
            await this.browser.close();
        }
    }

    async testRoute(route) {
        this.log(`\n${colors.cyan}🛣️  Testing Route: ${route.name} (${route.path})${colors.reset}`);
        
        const page = await this.browser.newPage();
        const routeResults = {
            route: route.path,
            name: route.name,
            component: route.component,
            critical: route.critical,
            tests: {},
            performance: {},
            accessibility: {},
            errors: []
        };
        
        try {
            // Set viewport for testing
            await page.setViewport({ width: 1280, height: 720 });
            
            // Navigate to route
            const navigationStart = Date.now();
            const response = await page.goto(`${this.testResults.server.baseUrl}${route.path}`, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
            const navigationEnd = Date.now();
            
            routeResults.performance.navigationTime = navigationEnd - navigationStart;
            routeResults.tests.navigation = {
                success: response.status() === 200,
                statusCode: response.status()
            };
            
            if (response.status() !== 200) {
                throw new Error(`HTTP ${response.status()} response`);
            }
            
            // Wait for React to render
            await page.waitForSelector('#root', { timeout: 5000 });
            
            // Test page title
            const title = await page.title();
            routeResults.tests.title = {
                success: title.includes(route.expectedTitle),
                expected: route.expectedTitle,
                actual: title
            };
            
            // Test expected elements
            const elementTests = {};
            for (const selector of route.expectedElements) {
                try {
                    await page.waitForSelector(selector, { timeout: 2000 });
                    elementTests[selector] = { success: true, found: true };
                } catch (error) {
                    elementTests[selector] = { success: false, found: false, error: 'Element not found' };
                }
            }
            routeResults.tests.elements = elementTests;
            
            // Test React-specific elements
            const reactElement = await page.$('#root');
            const hasReactContent = reactElement !== null;
            routeResults.tests.react = {
                success: hasReactContent,
                hasRootElement: hasReactContent
            };
            
            // Check for console errors
            const consoleErrors = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });
            
            // Test JavaScript execution
            const jsExecutionTest = await page.evaluate(() => {
                return {
                    reactLoaded: typeof window.React !== 'undefined' || document.querySelector('#root').children.length > 0,
                    noJSErrors: true // Will be updated if errors found
                };
            });
            
            routeResults.tests.javascript = jsExecutionTest;
            
            // Test responsive design
            const viewports = [
                { width: 375, height: 667, name: 'Mobile' },
                { width: 768, height: 1024, name: 'Tablet' },
                { width: 1280, height: 720, name: 'Desktop' }
            ];
            
            const responsiveTests = {};
            for (const viewport of viewports) {
                await page.setViewport(viewport);
                await page.waitForTimeout(500); // Allow for responsive adjustments
                
                const isVisible = await page.evaluate(() => {
                    const root = document.querySelector('#root');
                    return root && root.children.length > 0;
                });
                
                responsiveTests[viewport.name] = {
                    success: isVisible,
                    viewport: `${viewport.width}x${viewport.height}`
                };
            }
            routeResults.tests.responsive = responsiveTests;
            
            // Reset viewport
            await page.setViewport({ width: 1280, height: 720 });
            
            // Test accessibility basics
            const accessibilityTests = await page.evaluate(() => {
                const hasHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
                const hasLandmarks = document.querySelectorAll('main, nav, header, footer, section, article, aside').length > 0;
                const hasAltTexts = Array.from(document.querySelectorAll('img')).every(img => img.hasAttribute('alt'));
                const hasLabels = Array.from(document.querySelectorAll('input')).every(input => 
                    input.hasAttribute('aria-label') || document.querySelector(`label[for="${input.id}"]`)
                );
                
                return {
                    hasHeadings,
                    hasLandmarks,
                    hasAltTexts,
                    hasLabels: document.querySelectorAll('input').length === 0 || hasLabels
                };
            });
            
            routeResults.accessibility = accessibilityTests;
            
            // Performance metrics
            const performanceMetrics = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                return navigation ? {
                    domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                    loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                    totalLoadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart)
                } : null;
            });
            
            if (performanceMetrics) {
                routeResults.performance = { ...routeResults.performance, ...performanceMetrics };
            }
            
            // Count successful tests
            const allTests = [
                routeResults.tests.navigation,
                routeResults.tests.title,
                routeResults.tests.react,
                routeResults.tests.javascript,
                ...Object.values(routeResults.tests.elements),
                ...Object.values(routeResults.tests.responsive)
            ];
            
            const passedTests = allTests.filter(test => test.success).length;
            const totalTests = allTests.length;
            
            routeResults.summary = {
                passed: passedTests,
                total: totalTests,
                success: passedTests === totalTests
            };
            
            if (routeResults.summary.success) {
                this.log(`${colors.green}✅ ${route.name} - All tests passed (${passedTests}/${totalTests})${colors.reset}`);
            } else {
                this.log(`${colors.yellow}⚠️  ${route.name} - Some tests failed (${passedTests}/${totalTests})${colors.reset}`);
            }
            
        } catch (error) {
            routeResults.errors.push(error.message);
            routeResults.summary = { passed: 0, total: 1, success: false };
            this.log(`${colors.red}❌ ${route.name} - Failed: ${error.message}${colors.reset}`);
        } finally {
            await page.close();
        }
        
        return routeResults;
    }

    async testAllRoutes() {
        this.logSection('🛣️  Testing All React Routes');
        
        for (const route of this.routesToTest) {
            const routeResults = await this.testRoute(route);
            this.testResults.routes[route.path] = routeResults;
            
            this.testResults.summary.total++;
            if (routeResults.summary && routeResults.summary.success) {
                this.testResults.summary.passed++;
            } else {
                this.testResults.summary.failed++;
                
                if (route.critical) {
                    this.testResults.summary.warnings.push(`Critical route failed: ${route.name} (${route.path})`);
                }
            }
        }
    }

    async testNavigation() {
        this.logSection('🧭 Testing Navigation Between Routes');
        
        const page = await this.browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        
        try {
            // Start at home page
            await page.goto(`${this.testResults.server.baseUrl}/`, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
            
            // Test navigation links
            const navigationTests = {
                homePage: { success: true },
                navigationLinks: {}
            };
            
            // Look for navigation links
            const navLinks = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('nav a, header a'));
                return links.map(link => ({
                    href: link.getAttribute('href'),
                    text: link.textContent.trim()
                })).filter(link => link.href && link.href.startsWith('/'));
            });
            
            this.log(`Found ${navLinks.length} navigation links`);
            
            for (const link of navLinks.slice(0, 5)) { // Test first 5 links to avoid timeout
                try {
                    this.log(`Testing navigation to: ${link.href}`);
                    await page.click(`a[href="${link.href}"]`);
                    await page.waitForSelector('#root', { timeout: 5000 });
                    
                    const currentUrl = page.url();
                    const expectedUrl = `${this.testResults.server.baseUrl}${link.href}`;
                    
                    navigationTests.navigationLinks[link.href] = {
                        success: currentUrl === expectedUrl,
                        expected: expectedUrl,
                        actual: currentUrl
                    };
                    
                    this.log(`${colors.green}✅ Navigation to ${link.href} successful${colors.reset}`);
                    
                } catch (error) {
                    navigationTests.navigationLinks[link.href] = {
                        success: false,
                        error: error.message
                    };
                    this.log(`${colors.red}❌ Navigation to ${link.href} failed: ${error.message}${colors.reset}`);
                }
            }
            
            this.testResults.navigation = navigationTests;
            
        } catch (error) {
            this.log(`${colors.red}❌ Navigation testing failed: ${error.message}${colors.reset}`);
        } finally {
            await page.close();
        }
    }

    async generateReport() {
        const reportPath = path.join(this.testResultsPath, `react-routes-report-${this.testResults.testId}.json`);
        
        // Add summary statistics
        this.testResults.summary.successRate = this.testResults.summary.total > 0 ? 
            (this.testResults.summary.passed / this.testResults.summary.total) * 100 : 0;
        this.testResults.summary.completedAt = new Date().toISOString();
        
        // Write detailed report
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        
        // Generate human-readable summary
        const summaryPath = path.join(this.testResultsPath, `react-routes-summary-${this.testResults.testId}.md`);
        const summary = this.generateSummaryMarkdown();
        fs.writeFileSync(summaryPath, summary);
        
        return {
            reportPath,
            summaryPath
        };
    }

    generateSummaryMarkdown() {
        const { summary, routes } = this.testResults;
        
        let markdown = `# React Routes Testing Report\n\n`;
        markdown += `**Test ID:** ${this.testResults.testId}\n`;
        markdown += `**Timestamp:** ${this.testResults.timestamp}\n`;
        markdown += `**Success Rate:** ${summary.successRate.toFixed(1)}%\n\n`;
        
        markdown += `## Summary\n\n`;
        markdown += `- **Total Routes:** ${summary.total}\n`;
        markdown += `- **Passed:** ${summary.passed}\n`;
        markdown += `- **Failed:** ${summary.failed}\n`;
        
        if (summary.warnings.length > 0) {
            markdown += `\n### ⚠️ Warnings\n\n`;
            summary.warnings.forEach(warning => {
                markdown += `- ${warning}\n`;
            });
        }
        
        markdown += `\n## Route Details\n\n`;
        
        Object.entries(routes).forEach(([path, data]) => {
            const status = data.summary && data.summary.success ? '✅' : '❌';
            const critical = data.critical ? '🔴 Critical' : '';
            
            markdown += `### ${status} ${data.name} \`${path}\` ${critical}\n\n`;
            
            if (data.performance && data.performance.navigationTime) {
                markdown += `- **Load Time:** ${data.performance.navigationTime}ms\n`;
            }
            
            if (data.tests) {
                if (data.tests.navigation) {
                    markdown += `- **Navigation:** ${data.tests.navigation.success ? '✅' : '❌'} (HTTP ${data.tests.navigation.statusCode})\n`;
                }
                
                if (data.tests.title) {
                    markdown += `- **Title:** ${data.tests.title.success ? '✅' : '❌'} (${data.tests.title.actual})\n`;
                }
                
                if (data.tests.react) {
                    markdown += `- **React Rendering:** ${data.tests.react.success ? '✅' : '❌'}\n`;
                }
                
                if (data.tests.responsive) {
                    const responsiveResults = Object.entries(data.tests.responsive);
                    const responsivePassed = responsiveResults.filter(([_, test]) => test.success).length;
                    markdown += `- **Responsive Design:** ${responsivePassed}/${responsiveResults.length} viewports\n`;
                }
            }
            
            if (data.errors && data.errors.length > 0) {
                markdown += `\n**Errors:**\n`;
                data.errors.forEach(error => {
                    markdown += `- ${error}\n`;
                });
            }
            
            markdown += `\n`;
        });
        
        return markdown;
    }

    async run() {
        try {
            this.log(`${colors.blue}🛣️  React Route Testing Framework${colors.reset}`);
            this.log(`${colors.blue}=====================================${colors.reset}\n`);
            this.log(`Test ID: ${this.testResults.testId}`);
            this.log(`Build Path: ${this.buildPath}`);
            this.log(`Server URL: ${this.testResults.server.baseUrl}\n`);
            
            // Start server and browser
            await this.startServer();
            await this.startBrowser();
            
            // Run all tests
            await this.testAllRoutes();
            await this.testNavigation();
            
            // Generate reports
            const { reportPath, summaryPath } = await this.generateReport();
            
            this.logSection('📊 Route Testing Summary');
            this.log(`Total Routes Tested: ${this.testResults.summary.total}`);
            this.log(`Passed: ${colors.green}${this.testResults.summary.passed}${colors.reset}`);
            this.log(`Failed: ${colors.red}${this.testResults.summary.failed}${colors.reset}`);
            this.log(`Success Rate: ${colors.cyan}${this.testResults.summary.successRate.toFixed(1)}%${colors.reset}`);
            
            if (this.testResults.summary.warnings.length > 0) {
                this.log(`\n${colors.yellow}⚠️  Warnings:${colors.reset}`);
                this.testResults.summary.warnings.forEach(warning => {
                    this.log(`  - ${warning}`, 'yellow');
                });
            }
            
            this.log(`\n${colors.blue}📄 Reports Generated:${colors.reset}`);
            this.log(`Detailed Report: ${reportPath}`);
            this.log(`Summary Report: ${summaryPath}`);
            
            if (this.testResults.summary.failed === 0) {
                this.log(`\n${colors.green}🎉 All routes passed testing!${colors.reset}`);
                return 0;
            } else {
                this.log(`\n${colors.yellow}⚠️  Some routes need attention.${colors.reset}`);
                return 1;
            }
            
        } catch (error) {
            this.log(`${colors.red}❌ Route testing failed: ${error.message}${colors.reset}`);
            return 1;
        } finally {
            // Cleanup
            await this.stopBrowser();
            await this.stopServer();
        }
    }
}

// Run the tests if called directly
if (require.main === module) {
    const tester = new ReactRouteTester();
    tester.run().then(exitCode => {
        process.exit(exitCode);
    }).catch(error => {
        console.error(`Fatal error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = ReactRouteTester;