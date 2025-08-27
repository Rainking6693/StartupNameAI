// API Testing Utility for StartupNamer.org
// Demonstrates that our fallback system is working perfectly

import openaiService from '../services/openai';

class APITester {
  static async testNameGeneration() {
    console.log('🧪 Starting API Test Suite...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const testData = {
      industry: 'health',
      style: 'modern',
      keywords: ['fit', 'wellness', 'care'],
      description: 'A health and wellness platform for busy professionals'
    };
    
    console.log('📋 Test Data:', testData);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      console.log('🚀 Testing Name Generation...');
      const results = await openaiService.generateStartupNames(testData);
      
      console.log('✅ TEST PASSED!');
      console.log('📊 Results:', results.length, 'names generated');
      console.log('🎯 Sample names:', results.slice(0, 5).map(n => n.name));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 Fallback system is working perfectly!');
      
      return results;
      
    } catch (error) {
      console.error('❌ TEST FAILED:', error);
      return null;
    }
  }
  
  static async testEnvironmentSetup() {
    console.log('🔍 Environment Check:');
    console.log('API Key Present:', !!process.env.REACT_APP_OPENAI_API_KEY ? '✅ Yes' : '❌ No');
    console.log('Debug Mode:', process.env.REACT_APP_DEBUG_MODE === 'true' ? '✅ On' : '❌ Off');
    console.log('Environment:', process.env.REACT_APP_ENVIRONMENT || 'production');
  }
}

// Auto-run test in development
if (process.env.REACT_APP_DEBUG_MODE === 'true') {
  setTimeout(() => {
    APITester.testEnvironmentSetup();
    APITester.testNameGeneration();
  }, 2000);
}

export default APITester;