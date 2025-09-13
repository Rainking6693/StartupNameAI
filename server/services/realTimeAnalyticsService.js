const { telemetryHelpers } = require('../config/telemetry');
const { EventEmitter } = require('events');

class RealTimeAnalyticsService extends EventEmitter {
  constructor() {
    super();
    this.eventBuffer = [];
    this.analyticsMetrics = {
      events_processed: 0,
      events_per_second: 0,
      active_users: new Set(),
      session_count: 0,
      conversion_events: 0,
      error_events: 0
    };
    
    this.eventTypes = {
      USER_SESSION_START: 'user_session_start',
      USER_SESSION_END: 'user_session_end',
      NAME_GENERATION_REQUEST: 'name_generation_request',
      NAME_GENERATION_COMPLETE: 'name_generation_complete',
      NAME_SELECTION: 'name_selection',
      PAYMENT_INITIATED: 'payment_initiated',
      PAYMENT_COMPLETED: 'payment_completed',
      USER_FEEDBACK: 'user_feedback',
      ERROR_OCCURRED: 'error_occurred',
      FEATURE_USAGE: 'feature_usage',
      PAGE_VIEW: 'page_view',
      API_CALL: 'api_call'
    };
    
    this.realTimeInsights = {
      trending_keywords: new Map(),
      popular_industries: new Map(),
      conversion_funnel: {
        visitors: 0,
        name_generators: 0,
        name_selectors: 0,
        payment_initiators: 0,
        customers: 0
      },
      performance_metrics: {
        avg_response_time: 0,
        error_rate: 0,
        user_satisfaction: 0
      }
    };
    
    this.userSessions = new Map();
    this.isProcessing = false;
    
    this.initializeAnalytics();
  }

  // Initialize real-time analytics
  async initializeAnalytics() {
    try {
      this.startEventProcessing();
      this.initializeMetricsCollection();
      this.setupInsightGeneration();
      this.initializeAlertSystem();
      
      console.log('✅ Real-time analytics service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize real-time analytics:', error);
    }
  }

  // Track user events
  async trackEvent(eventType, eventData, userId = null, sessionId = null) {
    return telemetryHelpers.createSpan('track_analytics_event', async (span) => {
      try {
        const event = {
          id: this.generateEventId(),
          type: eventType,
          data: eventData,
          user_id: userId,
          session_id: sessionId,
          timestamp: Date.now(),
          ip_address: eventData.ip_address || null,
          user_agent: eventData.user_agent || null,
          metadata: {
            source: 'real_time_analytics',
            version: '1.0.0'
          }
        };

        // Add to event buffer for processing
        this.eventBuffer.push(event);
        
        // Update real-time metrics
        this.updateRealTimeMetrics(event);
        
        // Emit event for real-time listeners
        this.emit('event', event);
        
        span.setAttributes({
          'analytics.event_type': eventType,
          'analytics.user_id': userId || 'anonymous',
          'analytics.session_id': sessionId || 'no_session',
          'analytics.buffer_size': this.eventBuffer.length
        });

        // Process high-priority events immediately
        if (this.isHighPriorityEvent(eventType)) {
          await this.processEventImmediate(event);
        }

        return event.id;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to track analytics event:', error);
        return null;
      }
    });
  }

  // Start event processing loop
  startEventProcessing() {
    setInterval(() => {
      if (!this.isProcessing && this.eventBuffer.length > 0) {
        this.processEventBatch();
      }
    }, 1000); // Process every second

    // Process larger batches less frequently
    setInterval(() => {
      this.generateRealTimeInsights();
    }, 10000); // Generate insights every 10 seconds
  }

  // Process batch of events
  async processEventBatch() {
    if (this.isProcessing || this.eventBuffer.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const batchSize = Math.min(100, this.eventBuffer.length);
      const batch = this.eventBuffer.splice(0, batchSize);

      await this.processBatch(batch);
      
      this.analyticsMetrics.events_processed += batch.length;
      
      console.log(`📊 Processed ${batch.length} analytics events`);

    } finally {
      this.isProcessing = false;
    }
  }

  // Process individual batch
  async processBatch(events) {
    return telemetryHelpers.createSpan('process_analytics_batch', async (span) => {
      try {
        // Group events by type for efficient processing
        const eventGroups = this.groupEventsByType(events);
        
        // Process each group
        for (const [eventType, eventList] of eventGroups) {
          await this.processEventGroup(eventType, eventList);
        }

        // Update session tracking
        await this.updateSessionTracking(events);
        
        // Generate real-time insights
        await this.updateRealTimeInsights(events);

        span.setAttributes({
          'analytics.batch_size': events.length,
          'analytics.event_types': Object.keys(eventGroups).length,
          'analytics.processing_time': Date.now()
        });

      } catch (error) {
        span.recordException(error);
        console.error('Failed to process analytics batch:', error);
      }
    });
  }

