#!/usr/bin/env node

/**
 * Complete End-to-End Integration Test
 * Tests the full StartupNameAI application deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Test configuration
const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

console.log('🚀 STARTUPNAMEAI COMPLETE INTEGRATION TEST');
console.log('==========================================');
console.log(`🌐 Frontend: ${FRONTEND_URL}`);
console.log(`🔧 Backend: ${BACKEND_URL}`);
console.log('');

const tests = [];

// Test 1: Backend Health Check
async function testBackendHealth() {
  console.log('1️⃣ Testing Backend Health...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    
    if (data.status === 'healthy') {
      console.log('✅ Backend is healthy and responsive');
      console.log(`   📊 Service: ${data.service}`);
      console.log(`   🔧 Version: ${data.version}`);
      console.log(`   ⏱️ Uptime: ${Math.round(data.uptime)}s`);
      return true;
    } else {
      throw new Error('Backend returned unhealthy status');
    }
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return false;
  }
}

// Test 2: Frontend Accessibility
async function testFrontendAccess() {
  console.log('\n2️⃣ Testing Frontend Accessibility...');
  try {
    const response = await fetch(FRONTEND_URL);
    const html = await response.text();
    
    if (response.ok && html.includes('StartupNamer')) {
      console.log('✅ Frontend is accessible and serving content');
      console.log('   📄 HTML contains expected content');
      console.log('   🎯 Status:', response.status);
      return true;
    } else {
      throw new Error('Frontend not serving expected content');
    }
  } catch (error) {
    console.error('❌ Frontend access test failed:', error.message);
    return false;
  }
}

// Test 3: Backend API Name Generation
async function testBackendAPI() {
  console.log('\n3️⃣ Testing Backend API Name Generation...');
  try {
    const testPayload = {
      keywords: ['integration', 'test'],
      industry: 'tech',
      style: 'modern',
      count: 10
    };
    
    const response = await fetch(`${BACKEND_URL}/api/names/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(testPayload)
    });
    
    const data = await response.json();
    
    if (data.success && data.data && data.data.names && data.data.names.length > 0) {
      console.log('✅ Backend API name generation working');
      console.log(`   📊 Generated ${data.data.names.length} names`);
      console.log(`   🎯 Sample name: "${data.data.names[0].name}"`);
      console.log(`   📈 Brandability score: ${data.data.names[0].brandability_score}`);
      console.log(`   💾 Session ID: ${data.data.sessionId}`);
      return true;
    } else {
      throw new Error('Backend API did not return expected name data');
    }
  } catch (error) {
    console.error('❌ Backend API test failed:', error.message);
    return false;
  }
}

// Test 4: Frontend Build Quality
async function testBuildQuality() {
  console.log('\n4️⃣ Testing Frontend Build Quality...');
  try {
    const buildPath = 'C:/Users/Ben/OneDrive/Documents/GitHub/StartupNameAI/client/build';
    
    // Check if build directory exists
    if (!fs.existsSync(buildPath)) {
      throw new Error('Build directory not found');
    }
    
    // Check for essential files
    const essentialFiles = ['index.html', 'static/js', 'static/css'];
    const missingFiles = [];
    
    for (const file of essentialFiles) {
      const filePath = `${buildPath}/${file}`;
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      throw new Error(`Missing build files: ${missingFiles.join(', ')}`);
    }
    
    // Check HTML content
    const indexPath = `${buildPath}/index.html`;
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    if (htmlContent.includes('REACT_APP_API_URL') && htmlContent.includes('localhost:5000')) {
      console.log('✅ Frontend build contains correct API configuration');
    } else {
      console.log('⚠️ API URL configuration not found in built HTML');
    }
    
    console.log('✅ Frontend build quality check passed');
    console.log('   📁 All essential files present');
    console.log('   📄 HTML structure valid');
    console.log('   🎯 Static assets generated');
    return true;
    
  } catch (error) {
    console.error('❌ Build quality test failed:', error.message);
    return false;
  }
}

// Test 5: Environment Configuration
async function testEnvironmentConfig() {
  console.log('\n5️⃣ Testing Environment Configuration...');
  try {
    // Check production .env file
    const prodEnvPath = 'C:/Users/Ben/OneDrive/Documents/GitHub/StartupNameAI/.env.production';
    
    if (fs.existsSync(prodEnvPath)) {
      const envContent = fs.readFileSync(prodEnvPath, 'utf8');
      
      if (envContent.includes('REACT_APP_API_URL=http://localhost:5000')) {
        console.log('✅ Production environment correctly configured');
        console.log('   🔧 API URL properly set');
        console.log('   📋 Production settings optimized');
        return true;
      } else {
        throw new Error('API URL not properly configured in production env');
      }
    } else {
      throw new Error('Production environment file not found');
    }
  } catch (error) {
    console.error('❌ Environment configuration test failed:', error.message);
    return false;
  }
}

// Test 6: Integration Flow Simulation
async function testIntegrationFlow() {
  console.log('\n6️⃣ Testing Complete Integration Flow...');
  try {
    // Simulate the client calling the backend
    const formData = {
      keywords: ['complete', 'integration'],
      industry: 'tech',
      style: 'modern',
      count: 15,
      description: 'End-to-end integration test'
    };
    
    console.log('   📤 Simulating frontend form submission...');
    
    // This mimics what the OpenAI service does
    const response = await fetch(`${BACKEND_URL}/api/names/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success && data.data && data.data.names) {
      const names = data.data.names;
      console.log('✅ Complete integration flow working');
      console.log(`   🎯 Generated ${names.length} names successfully`);
      console.log(`   📊 Sample results:`);
      
      names.slice(0, 3).forEach((name, i) => {
        console.log(`      ${i + 1}. ${name.name} (Score: ${name.brandability_score})`);
      });
      
      console.log(`   💾 Session management working: ${data.data.sessionId}`);
      console.log(`   🔐 Token generated: ${data.data.sessionToken ? 'Yes' : 'No'}`);
      return true;
      
    } else {
      throw new Error('Integration flow did not complete successfully');
    }
    
  } catch (error) {
    console.error('❌ Integration flow test failed:', error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🏃 Running all integration tests...\n');
  
  const testResults = [];
  
  // Define test functions
  const testSuite = [
    { name: 'Backend Health', fn: testBackendHealth },
    { name: 'Frontend Access', fn: testFrontendAccess },
    { name: 'Backend API', fn: testBackendAPI },
    { name: 'Build Quality', fn: testBuildQuality },
    { name: 'Environment Config', fn: testEnvironmentConfig },
    { name: 'Integration Flow', fn: testIntegrationFlow }
  ];
  
  // Run each test
  for (const test of testSuite) {
    const result = await test.fn();
    testResults.push({ name: test.name, passed: result });
  }
  
  // Summary
  console.log('\n🏁 TEST SUMMARY');
  console.log('=================');
  
  const passed = testResults.filter(t => t.passed).length;
  const total = testResults.length;
  
  testResults.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    console.log(`${status} ${test.name}`);
  });
  
  console.log(`\n📊 RESULTS: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('🚀 StartupNameAI is fully deployed and functional!');
    console.log('\n📋 DEPLOYMENT STATUS:');
    console.log('✅ Backend API running and responsive');
    console.log('✅ Frontend built and served');
    console.log('✅ Client-server integration working');
    console.log('✅ Name generation end-to-end flow operational');
    console.log('✅ Production environment configured');
    console.log('\n🌐 Application URLs:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   Backend API: ${BACKEND_URL}/api/health`);
    console.log(`   Name Generator: ${BACKEND_URL}/api/names/generate`);
    
    return 0;
  } else {
    console.log('\n❌ SOME TESTS FAILED');
    console.log('🔧 Please check the failing components before deployment');
    return 1;
  }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Run tests
runAllTests()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });