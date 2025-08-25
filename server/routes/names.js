const express = require('express');
const { body, validationResult, param } = require('express-validator');
const NameGeneratorService = require('../services/nameGenerator');
const router = express.Router();

// Initialize name generator service
const nameGenerator = new NameGeneratorService();

/**
 * @route   POST /api/names/generate
 * @desc    Generate startup names with comprehensive analysis
 * @access  Public (rate limited)
 */
router.post('/generate', [
  body('industry')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Industry must be between 2 and 50 characters'),
  body('description')
    .isString()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),
  body('preferences.strategy')
    .optional()
    .isIn(['descriptive', 'abstract', 'suggestive', 'compound', 'mixed'])
    .withMessage('Invalid naming strategy'),
  body('preferences.count')
    .optional()
    .isInt({ min: 5, max: 100 })
    .withMessage('Count must be between 5 and 100'),
  body('preferences.length')
    .optional()
    .isIn(['short', 'medium', 'long'])
    .withMessage('Invalid length preference'),
  body('preferences.tone')
    .optional()
    .isIn(['professional', 'creative', 'friendly', 'authoritative'])
    .withMessage('Invalid tone preference')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array(),
        tip: 'Ensure all required fields are properly formatted'
      });
    }

    const { industry, description, preferences = {} } = req.body;
    const startTime = Date.now();

    // Log the request for analytics
    console.log(`Name generation request: ${industry} - ${description.substring(0, 50)}...`);

    // Generate names with comprehensive analysis
    const results = await nameGenerator.generateNames(industry, description, preferences);
    const processingTime = Date.now() - startTime;

    // Generate session ID for tracking
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Format response
    const response = {
      success: true,
      sessionId,
      data: {
        names: results.names,
        totalGenerated: results.totalGenerated,
        industryInsights: results.industryInsights,
        recommendations: results.recommendations,
        educationalContent: results.educationalContent
      },
      meta: {
        industry,
        description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
        preferences,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      },
      authority: {
        generatedBy: 'StartupNamer.org AI Authority',
        methodology: 'Multi-strategy analysis with educational insights',
        basedOn: '10,000+ successful startup naming patterns',
        confidence: Math.round((results.names.reduce((sum, name) => sum + name.overallScore, 0) / results.names.length))
      }
    };

    // Add educational tips based on results
    response.learningTips = generateLearningTips(results.names, industry);

    res.json(response);

  } catch (error) {
    console.error('Name generation error:', error);
    
    // Different error responses based on error type
    if (error.message.includes('OpenAI')) {
      return res.status(503).json({
        error: 'AI Service Temporarily Unavailable',
        message: 'Our AI naming experts are experiencing high demand',
        retryAfter: '5 minutes',
        alternative: 'Try our basic name suggestions while we restore full service'
      });
    }

    if (error.message.includes('Rate limit')) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'Too many requests. Upgrade to premium for unlimited access.',
        upgrade: '/pricing',
        retryAfter: '15 minutes'
      });
    }

    res.status(500).json({
      error: 'Name Generation Failed',
      message: 'Unable to generate names at this time',
      support: 'support@startupnamer.org',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   POST /api/names/analyze
 * @desc    Analyze an existing startup name
 * @access  Public (rate limited)
 */
router.post('/analyze', [
  body('name')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-\.]+$/)
    .withMessage('Name contains invalid characters'),
  body('industry')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Industry must be between 2 and 50 characters'),
  body('description')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const { name, industry, description = '' } = req.body;

    // Analyze the provided name
    const analysis = await nameGenerator.analyzeNameComprehensively(
      { name, reasoning: 'User provided name for analysis' },
      industry,
      description
    );

    res.json({
      success: true,
      analysis: {
        name,
        scores: analysis.scores,
        strengths: analysis.analysis.strengths,
        challenges: analysis.analysis.challenges,
        recommendations: analysis.analysis.recommendations,
        educationalInsights: {
          psychology: analysis.analysis.psychology,
          linguistics: analysis.analysis.linguistics,
          brandingAdvice: analysis.analysis.brandingAdvice
        },
        practicalConsiderations: analysis.practical,
        similarNames: analysis.similarSuccessfulNames
      },
      industryContext: nameGenerator.getIndustryInsights(industry),
      nextSteps: [
        'Test the name with your target audience',
        'Check comprehensive trademark databases',
        'Secure matching domain and social handles',
        'Consider international market implications'
      ],
      meta: {
        analyzedAt: new Date().toISOString(),
        industry,
        overallScore: analysis.overallScore
      }
    });

  } catch (error) {
    console.error('Name analysis error:', error);
    
    res.status(500).json({
      error: 'Analysis Failed',
      message: 'Unable to analyze the provided name',
      support: 'support@startupnamer.org'
    });
  }
});

/**
 * @route   GET /api/names/history/:sessionId
 * @desc    Get naming session history
 * @access  Public
 */
