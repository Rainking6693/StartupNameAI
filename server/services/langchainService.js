const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables');
const { Document } = require('@langchain/core/documents');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { telemetryHelpers } = require('../config/telemetry');
const vectorDB = require('../config/vectorDatabase');
const cacheService = require('./cacheService');

class LangChainService {
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4',
      temperature: 0.8,
      maxTokens: 2000,
      streaming: true
    });
    
    this.embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small'
    });
    
    this.outputParser = new StringOutputParser();
    this.vectorStore = null;
    this.chains = new Map();
    
    this.initializeChains();
  }

  // Initialize LangChain workflows
  async initializeChains() {
    try {
      // Creative Naming Chain
      this.chains.set('creative', await this.createCreativeNamingChain());
      
      // Analysis Chain
      this.chains.set('analysis', await this.createAnalysisChain());
      
      // Validation Chain
      this.chains.set('validation', await this.createValidationChain());
      
      // RAG Enhancement Chain
      this.chains.set('rag', await this.createRAGChain());
      
      // Multi-step Orchestration Chain
      this.chains.set('orchestrator', await this.createOrchestratorChain());
      
      console.log('✅ LangChain workflows initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize LangChain workflows:', error);
    }
  }

  // Creative naming chain with advanced prompting
  async createCreativeNamingChain() {
    const prompt = PromptTemplate.fromTemplate(`
You are a world-class startup naming consultant with 20+ years of experience. You specialize in creating memorable, brandable names that resonate with target audiences and drive business success.

CONTEXT:
Industry: {industry}
Keywords: {keywords}
Style: {style}
Target Count: {count}
Market Context: {marketContext}

SIMILAR SUCCESSFUL NAMES:
{similarNames}

NAMING REQUIREMENTS:
- Create names that are memorable and easy to pronounce
- Ensure strong brandability and commercial appeal
- Consider domain availability (.com preferred)
- Avoid trademark conflicts
- Match the specified industry and style
- Incorporate relevant keywords naturally

CREATIVE PROCESS:
1. Analyze the industry landscape and naming conventions
2. Consider psychological impact and emotional resonance
3. Evaluate phonetic appeal and memorability
4. Assess brandability and scalability potential
5. Generate diverse creative approaches

Generate {count} innovative startup names with explanations:

Format as JSON:
{{
  "names": [
    {{
      "name": "ExampleName",
      "explanation": "Why this name works for the industry and target audience",
      "brandability_score": 8.5,
      "creativity_score": 9.0,
      "industry_fit": 8.0,
      "memorability": 8.5,
      "reasoning": "Detailed reasoning for the name choice"
    }}
  ]
}}
    `);

    return RunnableSequence.from([
      prompt,
      this.llm,
      this.outputParser
    ]);
  }

  // Analysis chain for deep name evaluation
  async createAnalysisChain() {
    const prompt = PromptTemplate.fromTemplate(`
You are an expert brand analyst specializing in startup name evaluation. Analyze the given name comprehensively across multiple dimensions.

NAME TO ANALYZE: {name}
INDUSTRY: {industry}
TARGET MARKET: {targetMarket}

ANALYSIS FRAMEWORK:
1. BRANDABILITY ASSESSMENT
   - Memorability and recall potential
   - Pronunciation ease and clarity
   - Visual appeal and logo potential
   - Emotional resonance and associations

2. MARKET FIT EVALUATION
   - Industry appropriateness
   - Target audience appeal
   - Competitive differentiation
   - Cultural sensitivity and global appeal

3. TECHNICAL CONSIDERATIONS
   - Domain availability likelihood
   - SEO potential and searchability
   - Social media handle availability
   - Trademark risk assessment

4. SCALABILITY ANALYSIS
   - Growth potential and flexibility
   - International expansion readiness
   - Product line extension capability
   - Long-term brand evolution potential

Provide detailed analysis with scores (1-10) and actionable recommendations:

Format as JSON:
{{
  "analysis": {{
    "brandability": {{
      "memorability": 8.5,
      "pronunciation": 9.0,
      "visual_appeal": 7.5,
      "emotional_resonance": 8.0,
      "overall_score": 8.25
    }},
    "market_fit": {{
      "industry_appropriateness": 9.0,
      "target_appeal": 8.5,
      "differentiation": 7.0,
      "global_appeal": 8.0,
      "overall_score": 8.125
    }},
    "technical": {{
      "domain_likelihood": 7.0,
      "seo_potential": 8.5,
      "social_availability": 6.5,
      "trademark_risk": 8.0,
      "overall_score": 7.5
    }},
    "scalability": {{
      "growth_potential": 9.0,
      "international_readiness": 8.0,
      "extension_capability": 8.5,
      "evolution_potential": 8.5,
      "overall_score": 8.5
    }},
    "recommendations": [
      "Specific actionable recommendations for improvement"
    ],
    "overall_score": 8.1,
    "confidence_level": 0.85
  }}
}}
    `);

    return RunnableSequence.from([
      prompt,
      this.llm,
      this.outputParser
    ]);
  }

  // Validation chain for quality control
  async createValidationChain() {
    const prompt = PromptTemplate.fromTemplate(`
You are a quality control specialist for startup naming. Your role is to validate names against strict quality criteria and provide pass/fail recommendations.

NAMES TO VALIDATE: {names}
INDUSTRY: {industry}
QUALITY STANDARDS: {qualityStandards}

VALIDATION CRITERIA:
1. BASIC REQUIREMENTS
   - Length: 3-15 characters optimal
   - Pronunciation: Clear and unambiguous
   - Spelling: Intuitive and memorable
   - Appropriateness: Professional and suitable

2. BRANDABILITY STANDARDS
   - Uniqueness: Distinctive and memorable
   - Scalability: Growth and expansion ready
   - Flexibility: Adaptable to market changes
   - Timelessness: Won't become dated quickly

3. TECHNICAL VALIDATION
   - Domain potential: Likely .com availability
   - SEO friendliness: Search engine optimized
   - Social media: Handle availability potential
   - Legal safety: Low trademark risk

4. MARKET VALIDATION
   - Industry alignment: Fits market expectations
   - Audience appeal: Resonates with target users
   - Competitive analysis: Differentiates from competitors
   - Cultural sensitivity: Globally appropriate

Provide validation results with pass/fail recommendations:

Format as JSON:
{{
  "validation_results": [
    {{
      "name": "ExampleName",
      "validation_score": 8.5,
      "status": "PASS",
      "criteria_scores": {{
        "basic_requirements": 9.0,
        "brandability": 8.5,
        "technical": 8.0,
        "market": 8.5
      }},
      "issues": [],
      "recommendations": [
        "Specific improvement suggestions"
      ],
      "confidence": 0.9
    }}
  ],
  "overall_quality": 8.2,
  "pass_rate": 0.85,
  "recommendations": [
    "Overall recommendations for the name set"
  ]
}}
    `);

    return RunnableSequence.from([
      prompt,
      this.llm,
      this.outputParser
    ]);
  }

  // RAG chain for context-enhanced generation
  async createRAGChain() {
    const prompt = PromptTemplate.fromTemplate(`
Based on the following successful naming examples and market context, generate enhanced startup names that leverage proven patterns while maintaining originality.

SUCCESSFUL EXAMPLES:
{context}

USER REQUEST:
Industry: {industry}
Keywords: {keywords}
Style: {style}
Count: {count}

ENHANCEMENT STRATEGY:
1. Analyze successful patterns from the examples
2. Identify winning naming conventions for the industry
3. Extract brandability factors that drive success
4. Apply learnings to create superior names
5. Ensure originality while leveraging proven patterns

Generate enhanced names that improve upon the successful examples:

Format as JSON:
{{
  "enhanced_names": [
    {{
      "name": "EnhancedName",
      "explanation": "How this improves upon successful patterns",
      "pattern_analysis": "Which successful patterns were applied",
      "brandability_score": 9.0,
      "innovation_score": 8.5,
      "market_potential": 9.0
    }}
  ],
  "pattern_insights": [
    "Key insights from successful examples"
  ],
  "enhancement_strategy": "Overall strategy used for improvement"
}}
    `);

    return RunnableSequence.from([
      {
        context: async (input) => {
          const similarNames = await this.getRelevantContext(input.keywords, input.industry);
          return similarNames.map(name => 
            `${name.name} (Score: ${name.brandability_score}) - ${name.explanation || 'Successful in market'}`
          ).join('\n');
        },
        industry: (input) => input.industry,
        keywords: (input) => input.keywords,
        style: (input) => input.style,
        count: (input) => input.count
      },
      prompt,
      this.llm,
      this.outputParser
    ]);
  }

  // Master orchestration chain
  async createOrchestratorChain() {
    const prompt = PromptTemplate.fromTemplate(`
You are the master orchestrator for an advanced AI naming system. Coordinate multiple specialized agents to deliver the highest quality startup names.

ORCHESTRATION PLAN:
1. Creative Generation: Generate diverse, innovative names
2. RAG Enhancement: Improve names using successful patterns
3. Analysis: Deep evaluation of each name
4. Validation: Quality control and filtering
5. Optimization: Final ranking and selection

AGENTS AVAILABLE:
- Creative Agent: Innovative name generation
- Analysis Agent: Comprehensive name evaluation
- Validation Agent: Quality control and filtering
- RAG Agent: Context-enhanced improvement

COORDINATION STRATEGY:
{strategy}

USER REQUEST:
{userRequest}

Orchestrate the agents to deliver optimal results:

Format as JSON:
{{
  "orchestration_plan": {{
    "steps": [
      {{
        "agent": "creative",
        "task": "Generate initial name candidates",
        "parameters": {{}},
        "expected_output": "50 creative names"
      }}
    ],
    "quality_gates": [
      "Validation checkpoints between steps"
    ],
    "optimization_strategy": "How to maximize quality and efficiency"
  }},
  "execution_summary": "Overview of the orchestration approach"
}}
    `);

    return RunnableSequence.from([
      prompt,
      this.llm,
      this.outputParser
    ]);
  }

  // Execute multi-step naming workflow
  async generateNamesWithWorkflow(params) {
    const { keywords, industry, style, count = 50 } = params;
    
    return telemetryHelpers.createSpan('langchain_workflow', async (span) => {
      try {
        span.setAttributes({
          'langchain.workflow': 'multi_step_naming',
          'langchain.industry': industry,
          'langchain.style': style,
          'langchain.count': count
        });

        // Step 1: Creative Generation
        const creativeResults = await this.executeCreativeGeneration({
          keywords, industry, style, count: Math.ceil(count * 1.5) // Generate extra for filtering
        });

        // Step 2: RAG Enhancement
        const enhancedResults = await this.executeRAGEnhancement({
          names: creativeResults.names,
          keywords, industry, style
        });

        // Step 3: Analysis
        const analysisResults = await this.executeAnalysis({
          names: enhancedResults.enhanced_names,
          industry
        });

        // Step 4: Validation and Filtering
        const validationResults = await this.executeValidation({
          names: analysisResults.analyzed_names,
          industry,
          qualityStandards: this.getQualityStandards(industry)
        });

        // Step 5: Final Optimization and Ranking
        const finalResults = await this.optimizeAndRank({
          validatedNames: validationResults.validation_results,
          targetCount: count
        });

        span.setAttributes({
          'langchain.generated_count': finalResults.length,
          'langchain.quality_score': finalResults.reduce((sum, n) => sum + n.overall_score, 0) / finalResults.length
        });

        return {
          names: finalResults,
          workflow_metadata: {
            creative_count: creativeResults.names.length,
            enhanced_count: enhancedResults.enhanced_names.length,
            analyzed_count: analysisResults.analyzed_names.length,
            validated_count: validationResults.validation_results.filter(n => n.status === 'PASS').length,
            final_count: finalResults.length,
            overall_quality: validationResults.overall_quality,
            processing_time: Date.now()
          }
        };

      } catch (error) {
        span.recordException(error);
        throw error;
      }
    });
  }

  // Execute creative generation step
  async executeCreativeGeneration(params) {
    const chain = this.chains.get('creative');
    const marketContext = await this.getMarketContext(params.industry);
    const similarNames = await this.getSimilarNames(params.keywords, params.industry);
    
    const input = {
      ...params,
      marketContext,
      similarNames: similarNames.map(n => `${n.name} (${n.brandability_score})`).join(', ')
    };

    const result = await chain.invoke(input);
    return JSON.parse(result);
  }

  // Execute RAG enhancement step
  async executeRAGEnhancement(params) {
    const chain = this.chains.get('rag');
    const result = await chain.invoke(params);
    return JSON.parse(result);
  }

  // Execute analysis step
  async executeAnalysis(params) {
    const chain = this.chains.get('analysis');
    const analyzedNames = [];
    
    for (const name of params.names) {
      const analysisInput = {
        name: name.name,
        industry: params.industry,
        targetMarket: this.getTargetMarket(params.industry)
      };
      
      const result = await chain.invoke(analysisInput);
      const analysis = JSON.parse(result);
      
      analyzedNames.push({
        ...name,
        detailed_analysis: analysis.analysis
      });
    }
    
    return { analyzed_names: analyzedNames };
  }

  // Execute validation step
  async executeValidation(params) {
    const chain = this.chains.get('validation');
    const result = await chain.invoke(params);
    return JSON.parse(result);
  }

  // Optimize and rank final results
  async optimizeAndRank({ validatedNames, targetCount }) {
    // Filter passed names and sort by quality
    const passedNames = validatedNames
      .filter(name => name.status === 'PASS')
      .sort((a, b) => b.validation_score - a.validation_score);
    
    // Apply additional ranking factors
    const rankedNames = passedNames.map(name => ({
      ...name,
      final_score: this.calculateFinalScore(name),
      ranking_factors: this.getRankingFactors(name)
    }));
    
    // Sort by final score and return top results
    return rankedNames
      .sort((a, b) => b.final_score - a.final_score)
      .slice(0, targetCount);
  }

  // Calculate final composite score
  calculateFinalScore(name) {
    const weights = {
      validation_score: 0.4,
      brandability: 0.3,
      market_fit: 0.2,
      innovation: 0.1
    };
    
    return (
      name.validation_score * weights.validation_score +
      (name.detailed_analysis?.brandability?.overall_score || 0) * weights.brandability +
      (name.detailed_analysis?.market_fit?.overall_score || 0) * weights.market_fit +
      (name.innovation_score || 0) * weights.innovation
    );
  }

  // Get ranking factors for transparency
  getRankingFactors(name) {
    return {
      quality_score: name.validation_score,
      brandability: name.detailed_analysis?.brandability?.overall_score,
      market_fit: name.detailed_analysis?.market_fit?.overall_score,
      technical_score: name.detailed_analysis?.technical?.overall_score,
      scalability: name.detailed_analysis?.scalability?.overall_score
    };
  }

  // Helper methods
  async getRelevantContext(keywords, industry) {
    try {
      const queryText = `${keywords.join(' ')} ${industry}`;
      return await vectorDB.findSimilarNames(queryText, industry, 10, 0.7);
    } catch (error) {
      console.warn('Failed to get relevant context:', error.message);
      return [];
    }
  }

  async getMarketContext(industry) {
    // This would integrate with market intelligence APIs
    const contexts = {
      tech: 'Fast-paced innovation, emphasis on scalability and disruption',
      health: 'Trust-focused, regulatory compliance, patient-centric',
      fintech: 'Security-first, regulatory awareness, financial trust',
      ecommerce: 'Customer experience, global reach, brand recognition'
    };
    
    return contexts[industry] || 'Professional business environment';
  }

  async getSimilarNames(keywords, industry) {
    try {
      const queryText = `${keywords.join(' ')} ${industry}`;
      return await vectorDB.findSimilarNames(queryText, industry, 5, 0.8);
    } catch (error) {
      return [];
    }
  }

  getTargetMarket(industry) {
    const markets = {
      tech: 'Tech-savvy professionals and early adopters',
      health: 'Healthcare professionals and patients',
      fintech: 'Financial professionals and consumers',
      ecommerce: 'Online shoppers and businesses'
    };
    
    return markets[industry] || 'Professional business audience';
  }

  getQualityStandards(industry) {
    return {
      min_brandability_score: 7.0,
      min_market_fit_score: 7.5,
      min_technical_score: 6.5,
      min_overall_score: 7.0,
      industry_specific: this.getIndustryStandards(industry)
    };
  }

  getIndustryStandards(industry) {
    const standards = {
      tech: { innovation_weight: 0.3, scalability_weight: 0.25 },
      health: { trust_weight: 0.4, compliance_weight: 0.2 },
      fintech: { security_weight: 0.35, trust_weight: 0.3 },
      ecommerce: { memorability_weight: 0.3, global_appeal_weight: 0.25 }
    };
    
    return standards[industry] || {};
  }

  // Streaming response capability
  async generateNamesStream(params, callback) {
    const chain = this.chains.get('creative');
    
    try {
      const stream = await chain.stream(params);
      
      for await (const chunk of stream) {
        if (callback) {
          callback(chunk);
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }

  // Health check for LangChain service
  async healthCheck() {
    try {
      const testChain = this.chains.get('creative');
      if (!testChain) {
        return { status: 'unhealthy', message: 'Chains not initialized' };
      }
      
      return {
        status: 'healthy',
        chains_loaded: this.chains.size,
        llm_model: this.llm.modelName,
        embedding_model: this.embeddings.modelName
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message
      };
    }
  }
}

module.exports = new LangChainService();