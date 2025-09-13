const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { metrics, trace } = require('@opentelemetry/api');

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'startup-namer-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.API_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  instrumentations: [getNodeAutoInstrumentations({
    // Disable file system instrumentation to reduce noise
    '@opentelemetry/instrumentation-fs': {
      enabled: false,
    },
    // Configure HTTP instrumentation
    '@opentelemetry/instrumentation-http': {
      enabled: true,
      ignoreIncomingRequestHook: (req) => {
        // Ignore health checks and static assets
        return req.url?.includes('/health') || req.url?.includes('/favicon');
      },
    },
    // Configure Express instrumentation
    '@opentelemetry/instrumentation-express': {
      enabled: true,
    },
  })],
});

// Custom metrics for AI operations
const meter = metrics.getMeter('startup-namer', '1.0.0');

// AI operation metrics
const nameGenerationCounter = meter.createCounter('name_generation_requests_total', {
  description: 'Total number of name generation requests',
});

const nameGenerationDuration = meter.createHistogram('name_generation_duration_seconds', {
  description: 'Duration of name generation requests',
  unit: 's',
});

const aiResponseTime = meter.createHistogram('ai_response_time_seconds', {
  description: 'OpenAI API response time',
  unit: 's',
});

const aiTokenUsage = meter.createCounter('ai_tokens_used_total', {
  description: 'Total AI tokens consumed',
});

const aiCostEstimate = meter.createCounter('ai_cost_estimate_dollars', {
  description: 'Estimated AI costs in dollars',
});

// Domain checking metrics
const domainCheckCounter = meter.createCounter('domain_checks_total', {
  description: 'Total domain availability checks',
});

const domainCheckDuration = meter.createHistogram('domain_check_duration_seconds', {
  description: 'Duration of domain availability checks',
  unit: 's',
});

// Payment metrics
const paymentAttempts = meter.createCounter('payment_attempts_total', {
  description: 'Total payment attempts',
});

const paymentSuccess = meter.createCounter('payment_success_total', {
  description: 'Successful payments',
});

// Error metrics
const errorCounter = meter.createCounter('errors_total', {
  description: 'Total errors by type',
});

// User engagement metrics
const userSessions = meter.createCounter('user_sessions_total', {
  description: 'Total user sessions',
});

const nameDownloads = meter.createCounter('name_downloads_total', {
  description: 'Total name list downloads',
});

// Helper functions for instrumentation
const telemetryHelpers = {
  // Record name generation metrics
  recordNameGeneration: (count, duration, source = 'ai') => {
    nameGenerationCounter.add(1, { source, count: count.toString() });
    nameGenerationDuration.record(duration, { source });
  },

  // Record AI metrics
  recordAIUsage: (responseTime, tokens, estimatedCost, model = 'gpt-4') => {
    aiResponseTime.record(responseTime, { model });
    aiTokenUsage.add(tokens, { model });
    aiCostEstimate.add(estimatedCost, { model });
  },

  // Record domain check metrics
  recordDomainCheck: (duration, available, provider = 'default') => {
    domainCheckCounter.add(1, { provider, available: available.toString() });
    domainCheckDuration.record(duration, { provider });
  },

  // Record payment metrics
  recordPayment: (success, amount, currency = 'usd', plan = 'premium') => {
    paymentAttempts.add(1, { plan, currency });
    if (success) {
      paymentSuccess.add(1, { plan, currency, amount: amount.toString() });
    }
  },

  // Record errors
  recordError: (type, endpoint, statusCode) => {
    errorCounter.add(1, { 
      type, 
      endpoint, 
      status_code: statusCode.toString() 
    });
  },

  // Record user engagement
  recordUserSession: (userType = 'anonymous') => {
    userSessions.add(1, { user_type: userType });
  },

  recordNameDownload: (format = 'json', count = 0) => {
    nameDownloads.add(1, { format, count: count.toString() });
  },

  // Get tracer for custom spans
  getTracer: () => trace.getTracer('startup-namer', '1.0.0'),

  // Create custom span
  createSpan: (name, fn, attributes = {}) => {
    const tracer = telemetryHelpers.getTracer();
    return tracer.startActiveSpan(name, { attributes }, async (span) => {
      try {
        const result = await fn(span);
        span.setStatus({ code: trace.SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({ 
          code: trace.SpanStatusCode.ERROR, 
          message: error.message 
        });
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }
};

// Initialize telemetry (call this before importing other modules)
const initTelemetry = () => {
  if (process.env.ENABLE_TELEMETRY !== 'false') {
    sdk.start();
    console.log('🔍 OpenTelemetry initialized successfully');
  }
};

module.exports = {
  sdk,
  telemetryHelpers,
  initTelemetry,
  // Export individual metrics for direct use
  metrics: {
    nameGenerationCounter,
    nameGenerationDuration,
    aiResponseTime,
    aiTokenUsage,
    aiCostEstimate,
    domainCheckCounter,
    domainCheckDuration,
    paymentAttempts,
    paymentSuccess,
    errorCounter,
    userSessions,
    nameDownloads
  }
};