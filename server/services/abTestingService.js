const { telemetryHelpers } = require('../config/telemetry');

class ABTestingService {
  constructor() {
    this.activeTests = new Map();
    this.testResults = new Map();
    this.userAssignments = new Map();
    
    this.testConfigs = {
      statistical_significance: 0.95,
      minimum_sample_size: 100,
      maximum_test_duration: 30 * 24 * 60 * 60 * 1000, // 30 days
      minimum_test_duration: 7 * 24 * 60 * 60 * 1000,   // 7 days
      traffic_allocation: {
        control: 0.5,
        variant: 0.5
      }
    };
    
    this.testTypes = {
      FEATURE_FLAG: 'feature_flag',
      UI_VARIANT: 'ui_variant',
      ALGORITHM: 'algorithm',
      PRICING: 'pricing',
      CONTENT: 'content',
      WORKFLOW: 'workflow'
    };
    
    this.metrics = {
      conversion_rate: 'conversion_rate',
      user_engagement: 'user_engagement',
      revenue_per_user: 'revenue_per_user',
      session_duration: 'session_duration',
      feature_adoption: 'feature_adoption',
      user_satisfaction: 'user_satisfaction'
    };
    
    this.initializeABTesting();
  }

  // Initialize A/B testing service
  async initializeABTesting() {
    try {
      await this.loadActiveTests();
      this.setupTestMonitoring();
      this.initializeStatisticalAnalysis();
      
      console.log('✅ A/B testing service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize A/B testing service:', error);
    }
  }

  // Create a new A/B test
  async createTest(testConfig) {
    return telemetryHelpers.createSpan('ab_create_test', async (span) => {
      try {
        const test = {
          id: this.generateTestId(),
          name: testConfig.name,
          description: testConfig.description,
          type: testConfig.type,
          status: 'draft',
          created_at: Date.now(),
          created_by: testConfig.created_by,
          
          // Test configuration
          variants: testConfig.variants || [
            { id: 'control', name: 'Control', traffic_allocation: 0.5 },
            { id: 'variant_a', name: 'Variant A', traffic_allocation: 0.5 }
          ],
          
          // Targeting
          targeting: {
            audience: testConfig.audience || 'all_users',
            filters: testConfig.filters || {},
            traffic_percentage: testConfig.traffic_percentage || 100
          },
          
          // Metrics and goals
          primary_metric: testConfig.primary_metric,
          secondary_metrics: testConfig.secondary_metrics || [],
          success_criteria: testConfig.success_criteria,
          
          // Statistical configuration
          statistical_config: {
            significance_level: testConfig.significance_level || 0.95,
            minimum_detectable_effect: testConfig.minimum_detectable_effect || 0.05,
            power: testConfig.power || 0.8,
            minimum_sample_size: testConfig.minimum_sample_size || 100
          },
          
          // Duration
          planned_duration: testConfig.planned_duration || (14 * 24 * 60 * 60 * 1000), // 14 days
          start_date: null,
          end_date: null,
          
          // Results tracking
          results: {
            participants: {},
            conversions: {},
            metrics: {},
            statistical_significance: null,
            confidence_interval: null,
            winner: null
          }
        };

        // Validate test configuration
        const validation = this.validateTestConfig(test);
        if (!validation.valid) {
          throw new Error(`Invalid test configuration: ${validation.errors.join(', ')}`);
        }

        // Store test
        this.activeTests.set(test.id, test);
        
        span.setAttributes({
          'ab_test.id': test.id,
          'ab_test.name': test.name,
          'ab_test.type': test.type,
          'ab_test.variants_count': test.variants.length
        });

        console.log(`🧪 Created A/B test: ${test.name} (${test.id})`);
        return test;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to create A/B test:', error);
        throw error;
      }
    });
  }

