const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { telemetryHelpers } = require('../config/telemetry');
const vectorDB = require('../config/vectorDatabase');
const cacheService = require('./cacheService');

class AIAgentSystem {
  constructor() {
    this.agents = new Map();
    this.orchestrator = null;
    this.agentConfigs = {
      creative: {
        model: 'gpt-4',
        temperature: 0.9,
        maxTokens: 2000,
        specialty: 'Creative name generation and innovation'
      },
      analyst: {
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1500,
        specialty: 'Brandability and market analysis'
      },
      validator: {
        model: 'gpt-4',
        temperature: 0.1,
        maxTokens: 1000,
        specialty: 'Quality control and validation'
      },
      researcher: {
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 1500,
        specialty: 'Market research and competitive intelligence'
      },
      optimizer: {
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        maxTokens: 1000,
        specialty: 'Performance optimization and cost management'
      }
    };
    
    this.initializeAgents();
  }

  // Initialize all specialized agents
  async initializeAgents() {
    try {
      // Creative Agent - Innovative name generation
      this.agents.set('creative', new CreativeAgent(this.agentConfigs.creative));
      
      // Analyst Agent - Brandability and market analysis
      this.agents.set('analyst', new AnalystAgent(this.agentConfigs.analyst));
      
      // Validator Agent - Quality control
      this.agents.set('validator', new ValidatorAgent(this.agentConfigs.validator));
      
      // Researcher Agent - Market intelligence
      this.agents.set('researcher', new ResearcherAgent(this.agentConfigs.researcher));
      
      // Optimizer Agent - Performance and cost optimization
      this.agents.set('optimizer', new OptimizerAgent(this.agentConfigs.optimizer));
      
      // Master Orchestrator
      this.orchestrator = new MasterOrchestrator(this.agents);
      
      console.log('✅ AI Agent System initialized with', this.agents.size, 'specialized agents');
    } catch (error) {
      console.error('❌ Failed to initialize AI Agent System:', error);
    }
  }

  // Execute multi-agent naming workflow
  async executeNamingWorkflow(params) {
    return telemetryHelpers.createSpan('multi_agent_workflow', async (span) => {
      try {
        span.setAttributes({
          'agents.workflow': 'naming_generation',
          'agents.count': this.agents.size,
          'agents.industry': params.industry
        });

        const result = await this.orchestrator.orchestrate(params);
        
        span.setAttributes({
          'agents.generated_count': result.names.length,
          'agents.quality_score': result.metadata.average_quality,
          'agents.processing_time': result.metadata.processing_time
        });

        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      }
    });
  }

  // Get agent status and health
  async getAgentStatus() {
    const status = {
      total_agents: this.agents.size,
      agents: {},
      orchestrator_status: this.orchestrator ? 'active' : 'inactive'
    };

    for (const [name, agent] of this.agents) {
      status.agents[name] = await agent.getStatus();
    }

    return status;
  }
}

// Creative Agent - Specialized in innovative name generation
class CreativeAgent {
  constructor(config) {
    this.llm = new ChatOpenAI({
      modelName: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });
    this.specialty = config.specialty;
    this.outputParser = new StringOutputParser();
  }

