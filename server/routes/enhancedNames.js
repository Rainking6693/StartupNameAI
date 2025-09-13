const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const langchainService = require('../services/langchainService');
const AIAgentSystem = require('../services/aiAgentSystem');
const streamingService = require('../services/streamingService');
const costOptimizationService = require('../services/costOptimizationService');
const { telemetryHelpers } = require('../config/telemetry');
const { AppError, logger } = require('../middleware/errorHandler');

const router = express.Router();

// Enhanced rate limiting for premium features
const enhancedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes for enhanced features
  message: {
    error: 'Enhanced feature rate limit exceeded. Please upgrade to premium for higher limits.',
    upgrade_url: 'https://startupnamer.org/pricing'
  }
});

// Streaming rate limiter
const streamingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 streaming requests per 5 minutes
  message: {
    error: 'Streaming rate limit exceeded. Please wait before starting another stream.'
  }
});

// Input validation for enhanced requests
const validateEnhancedRequest = [
  body('keywords')
    .isArray({ min: 1, max: 5 })
    .withMessage('Keywords must be an array with 1-5 items'),
  body('keywords.*')
    .isLength({ min: 2, max: 30 })
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Each keyword must be 2-30 characters, alphanumeric only'),
  body('industry')
    .isIn(['tech', 'health', 'fintech', 'ecommerce', 'saas', 'education', 'food', 'travel', 'biotech', 'legal'])
    .withMessage('Invalid industry selection'),
  body('style')
    .isIn(['modern', 'classic', 'creative', 'professional', 'innovative', 'disruptive'])
    .withMessage('Invalid style selection'),
  body('count')
    .optional()
    .isInt({ min: 10, max: 100 })
    .withMessage('Count must be between 10 and 100'),
  body('workflow')
    .optional()
    .isIn(['standard', 'fast', 'comprehensive', 'quality_focused'])
    .withMessage('Invalid workflow type'),
  body('premium')
    .optional()
    .isBoolean()
    .withMessage('Premium must be a boolean')
];

// POST /api/enhanced/names/generate - Advanced multi-agent name generation
router.post('/generate', enhancedLimiter, validateEnhancedRequest, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    const {
      keywords,
      industry,
      style,
      count = 50,
      workflow = 'standard',
      premium = false,
      advanced_analysis = false
    } = req.body;

    // Cost optimization check
    const modelSelection = await costOptimizationService.selectOptimalModel({
      keywords, industry, style, count, premium, advanced_analysis
    });

    // Check semantic cache first
    const cacheResult = await costOptimizationService.checkSemanticCache({
      keywords, industry, style, count
    });

    if (cacheResult.hit) {
      await costOptimizationService.trackCacheSavings(
        modelSelection.estimated_cost,
        cacheResult.type
      );

      return res.status(200).json({
        success: true,
        message: `Generated ${cacheResult.data.names?.length || count} names using cached intelligence`,
        data: {
          ...cacheResult.data,
          cache_info: {
            cache_hit: true,
            cache_type: cacheResult.type,
            similarity: cacheResult.similarity,
            cost_saved: modelSelection.estimated_cost
          },
          model_selection: modelSelection
        }
      });
    }

    // Initialize AI Agent System
    const aiAgentSystem = new AIAgentSystem();
    
    // Execute multi-agent workflow
    const result = await aiAgentSystem.executeNamingWorkflow({
      keywords,
      industry,
      style,
      count,
      workflow,
      premium,
      advanced_analysis,
      model_selection: modelSelection
    });

    // Track actual costs
    const actualCost = modelSelection.estimated_cost; // In production, get actual from API response
    await costOptimizationService.trackCost(
      actualCost,
      modelSelection.model,
      result.metadata.estimated_tokens || 2000,
      'enhanced_generation'
    );

    // Cache results for future optimization
    await costOptimizationService.cacheService?.cacheNameGeneration(
      { keywords, industry, style, count },
      result
    );

    res.status(200).json({
      success: true,
      message: `Successfully generated ${result.names.length} enhanced startup names`,
      data: {
        names: result.names,
        metadata: {
          ...result.metadata,
          model_selection: modelSelection,
          cost_info: {
            estimated_cost: actualCost,
            model_used: modelSelection.model,
            optimization_applied: true
          }
        }
      }
    });

  } catch (error) {
    logger.error('Enhanced name generation failed:', error);
    next(new AppError('Enhanced name generation failed. Please try again.', 500));
  }
});