  // Start an A/B test
  async startTest(testId) {
    return telemetryHelpers.createSpan('ab_start_test', async (span) => {
      try {
        const test = this.activeTests.get(testId);
        if (!test) {
          throw new Error(`Test ${testId} not found`);
        }

        if (test.status !== 'draft') {
          throw new Error(`Test ${testId} is not in draft status`);
        }

        // Final validation before starting
        const validation = this.validateTestConfig(test);
        if (!validation.valid) {
          throw new Error(`Cannot start test: ${validation.errors.join(', ')}`);
        }

        // Update test status
        test.status = 'running';
        test.start_date = Date.now();
        test.end_date = test.start_date + test.planned_duration;

        // Initialize results tracking
        test.variants.forEach(variant => {
          test.results.participants[variant.id] = 0;
          test.results.conversions[variant.id] = 0;
          test.results.metrics[variant.id] = {};
        });

        span.setAttributes({
          'ab_test.id': testId,
          'ab_test.start_date': test.start_date,
          'ab_test.planned_end_date': test.end_date
        });

        console.log(`🚀 Started A/B test: ${test.name} (${testId})`);
        return test;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to start A/B test:', error);
        throw error;
      }
    });
  }

  // Assign user to test variant
  async assignUserToTest(testId, userId, userContext = {}) {
    return telemetryHelpers.createSpan('ab_assign_user', async (span) => {
      try {
        const test = this.activeTests.get(testId);
        if (!test || test.status !== 'running') {
          return null; // Test not active
        }

        // Check if user already assigned
        const assignmentKey = `${testId}_${userId}`;
        if (this.userAssignments.has(assignmentKey)) {
          const assignment = this.userAssignments.get(assignmentKey);
          span.setAttributes({
            'ab_test.assignment': 'existing',
            'ab_test.variant': assignment.variant_id
          });
          return assignment;
        }

        // Check if user meets targeting criteria
        if (!this.meetsTargetingCriteria(test, userId, userContext)) {
          span.setAttributes({ 'ab_test.assignment': 'excluded' });
          return null;
        }

        // Assign to variant based on traffic allocation
        const variantId = this.assignToVariant(test, userId);
        
        const assignment = {
          test_id: testId,
          user_id: userId,
          variant_id: variantId,
          assigned_at: Date.now(),
          user_context: userContext
        };

        // Store assignment
        this.userAssignments.set(assignmentKey, assignment);
        
        // Update participant count
        test.results.participants[variantId]++;

        span.setAttributes({
          'ab_test.assignment': 'new',
          'ab_test.variant': variantId,
          'ab_test.user_id': userId
        });

        return assignment;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to assign user to test:', error);
        return null;
      }
    });
  }

  // Track test event (conversion, metric, etc.)
  async trackTestEvent(testId, userId, eventType, eventData = {}) {
    return telemetryHelpers.createSpan('ab_track_event', async (span) => {
      try {
        const test = this.activeTests.get(testId);
        if (!test || test.status !== 'running') {
          return false;
        }

        // Get user assignment
        const assignmentKey = `${testId}_${userId}`;
        const assignment = this.userAssignments.get(assignmentKey);
        if (!assignment) {
          return false; // User not in test
        }

        const variantId = assignment.variant_id;

        // Track different types of events
        switch (eventType) {
          case 'conversion':
            test.results.conversions[variantId]++;
            break;
            
          case 'metric':
            this.trackMetricEvent(test, variantId, eventData);
            break;
            
          case 'goal_completion':
            this.trackGoalCompletion(test, variantId, eventData);
            break;
        }

        // Update statistical analysis
        await this.updateStatisticalAnalysis(test);

        span.setAttributes({
          'ab_test.event_type': eventType,
          'ab_test.variant': variantId,
          'ab_test.user_id': userId
        });

        return true;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to track test event:', error);
        return false;
      }
    });
  }

