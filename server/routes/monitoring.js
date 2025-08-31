const express = require('express');
const { body, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { logger } = require('../middleware/errorHandler');
const { pool, checkDatabaseHealth } = require('../config/database');

const router = express.Router();

// Rate limiting for monitoring endpoints
const monitoringLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: 'Too many monitoring requests. Please reduce frequency.',
    retryAfter: 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false
});

// GET /api/monitoring/dashboard - Get performance dashboard data
router.get('/dashboard', monitoringLimiter, [
  query('period').optional().isIn(['1h', '24h', '7d', '30d']).withMessage('Invalid period'),
  query('url').optional().isURL().withMessage('Invalid URL format')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const { period = '24h', url } = req.query;
    
    // Get comprehensive dashboard data
    const [
      performanceMetrics,
      alertsSummary,
      topSlowPages,
      deviceBreakdown,
      connectionBreakdown,
      errorsSummary
    ] = await Promise.all([
      getPerformanceMetrics(period, url),
      getAlertsSummary(period),
      getTopSlowPages(period),
      getDeviceBreakdown(period, url),
      getConnectionBreakdown(period, url),
      getErrorsSummary(period, url)
    ]);

    const dashboardData = {
      period,
      url: url || 'all',
      generatedAt: new Date().toISOString(),
      performance: performanceMetrics,
      alerts: alertsSummary,
      topSlowPages,
      demographics: {
        devices: deviceBreakdown,
        connections: connectionBreakdown
      },
      errors: errorsSummary,
      recommendations: generatePerformanceRecommendations(performanceMetrics, alertsSummary)
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    logger.error('Dashboard data retrieval failed:', error);
    next(error);
  }
});

// GET /api/monitoring/alerts - Get active performance alerts
router.get('/alerts', monitoringLimiter, [
  query('status').optional().isIn(['open', 'acknowledged', 'resolved']).withMessage('Invalid status'),
  query('severity').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status = 'open', severity, limit = 50 } = req.query;
    
    const alerts = await getPerformanceAlerts({ status, severity, limit });

    res.json({
      success: true,
      data: {
        alerts,
        total: alerts.length,
        summary: {
          critical: alerts.filter(a => a.severity === 'critical').length,
          high: alerts.filter(a => a.severity === 'high').length,
          medium: alerts.filter(a => a.severity === 'medium').length,
          low: alerts.filter(a => a.severity === 'low').length
        }
      }
    });

  } catch (error) {
    logger.error('Alerts retrieval failed:', error);
    next(error);
  }
});

// POST /api/monitoring/alert - Create a performance alert
router.post('/alert', monitoringLimiter, [
  body('alertType').isString().notEmpty().withMessage('Alert type required'),
  body('url').isURL().withMessage('Valid URL required'),
  body('metricName').isString().notEmpty().withMessage('Metric name required'),
  body('thresholdValue').isFloat().withMessage('Threshold value must be a number'),
  body('actualValue').isFloat().withMessage('Actual value must be a number'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      alertType,
      url,
      metricName,
      thresholdValue,
      actualValue,
      severity = 'medium',
      notes
    } = req.body;

    const alertId = await createPerformanceAlert({
      alertType,
      url,
      metricName,
      thresholdValue,
      actualValue,
      severity,
      notes
    });

    res.status(201).json({
      success: true,
      data: {
        id: alertId,
        message: 'Performance alert created successfully'
      }
    });

  } catch (error) {
    logger.error('Alert creation failed:', error);
    next(error);
  }
});