// POST /api/enhanced/names/stream - Real-time streaming name generation
router.post('/stream', streamingLimiter, validateEnhancedRequest, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    const {
      keywords,
      industry,
      style,
      count = 20,
      premium = false
    } = req.body;

    // Cost optimization for streaming
    const modelSelection = await costOptimizationService.selectOptimalModel({
      keywords, industry, style, count, premium, streaming: true
    });

    logger.info('Starting streaming name generation:', {
      keywords, industry, style, count,
      model: modelSelection.model,
      estimated_cost: modelSelection.estimated_cost
    });

    // Start streaming response
    await streamingService.startNameGenerationStream({
      keywords,
      industry,
      style,
      count,
      premium,
      model_selection: modelSelection
    }, res);

  } catch (error) {
    logger.error('Streaming name generation failed:', error);
    next(new AppError('Streaming generation failed. Please try again.', 500));
  }
});

// POST /api/enhanced/names/langchain - LangChain workflow generation
router.post('/langchain', enhancedLimiter, validateEnhancedRequest, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    const {
      keywords,
      industry,
      style,
      count = 50,
      workflow_type = 'multi_step'
    } = req.body;

    logger.info('Starting LangChain workflow generation:', {
      keywords, industry, style, count, workflow_type
    });

    // Execute LangChain multi-step workflow
    const result = await langchainService.generateNamesWithWorkflow({
      keywords,
      industry,
      style,
      count,
      workflow_type
    });

    res.status(200).json({
      success: true,
      message: `Successfully generated ${result.names.length} names using LangChain workflow`,
      data: {
        names: result.names,
        workflow_metadata: result.workflow_metadata,
        langchain_info: {
          workflow_type,
          chains_used: ['creative', 'rag', 'analysis', 'validation', 'optimization'],
          processing_steps: result.workflow_metadata.creative_count ? 5 : 3
        }
      }
    });

  } catch (error) {
    logger.error('LangChain workflow generation failed:', error);
    next(new AppError('LangChain workflow generation failed. Please try again.', 500));
  }
});

// POST /api/enhanced/names/analyze-batch - Batch analysis with AI agents
router.post('/analyze-batch', enhancedLimiter, [
  body('names')
    .isArray({ min: 1, max: 50 })
    .withMessage('Names must be an array with 1-50 items'),
  body('names.*')
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage('Each name must be 2-50 characters, alphanumeric and hyphens only'),
  body('industry')
    .isIn(['tech', 'health', 'fintech', 'ecommerce', 'saas', 'education', 'food', 'travel'])
    .withMessage('Invalid industry selection'),
  body('analysis_depth')
    .optional()
    .isIn(['basic', 'comprehensive', 'premium'])
    .withMessage('Invalid analysis depth')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    const {
      names,
      industry,
      analysis_depth = 'comprehensive',
      include_competitive_analysis = false
    } = req.body;

    // Initialize AI Agent System for analysis
    const aiAgentSystem = new AIAgentSystem();
    const analystAgent = aiAgentSystem.agents.get('analyst');
    const validatorAgent = aiAgentSystem.agents.get('validator');

    // Perform comprehensive analysis
    const analysisResults = await analystAgent.analyze(
      names.map(name => ({ name })),
      {
        industry,
        analysis_depth,
        include_competitive_analysis
      }
    );

    // Perform validation
    const validationResults = await validatorAgent.validate(
      names.map(name => ({ name })),
      costOptimizationService.getValidationStandards?.(industry) || {}
    );

    res.status(200).json({
      success: true,
      message: `Successfully analyzed ${names.length} names`,
      data: {
        analysis_results: analysisResults.analysis_results,
        validation_results: validationResults.validation_results,
        summary: {
          total_analyzed: names.length,
          average_quality: analysisResults.analysis_results.reduce(
            (sum, result) => sum + (result.composite_score || 0), 0
          ) / analysisResults.analysis_results.length,
          pass_rate: validationResults.validation_results.filter(
            r => r.validation_status === 'PASS'
          ).length / validationResults.validation_results.length,
          analysis_depth
        }
      }
    });

  } catch (error) {
    logger.error('Batch analysis failed:', error);
    next(new AppError('Batch analysis failed. Please try again.', 500));
  }
});

// GET /api/enhanced/names/cost-optimization - Cost optimization insights
router.get('/cost-optimization', async (req, res, next) => {
  try {
    const status = costOptimizationService.getStatus();
    const recommendations = await costOptimizationService.getOptimizationRecommendations();

    res.status(200).json({
      success: true,
      data: {
        cost_status: status,
        recommendations,
        optimization_tips: [
          'Use semantic caching for similar requests',
          'Batch multiple requests when possible',
          'Choose appropriate model complexity for your needs',
          'Enable streaming for better user experience'
        ]
      }
    });

  } catch (error) {
    logger.error('Cost optimization status failed:', error);
    next(new AppError('Failed to get cost optimization status', 500));
  }
});

