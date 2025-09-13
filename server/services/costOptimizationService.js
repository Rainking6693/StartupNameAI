const { telemetryHelpers } = require('../config/telemetry');
const cacheService = require('./cacheService');
const vectorDB = require('../config/vectorDatabase');

class CostOptimizationService {
  constructor() {
    this.modelPricing = {
      'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
      'text-embedding-3-small': { input: 0.00002, output: 0 },
      'text-embedding-3-large': { input: 0.00013, output: 0 }
    };
    
    this.costBudgets = {
      daily: parseFloat(process.env.DAILY_AI_BUDGET) || 100,
      monthly: parseFloat(process.env.MONTHLY_AI_BUDGET) || 2000,
      per_request: parseFloat(process.env.MAX_REQUEST_COST) || 0.50
    };
    
    this.costTracking = {
      daily_spent: 0,
      monthly_spent: 0,
      request_count: 0,
      cache_savings: 0,
      last_reset: new Date().toDateString()
    };
    
    this.optimizationStrategies = {
      model_selection: true,
      semantic_caching: true,
      request_batching: true,
      response_compression: true,
      intelligent_fallback: true
    };
    
    this.initializeCostTracking();
  }

  // Initialize cost tracking from cache
  async initializeCostTracking() {
    try {
      const cached = await cacheService.get('cost_tracking');
      if (cached) {
        this.costTracking = { ...this.costTracking, ...cached };
      }
      
      // Reset daily costs if new day
      const today = new Date().toDateString();
      if (this.costTracking.last_reset !== today) {
        this.costTracking.daily_spent = 0;
        this.costTracking.last_reset = today;
        await this.saveCostTracking();
      }
    } catch (error) {
      console.warn('Failed to initialize cost tracking:', error.message);
    }
  }

  // Intelligent model selection based on request complexity
  async selectOptimalModel(request) {
    return telemetryHelpers.createSpan('model_selection', async (span) => {
      const complexity = this.analyzeRequestComplexity(request);
      const budget = this.getRemainingBudget();
      
      span.setAttributes({
        'cost_optimization.complexity_score': complexity.score,
        'cost_optimization.remaining_budget': budget.daily,
        'cost_optimization.request_type': complexity.type
      });

      let selectedModel;
      
      // High complexity or premium features
      if (complexity.score >= 8 || request.premium) {
        selectedModel = 'gpt-4';
      }
      // Medium complexity
      else if (complexity.score >= 6) {
        selectedModel = budget.daily > 20 ? 'gpt-4-turbo' : 'gpt-3.5-turbo';
      }
      // Low complexity
      else {
        selectedModel = 'gpt-3.5-turbo';
      }

      // Budget constraints override
      if (budget.daily < 5) {
        selectedModel = 'gpt-3.5-turbo';
      }

      span.setAttributes({
        'cost_optimization.selected_model': selectedModel,
        'cost_optimization.selection_reason': this.getSelectionReason(complexity, budget, selectedModel)
      });

      return {
        model: selectedModel,
        reasoning: this.getSelectionReason(complexity, budget, selectedModel),
        estimated_cost: this.estimateRequestCost(request, selectedModel),
        complexity_analysis: complexity
      };
    });
  }

  // Analyze request complexity for model selection
  analyzeRequestComplexity(request) {
    let score = 5; // Base complexity
    let factors = [];
    
    // Industry complexity
    const complexIndustries = ['health', 'fintech', 'legal', 'biotech'];
    if (complexIndustries.includes(request.industry)) {
      score += 1;
      factors.push('complex_industry');
    }
    
    // Request size
    if (request.count > 50) {
      score += 1;
      factors.push('large_request');
    }
    
    // Style complexity
    if (request.style === 'creative' || request.style === 'innovative') {
      score += 1;
      factors.push('creative_style');
    }
    
    // Keyword complexity
    if (request.keywords && request.keywords.length > 3) {
      score += 0.5;
      factors.push('multiple_keywords');
    }
    
    // Special requirements
    if (request.requirements && request.requirements.length > 0) {
      score += 1;
      factors.push('special_requirements');
    }
    
    // Premium features
    if (request.premium || request.advanced_analysis) {
      score += 2;
      factors.push('premium_features');
    }

    return {
      score: Math.min(10, score),
      factors,
      type: this.getComplexityType(score)
    };
  }

  getComplexityType(score) {
    if (score >= 8) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }

  getSelectionReason(complexity, budget, model) {
    if (budget.daily < 5) {
      return 'Budget constraint - using most cost-effective model';
    }
    
    if (complexity.score >= 8) {
      return 'High complexity request requires advanced model capabilities';
    }
    
    if (complexity.score >= 6 && model === 'gpt-4-turbo') {
      return 'Medium complexity with good budget - using balanced performance model';
    }
    
    return 'Standard complexity - using cost-effective model';
  }

  // Semantic caching for cost reduction
  async checkSemanticCache(request) {
    return telemetryHelpers.createSpan('semantic_cache_check', async (span) => {
      try {
        // Generate semantic key
        const semanticKey = await this.generateSemanticKey(request);
        
        // Check exact match first
        const exactMatch = await cacheService.getCachedNameGeneration(request);
        if (exactMatch) {
          span.setAttributes({
            'cache.type': 'exact_match',
            'cache.hit': true
          });
          return { hit: true, type: 'exact', data: exactMatch };
        }

        // Check semantic similarity
        const similarRequests = await this.findSimilarRequests(semanticKey, request);
        if (similarRequests.length > 0) {
          const bestMatch = similarRequests[0];
          if (bestMatch.similarity > 0.85) {
            span.setAttributes({
              'cache.type': 'semantic_match',
              'cache.hit': true,
              'cache.similarity': bestMatch.similarity
            });
            
            // Adapt cached results to current request
            const adaptedResults = await this.adaptCachedResults(bestMatch.data, request);
            return { hit: true, type: 'semantic', data: adaptedResults, similarity: bestMatch.similarity };
          }
        }

        span.setAttributes({
          'cache.hit': false
        });
        return { hit: false };

      } catch (error) {
        span.recordException(error);
        return { hit: false, error: error.message };
      }
    });
  }

  // Generate semantic key for request
  async generateSemanticKey(request) {
    const keyComponents = [
      request.industry || 'general',
      request.style || 'modern',
      (request.keywords || []).sort().join('_'),
      Math.floor((request.count || 20) / 10) * 10 // Round to nearest 10
    ];
    
    return keyComponents.join('|');
  }

  // Find similar cached requests
  async findSimilarRequests(semanticKey, request) {
    try {
      // This would use vector similarity search
      const queryText = `${request.industry} ${request.style} ${(request.keywords || []).join(' ')}`;
      const similarNames = await vectorDB.findSimilarNames(queryText, request.industry, 5, 0.8);
      
      return similarNames.map(name => ({
        similarity: name.similarity,
        data: name,
        cache_key: this.generateCacheKey(name)
      }));
    } catch (error) {
      console.warn('Failed to find similar requests:', error.message);
      return [];
    }
  }

  // Adapt cached results to current request
  async adaptCachedResults(cachedData, currentRequest) {
    // Simple adaptation - in production this would be more sophisticated
    const adapted = {
      ...cachedData,
      adapted: true,
      adaptation_info: {
        original_request: cachedData.metadata || {},
        current_request: currentRequest,
        adaptation_type: 'semantic_similarity'
      }
    };

    // Adjust count if needed
    if (currentRequest.count && cachedData.names) {
      adapted.names = cachedData.names.slice(0, currentRequest.count);
    }

    return adapted;
  }

  // Estimate request cost
  estimateRequestCost(request, model = 'gpt-4') {
    const pricing = this.modelPricing[model];
    if (!pricing) return 0;

    // Estimate tokens based on request complexity
    const baseTokens = 500; // Base prompt tokens
    const keywordTokens = (request.keywords || []).length * 10;
    const countMultiplier = Math.log(request.count || 20) / Math.log(10);
    const responseTokens = (request.count || 20) * 50; // Estimated tokens per name

    const inputTokens = baseTokens + keywordTokens;
    const outputTokens = responseTokens * countMultiplier;

    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (outputTokens / 1000) * pricing.output;

    return inputCost + outputCost;
  }