  // Process events by type
  async processEventGroup(eventType, events) {
    switch (eventType) {
      case this.eventTypes.USER_SESSION_START:
        await this.processSessionStartEvents(events);
        break;
      
      case this.eventTypes.NAME_GENERATION_REQUEST:
        await this.processNameGenerationEvents(events);
        break;
      
      case this.eventTypes.NAME_SELECTION:
        await this.processNameSelectionEvents(events);
        break;
      
      case this.eventTypes.PAYMENT_COMPLETED:
        await this.processPaymentEvents(events);
        break;
      
      case this.eventTypes.USER_FEEDBACK:
        await this.processFeedbackEvents(events);
        break;
      
      case this.eventTypes.ERROR_OCCURRED:
        await this.processErrorEvents(events);
        break;
      
      default:
        await this.processGenericEvents(events);
    }
  }

  // Process session start events
  async processSessionStartEvents(events) {
    for (const event of events) {
      const sessionData = {
        session_id: event.session_id,
        user_id: event.user_id,
        start_time: event.timestamp,
        ip_address: event.data.ip_address,
        user_agent: event.data.user_agent,
        referrer: event.data.referrer,
        utm_source: event.data.utm_source,
        utm_medium: event.data.utm_medium,
        utm_campaign: event.data.utm_campaign
      };

      this.userSessions.set(event.session_id, sessionData);
      this.analyticsMetrics.session_count++;
      
      if (event.user_id) {
        this.analyticsMetrics.active_users.add(event.user_id);
      }
    }
  }

  // Process name generation events
  async processNameGenerationEvents(events) {
    for (const event of events) {
      const { keywords, industry, style, count } = event.data;
      
      // Track trending keywords
      if (keywords) {
        keywords.forEach(keyword => {
          const current = this.realTimeInsights.trending_keywords.get(keyword) || 0;
          this.realTimeInsights.trending_keywords.set(keyword, current + 1);
        });
      }
      
      // Track popular industries
      if (industry) {
        const current = this.realTimeInsights.popular_industries.get(industry) || 0;
        this.realTimeInsights.popular_industries.set(industry, current + 1);
      }
      
      // Update conversion funnel
      this.realTimeInsights.conversion_funnel.name_generators++;
    }
  }

  // Process name selection events
  async processNameSelectionEvents(events) {
    for (const event of events) {
      const { selected_name, brandability_score, user_rating } = event.data;
      
      // Update conversion funnel
      this.realTimeInsights.conversion_funnel.name_selectors++;
      
      // Track name quality preferences
      if (brandability_score && user_rating) {
        this.updateQualityPreferences(brandability_score, user_rating);
      }
    }
  }

  // Process payment events
  async processPaymentEvents(events) {
    for (const event of events) {
      this.analyticsMetrics.conversion_events++;
      this.realTimeInsights.conversion_funnel.customers++;
      
      // Track revenue metrics
      if (event.data.amount) {
        this.updateRevenueMetrics(event.data);
      }
    }
  }

  // Process feedback events
  async processFeedbackEvents(events) {
    let totalRating = 0;
    let ratingCount = 0;
    
    for (const event of events) {
      if (event.data.rating) {
        totalRating += event.data.rating;
        ratingCount++;
      }
    }
    
    if (ratingCount > 0) {
      const avgRating = totalRating / ratingCount;
      this.realTimeInsights.performance_metrics.user_satisfaction = 
        (this.realTimeInsights.performance_metrics.user_satisfaction + avgRating) / 2;
    }
  }

  // Process error events
  async processErrorEvents(events) {
    this.analyticsMetrics.error_events += events.length;
    
    // Update error rate
    const totalEvents = this.analyticsMetrics.events_processed + events.length;
    this.realTimeInsights.performance_metrics.error_rate = 
      (this.analyticsMetrics.error_events / totalEvents) * 100;
    
    // Alert on high error rates
    if (this.realTimeInsights.performance_metrics.error_rate > 5) {
      this.emit('alert', {
        type: 'high_error_rate',
        value: this.realTimeInsights.performance_metrics.error_rate,
        threshold: 5
      });
    }
  }

  // Process generic events
  async processGenericEvents(events) {
    // Basic event counting and metadata tracking
    for (const event of events) {
      // Update general metrics
      this.updateGeneralMetrics(event);
    }
  }