// GET /api/enhanced/names/agent-status - AI Agent system status
router.get('/agent-status', async (req, res, next) => {
  try {
    const aiAgentSystem = new AIAgentSystem();
    const agentStatus = await aiAgentSystem.getAgentStatus();
    const langchainStatus = await langchainService.healthCheck();
    const streamingStatus = streamingService.getStatus();

    res.status(200).json({
      success: true,
      data: {
        ai_agents: agentStatus,
        langchain_service: langchainStatus,
        streaming_service: streamingStatus,
        system_health: {
          all_agents_active: Object.values(agentStatus.agents).every(
            agent => agent.status === 'active'
          ),
          langchain_healthy: langchainStatus.status === 'healthy',
          streaming_active: streamingStatus.status === 'active'
        }
      }
    });

  } catch (error) {
    logger.error('Agent status check failed:', error);
    next(new AppError('Failed to get agent status', 500));
  }
});

// POST /api/enhanced/names/competitive-analysis - AI-powered competitive analysis
router.post('/competitive-analysis', enhancedLimiter, [
  body('industry')
    .isIn(['tech', 'health', 'fintech', 'ecommerce', 'saas', 'education', 'food', 'travel'])
    .withMessage('Invalid industry selection'),
  body('keywords')
    .isArray({ min: 1, max: 5 })
    .withMessage('Keywords must be an array with 1-5 items'),
  body('analysis_scope')
    .optional()
    .isIn(['direct', 'indirect', 'comprehensive'])
    .withMessage('Invalid analysis scope')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    const {
      industry,
      keywords,
      analysis_scope = 'comprehensive'
    } = req.body;

    // Initialize AI Agent System
    const aiAgentSystem = new AIAgentSystem();
    const researcherAgent = aiAgentSystem.agents.get('researcher');

    // Perform competitive research
    const researchResults = await researcherAgent.research(industry, keywords, {
      analysis_scope,
      focus: 'competitive_intelligence'
    });

    res.status(200).json({
      success: true,
      message: `Competitive analysis completed for ${industry} industry`,
      data: {
        research_findings: researchResults.research_findings,
        competitive_insights: researchResults.research_findings.competitive_intelligence,
        strategic_recommendations: researchResults.strategic_recommendations,
        analysis_metadata: {
          industry,
          keywords,
          analysis_scope,
          confidence: researchResults.research_confidence
        }
      }
    });

  } catch (error) {
    logger.error('Competitive analysis failed:', error);
    next(new AppError('Competitive analysis failed. Please try again.', 500));
  }
});

// POST /api/enhanced/names/trend-prediction - AI trend forecasting
router.post('/trend-prediction', enhancedLimiter, [
  body('industry')
    .isIn(['tech', 'health', 'fintech', 'ecommerce', 'saas', 'education', 'food', 'travel'])
    .withMessage('Invalid industry selection'),
  body('time_horizon')
    .optional()
    .isIn(['6_months', '1_year', '2_years', '5_years'])
    .withMessage('Invalid time horizon'),
  body('trend_categories')
    .optional()
    .isArray()
    .withMessage('Trend categories must be an array')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    const {
      industry,
      time_horizon = '1_year',
      trend_categories = ['naming', 'branding', 'technology']
    } = req.body;

    // Initialize AI Agent System
    const aiAgentSystem = new AIAgentSystem();
    const researcherAgent = aiAgentSystem.agents.get('researcher');

    // Perform trend analysis
    const trendResults = await researcherAgent.research(industry, [], {
      focus: 'trend_prediction',
      time_horizon,
      trend_categories
    });

    res.status(200).json({
      success: true,
      message: `Trend prediction completed for ${industry} industry`,
      data: {
        trend_predictions: trendResults.research_findings.naming_trends,
        future_insights: trendResults.research_findings.naming_trends.future_predictions,
        strategic_implications: trendResults.strategic_recommendations,
        prediction_metadata: {
          industry,
          time_horizon,
          trend_categories,
          confidence: trendResults.research_confidence,
          generated_at: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    logger.error('Trend prediction failed:', error);
    next(new AppError('Trend prediction failed. Please try again.', 500));
  }
});

module.exports = router;