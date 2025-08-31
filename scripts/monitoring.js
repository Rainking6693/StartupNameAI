#!/usr/bin/env node

/**
 * Production monitoring and alerting system for StartupnameAI
 * Monitors performance, uptime, SEO metrics, and business KPIs
 */

const axios = require('axios');
const fs = require('fs').promises;

class ProductionMonitor {
  constructor() {
    this.config = {
      baseUrl: process.env.MONITOR_URL || 'https://startupnamer.org',
      slackWebhook: process.env.SLACK_WEBHOOK_URL,
      emailWebhook: process.env.EMAIL_WEBHOOK_URL,
      checkInterval: 60000, // 1 minute
      performanceThresholds: {
        responseTime: 2000, // 2 seconds
        availability: 99.9,
        errorRate: 1.0 // 1%
      },
      seoThresholds: {
        lighthouseScore: 90,
        coreWebVitals: {
          lcp: 2500, // Largest Contentful Paint in ms
          fid: 100,  // First Input Delay in ms
          cls: 0.1   // Cumulative Layout Shift
        }
      }
    };
    
    this.metrics = {
      uptime: [],
      responseTime: [],
      errors: [],
      performance: []
    };
    
    this.isRunning = false;
  }

  /**
   * Start continuous monitoring
   */
  async start() {
    console.log('🚀 Starting production monitoring...');
    this.isRunning = true;
    
    // Initial health check
    await this.runHealthCheck();
    
    // Start periodic monitoring
    setInterval(async () => {
      if (this.isRunning) {
        await this.runHealthCheck();
        await this.checkPerformanceMetrics();
        await this.validateSEOHealth();
        await this.generateHourlyReport();
      }
    }, this.config.checkInterval);
    
    // Daily deep check
    setInterval(async () => {
      if (this.isRunning) {
        await this.runDeepHealthCheck();
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    console.log('✅ Monitoring started successfully');
  }

  /**
   * Basic health check
   */
  async runHealthCheck() {
    const timestamp = new Date().toISOString();
    console.log(`🔍 Running health check at ${timestamp}`);
    
    try {
      // Check main endpoints
      const endpoints = [
        { url: '/', name: 'Homepage' },
        { url: '/naming-tool', name: 'Naming Tool' },
        { url: '/pricing', name: 'Pricing Page' },
        { url: '/api/health', name: 'API Health' }
      ];
      
      const results = await Promise.allSettled(
        endpoints.map(endpoint => this.checkEndpoint(endpoint))
      );
      
      // Process results
      results.forEach((result, index) => {
        const endpoint = endpoints[index];
        
        if (result.status === 'fulfilled' && result.value.success) {
          this.metrics.uptime.push({
            timestamp,
            endpoint: endpoint.name,
            status: 'up',
            responseTime: result.value.responseTime
          });
          
          this.metrics.responseTime.push({
            timestamp,
            endpoint: endpoint.name,
            time: result.value.responseTime
          });
        } else {
          const error = result.status === 'rejected' ? result.reason : result.value.error;
          
          this.metrics.uptime.push({
            timestamp,
            endpoint: endpoint.name,
            status: 'down',
            error: error.message
          });
          
          // Alert on endpoint failure
          await this.sendAlert({
            level: 'critical',
            title: `🚨 Endpoint Down: ${endpoint.name}`,
            message: `${endpoint.url} is not responding properly`,
            error: error.message,
            timestamp
          });
        }
      });
      
      // Check response time alerts
      await this.checkResponseTimeThresholds();
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      await this.sendAlert({
        level: 'critical',
        title: '🚨 Health Check System Failure',
        message: 'The monitoring system itself has encountered an error',
        error: error.message,
        timestamp
      });
    }
  }

  /**
   * Check individual endpoint
   */
  async checkEndpoint(endpoint) {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${this.config.baseUrl}${endpoint.url}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500, // Only treat 5xx as errors
        headers: {
          'User-Agent': 'StartupnameAI-Monitor/1.0'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: response.status < 400,
        responseTime,
        status: response.status,
        contentLength: response.headers['content-length'] || 0
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        success: false,
        responseTime,
        error: {
          message: error.message,
          code: error.code
        }
      };
    }
  }

  /**
   * Send alert to configured channels
   */
  async sendAlert(alert) {
    console.log(`🚨 Alert [${alert.level.toUpperCase()}]: ${alert.title}`);
    console.log(`   Message: ${alert.message}`);
    
    try {
      // Send to Slack if configured
      if (this.config.slackWebhook) {
        await this.sendSlackAlert(alert);
      }
      
      // Send email if configured
      if (this.config.emailWebhook) {
        await this.sendEmailAlert(alert);
      }
      
      // Log to file
      await this.logAlert(alert);
      
    } catch (error) {
      console.error('❌ Failed to send alert:', error);
    }
  }

  /**
   * Send Slack notification
   */
  async sendSlackAlert(alert) {
    const color = {
      critical: '#ff0000',
      warning: '#ffaa00',
      info: '#0088ff'
    }[alert.level] || '#cccccc';
    
    const payload = {
      attachments: [{
        color,
        title: alert.title,
        text: alert.message,
        footer: 'StartupnameAI Monitor',
        ts: Math.floor(new Date(alert.timestamp).getTime() / 1000),
        fields: alert.error ? [{
          title: 'Error Details',
          value: alert.error,
          short: false
        }] : []
      }]
    };
    
    await axios.post(this.config.slackWebhook, payload);
  }

  /**
   * Stop monitoring
   */
  stop() {
    console.log('🛑 Stopping monitoring...');
    this.isRunning = false;
  }
}

// Run if called directly
if (require.main === module) {
  const monitor = new ProductionMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    monitor.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    monitor.stop();
    process.exit(0);
  });
  
  // Start monitoring
  monitor.start().catch(error => {
    console.error('Failed to start monitoring:', error);
    process.exit(1);
  });
}

module.exports = ProductionMonitor;