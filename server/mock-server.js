const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ALLOWED_INDUSTRIES = ['tech', 'health', 'fintech', 'ecommerce', 'saas', 'education', 'food', 'travel'];
const ALLOWED_STYLES = ['modern', 'professional', 'innovative', 'creative', 'classic'];
const ALLOWED_WORKFLOWS = ['quick', 'comprehensive', 'expert', 'multi_step'];
const ALLOWED_ANALYSIS_DEPTH = ['basic', 'enhanced', 'comprehensive'];

const baseCache = new Map();
const enhancedCache = new Map();
const sessions = new Map();
let sessionCounter = 1;

const rateState = {
  base: new Map(),
  enhanced: new Map(),
};

function shouldRateLimit(stateKey, limit, windowMs, stateMap) {
  const now = Date.now();
  const bucket = stateMap.get(stateKey) || [];
  const recent = bucket.filter(ts => now - ts < windowMs);
  recent.push(now);
  stateMap.set(stateKey, recent);
  return recent.length > limit;
}

function hashKey(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

const WORD_LIST = ['Nova', 'Pulse', 'Fusion', 'Axis', 'Quantum', 'Catalyst', 'Vertex', 'Nimbus', 'Orbit', 'Matrix'];
const SUFFIX_LIST = ['Labs', 'Works', 'Hub', 'Forge', 'Dynamics', 'Systems', 'Engine', 'Studio', 'Analytics', 'Innovations'];

function buildName(seed, keywords, index) {
  const baseWord = WORD_LIST[(seed + index) % WORD_LIST.length];
  const suffix = SUFFIX_LIST[(seed + index * 3) % SUFFIX_LIST.length];
  const keywordPart = keywords[index % keywords.length] || keywords[0] || 'Brand';
  return `${baseWord}${keywordPart.charAt(0).toUpperCase()}${keywordPart.slice(1)} ${suffix}`;
}

function generateNames(payload, count, { includeVector = true } = {}) {
  const { keywords = ['brand'], industry = 'tech', style = 'modern' } = payload;
  const seed = parseInt(hashKey({ keywords, industry, style }).slice(0, 8), 16);
  const names = [];
  for (let i = 0; i < count; i += 1) {
    const name = buildName(seed, keywords, i);
    const scoreSeed = (seed + i * 97) % 1000;
    const brandabilityScore = Number(((scoreSeed % 600) / 100 + 4).toFixed(1));
    names.push({
      name,
      explanation: `${name} blends ${keywords.join(', ')} themes for the ${industry} space.`,
      brandability_score: Math.min(10, Math.max(6.5, brandabilityScore)),
      domain_info: {
        primary: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
        alternatives: [
          `${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.io`,
          `${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.ai`
        ],
        availability: 'available',
      },
      seo_potential: {
        score: Number(((scoreSeed % 400) / 100 + 5).toFixed(1)),
        keywords: [...new Set(keywords.map(k => `${k} brand`))],
      },
      trademark_risk: {
        level: 'low',
        conflicts: [],
      },
      ...(includeVector ? { vector_similarity_score: Number(((scoreSeed % 300) / 100 + 3).toFixed(2)) } : {}),
      created_at: new Date().toISOString(),
    });
  }
  return names;
}

function validateBaseRequest(body) {
  const errors = [];
  if (!Array.isArray(body.keywords) || body.keywords.length < 1 || body.keywords.length > 5) {
    errors.push('keywords must be an array with 1-5 values');
  }
  if (body.keywords && !body.keywords.every(k => typeof k === 'string' && k.trim().length >= 2)) {
    errors.push('keywords must contain non-empty strings');
  }
  if (body.industry && !ALLOWED_INDUSTRIES.includes(body.industry)) {
    errors.push('industry must be one of the supported options');
  }
  if (body.style && !ALLOWED_STYLES.includes(body.style)) {
    errors.push('style must be one of the supported options');
  }
  if (body.count && (typeof body.count !== 'number' || body.count < 1 || body.count > 100)) {
    errors.push('count must be between 1 and 100');
  }
  return errors;
}

function validateEnhancedRequest(body) {
  const errors = validateBaseRequest(body);
  if (body.workflow && !ALLOWED_WORKFLOWS.includes(body.workflow)) {
    errors.push('workflow must be a supported workflow type');
  }
  return errors;
}

function makeHealthPayload() {
  const timestamp = new Date().toISOString();
  const statusObject = (name) => ({ status: 'healthy', last_checked: timestamp, uptime_ms: 123456 });
  return {
    status: 'healthy',
    timestamp,
    services: {
      cache: { status: 'healthy', provider: 'in-memory', hit_rate: 0.94, latency_ms: 3 },
      ai: { status: 'healthy', model: 'mock-gpt-4', latency_ms: 520 },
      vector_database: { status: 'healthy', provider: 'pgvector-mock', indexed_records: 2400 },
      advanced_cache_service: statusObject('advanced_cache_service'),
      database_optimization: statusObject('database_optimization'),
      load_balancing: statusObject('load_balancing'),
      framework_evaluation: statusObject('framework_evaluation'),
      real_time_analytics: statusObject('real_time_analytics'),
      machine_learning: { status: 'healthy', active_models: 4, prediction_latency_ms: 210 },
      business_intelligence: { status: 'healthy', dashboards: 6, insights_generated_today: 42 },
      ab_testing: { status: 'healthy', active_tests: 3, total_tests: 18 },
    },
    features: {
      telemetry: { enabled: true, exporter: 'in-memory', traces_per_minute: 120 },
      vectorDatabase: { enabled: true, embeddings_cached: true },
      caching: { strategy: 'semantic + keyword', ttl_seconds: 900 },
      personalization: { enabled: true, cohorts_tracked: 12 },
    },
    system: {
      environment: 'mock',
      version: 'test-1.0.0',
      region: 'us-test-1',
    },
  };
}

app.get('/api/health', (_req, res) => {
  res.json(makeHealthPayload());
});

app.post('/api/names/generate', (req, res) => {
  const body = req.body || {};
  const errors = validateBaseRequest(body);
  if (errors.length) {
    return res.status(400).json({ success: false, message: 'Invalid request payload', errors });
  }

  const key = hashKey({ keywords: body.keywords, industry: body.industry || 'tech', style: body.style || 'modern', count: body.count || 10 });
  const limited = shouldRateLimit(key, 10, 1000, rateState.base);
  if (limited) {
    return res.status(429).json({ success: false, error: 'Rate limit exceeded. Please wait before retrying.' });
  }

  const cached = baseCache.get(key);
  if (cached) {
    return res.json({
      success: true,
      data: {
        sessionId: cached.sessionId,
        names: cached.names,
        metadata: {
          cache: { hit: true, strategy: 'semantic' },
          generated_at: new Date().toISOString(),
        },
      },
    });
  }

  const count = body.count || 10;
  const names = generateNames(body, count);
  const sessionId = sessionCounter++;
  const payload = {
    sessionId,
    names,
    request: { ...body, count },
  };
  baseCache.set(key, payload);
  sessions.set(sessionId, payload);

  res.json({
    success: true,
    data: {
      sessionId,
      names,
      metadata: {
        cache: { hit: false },
        generated_at: new Date().toISOString(),
      },
    },
  });
});

app.post('/api/names/analyze', (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ success: false, message: 'Name is required for analysis.' });
  }

  res.json({
    success: true,
    data: {
      name,
      domain_analysis: {
        availability: 'available',
        suggestions: [`${name.toLowerCase()}.com`, `${name.toLowerCase()}.io`],
      },
      brandability_analysis: {
        overall_score: 8.6,
        memorability: 9.1,
        pronounceability: 8.9,
        differentiation: 8.2,
      },
      seo_analysis: {
        search_volume: 'medium',
        difficulty: 'low',
        recommendations: ['Include related keywords on landing page', 'Secure matching domain'],
      },
      recommendations: [
        'Secure the primary .com domain',
        'Develop consistent brand messaging',
        'Verify trademark availability in key markets',
      ],
    },
  });
});