  // Get test results and analysis
  async getTestResults(testId) {
    return telemetryHelpers.createSpan('ab_get_results', async (span) => {
      try {
        const test = this.activeTests.get(testId);
        if (!test) {
          throw new Error(`Test ${testId} not found`);
        }

        // Calculate current results
        const results = await this.calculateTestResults(test);
        
        // Perform statistical analysis
        const statisticalAnalysis = await this.performStatisticalAnalysis(test);
        
        // Generate recommendations
        const recommendations = await this.generateTestRecommendations(test, results, statisticalAnalysis);

        const testResults = {
          test_info: {
            id: test.id,
            name: test.name,
            status: test.status,
            start_date: test.start_date,
            end_date: test.end_date,
            duration: test.start_date ? Date.now() - test.start_date : 0
          },
          results,
          statistical_analysis: statisticalAnalysis,
          recommendations,
          raw_data: test.results
        };

        span.setAttributes({
          'ab_test.participants_total': Object.values(test.results.participants).reduce((a, b) => a + b, 0),
          'ab_test.conversions_total': Object.values(test.results.conversions).reduce((a, b) => a + b, 0),
          'ab_test.statistical_significance': statisticalAnalysis.is_significant
        });

        return testResults;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to get test results:', error);
        throw error;
      }
    });
  }

  // Stop a running test
  async stopTest(testId, reason = 'manual_stop') {
    return telemetryHelpers.createSpan('ab_stop_test', async (span) => {
      try {
        const test = this.activeTests.get(testId);
        if (!test) {
          throw new Error(`Test ${testId} not found`);
        }

        if (test.status !== 'running') {
          throw new Error(`Test ${testId} is not running`);
        }

        // Update test status
        test.status = 'stopped';
        test.actual_end_date = Date.now();
        test.stop_reason = reason;

        // Perform final analysis
        const finalResults = await this.getTestResults(testId);
        
        // Store final results
        this.testResults.set(testId, finalResults);

        span.setAttributes({
          'ab_test.id': testId,
          'ab_test.stop_reason': reason,
          'ab_test.duration': test.actual_end_date - test.start_date
        });

        console.log(`🛑 Stopped A/B test: ${test.name} (${testId}) - Reason: ${reason}`);
        return finalResults;

      } catch (error) {
        span.recordException(error);
        console.error('Failed to stop A/B test:', error);
        throw error;
      }
    });
  }

  // Calculate test results
  async calculateTestResults(test) {
    const results = {
      variants: {},
      summary: {
        total_participants: 0,
        total_conversions: 0,
        overall_conversion_rate: 0
      }
    };

    // Calculate results for each variant
    for (const variant of test.variants) {
      const participants = test.results.participants[variant.id] || 0;
      const conversions = test.results.conversions[variant.id] || 0;
      const conversionRate = participants > 0 ? conversions / participants : 0;

      results.variants[variant.id] = {
        name: variant.name,
        participants,
        conversions,
        conversion_rate: conversionRate,
        metrics: test.results.metrics[variant.id] || {}
      };

      results.summary.total_participants += participants;
      results.summary.total_conversions += conversions;
    }

    results.summary.overall_conversion_rate = 
      results.summary.total_participants > 0 
        ? results.summary.total_conversions / results.summary.total_participants 
        : 0;

    return results;
  }

  // Perform statistical analysis
  async performStatisticalAnalysis(test) {
    const control = test.variants.find(v => v.id === 'control');
    const variant = test.variants.find(v => v.id !== 'control');

    if (!control || !variant) {
      return { is_significant: false, error: 'Missing control or variant data' };
    }

    const controlParticipants = test.results.participants[control.id] || 0;
    const controlConversions = test.results.conversions[control.id] || 0;
    const variantParticipants = test.results.participants[variant.id] || 0;
    const variantConversions = test.results.conversions[variant.id] || 0;

    // Check minimum sample size
    if (controlParticipants < test.statistical_config.minimum_sample_size ||
        variantParticipants < test.statistical_config.minimum_sample_size) {
      return {
        is_significant: false,
        reason: 'insufficient_sample_size',
        control_sample_size: controlParticipants,
        variant_sample_size: variantParticipants,
        required_sample_size: test.statistical_config.minimum_sample_size
      };
    }

    // Calculate conversion rates
    const controlRate = controlParticipants > 0 ? controlConversions / controlParticipants : 0;
    const variantRate = variantParticipants > 0 ? variantConversions / variantParticipants : 0;

    // Perform two-proportion z-test
    const zTest = this.performZTest(
      controlConversions, controlParticipants,
      variantConversions, variantParticipants
    );

    // Calculate confidence interval
    const confidenceInterval = this.calculateConfidenceInterval(
      controlRate, variantRate,
      controlParticipants, variantParticipants,
      test.statistical_config.significance_level
    );

    // Determine statistical significance
    const isSignificant = Math.abs(zTest.z_score) > zTest.critical_value;

    return {
      is_significant: isSignificant,
      z_score: zTest.z_score,
      p_value: zTest.p_value,
      critical_value: zTest.critical_value,
      confidence_interval: confidenceInterval,
      control_rate: controlRate,
      variant_rate: variantRate,
      relative_improvement: controlRate > 0 ? (variantRate - controlRate) / controlRate : 0,
      absolute_improvement: variantRate - controlRate
    };
  }