  // Track actual costs
  async trackCost(actualCost, model, tokens, requestType = 'generation') {
    return telemetryHelpers.createSpan('cost_tracking', async (span) => {
      try {
        this.costTracking.daily_spent += actualCost;
        this.costTracking.monthly_spent += actualCost;
        this.costTracking.request_count += 1;

        span.setAttributes({
          'cost_tracking.actual_cost': actualCost,
          'cost_tracking.model': model,
          'cost_tracking.tokens': tokens,
          'cost_tracking.request_type': requestType,
          'cost_tracking.daily_total': this.costTracking.daily_spent,
          'cost_tracking.monthly_total': this.costTracking.monthly_spent
        });

        // Save to cache
        await this.saveCostTracking();

        // Check budget alerts
        await this.checkBudgetAlerts();

        // Record telemetry
        telemetryHelpers.recordAIUsage(0, tokens, actualCost, model);

      } catch (error) {
        span.recordException(error);
        console.error('Failed to track cost:', error);
      }
    });
  }

  // Track cache savings
  async trackCacheSavings(savedCost, cacheType = 'exact') {
    this.costTracking.cache_savings += savedCost;
    
    telemetryHelpers.recordNameGeneration(1, 0, 'cache');
    
    await this.saveCostTracking();
  }

  // Check budget alerts
  async checkBudgetAlerts() {
    const alerts = [];
    
    // Daily budget alerts
    const dailyUsage = this.costTracking.daily_spent / this.costBudgets.daily;
    if (dailyUsage >= 0.8) {
      alerts.push({
        type: 'daily_budget',
        level: dailyUsage >= 0.95 ? 'critical' : 'warning',
        usage: dailyUsage,
        message: `Daily budget ${Math.round(dailyUsage * 100)}% used`
      });
    }

    // Monthly budget alerts
    const monthlyUsage = this.costTracking.monthly_spent / this.costBudgets.monthly;
    if (monthlyUsage >= 0.8) {
      alerts.push({
        type: 'monthly_budget',
        level: monthlyUsage >= 0.95 ? 'critical' : 'warning',
        usage: monthlyUsage,
        message: `Monthly budget ${Math.round(monthlyUsage * 100)}% used`
      });
    }

    // Log alerts
    for (const alert of alerts) {
      console.warn(`Budget Alert [${alert.level}]: ${alert.message}`);
      
      if (alert.level === 'critical') {
        // Could trigger notifications, rate limiting, etc.
        await this.handleCriticalBudgetAlert(alert);
      }
    }

    return alerts;
  }

  // Handle critical budget alerts
  async handleCriticalBudgetAlert(alert) {
    // Implement emergency cost controls
    if (alert.type === 'daily_budget') {
      // Switch to most economical model
      this.optimizationStrategies.model_selection = 'economy_mode';
      
      // Increase cache aggressiveness
      this.optimizationStrategies.semantic_caching = 'aggressive';
      
      console.warn('Emergency cost controls activated due to budget alert');
    }
  }

  // Batch requests for cost efficiency
  async optimizeBatchRequests(requests) {
    return telemetryHelpers.createSpan('batch_optimization', async (span) => {
      // Group similar requests
      const groups = this.groupSimilarRequests(requests);
      
      span.setAttributes({
        'batch.original_count': requests.length,
        'batch.grouped_count': groups.length,
        'batch.efficiency_gain': (requests.length - groups.length) / requests.length
      });

      const optimizedBatches = [];
      
      for (const group of groups) {
        if (group.requests.length > 1) {
          // Merge similar requests
          const mergedRequest = this.mergeRequests(group.requests);
          optimizedBatches.push({
            type: 'merged',
            request: mergedRequest,
            original_requests: group.requests,
            cost_savings: this.calculateBatchSavings(group.requests, mergedRequest)
          });
        } else {
          optimizedBatches.push({
            type: 'single',
            request: group.requests[0],
            original_requests: group.requests,
            cost_savings: 0
          });
        }
      }

      return optimizedBatches;
    });
  }

  // Group similar requests for batching
  groupSimilarRequests(requests) {
    const groups = [];
    
    for (const request of requests) {
      const similarGroup = groups.find(group => 
        this.areRequestsSimilar(request, group.representative)
      );
      
      if (similarGroup) {
        similarGroup.requests.push(request);
      } else {
        groups.push({
          representative: request,
          requests: [request]
        });
      }
    }
    
    return groups;
  }

  // Check if requests are similar enough to batch
  areRequestsSimilar(req1, req2) {
    return (
      req1.industry === req2.industry &&
      req1.style === req2.style &&
      this.calculateKeywordSimilarity(req1.keywords || [], req2.keywords || []) > 0.7
    );
  }

