// Performance Testing Suite for StartupNamer.org Backend
// Tests API endpoints, database performance, and system load

const axios = require('axios');
const { performance } = require('perf_hooks');

class PerformanceTestSuite {
  constructor() {
    this.baseURL = process.env.API_URL || 'https://startupnamer-backend.railway.app';
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {}
    };
    
    console.log('🧪 Performance Testing Suite initialized');
    console.log('🎯 Target API:', this.baseURL);
  }

  // Test API endpoint response times
  async testAPIPerformance() {
    console.log('⚡ Testing API Performance...');
    
    const endpoints = [
      { name: 'Health Check', path: '/api/health', method: 'GET' },
      { name: 'Name Generation', path: '/api/names/generate', method: 'POST', 
        data: { keywords: ['test'], industry: 'tech', style: 'modern', count: 10 } },
      { name: 'Domain Check', path: '/api/domains/check', method: 'POST',
        data: { name: 'testname' } }
    ];

    for (const endpoint of endpoints) {
      const testResult = await this.testEndpoint(endpoint);
      this.results.tests.push(testResult);
    }
  }

  async testEndpoint(endpoint) {
    const { name, path, method, data } = endpoint;
    const url = `${this.baseURL}${path}`;
    
    console.log(`🔄 Testing ${name}: ${method} ${path}`);
    
    const measurements = [];
    const iterations = 5;
    
    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        
        const config = {
          method: method.toLowerCase(),
          url: url,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        if (data) {
          config.data = data;
        }
        
        const response = await axios(config);
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        measurements.push({
          iteration: i + 1,
          responseTime: Math.round(responseTime),
          statusCode: response.status,
          success: true
        });
        
        console.log(`  ✅ Iteration ${i + 1}: ${Math.round(responseTime)}ms`);
        
      } catch (error) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        measurements.push({
          iteration: i + 1,
          responseTime: Math.round(responseTime),
          statusCode: error.response?.status || 0,
          success: false,
          error: error.message
        });
        
        console.log(`  ❌ Iteration ${i + 1}: ${error.message}`);
      }
      
      // Small delay between requests
      await this.delay(200);
    }
    
    const successfulMeasurements = measurements.filter(m => m.success);
    const avgResponseTime = successfulMeasurements.length > 0 
      ? Math.round(successfulMeasurements.reduce((sum, m) => sum + m.responseTime, 0) / successfulMeasurements.length)
      : 0;
    
    const successRate = (successfulMeasurements.length / measurements.length) * 100;
    
    const result = {
      endpoint: name,
      path: path,
      method: method,
      measurements: measurements,
      avgResponseTime: avgResponseTime,
      minResponseTime: successfulMeasurements.length > 0 ? Math.min(...successfulMeasurements.map(m => m.responseTime)) : 0,
      maxResponseTime: successfulMeasurements.length > 0 ? Math.max(...successfulMeasurements.map(m => m.responseTime)) : 0,
      successRate: successRate,
      status: this.getPerformanceStatus(avgResponseTime, successRate)
    };
    
    console.log(`📊 ${name} Results: ${avgResponseTime}ms avg, ${successRate}% success`);
    
    return result;
  }

  // Test concurrent load handling
  async testConcurrentLoad() {
    console.log('🚀 Testing Concurrent Load...');
    
    const concurrentUsers = 10;
    const requestsPerUser = 3;
    
    console.log(`👥 Simulating ${concurrentUsers} concurrent users, ${requestsPerUser} requests each`);
    
    const startTime = performance.now();
    
    const userPromises = Array.from({ length: concurrentUsers }, (_, userIndex) => 
      this.simulateUser(userIndex + 1, requestsPerUser)
    );
    
    const userResults = await Promise.all(userPromises);
    const endTime = performance.now();
    
    const totalRequests = concurrentUsers * requestsPerUser;
    const totalTime = endTime - startTime;
    const requestsPerSecond = Math.round((totalRequests / totalTime) * 1000);
    
    const allMeasurements = userResults.flat();
    const successfulRequests = allMeasurements.filter(m => m.success).length;
    const avgResponseTime = allMeasurements.length > 0 
      ? Math.round(allMeasurements.reduce((sum, m) => sum + m.responseTime, 0) / allMeasurements.length)
      : 0;
    
    const loadTestResult = {
      testType: 'Concurrent Load',
      concurrentUsers: concurrentUsers,
      requestsPerUser: requestsPerUser,
      totalRequests: totalRequests,
      successfulRequests: successfulRequests,
      failedRequests: totalRequests - successfulRequests,
      totalTime: Math.round(totalTime),
      avgResponseTime: avgResponseTime,
      requestsPerSecond: requestsPerSecond,
      successRate: (successfulRequests / totalRequests) * 100,
      status: this.getLoadTestStatus(requestsPerSecond, successfulRequests / totalRequests)
    };
    
    this.results.tests.push(loadTestResult);
    
    console.log(`📊 Load Test Results: ${requestsPerSecond} req/s, ${loadTestResult.successRate}% success`);
    
    return loadTestResult;
  }

  async simulateUser(userId, requestCount) {
    const userMeasurements = [];
    
    for (let i = 0; i < requestCount; i++) {
      try {
        const startTime = performance.now();
        
        const response = await axios.get(`${this.baseURL}/api/health`, {
          timeout: 5000,
          headers: {
            'User-Agent': `LoadTest-User-${userId}`
          }
        });
        
        const endTime = performance.now();
        
        userMeasurements.push({
          userId: userId,
          requestIndex: i + 1,
          responseTime: Math.round(endTime - startTime),
          statusCode: response.status,
          success: true
        });
        
      } catch (error) {
        userMeasurements.push({
          userId: userId,
          requestIndex: i + 1,
          responseTime: 0,
          statusCode: error.response?.status || 0,
          success: false,
          error: error.message
        });
      }
      
      // Random delay between user requests (100-300ms)
      await this.delay(100 + Math.random() * 200);
    }
    
    return userMeasurements;
  }

  // Test database performance (if accessible)
  async testDatabasePerformance() {
    console.log('🗄️ Testing Database Performance...');
    
    // This would test database-heavy endpoints
    const dbEndpoints = [
      { name: 'Session Retrieval', path: '/api/names/session/1', method: 'GET' },
      { name: 'Trending Patterns', path: '/api/names/trending', method: 'GET' }
    ];
    
    for (const endpoint of dbEndpoints) {
      try {
        const testResult = await this.testEndpoint(endpoint);
        this.results.tests.push(testResult);
      } catch (error) {
        console.log(`⚠️ Database test skipped: ${endpoint.name} - ${error.message}`);
      }
    }
  }

  // Generate performance report
  generateReport() {
    console.log('📋 Generating Performance Report...');
    
    const apiTests = this.results.tests.filter(t => t.endpoint);
    const loadTests = this.results.tests.filter(t => t.testType);
    
    const avgApiResponseTime = apiTests.length > 0 
      ? Math.round(apiTests.reduce((sum, t) => sum + t.avgResponseTime, 0) / apiTests.length)
      : 0;
    
    const overallSuccessRate = apiTests.length > 0
      ? Math.round(apiTests.reduce((sum, t) => sum + t.successRate, 0) / apiTests.length)
      : 0;
    
    this.results.summary = {
      totalTests: this.results.tests.length,
      avgApiResponseTime: avgApiResponseTime,
      overallSuccessRate: overallSuccessRate,
      loadTestResults: loadTests.length > 0 ? loadTests[0] : null,
      status: this.getOverallStatus(avgApiResponseTime, overallSuccessRate),
      recommendations: this.generateRecommendations(avgApiResponseTime, overallSuccessRate)
    };
    
    return this.results;
  }

  getPerformanceStatus(avgResponseTime, successRate) {
    if (successRate < 90) return 'CRITICAL';
    if (avgResponseTime > 2000) return 'POOR';
    if (avgResponseTime > 1000) return 'FAIR';
    if (avgResponseTime > 500) return 'GOOD';
    return 'EXCELLENT';
  }

  getLoadTestStatus(requestsPerSecond, successRate) {
    if (successRate < 0.9) return 'CRITICAL';
    if (requestsPerSecond < 10) return 'POOR';
    if (requestsPerSecond < 50) return 'FAIR';
    if (requestsPerSecond < 100) return 'GOOD';
    return 'EXCELLENT';
  }

  getOverallStatus(avgResponseTime, successRate) {
    if (successRate < 90 || avgResponseTime > 2000) return 'NEEDS_IMPROVEMENT';
    if (avgResponseTime > 500) return 'GOOD';
    return 'EXCELLENT';
  }

  generateRecommendations(avgResponseTime, successRate) {
    const recommendations = [];
    
    if (successRate < 95) {
      recommendations.push('Investigate and fix API reliability issues');
    }
    
    if (avgResponseTime > 1000) {
      recommendations.push('Optimize API response times - consider caching and database optimization');
    }
    
    if (avgResponseTime > 500) {
      recommendations.push('Consider implementing response caching for frequently accessed endpoints');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance is excellent - maintain current optimization levels');
    }
    
    return recommendations;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Run complete performance test suite
  async runFullSuite() {
    console.log('🚀 Starting Complete Performance Test Suite...');
    console.log('=' .repeat(60));
    
    try {
      await this.testAPIPerformance();
      await this.testConcurrentLoad();
      await this.testDatabasePerformance();
      
      const report = this.generateReport();
      
      console.log('=' .repeat(60));
      console.log('📊 PERFORMANCE TEST RESULTS');
      console.log('=' .repeat(60));
      console.log(`🎯 Overall Status: ${report.summary.status}`);
      console.log(`⚡ Average API Response Time: ${report.summary.avgApiResponseTime}ms`);
      console.log(`✅ Overall Success Rate: ${report.summary.overallSuccessRate}%`);
      
      if (report.summary.loadTestResults) {
        console.log(`🚀 Load Test: ${report.summary.loadTestResults.requestsPerSecond} req/s`);
      }
      
      console.log('📋 Recommendations:');
      report.summary.recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });
      
      return report;
      
    } catch (error) {
      console.error('❌ Performance test suite failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
module.exports = PerformanceTestSuite;

// Run tests if called directly
if (require.main === module) {
  const testSuite = new PerformanceTestSuite();
  testSuite.runFullSuite()
    .then(report => {
      console.log('✅ Performance testing complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Performance testing failed:', error);
      process.exit(1);
    });
}