  async generate(params) {
    const { keywords, industry, style, count, context = {} } = params;
    
    const prompt = PromptTemplate.fromTemplate(`
You are a Creative Naming Agent specializing in innovative startup name generation. Your mission is to create memorable, brandable names that break conventional patterns while maintaining commercial viability.

CREATIVE BRIEF:
Industry: {industry}
Keywords: {keywords}
Style: {style}
Target Count: {count}
Creative Context: {creativeContext}

INNOVATION STRATEGIES:
1. LINGUISTIC CREATIVITY
   - Portmanteau combinations (blend words creatively)
   - Metaphorical associations (abstract concepts)
   - Phonetic innovation (sound-based appeal)
   - Cultural fusion (global linguistic elements)

2. CONCEPTUAL INNOVATION
   - Future-forward naming (anticipate trends)
   - Emotional resonance (psychological impact)
   - Sensory associations (multi-sensory appeal)
   - Narrative potential (story-driven names)

3. TECHNICAL CREATIVITY
   - Domain hack opportunities (.ly, .io, .ai extensions)
   - Acronym innovations (meaningful abbreviations)
   - Number integration (strategic numeric elements)
   - Symbol potential (visual brand elements)

CREATIVE CONSTRAINTS:
- Maintain pronounceability and memorability
- Ensure commercial viability and scalability
- Consider global market appropriateness
- Balance innovation with market acceptance

Generate {count} highly creative and innovative names:

Format as JSON:
{{
  "creative_names": [
    {{
      "name": "InnovativeName",
      "creativity_score": 9.5,
      "innovation_type": "portmanteau",
      "linguistic_elements": ["element1", "element2"],
      "creative_rationale": "Detailed explanation of creative approach",
      "market_viability": 8.5,
      "memorability_factor": 9.0,
      "brandability_potential": 8.8
    }}
  ],
  "creative_insights": [
    "Key creative insights and patterns discovered"
  ],
  "innovation_summary": "Overall creative strategy employed"
}}
    `);

    const chain = prompt.pipe(this.llm).pipe(this.outputParser);
    
    const input = {
      industry,
      keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
      style,
      count,
      creativeContext: this.buildCreativeContext(context)
    };

    const result = await chain.invoke(input);
    return JSON.parse(result);
  }

  buildCreativeContext(context) {
    return `
Market Trends: ${context.trends || 'Contemporary naming preferences'}
Competitive Landscape: ${context.competitors || 'Standard industry naming'}
Cultural Considerations: ${context.culture || 'Global market appeal'}
Innovation Level: ${context.innovation || 'High creativity expected'}
    `.trim();
  }

  async getStatus() {
    return {
      agent_type: 'creative',
      specialty: this.specialty,
      model: this.llm.modelName,
      temperature: this.llm.temperature,
      status: 'active'
    };
  }
}

// Analyst Agent - Specialized in brandability and market analysis
class AnalystAgent {
  constructor(config) {
    this.llm = new ChatOpenAI({
      modelName: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });
    this.specialty = config.specialty;
    this.outputParser = new StringOutputParser();
  }

