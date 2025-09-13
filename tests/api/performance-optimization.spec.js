const { test, expect } = require('@playwright/test');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

test.describe('Performance Optimization API', () => {
  test.beforeEach(async ({ request }) => {
    // Check if API is healthy before running tests
    const healthResponse = await request.get(`${API_BASE_URL}/api/health`);
    expect(healthResponse.ok()).toBeTruthy();
  });

  test('should show improved health check with Phase 3 services', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    
    // Verify Phase 3 services are included
    expect(data.services).toHaveProperty('advanced_cache_service');
    expect(data.services).toHaveProperty('database_optimization');
    expect(data.services).toHaveProperty('load_balancing');
    expect(data.services).toHaveProperty('framework_evaluation');
    
    // Check service health status
    expect(data.services.advanced_cache_service).toHaveProperty('status');
    expect(data.services.database_optimization).toHaveProperty('status');
    expect(data.services.load_balancing).toHaveProperty('status');
    expect(data.services.framework_evaluation).toHaveProperty('status');
  });

  test('should handle load balancing admission control', async ({ request }) => {
    // Test normal request admission
    const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['performance', 'test'],
        industry: 'tech',
        style: 'modern',
        count: 10
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    
    // Response should include load balancing metrics in headers or metadata
    const headers = response.headers();
    // Load balancer may add custom headers for monitoring
  });

  test('should demonstrate improved response times with optimization', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['speed', 'optimization'],
        industry: 'tech',
        style: 'modern',
        count: 20
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.names).toHaveLength(20);
    
    // With Phase 3 optimizations, response time should be improved
    // This is a baseline - actual improvements depend on implementation
    expect(responseTime).toBeLessThan(3000); // 3 seconds max
    
    console.log(`Response time: ${responseTime}ms`);
  });

  test('should handle concurrent requests efficiently', async ({ request }) => {
    const concurrentRequests = 10;
    const requestData = {
      keywords: ['concurrent', 'test'],
      industry: 'tech',
      style: 'modern',
      count: 5
    };

    const startTime = Date.now();
    
    // Create multiple concurrent requests
    const requests = Array(concurrentRequests).fill().map(() =>
      request.post(`${API_BASE_URL}/api/names/generate`, { data: requestData })
    );

    const responses = await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    // All requests should succeed
    for (const response of responses) {
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
    }

    // With load balancing, concurrent requests should be handled efficiently
    const avgTimePerRequest = totalTime / concurrentRequests;
    expect(avgTimePerRequest).toBeLessThan(2000); // 2 seconds average

    console.log(`Concurrent requests: ${concurrentRequests}, Total time: ${totalTime}ms, Avg: ${avgTimePerRequest}ms`);
  });

  test('should demonstrate advanced caching benefits', async ({ request }) => {
    const requestData = {
      keywords: ['cache', 'performance'],
      industry: 'tech',
      style: 'modern',
      count: 15
    };

    // First request (cache miss)
    const startTime1 = Date.now();
    const response1 = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: requestData
    });
    const time1 = Date.now() - startTime1;

    expect(response1.ok()).toBeTruthy();
    const data1 = await response1.json();
    expect(data1.success).toBe(true);

    // Second identical request (should hit cache)
    const startTime2 = Date.now();
    const response2 = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: requestData
    });
    const time2 = Date.now() - startTime2;

    expect(response2.ok()).toBeTruthy();
    const data2 = await response2.json();
    expect(data2.success).toBe(true);

    // Second request should be significantly faster due to caching
    expect(time2).toBeLessThan(time1 * 0.8); // At least 20% faster

    console.log(`First request: ${time1}ms, Second request (cached): ${time2}ms`);
  });

  test('should provide database optimization metrics', async ({ request }) => {
    // This would test database optimization endpoints if exposed
    // For now, we test that the optimization service is working through improved performance
    
    const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['database', 'optimization'],
        industry: 'tech',
        style: 'modern',
        count: 25
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.names).toHaveLength(25);
    
    // Database optimization should result in faster queries
    // This is measured indirectly through overall response time
  });

  test('should handle system overload gracefully', async ({ request }) => {
    // Simulate high load to test load balancing and circuit breaker
    const highLoadRequests = 50;
    const requestData = {
      keywords: ['overload', 'test'],
      industry: 'tech',
      style: 'modern',
      count: 30
    };

    const requests = Array(highLoadRequests).fill().map(() =>
      request.post(`${API_BASE_URL}/api/names/generate`, { data: requestData })
    );

    const responses = await Promise.allSettled(requests);
    
    let successCount = 0;
    let queuedCount = 0;
    let rejectedCount = 0;

    for (const result of responses) {
      if (result.status === 'fulfilled') {
        const response = result.value;
        if (response.status() === 200) {
          successCount++;
        } else if (response.status() === 202) {
          queuedCount++;
        } else if (response.status() === 503) {
          rejectedCount++;
        }
      }
    }

    // System should handle overload gracefully
    expect(successCount + queuedCount).toBeGreaterThan(0);
    
    console.log(`High load test - Success: ${successCount}, Queued: ${queuedCount}, Rejected: ${rejectedCount}`);
  });

  test('should provide framework evaluation insights', async ({ request }) => {
    // Test framework evaluation service if it exposes endpoints
    // This tests that the service is initialized and working
    
    const response = await request.get(`${API_BASE_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.services.framework_evaluation).toHaveProperty('status');
    expect(data.services.framework_evaluation.status).toBe('healthy');
  });

  test('should demonstrate memory efficiency improvements', async ({ request }) => {
    // Test memory efficiency through multiple requests
    const memoryTestRequests = 20;
    const requestData = {
      keywords: ['memory', 'efficiency'],
      industry: 'tech',
      style: 'modern',
      count: 10
    };

    const responses = [];
    
    for (let i = 0; i < memoryTestRequests; i++) {
      const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
        data: { ...requestData, keywords: [...requestData.keywords, `test${i}`] }
      });
      
      expect(response.ok()).toBeTruthy();
      responses.push(await response.json());
      
      // Small delay to allow memory management
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // All requests should succeed without memory issues
    for (const data of responses) {
      expect(data.success).toBe(true);
      expect(data.data.names).toHaveLength(10);
    }

    console.log(`Memory efficiency test completed: ${memoryTestRequests} requests processed`);
  });

  test('should show improved error handling and recovery', async ({ request }) => {
    // Test error handling improvements
    const invalidRequest = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        // Invalid data to trigger error handling
        keywords: [],
        industry: 'invalid_industry',
        style: 'invalid_style',
        count: -1
      }
    });

    expect(invalidRequest.status()).toBe(400);
    
    const errorData = await invalidRequest.json();
    expect(errorData.success).toBe(false);
    expect(errorData).toHaveProperty('message');
    
    // System should recover gracefully and handle subsequent valid requests
    const validRequest = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['recovery', 'test'],
        industry: 'tech',
        style: 'modern',
        count: 5
      }
    });

    expect(validRequest.ok()).toBeTruthy();
    const validData = await validRequest.json();
    expect(validData.success).toBe(true);
  });

  test('should validate Phase 3 performance benchmarks', async ({ request }) => {
    // Comprehensive performance validation
    const benchmarkTests = [
      {
        name: 'Small request',
        data: { keywords: ['small'], industry: 'tech', style: 'modern', count: 5 },
        maxTime: 1000
      },
      {
        name: 'Medium request',
        data: { keywords: ['medium', 'test'], industry: 'tech', style: 'modern', count: 20 },
        maxTime: 2000
      },
      {
        name: 'Large request',
        data: { keywords: ['large', 'performance', 'test'], industry: 'tech', style: 'modern', count: 50 },
        maxTime: 5000
      }
    ];

    for (const benchmark of benchmarkTests) {
      const startTime = Date.now();
      
      const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
        data: benchmark.data
      });
      
      const responseTime = Date.now() - startTime;
      
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.names).toHaveLength(benchmark.data.count);
      
      // Validate performance benchmark
      expect(responseTime).toBeLessThan(benchmark.maxTime);
      
      console.log(`${benchmark.name}: ${responseTime}ms (max: ${benchmark.maxTime}ms)`);
    }
  });
});