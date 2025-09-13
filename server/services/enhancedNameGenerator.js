const { openai, NAMING_PROMPTS } = require('../config/openai');
const { telemetryHelpers } = require('../config/telemetry');
const vectorDB = require('../config/vectorDatabase');
const domainChecker = require('./domainChecker');

class EnhancedNameGenerator {
  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
    this.maxRetries = 3;
    this.timeout = 30000;
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTimeout = 1000 * 60 * 60; // 1 hour
  }

  // Enhanced name generation with vector similarity and caching
  async generateNames(params) {
    const { keywords, industry = 'tech', style = 'modern', count = 50 } = params;
    const startTime = Date.now();
    
    return telemetryHelpers.createSpan('name_generation', async (span) => {
      span.setAttributes({
        'name_generation.keywords': keywords.join(','),
        'name_generation.industry': industry,
        'name_generation.style': style,
        'name_generation.count': count
      });

      try {
        // Check cache first
        const cacheKey = this.getCacheKey(params);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          span.setAttributes({ 'name_generation.cache_hit': true });
          telemetryHelpers.recordNameGeneration(count, (Date.now() - startTime) / 1000, 'cache');
          return cached;
        }

        // Get similar names from vector database for context
        const similarNames = await this.getSimilarNamesContext(keywords, industry);
        
        // Generate names using AI with enhanced context
        let names;
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
          names = await this.generateWithAI(params, similarNames);
          span.setAttributes({ 'name_generation.source': 'ai' });
        } else {
          names = await this.generateFallbackNames(params);
          span.setAttributes({ 'name_generation.source': 'fallback' });
        }

        // Enhance names with vector similarity scoring
        const enhancedNames = await this.enhanceWithVectorAnalysis(names, keywords, industry);
        
        // Store successful names in vector database
        await this.storeGeneratedNames(enhancedNames, industry, style, keywords);
        
        // Cache results
        this.setCache(cacheKey, enhancedNames);
        
        const duration = (Date.now() - startTime) / 1000;
        telemetryHelpers.recordNameGeneration(count, duration, 'ai');
        
        span.setAttributes({
          'name_generation.generated_count': enhancedNames.length,
          'name_generation.duration': duration
        });

        return enhancedNames;

      } catch (error) {
        span.recordException(error);
        telemetryHelpers.recordError('name_generation_error', '/api/names/generate', 500);
        throw error;
      }
    });
  }

  // Generate names using AI with vector context
  async generateWithAI(params, similarNames = []) {
    const { keywords, industry, style, count } = params;
    const aiStartTime = Date.now();
    
    return telemetryHelpers.createSpan('ai_generation', async (span) => {
      try {
        const prompt = this.buildEnhancedPrompt(keywords, industry, style, count, similarNames);
        
        const response = await this.callOpenAI(prompt);
        const aiDuration = (Date.now() - aiStartTime) / 1000;
        
        // Estimate token usage and cost
        const estimatedTokens = Math.ceil(prompt.length / 4) + Math.ceil(response.length / 4);
        const estimatedCost = this.estimateAICost(estimatedTokens, this.model);
        
        telemetryHelpers.recordAIUsage(aiDuration, estimatedTokens, estimatedCost, this.model);
        
        span.setAttributes({
          'ai.model': this.model,
          'ai.tokens_estimated': estimatedTokens,
          'ai.cost_estimated': estimatedCost,
          'ai.duration': aiDuration
        });

        return this.parseAIResponse(response);
        
      } catch (error) {
        telemetryHelpers.recordError('ai_generation_error', 'openai_api', 500);
        throw error;
      }
    });
  }

  // Build enhanced prompt with vector context
  buildEnhancedPrompt(keywords, industry, style, count, similarNames) {
    const basePrompt = NAMING_PROMPTS.general;
    const industryContext = NAMING_PROMPTS.industries[industry] || '';
    const styleContext = NAMING_PROMPTS.styles[style] || '';
    
    let contextSection = '';
    if (similarNames.length > 0) {
      contextSection = `\n\nSUCCESSFUL EXAMPLES FROM SIMILAR COMPANIES:\n${
        similarNames.map(name => `- ${name.name} (Score: ${name.brandability_score})`).join('\n')
      }\n\nUse these as inspiration but create completely original names.`;
    }

    return `${basePrompt}\n\nCONTEXT:\n- Keywords: ${keywords.join(', ')}\n- Industry: ${industry}\n- Style: ${style}\n- Industry focus: ${industryContext}\n- Style approach: ${styleContext}${contextSection}\n\nGenerate exactly ${count} startup names. For each name, provide:\n1. The name itself\n2. A brief explanation (1-2 sentences) of why it works\n3. A brandability score (1-10)\n4. Potential concerns or considerations\n\nFormat as JSON array with objects containing: name, explanation, brandability_score, concerns\n\nPrioritize names likely to have .com domain availability and avoid trademark conflicts.`;
  }

  // Get similar names from vector database for context
  async getSimilarNamesContext(keywords, industry) {
    try {
      const queryText = `${keywords.join(' ')} ${industry}`;
      return await vectorDB.findSimilarNames(queryText, industry, 5, 0.7);
    } catch (error) {
      console.warn('Failed to get vector context:', error.message);
      return [];
    }
  }

  // Enhance names with vector similarity analysis
  async enhanceWithVectorAnalysis(names, keywords, industry) {
    return telemetryHelpers.createSpan('vector_enhancement', async (span) => {
      const enhanced = [];
      
      for (const name of names) {
        try {
          // Get vector similarity to successful names
          const similarityScore = await this.calculateVectorSimilarity(name.name, industry);
          
          // Enhanced brandability analysis
          const brandabilityAnalysis = await this.analyzeBrandabilityEnhanced(name.name, keywords, industry);
          
          // Domain checking with telemetry
          const domainStartTime = Date.now();
          const domainInfo = await domainChecker.checkAvailability(name.name);
          const domainDuration = (Date.now() - domainStartTime) / 1000;
          
          telemetryHelpers.recordDomainCheck(domainDuration, domainInfo.available);
          
          enhanced.push({
            ...name,
            vector_similarity_score: similarityScore,
            brandability_analysis: brandabilityAnalysis,
            domain_info: domainInfo,
            seo_potential: this.calculateSEOPotential(name.name),
            trademark_risk: this.assessTrademarkRisk(name.name),
            generated_at: new Date().toISOString(),
            enhanced: true
          });
          
        } catch (error) {
          console.warn(`Failed to enhance name '${name.name}':`, error.message);
          enhanced.push({
            ...name,
            domain_info: { available: false, error: true },
            enhanced: false
          });
        }
      }
      
      // Sort by combined score (brandability + vector similarity)
      enhanced.sort((a, b) => {
        const scoreA = (a.brandability_score || 0) + (a.vector_similarity_score || 0) * 2;
        const scoreB = (b.brandability_score || 0) + (b.vector_similarity_score || 0) * 2;
        return scoreB - scoreA;
      });
      
      span.setAttributes({
        'vector_enhancement.processed_count': enhanced.length,
        'vector_enhancement.enhanced_count': enhanced.filter(n => n.enhanced).length
      });
      
      return enhanced;
    });
  }

  // Calculate vector similarity to successful names
  async calculateVectorSimilarity(name, industry) {
    try {
      const similarNames = await vectorDB.findSimilarNames(name, industry, 3, 0.6);
      if (similarNames.length === 0) return 5; // Neutral score
      
      const avgSimilarity = similarNames.reduce((sum, n) => sum + n.similarity, 0) / similarNames.length;
      return Math.round(avgSimilarity * 10 * 10) / 10; // Scale to 1-10
    } catch (error) {
      return 5; // Neutral score on error
    }
  }

  // Enhanced brandability analysis with industry context
  async analyzeBrandabilityEnhanced(name, keywords, industry) {
    const basicAnalysis = this.analyzeBrandabilityBasic(name);
    
    // Industry-specific scoring
    const industryBonus = this.getIndustrySpecificScore(name, industry);
    
    // Keyword relevance scoring
    const keywordRelevance = this.calculateKeywordRelevance(name, keywords);
    
    return {
      ...basicAnalysis,
      industry_fit_score: industryBonus,
      keyword_relevance_score: keywordRelevance,
      overall_enhanced_score: Math.round(
        (basicAnalysis.overall_score + industryBonus + keywordRelevance) / 3 * 10
      ) / 10
    };
  }

  // Store generated names in vector database
  async storeGeneratedNames(names, industry, style, keywords) {
    try {
      const topNames = names
        .filter(name => name.brandability_score >= 7)
        .slice(0, 10); // Store only top 10 names
      
      for (const name of topNames) {
        await vectorDB.storeName({
          name: name.name,
          industry,
          style,
          keywords,
          brandability_score: name.brandability_score,
          domain_available: name.domain_info?.available || false
        });
      }
    } catch (error) {
      console.warn('Failed to store names in vector database:', error.message);
    }
  }

  // Caching methods
  getCacheKey(params) {
    return `names_${JSON.stringify(params)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Simple cache cleanup
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  // AI cost estimation
  estimateAICost(tokens, model) {
    const pricing = {
      'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    };
    
    const modelPricing = pricing[model] || pricing['gpt-4'];
    const inputTokens = tokens * 0.7; // Estimate 70% input
    const outputTokens = tokens * 0.3; // Estimate 30% output
    
    return (inputTokens / 1000 * modelPricing.input) + (outputTokens / 1000 * modelPricing.output);
  }

  // Industry-specific scoring
  getIndustrySpecificScore(name, industry) {
    const patterns = {
      tech: {
        positive: [/ly$/, /io$/, /ai$/, /tech$/, /lab$/, /hub$/],
        negative: [/corp$/, /inc$/, /llc$/]
      },
      health: {
        positive: [/care$/, /health$/, /med$/, /plus$/],
        negative: [/tech$/, /lab$/]
      },
      fintech: {
        positive: [/pay$/, /coin$/, /bank$/, /fund$/],
        negative: [/game$/, /play$/]
      }
    };
    
    const industryPatterns = patterns[industry] || patterns.tech;
    let score = 5; // Neutral
    
    for (const pattern of industryPatterns.positive) {
      if (pattern.test(name.toLowerCase())) score += 2;
    }
    
    for (const pattern of industryPatterns.negative) {
      if (pattern.test(name.toLowerCase())) score -= 1;
    }
    
    return Math.max(1, Math.min(10, score));
  }

  // Calculate keyword relevance
  calculateKeywordRelevance(name, keywords) {
    let relevanceScore = 0;
    const nameLower = name.toLowerCase();
    
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      
      if (nameLower.includes(keywordLower)) {
        relevanceScore += 3; // Direct inclusion
      } else if (this.calculateLevenshteinDistance(nameLower, keywordLower) <= 2) {
        relevanceScore += 1; // Similar spelling
      }
    }
    
    return Math.min(10, relevanceScore);
  }

  // Levenshtein distance for similarity
  calculateLevenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Basic brandability analysis (from original service)
  analyzeBrandabilityBasic(name) {
    const analysis = {
      length_score: this.scoreLength(name),
      pronunciation_score: this.scorePronunciation(name),
      memorability_score: this.scoreMemorability(name),
      uniqueness_score: this.scoreUniqueness(name),
      domain_friendliness: this.scoreDomainFriendliness(name)
    };

    const overall_score = Object.values(analysis).reduce((sum, score) => sum + score, 0) / Object.keys(analysis).length;
    
    return {
      ...analysis,
      overall_score: Math.round(overall_score * 10) / 10,
      recommendations: this.generateRecommendations(name, analysis)
    };
  }

  // Scoring methods (from original service)
  scoreLength(name) {
    const length = name.length;
    if (length >= 5 && length <= 8) return 10;
    if (length >= 9 && length <= 12) return 8;
    if (length >= 3 && length <= 4) return 7;
    if (length >= 13 && length <= 15) return 6;
    return 3;
  }

  scorePronunciation(name) {
    const vowels = (name.match(/[aeiou]/gi) || []).length;
    const vowelRatio = vowels / name.length;
    
    if (vowelRatio >= 0.3 && vowelRatio <= 0.5) return 10;
    if (vowelRatio >= 0.2 && vowelRatio < 0.3) return 8;
    if (vowelRatio >= 0.5 && vowelRatio <= 0.6) return 7;
    return 5;
  }

  scoreMemorability(name) {
    let score = 10;
    
    if (/(.)\\1{2,}/.test(name)) score -= 2;
    if (/^(get|my|the|app|web)/.test(name.toLowerCase())) score -= 3;
    if (/(ly|er|ing)$/.test(name.toLowerCase())) score -= 1;
    
    if (/^[A-Z][a-z]+[A-Z][a-z]+$/.test(name)) score += 2;
    if (name.toLowerCase().includes('x') || name.toLowerCase().includes('z')) score += 1;
    
    return Math.max(1, Math.min(10, score));
  }

  scoreUniqueness(name) {
    const commonWords = ['app', 'web', 'tech', 'digital', 'online', 'smart', 'pro', 'max', 'plus'];
    let score = 10;
    
    for (const word of commonWords) {
      if (name.toLowerCase().includes(word)) {
        score -= 2;
      }
    }
    
    return Math.max(1, score);
  }

  scoreDomainFriendliness(name) {
    let score = 10;
    
    if (/[^a-zA-Z0-9-]/.test(name)) score -= 5;
    if (name.includes('-')) score -= 2;
    if (/\\d/.test(name)) score -= 1;
    if (name.length > 15) score -= 3;
    
    return Math.max(1, score);
  }

  calculateSEOPotential(name) {
    const factors = {
      brand_search_potential: name.length <= 12 ? 8 : 5,
      type_ability: /^[a-zA-Z]+$/.test(name) ? 9 : 6,
      voice_search_friendly: this.scorePronunciation(name),
      memorable_for_backlinks: this.scoreMemorability(name)
    };

    return Math.round(Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length);
  }

  assessTrademarkRisk(name) {
    const riskFactors = [];
    
    if (name.toLowerCase().includes('apple') || name.toLowerCase().includes('google')) {
      riskFactors.push('Contains major brand name');
    }
    
    if (/^(i|e)[A-Z]/.test(name)) {
      riskFactors.push('Similar to Apple naming convention');
    }
    
    return {
      risk_level: riskFactors.length > 0 ? 'medium' : 'low',
      risk_factors: riskFactors,
      recommendation: riskFactors.length > 0 ? 'Conduct trademark search' : 'Proceed with confidence'
    };
  }

  generateRecommendations(name, analysis) {
    const recommendations = [];
    
    if (analysis.length_score < 7) {
      recommendations.push('Consider shortening the name for better memorability');
    }
    
    if (analysis.pronunciation_score < 7) {
      recommendations.push('Add more vowels or simplify pronunciation');
    }
    
    if (analysis.uniqueness_score < 7) {
      recommendations.push('Make the name more distinctive to avoid confusion');
    }
    
    return recommendations;
  }

  // OpenAI API call with retry logic
  async callOpenAI(prompt, retryCount = 0) {
    try {
      const response = await Promise.race([
        openai.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a world-class startup naming consultant with 20+ years of experience.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 4000,
          temperature: 0.8,
          response_format: { type: 'json_object' }
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('OpenAI timeout')), this.timeout))
      ]);

      return response.choices[0].message.content;
      
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.warn(`OpenAI retry ${retryCount + 1}/${this.maxRetries}: ${error.message}`);
        await this.delay(1000 * (retryCount + 1));
        return this.callOpenAI(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  parseAIResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : parsed.names || [];
    } catch (error) {
      console.error(`Failed to parse AI response: ${error.message}`);
      return this.fallbackParse(response);
    }
  }

  fallbackParse(response) {
    const names = [];
    const lines = response.split('\\n');
    
    for (const line of lines) {
      const match = line.match(/^\\d+\\.\\s*(.+?)(?:\\s*-\\s*(.+))?$/);
      if (match) {
        names.push({
          name: match[1].trim(),
          explanation: match[2] || 'AI-generated startup name',
          brandability_score: 7
        });
      }
    }
    
    return names;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fallback name generation (simplified version)
  async generateFallbackNames(params) {
    const { keywords = ['startup'], industry = 'tech', style = 'modern', count = 20 } = params;
    
    // Use original fallback logic but with telemetry
    return telemetryHelpers.createSpan('fallback_generation', async (span) => {
      span.setAttributes({
        'fallback.industry': industry,
        'fallback.style': style,
        'fallback.count': count
      });
      
      // Simplified fallback generation
      const names = [];
      const baseWords = ['Tech', 'Pro', 'Smart', 'Quick', 'Fast', 'Easy', 'Simple'];
      
      for (let i = 0; i < count && i < 50; i++) {
        const keyword = keywords[i % keywords.length];
        const baseWord = baseWords[i % baseWords.length];
        
        names.push({
          name: keyword.charAt(0).toUpperCase() + keyword.slice(1) + baseWord,
          explanation: `Combines your keyword '${keyword}' with ${industry} terminology.`,
          brandability_score: Math.round((6 + Math.random() * 3) * 10) / 10,
          concerns: [],
          source: 'fallback',
          generated_at: new Date().toISOString()
        });
      }
      
      return names;
    });
  }
}

module.exports = new EnhancedNameGenerator();