  async analyze(names, context) {
    const prompt = PromptTemplate.fromTemplate(`
You are an Expert Brand Analyst Agent specializing in comprehensive startup name evaluation. Your analysis drives strategic naming decisions for high-growth companies.

NAMES TO ANALYZE: {names}
ANALYSIS CONTEXT:
Industry: {industry}
Target Market: {targetMarket}
Competitive Landscape: {competitors}
Market Positioning: {positioning}

COMPREHENSIVE ANALYSIS FRAMEWORK:

1. BRANDABILITY MATRIX
   - Memorability Index (recall and recognition)
   - Pronunciation Clarity (ease of verbal communication)
   - Visual Brand Potential (logo and design adaptability)
   - Emotional Resonance (psychological impact and associations)
   - Uniqueness Factor (market differentiation potential)

2. MARKET INTELLIGENCE
   - Industry Alignment Score (sector appropriateness)
   - Target Audience Appeal (demographic resonance)
   - Competitive Differentiation (uniqueness in market)
   - Cultural Sensitivity (global market readiness)
   - Trend Alignment (contemporary relevance)

3. COMMERCIAL VIABILITY
   - Scalability Potential (growth accommodation)
   - International Expansion (global market readiness)
   - Product Line Extension (brand elasticity)
   - Investment Appeal (investor perception)
   - Partnership Potential (B2B relationship building)

4. TECHNICAL ASSESSMENT
   - Domain Availability Prediction (digital presence)
   - SEO Optimization Potential (search visibility)
   - Social Media Compatibility (platform integration)
   - Trademark Risk Assessment (legal safety)
   - Voice Search Optimization (emerging technology)

Provide detailed analysis with actionable insights:

Format as JSON:
{{
  "analysis_results": [
    {{
      "name": "AnalyzedName",
      "brandability_matrix": {{
        "memorability_index": 8.5,
        "pronunciation_clarity": 9.0,
        "visual_brand_potential": 8.0,
        "emotional_resonance": 7.5,
        "uniqueness_factor": 8.8,
        "overall_brandability": 8.36
      }},
      "market_intelligence": {{
        "industry_alignment": 9.0,
        "target_audience_appeal": 8.5,
        "competitive_differentiation": 8.0,
        "cultural_sensitivity": 9.0,
        "trend_alignment": 7.5,
        "overall_market_fit": 8.4
      }},
      "commercial_viability": {{
        "scalability_potential": 9.0,
        "international_expansion": 8.5,
        "product_line_extension": 8.0,
        "investment_appeal": 8.5,
        "partnership_potential": 8.0,
        "overall_commercial_score": 8.4
      }},
      "technical_assessment": {{
        "domain_availability_prediction": 7.0,
        "seo_optimization_potential": 8.5,
        "social_media_compatibility": 8.0,
        "trademark_risk_assessment": 8.5,
        "voice_search_optimization": 8.0,
        "overall_technical_score": 8.0
      }},
      "composite_score": 8.29,
      "confidence_level": 0.92,
      "strategic_recommendations": [
        "Specific actionable recommendations for optimization"
      ]
    }}
  ],
  "market_insights": [
    "Key market intelligence and competitive insights"
  ],
  "analysis_summary": "Overall analysis findings and strategic implications"
}}
    `);

    const chain = prompt.pipe(this.llm).pipe(this.outputParser);
    
    const input = {
      names: JSON.stringify(names),
      industry: context.industry,
      targetMarket: context.targetMarket || 'Professional business audience',
      competitors: context.competitors || 'Standard industry competitors',
      positioning: context.positioning || 'Premium market positioning'
    };

    const result = await chain.invoke(input);
    return JSON.parse(result);
  }

  async getStatus() {
    return {
      agent_type: 'analyst',
      specialty: this.specialty,
      model: this.llm.modelName,
      temperature: this.llm.temperature,
      status: 'active'
    };
  }
}

// Validator Agent - Specialized in quality control
class ValidatorAgent {
  constructor(config) {
    this.llm = new ChatOpenAI({
      modelName: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });
    this.specialty = config.specialty;
    this.outputParser = new StringOutputParser();
  }