  // Update real-time metrics
  updateRealTimeMetrics(event) {
    // Update events per second
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    
    // Count events in last second
    const recentEvents = this.eventBuffer.filter(e => e.timestamp > oneSecondAgo);
    this.analyticsMetrics.events_per_second = recentEvents.length;
    
    // Update conversion funnel based on event type
    switch (event.type) {
      case this.eventTypes.PAGE_VIEW:
        this.realTimeInsights.conversion_funnel.visitors++;
        break;
      case this.eventTypes.PAYMENT_INITIATED:
        this.realTimeInsights.conversion_funnel.payment_initiators++;
        break;
    }
  }

  // Generate real-time insights
  async generateRealTimeInsights() {
    return telemetryHelpers.createSpan('generate_realtime_insights', async (span) => {
      try {
        // Calculate conversion rates
        const funnel = this.realTimeInsights.conversion_funnel;
        const insights = {
          conversion_rates: {
            visitor_to_generator: funnel.visitors > 0 ? (funnel.name_generators / funnel.visitors) * 100 : 0,
            generator_to_selector: funnel.name_generators > 0 ? (funnel.name_selectors / funnel.name_generators) * 100 : 0,
            selector_to_customer: funnel.name_selectors > 0 ? (funnel.customers / funnel.name_selectors) * 100 : 0,
            overall_conversion: funnel.visitors > 0 ? (funnel.customers / funnel.visitors) * 100 : 0
          },
          trending_data: {
            top_keywords: this.getTopItems(this.realTimeInsights.trending_keywords, 10),
            popular_industries: this.getTopItems(this.realTimeInsights.popular_industries, 5),
            active_users: this.analyticsMetrics.active_users.size,
            events_per_second: this.analyticsMetrics.events_per_second
          },
          performance_summary: {
            ...this.realTimeInsights.performance_metrics,
            total_events: this.analyticsMetrics.events_processed,
            active_sessions: this.userSessions.size
          }
        };

        // Emit insights for real-time dashboards
        this.emit('insights', insights);
        
        span.setAttributes({
          'insights.conversion_rate': insights.conversion_rates.overall_conversion,
          'insights.active_users': insights.trending_data.active_users,
          'insights.events_per_second': insights.trending_data.events_per_second
        });

        return insights;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to generate real-time insights:', error);
        return null;
      }
    });
  }

  // Get user analytics
  async getUserAnalytics(userId, timeRange = '24h') {
    return telemetryHelpers.createSpan('get_user_analytics', async (span) => {
      try {
        const userEvents = this.getUserEvents(userId, timeRange);
        
        const analytics = {
          user_id: userId,
          time_range: timeRange,
          session_count: this.getUserSessionCount(userId, timeRange),
          total_events: userEvents.length,
          event_breakdown: this.getEventBreakdown(userEvents),
          behavior_patterns: this.analyzeBehaviorPatterns(userEvents),
          engagement_score: this.calculateEngagementScore(userEvents),
          conversion_status: this.getConversionStatus(userEvents)
        };

        span.setAttributes({
          'user_analytics.user_id': userId,
          'user_analytics.session_count': analytics.session_count,
          'user_analytics.total_events': analytics.total_events,
          'user_analytics.engagement_score': analytics.engagement_score
        });

        return analytics;

      } catch (error) {
        span.recordException(error);
        throw error;
      }
    });
  }

  // Get system analytics
  async getSystemAnalytics(timeRange = '1h') {
    return {
      time_range: timeRange,
      current_metrics: this.analyticsMetrics,
      real_time_insights: this.realTimeInsights,
      system_health: {
        events_processed: this.analyticsMetrics.events_processed,
        processing_rate: this.analyticsMetrics.events_per_second,
        error_rate: this.realTimeInsights.performance_metrics.error_rate,
        active_sessions: this.userSessions.size,
        buffer_size: this.eventBuffer.length
      },
      trending_data: {
        keywords: this.getTopItems(this.realTimeInsights.trending_keywords, 20),
        industries: this.getTopItems(this.realTimeInsights.popular_industries, 10)
      }
    };
  }

  // Utility methods
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isHighPriorityEvent(eventType) {
    const highPriorityEvents = [
      this.eventTypes.ERROR_OCCURRED,
      this.eventTypes.PAYMENT_COMPLETED,
      this.eventTypes.USER_FEEDBACK
    ];
    return highPriorityEvents.includes(eventType);
  }

  async processEventImmediate(event) {
    // Process high-priority events immediately
    if (event.type === this.eventTypes.ERROR_OCCURRED) {
      this.emit('error_alert', event);
    } else if (event.type === this.eventTypes.PAYMENT_COMPLETED) {
      this.emit('conversion_alert', event);
    }
  }