  // Generate test recommendations
  async generateTestRecommendations(test, results, statisticalAnalysis) {
    const recommendations = [];

    // Statistical significance recommendation
    if (statisticalAnalysis.is_significant) {
      const winner = statisticalAnalysis.variant_rate > statisticalAnalysis.control_rate ? 'variant' : 'control';
      recommendations.push({
        type: 'decision',
        priority: 'high',
        title: 'Statistically Significant Result',
        description: `The ${winner} shows a statistically significant improvement. Consider implementing the winning variant.`,
        action: `implement_${winner}`,
        confidence: 'high'
      });
    } else {
      recommendations.push({
        type: 'continue',
        priority: 'medium',
        title: 'No Significant Difference',
        description: 'No statistically significant difference detected. Consider running the test longer or increasing sample size.',
        action: 'continue_test',
        confidence: 'medium'
      });
    }

    // Sample size recommendation
    if (results.summary.total_participants < test.statistical_config.minimum_sample_size * 2) {
      recommendations.push({
        type: 'sample_size',
        priority: 'medium',
        title: 'Increase Sample Size',
        description: 'Consider increasing traffic allocation or running the test longer to reach adequate sample size.',
        action: 'increase_traffic',
        confidence: 'medium'
      });
    }

    // Duration recommendation
    const testDuration = Date.now() - test.start_date;
    if (testDuration < this.testConfigs.minimum_test_duration) {
      recommendations.push({
        type: 'duration',
        priority: 'low',
        title: 'Extend Test Duration',
        description: 'Test has been running for less than the minimum recommended duration.',
        action: 'extend_duration',
        confidence: 'low'
      });
    }

    return recommendations;
  }