app.get('/api/names/session/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!sessions.has(id)) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }
  const record = sessions.get(id);
  res.json({
    success: true,
    data: {
      session: {
        id,
        requested_at: new Date().toISOString(),
        parameters: record.request,
      },
      names: record.names,
    },
  });
});

app.post('/api/names/export', (req, res) => {
  const { sessionId, format } = req.body || {};
  const session = sessions.get(Number(sessionId));
  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  if (format === 'csv') {
    const header = 'Name,Explanation,Brandability Score\n';
    const rows = session.names
      .map(item => `${item.name},"${item.explanation.replace(/"/g, '""')}",${item.brandability_score}`)
      .join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.send(header + rows);
    return;
  }

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      session: {
        id: sessionId,
        requested_at: new Date().toISOString(),
        parameters: session.request,
      },
      names: session.names,
    }));
    return;
  }

  res.status(400).json({ success: false, message: 'Unsupported export format' });
});

app.post('/api/enhanced/names/generate', (req, res) => {
  const body = req.body || {};
  const errors = validateEnhancedRequest(body);
  if (errors.length) {
    return res.status(400).json({ success: false, message: 'Invalid request payload', errors });
  }

  const key = hashKey({ keywords: body.keywords, industry: body.industry || 'tech', style: body.style || 'modern', count: body.count || 10, workflow: body.workflow || 'comprehensive' });
  const limited = shouldRateLimit(key, 20, 1000, rateState.enhanced);
  if (limited) {
    return res.status(429).json({
      success: false,
      error: 'Enhanced feature rate limit exceeded. Please upgrade to premium or wait before retrying.',
      upgrade_url: 'https://startupnamer.org/pricing',
    });
  }

  const cached = enhancedCache.get(key);
  if (cached) {
    return res.json({
      success: true,
      data: {
        names: cached.names,
        metadata: {
          cache_info: {
            cache_hit: true,
            cache_type: 'semantic',
            cost_saved: 0.72,
          },
          workflow_used: body.workflow || 'comprehensive',
          steps_executed: cached.steps,
          agent_contributions: cached.agentContributions,
          model_selection: cached.modelSelection,
        },
      },
    });
  }

  const count = body.count || 10;
  const names = generateNames(body, count, { includeVector: true }).map(item => ({
    ...item,
    creative_strategy: 'multi-agent synthesis',
    confidence: 0.88,
  }));

  const agentContributions = {
    creative: { weight: 0.3, description: 'Generates bold, memorable concepts' },
    analyst: { weight: 0.25, description: 'Validates market positioning' },
    validator: { weight: 0.2, description: 'Ensures compliance and availability' },
    researcher: { weight: 0.15, description: 'Finds supporting intelligence' },
    optimizer: { weight: 0.1, description: 'Balances cost and performance' },
  };

  const modelSelection = {
    model: body.premium ? 'mock-gpt-4-turbo' : 'mock-gpt-3.5',
    estimated_cost: body.premium ? 0.42 : 0.18,
    tokens_used: 820,
  };

  const steps = [
    'Collect requirements',
    'Generate candidate names',
    'Apply brand heuristics',
    'Perform domain checks',
    'Compile final shortlist',
  ];

  enhancedCache.set(key, { names, steps, agentContributions, modelSelection });

  res.json({
    success: true,
    data: {
      names,
      metadata: {
        cache_info: {
          cache_hit: false,
          cache_type: 'semantic',
          cost_saved: 0,
        },
        workflow_used: body.workflow || 'comprehensive',
        steps_executed: steps,
        agent_contributions: agentContributions,
        model_selection: modelSelection,
      },
    },
  });
});