  async validate(names, standards) {
    const prompt = PromptTemplate.fromTemplate(`
You are a Quality Control Validator Agent responsible for ensuring startup names meet the highest professional standards. Your validation determines which names proceed to market.

NAMES FOR VALIDATION: {names}
QUALITY STANDARDS: {standards}

VALIDATION PROTOCOL:

1. FUNDAMENTAL REQUIREMENTS
   - Length Optimization (3-15 characters ideal)
   - Pronunciation Clarity (unambiguous articulation)
   - Spelling Intuition (natural spelling patterns)
   - Professional Appropriateness (business context suitable)
   - Global Compatibility (international market ready)

2. BRANDABILITY VALIDATION
   - Memorability Testing (recall and recognition)
   - Uniqueness Verification (market differentiation)
   - Scalability Assessment (growth accommodation)
   - Timelessness Evaluation (longevity potential)
   - Emotional Impact (positive associations)

3. TECHNICAL COMPLIANCE
   - Domain Feasibility (realistic availability)
   - SEO Compatibility (search optimization)
   - Social Media Viability (handle availability)
   - Legal Safety (trademark risk assessment)
   - Technical Integration (system compatibility)

4. MARKET READINESS
   - Industry Alignment (sector appropriateness)
   - Audience Resonance (target market appeal)
   - Competitive Analysis (differentiation validation)
   - Cultural Sensitivity (global appropriateness)
   - Investment Grade (professional perception)

VALIDATION OUTCOMES:
- PASS: Meets all quality standards
- CONDITIONAL: Meets most standards with minor issues
- FAIL: Does not meet minimum standards

Provide comprehensive validation results:

Format as JSON:
{{
  "validation_results": [
    {{
      "name": "ValidatedName",
      "validation_status": "PASS",
      "overall_score": 8.5,
      "validation_scores": {{
        "fundamental_requirements": 9.0,
        "brandability_validation": 8.5,
        "technical_compliance": 8.0,
        "market_readiness": 8.5
      }},
      "compliance_issues": [],
      "improvement_recommendations": [
        "Specific suggestions for enhancement"
      ],
      "risk_assessment": {{
        "risk_level": "LOW",
        "risk_factors": [],
        "mitigation_strategies": []
      }},
      "confidence_score": 0.95
    }}
  ],
  "validation_summary": {{
    "total_validated": 10,
    "pass_count": 8,
    "conditional_count": 1,
    "fail_count": 1,
    "average_quality": 8.2,
    "recommendation": "Proceed with PASS and CONDITIONAL names"
  }},
  "quality_insights": [
    "Key quality patterns and improvement opportunities"
  ]
}}
    `);

    const chain = prompt.pipe(this.llm).pipe(this.outputParser);
    
    const input = {
      names: JSON.stringify(names),
      standards: JSON.stringify(standards)
    };

    const result = await chain.invoke(input);
    return JSON.parse(result);
  }

  async getStatus() {
    return {
      agent_type: 'validator',
      specialty: this.specialty,
      model: this.llm.modelName,
      temperature: this.llm.temperature,
      status: 'active'
    };
  }
}

// Researcher Agent - Specialized in market intelligence
class ResearcherAgent {
  constructor(config) {
    this.llm = new ChatOpenAI({
      modelName: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });
    this.specialty = config.specialty;
    this.outputParser = new StringOutputParser();
  }

  async research(industry, keywords, context = {}) {
    const prompt = PromptTemplate.fromTemplate(`
You are a Market Research Agent specializing in startup naming intelligence. Your research provides strategic context for optimal naming decisions.

RESEARCH BRIEF:
Industry: {industry}
Keywords: {keywords}
Research Context: {researchContext}

COMPREHENSIVE MARKET RESEARCH:

1. INDUSTRY LANDSCAPE ANALYSIS
   - Market Size and Growth Trends
   - Key Players and Competitive Dynamics
   - Naming Conventions and Patterns
   - Innovation Opportunities
   - Regulatory Considerations

2. NAMING TREND ANALYSIS
   - Current Naming Trends in Industry
   - Emerging Patterns and Innovations
   - Successful Name Characteristics
   - Failed Naming Strategies
   - Future Trend Predictions

3. COMPETITIVE INTELLIGENCE
   - Direct Competitor Analysis
   - Indirect Competitor Patterns
   - Market Positioning Strategies
   - Differentiation Opportunities
   - White Space Identification

4. TARGET AUDIENCE RESEARCH
   - Demographic Preferences
   - Psychographic Insights
   - Communication Preferences
   - Brand Perception Factors
   - Decision-Making Criteria

5. CULTURAL AND GLOBAL CONSIDERATIONS
   - International Market Readiness
   - Cultural Sensitivity Factors
   - Language Considerations
   - Regional Preferences
   - Global Expansion Implications

Provide comprehensive research insights:

Format as JSON:
{{
  "research_findings": {{
    "industry_landscape": {{
      "market_size": "Industry market size and growth",
      "key_players": ["Major industry players"],
      "naming_conventions": ["Common naming patterns"],
      "innovation_opportunities": ["Naming innovation gaps"],
      "regulatory_factors": ["Relevant regulations"]
    }},
    "naming_trends": {{
      "current_trends": ["Active naming trends"],
      "emerging_patterns": ["New naming approaches"],
      "success_factors": ["What makes names successful"],
      "failure_patterns": ["Common naming mistakes"],
      "future_predictions": ["Anticipated trends"]
    }},
    "competitive_intelligence": {{
      "direct_competitors": ["Direct competitor names"],
      "indirect_competitors": ["Adjacent market names"],
      "positioning_strategies": ["How competitors position"],
      "differentiation_gaps": ["Opportunities for differentiation"],
      "market_whitespace": ["Underserved naming territories"]
    }},
    "audience_insights": {{
      "demographic_preferences": ["Target audience preferences"],
      "psychographic_factors": ["Psychological drivers"],
      "communication_style": ["Preferred communication"],
      "brand_expectations": ["What audience expects"],
      "decision_criteria": ["How naming influences decisions"]
    }},
    "global_considerations": {{
      "international_readiness": "Global market compatibility",
      "cultural_factors": ["Cultural considerations"],
      "language_implications": ["Multi-language considerations"],
      "regional_preferences": ["Geographic preferences"],
      "expansion_strategy": "Global expansion naming strategy"
    }}
  }},
  "strategic_recommendations": [
    "Key strategic recommendations for naming approach"
  ],
  "research_confidence": 0.88
}}
    `);

    const chain = prompt.pipe(this.llm).pipe(this.outputParser);
    
    const input = {
      industry,
      keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
      researchContext: this.buildResearchContext(context)
    };

    const result = await chain.invoke(input);
    return JSON.parse(result);
  }