  // Utility methods
  validateTestConfig(test) {
    const errors = [];

    if (!test.name || test.name.trim().length === 0) {
      errors.push('Test name is required');
    }

    if (!test.primary_metric) {
      errors.push('Primary metric is required');
    }

    if (!test.variants || test.variants.length < 2) {
      errors.push('At least 2 variants are required');
    }

    // Validate traffic allocation
    if (test.variants) {
      const totalAllocation = test.variants.reduce((sum, v) => sum + v.traffic_allocation, 0);
      if (Math.abs(totalAllocation - 1.0) > 0.01) {
        errors.push('Traffic allocation must sum to 1.0');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  meetsTargetingCriteria(test, userId, userContext) {
    // Check if user meets targeting criteria
    const targeting = test.targeting;

    // Check traffic percentage
    if (targeting.traffic_percentage < 100) {
      const hash = this.hashUserId(userId);
      if (hash % 100 >= targeting.traffic_percentage) {
        return false;
      }
    }

    // Check audience filters
    if (targeting.filters) {
      // Implement specific filter logic based on user context
      // For now, return true
    }

    return true;
  }

  assignToVariant(test, userId) {
    // Use consistent hashing to assign users to variants
    const hash = this.hashUserId(userId);
    const normalizedHash = hash / 2147483647; // Normalize to 0-1

    let cumulativeAllocation = 0;
    for (const variant of test.variants) {
      cumulativeAllocation += variant.traffic_allocation;
      if (normalizedHash <= cumulativeAllocation) {
        return variant.id;
      }
    }

    // Fallback to first variant
    return test.variants[0].id;
  }

  hashUserId(userId) {
    // Simple hash function for user assignment
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  trackMetricEvent(test, variantId, eventData) {
    if (!test.results.metrics[variantId]) {
      test.results.metrics[variantId] = {};
    }

    const metrics = test.results.metrics[variantId];
    
    for (const [metricName, value] of Object.entries(eventData)) {
      if (!metrics[metricName]) {
        metrics[metricName] = [];
      }
      metrics[metricName].push(value);
    }
  }

  trackGoalCompletion(test, variantId, eventData) {
    // Track goal completion events
    if (eventData.goal === test.primary_metric) {
      test.results.conversions[variantId]++;
    }
  }

  async updateStatisticalAnalysis(test) {
    // Update ongoing statistical analysis
    const analysis = await this.performStatisticalAnalysis(test);
    test.results.statistical_significance = analysis.is_significant;
    test.results.confidence_interval = analysis.confidence_interval;

    // Check for early stopping criteria
    if (analysis.is_significant && this.shouldStopEarly(test, analysis)) {
      await this.stopTest(test.id, 'early_stopping_significant');
    }
  }

  shouldStopEarly(test, analysis) {
    // Implement early stopping logic
    const testDuration = Date.now() - test.start_date;
    const minDuration = this.testConfigs.minimum_test_duration;
    
    return (
      testDuration > minDuration &&
      analysis.is_significant &&
      Math.abs(analysis.relative_improvement) > 0.1 // 10% improvement
    );
  }

  performZTest(x1, n1, x2, n2) {
    // Two-proportion z-test
    const p1 = x1 / n1;
    const p2 = x2 / n2;
    const p = (x1 + x2) / (n1 + n2);
    
    const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
    const z = (p1 - p2) / se;
    
    // Critical value for 95% confidence (two-tailed)
    const criticalValue = 1.96;
    
    // Calculate p-value (approximation)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    
    return {
      z_score: z,
      p_value: pValue,
      critical_value: criticalValue
    };
  }

  normalCDF(x) {
    // Approximation of normal cumulative distribution function
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  erf(x) {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  calculateConfidenceInterval(p1, p2, n1, n2, confidenceLevel) {
    const z = 1.96; // 95% confidence
    const se1 = Math.sqrt(p1 * (1 - p1) / n1);
    const se2 = Math.sqrt(p2 * (1 - p2) / n2);
    const se = Math.sqrt(se1 * se1 + se2 * se2);
    
    const diff = p2 - p1;
    const margin = z * se;
    
    return {
      lower: diff - margin,
      upper: diff + margin,
      margin_of_error: margin
    };
  }

  generateTestId() {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async loadActiveTests() {
    // Load active tests from storage
    console.log('📊 Loading active A/B tests');
  }

  setupTestMonitoring() {
    // Set up monitoring for active tests
    setInterval(() => {
      this.monitorActiveTests();
    }, 300000); // Check every 5 minutes
  }

  initializeStatisticalAnalysis() {
    // Initialize statistical analysis components
    console.log('📈 Statistical analysis initialized');
  }

  async monitorActiveTests() {
    // Monitor active tests for completion criteria
    for (const [testId, test] of this.activeTests) {
      if (test.status === 'running') {
        // Check if test should be stopped
        const now = Date.now();
        if (now >= test.end_date) {
          await this.stopTest(testId, 'duration_completed');
        }
      }
    }
  }

  // Health check
  async healthCheck() {
    const activeTestsCount = Array.from(this.activeTests.values())
      .filter(test => test.status === 'running').length;
    
    return {
      status: 'healthy',
      active_tests: activeTestsCount,
      total_tests: this.activeTests.size,
      user_assignments: this.userAssignments.size,
      completed_tests: this.testResults.size
    };
  }
}

module.exports = new ABTestingService();