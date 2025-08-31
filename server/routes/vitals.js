const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { logger } = require('../middleware/errorHandler');
const { pool } = require('../config/database');

const router = express.Router();

// Rate limiting for vitals endpoint (more permissive than other endpoints)
const vitalsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // 100 requests per 5 minutes per IP
  message: {
    error: 'Too many vitals reports. Please reduce frequency.',
    retryAfter: 5 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for trusted origins
    const trustedOrigins = (process.env.VITALS_TRUSTED_ORIGINS || '').split(',');
    return trustedOrigins.includes(req.get('origin'));
  }
});

// Validation middleware for Web Vitals data
const validateVitalsData = [
  body('url')
    .isURL({ protocols: ['http', 'https'] })
    .isLength({ max: 2000 })
    .withMessage('Valid URL required (max 2000 chars)'),
  body('metrics')
    .isObject()
    .withMessage('Metrics object required'),
  body('metrics.LCP')
    .optional()
    .isFloat({ min: 0, max: 30000 })
    .withMessage('LCP must be between 0 and 30000ms'),
  body('metrics.INP')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('INP must be between 0 and 10000ms'),
  body('metrics.CLS')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('CLS must be between 0 and 10'),
  body('metrics.FCP')
    .optional()
    .isFloat({ min: 0, max: 30000 })
    .withMessage('FCP must be between 0 and 30000ms'),
  body('metrics.TTFB')
    .optional()
    .isFloat({ min: 0, max: 30000 })
    .withMessage('TTFB must be between 0 and 30000ms'),
  body('userAgent')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('User agent too long'),
  body('connection')
    .optional()
    .isObject()
    .withMessage('Connection info must be object'),
  body('navigation')
    .optional()
    .isObject()
    .withMessage('Navigation info must be object'),
  body('sessionId')
    .optional()
    .isUUID()
    .withMessage('Invalid session ID format'),
  body('userId')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID format')
];

// POST /api/vitals - Collect Web Vitals metrics
router.post('/', vitalsLimiter, validateVitalsData, async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vitals data',
        errors: errors.array()
      });
    }

    const {
      url,
      metrics,
      userAgent,
      connection = {},
      navigation = {},
      sessionId = null,
      userId = null,
      timestamp = new Date().toISOString()
    } = req.body;

    // Extract relevant data
    const vitalsData = {
      url: sanitizeUrl(url),
      lcp: metrics.LCP || null,
      inp: metrics.INP || null,
      cls: metrics.CLS || null,
      fcp: metrics.FCP || null,
      ttfb: metrics.TTFB || null,
      userAgent: sanitizeUserAgent(userAgent),
      connectionType: connection.effectiveType || null,
      connectionSpeed: connection.downlink || null,
      navigationType: navigation.type || null,
      sessionId,
      userId,
      ip: req.ip,
      timestamp: new Date(timestamp),
      createdAt: new Date()
    };

    // Store vitals data
    const vitalsId = await storeVitalsData(vitalsData);

    // Log for monitoring
    logger.info('Web Vitals collected:', {
      vitalsId,
      url: vitalsData.url,
      lcp: vitalsData.lcp,
      inp: vitalsData.inp,
      cls: vitalsData.cls,
      ip: req.ip
    });

    // Calculate performance score
    const performanceScore = calculatePerformanceScore(metrics);
    
    // Check for performance issues and alert if necessary
    if (performanceScore < 60) {
      logger.warn('Poor performance detected:', {
        url: vitalsData.url,
        score: performanceScore,
        metrics
      });
    }

    res.status(201).json({
      success: true,
      message: 'Web Vitals recorded successfully',
      data: {
        id: vitalsId,
        performanceScore,
        recommendations: generatePerformanceRecommendations(metrics),
        timestamp: vitalsData.createdAt.toISOString()
      }
    });

  } catch (error) {
    logger.error('Vitals collection failed:', error);
    // Don't fail the user experience for vitals collection errors
    res.status(200).json({
      success: true,
      message: 'Vitals data received (processing asynchronously)',
      data: { processed: false }
    });
  }
});

// GET /api/vitals/summary - Get performance summary
router.get('/summary', async (req, res, next) => {
  try {
    const {
      url,
      period = '24h',
      userId = null
    } = req.query;

    const summary = await getVitalsSummary({ url, period, userId });

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('Vitals summary failed:', error);
    next(error);
  }
});

// GET /api/vitals/health - Health check for vitals collection
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Web Vitals Collection',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      collect: 'POST /api/vitals',
      summary: 'GET /api/vitals/summary',
      health: 'GET /api/vitals/health'
    },
    metrics_supported: ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'],
    rate_limit: {
      window: '5 minutes',
      max_requests: 100
    }
  });
});