// GET /api/monitoring/health - System health check
router.get('/health', async (req, res) => {
  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();
    
    // Check system metrics
    const systemMetrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };

    // Calculate overall health score
    let healthScore = 100;
    let issues = [];

    if (dbHealth.status !== 'healthy') {
      healthScore -= 50;
      issues.push('Database connectivity issues');
    }

    if (systemMetrics.memory.heapUsed > systemMetrics.memory.heapTotal * 0.9) {
      healthScore -= 20;
      issues.push('High memory usage');
    }

    const healthStatus = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'degraded' : 'unhealthy';

    res.json({
      status: healthStatus,
      score: healthScore,
      timestamp: systemMetrics.timestamp,
      uptime: systemMetrics.uptime,
      checks: {
        database: dbHealth,
        system: systemMetrics
      },
      issues
    });

  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      score: 0,
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/monitoring/metrics - Real-time metrics
router.get('/metrics', monitoringLimiter, async (req, res) => {
  try {
    const metrics = await getRealTimeMetrics();

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    logger.error('Metrics retrieval failed:', error);
    next(error);
  }
});

// Helper functions
async function getPerformanceMetrics(period, url) {
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
    const params = [];
    let paramIndex = 1;

    if (url) {
      urlFilter = `AND url = $${paramIndex}`;
      params.push(url);
      paramIndex++;
    }

    const query = `
      SELECT 
        COUNT(*) as total_measurements,
        AVG(lcp) as avg_lcp,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY lcp) as p75_lcp,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY lcp) as p95_lcp,
        AVG(inp) as avg_inp,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY inp) as p75_inp,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY inp) as p95_inp,
        AVG(cls) as avg_cls,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY cls) as p75_cls,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY cls) as p95_cls,
        AVG(fcp) as avg_fcp,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY fcp) as p75_fcp,
        AVG(ttfb) as avg_ttfb,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ttfb) as p75_ttfb,
        COUNT(DISTINCT url) as unique_pages,
        COUNT(DISTINCT session_id) as unique_sessions,
        -- Performance scores
        COUNT(*) FILTER (WHERE lcp <= 2500) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE lcp IS NOT NULL), 0) as lcp_good_rate,
        COUNT(*) FILTER (WHERE inp <= 200) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE inp IS NOT NULL), 0) as inp_good_rate,
        COUNT(*) FILTER (WHERE cls <= 0.1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE cls IS NOT NULL), 0) as cls_good_rate
      FROM web_vitals 
      WHERE ${timeFilter} ${urlFilter}
    `;

    const result = await client.query(query, params);
    const stats = result.rows[0];

    // Get time series data for trends
    const trendQuery = `
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        AVG(lcp) as avg_lcp,
        AVG(inp) as avg_inp,
        AVG(cls) as avg_cls,
        COUNT(*) as measurements
      FROM web_vitals
      WHERE ${timeFilter} ${urlFilter}
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY hour DESC
      LIMIT 24
    `;

    const trendResult = await client.query(trendQuery, params);

    return {
      summary: {
        totalMeasurements: parseInt(stats.total_measurements),
        uniquePages: parseInt(stats.unique_pages),
        uniqueSessions: parseInt(stats.unique_sessions)
      },
      coreWebVitals: {
        lcp: {
          average: parseFloat(stats.avg_lcp) || null,
          p75: parseFloat(stats.p75_lcp) || null,
          p95: parseFloat(stats.p95_lcp) || null,
          goodRate: parseFloat(stats.lcp_good_rate) || null,
          rating: rateLCP(parseFloat(stats.p75_lcp))
        },
        inp: {
          average: parseFloat(stats.avg_inp) || null,
          p75: parseFloat(stats.p75_inp) || null,
          p95: parseFloat(stats.p95_inp) || null,
          goodRate: parseFloat(stats.inp_good_rate) || null,
          rating: rateINP(parseFloat(stats.p75_inp))
        },
        cls: {
          average: parseFloat(stats.avg_cls) || null,
          p75: parseFloat(stats.p75_cls) || null,
          p95: parseFloat(stats.p95_cls) || null,
          goodRate: parseFloat(stats.cls_good_rate) || null,
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
      trends: trendResult.rows.map(row => ({
        hour: row.hour,
        lcp: parseFloat(row.avg_lcp) || null,
        inp: parseFloat(row.avg_inp) || null,
        cls: parseFloat(row.avg_cls) || null,
        measurements: parseInt(row.measurements)
      }))
    };

  } finally {
    client.release();
  }
}

async function getAlertsSummary(period) {
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

    const query = `
      SELECT 
        COUNT(*) as total_alerts,
        COUNT(*) FILTER (WHERE status = 'open') as open_alerts,
        COUNT(*) FILTER (WHERE severity = 'critical') as critical_alerts,
        COUNT(*) FILTER (WHERE severity = 'high') as high_alerts,
        COUNT(*) FILTER (WHERE severity = 'medium') as medium_alerts,
        COUNT(*) FILTER (WHERE severity = 'low') as low_alerts
      FROM performance_alerts 
      WHERE ${timeFilter}
    `;

    const result = await client.query(query);
    const stats = result.rows[0];

    return {
      total: parseInt(stats.total_alerts),
      open: parseInt(stats.open_alerts),
      bySeverity: {
        critical: parseInt(stats.critical_alerts),
        high: parseInt(stats.high_alerts),
        medium: parseInt(stats.medium_alerts),
        low: parseInt(stats.low_alerts)
      }
    };

  } finally {
    client.release();
  }
}

async function getTopSlowPages(period) {
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

    const query = `
      SELECT 
        url,
        COUNT(*) as measurements,
        AVG(lcp) as avg_lcp,
        AVG(inp) as avg_inp,
        AVG(cls) as avg_cls,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY lcp) as p75_lcp
      FROM web_vitals
      WHERE ${timeFilter} AND lcp IS NOT NULL
      GROUP BY url
      HAVING COUNT(*) >= 5
      ORDER BY avg_lcp DESC
      LIMIT 10
    `;

    const result = await client.query(query);

    return result.rows.map(row => ({
      url: row.url,
      measurements: parseInt(row.measurements),
      avgLcp: parseFloat(row.avg_lcp),
      avgInp: parseFloat(row.avg_inp) || null,
      avgCls: parseFloat(row.avg_cls) || null,
      p75Lcp: parseFloat(row.p75_lcp),
      rating: rateLCP(parseFloat(row.p75_lcp))
    }));

  } finally {
    client.release();
  }
}

