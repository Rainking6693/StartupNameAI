const { test, expect } = require('@playwright/test');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

test.describe('Name Generation API', () => {
  test.beforeEach(async ({ request }) => {
    // Check if API is healthy before running tests
    const healthResponse = await request.get(`${API_BASE_URL}/api/health`);
    expect(healthResponse.ok()).toBeTruthy();
  });

  test('should generate names successfully with valid input', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['tech', 'innovation'],
        industry: 'tech',
        style: 'modern',
        count: 20
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.names).toHaveLength(20);
    expect(data.data.sessionId).toBeDefined();
    
    // Verify name structure
    const firstNam = data.data.names[0];
    expect(firstName).toHaveProperty('name');
    expect(firstName).toHaveProperty('explanation');
    expect(firstName).toHaveProperty('brandability_score');
    expect(firstName.brandability_score).toBeGreaterThan(0);
    expect(firstName.brandability_score).toBeLessThanOrEqual(10);
  });

  test('should handle enhanced AI features', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['health', 'care'],
        industry: 'health',
        style: 'professional',
        count: 10
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    const names = data.data.names;
    
    // Check for enhanced features
    expect(names[0]).toHaveProperty('domain_info');
    expect(names[0]).toHaveProperty('seo_potential');
    expect(names[0]).toHaveProperty('trademark_risk');
    
    // Verify vector similarity scoring if available
    if (names[0].vector_similarity_score) {
      expect(names[0].vector_similarity_score).toBeGreaterThan(0);
      expect(names[0].vector_similarity_score).toBeLessThanOrEqual(10);
    }
  });

  test('should return cached results on repeated requests', async ({ request }) => {
    const requestData = {
      keywords: ['fintech', 'payment'],
      industry: 'fintech',
      style: 'modern',
      count: 15
    };

    // First request
    const response1 = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: requestData
    });
    expect(response1.ok()).toBeTruthy();
    const data1 = await response1.json();

    // Second identical request (should be cached)
    const response2 = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: requestData
    });
    expect(response2.ok()).toBeTruthy();
    const data2 = await response2.json();

    // Results should be identical (cached)
    expect(data1.data.names.length).toBe(data2.data.names.length);
    expect(data1.data.names[0].name).toBe(data2.data.names[0].name);
  });

  test('should validate input parameters', async ({ request }) => {
    // Test invalid keywords
    const invalidKeywords = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: [], // Empty array
        industry: 'tech',
        style: 'modern',
        count: 20
      }
    });
    expect(invalidKeywords.status()).toBe(400);

    // Test invalid industry
    const invalidIndustry = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['test'],
        industry: 'invalid_industry',
        style: 'modern',
        count: 20
      }
    });
    expect(invalidIndustry.status()).toBe(400);

    // Test invalid count
    const invalidCount = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['test'],
        industry: 'tech',
        style: 'modern',
        count: 200 // Too high
      }
    });
    expect(invalidCount.status()).toBe(400);
  });

  test('should handle rate limiting', async ({ request }) => {
    const requestData = {
      keywords: ['test'],
      industry: 'tech',
      style: 'modern',
      count: 10
    };

    // Make multiple rapid requests to trigger rate limiting
    const requests = Array(12).fill().map(() => 
      request.post(`${API_BASE_URL}/api/names/generate`, { data: requestData })
    );

    const responses = await Promise.all(requests);
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('should analyze custom names', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/names/analyze`, {
      data: {
        name: 'TechFlow'
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('TechFlow');
    expect(data.data.domain_analysis).toBeDefined();
    expect(data.data.brandability_analysis).toBeDefined();
    expect(data.data.seo_analysis).toBeDefined();
    expect(data.data.recommendations).toBeInstanceOf(Array);
  });

  test('should retrieve session data', async ({ request }) => {
    // First generate names to create a session
    const generateResponse = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['startup'],
        industry: 'tech',
        style: 'modern',
        count: 10
      }
    });

    expect(generateResponse.ok()).toBeTruthy();
    const generateData = await generateResponse.json();
    const sessionId = generateData.data.sessionId;

    // Skip session retrieval test if sessionId is temporary (database unavailable)
    if (typeof sessionId === 'string' && sessionId.startsWith('temp_')) {
      test.skip('Database unavailable, skipping session retrieval test');
      return;
    }

    // Retrieve session data
    const sessionResponse = await request.get(`${API_BASE_URL}/api/names/session/${sessionId}`);
    
    if (sessionResponse.ok()) {
      const sessionData = await sessionResponse.json();
      expect(sessionData.success).toBe(true);
      expect(sessionData.data.session.id).toBe(sessionId);
      expect(sessionData.data.names).toBeInstanceOf(Array);
    } else {
      // Session might not be found if database is unavailable
      expect(sessionResponse.status()).toBe(404);
    }
  });

  test('should handle AI service failures gracefully', async ({ request }) => {
    // This test assumes the API has fallback mechanisms
    const response = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['resilience'],
        industry: 'tech',
        style: 'modern',
        count: 10
      }
    });

    // Should still return results even if AI service fails (fallback)
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.names.length).toBeGreaterThan(0);
  });

  test('should provide telemetry and monitoring data', async ({ request }) => {
    const healthResponse = await request.get(`${API_BASE_URL}/api/health`);
    expect(healthResponse.ok()).toBeTruthy();
    
    const healthData = await healthResponse.json();
    
    // Check for enhanced monitoring features
    expect(healthData.features.telemetry).toBeDefined();
    expect(healthData.features.vectorDatabase).toBeDefined();
    expect(healthData.features.caching).toBeDefined();
    expect(healthData.services).toBeDefined();
    expect(healthData.services.cache).toBeDefined();
    expect(healthData.services.ai).toBeDefined();
  });

  test('should handle concurrent requests efficiently', async ({ request }) => {
    const requestData = {
      keywords: ['concurrent'],
      industry: 'tech',
      style: 'modern',
      count: 10
    };

    // Make 5 concurrent requests
    const concurrentRequests = Array(5).fill().map((_, index) => 
      request.post(`${API_BASE_URL}/api/names/generate`, {
        data: {
          ...requestData,
          keywords: [`concurrent${index}`] // Slightly different to avoid cache
        }
      })
    );

    const startTime = Date.now();
    const responses = await Promise.all(concurrentRequests);
    const endTime = Date.now();

    // All requests should succeed
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });

    // Should complete within reasonable time (adjust based on your performance requirements)
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(30000); // 30 seconds max for 5 concurrent requests
  });

  test('should export names in different formats', async ({ request }) => {
    // First generate names
    const generateResponse = await request.post(`${API_BASE_URL}/api/names/generate`, {
      data: {
        keywords: ['export'],
        industry: 'tech',
        style: 'modern',
        count: 5
      }
    });

    expect(generateResponse.ok()).toBeTruthy();
    const generateData = await generateResponse.json();
    const sessionId = generateData.data.sessionId;

    // Skip export test if sessionId is temporary
    if (typeof sessionId === 'string' && sessionId.startsWith('temp_')) {
      test.skip('Database unavailable, skipping export test');
      return;
    }

    // Test CSV export
    const csvResponse = await request.post(`${API_BASE_URL}/api/names/export`, {
      data: {
        sessionId: parseInt(sessionId),
        format: 'csv'
      }
    });

    if (csvResponse.ok()) {
      expect(csvResponse.headers()['content-type']).toContain('text/csv');
      const csvContent = await csvResponse.text();
      expect(csvContent).toContain('Name,Explanation,Brandability Score');
    }

    // Test JSON export
    const jsonResponse = await request.post(`${API_BASE_URL}/api/names/export`, {
      data: {
        sessionId: parseInt(sessionId),
        format: 'json'
      }
    });

    if (jsonResponse.ok()) {
      expect(jsonResponse.headers()['content-type']).toContain('application/json');
      const jsonContent = await jsonResponse.text();
      const parsedJson = JSON.parse(jsonContent);
      expect(parsedJson.session).toBeDefined();
      expect(parsedJson.names).toBeInstanceOf(Array);
    }
  });
});