  buildResearchContext(context) {
    return `
Market Focus: ${context.marketFocus || 'Comprehensive market analysis'}
Competitive Scope: ${context.competitiveScope || 'Direct and indirect competitors'}
Geographic Scope: ${context.geographicScope || 'Global market consideration'}
Time Horizon: ${context.timeHorizon || 'Current and emerging trends'}
    `.trim();
  }

  async getStatus() {
    return {
      agent_type: 'researcher',
      specialty: this.specialty,
      model: this.llm.modelName,
      temperature: this.llm.temperature,
      status: 'active'
    };
  }
}

// Optimizer Agent - Specialized in performance and cost optimization
class OptimizerAgent {
  constructor(config) {
    this.llm = new ChatOpenAI({
      modelName: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });
    this.specialty = config.specialty;
    this.outputParser = new StringOutputParser();
  }

  async optimize(names, constraints) {
    // This agent focuses on ranking and optimization
    const optimizedNames = names
      .map(name => ({
        ...name,
        optimization_score: this.calculateOptimizationScore(name),
        cost_efficiency: this.calculateCostEfficiency(name),
        performance_metrics: this.calculatePerformanceMetrics(name)
      }))
      .sort((a, b) => b.optimization_score - a.optimization_score);

    return {
      optimized_names: optimizedNames,
      optimization_insights: this.generateOptimizationInsights(optimizedNames),
      performance_summary: this.generatePerformanceSummary(optimizedNames)
    };
  }

  calculateOptimizationScore(name) {
    // Composite optimization score based on multiple factors
    const factors = {
      brandability: name.brandability_score || 0,
      market_fit: name.market_fit_score || 0,
      technical: name.technical_score || 0,
      uniqueness: name.uniqueness_score || 0
    };

    const weights = {
      brandability: 0.35,
      market_fit: 0.30,
      technical: 0.20,
      uniqueness: 0.15
    };

    return Object.keys(factors).reduce((score, factor) => {
      return score + (factors[factor] * weights[factor]);
    }, 0);
  }

  calculateCostEfficiency(name) {
    // Calculate cost efficiency based on generation complexity
    const baseScore = name.brandability_score || 7;
    const complexity = name.name.length + (name.explanation?.length || 0) / 10;
    return baseScore / Math.log(complexity + 1);
  }

  calculatePerformanceMetrics(name) {
    return {
      memorability: this.calculateMemorability(name.name),
      pronounceability: this.calculatePronounceability(name.name),
      searchability: this.calculateSearchability(name.name),
      brandability: name.brandability_score || 0
    };
  }

