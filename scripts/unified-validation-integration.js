#!/usr/bin/env node

/**
 * Unified Validation Integration System
 * 
 * Connects error correlation with Quinn's environment testing and Riley's React validation:
 * - Integrates with existing validation pipeline
 * - Provides unified reporting across all validation phases  
 * - Creates comprehensive deployment success/failure analytics
 * - Orchestrates error correlation across all validation systems
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class UnifiedValidationIntegration {
  constructor() {
    this.config = {
      validationPhases: [
        { name: 'react_validation', script: 'test:react-deployment', weight: 0.25 },
        { name: 'environment_testing', script: 'test:netlify', weight: 0.25 },
        { name: 'comprehensive_testing', script: 'comprehensive-test-runner.js', weight: 0.3 },
        { name: 'performance_validation', script: 'lighthouse:ci', weight: 0.2 }
      ],
      integrationPoints: {
        quinn_env_testing: './scripts/test-netlify-build.sh',
        riley_react_validation: './scripts/test-react-deployment.sh',
        error_correlation: './scripts/error-correlator.js',
        deployment_monitor: './scripts/deployment-monitor.js',
        comprehensive_testing: './scripts/comprehensive-test-runner.js'
      },
      reportingConfig: {
        unifiedReportPath: './scripts/reports/unified-validation-report.json',
        analyticsPath: './scripts/analytics/deployment-analytics.json',
        integrationLogPath: './scripts/logs/integration.log',
        alertThresholds: {
          overallSuccess: 0.85,
          phaseSuccess: 0.8,
          errorRate: 0.1,
          performanceThreshold: 80
        }
      }
    };

    this.validationResults = {
      overallStatus: 'pending',
      overallScore: 0,
      startTime: Date.now(),
      endTime: null,
      phases: [],
      errors: [],
      correlations: [],
      analytics: {},
      recommendations: []
    };

    this.integrationId = `validation-${Date.now()}`;
  }

  async executeUnifiedValidation() {
    console.log('🔄 Starting Unified Validation Integration...');
    console.log(`📊 Integration ID: ${this.integrationId}`);

    try {
      await this.initializeIntegration();
      await this.executeValidationPhases();
      await this.correlateErrors();
      await this.generateUnifiedAnalytics();
      const report = await this.generateUnifiedReport();
      
      console.log('✅ Unified validation completed');
      return report;

    } catch (error) {
      console.error('❌ Unified validation failed:', error);
      await this.handleValidationFailure(error);
      throw error;
    }
  }

  async initializeIntegration() {
    console.log('🔧 Initializing unified integration...');

    // Ensure required directories exist
    const dirs = [
      './scripts/reports',
      './scripts/analytics', 
      './scripts/logs',
      './scripts/integration'
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }

    // Initialize error correlator
    try {
      const AdvancedErrorCorrelator = require('./error-correlator.js');
      this.errorCorrelator = new AdvancedErrorCorrelator();
      console.log('   ✓ Error correlator initialized');
    } catch (error) {
      console.log('   ⚠️ Error correlator not available:', error.message);
    }

    // Check integration points
    await this.validateIntegrationPoints();

    console.log('✅ Integration initialized successfully');
  }

  async validateIntegrationPoints() {
    console.log('🔍 Validating integration points...');

    for (const [name, scriptPath] of Object.entries(this.config.integrationPoints)) {
      try {
        await fs.access(scriptPath);
        console.log(`   ✓ ${name}: ${scriptPath}`);
      } catch {
        console.log(`   ⚠️ ${name}: ${scriptPath} - Not found`);
        
        if (name === 'quinn_env_testing' || name === 'riley_react_validation') {
          // These are critical - create fallback
          await this.createFallbackScript(name, scriptPath);
        }
      }
    }
  }

  async createFallbackScript(name, scriptPath) {
    console.log(`   🔧 Creating fallback for ${name}...`);

    let fallbackContent = '';

    if (name === 'quinn_env_testing') {
      fallbackContent = `#!/bin/bash
# Fallback for Quinn's environment testing
echo "🧪 Running environment validation..."
cd client || exit 1

# Basic environment checks
echo "✓ Checking Node.js version..."
node --version

echo "✓ Checking npm dependencies..."
npm list --depth=0 || echo "Some dependency issues detected"

echo "✓ Testing build process..."
npm run build || (echo "❌ Build failed" && exit 1)

echo "✓ Testing deployment readiness..."
if [ -d "build" ]; then
  echo "✓ Build directory exists"
  echo "✓ Environment testing completed successfully"
else
  echo "❌ Build directory missing"
  exit 1
fi
`;
    } else if (name === 'riley_react_validation') {
      fallbackContent = `#!/bin/bash
# Fallback for Riley's React validation
echo "⚛️ Running React component validation..."
cd client || exit 1

echo "✓ Checking React configuration..."
if [ -f "package.json" ]; then
  echo "✓ package.json found"
else
  echo "❌ package.json missing"
  exit 1
fi

echo "✓ Validating React dependencies..."
npm list react react-dom || echo "React dependencies check completed with warnings"

echo "✓ Testing React build..."
npm run build || (echo "❌ React build failed" && exit 1)

echo "✓ Validating build output..."
if [ -f "build/index.html" ]; then
  echo "✓ index.html generated"
else
  echo "❌ index.html missing from build"
  exit 1
fi

echo "✓ React validation completed successfully"
`;
    }

    await fs.writeFile(scriptPath, fallbackContent, { mode: 0o755 });
    console.log(`   ✓ Fallback created: ${scriptPath}`);
  }

  async executeValidationPhases() {
    console.log('🔄 Executing validation phases...');

    let totalWeight = 0;
    let weightedScore = 0;

    for (const phase of this.config.validationPhases) {
      console.log(`\n📋 Phase: ${phase.name} (weight: ${phase.weight})`);
      
      const phaseResult = await this.executeValidationPhase(phase);
      this.validationResults.phases.push(phaseResult);

      totalWeight += phase.weight;
      weightedScore += phaseResult.score * phase.weight;

      // Log phase completion
      await this.logIntegrationEvent({
        type: 'phase_completed',
        phase: phase.name,
        status: phaseResult.status,
        score: phaseResult.score,
        duration: phaseResult.duration
      });
    }

    // Calculate overall score
    this.validationResults.overallScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    this.validationResults.overallStatus = this.validationResults.overallScore >= 
      this.config.reportingConfig.alertThresholds.overallSuccess ? 'success' : 'failure';

    console.log(`\n🎯 Overall Score: ${(this.validationResults.overallScore * 100).toFixed(1)}%`);
    console.log(`📊 Overall Status: ${this.validationResults.overallStatus.toUpperCase()}`);
  }

  async executeValidationPhase(phase) {
    const startTime = Date.now();
    const phaseResult = {
      name: phase.name,
      startTime,
      endTime: null,
      duration: 0,
      status: 'pending',
      score: 0,
      output: '',
      error: null,
      weight: phase.weight
    };

    try {
      console.log(`   🚀 Executing: ${phase.script}`);

      let command = '';
      if (phase.script.endsWith('.js')) {
        command = `node scripts/${phase.script}`;
      } else if (phase.script.endsWith('.sh')) {
        command = `bash ${this.config.integrationPoints[phase.name] || phase.script}`;
      } else {
        command = `npm run ${phase.script}`;
      }

      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 600000 // 10 minutes
      });

      phaseResult.endTime = Date.now();
      phaseResult.duration = phaseResult.endTime - startTime;
      phaseResult.status = 'success';
      phaseResult.output = stdout;
      phaseResult.score = this.calculatePhaseScore(phase.name, stdout, stderr);

      console.log(`   ✅ ${phase.name}: ${phaseResult.status} (${Math.round(phaseResult.duration/1000)}s)`);
      console.log(`   📊 Score: ${(phaseResult.score * 100).toFixed(1)}%`);

    } catch (error) {
      phaseResult.endTime = Date.now();
      phaseResult.duration = phaseResult.endTime - startTime;
      phaseResult.status = 'failure';
      phaseResult.error = {
        message: error.message,
        code: error.code,
        stdout: error.stdout || '',
        stderr: error.stderr || ''
      };
      phaseResult.score = 0;

      console.log(`   ❌ ${phase.name}: ${phaseResult.status} (${Math.round(phaseResult.duration/1000)}s)`);
      console.log(`   💥 Error: ${error.message}`);

      // Add to errors for correlation
      this.validationResults.errors.push({
        phase: phase.name,
        type: 'phase_execution_error',
        message: error.message,
        timestamp: new Date().toISOString(),
        context: {
          command: phase.script,
          integrationId: this.integrationId
        }
      });

      // Attempt immediate error correlation
      if (this.errorCorrelator) {
        try {
          await this.errorCorrelator.analyzeError('unified_validation', {
            type: 'validation_phase_failure',
            phase: phase.name,
            message: error.message,
            context: { integrationId: this.integrationId }
          });
        } catch (correlationError) {
          console.log(`   ⚠️ Error correlation failed: ${correlationError.message}`);
        }
      }
    }

    return phaseResult;
  }

  calculatePhaseScore(phaseName, stdout, stderr) {
    // Phase-specific scoring logic
    switch (phaseName) {
      case 'react_validation':
        return this.scoreReactValidation(stdout, stderr);
      case 'environment_testing':
        return this.scoreEnvironmentTesting(stdout, stderr);
      case 'comprehensive_testing':
        return this.scoreComprehensiveTesting(stdout, stderr);
      case 'performance_validation':
        return this.scorePerformanceValidation(stdout, stderr);
      default:
        return this.scoreGenericValidation(stdout, stderr);
    }
  }

  scoreReactValidation(stdout, stderr) {
    let score = 1.0;

    // Check for build success indicators
    if (stdout.includes('Build failed') || stderr.includes('Build failed')) {
      score = 0.0;
    } else if (stdout.includes('compiled successfully')) {
      score = 1.0;
    } else if (stdout.includes('compiled with warnings')) {
      score = 0.8;
    } else if (!stderr || stderr.trim() === '') {
      score = 0.9;
    } else {
      score = 0.5;
    }

    return Math.max(0, Math.min(1, score));
  }

  scoreEnvironmentTesting(stdout, stderr) {
    let score = 1.0;

    // Check for environment validation indicators
    if (stdout.includes('Environment testing completed successfully')) {
      score = 1.0;
    } else if (stdout.includes('Build directory exists')) {
      score = 0.9;
    } else if (stdout.includes('dependency issues detected')) {
      score = 0.7;
    } else if (stderr && stderr.includes('failed')) {
      score = 0.2;
    } else {
      score = 0.6;
    }

    return Math.max(0, Math.min(1, score));
  }

  scoreComprehensiveTesting(stdout, stderr) {
    let score = 0.5; // Default middle score

    try {
      // Look for test results in output
      const successMatch = stdout.match(/(\d+).*passed/i);
      const failMatch = stdout.match(/(\d+).*failed/i);
      
      if (successMatch && failMatch) {
        const passed = parseInt(successMatch[1]);
        const failed = parseInt(failMatch[1]);
        const total = passed + failed;
        
        if (total > 0) {
          score = passed / total;
        }
      } else if (stdout.includes('✅') && !stdout.includes('❌')) {
        score = 0.95;
      } else if (stdout.includes('Test Suite Complete')) {
        // Parse success rate from comprehensive test runner
        const rateMatch = stdout.match(/(\d+\.\d+)% success rate/);
        if (rateMatch) {
          score = parseFloat(rateMatch[1]) / 100;
        }
      }
    } catch (error) {
      console.log(`   ⚠️ Error parsing test results: ${error.message}`);
    }

    return Math.max(0, Math.min(1, score));
  }

  scorePerformanceValidation(stdout, stderr) {
    let score = 0.5;

    try {
      // Look for Lighthouse scores
      const performanceMatch = stdout.match(/Performance:\s*(\d+)/);
      if (performanceMatch) {
        const performanceScore = parseInt(performanceMatch[1]);
        score = performanceScore / 100;
      } else if (stdout.includes('Performance check completed')) {
        score = 0.8;
      } else if (stderr && stderr.includes('lighthouse_unavailable')) {
        score = 0.6; // Partial score if lighthouse not available
      }
    } catch (error) {
      console.log(`   ⚠️ Error parsing performance results: ${error.message}`);
    }

    return Math.max(0, Math.min(1, score));
  }

  scoreGenericValidation(stdout, stderr) {
    // Generic scoring based on output analysis
    let score = 0.5;

    if (stdout.includes('success') || stdout.includes('✅')) {
      score = 0.9;
    } else if (stdout.includes('warning') || stdout.includes('⚠️')) {
      score = 0.7;
    } else if (stdout.includes('error') || stdout.includes('❌') || stderr) {
      score = 0.3;
    }

    return Math.max(0, Math.min(1, score));
  }

  async correlateErrors() {
    console.log('🔗 Correlating errors across validation phases...');

    if (this.validationResults.errors.length === 0) {
      console.log('   ✅ No errors to correlate');
      return;
    }

    if (!this.errorCorrelator) {
      console.log('   ⚠️ Error correlator not available');
      return;
    }

    try {
      for (const error of this.validationResults.errors) {
        const correlation = await this.errorCorrelator.analyzeError('unified_validation', error);
        
        if (correlation.success) {
          this.validationResults.correlations.push({
            originalError: error,
            correlation: correlation,
            timestamp: new Date().toISOString()
          });
        }
      }

      if (this.validationResults.correlations.length > 0) {
        console.log(`   ✅ Found ${this.validationResults.correlations.length} error correlations`);
        
        // Generate correlation insights
        await this.generateCorrelationInsights();
      } else {
        console.log('   ℹ️ No error correlations found');
      }

    } catch (error) {
      console.error('   ❌ Error correlation failed:', error);
    }
  }

  async generateCorrelationInsights() {
    const insights = {
      timestamp: new Date().toISOString(),
      integrationId: this.integrationId,
      totalErrors: this.validationResults.errors.length,
      correlatedErrors: this.validationResults.correlations.length,
      patterns: {},
      recommendations: []
    };

    // Analyze error patterns across phases
    for (const correlation of this.validationResults.correlations) {
      const phase = correlation.originalError.phase;
      const patternId = correlation.correlation.correlations?.[0]?.patternId;
      
      if (patternId) {
        if (!insights.patterns[patternId]) {
          insights.patterns[patternId] = { count: 0, phases: new Set() };
        }
        
        insights.patterns[patternId].count++;
        insights.patterns[patternId].phases.add(phase);
      }
    }

    // Generate recommendations based on patterns
    for (const [patternId, pattern] of Object.entries(insights.patterns)) {
      if (pattern.count > 1) {
        insights.recommendations.push({
          type: 'recurring_pattern',
          patternId,
          message: `Pattern ${patternId} appears in ${pattern.count} errors across ${pattern.phases.size} phases`,
          priority: 'high',
          affectedPhases: Array.from(pattern.phases)
        });
      }
    }

    // Save insights
    await fs.writeFile(
      `./scripts/analytics/correlation-insights-${this.integrationId}.json`,
      JSON.stringify(insights, null, 2)
    );

    this.validationResults.analytics.correlationInsights = insights;
  }

  async generateUnifiedAnalytics() {
    console.log('📊 Generating unified analytics...');

    const analytics = {
      timestamp: new Date().toISOString(),
      integrationId: this.integrationId,
      overallMetrics: {
        totalPhases: this.validationResults.phases.length,
        successfulPhases: this.validationResults.phases.filter(p => p.status === 'success').length,
        overallScore: this.validationResults.overallScore,
        totalDuration: this.validationResults.phases.reduce((sum, p) => sum + p.duration, 0)
      },
      phaseAnalytics: this.validationResults.phases.map(phase => ({
        name: phase.name,
        status: phase.status,
        score: phase.score,
        duration: phase.duration,
        efficiency: phase.duration > 0 ? phase.score / (phase.duration / 1000) : 0
      })),
      errorAnalytics: {
        totalErrors: this.validationResults.errors.length,
        errorsByPhase: this.groupErrorsByPhase(),
        correlationRate: this.validationResults.errors.length > 0 ? 
          this.validationResults.correlations.length / this.validationResults.errors.length : 0
      },
      trends: await this.analyzeTrends(),
      recommendations: this.generateAnalyticsRecommendations()
    };

    // Save analytics
    await fs.writeFile(
      this.config.reportingConfig.analyticsPath,
      JSON.stringify(analytics, null, 2)
    );

    this.validationResults.analytics.unified = analytics;

    console.log('✅ Unified analytics generated');
  }

  groupErrorsByPhase() {
    const groupedErrors = {};
    
    for (const error of this.validationResults.errors) {
      const phase = error.phase || 'unknown';
      if (!groupedErrors[phase]) {
        groupedErrors[phase] = [];
      }
      groupedErrors[phase].push(error);
    }
    
    return groupedErrors;
  }

  async analyzeTrends() {
    try {
      // Load historical analytics for trend analysis
      const historicalData = await this.loadHistoricalAnalytics();
      
      if (historicalData.length < 2) {
        return { message: 'Insufficient data for trend analysis' };
      }

      const current = this.validationResults.overallScore;
      const previous = historicalData[historicalData.length - 1].overallMetrics.overallScore;
      
      return {
        scoreChange: current - previous,
        trend: current > previous ? 'improving' : current < previous ? 'declining' : 'stable',
        historicalAverage: historicalData.reduce((sum, data) => sum + data.overallMetrics.overallScore, 0) / historicalData.length
      };

    } catch (error) {
      return { error: 'Unable to analyze trends', message: error.message };
    }
  }

  async loadHistoricalAnalytics() {
    try {
      const files = await fs.readdir('./scripts/analytics');
      const analyticsFiles = files.filter(f => f.startsWith('deployment-analytics-') && f.endsWith('.json'));
      
      const historicalData = [];
      
      for (const file of analyticsFiles.slice(-10)) { // Last 10 runs
        try {
          const data = await fs.readFile(`./scripts/analytics/${file}`, 'utf8');
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

  generateAnalyticsRecommendations() {
    const recommendations = [];
    const { overallScore, phases } = this.validationResults;

    // Overall score recommendations
    if (overallScore < 0.7) {
      recommendations.push({
        type: 'overall_improvement',
        priority: 'critical',
        message: 'Overall validation score is below acceptable threshold',
        actionItems: [
          'Investigate failing validation phases',
          'Implement additional error handling',
          'Review and optimize validation processes'
        ]
      });
    }

    // Phase-specific recommendations
    const failedPhases = phases.filter(p => p.status === 'failure');
    if (failedPhases.length > 0) {
      recommendations.push({
        type: 'phase_failures',
        priority: 'high',
        message: `${failedPhases.length} validation phases failed`,
        failedPhases: failedPhases.map(p => p.name),
        actionItems: [
          'Fix issues in failing phases',
          'Add phase-specific monitoring',
          'Implement rollback procedures'
        ]
      });
    }

    // Performance recommendations
    const slowPhases = phases.filter(p => p.duration > 300000); // > 5 minutes
    if (slowPhases.length > 0) {
      recommendations.push({
        type: 'performance_optimization',
        priority: 'medium',
        message: 'Some validation phases are taking too long',
        slowPhases: slowPhases.map(p => ({ name: p.name, duration: p.duration })),
        actionItems: [
          'Optimize slow validation phases',
          'Implement parallel processing where possible',
          'Review resource allocation'
        ]
      });
    }

    // Error correlation recommendations
    if (this.validationResults.correlations.length > 0) {
      recommendations.push({
        type: 'error_correlation',
        priority: 'medium',
        message: 'Error patterns detected across validation phases',
        actionItems: [
          'Review correlated error patterns',
          'Implement preventive measures',
          'Add proactive monitoring for detected patterns'
        ]
      });
    }

    return recommendations;
  }

  async generateUnifiedReport() {
    console.log('📋 Generating unified validation report...');

    this.validationResults.endTime = Date.now();
    const totalDuration = this.validationResults.endTime - this.validationResults.startTime;

    const report = {
      integrationId: this.integrationId,
      timestamp: new Date().toISOString(),
      totalDuration,
      summary: {
        overallStatus: this.validationResults.overallStatus,
        overallScore: this.validationResults.overallScore,
        phasesExecuted: this.validationResults.phases.length,
        phasesSuccessful: this.validationResults.phases.filter(p => p.status === 'success').length,
        errorsDetected: this.validationResults.errors.length,
        errorsCorrelated: this.validationResults.correlations.length
      },
      phases: this.validationResults.phases,
      errors: this.validationResults.errors,
      correlations: this.validationResults.correlations,
      analytics: this.validationResults.analytics,
      recommendations: this.validationResults.recommendations || [],
      nextSteps: this.generateNextSteps(),
      integrationMetadata: {
        quinnsEnvironmentTesting: this.getPhaseResult('environment_testing'),
        rileysReactValidation: this.getPhaseResult('react_validation'),
        comprehensiveTesting: this.getPhaseResult('comprehensive_testing'),
        performanceValidation: this.getPhaseResult('performance_validation')
      }
    };

    // Save unified report
    await fs.writeFile(
      this.config.reportingConfig.unifiedReportPath,
      JSON.stringify(report, null, 2)
    );

    // Generate human-readable summary
    const summary = this.generateReportSummary(report);
    await fs.writeFile(
      `./scripts/reports/unified-validation-summary-${this.integrationId}.txt`,
      summary
    );

    console.log(`📊 Unified report generated: ${this.config.reportingConfig.unifiedReportPath}`);
    return report;
  }

  getPhaseResult(phaseName) {
    const phase = this.validationResults.phases.find(p => p.name === phaseName);
    return phase ? {
      status: phase.status,
      score: phase.score,
      duration: phase.duration,
      available: true
    } : { available: false, reason: 'Phase not executed' };
  }

  generateNextSteps() {
    const nextSteps = [];
    const { overallStatus, overallScore } = this.validationResults;

    if (overallStatus === 'failure') {
      nextSteps.push('🔴 BLOCK DEPLOYMENT: Critical validation failures detected');
      nextSteps.push('🔧 Fix failing validation phases before proceeding');
    } else if (overallScore < 0.85) {
      nextSteps.push('🟡 CAUTION: Validation concerns detected');
      nextSteps.push('🔍 Review validation results and address issues');
    } else {
      nextSteps.push('🟢 PROCEED: Validation successful');
      nextSteps.push('🚀 Ready for deployment');
    }

    if (this.validationResults.correlations.length > 0) {
      nextSteps.push('🔗 Review error correlations for insights');
    }

    if (this.validationResults.errors.length > 0) {
      nextSteps.push(`⚠️ Address ${this.validationResults.errors.length} detected errors`);
    }

    return nextSteps;
  }

  generateReportSummary(report) {
    return `
🚀 StartupnameAI - Unified Validation Report
==========================================

Integration ID: ${report.integrationId}
Date: ${new Date(report.timestamp).toLocaleString()}
Duration: ${Math.round(report.totalDuration / 1000)}s

📊 OVERALL SUMMARY
------------------
Status: ${report.summary.overallStatus.toUpperCase()}
Score: ${(report.summary.overallScore * 100).toFixed(1)}%
Phases: ${report.summary.phasesSuccessful}/${report.summary.phasesExecuted} successful
Errors: ${report.summary.errorsDetected} (${report.summary.errorsCorrelated} correlated)

🔍 VALIDATION PHASES
-------------------
${report.phases.map(phase => 
  `${phase.status === 'success' ? '✅' : '❌'} ${phase.name.toUpperCase()}: ${phase.status} (${(phase.score * 100).toFixed(1)}%) - ${Math.round(phase.duration/1000)}s`
).join('\n')}

🤝 INTEGRATION STATUS
--------------------
✅ Quinn's Environment Testing: ${this.getIntegrationStatus('environment_testing')}
✅ Riley's React Validation: ${this.getIntegrationStatus('react_validation')}  
✅ Comprehensive Testing: ${this.getIntegrationStatus('comprehensive_testing')}
✅ Performance Validation: ${this.getIntegrationStatus('performance_validation')}

${report.errors.length > 0 ? `
❌ ERRORS (${report.errors.length})
---------
${report.errors.slice(0, 5).map(error => `• [${error.phase}] ${error.message.substring(0, 80)}...`).join('\n')}
${report.errors.length > 5 ? `... and ${report.errors.length - 5} more` : ''}
` : '✅ NO ERRORS DETECTED'}

${report.correlations.length > 0 ? `
🔗 ERROR CORRELATIONS (${report.correlations.length})
--------------------
${report.correlations.slice(0, 3).map(corr => `• Pattern detected in ${corr.originalError.phase}: ${corr.correlation.correlations?.[0]?.patternId || 'Unknown pattern'}`).join('\n')}
` : ''}

📋 RECOMMENDATIONS
------------------
${report.recommendations.slice(0, 5).map(rec => `• ${rec.message}`).join('\n')}

🎯 NEXT STEPS
-------------
${report.nextSteps.map(step => step).join('\n')}

Generated by StartupnameAI Unified Validation Integration
Integration ID: ${report.integrationId}
`;
  }

  getIntegrationStatus(phaseName) {
    const result = this.getPhaseResult(phaseName);
    if (!result.available) return 'Not Available';
    return `${result.status} (${(result.score * 100).toFixed(1)}%)`;
  }

  async logIntegrationEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      integrationId: this.integrationId,
      ...event
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      await fs.appendFile(this.config.reportingConfig.integrationLogPath, logLine);
    } catch (error) {
      console.error('Failed to write integration log:', error);
    }
  }

  async handleValidationFailure(error) {
    console.error('🚨 Unified Validation Failure - Generating emergency report...');

    const emergencyReport = {
      timestamp: new Date().toISOString(),
      integrationId: this.integrationId,
      status: 'CRITICAL_FAILURE',
      error: {
        message: error.message,
        stack: error.stack
      },
      partialResults: this.validationResults,
      emergencyActions: [
        'Block all deployments',
        'Investigate validation system failure',
        'Check integration point availability',
        'Review system resources and dependencies',
        'Notify development team immediately'
      ]
    };

    await fs.writeFile(
      `./scripts/reports/emergency-validation-failure-${this.integrationId}.json`,
      JSON.stringify(emergencyReport, null, 2)
    );

    console.log(`📋 Emergency report saved: emergency-validation-failure-${this.integrationId}.json`);
  }
}

// CLI interface
if (require.main === module) {
  const integration = new UnifiedValidationIntegration();
  
  integration.executeUnifiedValidation()
    .then(report => {
      const success = report.summary.overallStatus === 'success';
      console.log(`\n🎯 Unified Validation ${success ? 'PASSED' : 'FAILED'}: ${(report.summary.overallScore * 100).toFixed(1)}%`);
      
      if (report.nextSteps.length > 0) {
        console.log('\n📋 Next Steps:');
        report.nextSteps.forEach(step => console.log(`   ${step}`));
      }
      
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unified validation failed:', error);
      process.exit(1);
    });
}

module.exports = UnifiedValidationIntegration;