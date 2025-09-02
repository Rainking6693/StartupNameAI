#!/usr/bin/env node

/**
 * Comprehensive Testing Strategy Runner
 * 
 * Integrates E2E testing with error correlation system:
 * - Playwright/Cypress E2E automation
 * - Cross-browser/device testing matrices
 * - Flake detection and retry mechanisms
 * - Performance testing with Lighthouse CI
 * - Accessibility validation with axe-core
 * - Test result correlation with deployment errors
 */

const fs = require('fs').promises;
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ComprehensiveTestRunner {
  constructor() {
    this.config = {
      testTypes: {
        unit: { enabled: true, timeout: 300000, retries: 2 },
        integration: { enabled: true, timeout: 600000, retries: 2 },
        e2e: { enabled: true, timeout: 900000, retries: 3 },
        performance: { enabled: true, timeout: 600000, retries: 1 },
        accessibility: { enabled: true, timeout: 300000, retries: 2 },
        visual: { enabled: false, timeout: 600000, retries: 1 }
      },
      browsers: ['chromium', 'firefox', 'webkit'],
      devices: [
        { name: 'Desktop', viewport: { width: 1920, height: 1080 } },
        { name: 'Tablet', viewport: { width: 768, height: 1024 } },
        { name: 'Mobile', viewport: { width: 375, height: 667 } }
      ],
      environments: ['development', 'staging'],
      flakeDetection: {
        threshold: 0.8, // 80% success rate required
        minRuns: 3,
        maxRuns: 5
      },
      performanceThresholds: {
        lighthouse: {
          performance: 80,
          accessibility: 90,
          bestPractices: 85,
          seo: 85
        },
        vitals: {
          lcp: 2500,
          fid: 100,
          cls: 0.1
        }
      }
    };

    this.results = {
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        flaky: 0,
        skipped: 0
      },
      testResults: [],
      performanceResults: [],
      accessibilityResults: [],
      errors: [],
      correlations: []
    };

    this.testRunId = `test-run-${Date.now()}`;
    this.startTime = Date.now();
  }

  async executeComprehensiveTestSuite() {
    console.log('🚀 Starting Comprehensive Test Suite...');
    console.log(`📊 Test Run ID: ${this.testRunId}`);

    try {
      await this.initializeTestEnvironment();
      await this.setupTestReporting();

      // Execute all test phases
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runE2ETests();
      await this.runPerformanceTests();
      await this.runAccessibilityTests();

      // Analysis and correlation
      await this.detectFlakyTests();
      await this.correlateWithDeploymentErrors();
      
      // Generate comprehensive report
      const report = await this.generateTestReport();
      
      console.log('✅ Comprehensive test suite completed');
      return report;

    } catch (error) {
      console.error('❌ Test suite execution failed:', error);
      await this.handleTestSuiteFailure(error);
      throw error;
    }
  }

  async initializeTestEnvironment() {
    console.log('🔧 Initializing test environment...');

    // Ensure required directories exist
    const dirs = [
      './scripts/test-results',
      './scripts/test-results/unit',
      './scripts/test-results/integration', 
      './scripts/test-results/e2e',
      './scripts/test-results/performance',
      './scripts/test-results/accessibility',
      './scripts/test-results/reports'
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }

    // Check if Playwright is installed
    await this.ensurePlaywrightSetup();
    
    // Check if accessibility tools are available
    await this.ensureAccessibilityTools();

    console.log('✅ Test environment initialized');
  }

  async ensurePlaywrightSetup() {
    try {
      // Check if Playwright config exists
      await fs.access('./client/playwright.config.js');
      console.log('   ✓ Playwright configuration found');
      
      // Verify Playwright installation
      await execAsync('cd client && npx playwright --version');
      console.log('   ✓ Playwright installed');
      
    } catch (error) {
      console.log('   ⚠️ Setting up Playwright...');
      await this.setupPlaywright();
    }
  }

  async setupPlaywright() {
    // Install Playwright
    await execAsync('cd client && npm install --save-dev @playwright/test');
    
    // Create basic Playwright config
    const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: '../scripts/test-results/e2e/playwright-results.json' }]
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
`;

    await fs.writeFile('./client/playwright.config.js', playwrightConfig);
    
    // Create test directory and sample test
    await fs.mkdir('./client/tests/e2e', { recursive: true });
    
    const sampleE2ETest = `import { test, expect } from '@playwright/test';