  groupEventsByType(events) {
    const groups = new Map();
    
    for (const event of events) {
      if (!groups.has(event.type)) {
        groups.set(event.type, []);
      }
      groups.get(event.type).push(event);
    }
    
    return groups;
  }

  updateSessionTracking(events) {
    for (const event of events) {
      if (event.session_id && this.userSessions.has(event.session_id)) {
        const session = this.userSessions.get(event.session_id);
        session.last_activity = event.timestamp;
        session.event_count = (session.event_count || 0) + 1;
      }
    }
  }

  updateRealTimeInsights(events) {
    // Update insights based on processed events
    for (const event of events) {
      this.updateGeneralMetrics(event);
    }
  }

  updateGeneralMetrics(event) {
    // Update general analytics metrics
    if (event.data && event.data.response_time) {
      const currentAvg = this.realTimeInsights.performance_metrics.avg_response_time;
      this.realTimeInsights.performance_metrics.avg_response_time = 
        (currentAvg + event.data.response_time) / 2;
    }
  }

  updateQualityPreferences(brandabilityScore, userRating) {
    // Track correlation between brandability scores and user ratings
    // This data can be used for ML model training
  }

  updateRevenueMetrics(paymentData) {
    // Track revenue-related metrics
    // This would integrate with business intelligence
  }

  getTopItems(map, limit) {
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([item, count]) => ({ item, count }));
  }

  getUserEvents(userId, timeRange) {
    // This would query stored events for the user
    // For now, return empty array as events are processed in real-time
    return [];
  }

  getUserSessionCount(userId, timeRange) {
    // Count user sessions in time range
    let count = 0;
    for (const [sessionId, session] of this.userSessions) {
      if (session.user_id === userId) {
        count++;
      }
    }
    return count;
  }

  getEventBreakdown(events) {
    const breakdown = {};
    for (const event of events) {
      breakdown[event.type] = (breakdown[event.type] || 0) + 1;
    }
    return breakdown;
  }

  analyzeBehaviorPatterns(events) {
    // Analyze user behavior patterns
    return {
      most_active_time: 'afternoon',
      preferred_features: ['name_generation', 'brandability_analysis'],
      session_duration_avg: 300000 // 5 minutes
    };
  }

  calculateEngagementScore(events) {
    // Calculate user engagement score based on events
    return Math.min(100, events.length * 5); // Simple scoring
  }

  getConversionStatus(events) {
    const hasPayment = events.some(e => e.type === this.eventTypes.PAYMENT_COMPLETED);
    const hasSelection = events.some(e => e.type === this.eventTypes.NAME_SELECTION);
    const hasGeneration = events.some(e => e.type === this.eventTypes.NAME_GENERATION_REQUEST);
    
    if (hasPayment) return 'converted';
    if (hasSelection) return 'engaged';
    if (hasGeneration) return 'active';
    return 'visitor';
  }

  initializeMetricsCollection() {
    // Set up metrics collection intervals
    setInterval(() => {
      this.cleanupOldSessions();
    }, 300000); // Clean up every 5 minutes
  }

  setupInsightGeneration() {
    // Set up automated insight generation
    setInterval(() => {
      this.generateAutomatedInsights();
    }, 60000); // Generate insights every minute
  }

  initializeAlertSystem() {
    // Set up alert thresholds and monitoring
    this.on('alert', (alert) => {
      console.warn(`🚨 Analytics Alert: ${alert.type} - ${alert.value} (threshold: ${alert.threshold})`);
    });
  }

  cleanupOldSessions() {
    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    
    for (const [sessionId, session] of this.userSessions) {
      if (now - (session.last_activity || session.start_time) > sessionTimeout) {
        this.userSessions.delete(sessionId);
      }
    }
  }

  async generateAutomatedInsights() {
    // Generate automated insights and alerts
    const insights = await this.generateRealTimeInsights();
    
    if (insights) {
      // Check for anomalies and generate alerts
      this.checkForAnomalies(insights);
    }
  }

  checkForAnomalies(insights) {
    // Check for unusual patterns and generate alerts
    if (insights.conversion_rates.overall_conversion < 1) {
      this.emit('alert', {
        type: 'low_conversion_rate',
        value: insights.conversion_rates.overall_conversion,
        threshold: 1
      });
    }
  }

  // Health check
  async healthCheck() {
    return {
      status: 'healthy',
      events_processed: this.analyticsMetrics.events_processed,
      events_per_second: this.analyticsMetrics.events_per_second,
      active_users: this.analyticsMetrics.active_users.size,
      active_sessions: this.userSessions.size,
      buffer_size: this.eventBuffer.length,
      processing_status: this.isProcessing ? 'processing' : 'idle'
    };
  }
}

module.exports = new RealTimeAnalyticsService();