  // Calculate keyword similarity
  calculateKeywordSimilarity(keywords1, keywords2) {
    const set1 = new Set(keywords1.map(k => k.toLowerCase()));
    const set2 = new Set(keywords2.map(k => k.toLowerCase()));
    
    const intersection = new Set([...set1].filter(k => set2.has(k)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // Merge similar requests
  mergeRequests(requests) {
    const merged = {
      industry: requests[0].industry,
      style: requests[0].style,
      keywords: [...new Set(requests.flatMap(r => r.keywords || []))],
      count: requests.reduce((sum, r) => sum + (r.count || 20), 0),
      merged_from: requests.length,
      original_requests: requests.map(r => r.id || Math.random().toString(36))
    };
    
    return merged;
  }

  // Calculate batch savings
  calculateBatchSavings(originalRequests, mergedRequest) {
    const originalCost = originalRequests.reduce((sum, req) => 
      sum + this.estimateRequestCost(req), 0
    );
    
    const mergedCost = this.estimateRequestCost(mergedRequest);
    
    return Math.max(0, originalCost - mergedCost);
  }

  // Get remaining budget
  getRemainingBudget() {
    return {
      daily: Math.max(0, this.costBudgets.daily - this.costTracking.daily_spent),
      monthly: Math.max(0, this.costBudgets.monthly - this.costTracking.monthly_spent),
      daily_percentage: (this.costTracking.daily_spent / this.costBudgets.daily) * 100,
      monthly_percentage: (this.costTracking.monthly_spent / this.costBudgets.monthly) * 100
    };
  }

  // Get cost optimization recommendations
  async getOptimizationRecommendations() {
    const budget = this.getRemainingBudget();
    const recommendations = [];

    // Budget-based recommendations
    if (budget.daily_percentage > 80) {
      recommendations.push({
        type: 'budget_warning',
        priority: 'high',
        message: 'Daily budget nearly exhausted - consider using cache-first strategy',
        action: 'increase_cache_usage'
      });
    }

    // Cache efficiency recommendations
    const cacheEfficiency = this.costTracking.cache_savings / 
      (this.costTracking.daily_spent + this.costTracking.cache_savings);
    
    if (cacheEfficiency < 0.3) {
      recommendations.push({
        type: 'cache_optimization',
        priority: 'medium',
        message: 'Low cache efficiency - enable semantic caching',
        action: 'enable_semantic_caching'
      });
    }

    // Model selection recommendations
    if (this.costTracking.daily_spent > this.costBudgets.daily * 0.5) {
      recommendations.push({
        type: 'model_optimization',
        priority: 'medium',
        message: 'Consider using more cost-effective models for simple requests',
        action: 'optimize_model_selection'
      });
    }

    return recommendations;
  }

  // Save cost tracking to cache
  async saveCostTracking() {
    try {
      await cacheService.set('cost_tracking', this.costTracking, 86400); // 24 hours
    } catch (error) {
      console.warn('Failed to save cost tracking:', error.message);
    }
  }

  // Generate cache key
  generateCacheKey(data) {
    return `cost_cache_${JSON.stringify(data)}`;
  }

  // Get cost optimization status
  getStatus() {
    const budget = this.getRemainingBudget();
    
    return {
      service: 'cost_optimization',
      status: 'active',
      cost_tracking: this.costTracking,
      budgets: this.costBudgets,
      remaining_budget: budget,
      optimization_strategies: this.optimizationStrategies,
      model_pricing: this.modelPricing,
      efficiency_metrics: {
        cache_savings_ratio: this.costTracking.cache_savings / 
          (this.costTracking.daily_spent + this.costTracking.cache_savings || 1),
        average_request_cost: this.costTracking.daily_spent / 
          (this.costTracking.request_count || 1),
        budget_utilization: {
          daily: budget.daily_percentage,
          monthly: budget.monthly_percentage
        }
      }
    };
  }

  // Reset daily costs (called by scheduler)
  async resetDailyCosts() {
    this.costTracking.daily_spent = 0;
    this.costTracking.last_reset = new Date().toDateString();
    await this.saveCostTracking();
    
    console.log('Daily cost tracking reset');
  }

  // Reset monthly costs (called by scheduler)
  async resetMonthlyCosts() {
    this.costTracking.monthly_spent = 0;
    await this.saveCostTracking();
    
    console.log('Monthly cost tracking reset');
  }
}

module.exports = new CostOptimizationService();