app.post('/api/enhanced/names/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify({ status: 'starting' })}\n\n`);
  res.write(`data: ${JSON.stringify({ chunk: 'Generating premium names...' })}\n\n`);
  res.write(`data: ${JSON.stringify({ chunk: 'Finalizing enhanced results.' })}\n\n`);
  res.end();
});

app.post('/api/enhanced/names/langchain', (req, res) => {
  const body = req.body || {};
  const errors = validateEnhancedRequest(body);
  if (errors.length) {
    return res.status(400).json({ success: false, message: 'Invalid request payload', errors });
  }

  const count = body.count || 10;
  const names = generateNames(body, count, { includeVector: true });
  res.json({
    success: true,
    data: {
      names,
      workflow_metadata: {
        total_steps: 5,
        orchestration: 'langchain',
        completed_at: new Date().toISOString(),
      },
      langchain_info: {
        workflow_type: body.workflow_type || 'multi_step',
        chains_used: ['creative', 'validation', 'brand_consistency'],
        execution_time_ms: 680,
      },
    },
  });
});

app.post('/api/enhanced/names/analyze-batch', (req, res) => {
  const body = req.body || {};
  if (!Array.isArray(body.names) || body.names.length === 0) {
    return res.status(400).json({ success: false, message: 'names array is required' });
  }
  if (body.analysis_depth && !ALLOWED_ANALYSIS_DEPTH.includes(body.analysis_depth)) {
    return res.status(400).json({ success: false, message: 'Invalid analysis depth', errors: ['analysis_depth must be basic, enhanced, or comprehensive'] });
  }

  const analysisResults = body.names.map((name, index) => ({
    name,
    brandability_matrix: {
      uniqueness: 0.82,
      resonance: 0.88,
      recall: 0.84,
      emotional_pull: 0.8,
    },
    market_intelligence: {
      industry_fit: body.industry || 'tech',
      competitor_overlap: 0.12,
      trend_alignment: 0.91,
    },
    commercial_viability: {
      monetization_paths: ['subscription', 'enterprise'],
      customer_segments: ['SMB', 'enterprise'],
    },
    technical_assessment: {
      domain_availability: index % 3 !== 0,
      social_handles_available: index % 2 === 0,
    },
    composite_score: Number((8 + (index % 3) * 0.2).toFixed(2)),
  }));

  const validationResults = body.names.map((name, index) => ({
    name,
    validation_status: index % 4 === 0 ? 'review' : 'pass',
    overall_score: Number((8.2 - index * 0.1).toFixed(2)),
    validation_scores: {
      trademark: 0.76,
      domain: 0.8,
      linguistics: 0.9,
      global_fit: 0.85,
    },
  }));

  res.json({
    success: true,
    data: {
      analysis_results: analysisResults,
      validation_results: validationResults,
      summary: {
        total_analyzed: body.names.length,
        average_quality: 8.4,
        pass_rate: 0.82,
      },
    },
  });
});