async function getDeviceBreakdown(period, url) {
  // This would require device detection - placeholder implementation
  return {
    mobile: 60,
    desktop: 35,
    tablet: 5
  };
}

async function getConnectionBreakdown(period, url) {
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
    const params = [];
    if (url) {
      urlFilter = 'AND url = $1';
      params.push(url);
    }

    const query = `
      SELECT 
        connection_type,
        COUNT(*) as count,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
      FROM web_vitals
      WHERE ${timeFilter} ${urlFilter} AND connection_type IS NOT NULL
      GROUP BY connection_type
      ORDER BY count DESC
    `;

    const result = await client.query(query, params);
    
    const breakdown = {};
    result.rows.forEach(row => {
      breakdown[row.connection_type] = parseFloat(row.percentage);
    });

    return breakdown;

  } finally {
    client.release();
  }
}

async function getErrorsSummary(period, url) {
  // Placeholder for error tracking integration
  return {
    totalErrors: 5,
    criticalErrors: 1,
    topErrors: [
      {
        message: 'Script load timeout',
        count: 3,
        impact: 'high'
      },
      {
        message: 'Font loading failed',
        count: 2,
        impact: 'medium'
      }
    ]
  };
}

function generatePerformanceRecommendations(metrics, alerts) {
  const recommendations = [];

  if (metrics.coreWebVitals.lcp.p75 > 4000) {
    recommendations.push({
      priority: 'high',
      metric: 'LCP',
      issue: 'Poor Largest Contentful Paint performance',
      suggestion: 'Optimize images, implement lazy loading, and improve server response times',
      impact: 'SEO and user experience'
    });
  }

  if (metrics.coreWebVitals.inp.p75 > 500) {
    recommendations.push({
      priority: 'high',
      metric: 'INP',
      issue: 'Poor interaction responsiveness',
      suggestion: 'Reduce JavaScript execution time and optimize event handlers',
      impact: 'User experience and engagement'
    });
  }

  if (metrics.coreWebVitals.cls.p75 > 0.25) {
    recommendations.push({
      priority: 'high',
      metric: 'CLS',
      issue: 'High layout instability',
      suggestion: 'Set explicit dimensions for images and avoid inserting content above existing content',
      impact: 'User experience and SEO'
    });
  }

  if (alerts.open > 10) {
    recommendations.push({
      priority: 'medium',
      metric: 'Alerts',
      issue: 'High number of active performance alerts',
      suggestion: 'Review and resolve open performance alerts to maintain optimal user experience',
      impact: 'Overall system health'
    });
  }

  return recommendations;
}

// Rating functions
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

async function createPerformanceAlert(alertData) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO performance_alerts (
        alert_type, url, metric_name, threshold_value, actual_value, severity, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id
    `, [
      alertData.alertType,
      alertData.url,
      alertData.metricName,
      alertData.thresholdValue,
      alertData.actualValue,
      alertData.severity,
      alertData.notes || null
    ]);
    
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

async function getPerformanceAlerts({ status, severity, limit }) {
  const client = await pool.connect();
  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (severity) {
      whereClause += ` AND severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    const query = `
      SELECT *
      FROM performance_alerts
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex}
    `;
    
    params.push(limit);

    const result = await client.query(query, params);
    return result.rows;
    
  } finally {
    client.release();
  }
}

async function getRealTimeMetrics() {
  const client = await pool.connect();
  try {
    // Get metrics from the last 5 minutes
    const query = `
      SELECT 
        COUNT(*) as recent_measurements,
        AVG(lcp) as avg_lcp,
        AVG(inp) as avg_inp,
        AVG(cls) as avg_cls,
        COUNT(DISTINCT url) as active_pages
      FROM web_vitals
      WHERE created_at > NOW() - INTERVAL '5 minutes'
    `;

    const result = await client.query(query);
    const stats = result.rows[0];

    return {
      timestamp: new Date().toISOString(),
      period: '5 minutes',
      measurements: parseInt(stats.recent_measurements),
      activePages: parseInt(stats.active_pages),
      averages: {
        lcp: parseFloat(stats.avg_lcp) || null,
        inp: parseFloat(stats.avg_inp) || null,
        cls: parseFloat(stats.avg_cls) || null
      }
    };

  } finally {
    client.release();
  }
}

module.exports = router;