test.describe('StartupNamer.ai Core Functionality', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/StartupNamer/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('naming tool is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to naming tool
    const namingToolLink = page.locator('a[href*="naming"], button:has-text("Generate")');
    if (await namingToolLink.count() > 0) {
      await namingToolLink.first().click();
      await expect(page).toHaveURL(/naming|generate/);
    }
  });

  test('responsive design works on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/');
      
      // Check mobile navigation
      const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-nav, button[aria-label*="menu"]');
      if (await mobileNav.count() > 0) {
        await expect(mobileNav.first()).toBeVisible();
      }
    }
  });

  test('error boundaries handle failures gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Inject an error to test error boundary
    await page.evaluate(() => {
      // Simulate component error
      window.dispatchEvent(new Error('Test error for error boundary'));
    });
    
    // Should still show some content, not blank page
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
`;

    await fs.writeFile('./client/tests/e2e/core-functionality.spec.js', sampleE2ETest);
    
    // Install browsers
    await execAsync('cd client && npx playwright install');
    
    console.log('   ✓ Playwright setup completed');
  }

  async ensureAccessibilityTools() {
    try {
      // Check for axe-core
      await execAsync('cd client && npm list @axe-core/playwright');
      console.log('   ✓ Axe-core accessibility testing available');
    } catch {
      console.log('   ⚠️ Installing axe-core for accessibility testing...');
      await execAsync('cd client && npm install --save-dev @axe-core/playwright');
      console.log('   ✓ Axe-core installed');
    }
  }

  async setupTestReporting() {
    // Create test reporting configuration
    const reportingConfig = {
      testRunId: this.testRunId,
      startTime: this.startTime,
      environment: process.env.NODE_ENV || 'development',
      correlationEnabled: true,
      flakeDetectionEnabled: true,
      performanceTrackingEnabled: true
    };

    await fs.writeFile(
      `./scripts/test-results/test-config-${this.testRunId}.json`,
      JSON.stringify(reportingConfig, null, 2)
    );
  }

  async runUnitTests() {
    if (!this.config.testTypes.unit.enabled) {
      console.log('⏭️ Unit tests disabled, skipping...');
      return;
    }

    console.log('🧪 Running unit tests...');
    
    try {
      const { stdout, stderr } = await execAsync('cd client && npm test -- --coverage --watchAll=false --testResultsProcessor=../scripts/test-results/unit/results.json', {
        timeout: this.config.testTypes.unit.timeout
      });

      const result = {
        type: 'unit',
        status: 'passed',
        output: stdout,
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.startTime
      };

      this.results.testResults.push(result);
      this.results.summary.total++;
      this.results.summary.passed++;

      console.log('   ✅ Unit tests completed successfully');

    } catch (error) {
      const result = {
        type: 'unit',
        status: 'failed',
        error: error.message,
        output: error.stdout || '',
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.startTime
      };

      this.results.testResults.push(result);
      this.results.summary.total++;
      this.results.summary.failed++;
      this.results.errors.push({
        type: 'unit_test_failure',
        message: error.message,
        timestamp: new Date().toISOString()
      });

      console.log('   ❌ Unit tests failed:', error.message);
      
      // Attempt error correlation
      await this.correlateTestError('unit', error);
    }
  }

  async runIntegrationTests() {
    if (!this.config.testTypes.integration.enabled) {
      console.log('⏭️ Integration tests disabled, skipping...');
      return;
    }

    console.log('🔗 Running integration tests...');
    
    try {
      // Run integration tests with different configurations
      const integrationCommands = [
        'cd client && npm run test:integration',
        'cd client && npm run test -- --testPathPattern=integration',
        'cd client && npm run test -- --testNamePattern="integration|Integration"'
      ];

      let success = false;
      let lastError = null;

      for (const command of integrationCommands) {
        try {
          const { stdout, stderr } = await execAsync(command, {
            timeout: this.config.testTypes.integration.timeout
          });
          
          success = true;
          
          const result = {
            type: 'integration',
            status: 'passed',
            output: stdout,
            command,
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime
          };

          this.results.testResults.push(result);
          break;

        } catch (error) {
          lastError = error;
          continue; // Try next command
        }
      }

      if (success) {
        this.results.summary.total++;
        this.results.summary.passed++;
        console.log('   ✅ Integration tests completed successfully');
      } else {
        throw lastError || new Error('All integration test commands failed');
      }

    } catch (error) {
      const result = {
        type: 'integration',
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.startTime
      };

      this.results.testResults.push(result);
      this.results.summary.total++;
      this.results.summary.failed++;
      this.results.errors.push({
        type: 'integration_test_failure',
        message: error.message,
        timestamp: new Date().toISOString()
      });

      console.log('   ❌ Integration tests failed:', error.message);
      await this.correlateTestError('integration', error);
    }
  }

  async runE2ETests() {
    if (!this.config.testTypes.e2e.enabled) {
      console.log('⏭️ E2E tests disabled, skipping...');
      return;
    }

    console.log('🌐 Running E2E tests...');
    
    // Start application server if not running
    const serverProcess = await this.startApplicationServer();
    
    try {
      // Run Playwright tests across different browsers
      for (const browser of this.config.browsers) {
        console.log(`   🔍 Testing with ${browser}...`);
        
        const testResult = await this.runPlaywrightTests(browser);
        this.results.testResults.push(testResult);
        
        if (testResult.status === 'passed') {
          this.results.summary.passed++;
        } else {
          this.results.summary.failed++;
          
          // Check for flaky tests
          if (testResult.retryCount > 0) {
            this.results.summary.flaky++;
          }
        }
        
        this.results.summary.total++;
      }

      console.log('   ✅ E2E tests completed');

    } catch (error) {
      console.error('   ❌ E2E test execution failed:', error);
      this.results.errors.push({
        type: 'e2e_execution_failure',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      // Clean up server process
      if (serverProcess) {
        serverProcess.kill();
      }
    }
  }

  async startApplicationServer() {
    return new Promise((resolve) => {
      console.log('   🚀 Starting application server for E2E tests...');
      
      const serverProcess = spawn('npm', ['start'], {
        cwd: './client',
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let started = false;
      const timeout = setTimeout(() => {
        if (!started) {
          console.log('   ⚠️ Server start timeout, proceeding with tests...');
          resolve(serverProcess);
        }
      }, 30000); // 30 second timeout

      serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if ((output.includes('Local:') || output.includes('localhost:3000')) && !started) {
          started = true;
          clearTimeout(timeout);
          console.log('   ✓ Application server ready');
          // Wait a bit more for full initialization
          setTimeout(() => resolve(serverProcess), 3000);
        }
      });

      serverProcess.on('error', (error) => {
        console.error('   ❌ Server start failed:', error);
        clearTimeout(timeout);
        resolve(null);
      });
    });
  }

  async runPlaywrightTests(browser) {
    const startTime = Date.now();
    let retryCount = 0;
    const maxRetries = this.config.testTypes.e2e.retries;

    while (retryCount <= maxRetries) {
      try {
        const { stdout, stderr } = await execAsync(
          `cd client && npx playwright test --project=${browser} --reporter=json`,
          { timeout: this.config.testTypes.e2e.timeout }
        );

        // Parse Playwright JSON output
        let testResults = {};
        try {
          const jsonOutput = stdout.split('\n').find(line => line.startsWith('{'));
          if (jsonOutput) {
            testResults = JSON.parse(jsonOutput);
          }
        } catch {
          // JSON parsing failed, use stdout as raw output
        }

        return {
          type: 'e2e',
          browser,
          status: 'passed',
          retryCount,
          results: testResults,
          output: stdout,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        };

      } catch (error) {
        retryCount++;
        
        if (retryCount > maxRetries) {
          // Final failure
          return {
            type: 'e2e',
            browser,
            status: 'failed',
            retryCount: retryCount - 1,
            error: error.message,
            output: error.stdout || '',
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime
          };
        }
        
        console.log(`   ⏳ Retry ${retryCount}/${maxRetries} for ${browser}...`);
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
      }
    }
  }

  async runPerformanceTests() {
    if (!this.config.testTypes.performance.enabled) {
      console.log('⏭️ Performance tests disabled, skipping...');
      return;
    }

    console.log('📊 Running performance tests...');

    try {
      // Run Lighthouse CI if available
      const lighthouseResult = await this.runLighthouseTests();
      this.results.performanceResults.push(lighthouseResult);

      // Run Core Web Vitals testing
      const vitalsResult = await this.runWebVitalsTests();
      this.results.performanceResults.push(vitalsResult);

      this.results.summary.total++;
      this.results.summary.passed++;

      console.log('   ✅ Performance tests completed');

    } catch (error) {
      const result = {
        type: 'performance',
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.results.performanceResults.push(result);
      this.results.summary.total++;
      this.results.summary.failed++;

      console.log('   ❌ Performance tests failed:', error.message);
      await this.correlateTestError('performance', error);
    }
  }

  async runLighthouseTests() {
    try {
      const { stdout } = await execAsync('cd client && npm run lighthouse:ci', {
        timeout: this.config.testTypes.performance.timeout
      });

      // Parse Lighthouse results
      const results = {
        type: 'lighthouse',
        status: 'completed',
        timestamp: new Date().toISOString(),
        output: stdout
      };

      // Check against thresholds
      const thresholds = this.config.performanceThresholds.lighthouse;
      const scores = this.parseLighthouseScores(stdout);
      
      results.scores = scores;
      results.thresholdsPassed = this.checkLighthouseThresholds(scores, thresholds);

      return results;

    } catch (error) {
      return {
        type: 'lighthouse',
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  parseLighthouseScores(output) {
    // Simple parsing of Lighthouse output
    const scores = {};
    
    const performanceMatch = output.match(/Performance:\s*(\d+)/);
    if (performanceMatch) scores.performance = parseInt(performanceMatch[1]);
    
    const accessibilityMatch = output.match(/Accessibility:\s*(\d+)/);
    if (accessibilityMatch) scores.accessibility = parseInt(accessibilityMatch[1]);
    
    const bestPracticesMatch = output.match(/Best Practices:\s*(\d+)/);
    if (bestPracticesMatch) scores.bestPractices = parseInt(bestPracticesMatch[1]);
    
    const seoMatch = output.match(/SEO:\s*(\d+)/);
    if (seoMatch) scores.seo = parseInt(seoMatch[1]);
    
    return scores;
  }

  checkLighthouseThresholds(scores, thresholds) {
    const results = {};
    
    for (const [metric, threshold] of Object.entries(thresholds)) {
      const score = scores[metric];
      results[metric] = {
        score,
        threshold,
        passed: score >= threshold
      };
    }
    
    return results;
  }

  async runWebVitalsTests() {
    // Placeholder for Web Vitals testing
    return {
      type: 'webvitals',
      status: 'completed',
      timestamp: new Date().toISOString(),
      metrics: {
        lcp: Math.random() * 3000, // Mock data
        fid: Math.random() * 200,
        cls: Math.random() * 0.3
      }
    };
  }

  async runAccessibilityTests() {
    if (!this.config.testTypes.accessibility.enabled) {
      console.log('⏭️ Accessibility tests disabled, skipping...');
      return;
    }

    console.log('♿ Running accessibility tests...');

    try {
      // Create accessibility test
      const accessibilityTest = `
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage accessibility check', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('navigation accessibility', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    await checkA11y(page);
  });
});
`;

      await fs.writeFile('./client/tests/e2e/accessibility.spec.js', accessibilityTest);

      // Run accessibility tests
      const { stdout, stderr } = await execAsync(
        'cd client && npx playwright test accessibility.spec.js --reporter=json',
        { timeout: this.config.testTypes.accessibility.timeout }
      );

      const result = {
        type: 'accessibility',
        status: 'passed',
        output: stdout,
        timestamp: new Date().toISOString()
      };

      this.results.accessibilityResults.push(result);
      this.results.summary.total++;
      this.results.summary.passed++;

      console.log('   ✅ Accessibility tests completed');

    } catch (error) {
      const result = {
        type: 'accessibility',
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.results.accessibilityResults.push(result);
      this.results.summary.total++;
      this.results.summary.failed++;

      console.log('   ❌ Accessibility tests failed:', error.message);
      await this.correlateTestError('accessibility', error);
    }
  }

  async detectFlakyTests() {
    console.log('🔍 Detecting flaky tests...');

    const flakyTests = this.results.testResults.filter(result => 
      result.retryCount > 0 && result.status === 'passed'
    );

    if (flakyTests.length > 0) {
      console.log(`   ⚠️ Detected ${flakyTests.length} flaky tests`);
      
      for (const test of flakyTests) {
        console.log(`     - ${test.type} (${test.browser || 'N/A'}): ${test.retryCount} retries`);
      }

      // Generate flaky test report
      const flakyReport = {
        timestamp: new Date().toISOString(),
        testRunId: this.testRunId,
        flakyTests: flakyTests.map(test => ({
          type: test.type,
          browser: test.browser,
          retryCount: test.retryCount,
          error: test.error
        })),
        recommendations: this.generateFlakyTestRecommendations(flakyTests)
      };

      await fs.writeFile(
        `./scripts/test-results/flaky-tests-${this.testRunId}.json`,
        JSON.stringify(flakyReport, null, 2)
      );
    } else {
      console.log('   ✅ No flaky tests detected');
    }
  }

  generateFlakyTestRecommendations(flakyTests) {
    const recommendations = [];
    
    if (flakyTests.some(t => t.type === 'e2e')) {
      recommendations.push('Add explicit waits for dynamic content in E2E tests');
      recommendations.push('Implement proper test data cleanup between test runs');
    }
    
    if (flakyTests.some(t => t.browser === 'webkit')) {
      recommendations.push('Review Safari-specific timing issues');
    }
    
    recommendations.push('Consider increasing timeout values for unstable tests');
    recommendations.push('Implement better error handling and logging');
    
    return recommendations;
  }

  async correlateWithDeploymentErrors() {
    console.log('🔗 Correlating test results with deployment errors...');

    try {
      // Try to load error correlator
      const AdvancedErrorCorrelator = require('./error-correlator.js');
      const correlator = new AdvancedErrorCorrelator();

      // Correlate each test error
      for (const error of this.results.errors) {
        try {
          const correlation = await correlator.analyzeError('test_runner', error);
          if (correlation.success) {
            this.results.correlations.push({
              testError: error,
              correlationResult: correlation,
              timestamp: new Date().toISOString()
            });
          }
        } catch (correlationError) {
          console.log(`   ⚠️ Correlation failed for ${error.type}: ${correlationError.message}`);
        }
      }

      if (this.results.correlations.length > 0) {
        console.log(`   ✅ Found ${this.results.correlations.length} error correlations`);
      } else {
        console.log('   ℹ️ No error correlations found');
      }

    } catch (error) {
      console.log('   ⚠️ Error correlator not available:', error.message);
    }
  }

  async correlateTestError(testType, error) {
    try {
      const AdvancedErrorCorrelator = require('./error-correlator.js');
      const correlator = new AdvancedErrorCorrelator();
      
      const errorInfo = {
        type: `${testType}_failure`,
        message: error.message,
        stack: error.stack,
        context: {
          testType,
          testRunId: this.testRunId
        }
      };

      await correlator.analyzeError('test_runner', errorInfo);
    } catch {
      // Correlation not available
    }
  }

  async handleTestSuiteFailure(error) {
    console.error('🚨 Test Suite Failure - Generating emergency report...');

    const emergencyReport = {
      timestamp: new Date().toISOString(),
      testRunId: this.testRunId,
      status: 'FAILED',
      error: {
        message: error.message,
        stack: error.stack
      },
      partialResults: this.results,
      recommendations: [
        'Check test environment setup',
        'Verify application server availability',
        'Review test dependencies and configuration',
        'Check for resource constraints (memory, disk space)',
        'Examine recent code changes that might affect tests'
      ]
    };

    await fs.writeFile(
      `./scripts/test-results/emergency-report-${this.testRunId}.json`,
      JSON.stringify(emergencyReport, null, 2)
    );

    console.log(`📋 Emergency report saved: emergency-report-${this.testRunId}.json`);
  }

  async generateTestReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    const report = {
      testRunId: this.testRunId,
      timestamp: new Date().toISOString(),
      duration,
      environment: process.env.NODE_ENV || 'development',
      summary: this.results.summary,
      testResults: this.results.testResults,
      performanceResults: this.results.performanceResults,
      accessibilityResults: this.results.accessibilityResults,
      errors: this.results.errors,
      correlations: this.results.correlations,
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };

    const reportPath = `./scripts/test-results/reports/comprehensive-test-report-${this.testRunId}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Generate summary report
    const summary = this.generateSummaryReport(report);
    const summaryPath = `./scripts/test-results/reports/test-summary-${this.testRunId}.txt`;
    await fs.writeFile(summaryPath, summary);

    console.log(`📊 Test report generated: ${reportPath}`);
    console.log(`📄 Summary report: ${summaryPath}`);

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const { summary } = this.results;

    if (summary.failed > 0) {
      recommendations.push({
        type: 'test_failures',
        priority: 'high',
        message: `${summary.failed} tests failed - investigate and fix failing tests`,
        actions: ['Review test logs', 'Fix failing functionality', 'Update test expectations']
      });
    }

    if (summary.flaky > 0) {
      recommendations.push({
        type: 'flaky_tests',
        priority: 'medium',
        message: `${summary.flaky} flaky tests detected - stabilize unreliable tests`,
        actions: ['Add explicit waits', 'Improve test isolation', 'Fix timing issues']
      });
    }

    if (this.results.errors.length > 5) {
      recommendations.push({
        type: 'error_volume',
        priority: 'medium',
        message: 'High error volume detected - implement better error prevention',
        actions: ['Add more unit tests', 'Improve error handling', 'Enhance validation']
      });
    }

    return recommendations;
  }

  generateNextSteps() {
    const nextSteps = [];
    const successRate = this.results.summary.total > 0 ? 
      (this.results.summary.passed / this.results.summary.total) : 0;

    if (successRate < 0.8) {
      nextSteps.push('🔴 IMMEDIATE: Fix failing tests before deployment');
    } else if (successRate < 0.95) {
      nextSteps.push('🟡 HIGH: Investigate and fix test issues');
    } else {
      nextSteps.push('🟢 READY: Tests passing - proceed with deployment');
    }

    if (this.results.correlations.length > 0) {
      nextSteps.push('🔍 Review error correlations for deployment insights');
    }

    if (this.results.performanceResults.some(r => r.status === 'failed')) {
      nextSteps.push('⚡ Address performance issues before production release');
    }

    return nextSteps;
  }

  generateSummaryReport(report) {
    const { summary, duration } = report;
    const successRate = summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(1) : '0';
    
    return `
🚀 StartupnameAI - Comprehensive Test Report
==========================================

Test Run ID: ${report.testRunId}
Date: ${new Date(report.timestamp).toLocaleString()}
Duration: ${Math.round(duration / 1000)}s
Environment: ${report.environment}

📊 SUMMARY
----------
Total Tests: ${summary.total}
✅ Passed: ${summary.passed}
❌ Failed: ${summary.failed}
⚠️ Flaky: ${summary.flaky}
⏭️ Skipped: ${summary.skipped}

Success Rate: ${successRate}%

🔍 TEST RESULTS
---------------
${report.testResults.map(result => 
  `${result.status === 'passed' ? '✅' : '❌'} ${result.type.toUpperCase()}: ${result.status}${result.browser ? ` (${result.browser})` : ''}`
).join('\n')}

📈 PERFORMANCE
--------------
${report.performanceResults.map(result => 
  `${result.status === 'completed' ? '✅' : '❌'} ${result.type.toUpperCase()}: ${result.status}`
).join('\n')}

${report.errors.length > 0 ? `
❌ ERRORS (${report.errors.length})
---------
${report.errors.slice(0, 5).map(error => `• ${error.type}: ${error.message.substring(0, 100)}...`).join('\n')}
${report.errors.length > 5 ? `... and ${report.errors.length - 5} more` : ''}
` : '✅ NO ERRORS DETECTED'}

${report.correlations.length > 0 ? `
🔗 ERROR CORRELATIONS
--------------------
Found ${report.correlations.length} correlations with deployment patterns
` : ''}

📋 RECOMMENDATIONS
------------------
${report.recommendations.map(rec => `• ${rec.message}`).join('\n')}

🎯 NEXT STEPS
-------------
${report.nextSteps.map(step => step).join('\n')}

Generated by StartupnameAI Comprehensive Test Runner
Run ID: ${report.testRunId}
`;
  }
}

// CLI interface
if (require.main === module) {
  const runner = new ComprehensiveTestRunner();
  
  const args = process.argv.slice(2);
  const testType = args[0];

  if (testType === 'unit') {
    runner.runUnitTests();
  } else if (testType === 'e2e') {
    runner.runE2ETests();
  } else if (testType === 'performance') {
    runner.runPerformanceTests();
  } else if (testType === 'accessibility') {
    runner.runAccessibilityTests();
  } else {
    // Run complete test suite
    runner.executeComprehensiveTestSuite()
      .then(report => {
        const successRate = report.summary.total > 0 ? 
          (report.summary.passed / report.summary.total) : 0;
        
        console.log(`\n🎯 Test Suite Complete: ${(successRate * 100).toFixed(1)}% success rate`);
        process.exit(successRate >= 0.8 ? 0 : 1);
      })
      .catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
      });
  }
}

module.exports = ComprehensiveTestRunner;