// POST /api/vitals/batch - Collect multiple vitals in batch
router.post('/batch', vitalsLimiter, [
  body('vitals')
    .isArray({ min: 1, max: 10 })
    .withMessage('Vitals array required (1-10 items)'),
  body('vitals.*').custom((value) => {
    // Each item should match the single vitals validation
    if (!value.url || !value.metrics) {
      throw new Error('Each vitals entry must have url and metrics');
    }
    return true;
  })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid batch vitals data',
        errors: errors.array()
      });
    }

    const { vitals } = req.body;
    const results = [];

    for (const vitalEntry of vitals) {
      try {
        const vitalsData = {
          url: sanitizeUrl(vitalEntry.url),
          lcp: vitalEntry.metrics.LCP || null,
          inp: vitalEntry.metrics.INP || null,
          cls: vitalEntry.metrics.CLS || null,
          fcp: vitalEntry.metrics.FCP || null,
          ttfb: vitalEntry.metrics.TTFB || null,
          userAgent: sanitizeUserAgent(vitalEntry.userAgent),
          connectionType: vitalEntry.connection?.effectiveType || null,
          connectionSpeed: vitalEntry.connection?.downlink || null,
          navigationType: vitalEntry.navigation?.type || null,
          sessionId: vitalEntry.sessionId || null,
          userId: vitalEntry.userId || null,
          ip: req.ip,
          timestamp: new Date(vitalEntry.timestamp || Date.now()),
          createdAt: new Date()
        };

        const vitalsId = await storeVitalsData(vitalsData);
        results.push({
          success: true,
          id: vitalsId,
          url: vitalsData.url
        });
      } catch (error) {
        results.push({
          success: false,
          url: vitalEntry.url,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    res.status(201).json({
      success: true,
      message: `Processed ${successCount}/${vitals.length} vitals entries`,
      data: {
        results,
        summary: {
          total: vitals.length,
          successful: successCount,
          failed: vitals.length - successCount
        }
      }
    });

  } catch (error) {
    logger.error('Batch vitals collection failed:', error);
    next(error);
  }
});

// Helper functions
async function storeVitalsData(data) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO web_vitals (
        url, lcp, inp, cls, fcp, ttfb, user_agent, connection_type, 
        connection_speed, navigation_type, session_id, user_id, 
        ip_address, timestamp, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING id
    `, [
      data.url, data.lcp, data.inp, data.cls, data.fcp, data.ttfb,
      data.userAgent, data.connectionType, data.connectionSpeed,
      data.navigationType, data.sessionId, data.userId,
      data.ip, data.timestamp, data.createdAt
    ]);
    
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

async function getVitalsSummary({ url, period, userId }) {
  const client = await pool.connect();
  try {
    let timeFilter;
    switch (period) {
      case '1h':
        timeFilter = "created_at > NOW() - INTERVAL '1 hour'";
        break;
      case '24h':
        timeFilter = "created_at > NOW() - INTERVAL '24 hours'";
        break;
      case '7d':
        timeFilter = "created_at > NOW() - INTERVAL '7 days'";
        break;
      case '30d':
        timeFilter = "created_at > NOW() - INTERVAL '30 days'";
        break;
      default:
        timeFilter = "created_at > NOW() - INTERVAL '24 hours'";
    }

    let urlFilter = '';
    let userFilter = '';
    const params = [];
    let paramIndex = 1;

    if (url) {
      urlFilter = `AND url = $${paramIndex}`;
      params.push(url);
      paramIndex++;
    }

    if (userId) {
      userFilter = `AND user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    const query = `
      SELECT 
        COUNT(*) as total_measurements,
        AVG(lcp) as avg_lcp,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY lcp) as p75_lcp,
        AVG(inp) as avg_inp,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY inp) as p75_inp,
        AVG(cls) as avg_cls,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY cls) as p75_cls,
        AVG(fcp) as avg_fcp,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY fcp) as p75_fcp,
        AVG(ttfb) as avg_ttfb,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ttfb) as p75_ttfb,
        COUNT(DISTINCT url) as unique_pages,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM web_vitals 
      WHERE ${timeFilter} ${urlFilter} ${userFilter}
    `;

    const result = await client.query(query, params);
    const stats = result.rows[0];

    return {
      period,
      url: url || 'all',
      userId: userId || 'all',
      totalMeasurements: parseInt(stats.total_measurements),
      uniquePages: parseInt(stats.unique_pages),
      uniqueSessions: parseInt(stats.unique_sessions),
      metrics: {
        lcp: {
          average: parseFloat(stats.avg_lcp) || null,
          p75: parseFloat(stats.p75_lcp) || null,
          rating: rateLCP(parseFloat(stats.p75_lcp))
        },
        inp: {
          average: parseFloat(stats.avg_inp) || null,
          p75: parseFloat(stats.p75_inp) || null,
          rating: rateINP(parseFloat(stats.p75_inp))
        },
        cls: {
          average: parseFloat(stats.avg_cls) || null,
          p75: parseFloat(stats.p75_cls) || null,
          rating: rateCLS(parseFloat(stats.p75_cls))
        },
        fcp: {
          average: parseFloat(stats.avg_fcp) || null,
          p75: parseFloat(stats.p75_fcp) || null,
          rating: rateFCP(parseFloat(stats.p75_fcp))
        },
        ttfb: {
          average: parseFloat(stats.avg_ttfb) || null,
          p75: parseFloat(stats.p75_ttfb) || null,
          rating: rateTTFB(parseFloat(stats.p75_ttfb))
        }
      },
      generatedAt: new Date().toISOString()
    };
  } finally {
    client.release();
  }
}