  calculateMemorability(name) {
    // Simple memorability calculation
    const length = name.length;
    const vowelRatio = (name.match(/[aeiou]/gi) || []).length / length;
    const lengthScore = length >= 4 && length <= 8 ? 10 : Math.max(0, 10 - Math.abs(6 - length));
    const vowelScore = vowelRatio >= 0.3 && vowelRatio <= 0.5 ? 10 : 5;
    return (lengthScore + vowelScore) / 2;
  }

  calculatePronounceability(name) {
    // Simple pronounceability calculation
    const consonantClusters = (name.match(/[bcdfghjklmnpqrstvwxyz]{3,}/gi) || []).length;
    const baseScore = 10;
    return Math.max(0, baseScore - (consonantClusters * 2));
  }

  calculateSearchability(name) {
    // SEO and search potential
    const length = name.length;
    const hasNumbers = /\d/.test(name);
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(name);
    
    let score = 10;
    if (length > 15) score -= 3;
    if (hasNumbers) score -= 1;
    if (hasSpecialChars) score -= 2;
    
    return Math.max(0, score);
  }

  generateOptimizationInsights(names) {
    const avgScore = names.reduce((sum, n) => sum + n.optimization_score, 0) / names.length;
    const topPerformers = names.slice(0, 5);
    
    return {
      average_optimization_score: avgScore,
      top_performers: topPerformers.map(n => n.name),
      optimization_factors: 'Brandability, market fit, technical viability, uniqueness',
      recommendations: [
        'Focus on top 20% of names for detailed analysis',
        'Consider A/B testing top performers',
        'Validate technical assumptions for highest-scoring names'
      ]
    };
  }

  generatePerformanceSummary(names) {
    return {
      total_names: names.length,
      high_performers: names.filter(n => n.optimization_score >= 8).length,
      medium_performers: names.filter(n => n.optimization_score >= 6 && n.optimization_score < 8).length,
      low_performers: names.filter(n => n.optimization_score < 6).length,
      average_score: names.reduce((sum, n) => sum + n.optimization_score, 0) / names.length
    };
  }

  async getStatus() {
    return {
      agent_type: 'optimizer',
      specialty: this.specialty,
      model: this.llm.modelName,
      temperature: this.llm.temperature,
      status: 'active'
    };
  }
}

// Master Orchestrator - Coordinates all agents
class MasterOrchestrator {
  constructor(agents) {
    this.agents = agents;
    this.workflowTemplates = {
      standard: ['researcher', 'creative', 'analyst', 'validator', 'optimizer'],
      fast: ['creative', 'validator', 'optimizer'],
      comprehensive: ['researcher', 'creative', 'analyst', 'validator', 'optimizer'],
      quality_focused: ['creative', 'analyst', 'validator', 'analyst', 'optimizer']
    };
  }

  async orchestrate(params) {
    const { workflow = 'standard', ...requestParams } = params;
    const workflowSteps = this.workflowTemplates[workflow] || this.workflowTemplates.standard;
    
    return telemetryHelpers.createSpan('orchestrator_workflow', async (span) => {
      const startTime = Date.now();
      let currentData = requestParams;
      const executionLog = [];

      span.setAttributes({
        'orchestrator.workflow': workflow,
        'orchestrator.steps': workflowSteps.length
      });

      try {
        // Execute workflow steps
        for (const agentType of workflowSteps) {
          const agent = this.agents.get(agentType);
          if (!agent) continue;

          const stepResult = await this.executeAgentStep(agent, agentType, currentData);
          executionLog.push({
            agent: agentType,
            timestamp: Date.now(),
            result_summary: this.summarizeStepResult(stepResult)
          });

          currentData = this.mergeStepResults(currentData, stepResult, agentType);
        }

        // Compile final results
        const finalResult = {
          names: currentData.names || currentData.optimized_names || [],
          metadata: {
            workflow_used: workflow,
            steps_executed: workflowSteps,
            processing_time: Date.now() - startTime,
            execution_log: executionLog,
            average_quality: this.calculateAverageQuality(currentData.names || []),
            agent_contributions: this.analyzeAgentContributions(executionLog)
          }
        };

        span.setAttributes({
          'orchestrator.final_count': finalResult.names.length,
          'orchestrator.processing_time': finalResult.metadata.processing_time,
          'orchestrator.average_quality': finalResult.metadata.average_quality
        });

        return finalResult;

      } catch (error) {
        span.recordException(error);
        throw error;
      }
    });
  }