app.get('/api/enhanced/names/cost-optimization', (_req, res) => {
  res.json({
    success: true,
    data: {
      cost_status: {
        cost_tracking: 'active',
        budgets: {
          monthly: 120,
          spent: 48,
        },
        remaining_budget: 72,
        efficiency_metrics: {
          cache_savings_ratio: 0.63,
          average_request_cost: 0.07,
          budget_utilization: 0.4,
        },
      },
      recommendations: [
        'Leverage semantic cache for repeat industries',
        'Batch enhanced requests during off-peak hours',
        'Promote self-serve workflows for standard naming needs',
      ],
      optimization_tips: [
        'Enable automatic model selection',
        'Monitor premium feature usage weekly',
      ],
    },
  });
});

app.get('/api/enhanced/names/agent-status', (_req, res) => {
  res.json({
    success: true,
    data: {
      ai_agents: {
        total_agents: 5,
        agents: {
          creative: { status: 'active', recent_tasks: 42 },
          analyst: { status: 'active', recent_tasks: 38 },
          validator: { status: 'active', recent_tasks: 37 },
          researcher: { status: 'active', recent_tasks: 29 },
          optimizer: { status: 'active', recent_tasks: 25 },
        },
        orchestrator_status: 'healthy',
      },
      langchain_service: {
        status: 'healthy',
        chains_loaded: ['creative_chain', 'validation_chain', 'analysis_chain'],
      },
      streaming_service: {
        service: 'event-stream',
        status: 'available',
        metrics: { throughput_per_minute: 24, average_latency_ms: 120 },
      },
      system_health: {
        all_agents_active: true,
        langchain_healthy: true,
        streaming_active: true,
      },
    },
  });
});

app.post('/api/enhanced/names/competitive-analysis', (req, res) => {
  const body = req.body || {};
  if (!body.industry || !ALLOWED_INDUSTRIES.includes(body.industry)) {
    return res.status(400).json({ success: false, message: 'Invalid industry for competitive analysis' });
  }

  res.json({
    success: true,
    data: {
      research_findings: {
        industry_landscape: `${body.industry} sector shows strong growth in AI-driven branding.`,
        naming_trends: ['two-word blends', 'short abstract names', 'purpose-driven names'],
        competitive_intelligence: {
          leading_brands: ['AlphaPay', 'FinWave', 'NovaLedger'],
          differentiation_score: 0.78,
        },
      },
      competitive_insights: {
        direct_competitors: ['FinEdge', 'PayMatrix', 'CoinSphere'],
        positioning_strategies: ['data trust', 'speed', 'compliance'],
        differentiation_gaps: ['customer support tone', 'visual identity'],
      },
      strategic_recommendations: [
        'Highlight security credentials in naming',
        'Emphasize consumer trust signals',
        'Develop positioning around intelligent automation',
      ],
      analysis_metadata: {
        industry: body.industry,
        keywords: body.keywords || [],
        analysis_scope: body.analysis_scope || 'comprehensive',
        confidence: 0.86,
      },
    },
  });
});

app.post('/api/enhanced/names/trend-prediction', (req, res) => {
  const body = req.body || {};
  res.json({
    success: true,
    data: {
      trend_predictions: {
        current_trends: ['AI co-branding', 'Suffix-less names', 'Purpose-first messaging'],
        emerging_patterns: ['Regenerative branding', 'Voice-friendly syllables'],
        future_predictions: ['Adaptive naming', 'Augmented brand identities'],
      },
      future_insights: [
        'Expect hybrid human-AI naming workshops to become standard.',
        'Premium domains will increasingly bundle AI-generated brand kits.',
      ],
      strategic_implications: [
        'Invest in multi-lingual brand validation early.',
        'Create modular brand assets ready for personalization.',
      ],
      prediction_metadata: {
        industry: body.industry || 'tech',
        time_horizon: body.time_horizon || '1_year',
        trend_categories: body.trend_categories || [],
        confidence: 0.81,
        generated_at: new Date().toISOString(),
      },
    },
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

const server = app.listen(PORT, () => {
  console.log(`Mock StartupNamer API running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
