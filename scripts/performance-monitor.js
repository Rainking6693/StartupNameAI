#!/usr/bin/env node

/**
 * Advanced Performance Monitoring System
 * 
 * Comprehensive performance monitoring with:
 * - Enhanced Lighthouse CI integration
 * - Core Web Vitals tracking
 * - Performance regression detection
 * - Real-time performance alerts
 * - Integration with error correlation system
 */

const fs = require('fs').promises;
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class AdvancedPerformanceMonitor {
  constructor() {
    this.config = {
      lighthouseConfig: {
        urls: [
          { url: 'http://localhost:3000', label: 'homepage' },
          { url: 'http://localhost:3000/naming-tool', label: 'naming-tool' },
          { url: 'http://localhost:3000/pricing', label: 'pricing' }
        ],
        options: {
          preset: 'desktop',
          throttling: {
            rtt: 40,
            throughput: 10240,
            cpuSlowdownMultiplier: 1,
            requestLatency: 0,
            downloadThroughput: 0,
            uploadThroughput: 0
          },
          formFactor: 'desktop',
          screenEmulation: {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false
          }
        },
        mobileOptions: {
          preset: 'mobile',
          throttling: {
            rtt: 150,
            throughput: 1638.4,
            cpuSlowdownMultiplier: 4
          },
          formFactor: 'mobile',
          screenEmulation: {
            mobile: true,
            width: 375,
            height: 667,
            deviceScaleFactor: 2
          }
        }
      },
      thresholds: {
        performance: 80,
        accessibility: 90,
        bestPractices: 85,
        seo: 85,
        pwa: 70
      },
      vitalThresholds: {
        lcp: 2500,    // Largest Contentful Paint (ms)
        fid: 100,     // First Input Delay (ms)
        cls: 0.1,     // Cumulative Layout Shift
        fcp: 1800,    // First Contentful Paint (ms)
        si: 3000,     // Speed Index (ms)
        tbt: 200      // Total Blocking Time (ms)
      },
      budgets: {
        totalSize: 2000000,     // 2MB
        scriptSize: 500000,     // 500KB
        imageSize: 1000000,     // 1MB
        stylesheetSize: 150000, // 150KB
        fontSize: 100000        // 100KB
      },
      monitoringInterval: 300000, // 5 minutes
      regressionThreshold: 0.05,  // 5% degradation
      alertThreshold: 0.1         // 10% degradation
    };

    this.results = {
      timestamp: new Date().toISOString(),
      monitoringSession: `perf-${Date.now()}`,
      lighthouse: [],
      vitals: [],
      budgets: [],
      regressions: [],
      alerts: [],
      trends: {}
    };

    this.isMonitoring = false;
    this.serverProcess = null;
  }

  async startPerformanceMonitoring() {
    console.log('📊 Starting Advanced Performance Monitoring...');
    
    try {
      await this.initializeMonitoring();
      await this.startApplicationServer();
      await this.runInitialPerformanceAudit();
      
      if (process.argv.includes('--continuous')) {
        await this.startContinuousMonitoring();
      }
      
      const report = await this.generatePerformanceReport();
      console.log('✅ Performance monitoring completed');
      
      return report;
      
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  async initializeMonitoring() {
    console.log('🔧 Initializing performance monitoring...');

    // Ensure directories exist
    const dirs = [
      './scripts/performance',
      './scripts/performance/lighthouse',
      './scripts/performance/vitals',
      './scripts/performance/reports',
      './scripts/performance/budgets'
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }

    // Setup Lighthouse CI if not configured
    await this.setupLighthouseCI();
    
    // Validate performance monitoring tools
    await this.validatePerformanceTools();

    console.log('✅ Performance monitoring initialized');
  }

  async setupLighthouseCI() {
    console.log('🚢 Setting up Lighthouse CI...');

    try {
      // Check if Lighthouse CI is installed
      await execAsync('npx lhci --version');
      console.log('   ✓ Lighthouse CI already available');
    } catch {
      console.log('   📦 Installing Lighthouse CI...');
      await execAsync('npm install --save-dev @lhci/cli');
      console.log('   ✓ Lighthouse CI installed');
    }

    // Create/update Lighthouse CI configuration
    const lhciConfig = {
      ci: {
        collect: {
          startServerCommand: 'npm start',
          startServerReadyPattern: 'Local:.*http://localhost:3000',
          startServerReadyTimeout: 30000,
          url: this.config.lighthouseConfig.urls.map(u => u.url),
          numberOfRuns: 3,
          settings: {
            preset: 'desktop',
            chromeFlags: '--no-sandbox --disable-dev-shm-usage'
          }
        },
        assert: {
          preset: 'lighthouse:no-pwa',
          assertions: {
            'categories:performance': ['error', { minScore: this.config.thresholds.performance }],
            'categories:accessibility': ['error', { minScore: this.config.thresholds.accessibility }],
            'categories:best-practices': ['error', { minScore: this.config.thresholds.bestPractices }],
            'categories:seo': ['error', { minScore: this.config.thresholds.seo }],
            'audits:largest-contentful-paint': ['error', { maxNumericValue: this.config.vitalThresholds.lcp }],
            'audits:first-input-delay': ['error', { maxNumericValue: this.config.vitalThresholds.fid }],
            'audits:cumulative-layout-shift': ['error', { maxNumericValue: this.config.vitalThresholds.cls }]
          }
        },
        upload: {
          target: 'filesystem',
          outputDir: './scripts/performance/lighthouse'
        }
      }
    };

    await fs.writeFile('./lighthouserc.js', `module.exports = ${JSON.stringify(lhciConfig, null, 2)};`);
    console.log('   ✓ Lighthouse CI configuration created');
  }

  async validatePerformanceTools() {
    console.log('🔍 Validating performance monitoring tools...');

    const tools = [
      { name: 'Lighthouse CLI', command: 'npx lighthouse --version' },
      { name: 'Chrome/Chromium', command: 'google-chrome --version || chromium --version || echo "Chrome not found"' }
    ];

    for (const tool of tools) {
      try {
        const { stdout } = await execAsync(tool.command, { shell: true });
        if (stdout.includes('not found')) {
          console.log(`   ⚠️ ${tool.name}: Not available`);
        } else {
          console.log(`   ✓ ${tool.name}: Available`);
        }
      } catch (error) {
        console.log(`   ⚠️ ${tool.name}: ${error.message}`);
      }
    }
  }

  async startApplicationServer() {
    if (this.serverProcess) {
      console.log('   ℹ️ Server already running');
      return;
    }

    console.log('🚀 Starting application server for performance testing...');

    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('npm', ['start'], {
        cwd: './client',
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let serverReady = false;
      const timeout = setTimeout(() => {
        if (!serverReady) {
          console.log('   ⚠️ Server start timeout');
          resolve(); // Continue without server
        }
      }, 45000);

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if ((output.includes('Local:') || output.includes('localhost:3000')) && !serverReady) {
          serverReady = true;
          clearTimeout(timeout);
          console.log('   ✓ Application server ready for performance testing');
          setTimeout(resolve, 5000); // Wait additional time for full startup
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('EADDRINUSE')) {
          console.log('   ℹ️ Server already running on port 3000');
          clearTimeout(timeout);
          serverReady = true;
          resolve();
        }
      });

      this.serverProcess.on('error', (error) => {
        console.error('   ❌ Server start failed:', error);
        clearTimeout(timeout);
        resolve(); // Continue without server for now
      });

      this.serverProcess.on('exit', (code) => {
        if (code !== 0 && !serverReady) {
          console.error(`   ❌ Server exited with code ${code}`);
          clearTimeout(timeout);
          resolve();
        }
      });
    });
  }

  async runInitialPerformanceAudit() {
    console.log('📊 Running initial performance audit...');

    try {
      // Run Lighthouse CI audit
      await this.runLighthouseCIAudit();
      
      // Run individual Lighthouse audits for detailed analysis
      await this.runDetailedLighthouseAudits();
      
      // Analyze performance budgets
      await this.analyzePerformanceBudgets();
      
      // Check for performance regressions
      await this.detectPerformanceRegressions();

    } catch (error) {
      console.error('   ❌ Performance audit failed:', error);
      
      // Try to correlate performance errors
      await this.correlatePerformanceError(error);
    }
  }

  async runLighthouseCIAudit() {
    console.log('   🚢 Running Lighthouse CI audit...');

    try {
      const { stdout, stderr } = await execAsync('npx lhci collect --numberOfRuns=3', {
        cwd: process.cwd(),
        timeout: 300000 // 5 minutes
      });

      // Parse Lighthouse CI results
      const results = {
        type: 'lighthouse_ci',
        timestamp: new Date().toISOString(),
        status: 'completed',
        output: stdout,
        errors: stderr
      };

      this.results.lighthouse.push(results);
      console.log('     ✓ Lighthouse CI audit completed');

    } catch (error) {
      console.log('     ❌ Lighthouse CI audit failed:', error.message);
      
      // Try fallback single lighthouse run
      await this.runFallbackLighthouseAudit();
    }
  }

  async runFallbackLighthouseAudit() {
    console.log('     🔄 Running fallback Lighthouse audit...');

    for (const urlConfig of this.config.lighthouseConfig.urls) {
      try {
        const outputPath = `./scripts/performance/lighthouse/${urlConfig.label}-${Date.now()}.json`;
        
        const command = `npx lighthouse ${urlConfig.url} ` +
          `--output=json --output-path="${outputPath}" ` +
          `--chrome-flags="--headless --no-sandbox" ` +
          `--preset=desktop --quiet`;

        const { stdout } = await execAsync(command, { timeout: 120000 });

        // Read and parse the results
        const resultsData = await fs.readFile(outputPath, 'utf8');
        const lighthouseResults = JSON.parse(resultsData);

        const auditResult = {
          type: 'lighthouse_single',
          url: urlConfig.url,
          label: urlConfig.label,
          timestamp: new Date().toISOString(),
          scores: {
            performance: lighthouseResults.categories.performance?.score * 100 || 0,
            accessibility: lighthouseResults.categories.accessibility?.score * 100 || 0,
            bestPractices: lighthouseResults.categories['best-practices']?.score * 100 || 0,
            seo: lighthouseResults.categories.seo?.score * 100 || 0
          },
          vitals: this.extractWebVitals(lighthouseResults),
          resourceSizes: this.extractResourceSizes(lighthouseResults),
          outputPath
        };

        this.results.lighthouse.push(auditResult);
        console.log(`       ✓ ${urlConfig.label}: Performance ${auditResult.scores.performance}`);

      } catch (error) {
        console.log(`       ❌ ${urlConfig.label}: ${error.message}`);
        
        this.results.lighthouse.push({
          type: 'lighthouse_failed',
          url: urlConfig.url,
          label: urlConfig.label,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async runDetailedLighthouseAudits() {
    console.log('   🔍 Running detailed performance audits...');

    // Desktop audit
    await this.runDeviceSpecificAudit('desktop');
    
    // Mobile audit
    await this.runDeviceSpecificAudit('mobile');
  }

  async runDeviceSpecificAudit(device) {
    const config = device === 'mobile' ? 
      this.config.lighthouseConfig.mobileOptions : 
      this.config.lighthouseConfig.options;

    console.log(`     📱 Running ${device} audit...`);

    const homeUrl = this.config.lighthouseConfig.urls[0].url;
    const outputPath = `./scripts/performance/lighthouse/${device}-detailed-${Date.now()}.json`;

    try {
      const throttlingFlags = device === 'mobile' ? 
        '--throttling.rtt=150 --throttling.throughput=1638 --throttling.cpuSlowdownMultiplier=4' :
        '--throttling.rtt=40 --throttling.throughput=10240 --throttling.cpuSlowdownMultiplier=1';

      const screenEmulationFlags = device === 'mobile' ?
        '--screenEmulation.mobile=true --screenEmulation.width=375 --screenEmulation.height=667' :
        '--screenEmulation.mobile=false --screenEmulation.width=1350 --screenEmulation.height=940';

      const command = `npx lighthouse ${homeUrl} ` +
        `--output=json --output-path="${outputPath}" ` +
        `--chrome-flags="--headless --no-sandbox" ` +
        `--form-factor=${config.formFactor} ` +
        `${throttlingFlags} ${screenEmulationFlags} ` +
        `--quiet`;

      await execAsync(command, { timeout: 180000 });

      // Parse detailed results
      const resultsData = await fs.readFile(outputPath, 'utf8');
      const lighthouseResults = JSON.parse(resultsData);

      const detailedResult = {
        type: `lighthouse_detailed_${device}`,
        timestamp: new Date().toISOString(),
        device,
        scores: {
          performance: lighthouseResults.categories.performance?.score * 100 || 0,
          accessibility: lighthouseResults.categories.accessibility?.score * 100 || 0,
          bestPractices: lighthouseResults.categories['best-practices']?.score * 100 || 0,
          seo: lighthouseResults.categories.seo?.score * 100 || 0
        },
        vitals: this.extractWebVitals(lighthouseResults),
        opportunities: this.extractOptimizationOpportunities(lighthouseResults),
        diagnostics: this.extractDiagnostics(lighthouseResults),
        resourceSizes: this.extractResourceSizes(lighthouseResults),
        outputPath
      };

      this.results.lighthouse.push(detailedResult);
      console.log(`       ✓ ${device}: Performance ${detailedResult.scores.performance}`);

    } catch (error) {
      console.log(`       ❌ ${device} audit failed:`, error.message);
      
      this.results.lighthouse.push({
        type: `lighthouse_detailed_${device}_failed`,
        device,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  extractWebVitals(lighthouseResults) {
    const audits = lighthouseResults.audits || {};
    
    return {
      lcp: audits['largest-contentful-paint']?.numericValue || null,
      fid: audits['max-potential-fid']?.numericValue || null, // Approximation
      cls: audits['cumulative-layout-shift']?.numericValue || null,
      fcp: audits['first-contentful-paint']?.numericValue || null,
      si: audits['speed-index']?.numericValue || null,
      tbt: audits['total-blocking-time']?.numericValue || null,
      tti: audits['interactive']?.numericValue || null
    };
  }

  extractOptimizationOpportunities(lighthouseResults) {
    const audits = lighthouseResults.audits || {};
    const opportunities = [];

    const opportunityAudits = [
      'unused-css-rules',
      'unused-javascript',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'modern-image-formats',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-responsive-images'
    ];

    for (const auditId of opportunityAudits) {
      const audit = audits[auditId];
      if (audit && audit.details && audit.details.overallSavingsMs > 100) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          savingsMs: audit.details.overallSavingsMs,
          savingsBytes: audit.details.overallSavingsBytes || 0,
          score: audit.score
        });
      }
    }

    return opportunities.sort((a, b) => b.savingsMs - a.savingsMs);
  }

  extractDiagnostics(lighthouseResults) {
    const audits = lighthouseResults.audits || {};
    const diagnostics = [];

    const diagnosticAudits = [
      'main-thread-tasks',
      'bootup-time',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'dom-size',
      'critical-request-chains'
    ];

    for (const auditId of diagnosticAudits) {
      const audit = audits[auditId];
      if (audit) {
        diagnostics.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          displayValue: audit.displayValue,
          numericValue: audit.numericValue,
          score: audit.score
        });
      }
    }

    return diagnostics;
  }

  extractResourceSizes(lighthouseResults) {
    const audits = lighthouseResults.audits || {};
    const resourceSummary = audits['resource-summary'];
    
    if (!resourceSummary?.details?.items) {
      return {};
    }

    const sizes = {};
    for (const item of resourceSummary.details.items) {
      sizes[item.resourceType] = {
        requestCount: item.requestCount,
        transferSize: item.transferSize,
        size: item.size
      };
    }

    return sizes;
  }

  async analyzePerformanceBudgets() {
    console.log('   💰 Analyzing performance budgets...');

    const budgetAnalysis = {
      timestamp: new Date().toISOString(),
      budgets: [],
      violations: [],
      status: 'passed'
    };

    // Analyze resource size budgets
    for (const result of this.results.lighthouse) {
      if (result.resourceSizes && typeof result.resourceSizes === 'object') {
        const analysis = this.analyzeBudgetViolations(result.resourceSizes, result.label || 'unknown');
        budgetAnalysis.budgets.push(analysis);
        
        if (analysis.violations.length > 0) {
          budgetAnalysis.violations.push(...analysis.violations);
          budgetAnalysis.status = 'violated';
        }
      }
    }

    this.results.budgets.push(budgetAnalysis);

    if (budgetAnalysis.violations.length > 0) {
      console.log(`     ⚠️ ${budgetAnalysis.violations.length} budget violations detected`);
      budgetAnalysis.violations.forEach(violation => {
        console.log(`       • ${violation.type}: ${violation.actual} > ${violation.budget} (${violation.overage})`);
      });
    } else {
      console.log('     ✓ All performance budgets within limits');
    }
  }

  analyzeBudgetViolations(resourceSizes, label) {
    const analysis = {
      label,
      timestamp: new Date().toISOString(),
      violations: [],
      status: 'passed'
    };

    const budgetChecks = [
      { type: 'script', budget: this.config.budgets.scriptSize },
      { type: 'image', budget: this.config.budgets.imageSize },
      { type: 'stylesheet', budget: this.config.budgets.stylesheetSize },
      { type: 'font', budget: this.config.budgets.fontSize }
    ];

    for (const check of budgetChecks) {
      const resource = resourceSizes[check.type];
      if (resource && resource.transferSize > check.budget) {
        const overage = ((resource.transferSize / check.budget - 1) * 100).toFixed(1);
        
        analysis.violations.push({
          type: check.type,
          budget: check.budget,
          actual: resource.transferSize,
          overage: `${overage}% over budget`,
          requests: resource.requestCount
        });
        
        analysis.status = 'violated';
      }
    }

    // Check total size budget
    const totalSize = Object.values(resourceSizes)
      .reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
    
    if (totalSize > this.config.budgets.totalSize) {
      const overage = ((totalSize / this.config.budgets.totalSize - 1) * 100).toFixed(1);
      
      analysis.violations.push({
        type: 'total',
        budget: this.config.budgets.totalSize,
        actual: totalSize,
        overage: `${overage}% over budget`
      });
      
      analysis.status = 'violated';
    }

    return analysis;
  }

  async detectPerformanceRegressions() {
    console.log('   📉 Detecting performance regressions...');

    try {
      const historicalData = await this.loadHistoricalPerformanceData();
      
      if (historicalData.length < 2) {
        console.log('     ℹ️ Insufficient historical data for regression analysis');
        return;
      }

      const currentResults = this.results.lighthouse.filter(r => r.scores);
      const previousResults = historicalData[historicalData.length - 1].lighthouse.filter(r => r.scores);

      const regressions = this.analyzeRegressions(currentResults, previousResults);
      
      if (regressions.length > 0) {
        this.results.regressions = regressions;
        console.log(`     ⚠️ ${regressions.length} performance regressions detected`);
        
        for (const regression of regressions) {
          console.log(`       • ${regression.metric}: ${regression.change}% degradation`);
          
          if (Math.abs(regression.change) > this.config.alertThreshold * 100) {
            this.results.alerts.push({
              type: 'performance_regression',
              metric: regression.metric,
              change: regression.change,
              severity: Math.abs(regression.change) > this.config.alertThreshold * 200 ? 'critical' : 'warning',
              timestamp: new Date().toISOString()
            });
          }
        }
      } else {
        console.log('     ✓ No performance regressions detected');
      }

    } catch (error) {
      console.log('     ❌ Regression detection failed:', error.message);
    }
  }

  analyzeRegressions(currentResults, previousResults) {
    const regressions = [];

    for (const current of currentResults) {
      const previous = previousResults.find(p => 
        p.label === current.label && p.device === current.device
      );

      if (!previous || !previous.scores) continue;

      const scoreMetrics = ['performance', 'accessibility', 'bestPractices', 'seo'];
      
      for (const metric of scoreMetrics) {
        const currentScore = current.scores[metric] || 0;
        const previousScore = previous.scores[metric] || 0;
        
        if (previousScore > 0) {
          const change = ((currentScore - previousScore) / previousScore) * 100;
          
          if (change < -this.config.regressionThreshold * 100) {
            regressions.push({
              label: current.label,
              device: current.device,
              metric,
              current: currentScore,
              previous: previousScore,
              change: change.toFixed(2)
            });
          }
        }
      }

      // Check Web Vitals regressions
      if (current.vitals && previous.vitals) {
        const vitalMetrics = ['lcp', 'fid', 'cls', 'fcp', 'si', 'tbt'];
        
        for (const vital of vitalMetrics) {
          const currentValue = current.vitals[vital];
          const previousValue = previous.vitals[vital];
          
          if (currentValue && previousValue && previousValue > 0) {
            const change = ((currentValue - previousValue) / previousValue) * 100;
            
            // For vitals, positive change is bad (higher is worse)
            if (change > this.config.regressionThreshold * 100) {
              regressions.push({
                label: current.label,
                device: current.device,
                metric: `vitals.${vital}`,
                current: currentValue,
                previous: previousValue,
                change: change.toFixed(2)
              });
            }
          }
        }
      }
    }

    return regressions;
  }

  async startContinuousMonitoring() {
    console.log('🔄 Starting continuous performance monitoring...');
    
    this.isMonitoring = true;
    
    const monitoringInterval = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(monitoringInterval);
        return;
      }

      console.log('📊 Running scheduled performance check...');
      
      try {
        await this.runPerformanceCheck();
      } catch (error) {
        console.error('Scheduled performance check failed:', error);
      }
    }, this.config.monitoringInterval);

    // Monitor for specific intervals based on deployment activity
    this.setupDeploymentTriggeredMonitoring();
  }

  async runPerformanceCheck() {
    // Run a lighter performance check for continuous monitoring
    const quickAuditResult = await this.runQuickPerformanceAudit();
    
    // Check against thresholds
    const issues = this.checkPerformanceThresholds(quickAuditResult);
    
    if (issues.length > 0) {
      console.log(`⚠️ Performance issues detected: ${issues.length}`);
      
      for (const issue of issues) {
        console.log(`  • ${issue.metric}: ${issue.value} (threshold: ${issue.threshold})`);
        
        this.results.alerts.push({
          type: 'performance_threshold_violation',
          metric: issue.metric,
          value: issue.value,
          threshold: issue.threshold,
          timestamp: new Date().toISOString()
        });
      }

      // Correlate performance issues with errors
      await this.correlatePerformanceIssues(issues);
    }
  }

  async runQuickPerformanceAudit() {
    // Simplified audit for continuous monitoring
    const homeUrl = this.config.lighthouseConfig.urls[0].url;
    
    try {
      const command = `npx lighthouse ${homeUrl} ` +
        `--output=json ` +
        `--chrome-flags="--headless --no-sandbox" ` +
        `--preset=desktop ` +
        `--only-categories=performance ` +
        `--quiet`;

      const { stdout } = await execAsync(command, { timeout: 60000 });
      
      // Parse results from stdout (JSON output)
      const lighthouseResults = JSON.parse(stdout);
      
      return {
        timestamp: new Date().toISOString(),
        performance: lighthouseResults.categories.performance?.score * 100 || 0,
        vitals: this.extractWebVitals(lighthouseResults)
      };
      
    } catch (error) {
      console.error('Quick performance audit failed:', error);
      return null;
    }
  }

  checkPerformanceThresholds(auditResult) {
    if (!auditResult) return [];

    const issues = [];

    // Check performance score
    if (auditResult.performance < this.config.thresholds.performance) {
      issues.push({
        metric: 'performance_score',
        value: auditResult.performance,
        threshold: this.config.thresholds.performance
      });
    }

    // Check Web Vitals
    if (auditResult.vitals) {
      const vitalChecks = [
        { metric: 'lcp', value: auditResult.vitals.lcp, threshold: this.config.vitalThresholds.lcp },
        { metric: 'fid', value: auditResult.vitals.fid, threshold: this.config.vitalThresholds.fid },
        { metric: 'cls', value: auditResult.vitals.cls, threshold: this.config.vitalThresholds.cls }
      ];

      for (const check of vitalChecks) {
        if (check.value && check.value > check.threshold) {
          issues.push(check);
        }
      }
    }

    return issues;
  }

  async correlatePerformanceError(error) {
    try {
      const AdvancedErrorCorrelator = require('./error-correlator.js');
      const correlator = new AdvancedErrorCorrelator();
      
      const errorInfo = {
        type: 'performance_monitoring_error',
        message: error.message,
        context: {
          monitoringSession: this.results.monitoringSession
        }
      };

      await correlator.analyzeError('performance_monitor', errorInfo);
    } catch {
      // Error correlator not available
    }
  }

  async correlatePerformanceIssues(issues) {
    try {
      const AdvancedErrorCorrelator = require('./error-correlator.js');
      const correlator = new AdvancedErrorCorrelator();
      
      for (const issue of issues) {
        const errorInfo = {
          type: 'performance_threshold_violation',
          message: `${issue.metric} exceeded threshold: ${issue.value} > ${issue.threshold}`,
          context: {
            metric: issue.metric,
            value: issue.value,
            threshold: issue.threshold,
            monitoringSession: this.results.monitoringSession
          }
        };

        await correlator.analyzeError('performance_monitor', errorInfo);
      }
    } catch {
      // Error correlator not available
    }
  }

  async loadHistoricalPerformanceData() {
    try {
      const files = await fs.readdir('./scripts/performance/reports');
      const reportFiles = files.filter(f => f.startsWith('performance-report-') && f.endsWith('.json'));
      
      const historicalData = [];
      
      for (const file of reportFiles.slice(-10)) { // Last 10 reports
        try {
          const data = await fs.readFile(`./scripts/performance/reports/${file}`, 'utf8');
          historicalData.push(JSON.parse(data));
        } catch {
          // Skip corrupted files
        }
      }
      
      return historicalData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch {
      return [];
    }
  }

  async generatePerformanceReport() {
    console.log('📋 Generating comprehensive performance report...');

    const report = {
      monitoringSession: this.results.monitoringSession,
      timestamp: new Date().toISOString(),
      summary: {
        auditsCompleted: this.results.lighthouse.length,
        regressionCount: this.results.regressions.length,
        budgetViolations: this.results.budgets.reduce((sum, b) => sum + b.violations.length, 0),
        alertsTriggered: this.results.alerts.length
      },
      lighthouse: this.results.lighthouse,
      budgets: this.results.budgets,
      regressions: this.results.regressions,
      alerts: this.results.alerts,
      recommendations: this.generatePerformanceRecommendations(),
      nextSteps: this.generatePerformanceNextSteps(),
      historicalTrends: await this.analyzeHistoricalTrends()
    };

    // Save detailed report
    const reportPath = `./scripts/performance/reports/performance-report-${this.results.monitoringSession}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Generate summary
    const summary = this.generatePerformanceSummary(report);
    const summaryPath = `./scripts/performance/reports/performance-summary-${this.results.monitoringSession}.txt`;
    await fs.writeFile(summaryPath, summary);

    // Save current results for historical analysis
    await this.saveCurrentPerformanceData();

    console.log(`📊 Performance report generated: ${reportPath}`);
    console.log(`📄 Summary report: ${summaryPath}`);

    return report;
  }

  generatePerformanceRecommendations() {
    const recommendations = [];

    // Based on Lighthouse opportunities
    const allOpportunities = this.results.lighthouse
      .filter(r => r.opportunities)
      .flatMap(r => r.opportunities);

    if (allOpportunities.length > 0) {
      const topOpportunities = allOpportunities
        .sort((a, b) => b.savingsMs - a.savingsMs)
        .slice(0, 5);

      recommendations.push({
        type: 'optimization_opportunities',
        priority: 'high',
        message: `${topOpportunities.length} optimization opportunities detected`,
        opportunities: topOpportunities.map(o => ({
          title: o.title,
          savingsMs: o.savingsMs,
          savingsBytes: o.savingsBytes
        }))
      });
    }

    // Based on budget violations
    if (this.results.budgets.some(b => b.violations.length > 0)) {
      recommendations.push({
        type: 'budget_violations',
        priority: 'medium',
        message: 'Performance budget violations detected',
        actionItems: [
          'Review resource loading strategies',
          'Implement code splitting',
          'Optimize image assets',
          'Remove unused code'
        ]
      });
    }

    // Based on regressions
    if (this.results.regressions.length > 0) {
      recommendations.push({
        type: 'performance_regressions',
        priority: 'high',
        message: `${this.results.regressions.length} performance regressions detected`,
        regressions: this.results.regressions.slice(0, 3)
      });
    }

    return recommendations;
  }

  generatePerformanceNextSteps() {
    const nextSteps = [];

    const criticalAlerts = this.results.alerts.filter(a => a.severity === 'critical');
    const warnings = this.results.alerts.filter(a => a.severity === 'warning');

    if (criticalAlerts.length > 0) {
      nextSteps.push('🔴 CRITICAL: Address critical performance issues immediately');
      nextSteps.push('🛑 Block deployment until critical issues are resolved');
    } else if (warnings.length > 0) {
      nextSteps.push('🟡 WARNING: Performance concerns detected');
      nextSteps.push('🔍 Review and address performance warnings');
    } else {
      nextSteps.push('🟢 READY: Performance metrics within acceptable ranges');
    }

    if (this.results.regressions.length > 0) {
      nextSteps.push('📉 Investigate and fix performance regressions');
    }

    if (this.results.budgets.some(b => b.violations.length > 0)) {
      nextSteps.push('💰 Address performance budget violations');
    }

    nextSteps.push('📊 Continue monitoring performance metrics');

    return nextSteps;
  }

  async analyzeHistoricalTrends() {
    try {
      const historicalData = await this.loadHistoricalPerformanceData();
      
      if (historicalData.length < 3) {
        return { message: 'Insufficient data for trend analysis' };
      }

      // Analyze performance score trends
      const performanceScores = historicalData.map(data => {
        const scores = data.lighthouse
          ?.filter(r => r.scores?.performance)
          ?.map(r => r.scores.performance) || [];
        
        return scores.length > 0 ? 
          scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
      });

      const recentScores = performanceScores.slice(-5);
      const trend = this.calculateTrend(recentScores);

      return {
        performanceScoreTrend: trend,
        averageScore: recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length,
        historicalAverage: performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length
      };

    } catch (error) {
      return { error: 'Unable to analyze trends', message: error.message };
    }
  }

  calculateTrend(values) {
    if (values.length < 2) return 'insufficient_data';

    const recent = values.slice(-3);
    const older = values.slice(0, -3);

    if (older.length === 0) return 'insufficient_data';

    const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + v, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (Math.abs(change) < 2) return 'stable';
    return change > 0 ? 'improving' : 'declining';
  }

  generatePerformanceSummary(report) {
    const avgPerformance = report.lighthouse
      .filter(r => r.scores?.performance)
      .reduce((sum, r, _, arr) => sum + r.scores.performance / arr.length, 0);

    return `
📊 StartupnameAI - Performance Monitoring Report
===============================================

Monitoring Session: ${report.monitoringSession}
Date: ${new Date(report.timestamp).toLocaleString()}

🎯 SUMMARY
----------
Average Performance Score: ${avgPerformance.toFixed(1)}
Audits Completed: ${report.summary.auditsCompleted}
Budget Violations: ${report.summary.budgetViolations}
Regressions: ${report.summary.regressionCount}
Alerts: ${report.summary.alertsTriggered}

📊 LIGHTHOUSE RESULTS
--------------------
${report.lighthouse.filter(r => r.scores).map(result => 
  `${result.type === 'lighthouse_detailed_desktop' ? '🖥️ ' : result.type === 'lighthouse_detailed_mobile' ? '📱 ' : '🌐 '}${result.label || result.device || 'audit'}: ` +
  `Performance ${result.scores.performance}, ` +
  `Accessibility ${result.scores.accessibility}, ` +
  `Best Practices ${result.scores.bestPractices}, ` +
  `SEO ${result.scores.seo}`
).join('\n')}

${report.budgets.length > 0 && report.budgets.some(b => b.violations.length > 0) ? `
💰 BUDGET VIOLATIONS
-------------------
${report.budgets.flatMap(b => b.violations).map(v => 
  `❌ ${v.type}: ${(v.actual / 1024).toFixed(1)}KB > ${(v.budget / 1024).toFixed(1)}KB (${v.overage})`
).join('\n')}
` : '✅ ALL BUDGETS WITHIN LIMITS'}

${report.regressions.length > 0 ? `
📉 PERFORMANCE REGRESSIONS
--------------------------
${report.regressions.slice(0, 5).map(r => 
  `❌ ${r.label} ${r.metric}: ${r.change}% degradation (${r.current} vs ${r.previous})`
).join('\n')}
${report.regressions.length > 5 ? `... and ${report.regressions.length - 5} more` : ''}
` : '✅ NO REGRESSIONS DETECTED'}

${report.alerts.length > 0 ? `
🚨 ALERTS
---------
${report.alerts.slice(0, 5).map(a => 
  `${a.severity === 'critical' ? '🔴' : '🟡'} ${a.type}: ${a.metric || a.message}`
).join('\n')}
` : '✅ NO ALERTS TRIGGERED'}

📋 RECOMMENDATIONS
------------------
${report.recommendations.slice(0, 5).map(rec => `• ${rec.message}`).join('\n')}

🎯 NEXT STEPS
-------------
${report.nextSteps.map(step => step).join('\n')}

Generated by StartupnameAI Advanced Performance Monitor
Session ID: ${report.monitoringSession}
`;
  }

  async saveCurrentPerformanceData() {
    const currentData = {
      timestamp: this.results.timestamp,
      lighthouse: this.results.lighthouse,
      summary: {
        averagePerformance: this.calculateAveragePerformance(),
        budgetViolations: this.results.budgets.reduce((sum, b) => sum + b.violations.length, 0),
        alertCount: this.results.alerts.length
      }
    };

    await fs.writeFile(
      `./scripts/performance/performance-data-${this.results.monitoringSession}.json`,
      JSON.stringify(currentData, null, 2)
    );
  }

  calculateAveragePerformance() {
    const scores = this.results.lighthouse
      .filter(r => r.scores?.performance)
      .map(r => r.scores.performance);
    
    return scores.length > 0 ? 
      scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  }

  async cleanup() {
    console.log('🧹 Cleaning up performance monitoring...');
    
    this.isMonitoring = false;
    
    if (this.serverProcess) {
      this.serverProcess.kill();
      console.log('   ✓ Application server stopped');
    }
  }

  stopMonitoring() {
    console.log('🛑 Stopping performance monitoring...');
    this.isMonitoring = false;
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new AdvancedPerformanceMonitor();
  
  const args = process.argv.slice(2);
  const continuous = args.includes('--continuous');
  
  monitor.startPerformanceMonitoring()
    .then(report => {
      const avgPerf = monitor.calculateAveragePerformance();
      const success = avgPerf >= monitor.config.thresholds.performance && 
                     report.summary.alertsTriggered === 0;
      
      console.log(`\n🎯 Performance Monitoring Complete: ${avgPerf.toFixed(1)} average score`);
      console.log(`📊 Status: ${success ? 'PASSED' : 'FAILED'}`);
      
      if (!continuous) {
        process.exit(success ? 0 : 1);
      }
    })
    .catch(error => {
      console.error('Performance monitoring failed:', error);
      process.exit(1);
    });

  // Handle graceful shutdown for continuous monitoring
  process.on('SIGINT', () => {
    monitor.stopMonitoring();
    setTimeout(() => process.exit(0), 2000);
  });
}

module.exports = AdvancedPerformanceMonitor;