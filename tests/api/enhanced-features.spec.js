const { test, expect } = require('@playwright/test');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

test.describe('Enhanced AI Features API', () => {
  test.beforeEach(async ({ request }) => {
    // Check if API is healthy before running tests
    const healthResponse = await request.get(`${API_BASE_URL}/api/health`);
    expect(healthResponse.ok()).toBeTruthy();
  });

  test('should generate names using multi-agent system', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/enhanced/names/generate`, {
      data: {
        keywords: ['ai', 'innovation'],
        industry: 'tech',
        style: 'innovative',
        count: 20,
        workflow: 'comprehensive',
        premium: true
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.names).toHaveLength(20);
    
    // Verify enhanced features
    const firstName = data.data.names[0];
    expect(firstName).toHaveProperty('name');
    expect(firstName).toHaveProperty('explanation');
    expect(firstName).toHaveProperty('brandability_score');
    
    // Check for multi-agent enhancements
    expect(data.data.metadata).toHaveProperty('workflow_used');
    expect(data.data.metadata).toHaveProperty('steps_executed');
    expect(data.data.metadata).toHaveProperty('agent_contributions');
    
    // Verify cost optimization
    expect(data.data.metadata).toHaveProperty('model_selection');
    expect(data.data.metadata.model_selection).toHaveProperty('model');
    expect(data.data.metadata.model_selection).toHaveProperty('estimated_cost');
  });

  test('should handle streaming name generation', async ({ request }) => {
    // Note: This test checks the streaming endpoint setup
    // Full streaming testing would require WebSocket or SSE client
    const response = await request.post(`${API_BASE_URL}/api/enhanced/names/stream`, {
      data: {
        keywords: ['stream', 'test'],
        industry: 'tech',
        style: 'modern',
        count: 10
      }
    });

    // Streaming endpoint should return 200 and start streaming
    expect(response.ok()).toBeTruthy();
    
    // Check for streaming headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('text/event-stream');
    expect(headers['cache-control']).toBe('no-cache');
    expect(headers['connection']).toBe('keep-alive');
  });

  test('should execute LangChain workflows', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/enhanced/names/langchain`, {
      data: {
        keywords: ['langchain', 'workflow'],
        industry: 'tech',
        style: 'professional',
        count: 15,
        workflow_type: 'multi_step'
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.names).toHaveLength(15);
    
    // Verify LangChain workflow metadata
    expect(data.data).toHaveProperty('workflow_metadata');
    expect(data.data).toHaveProperty('langchain_info');
    expect(data.data.langchain_info).toHaveProperty('workflow_type');
    expect(data.data.langchain_info).toHaveProperty('chains_used');
    expect(data.data.langchain_info.chains_used).toContain('creative');
    expect(data.data.langchain_info.chains_used).toContain('validation');
  });

  test('should perform batch analysis with AI agents', async ({ request }) => {
    const testNames = ['TechFlow', 'DataSync', 'CloudCore', 'AIHub', 'CodeLab'];
    
    const response = await request.post(`${API_BASE_URL}/api/enhanced/names/analyze-batch`, {
      data: {
        names: testNames,
        industry: 'tech',
        analysis_depth: 'comprehensive',
        include_competitive_analysis: true
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.analysis_results).toHaveLength(testNames.length);
    expect(data.data.validation_results).toHaveLength(testNames.length);
    
    // Verify comprehensive analysis structure
    const firstAnalysis = data.data.analysis_results[0];
    expect(firstAnalysis).toHaveProperty('brandability_matrix');
    expect(firstAnalysis).toHaveProperty('market_intelligence');
    expect(firstAnalysis).toHaveProperty('commercial_viability');
    expect(firstAnalysis).toHaveProperty('technical_assessment');
    expect(firstAnalysis).toHaveProperty('composite_score');
    
    // Verify validation results
    const firstValidation = data.data.validation_results[0];
    expect(firstValidation).toHaveProperty('validation_status');
    expect(firstValidation).toHaveProperty('overall_score');
    expect(firstValidation).toHaveProperty('validation_scores');
    
    // Check summary statistics
    expect(data.data.summary).toHaveProperty('total_analyzed');
    expect(data.data.summary).toHaveProperty('average_quality');
    expect(data.data.summary).toHaveProperty('pass_rate');
    expect(data.data.summary.total_analyzed).toBe(testNames.length);
  });

  test('should provide cost optimization insights', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/enhanced/names/cost-optimization`);

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('cost_status');
    expect(data.data).toHaveProperty('recommendations');
    expect(data.data).toHaveProperty('optimization_tips');
    
    // Verify cost status structure
    const costStatus = data.data.cost_status;
    expect(costStatus).toHaveProperty('cost_tracking');
    expect(costStatus).toHaveProperty('budgets');
    expect(costStatus).toHaveProperty('remaining_budget');
    expect(costStatus).toHaveProperty('efficiency_metrics');
    
    // Check efficiency metrics
    expect(costStatus.efficiency_metrics).toHaveProperty('cache_savings_ratio');
    expect(costStatus.efficiency_metrics).toHaveProperty('average_request_cost');
    expect(costStatus.efficiency_metrics).toHaveProperty('budget_utilization');
    
    // Verify recommendations are actionable
    expect(Array.isArray(data.data.recommendations)).toBe(true);
    expect(Array.isArray(data.data.optimization_tips)).toBe(true);
  });

  test('should check AI agent system status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/enhanced/names/agent-status`);

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('ai_agents');
    expect(data.data).toHaveProperty('langchain_service');
    expect(data.data).toHaveProperty('streaming_service');
    expect(data.data).toHaveProperty('system_health');
    
    // Verify AI agents status
    const aiAgents = data.data.ai_agents;
    expect(aiAgents).toHaveProperty('total_agents');
    expect(aiAgents).toHaveProperty('agents');
    expect(aiAgents).toHaveProperty('orchestrator_status');
    
    // Check individual agent status
    const agents = aiAgents.agents;
    expect(agents).toHaveProperty('creative');
    expect(agents).toHaveProperty('analyst');
    expect(agents).toHaveProperty('validator');
    expect(agents).toHaveProperty('researcher');
    expect(agents).toHaveProperty('optimizer');
    
    // Verify LangChain service status
    const langchainService = data.data.langchain_service;
    expect(langchainService).toHaveProperty('status');
    expect(langchainService).toHaveProperty('chains_loaded');
    
    // Verify streaming service status
    const streamingService = data.data.streaming_service;
    expect(streamingService).toHaveProperty('service');
    expect(streamingService).toHaveProperty('status');
    expect(streamingService).toHaveProperty('metrics');
    
    // Check system health summary
    const systemHealth = data.data.system_health;
    expect(systemHealth).toHaveProperty('all_agents_active');
    expect(systemHealth).toHaveProperty('langchain_healthy');
    expect(systemHealth).toHaveProperty('streaming_active');
  });

  test('should perform competitive analysis', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/enhanced/names/competitive-analysis`, {
      data: {
        industry: 'fintech',
        keywords: ['payment', 'digital'],
        analysis_scope: 'comprehensive'
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('research_findings');
    expect(data.data).toHaveProperty('competitive_insights');
    expect(data.data).toHaveProperty('strategic_recommendations');
    
    // Verify research findings structure
    const researchFindings = data.data.research_findings;
    expect(researchFindings).toHaveProperty('industry_landscape');
    expect(researchFindings).toHaveProperty('naming_trends');
    expect(researchFindings).toHaveProperty('competitive_intelligence');
    
    // Check competitive insights
    const competitiveInsights = data.data.competitive_insights;
    expect(competitiveInsights).toHaveProperty('direct_competitors');
    expect(competitiveInsights).toHaveProperty('positioning_strategies');
    expect(competitiveInsights).toHaveProperty('differentiation_gaps');
    
    // Verify strategic recommendations
    expect(Array.isArray(data.data.strategic_recommendations)).toBe(true);
    
    // Check analysis metadata
    expect(data.data.analysis_metadata).toHaveProperty('industry');
    expect(data.data.analysis_metadata).toHaveProperty('keywords');
    expect(data.data.analysis_metadata).toHaveProperty('analysis_scope');
    expect(data.data.analysis_metadata).toHaveProperty('confidence');
  });

  test('should generate trend predictions', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/enhanced/names/trend-prediction`, {
      data: {
        industry: 'tech',
        time_horizon: '1_year',
        trend_categories: ['naming', 'branding', 'technology']
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('trend_predictions');
    expect(data.data).toHaveProperty('future_insights');
    expect(data.data).toHaveProperty('strategic_implications');
    
    // Verify trend predictions structure
    const trendPredictions = data.data.trend_predictions;
    expect(trendPredictions).toHaveProperty('current_trends');
    expect(trendPredictions).toHaveProperty('emerging_patterns');
    expect(trendPredictions).toHaveProperty('future_predictions');
    
    // Check future insights
    expect(Array.isArray(data.data.future_insights)).toBe(true);
    expect(Array.isArray(data.data.strategic_implications)).toBe(true);
    
    // Verify prediction metadata
    const metadata = data.data.prediction_metadata;
    expect(metadata).toHaveProperty('industry');
    expect(metadata).toHaveProperty('time_horizon');
    expect(metadata).toHaveProperty('trend_categories');
    expect(metadata).toHaveProperty('confidence');
    expect(metadata).toHaveProperty('generated_at');
  });

  test('should handle enhanced feature rate limiting', async ({ request }) => {
    const requestData = {
      keywords: ['rate', 'limit'],
      industry: 'tech',
      style: 'modern',
      count: 10
    };

    // Make multiple rapid requests to trigger enhanced rate limiting
    const requests = Array(25).fill().map(() => 
      request.post(`${API_BASE_URL}/api/enhanced/names/generate`, { data: requestData })
    );

    const responses = await Promise.all(requests);
    
    // Some requests should be rate limited (enhanced limit is 20 per 15 minutes)
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
    
    // Check rate limit message
    if (rateLimitedResponses.length > 0) {
      const rateLimitResponse = await rateLimitedResponses[0].json();
      expect(rateLimitResponse.error).toContain('Enhanced feature rate limit exceeded');
      expect(rateLimitResponse).toHaveProperty('upgrade_url');
    }
  });

  test('should validate enhanced request parameters', async ({ request }) => {
    // Test invalid workflow type
    const invalidWorkflow = await request.post(`${API_BASE_URL}/api/enhanced/names/generate`, {
      data: {
        keywords: ['test'],
        industry: 'tech',
        style: 'modern',
        count: 20,
        workflow: 'invalid_workflow'
      }
    });
    expect(invalidWorkflow.status()).toBe(400);

    // Test invalid industry for enhanced features
    const invalidIndustry = await request.post(`${API_BASE_URL}/api/enhanced/names/competitive-analysis`, {
      data: {
        industry: 'invalid_industry',
        keywords: ['test']
      }
    });
    expect(invalidIndustry.status()).toBe(400);

    // Test invalid analysis depth
    const invalidAnalysis = await request.post(`${API_BASE_URL}/api/enhanced/names/analyze-batch`, {
      data: {
        names: ['TestName'],
        industry: 'tech',
        analysis_depth: 'invalid_depth'
      }
    });
    expect(invalidAnalysis.status()).toBe(400);
  });

  test('should handle cost optimization caching', async ({ request }) => {
    const requestData = {
      keywords: ['cache', 'optimization'],
      industry: 'tech',
      style: 'modern',
      count: 15
    };

    // First request
    const response1 = await request.post(`${API_BASE_URL}/api/enhanced/names/generate`, {
      data: requestData
    });
    expect(response1.ok()).toBeTruthy();
    const data1 = await response1.json();

    // Second identical request (should hit semantic cache)
    const response2 = await request.post(`${API_BASE_URL}/api/enhanced/names/generate`, {
      data: requestData
    });
    expect(response2.ok()).toBeTruthy();
    const data2 = await response2.json();

    // Check for cache indicators
    if (data2.data.cache_info) {
      expect(data2.data.cache_info.cache_hit).toBe(true);
      expect(data2.data.cache_info).toHaveProperty('cache_type');
      expect(data2.data.cache_info).toHaveProperty('cost_saved');
    }
  });

  test('should provide comprehensive error handling', async ({ request }) => {
    // Test with malformed request
    const malformedResponse = await request.post(`${API_BASE_URL}/api/enhanced/names/generate`, {
      data: {
        // Missing required fields
        style: 'modern'
      }
    });
    expect(malformedResponse.status()).toBe(400);
    
    const errorData = await malformedResponse.json();
    expect(errorData.success).toBe(false);
    expect(errorData).toHaveProperty('message');
    expect(errorData).toHaveProperty('errors');
    expect(Array.isArray(errorData.errors)).toBe(true);
  });
});