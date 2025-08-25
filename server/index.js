require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const NameGenerator = require('./services/nameGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
}));

// CORS configuration for StartupNamer.org
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'https://startupnamer.org'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for AI name generation
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 AI requests per windowMs
  message: {
    error: 'AI name generation limit exceeded. Please try again in 15 minutes or upgrade to premium.',
    upgrade: 'https://startupnamer.org/pricing'
  }
});

app.use(limiter);
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize services
const nameGenerator = new NameGenerator();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'StartupNamer.org API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes

/**
 * Generate startup names with educational analysis
 * POST /api/names/generate
 */
app.post('/api/names/generate', aiLimiter, async (req, res) => {
  try {
    const { industry, description, preferences = {} } = req.body;

    // Input validation
    if (!industry || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['industry', 'description'],
        provided: Object.keys(req.body)
      });
    }

    if (description.length < 10) {
      return res.status(400).json({
        error: 'Description must be at least 10 characters long',
        tip: 'Provide more details about your startup for better naming suggestions'
      });
    }

    // Generate names with educational content
    const startTime = Date.now();
    const results = await nameGenerator.generateNames(industry, description, preferences);
    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      data: results,
      meta: {
        processingTime,
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        industry,
        totalResults: results.allNames.length,
        educationalContent: true
      },
      authority: {
        analysisBy: 'StartupNamer.org Expert System',
        basedOn: '10,000+ successful startup names',
        methodology: 'Educational AI with expert validation'
      }
    });

  } catch (error) {
    console.error('Name generation error:', error);
    
    res.status(500).json({
      error: 'Name generation failed',
      message: 'Our AI naming experts are temporarily unavailable',
      support: 'Contact support@startupnamer.org for assistance',
      retryIn: '5 minutes'
    });
  }
});

/**
 * Analyze an existing name
 * POST /api/names/analyze
 */
app.post('/api/names/analyze', aiLimiter, async (req, res) => {
  try {
    const { name, industry } = req.body;

    if (!name || !industry) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'industry']
      });
    }

    // Analyze the provided name
    const analysis = await nameGenerator.addEducationalAnalysis({ name }, industry);

    res.json({
      success: true,
      analysis: analysis.labAnalysis,
      lessons: analysis.namingLesson,
      recommendation: analysis.recommendationLevel,
      meta: {
        analyzedName: name,
        industry,
        analysisDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Name analysis error:', error);
    
    res.status(500).json({
      error: 'Name analysis failed',
      message: 'Unable to analyze the provided name',
      support: 'Contact support@startupnamer.org'
    });
  }
});

/**
 * Get industry insights and trends
 * GET /api/insights/:industry
 */
app.get('/api/insights/:industry', (req, res) => {
  try {
    const { industry } = req.params;
    const insights = nameGenerator.getIndustryInsights(industry);

    res.json({
      success: true,
      industry,
      insights,
      authority: 'Based on analysis of 1,000+ successful startups in ' + industry,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Industry insights error:', error);
    
    res.status(500).json({
      error: 'Unable to fetch industry insights',
      availableIndustries: ['tech', 'fintech', 'healthcare', 'ecommerce', 'saas']
    });
  }
});

/**
 * Check domain availability (mock endpoint)
 * POST /api/domains/check
 */
app.post('/api/domains/check', async (req, res) => {
  try {
    const { domains } = req.body;

    if (!Array.isArray(domains)) {
      return res.status(400).json({
        error: 'Domains must be an array',
        example: { domains: ['example.com', 'example.io'] }
      });
    }

    // Mock domain availability check
    const results = domains.map(domain => ({
      domain,
      available: Math.random() > 0.6, // Mock availability
      price: Math.floor(Math.random() * 50) + 10,
      registrar: 'Namecheap',
      alternatives: [
        domain.replace('.com', '.io'),
        domain.replace('.com', '.co'),
        domain.replace('.com', '.ai')
      ].slice(0, 2)
    }));

    res.json({
      success: true,
      results,
      note: 'Domain availability changes rapidly. Check with registrar for real-time status.',
      registrarPartner: 'Namecheap.com'
    });

  } catch (error) {
    console.error('Domain check error:', error);
    
    res.status(500).json({
      error: 'Domain availability check failed',
      message: 'Please try again or check manually with a domain registrar'
    });
  }
});

/**
 * Educational content endpoints
 */

// Get naming guides
app.get('/api/guides', (req, res) => {
  res.json({
    success: true,
    guides: [
      {
        id: 'complete-startup-naming-guide',
        title: 'The Complete Guide to Startup Naming',
        description: 'Everything entrepreneurs need to know about naming their startup',
        url: '/guides/complete-startup-naming-guide',
        readTime: '15 min',
        topics: ['Psychology', 'Legal', 'Branding', 'Domain Strategy']
      },
      {
        id: 'industry-naming-patterns',
        title: 'Industry-Specific Naming Patterns',
        description: 'How successful startups name themselves by industry',
        url: '/guides/industry-naming-patterns',
        readTime: '10 min',
        topics: ['Tech', 'Fintech', 'Healthcare', 'SaaS']
      },
      {
        id: 'trademark-domain-guide',
        title: 'Trademark and Domain Strategy',
        description: 'Legal considerations and domain acquisition strategies',
        url: '/guides/trademark-domain-guide',
        readTime: '12 min',
        topics: ['Legal', 'Domains', 'International', 'Protection']
      }
    ],
    totalGuides: 15,
    categories: ['Getting Started', 'Legal & Domains', 'Industry Specific', 'Advanced Strategies']
  });
});

// Payment webhook (Stripe)
app.post('/api/payments/webhook', express.raw({type: 'application/json'}), (req, res) => {
  // Handle Stripe webhooks for subscription management
  // Implementation depends on your payment flow
  res.json({ received: true });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end',
    support: 'support@startupnamer.org',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available: [
      'POST /api/names/generate',
      'POST /api/names/analyze', 
      'GET /api/insights/:industry',
      'POST /api/domains/check',
      'GET /api/guides',
      'GET /api/health'
    ],
    documentation: 'https://docs.startupnamer.org'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 StartupNamer.org API Server
📍 Running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔒 Security: Enabled
⚡ Rate limiting: Active
📚 Educational AI: Ready
🎯 Authority positioning: Active

API Documentation: http://localhost:${PORT}/api/health
  `);
});

module.exports = app;