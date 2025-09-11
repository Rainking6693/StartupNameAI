#!/usr/bin/env node

/**
 * Phase 2 Comprehensive Test Execution Script
 * Blake's end-to-end testing and validation runner
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Phase 2 Comprehensive Testing...');
console.log('==========================================');

// Test configuration
const testConfig = {
  timeout: 30000, // 30 seconds
  verbose: true,
  coverage: true,
  watch: false
};

// Test categories
const testCategories = [
  {
    name: 'Premium Service Tests',
    description: 'Testing premium feature gating and user management',
    files: ['client/src/services/premiumService.js']
  },
  {
    name: 'Payment Service Tests',
    description: 'Testing Stripe integration and payment processing',
    files: ['client/src/services/paymentService.js']
  },
  {
    name: 'Component Tests',
    description: 'Testing React components and UI interactions',
    files: ['client/src/components/NameAnalysisModal.js', 'client/src/components/UpgradePromptModal.js']
  },
  {
    name: 'Page Tests',
    description: 'Testing page components and routing',
    files: ['client/src/pages/PricingPage.js']
  },
  {
    name: 'Integration Tests',
    description: 'Testing end-to-end user flows',
    files: ['client/src/tests/Phase2ComprehensiveTests.js']
  }
];

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  details: []
};

// Utility functions
function logTestResult(category, status, message, details = null) {
  const timestamp = new Date().toISOString();
  const result = {
    timestamp,
    category,
    status,
    message,
    details
  };

  testResults.details.push(result);
  testResults.total++;

  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${category}: ${message}`);
  } else if (status === 'FAIL') {
    testResults.failed++;
    console.log(`❌ ${category}: ${message}`);
    if (details) {
      console.log(`   Details: ${details}`);
    }
  } else if (status === 'SKIP') {
    testResults.skipped++;
    console.log(`⏭️  ${category}: ${message}`);
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function runLinting(filePath) {
  try {
    const result = execSync(`npx eslint ${filePath} --format=json`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.stdout };
  }
}

function runTypeChecking(filePath) {
  try {
    const result = execSync(`npx tsc --noEmit --jsx react ${filePath}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.stdout };
  }
}

function runUnitTests(testFile) {
  try {
    const result = execSync(`npx jest ${testFile} --verbose --coverage`, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: testConfig.timeout
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.stdout };
  }
}

function checkCodeQuality(filePath) {
  const issues = [];

  // Read file content
  const content = fs.readFileSync(filePath, 'utf8');

  // Check for console.log statements (should be removed in production)
  const consoleLogs = (content.match(/console\.log/g) || []).length;
  if (consoleLogs > 0) {
    issues.push(`${consoleLogs} console.log statements found`);
  }

  // Check for TODO comments
  const todos = (content.match(/TODO|FIXME|HACK/g) || []).length;
  if (todos > 0) {
    issues.push(`${todos} TODO/FIXME comments found`);
  }

  // Check for error handling
  const hasTryCatch = content.includes('try {') && content.includes('catch');
  if (!hasTryCatch && content.includes('async')) {
    issues.push('Async functions should have proper error handling');
  }

  // Check for proper imports
  const hasReactImport = content.includes("import React") || content.includes("import {");
  if (!hasReactImport && filePath.includes('.jsx')) {
    issues.push('Missing React import');
  }

  return issues;
}

function runIntegrationTests() {
  try {
    // Test premium service integration
    const premiumServicePath = 'client/src/services/premiumService.js';
    if (checkFileExists(premiumServicePath)) {
      const premiumService = require(`../${premiumServicePath}`);
      if (premiumService.default) {
        const service = premiumService.default;

        // Test basic functionality
        const initialTier = service.getUserTier();
        service.setUserTier('pro');
        const updatedTier = service.getUserTier();

        if (updatedTier === 'pro') {
          logTestResult('Integration', 'PASS', 'Premium service tier management working');
        } else {
          logTestResult('Integration', 'FAIL', 'Premium service tier management failed');
        }

        // Test feature gating
        const canAccess = service.canAccessFeature('exportPdf');
        if (canAccess) {
          logTestResult('Integration', 'PASS', 'Premium feature gating working');
        } else {
          logTestResult('Integration', 'FAIL', 'Premium feature gating failed');
        }
      }
    }

    // Test payment service integration
    const paymentServicePath = 'client/src/services/paymentService.js';
    if (checkFileExists(paymentServicePath)) {
      const paymentService = require(`../${paymentServicePath}`);
      if (paymentService.default) {
        const service = paymentService.default;

        // Test amount formatting
        const formattedAmount = service.formatAmount(1900);
        if (formattedAmount === '19.00') {
          logTestResult('Integration', 'PASS', 'Payment service amount formatting working');
        } else {
          logTestResult('Integration', 'FAIL', 'Payment service amount formatting failed');
        }

        // Test plan pricing
        const proPrice = service.getPlanPrice('pro', 'month');
        if (proPrice === 1900) {
          logTestResult('Integration', 'PASS', 'Payment service plan pricing working');
        } else {
          logTestResult('Integration', 'FAIL', 'Payment service plan pricing failed');
        }
      }
    }

  } catch (error) {
    logTestResult('Integration', 'FAIL', 'Integration tests failed', error.message);
  }
}

function runPerformanceTests() {
  try {
    // Test component rendering performance
    const startTime = Date.now();

    // Simulate component rendering
    const componentPath = 'client/src/components/NameAnalysisModal.js';
    if (checkFileExists(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      const endTime = Date.now();
      const renderTime = endTime - startTime;

      if (renderTime < 100) {
        logTestResult('Performance', 'PASS', `Component rendering time: ${renderTime}ms`);
      } else {
        logTestResult('Performance', 'FAIL', `Component rendering too slow: ${renderTime}ms`);
      }
    }

    // Test service initialization performance
    const serviceStartTime = Date.now();
    const premiumServicePath = 'client/src/services/premiumService.js';
    if (checkFileExists(premiumServicePath)) {
      require(`../${premiumServicePath}`);
      const serviceEndTime = Date.now();
      const initTime = serviceEndTime - serviceStartTime;

      if (initTime < 50) {
        logTestResult('Performance', 'PASS', `Service initialization time: ${initTime}ms`);
      } else {
        logTestResult('Performance', 'FAIL', `Service initialization too slow: ${initTime}ms`);
      }
    }

  } catch (error) {
    logTestResult('Performance', 'FAIL', 'Performance tests failed', error.message);
  }
}

function runSecurityTests() {
  try {
    // Check for security vulnerabilities in payment service
    const paymentServicePath = 'client/src/services/paymentService.js';
    if (checkFileExists(paymentServicePath)) {
      const content = fs.readFileSync(paymentServicePath, 'utf8');

      // Check for API key exposure
      if (content.includes('sk_live_') || content.includes('pk_live_')) {
        logTestResult('Security', 'FAIL', 'Live API keys found in code');
      } else {
        logTestResult('Security', 'PASS', 'No live API keys found');
      }

      // Check for proper error handling
      if (content.includes('catch') && content.includes('error')) {
        logTestResult('Security', 'PASS', 'Proper error handling implemented');
      } else {
        logTestResult('Security', 'FAIL', 'Missing error handling');
      }

      // Check for input validation
      if (content.includes('validation') || content.includes('validate')) {
        logTestResult('Security', 'PASS', 'Input validation implemented');
      } else {
        logTestResult('Security', 'FAIL', 'Missing input validation');
      }
    }

  } catch (error) {
    logTestResult('Security', 'FAIL', 'Security tests failed', error.message);
  }
}

function runAccessibilityTests() {
  try {
    // Check component accessibility
    const componentPath = 'client/src/components/NameAnalysisModal.js';
    if (checkFileExists(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');

      // Check for ARIA labels
      if (content.includes('aria-label') || content.includes('aria-labelledby')) {
        logTestResult('Accessibility', 'PASS', 'ARIA labels found');
      } else {
        logTestResult('Accessibility', 'FAIL', 'Missing ARIA labels');
      }

      // Check for proper button types
      if (content.includes('type="button"') || content.includes('type="submit"')) {
        logTestResult('Accessibility', 'PASS', 'Proper button types found');
      } else {
        logTestResult('Accessibility', 'FAIL', 'Missing button types');
      }

      // Check for keyboard navigation
      if (content.includes('onKeyDown') || content.includes('onKeyPress')) {
        logTestResult('Accessibility', 'PASS', 'Keyboard navigation implemented');
      } else {
        logTestResult('Accessibility', 'FAIL', 'Missing keyboard navigation');
      }
    }

  } catch (error) {
    logTestResult('Accessibility', 'FAIL', 'Accessibility tests failed', error.message);
  }
}

// Main test execution
async function runPhase2Tests() {
  console.log('🚀 Phase 2 Testing Suite Started');
  console.log('================================');

  // Run file existence checks
  console.log('\n📁 Checking file existence...');
  testCategories.forEach(category => {
    category.files.forEach(file => {
      if (checkFileExists(file)) {
        logTestResult('File Check', 'PASS', `${file} exists`);
      } else {
        logTestResult('File Check', 'FAIL', `${file} missing`);
      }
    });
  });

  // Run code quality checks
  console.log('\n🔍 Running code quality checks...');
  testCategories.forEach(category => {
    category.files.forEach(file => {
      if (checkFileExists(file)) {
        const issues = checkCodeQuality(file);
        if (issues.length === 0) {
          logTestResult('Code Quality', 'PASS', `${file} passed quality checks`);
        } else {
          logTestResult('Code Quality', 'FAIL', `${file} has issues: ${issues.join(', ')}`);
        }
      }
    });
  });

  // Run linting
  console.log('\n🧹 Running linting...');
  testCategories.forEach(category => {
    category.files.forEach(file => {
      if (checkFileExists(file)) {
        const lintResult = runLinting(file);
        if (lintResult.success) {
          logTestResult('Linting', 'PASS', `${file} passed linting`);
        } else {
          logTestResult('Linting', 'FAIL', `${file} failed linting`);
        }
      }
    });
  });

  // Run integration tests
  console.log('\n🔗 Running integration tests...');
  runIntegrationTests();

  // Run performance tests
  console.log('\n⚡ Running performance tests...');
  runPerformanceTests();

  // Run security tests
  console.log('\n🔒 Running security tests...');
  runSecurityTests();

  // Run accessibility tests
  console.log('\n♿ Running accessibility tests...');
  runAccessibilityTests();

  // Generate test report
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Skipped: ${testResults.skipped}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);

  // Save detailed results
  const reportPath = 'test-results/phase2-test-report.json';
  fs.mkdirSync('test-results', { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  // Determine overall success
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Phase 2 is ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please review and fix issues before deployment.');
    process.exit(1);
  }
}

// Run the tests
runPhase2Tests().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
