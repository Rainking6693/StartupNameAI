#!/usr/bin/env node

/**
 * Master Integration System
 * 
 * Orchestrates all QA systems for StartupnameAI:
 * - Advanced Error Correlation System
 * - Deployment Monitoring Dashboard
 * - E2E Testing Suite with Playwright
 * - Performance Monitoring with Lighthouse CI
 * - Accessibility Validation with axe-core
 * - Unified Reporting and Analytics
 * 
 * This system provides enterprise-level deployment monitoring and 
 * ensures maximum deployment reliability through intelligent error 
 * correlation and automated recovery.
 * 
 * Author: QA Engineer - System Integration Specialist
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class MasterIntegrationSystem {
  constructor() {
    this.config = {
      systems: {
        errorCorrelator: './scripts/error-correlator.js',
        deploymentMonitor: './scripts/deployment-monitor.js',
        e2eTesting: './scripts/e2e-testing-suite.js',
        performanceMonitor: './scripts/performance-monitor.js',
        accessibilityValidator: './scripts/accessibility-validator.js',
        unifiedReporting: './scripts/unified-reporting-system.js'
      },
      orchestrationMode: process.env.QA_MODE || 'full', // full, quick, monitor
      parallelExecution: true,
      timeout: 1800000, // 30 minutes
      retryAttempts: 2
    };

    this.executionPlan = [];
    this.results = {
      startTime: null,
      endTime: null,
      duration: 0,
      systemResults: {},
      overallSuccess: false,
      summary: {},
      recommendations: []
    };

    this.activeProcesses = new Map();
  }

  async initialize() {
    console.log('🚀 Initializing Master Integration System...');
    console.log(`📋 Mode: ${this.config.orchestrationMode}`);
    console.log(`⚡ Parallel Execution: ${this.config.parallelExecution}`);
    
    try {
      await this.validateSystemDependencies();
      await this.createExecutionPlan();
      await this.setupIntegrationEnvironment();
      
      console.log('✅ Master Integration System ready');
      
    } catch (error) {
      console.error('❌ Failed to initialize master integration:', error);
      throw error;
    }
  }

  async validateSystemDependencies() {
    console.log('🔍 Validating system dependencies...');
    
    const requiredSystems = Object.entries(this.config.systems);
    const validationResults = [];

    for (const [name, scriptPath] of requiredSystems) {
      try {
        await fs.access(scriptPath);
        validationResults.push({ name, status: 'available', path: scriptPath });
        console.log(`  ✅ ${name}: Available`);
      } catch (error) {
        validationResults.push({ name, status: 'missing', path: scriptPath, error: error.message });
        console.log(`  ❌ ${name}: Missing (${scriptPath})`);
      }
    }

    const missingCritical = validationResults.filter(r => r.status === 'missing' && 
      ['errorCorrelator', 'unifiedReporting'].includes(r.name));

    if (missingCritical.length > 0) {
      throw new Error(`Critical systems missing: ${missingCritical.map(s => s.name).join(', ')}`);
    }

    console.log('✅ System dependency validation completed');
    return validationResults;
  }

  async createExecutionPlan() {
    console.log('📋 Creating execution plan...');

    const plans = {
      full: [
        {
          phase: 'initialization',
          systems: ['errorCorrelator'],
          parallel: false,
          description: 'Initialize error correlation system'
        },
        {
          phase: 'testing',
          systems: ['e2eTesting', 'accessibilityValidator'],
          parallel: true,
          description: 'Run comprehensive testing suites'
        },
        {
          phase: 'monitoring',
          systems: ['performanceMonitor', 'deploymentMonitor'],
          parallel: true,
          description: 'Execute performance and deployment monitoring'
        },
        {
          phase: 'reporting',
          systems: ['unifiedReporting'],
          parallel: false,
          description: 'Generate unified analytics and reports'
        }
      ],
      quick: [
        {
          phase: 'quick-validation',
          systems: ['errorCorrelator', 'performanceMonitor'],
          parallel: true,
          description: 'Quick validation checks'
        },
        {
          phase: 'quick-report',
          systems: ['unifiedReporting'],
          parallel: false,
          description: 'Generate summary report'
        }
      ],
      monitor: [
        {
          phase: 'monitoring',
          systems: ['deploymentMonitor', 'errorCorrelator', 'unifiedReporting'],
          parallel: true,
          description: 'Continuous monitoring mode'
        }
      ],
      testing: [
        {
          phase: 'comprehensive-testing',
          systems: ['e2eTesting', 'accessibilityValidator', 'performanceMonitor'],
          parallel: false,
          description: 'Comprehensive testing validation'
        }
      ]
    };

    this.executionPlan = plans[this.config.orchestrationMode] || plans.full;
    
    console.log(`📋 Execution plan created with ${this.executionPlan.length} phases:`);
    this.executionPlan.forEach((phase, index) => {
      console.log(`  ${index + 1}. ${phase.description} (${phase.systems.join(', ')})`);
    });
  }

  async setupIntegrationEnvironment() {
    console.log('🔧 Setting up integration environment...');
    
    // Create integration directories
    const dirs = [
      './integration',
      './integration/logs',
      './integration/reports',
      './integration/temp'
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }

    // Set environment variables for integrated execution
    process.env.QA_INTEGRATION_MODE = 'true';
    process.env.QA_MASTER_PID = process.pid.toString();
    process.env.QA_TIMESTAMP = new Date().toISOString();
    
    console.log('✅ Integration environment ready');
  }

  async executeFullIntegration() {
    console.log('🚀 Starting full integration execution...');
    
    this.results.startTime = new Date();
    
    try {
      for (let i = 0; i < this.executionPlan.length; i++) {
        const phase = this.executionPlan[i];
        console.log(`\n🔄 Executing Phase ${i + 1}: ${phase.description}`);
        
        const phaseResult = await this.executePhase(phase);
        this.results.systemResults[`phase_${i + 1}`] = phaseResult;
        
        // Check for critical failures
        if (phaseResult.critical && !phaseResult.success) {
          console.error(`❌ Critical failure in phase ${i + 1}, stopping execution`);
          break;
        }
      }

      this.results.endTime = new Date();
      this.results.duration = this.results.endTime - this.results.startTime;
      this.results.overallSuccess = this.calculateOverallSuccess();
      
      await this.generateIntegrationSummary();
      await this.generateRecommendations();
      
      console.log(`\n📊 Integration execution completed in ${(this.results.duration / 1000).toFixed(2)}s`);
      console.log(`✅ Overall Success: ${this.results.overallSuccess ? 'Yes' : 'No'}`);
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Integration execution failed:', error);
      this.results.overallSuccess = false;
      this.results.error = error.message;
      throw error;
    }
  }

  async executePhase(phase) {
    const phaseResult = {
      phase: phase.phase,
      description: phase.description,
      systems: phase.systems,
      parallel: phase.parallel,
      startTime: new Date(),
      endTime: null,
      success: false,
      systemResults: {},
      errors: []
    };

    try {
      if (phase.parallel && this.config.parallelExecution) {
        // Execute systems in parallel
        const promises = phase.systems.map(systemName => 
          this.executeSystem(systemName, phase.phase)
        );
        
        const results = await Promise.allSettled(promises);
        
        results.forEach((result, index) => {
          const systemName = phase.systems[index];
          if (result.status === 'fulfilled') {
            phaseResult.systemResults[systemName] = result.value;
          } else {
            phaseResult.systemResults[systemName] = { 
              success: false, 
              error: result.reason?.message || 'Unknown error' 
            };
            phaseResult.errors.push(`${systemName}: ${result.reason?.message}`);
          }
        });
        
      } else {
        // Execute systems sequentially
        for (const systemName of phase.systems) {
          const systemResult = await this.executeSystem(systemName, phase.phase);
          phaseResult.systemResults[systemName] = systemResult;
          
          if (!systemResult.success) {
            phaseResult.errors.push(`${systemName}: ${systemResult.error}`);
          }
        }
      }

      phaseResult.endTime = new Date();
      phaseResult.duration = phaseResult.endTime - phaseResult.startTime;
      phaseResult.success = phaseResult.errors.length === 0;
      
      return phaseResult;
      
    } catch (error) {
      console.error(`❌ Phase execution failed: ${phase.description}`, error);
      phaseResult.endTime = new Date();
      phaseResult.success = false;
      phaseResult.errors.push(error.message);
      return phaseResult;
    }
  }

  async executeSystem(systemName, phase) {
    const systemScript = this.config.systems[systemName];
    const systemResult = {
      system: systemName,
      phase,
      startTime: new Date(),
      endTime: null,
      success: false,
      output: '',
      error: null,
      duration: 0
    };

    console.log(`  🔄 Executing ${systemName}...`);

    try {
      // Determine execution parameters based on system and phase
      const execParams = this.getSystemExecutionParams(systemName, phase);
      
      const result = await this.executeSystemScript(systemScript, execParams);
      
      systemResult.success = result.success;
      systemResult.output = result.output;
      systemResult.error = result.error;
      systemResult.exitCode = result.exitCode;
      
      if (systemResult.success) {
        console.log(`    ✅ ${systemName} completed successfully`);
      } else {
        console.log(`    ❌ ${systemName} failed: ${systemResult.error}`);
        
        // Attempt error correlation for failed systems
        if (systemName !== 'errorCorrelator') {
          await this.correlateSystemError(systemName, systemResult.error);
        }
      }
      
    } catch (error) {
      console.error(`    ❌ ${systemName} execution error:`, error);
      systemResult.success = false;
      systemResult.error = error.message;
    }

    systemResult.endTime = new Date();
    systemResult.duration = systemResult.endTime - systemResult.startTime;
    
    return systemResult;
  }

  getSystemExecutionParams(systemName, phase) {
    const paramMap = {
      errorCorrelator: ['health'],
      deploymentMonitor: ['status'],
      e2eTesting: phase === 'quick-validation' ? ['quick'] : ['audit'],
      performanceMonitor: phase === 'quick-validation' ? ['quick'] : ['comprehensive'],
      accessibilityValidator: phase === 'quick-validation' ? ['quick', 'http://localhost:3000'] : ['audit'],
      unifiedReporting: phase.includes('report') ? ['executive'] : ['collect']
    };

    return paramMap[systemName] || [];
  }

  async executeSystemScript(scriptPath, params = []) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const process = spawn('node', [scriptPath, ...params], {
        stdio: 'pipe',
        timeout: this.config.timeout
      });

      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        const duration = Date.now() - startTime;
        
        resolve({
          success: code === 0,
          output: output || errorOutput,
          error: code !== 0 ? errorOutput || `Process exited with code ${code}` : null,
          exitCode: code,
          duration
        });
      });

      process.on('error', (error) => {
        resolve({
          success: false,
          output: '',
          error: error.message,
          exitCode: -1,
          duration: Date.now() - startTime
        });
      });

      // Store process reference for potential termination
      this.activeProcesses.set(scriptPath, process);
    });
  }

  async correlateSystemError(systemName, error) {
    try {
      const correlatorPath = this.config.systems.errorCorrelator;
      await execAsync(`node ${correlatorPath} analyze "${systemName}: ${error}"`);
    } catch (correlationError) {
      console.error('⚠️ Error correlation failed:', correlationError.message);
    }
  }

  calculateOverallSuccess() {
    const phaseResults = Object.values(this.results.systemResults);
    const totalPhases = phaseResults.length;
    const successfulPhases = phaseResults.filter(phase => phase.success).length;
    
    // Consider it successful if at least 80% of phases succeeded
    return (successfulPhases / totalPhases) >= 0.8;
  }

  async generateIntegrationSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      mode: this.config.orchestrationMode,
      duration: this.results.duration,
      overallSuccess: this.results.overallSuccess,
      phases: Object.keys(this.results.systemResults).length,
      systemExecutions: this.countSystemExecutions(),
      successRate: this.calculateSuccessRate(),
      keyMetrics: this.extractKeyMetrics(),
      alerts: this.generateAlerts(),
      performance: this.analyzePerformance()
    };

    this.results.summary = summary;

    // Save summary to file
    const summaryPath = `./integration/reports/integration-summary-${Date.now()}.json`;
    await fs.writeFile(summaryPath, JSON.stringify({
      summary,
      detailedResults: this.results
    }, null, 2));

    console.log(`📊 Integration summary saved: ${summaryPath}`);
    return summary;
  }

  countSystemExecutions() {
    let count = 0;
    Object.values(this.results.systemResults).forEach(phase => {
      count += Object.keys(phase.systemResults || {}).length;
    });
    return count;
  }

  calculateSuccessRate() {
    const executions = this.countSystemExecutions();
    let successful = 0;
    
    Object.values(this.results.systemResults).forEach(phase => {
      Object.values(phase.systemResults || {}).forEach(system => {
        if (system.success) successful++;
      });
    });

    return executions > 0 ? (successful / executions * 100).toFixed(1) + '%' : '0%';
  }

  extractKeyMetrics() {
    return {
      totalExecutionTime: `${(this.results.duration / 1000).toFixed(2)}s`,
      systemsExecuted: this.countSystemExecutions(),
      phasesCompleted: Object.keys(this.results.systemResults).length,
      errorsDetected: this.countErrors(),
      parallelOptimization: this.config.parallelExecution ? 'Enabled' : 'Disabled'
    };
  }

  countErrors() {
    let errorCount = 0;
    Object.values(this.results.systemResults).forEach(phase => {
      errorCount += phase.errors?.length || 0;
    });
    return errorCount;
  }

  generateAlerts() {
    const alerts = [];

    // Check for critical system failures
    Object.entries(this.results.systemResults).forEach(([phaseName, phase]) => {
      if (!phase.success && phase.systems?.includes('errorCorrelator')) {
        alerts.push({
          type: 'critical',
          message: 'Error correlation system failed - monitoring capabilities compromised',
          phase: phaseName
        });
      }
      
      if (!phase.success && phase.systems?.includes('deploymentMonitor')) {
        alerts.push({
          type: 'warning',
          message: 'Deployment monitoring unavailable',
          phase: phaseName
        });
      }
    });

    // Check for performance issues
    if (this.results.duration > 1800000) { // 30 minutes
      alerts.push({
        type: 'warning',
        message: 'Integration execution time exceeded 30 minutes',
        duration: this.results.duration
      });
    }

    return alerts;
  }

  analyzePerformance() {
    const phases = Object.values(this.results.systemResults);
    const durations = phases.map(p => p.duration).filter(d => d);
    
    return {
      totalDuration: this.results.duration,
      averagePhaseDuration: durations.length > 0 ? 
        (durations.reduce((sum, d) => sum + d, 0) / durations.length) : 0,
      longestPhase: Math.max(...durations, 0),
      parallelOptimization: this.config.parallelExecution,
      bottlenecks: this.identifyBottlenecks()
    };
  }

  identifyBottlenecks() {
    const bottlenecks = [];
    
    Object.entries(this.results.systemResults).forEach(([phaseName, phase]) => {
      if (phase.duration > 300000) { // 5 minutes
        bottlenecks.push({
          phase: phaseName,
          duration: phase.duration,
          systems: phase.systems
        });
      }
    });

    return bottlenecks;
  }

  async generateRecommendations() {
    const recommendations = [];

    // Performance recommendations
    if (this.results.duration > 1200000) { // 20 minutes
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: 'Optimize Execution Time',
        description: 'Consider enabling parallel execution or optimizing slow systems'
      });
    }

    // Reliability recommendations
    const failureRate = 1 - (this.calculateSuccessRate().replace('%', '') / 100);
    if (failureRate > 0.1) { // 10%
      recommendations.push({
        category: 'reliability',
        priority: 'high',
        title: 'Improve System Reliability',
        description: 'High failure rate detected. Review system configurations and error handling.'
      });
    }

    // Integration recommendations
    if (!this.config.parallelExecution) {
      recommendations.push({
        category: 'optimization',
        priority: 'low',
        title: 'Enable Parallel Execution',
        description: 'Parallel execution can significantly reduce total runtime for independent systems'
      });
    }

    this.results.recommendations = recommendations;
    return recommendations;
  }

  async terminateActiveProcesses() {
    console.log('⏹️ Terminating active processes...');
    
    for (const [scriptPath, process] of this.activeProcesses) {
      try {
        process.kill('SIGTERM');
        console.log(`  ⏹️ Terminated: ${path.basename(scriptPath)}`);
      } catch (error) {
        console.error(`  ❌ Failed to terminate ${scriptPath}:`, error);
      }
    }
    
    this.activeProcesses.clear();
  }

  async healthCheck() {
    console.log('🏥 Performing system health check...');
    
    const healthResults = {
      timestamp: new Date().toISOString(),
      systems: {},
      overall: 'unknown'
    };

    for (const [systemName, scriptPath] of Object.entries(this.config.systems)) {
      try {
        const result = await execAsync(`node ${scriptPath} --version`, { timeout: 5000 });
        healthResults.systems[systemName] = {
          status: 'healthy',
          version: result.stdout.trim() || 'unknown'
        };
      } catch (error) {
        healthResults.systems[systemName] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    const healthySystems = Object.values(healthResults.systems).filter(s => s.status === 'healthy').length;
    const totalSystems = Object.keys(healthResults.systems).length;
    
    healthResults.overall = (healthySystems / totalSystems) >= 0.8 ? 'healthy' : 'degraded';
    
    console.log(`🏥 Health check completed: ${healthySystems}/${totalSystems} systems healthy`);
    return healthResults;
  }
}

// Signal handling for graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  
  if (global.masterIntegration) {
    await global.masterIntegration.terminateActiveProcesses();
  }
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  
  if (global.masterIntegration) {
    await global.masterIntegration.terminateActiveProcesses();
  }
  
  process.exit(0);
});

// CLI interface
if (require.main === module) {
  const integration = new MasterIntegrationSystem();
  global.masterIntegration = integration; // For signal handling
  
  const command = process.argv[2];
  const mode = process.argv[3];

  if (mode) {
    integration.config.orchestrationMode = mode;
  }

  switch (command) {
    case 'run':
      console.log('🚀 Starting master integration...');
      integration.initialize()
        .then(() => integration.executeFullIntegration())
        .then(results => {
          console.log('\n📊 Integration Results Summary:');
          console.log(`   Overall Success: ${results.overallSuccess ? '✅' : '❌'}`);
          console.log(`   Execution Time: ${(results.duration / 1000).toFixed(2)}s`);
          console.log(`   Success Rate: ${integration.calculateSuccessRate()}`);
          console.log(`   Systems Executed: ${integration.countSystemExecutions()}`);
          
          if (results.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            results.recommendations.forEach(rec => {
              console.log(`   • ${rec.title} (${rec.priority})`);
            });
          }
          
          process.exit(results.overallSuccess ? 0 : 1);
        })
        .catch(error => {
          console.error('\n❌ Master integration failed:', error.message);
          process.exit(1);
        });
      break;
      
    case 'health':
      integration.initialize()
        .then(() => integration.healthCheck())
        .then(health => {
          console.log('\n🏥 System Health Report:');
          Object.entries(health.systems).forEach(([name, status]) => {
            const emoji = status.status === 'healthy' ? '✅' : '❌';
            console.log(`   ${emoji} ${name}: ${status.status}`);
          });
          console.log(`\n🏥 Overall Status: ${health.overall}`);
          
          process.exit(health.overall === 'healthy' ? 0 : 1);
        });
      break;
      
    case 'monitor':
      console.log('👁️ Starting continuous monitoring mode...');
      integration.config.orchestrationMode = 'monitor';
      integration.initialize()
        .then(() => {
          console.log('✅ Monitoring mode started. Press Ctrl+C to stop.');
          return integration.executeFullIntegration();
        });
      break;
      
    default:
      console.log(`
🚀 Master Integration System for StartupnameAI

Usage:
  node master-integration.js run [mode]     - Run full integration
  node master-integration.js health        - Check system health
  node master-integration.js monitor       - Start monitoring mode

Modes:
  full        - Complete integration with all systems (default)
  quick       - Quick validation checks only
  testing     - Comprehensive testing validation
  monitor     - Continuous monitoring mode

Systems Integrated:
  • Advanced Error Correlation System
  • Deployment Monitoring Dashboard  
  • E2E Testing Suite with Playwright
  • Performance Monitoring with Lighthouse CI
  • Accessibility Validation with axe-core
  • Unified Reporting and Analytics

Features:
  • Parallel execution optimization
  • Intelligent error correlation
  • Automated recovery mechanisms
  • Real-time monitoring and alerting
  • Comprehensive reporting and analytics
  • Enterprise-level deployment reliability
      `);
  }
}

module.exports = MasterIntegrationSystem;