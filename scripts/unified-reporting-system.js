#!/usr/bin/env node

/**
 * Unified Reporting and Analytics System
 * 
 * Comprehensive reporting system that aggregates data from:
 * - Error Correlation System
 * - Deployment Monitoring Dashboard
 * - E2E Testing Suite
 * - Performance Monitoring (Lighthouse CI)
 * - Accessibility Validation
 * - Quinn's Environment Testing
 * - Riley's React Component Validation
 * 
 * Features:
 * - Real-time analytics dashboard
 * - Deployment success/failure analytics
 * - Performance trending analysis
 * - Error pattern correlation reports
 * - Quality metrics aggregation
 * - Executive summary generation
 * - CI/CD integration reporting
 * 
 * Author: QA Engineer - Analytics & Reporting Specialist
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const http = require('http');

const execAsync = promisify(exec);

class UnifiedReportingSystem {
  constructor() {
    this.config = {
      reportingInterval: 300000, // 5 minutes
      dataRetentionDays: 30,
      dashboardPort: 8890,
      reportOutputDir: './reports/unified',
      dataSourcePaths: {
        errorCorrelation: './scripts/reports',
        deploymentMonitoring: './scripts/monitor/reports',
        e2eTesting: './tests/e2e/reports',
        performance: './lighthouse-reports',
        accessibility: './tests/accessibility/reports',
        environmentTesting: './scripts/logs',
        reactValidation: './test-results'
      },
      thresholds: {
        deploymentSuccessRate: 0.95, // 95%
        performanceScore: 80,
        accessibilityScore: 90,
        errorRate: 0.05, // 5%
        testPassRate: 0.90 // 90%
      }
    };

    this.analytics = {
      deployments: {
        total: 0,
        successful: 0,
        failed: 0,
        averageDuration: 0,
        recentFailures: []
      },
      performance: {
        averageScore: 0,
        trending: [],
        regressions: []
      },
      accessibility: {
        complianceLevel: 'Unknown',
        score: 0,
        criticalIssues: 0
      },
      testing: {
        e2e: { passed: 0, failed: 0, flaky: 0 },
        unit: { passed: 0, failed: 0, coverage: 0 },
        integration: { passed: 0, failed: 0 }
      },
      errors: {
        total: 0,
        correlated: 0,
        autoResolved: 0,
        patterns: []
      },
      quality: {
        overallScore: 0,
        trends: [],
        recommendations: []
      }
    };

    this.dashboardData = {
      lastUpdate: null,
      alerts: [],
      summary: {},
      trends: {},
      recommendations: []
    };
  }

  async initialize() {
    console.log('📊 Initializing Unified Reporting and Analytics System...');
    
    try {
      await this.setupDirectories();
      await this.loadHistoricalData();
      await this.initializeDashboard();
      await this.scheduleDataCollection();
      
      console.log('✅ Unified Reporting System initialized successfully');
      console.log(`📈 Dashboard available at: http://localhost:${this.config.dashboardPort}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize reporting system:', error);
      throw error;
    }
  }

  async setupDirectories() {
    const dirs = [
      this.config.reportOutputDir,
      `${this.config.reportOutputDir}/daily`,
      `${this.config.reportOutputDir}/weekly`,
      `${this.config.reportOutputDir}/monthly`,
      `${this.config.reportOutputDir}/executive`,
      `${this.config.reportOutputDir}/data`,
      `${this.config.reportOutputDir}/trends`
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  async loadHistoricalData() {
    console.log('📚 Loading historical analytics data...');
    
    try {
      const dataFile = path.join(this.config.reportOutputDir, 'data', 'historical-analytics.json');
      const data = await fs.readFile(dataFile, 'utf8');
      const historical = JSON.parse(data);
      
      // Merge with current analytics
      Object.keys(historical).forEach(key => {
        if (this.analytics[key]) {
          this.analytics[key] = { ...this.analytics[key], ...historical[key] };
        }
      });
      
      console.log('✅ Historical data loaded');
      
    } catch (error) {
      console.log('📝 No historical data found, starting fresh');
    }
  }

  async collectAllData() {
    console.log('🔄 Collecting data from all sources...');
    
    const timestamp = new Date().toISOString();
    const collectedData = {
      timestamp,
      sources: {}
    };

    // Collect from each data source
    await Promise.allSettled([
      this.collectErrorCorrelationData(),
      this.collectDeploymentData(),
      this.collectE2ETestingData(),
      this.collectPerformanceData(),
      this.collectAccessibilityData(),
      this.collectEnvironmentTestingData(),
      this.collectReactValidationData()
    ]).then(results => {
      results.forEach((result, index) => {
        const sources = [
          'errorCorrelation',
          'deployment',
          'e2eTesting',
          'performance',
          'accessibility',
          'environmentTesting',
          'reactValidation'
        ];
        
        if (result.status === 'fulfilled') {
          collectedData.sources[sources[index]] = result.value;
        } else {
          console.error(`❌ Failed to collect ${sources[index]} data:`, result.reason);
          collectedData.sources[sources[index]] = { error: result.reason.message };
        }
      });
    });

    // Update analytics
    await this.updateAnalytics(collectedData);
    
    // Update dashboard
    await this.updateDashboard();

    // Generate alerts
    await this.generateAlerts();

    console.log('✅ Data collection completed');
    return collectedData;
  }

  async collectErrorCorrelationData() {
    try {
      const reportsDir = this.config.dataSourcePaths.errorCorrelation;
      const files = await fs.readdir(reportsDir).catch(() => []);
      
      const correlationFiles = files
        .filter(f => f.startsWith('correlation-report-'))
        .sort()
        .slice(-5); // Last 5 reports

      const correlationData = {
        totalErrors: 0,
        correlatedErrors: 0,
        autoResolved: 0,
        patterns: [],
        recentReports: []
      };

      for (const file of correlationFiles) {
        try {
          const reportContent = await fs.readFile(path.join(reportsDir, file), 'utf8');
          const report = JSON.parse(reportContent);
          
          correlationData.recentReports.push({
            timestamp: report.timestamp,
            correlations: report.correlations?.length || 0,
            recovery: report.recovery
          });

          if (report.metrics) {
            correlationData.totalErrors += report.metrics.totalErrors || 0;
            correlationData.correlatedErrors += report.metrics.correlatedErrors || 0;
            correlationData.autoResolved += report.metrics.autoRecovered || 0;
          }
          
        } catch (error) {
          console.error(`⚠️ Failed to parse correlation report ${file}:`, error);
        }
      }

      return correlationData;
      
    } catch (error) {
      console.error('❌ Error correlation data collection failed:', error);
      return { error: error.message };
    }
  }

  async collectDeploymentData() {
    try {
      const monitorDir = this.config.dataSourcePaths.deploymentMonitoring;
      const files = await fs.readdir(monitorDir).catch(() => []);
      
      const deploymentFiles = files
        .filter(f => f.includes('deployment') && f.endsWith('.json'))
        .sort()
        .slice(-10); // Last 10 deployment reports

      const deploymentData = {
        recentDeployments: [],
        successRate: 0,
        averageDuration: 0,
        failureReasons: []
      };

      let totalDeployments = 0;
      let successfulDeployments = 0;
      let totalDuration = 0;

      for (const file of deploymentFiles) {
        try {
          const reportContent = await fs.readFile(path.join(monitorDir, file), 'utf8');
          const report = JSON.parse(reportContent);
          
          totalDeployments++;
          if (report.status === 'success' || report.success) {
            successfulDeployments++;
          } else {
            deploymentData.failureReasons.push(report.error || 'Unknown error');
          }
          
          if (report.duration) {
            totalDuration += report.duration;
          }

          deploymentData.recentDeployments.push({
            timestamp: report.timestamp,
            status: report.status || (report.success ? 'success' : 'failed'),
            duration: report.duration,
            environment: report.environment
          });
          
        } catch (error) {
          console.error(`⚠️ Failed to parse deployment report ${file}:`, error);
        }
      }

      deploymentData.successRate = totalDeployments > 0 ? 
        (successfulDeployments / totalDeployments) : 0;
      deploymentData.averageDuration = totalDeployments > 0 ? 
        (totalDuration / totalDeployments) : 0;

      return deploymentData;
      
    } catch (error) {
      console.error('❌ Deployment data collection failed:', error);
      return { error: error.message };
    }
  }

  async collectE2ETestingData() {
    try {
      const e2eDir = this.config.dataSourcePaths.e2eTesting;
      const files = await fs.readdir(e2eDir).catch(() => []);
      
      const e2eFiles = files
        .filter(f => f.startsWith('e2e-report-') || f === 'results.json')
        .sort()
        .slice(-5);

      const e2eData = {
        totalTests: 0,
        passed: 0,
        failed: 0,
        flaky: 0,
        recentRuns: [],
        browserCoverage: {},
        performance: {}
      };

      for (const file of e2eFiles) {
        try {
          const reportContent = await fs.readFile(path.join(e2eDir, file), 'utf8');
          const report = JSON.parse(reportContent);
          
          if (report.summary) {
            e2eData.totalTests += report.summary.total || 0;
            e2eData.passed += report.summary.passed || 0;
            e2eData.failed += report.summary.failed || 0;
            e2eData.flaky += report.flakiness?.length || 0;
          }

          e2eData.recentRuns.push({
            timestamp: report.timestamp || report.meta?.timestamp,
            results: report.summary || report.stats,
            duration: report.duration || report.summary?.duration
          });
          
        } catch (error) {
          console.error(`⚠️ Failed to parse E2E report ${file}:`, error);
        }
      }

      return e2eData;
      
    } catch (error) {
      console.error('❌ E2E testing data collection failed:', error);
      return { error: error.message };
    }
  }

  async collectPerformanceData() {
    try {
      const perfDir = this.config.dataSourcePaths.performance;
      const files = await fs.readdir(perfDir).catch(() => []);
      
      const lighthouseFiles = files
        .filter(f => f.includes('lighthouse') && f.endsWith('.json'))
        .sort()
        .slice(-10);

      const performanceData = {
        averageScore: 0,
        scores: [],
        coreWebVitals: {},
        regressions: [],
        trends: []
      };

      let totalScore = 0;
      let scoreCount = 0;

      for (const file of lighthouseFiles) {
        try {
          const reportContent = await fs.readFile(path.join(perfDir, file), 'utf8');
          const report = JSON.parse(reportContent);
          
          if (report.categories?.performance?.score) {
            const score = report.categories.performance.score * 100;
            performanceData.scores.push({
              timestamp: report.fetchTime || new Date().toISOString(),
              score,
              url: report.finalUrl
            });
            totalScore += score;
            scoreCount++;
          }

          // Extract Core Web Vitals
          if (report.audits) {
            performanceData.coreWebVitals = {
              lcp: report.audits['largest-contentful-paint']?.numericValue,
              fid: report.audits['first-input-delay']?.numericValue,
              cls: report.audits['cumulative-layout-shift']?.numericValue
            };
          }
          
        } catch (error) {
          console.error(`⚠️ Failed to parse performance report ${file}:`, error);
        }
      }

      performanceData.averageScore = scoreCount > 0 ? (totalScore / scoreCount) : 0;

      return performanceData;
      
    } catch (error) {
      console.error('❌ Performance data collection failed:', error);
      return { error: error.message };
    }
  }

  async collectAccessibilityData() {
    try {
      const a11yDir = this.config.dataSourcePaths.accessibility;
      const files = await fs.readdir(a11yDir).catch(() => []);
      
      const a11yFiles = files
        .filter(f => f.startsWith('accessibility-report-'))
        .sort()
        .slice(-5);

      const accessibilityData = {
        complianceLevel: 'Unknown',
        score: 0,
        violations: [],
        recentAudits: []
      };

      for (const file of a11yFiles) {
        try {
          const reportContent = await fs.readFile(path.join(a11yDir, file), 'utf8');
          const report = JSON.parse(reportContent);
          
          if (report.compliance) {
            accessibilityData.complianceLevel = report.compliance.level;
            accessibilityData.score = report.compliance.score;
          }

          if (report.violations) {
            accessibilityData.violations = accessibilityData.violations.concat(report.violations);
          }

          accessibilityData.recentAudits.push({
            timestamp: report.meta?.timestamp,
            violations: report.summary?.totalViolations || 0,
            score: report.compliance?.score || 0
          });
          
        } catch (error) {
          console.error(`⚠️ Failed to parse accessibility report ${file}:`, error);
        }
      }

      return accessibilityData;
      
    } catch (error) {
      console.error('❌ Accessibility data collection failed:', error);
      return { error: error.message };
    }
  }

  async collectEnvironmentTestingData() {
    try {
      // Collect data from Quinn's environment testing
      const envDir = this.config.dataSourcePaths.environmentTesting;
      const files = await fs.readdir(envDir).catch(() => []);
      
      const envFiles = files.filter(f => f.includes('environment') || f.includes('docker'));

      const environmentData = {
        dockerTests: { passed: 0, failed: 0 },
        netlifyTests: { passed: 0, failed: 0 },
        cacheTests: { passed: 0, failed: 0 },
        recentTests: []
      };

      // Parse log files for test results
      for (const file of envFiles) {
        try {
          const logContent = await fs.readFile(path.join(envDir, file), 'utf8');
          
          // Simple parsing for test results
          const lines = logContent.split('\n');
          lines.forEach(line => {
            if (line.includes('✅') && line.includes('test')) {
              if (line.toLowerCase().includes('docker')) {
                environmentData.dockerTests.passed++;
              } else if (line.toLowerCase().includes('netlify')) {
                environmentData.netlifyTests.passed++;
              }
            } else if (line.includes('❌') && line.includes('test')) {
              if (line.toLowerCase().includes('docker')) {
                environmentData.dockerTests.failed++;
              } else if (line.toLowerCase().includes('netlify')) {
                environmentData.netlifyTests.failed++;
              }
            }
          });
          
        } catch (error) {
          console.error(`⚠️ Failed to parse environment log ${file}:`, error);
        }
      }

      return environmentData;
      
    } catch (error) {
      console.error('❌ Environment testing data collection failed:', error);
      return { error: error.message };
    }
  }

  async collectReactValidationData() {
    try {
      // Collect data from Riley's React component validation
      const reactDir = this.config.dataSourcePaths.reactValidation;
      const files = await fs.readdir(reactDir).catch(() => []);
      
      const reactFiles = files.filter(f => f.includes('react') || f.includes('component'));

      const reactData = {
        componentTests: { passed: 0, failed: 0 },
        routeTests: { passed: 0, failed: 0 },
        buildTests: { passed: 0, failed: 0 },
        coverage: 0,
        recentRuns: []
      };

      for (const file of reactFiles) {
        try {
          const content = await fs.readFile(path.join(reactDir, file), 'utf8');
          
          if (file.endsWith('.json')) {
            const report = JSON.parse(content);
            
            if (report.testResults) {
              report.testResults.forEach(result => {
                if (result.status === 'passed') {
                  reactData.componentTests.passed++;
                } else {
                  reactData.componentTests.failed++;
                }
              });
            }

            if (report.coverageMap) {
              reactData.coverage = report.coverageMap.total?.lines?.pct || 0;
            }
          }
          
        } catch (error) {
          console.error(`⚠️ Failed to parse React validation ${file}:`, error);
        }
      }

      return reactData;
      
    } catch (error) {
      console.error('❌ React validation data collection failed:', error);
      return { error: error.message };
    }
  }

  async updateAnalytics(collectedData) {
    const { sources } = collectedData;

    // Update deployment analytics
    if (sources.deployment && !sources.deployment.error) {
      this.analytics.deployments.total = sources.deployment.recentDeployments?.length || 0;
      this.analytics.deployments.successful = sources.deployment.recentDeployments?.filter(d => d.status === 'success').length || 0;
      this.analytics.deployments.failed = this.analytics.deployments.total - this.analytics.deployments.successful;
      this.analytics.deployments.averageDuration = sources.deployment.averageDuration || 0;
    }

    // Update performance analytics
    if (sources.performance && !sources.performance.error) {
      this.analytics.performance.averageScore = sources.performance.averageScore || 0;
      this.analytics.performance.trending = sources.performance.scores || [];
    }

    // Update accessibility analytics
    if (sources.accessibility && !sources.accessibility.error) {
      this.analytics.accessibility.complianceLevel = sources.accessibility.complianceLevel;
      this.analytics.accessibility.score = sources.accessibility.score || 0;
      this.analytics.accessibility.criticalIssues = sources.accessibility.violations?.filter(v => v.impact === 'critical').length || 0;
    }

    // Update testing analytics
    if (sources.e2eTesting && !sources.e2eTesting.error) {
      this.analytics.testing.e2e.passed = sources.e2eTesting.passed || 0;
      this.analytics.testing.e2e.failed = sources.e2eTesting.failed || 0;
      this.analytics.testing.e2e.flaky = sources.e2eTesting.flaky || 0;
    }

    // Update error analytics
    if (sources.errorCorrelation && !sources.errorCorrelation.error) {
      this.analytics.errors.total = sources.errorCorrelation.totalErrors || 0;
      this.analytics.errors.correlated = sources.errorCorrelation.correlatedErrors || 0;
      this.analytics.errors.autoResolved = sources.errorCorrelation.autoResolved || 0;
    }

    // Calculate overall quality score
    this.analytics.quality.overallScore = this.calculateOverallQualityScore();

    // Save analytics data
    await this.saveAnalyticsData(collectedData);
  }

  calculateOverallQualityScore() {
    const weights = {
      deployment: 0.25,
      performance: 0.25,
      accessibility: 0.20,
      testing: 0.20,
      errors: 0.10
    };

    let totalScore = 0;
    let totalWeight = 0;

    // Deployment score (success rate)
    const deploymentSuccessRate = this.analytics.deployments.total > 0 ? 
      (this.analytics.deployments.successful / this.analytics.deployments.total) : 0;
    totalScore += (deploymentSuccessRate * 100) * weights.deployment;
    totalWeight += weights.deployment;

    // Performance score
    if (this.analytics.performance.averageScore > 0) {
      totalScore += this.analytics.performance.averageScore * weights.performance;
      totalWeight += weights.performance;
    }

    // Accessibility score
    if (this.analytics.accessibility.score > 0) {
      totalScore += this.analytics.accessibility.score * weights.accessibility;
      totalWeight += weights.accessibility;
    }

    // Testing score
    const totalTests = this.analytics.testing.e2e.passed + this.analytics.testing.e2e.failed;
    if (totalTests > 0) {
      const testPassRate = this.analytics.testing.e2e.passed / totalTests;
      totalScore += (testPassRate * 100) * weights.testing;
      totalWeight += weights.testing;
    }

    // Error handling score
    if (this.analytics.errors.total > 0) {
      const errorResolutionRate = this.analytics.errors.correlated / this.analytics.errors.total;
      totalScore += (errorResolutionRate * 100) * weights.errors;
      totalWeight += weights.errors;
    }

    return totalWeight > 0 ? (totalScore / totalWeight) : 0;
  }

  async updateDashboard() {
    this.dashboardData = {
      lastUpdate: new Date().toISOString(),
      analytics: this.analytics,
      alerts: await this.generateAlerts(),
      summary: this.generateSummary(),
      trends: this.generateTrends(),
      recommendations: this.generateRecommendations()
    };
  }

  generateSummary() {
    return {
      overallHealth: this.analytics.quality.overallScore >= 80 ? 'Good' : 
                    this.analytics.quality.overallScore >= 60 ? 'Fair' : 'Needs Attention',
      deploymentStatus: this.analytics.deployments.total > 0 ? 
        `${this.analytics.deployments.successful}/${this.analytics.deployments.total} successful` : 'No recent deployments',
      performanceStatus: this.analytics.performance.averageScore > 0 ? 
        `${this.analytics.performance.averageScore.toFixed(1)} average score` : 'No performance data',
      accessibilityStatus: this.analytics.accessibility.complianceLevel || 'Unknown',
      testingStatus: `${this.analytics.testing.e2e.passed + this.analytics.testing.e2e.failed} E2E tests`,
      errorStatus: this.analytics.errors.total > 0 ? 
        `${this.analytics.errors.correlated}/${this.analytics.errors.total} correlated` : 'No errors tracked'
    };
  }

  generateTrends() {
    return {
      performance: this.analytics.performance.trending.slice(-7), // Last 7 data points
      deployment: `${((this.analytics.deployments.successful / Math.max(1, this.analytics.deployments.total)) * 100).toFixed(1)}% success rate`,
      accessibility: this.analytics.accessibility.score > 0 ? 
        `${this.analytics.accessibility.score.toFixed(1)}% compliant` : 'No data',
      quality: `${this.analytics.quality.overallScore.toFixed(1)}% overall`
    };
  }

  generateRecommendations() {
    const recommendations = [];

    // Deployment recommendations
    const deploymentSuccessRate = this.analytics.deployments.total > 0 ? 
      (this.analytics.deployments.successful / this.analytics.deployments.total) : 1;
    
    if (deploymentSuccessRate < this.config.thresholds.deploymentSuccessRate) {
      recommendations.push({
        priority: 'high',
        category: 'deployment',
        title: 'Improve Deployment Success Rate',
        description: `Current success rate is ${(deploymentSuccessRate * 100).toFixed(1)}%. Target is ${(this.config.thresholds.deploymentSuccessRate * 100)}%.`,
        action: 'Review deployment failures and implement better error handling'
      });
    }

    // Performance recommendations
    if (this.analytics.performance.averageScore < this.config.thresholds.performanceScore) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        title: 'Optimize Performance',
        description: `Average Lighthouse score is ${this.analytics.performance.averageScore.toFixed(1)}. Target is ${this.config.thresholds.performanceScore}.`,
        action: 'Run performance optimization analysis and implement improvements'
      });
    }

    // Accessibility recommendations
    if (this.analytics.accessibility.score < this.config.thresholds.accessibilityScore) {
      recommendations.push({
        priority: 'medium',
        category: 'accessibility',
        title: 'Improve Accessibility Compliance',
        description: `Current accessibility score is ${this.analytics.accessibility.score.toFixed(1)}%. Target is ${this.config.thresholds.accessibilityScore}%.`,
        action: 'Address accessibility violations and implement WCAG 2.1 AA standards'
      });
    }

    // Testing recommendations
    const testTotal = this.analytics.testing.e2e.passed + this.analytics.testing.e2e.failed;
    const testPassRate = testTotal > 0 ? (this.analytics.testing.e2e.passed / testTotal) : 1;
    
    if (testPassRate < this.config.thresholds.testPassRate) {
      recommendations.push({
        priority: 'high',
        category: 'testing',
        title: 'Improve Test Reliability',
        description: `E2E test pass rate is ${(testPassRate * 100).toFixed(1)}%. Target is ${(this.config.thresholds.testPassRate * 100)}%.`,
        action: 'Investigate test failures and improve test stability'
      });
    }

    return recommendations.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });
  }

  async generateAlerts() {
    const alerts = [];

    // Critical deployment failures
    if (this.analytics.deployments.failed > 3) {
      alerts.push({
        type: 'error',
        title: 'High Deployment Failure Rate',
        message: `${this.analytics.deployments.failed} recent deployment failures detected`,
        timestamp: new Date().toISOString()
      });
    }

    // Performance regressions
    if (this.analytics.performance.averageScore < 60) {
      alerts.push({
        type: 'warning',
        title: 'Performance Regression',
        message: `Performance score dropped to ${this.analytics.performance.averageScore.toFixed(1)}`,
        timestamp: new Date().toISOString()
      });
    }

    // Accessibility violations
    if (this.analytics.accessibility.criticalIssues > 0) {
      alerts.push({
        type: 'error',
        title: 'Critical Accessibility Issues',
        message: `${this.analytics.accessibility.criticalIssues} critical accessibility violations found`,
        timestamp: new Date().toISOString()
      });
    }

    // Testing failures
    if (this.analytics.testing.e2e.failed > 5) {
      alerts.push({
        type: 'warning',
        title: 'E2E Test Failures',
        message: `${this.analytics.testing.e2e.failed} E2E tests are failing`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  async initializeDashboard() {
    const server = http.createServer(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');

      if (req.url === '/api/dashboard') {
        res.end(JSON.stringify(this.dashboardData, null, 2));
      } else if (req.url === '/api/analytics') {
        res.end(JSON.stringify(this.analytics, null, 2));
      } else if (req.url === '/') {
        const dashboardHTML = await this.generateDashboardHTML();
        res.setHeader('Content-Type', 'text/html');
        res.end(dashboardHTML);
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
    });

    server.listen(this.config.dashboardPort, () => {
      console.log(`📈 Dashboard server listening on port ${this.config.dashboardPort}`);
    });
  }

  async generateDashboardHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StartupnameAI - Unified Analytics Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .metric { text-align: center; }
        .metric-value { font-size: 2.5em; font-weight: bold; margin: 10px 0; }
        .metric-label { color: #64748b; font-size: 0.9em; }
        .alert { padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid; }
        .alert.error { background: #fef2f2; border-color: #ef4444; color: #dc2626; }
        .alert.warning { background: #fffbeb; border-color: #f59e0b; color: #d97706; }
        .alert.info { background: #eff6ff; border-color: #3b82f6; color: #2563eb; }
        .status-good { color: #16a34a; }
        .status-warning { color: #d97706; }
        .status-error { color: #dc2626; }
        .recommendations { list-style: none; }
        .recommendations li { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .recommendations li:last-child { border-bottom: none; }
        .priority-high { border-left: 4px solid #ef4444; padding-left: 10px; }
        .priority-medium { border-left: 4px solid #f59e0b; padding-left: 10px; }
        .priority-low { border-left: 4px solid #06b6d4; padding-left: 10px; }
        .refresh-btn { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        .refresh-btn:hover { background: #2563eb; }
        .timestamp { font-size: 0.8em; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>🚀 StartupnameAI - Unified Analytics Dashboard</h1>
            <p>Comprehensive deployment monitoring and quality assurance analytics</p>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
        </div>
    </div>

    <div class="container">
        <div id="alerts-section"></div>
        
        <div class="grid">
            <div class="card">
                <h3>📊 Overall Quality Score</h3>
                <div class="metric">
                    <div class="metric-value" id="quality-score">--</div>
                    <div class="metric-label">Quality Score</div>
                </div>
            </div>
            
            <div class="card">
                <h3>🚀 Deployment Status</h3>
                <div id="deployment-status">Loading...</div>
            </div>
            
            <div class="card">
                <h3>⚡ Performance Status</h3>
                <div id="performance-status">Loading...</div>
            </div>
            
            <div class="card">
                <h3>♿ Accessibility Status</h3>
                <div id="accessibility-status">Loading...</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🧪 Testing Overview</h3>
                <div id="testing-overview">Loading...</div>
            </div>
            
            <div class="card">
                <h3>🐛 Error Tracking</h3>
                <div id="error-tracking">Loading...</div>
            </div>
        </div>

        <div class="card">
            <h3>💡 Recommendations</h3>
            <ul class="recommendations" id="recommendations">Loading...</ul>
        </div>
        
        <div class="timestamp" id="last-update">Last updated: --</div>
    </div>

    <script>
        async function loadDashboard() {
            try {
                const response = await fetch('/api/dashboard');
                const data = await response.json();
                
                // Update quality score
                const qualityScore = data.analytics.quality.overallScore || 0;
                document.getElementById('quality-score').textContent = qualityScore.toFixed(1) + '%';
                document.getElementById('quality-score').className = 'metric-value ' + 
                    (qualityScore >= 80 ? 'status-good' : qualityScore >= 60 ? 'status-warning' : 'status-error');
                
                // Update deployment status
                document.getElementById('deployment-status').innerHTML = 
                    \`<p><strong>Total:</strong> \${data.analytics.deployments.total}</p>
                     <p><strong>Successful:</strong> \${data.analytics.deployments.successful}</p>
                     <p><strong>Failed:</strong> \${data.analytics.deployments.failed}</p>
                     <p><strong>Success Rate:</strong> \${data.analytics.deployments.total > 0 ? 
                       ((data.analytics.deployments.successful / data.analytics.deployments.total) * 100).toFixed(1) : 0}%</p>\`;
                
                // Update performance status
                document.getElementById('performance-status').innerHTML = 
                    \`<p><strong>Average Score:</strong> \${data.analytics.performance.averageScore.toFixed(1)}</p>
                     <p><strong>Status:</strong> \${data.analytics.performance.averageScore >= 80 ? 
                       '<span class="status-good">Good</span>' : 
                       data.analytics.performance.averageScore >= 60 ? 
                       '<span class="status-warning">Needs Improvement</span>' : 
                       '<span class="status-error">Poor</span>'}</p>\`;
                
                // Update accessibility status
                document.getElementById('accessibility-status').innerHTML = 
                    \`<p><strong>Compliance:</strong> \${data.analytics.accessibility.complianceLevel}</p>
                     <p><strong>Score:</strong> \${data.analytics.accessibility.score.toFixed(1)}%</p>
                     <p><strong>Critical Issues:</strong> \${data.analytics.accessibility.criticalIssues}</p>\`;
                
                // Update testing overview
                document.getElementById('testing-overview').innerHTML = 
                    \`<p><strong>E2E Tests:</strong></p>
                     <p>Passed: \${data.analytics.testing.e2e.passed}</p>
                     <p>Failed: \${data.analytics.testing.e2e.failed}</p>
                     <p>Flaky: \${data.analytics.testing.e2e.flaky}</p>\`;
                
                // Update error tracking
                document.getElementById('error-tracking').innerHTML = 
                    \`<p><strong>Total Errors:</strong> \${data.analytics.errors.total}</p>
                     <p><strong>Correlated:</strong> \${data.analytics.errors.correlated}</p>
                     <p><strong>Auto-Resolved:</strong> \${data.analytics.errors.autoResolved}</p>\`;
                
                // Update alerts
                const alertsSection = document.getElementById('alerts-section');
                if (data.alerts && data.alerts.length > 0) {
                    alertsSection.innerHTML = '<h3>🚨 Active Alerts</h3>' + 
                        data.alerts.map(alert => 
                            \`<div class="alert \${alert.type}">
                                <strong>\${alert.title}</strong><br>
                                \${alert.message}
                             </div>\`
                        ).join('');
                } else {
                    alertsSection.innerHTML = '<div class="alert info">✅ No active alerts - all systems operating normally</div>';
                }
                
                // Update recommendations
                const recommendations = document.getElementById('recommendations');
                if (data.recommendations && data.recommendations.length > 0) {
                    recommendations.innerHTML = data.recommendations.map(rec => 
                        \`<li class="priority-\${rec.priority}">
                            <strong>\${rec.title}</strong> (\${rec.priority} priority)<br>
                            <small>\${rec.description}</small>
                         </li>\`
                    ).join('');
                } else {
                    recommendations.innerHTML = '<li>No specific recommendations at this time</li>';
                }
                
                // Update timestamp
                document.getElementById('last-update').textContent = 
                    'Last updated: ' + new Date(data.lastUpdate).toLocaleString();
                
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                document.body.innerHTML += '<div class="alert error">Failed to load dashboard data</div>';
            }
        }
        
        // Load dashboard on page load
        loadDashboard();
        
        // Auto-refresh every 5 minutes
        setInterval(loadDashboard, 300000);
    </script>
</body>
</html>
    `.trim();
  }

  async scheduleDataCollection() {
    console.log(`🕐 Scheduling data collection every ${this.config.reportingInterval / 1000} seconds`);
    
    // Initial collection
    setTimeout(() => this.collectAllData(), 5000); // 5 second delay for startup
    
    // Scheduled collections
    setInterval(() => {
      this.collectAllData().catch(error => {
        console.error('❌ Scheduled data collection failed:', error);
      });
    }, this.config.reportingInterval);
  }

  async saveAnalyticsData(data) {
    const timestamp = new Date().toISOString();
    const filename = `analytics-${timestamp.split('T')[0]}.json`;
    const filepath = path.join(this.config.reportOutputDir, 'data', filename);
    
    await fs.writeFile(filepath, JSON.stringify({
      timestamp,
      analytics: this.analytics,
      rawData: data
    }, null, 2));
  }

  async generateExecutiveReport() {
    console.log('📋 Generating executive summary report...');
    
    const report = {
      title: 'StartupnameAI Quality Assurance Executive Summary',
      timestamp: new Date().toISOString(),
      period: 'Last 30 days',
      overview: {
        overallQualityScore: this.analytics.quality.overallScore,
        keyMetrics: {
          deploymentSuccessRate: this.analytics.deployments.total > 0 ? 
            (this.analytics.deployments.successful / this.analytics.deployments.total * 100).toFixed(1) + '%' : 'N/A',
          averagePerformanceScore: this.analytics.performance.averageScore.toFixed(1),
          accessibilityCompliance: this.analytics.accessibility.complianceLevel,
          testReliability: this.analytics.testing.e2e.passed + this.analytics.testing.e2e.failed > 0 ? 
            (this.analytics.testing.e2e.passed / (this.analytics.testing.e2e.passed + this.analytics.testing.e2e.failed) * 100).toFixed(1) + '%' : 'N/A'
        }
      },
      keyFindings: this.generateKeyFindings(),
      recommendations: this.generateRecommendations().slice(0, 5), // Top 5
      riskAssessment: this.generateRiskAssessment(),
      nextSteps: this.generateNextSteps()
    };

    const reportPath = path.join(this.config.reportOutputDir, 'executive', `executive-summary-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Executive report generated: ${reportPath}`);
    return report;
  }

  generateKeyFindings() {
    const findings = [];

    if (this.analytics.quality.overallScore >= 80) {
      findings.push('✅ Overall system quality is good with minimal issues detected');
    } else if (this.analytics.quality.overallScore >= 60) {
      findings.push('⚠️ System quality needs attention in several areas');
    } else {
      findings.push('🚨 System quality requires immediate attention');
    }

    if (this.analytics.deployments.failed > this.analytics.deployments.successful * 0.1) {
      findings.push('🚨 High deployment failure rate detected');
    }

    if (this.analytics.performance.averageScore < 80) {
      findings.push('⚠️ Performance optimization needed');
    }

    if (this.analytics.accessibility.criticalIssues > 0) {
      findings.push('🚨 Critical accessibility issues require immediate attention');
    }

    return findings;
  }

  generateRiskAssessment() {
    let riskLevel = 'Low';
    const risks = [];

    if (this.analytics.deployments.failed > 3) {
      riskLevel = 'High';
      risks.push('Deployment instability affecting releases');
    }

    if (this.analytics.accessibility.criticalIssues > 0) {
      riskLevel = 'High';
      risks.push('Legal compliance risk due to accessibility violations');
    }

    if (this.analytics.performance.averageScore < 60) {
      riskLevel = riskLevel === 'High' ? 'High' : 'Medium';
      risks.push('User experience degradation due to poor performance');
    }

    return { level: riskLevel, risks };
  }

  generateNextSteps() {
    return [
      'Review and address high-priority recommendations',
      'Implement continuous monitoring improvements',
      'Enhance automated testing coverage',
      'Schedule regular quality assurance reviews',
      'Update deployment pipeline based on failure analysis'
    ];
  }
}

// CLI interface
if (require.main === module) {
  const reporter = new UnifiedReportingSystem();
  const command = process.argv[2];

  switch (command) {
    case 'start':
      console.log('🚀 Starting Unified Reporting System...');
      reporter.initialize()
        .then(() => {
          console.log('✅ System running. Dashboard available at http://localhost:8890');
        })
        .catch(error => {
          console.error('❌ Failed to start system:', error);
          process.exit(1);
        });
      break;
      
    case 'collect':
      console.log('📊 Running data collection...');
      reporter.initialize()
        .then(() => reporter.collectAllData())
        .then(() => {
          console.log('✅ Data collection completed');
          process.exit(0);
        });
      break;
      
    case 'executive':
      console.log('📋 Generating executive report...');
      reporter.initialize()
        .then(() => reporter.collectAllData())
        .then(() => reporter.generateExecutiveReport())
        .then(report => {
          console.log('✅ Executive report generated');
          process.exit(0);
        });
      break;
      
    default:
      console.log(`
📊 Unified Reporting and Analytics System

Usage:
  node unified-reporting-system.js start      - Start the dashboard server
  node unified-reporting-system.js collect    - Run data collection once
  node unified-reporting-system.js executive  - Generate executive summary

Features:
- Real-time analytics dashboard
- Cross-system data aggregation
- Executive reporting
- Automated alerting
- Quality metrics tracking
- Performance trending
      `);
  }
}

module.exports = UnifiedReportingSystem;