function calculatePerformanceScore(metrics) {
  let score = 100;
  
  // LCP scoring (0-50 points)
  if (metrics.LCP) {
    if (metrics.LCP <= 2500) score -= 0;
    else if (metrics.LCP <= 4000) score -= 20;
    else score -= 50;
  }
  
  // INP scoring (0-30 points)  
  if (metrics.INP) {
    if (metrics.INP <= 200) score -= 0;
    else if (metrics.INP <= 500) score -= 15;
    else score -= 30;
  }
  
  // CLS scoring (0-20 points)
  if (metrics.CLS) {
    if (metrics.CLS <= 0.1) score -= 0;
    else if (metrics.CLS <= 0.25) score -= 10;
    else score -= 20;
  }

  return Math.max(0, score);
}

function generatePerformanceRecommendations(metrics) {
  const recommendations = [];

  if (metrics.LCP > 4000) {
    recommendations.push({
      metric: 'LCP',
      issue: 'Poor Largest Contentful Paint',
      suggestion: 'Optimize images, remove unused CSS, and improve server response times',
      priority: 'high'
    });
  } else if (metrics.LCP > 2500) {
    recommendations.push({
      metric: 'LCP',
      issue: 'Needs Improvement for LCP',
      suggestion: 'Consider image optimization and critical resource prioritization',
      priority: 'medium'
    });
  }

  if (metrics.INP > 500) {
    recommendations.push({
      metric: 'INP',
      issue: 'Poor Interaction to Next Paint',
      suggestion: 'Reduce JavaScript execution time and optimize event handlers',
      priority: 'high'
    });
  } else if (metrics.INP > 200) {
    recommendations.push({
      metric: 'INP',
      issue: 'Needs Improvement for INP',
      suggestion: 'Review heavy JavaScript tasks and consider code splitting',
      priority: 'medium'
    });
  }

  if (metrics.CLS > 0.25) {
    recommendations.push({
      metric: 'CLS',
      issue: 'Poor Cumulative Layout Shift',
      suggestion: 'Set explicit dimensions for images and ads, avoid inserting content above existing content',
      priority: 'high'
    });
  } else if (metrics.CLS > 0.1) {
    recommendations.push({
      metric: 'CLS',
      issue: 'Needs Improvement for CLS',
      suggestion: 'Review dynamic content insertion and ensure stable layouts',
      priority: 'medium'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      metric: 'Overall',
      issue: 'Good performance',
      suggestion: 'Continue monitoring and maintain current optimization practices',
      priority: 'low'
    });
  }

  return recommendations;
}

function sanitizeUrl(url) {
  try {
    const parsed = new URL(url);
    // Remove sensitive query parameters
    parsed.search = '';
    return parsed.href.substring(0, 2000);
  } catch {
    return url.substring(0, 2000);
  }
}

function sanitizeUserAgent(userAgent) {
  if (!userAgent) return null;
  // Basic sanitization - remove potentially sensitive info
  return userAgent.replace(/\([^)]*\)/g, '()').substring(0, 500);
}

// Rating functions based on Web Vitals thresholds
function rateLCP(value) {
  if (!value) return null;
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
}

function rateINP(value) {
  if (!value) return null;
  if (value <= 200) return 'good';
  if (value <= 500) return 'needs-improvement';
  return 'poor';
}

function rateCLS(value) {
  if (!value) return null;
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
}

function rateFCP(value) {
  if (!value) return null;
  if (value <= 1800) return 'good';
  if (value <= 3000) return 'needs-improvement';
  return 'poor';
}

function rateTTFB(value) {
  if (!value) return null;
  if (value <= 800) return 'good';
  if (value <= 1800) return 'needs-improvement';
  return 'poor';
}

module.exports = router;