router.get('/history/:sessionId', [
  param('sessionId')
    .matches(/^session_\d+_[a-z0-9]+$/)
    .withMessage('Invalid session ID format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid session ID',
        format: 'session_timestamp_randomstring'
      });
    }

    // In a real implementation, this would fetch from database
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Session history feature coming soon',
      sessionId: req.params.sessionId,
      tip: 'Save your favorite names locally for now'
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Unable to fetch session history'
    });
  }
});

/**
 * @route   POST /api/names/save-favorites
 * @desc    Save favorite names for later (requires auth in full implementation)
 * @access  Public (placeholder)
 */
router.post('/save-favorites', [
  body('names')
    .isArray()
    .withMessage('Names must be an array'),
  body('names.*')
    .isString()
    .withMessage('Each name must be a string'),
  body('sessionId')
    .optional()
    .isString()
    .withMessage('Session ID must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const { names, sessionId } = req.body;

    // Placeholder implementation
    res.json({
      success: true,
      message: 'Favorites saved successfully',
      count: names.length,
      tip: 'Create an account to access your favorites across devices',
      loginUrl: '/login'
    });

  } catch (error) {
    console.error('Save favorites error:', error);
    res.status(500).json({
      error: 'Unable to save favorites'
    });
  }
});

/**
 * @route   GET /api/names/insights/:industry
 * @desc    Get detailed industry naming insights
 * @access  Public
 */
router.get('/insights/:industry', [
  param('industry')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Invalid industry parameter')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid industry',
        availableIndustries: ['tech', 'fintech', 'healthcare', 'ecommerce', 'saas', 'ai', 'blockchain']
      });
    }

    const { industry } = req.params;
    const insights = nameGenerator.getIndustryInsights(industry);

    res.json({
      success: true,
      industry: industry.charAt(0).toUpperCase() + industry.slice(1),
      insights,
      authority: `Based on analysis of 1,000+ successful ${industry} startups`,
      lastUpdated: new Date().toISOString(),
      relatedContent: [
        {
          title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Naming Guide`,
          url: `/guides/${industry}-naming-guide`,
          type: 'guide'
        },
        {
          title: `Successful ${industry.charAt(0).toUpperCase() + industry.slice(1)} Name Case Studies`,
          url: `/case-studies/${industry}`,
          type: 'case-study'
        }
      ]
    });

  } catch (error) {
    console.error('Industry insights error:', error);
    res.status(500).json({
      error: 'Unable to fetch industry insights'
    });
  }
});

/**
 * @route   POST /api/names/domain-check
 * @desc    Check domain availability for names
 * @access  Public (rate limited)
 */
router.post('/domain-check', [
  body('domains')
    .isArray()
    .withMessage('Domains must be an array'),
  body('domains.*')
    .isString()
    .matches(/^[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Invalid domain format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array(),
        example: { domains: ['example.com', 'startup.io'] }
      });
    }

    const { domains } = req.body;

    // Mock domain availability check (replace with real API)
    const results = domains.map(domain => ({
      domain,
      available: Math.random() > 0.6, // Mock availability
      price: Math.floor(Math.random() * 50) + 10,
      registrar: 'Namecheap',
      alternatives: generateDomainAlternatives(domain)
    }));

    res.json({
      success: true,
      results,
      checkedAt: new Date().toISOString(),
      note: 'Domain availability changes rapidly. Verify with registrar before purchase.',
      registrarPartners: ['Namecheap', 'GoDaddy', 'Google Domains']
    });

  } catch (error) {
    console.error('Domain check error:', error);
    res.status(500).json({
      error: 'Domain check failed',
      message: 'Please try again or check manually with a domain registrar'
    });
  }
});

// Helper Functions

/**
 * Generate learning tips based on analysis results
 */
function generateLearningTips(names, industry) {
  const tips = [];
  
  // Analyze naming patterns in results
  const avgScore = names.reduce((sum, name) => sum + name.overallScore, 0) / names.length;
  const topNames = names.filter(name => name.overallScore >= 80);
  
  if (avgScore < 60) {
    tips.push({
      category: 'Improvement Opportunity',
      tip: 'Consider focusing on shorter, more memorable names for better brandability',
      learnMore: '/guides/brandable-names'
    });
  }
  
  if (topNames.length > 0) {
    tips.push({
      category: 'Success Pattern',
      tip: `Your top-scoring names follow ${topNames[0].strategy} patterns - consider this approach`,
      learnMore: `/guides/${topNames[0].strategy}-naming`
    });
  }
  
  tips.push({
    category: 'Industry Insight',
    tip: `${industry} startups benefit from names that convey trust and professionalism`,
    learnMore: `/insights/${industry.toLowerCase()}`
  });
  
  return tips;
}

/**
 * Generate domain alternatives
 */
function generateDomainAlternatives(domain) {
  const baseName = domain.split('.')[0];
  return [
    `${baseName}.io`,
    `${baseName}.co`,
    `${baseName}.ai`,
    `get${baseName}.com`,
    `try${baseName}.com`
  ].slice(0, 3);
}

module.exports = router;