  async executeAgentStep(agent, agentType, data) {
    switch (agentType) {
      case 'researcher':
        return await agent.research(data.industry, data.keywords, data.context);
      
      case 'creative':
        return await agent.generate({
          ...data,
          context: data.research_findings || {}
        });
      
      case 'analyst':
        return await agent.analyze(data.names || data.creative_names, {
          industry: data.industry,
          targetMarket: data.targetMarket,
          competitors: data.research_findings?.competitive_intelligence?.direct_competitors
        });
      
      case 'validator':
        return await agent.validate(
          data.names || data.creative_names,
          this.getValidationStandards(data.industry)
        );
      
      case 'optimizer':
        return await agent.optimize(
          data.names || data.creative_names,
          { industry: data.industry, count: data.count }
        );
      
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }

  mergeStepResults(currentData, stepResult, agentType) {
    const merged = { ...currentData };

    switch (agentType) {
      case 'researcher':
        merged.research_findings = stepResult.research_findings;
        merged.strategic_recommendations = stepResult.strategic_recommendations;
        break;
      
      case 'creative':
        merged.creative_names = stepResult.creative_names;
        merged.names = stepResult.creative_names;
        merged.creative_insights = stepResult.creative_insights;
        break;
      
      case 'analyst':
        merged.analysis_results = stepResult.analysis_results;
        merged.names = stepResult.analysis_results;
        break;
      
      case 'validator':
        merged.validation_results = stepResult.validation_results;
        merged.names = stepResult.validation_results.filter(n => n.validation_status !== 'FAIL');
        break;
      
      case 'optimizer':
        merged.optimized_names = stepResult.optimized_names;
        merged.names = stepResult.optimized_names;
        merged.optimization_insights = stepResult.optimization_insights;
        break;
    }

    return merged;
  }

  summarizeStepResult(result) {
    if (result.creative_names) {
      return `Generated ${result.creative_names.length} creative names`;
    }
    if (result.analysis_results) {
      return `Analyzed ${result.analysis_results.length} names`;
    }
    if (result.validation_results) {
      const passed = result.validation_results.filter(n => n.validation_status === 'PASS').length;
      return `Validated ${result.validation_results.length} names, ${passed} passed`;
    }
    if (result.optimized_names) {
      return `Optimized and ranked ${result.optimized_names.length} names`;
    }
    if (result.research_findings) {
      return 'Completed market research and competitive analysis';
    }
    return 'Step completed';
  }

  calculateAverageQuality(names) {
    if (!names || names.length === 0) return 0;
    
    const scores = names.map(name => 
      name.optimization_score || 
      name.validation_score || 
      name.composite_score || 
      name.brandability_score || 
      0
    );
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  analyzeAgentContributions(executionLog) {
    return executionLog.map(log => ({
      agent: log.agent,
      contribution: log.result_summary,
      execution_time: log.timestamp
    }));
  }

  getValidationStandards(industry) {
    return {
      min_brandability_score: 7.0,
      min_market_fit_score: 7.5,
      min_technical_score: 6.5,
      min_overall_score: 7.0,
      industry_specific: {
        tech: { innovation_weight: 0.3 },
        health: { trust_weight: 0.4 },
        fintech: { security_weight: 0.35 }
      }[industry] || {}
    };
  }
}

module.exports = AIAgentSystem;