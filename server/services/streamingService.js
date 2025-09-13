const { ChatOpenAI } = require('@langchain/openai');
const { telemetryHelpers } = require('../config/telemetry');
const cacheService = require('./cacheService');

class StreamingService {
  constructor() {
    this.streamingLLM = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4',
      temperature: 0.8,
      maxTokens: 2000,
      streaming: true
    });
    
    this.activeStreams = new Map();
    this.streamMetrics = {
      total_streams: 0,
      active_streams: 0,
      average_duration: 0,
      total_tokens_streamed: 0
    };
  }

  // Start streaming name generation
  async startNameGenerationStream(params, response) {
    const streamId = this.generateStreamId();
    const startTime = Date.now();
    
    return telemetryHelpers.createSpan('streaming_generation', async (span) => {
      try {
        span.setAttributes({
          'streaming.stream_id': streamId,
          'streaming.industry': params.industry,
          'streaming.style': params.style,
          'streaming.count': params.count
        });

        // Set up SSE headers
        response.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control'
        });

        // Track active stream
        this.activeStreams.set(streamId, {
          startTime,
          params,
          response,
          status: 'active'
        });

        this.streamMetrics.total_streams++;
        this.streamMetrics.active_streams++;

        // Send initial stream event
        this.sendStreamEvent(response, 'stream_start', {
          stream_id: streamId,
          message: 'Starting AI name generation...',
          progress: 0
        });

        // Execute streaming generation
        await this.executeStreamingGeneration(streamId, params, response);

        // Clean up
        this.activeStreams.delete(streamId);
        this.streamMetrics.active_streams--;

        const duration = Date.now() - startTime;
        this.updateStreamMetrics(duration);

        span.setAttributes({
          'streaming.duration': duration,
          'streaming.status': 'completed'
        });

      } catch (error) {
        span.recordException(error);
        this.handleStreamError(streamId, error, response);
      }
    });
  }

  // Execute the actual streaming generation
  async executeStreamingGeneration(streamId, params, response) {
    const { keywords, industry, style, count = 20 } = params;
    
    try {
      // Phase 1: Market Research (10% progress)
      this.sendStreamEvent(response, 'progress', {
        stream_id: streamId,
        phase: 'research',
        message: 'Analyzing market trends and competitors...',
        progress: 10
      });

      const marketContext = await this.getMarketContext(industry);
      
      // Phase 2: Creative Generation (20-70% progress)
      this.sendStreamEvent(response, 'progress', {
        stream_id: streamId,
        phase: 'generation',
        message: 'Generating creative names...',
        progress: 20
      });

      const generatedNames = [];
      const batchSize = 5;
      const totalBatches = Math.ceil(count / batchSize);

      for (let batch = 0; batch < totalBatches; batch++) {
        const batchNames = await this.generateNameBatch({
          keywords,
          industry,
          style,
          count: Math.min(batchSize, count - generatedNames.length),
          marketContext,
          existingNames: generatedNames
        });

        generatedNames.push(...batchNames);

        // Send incremental results
        const progress = 20 + ((batch + 1) / totalBatches) * 50;
        this.sendStreamEvent(response, 'names_batch', {
          stream_id: streamId,
          batch_number: batch + 1,
          names: batchNames,
          total_generated: generatedNames.length,
          progress: Math.round(progress)
        });

        // Small delay to prevent overwhelming the client
        await this.delay(100);
      }

      // Phase 3: Analysis and Enhancement (70-90% progress)
      this.sendStreamEvent(response, 'progress', {
        stream_id: streamId,
        phase: 'analysis',
        message: 'Analyzing and enhancing names...',
        progress: 70
      });

      const enhancedNames = await this.enhanceNamesStream(generatedNames, {
        industry,
        keywords,
        streamId,
        response
      });

      // Phase 4: Final Optimization (90-100% progress)
      this.sendStreamEvent(response, 'progress', {
        stream_id: streamId,
        phase: 'optimization',
        message: 'Optimizing and ranking results...',
        progress: 90
      });

      const finalNames = await this.optimizeNamesStream(enhancedNames, {
        industry,
        targetCount: count,
        streamId,
        response
      });

      // Send final results
      this.sendStreamEvent(response, 'completion', {
        stream_id: streamId,
        names: finalNames,
        total_count: finalNames.length,
        progress: 100,
        metadata: {
          generation_time: Date.now() - this.activeStreams.get(streamId).startTime,
          quality_score: this.calculateAverageQuality(finalNames),
          industry,
          style
        }
      });

      // Close the stream
      response.end();

    } catch (error) {
      throw error;
    }
  }

  // Generate a batch of names with streaming
  async generateNameBatch(params) {
    const { keywords, industry, style, count, marketContext, existingNames } = params;
    
    const prompt = `
You are a creative startup naming expert. Generate ${count} innovative startup names.

Context:
- Industry: ${industry}
- Keywords: ${keywords.join(', ')}
- Style: ${style}
- Market Context: ${marketContext}
- Avoid similarity to: ${existingNames.map(n => n.name).join(', ')}

Generate exactly ${count} names with explanations and scores.

Format as JSON:
{
  "names": [
    {
      "name": "ExampleName",
      "explanation": "Why this name works",
      "brandability_score": 8.5,
      "creativity_score": 9.0
    }
  ]
}
    `;

    try {
      const response = await this.streamingLLM.invoke([
        { role: 'system', content: 'You are a world-class startup naming consultant.' },
        { role: 'user', content: prompt }
      ]);

      const parsed = JSON.parse(response.content);
      return parsed.names || [];
    } catch (error) {
      console.warn('Batch generation failed, using fallback:', error.message);
      return this.generateFallbackBatch(params);
    }
  }

  // Enhance names with streaming updates
  async enhanceNamesStream(names, context) {
    const { industry, keywords, streamId, response } = context;
    const enhancedNames = [];

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      
      try {
        // Add domain checking and brandability analysis
        const enhancement = await this.enhanceSingleName(name, industry);
        enhancedNames.push({
          ...name,
          ...enhancement
        });

        // Send progress update every 5 names
        if ((i + 1) % 5 === 0) {
          const progress = 70 + ((i + 1) / names.length) * 20;
          this.sendStreamEvent(response, 'analysis_progress', {
            stream_id: streamId,
            analyzed_count: i + 1,
            total_count: names.length,
            progress: Math.round(progress)
          });
        }
      } catch (error) {
        // Keep original name if enhancement fails
        enhancedNames.push(name);
      }
    }

    return enhancedNames;
  }

  // Optimize names with streaming updates
  async optimizeNamesStream(names, context) {
    const { industry, targetCount, streamId, response } = context;
    
    // Calculate optimization scores
    const optimizedNames = names.map(name => ({
      ...name,
      optimization_score: this.calculateOptimizationScore(name),
      final_score: this.calculateFinalScore(name)
    }));

    // Sort by final score
    optimizedNames.sort((a, b) => b.final_score - a.final_score);

    // Send optimization update
    this.sendStreamEvent(response, 'optimization_complete', {
      stream_id: streamId,
      optimized_count: optimizedNames.length,
      average_score: optimizedNames.reduce((sum, n) => sum + n.final_score, 0) / optimizedNames.length,
      progress: 95
    });

    // Return top results
    return optimizedNames.slice(0, targetCount);
  }

  // Enhance a single name with additional analysis
  async enhanceSingleName(name, industry) {
    return {
      domain_analysis: await this.quickDomainCheck(name.name),
      seo_potential: this.calculateSEOPotential(name.name),
      memorability_score: this.calculateMemorability(name.name),
      industry_fit_score: this.calculateIndustryFit(name.name, industry)
    };
  }

  // Quick domain availability estimation
  async quickDomainCheck(name) {
    // This would integrate with domain checking APIs
    // For now, return estimated availability based on name characteristics
    const score = this.estimateDomainAvailability(name);
    return {
      estimated_available: score > 0.7,
      availability_score: score,
      recommended_extensions: ['.com', '.io', '.ai']
    };
  }

  // Estimate domain availability based on name characteristics
  estimateDomainAvailability(name) {
    let score = 0.8; // Base score
    
    // Longer names more likely to be available
    if (name.length > 8) score += 0.1;
    if (name.length > 12) score += 0.1;
    
    // Unique combinations more likely to be available
    if (!/^(get|my|the|app|web)/.test(name.toLowerCase())) score += 0.1;
    if (!/^[a-z]+$/.test(name.toLowerCase())) score += 0.05;
    
    return Math.min(1.0, score);
  }

  // Calculate SEO potential
  calculateSEOPotential(name) {
    let score = 8; // Base score
    
    if (name.length <= 12) score += 1;
    if (/^[a-zA-Z]+$/.test(name)) score += 1;
    if (!/[0-9]/.test(name)) score += 0.5;
    
    return Math.min(10, score);
  }

  // Calculate memorability score
  calculateMemorability(name) {
    const length = name.length;
    const vowels = (name.match(/[aeiou]/gi) || []).length;
    const vowelRatio = vowels / length;
    
    let score = 8; // Base score
    
    // Optimal length
    if (length >= 5 && length <= 8) score += 1;
    
    // Good vowel ratio
    if (vowelRatio >= 0.3 && vowelRatio <= 0.5) score += 1;
    
    // Avoid repetitive patterns
    if (!(/(.)\\1{2,}/.test(name))) score += 0.5;
    
    return Math.min(10, score);
  }

  // Calculate industry fit score
  calculateIndustryFit(name, industry) {
    const industryKeywords = {
      tech: ['tech', 'data', 'cloud', 'ai', 'digital', 'cyber', 'net', 'code'],
      health: ['health', 'care', 'med', 'bio', 'life', 'vital', 'cure', 'heal'],
      fintech: ['fin', 'pay', 'bank', 'coin', 'fund', 'invest', 'money', 'capital'],
      ecommerce: ['shop', 'buy', 'cart', 'market', 'store', 'trade', 'retail']
    };
    
    const keywords = industryKeywords[industry] || [];
    const nameLower = name.toLowerCase();
    
    let score = 7; // Base score
    
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        score += 1;
        break; // Only count one match
      }
    }
    
    return Math.min(10, score);
  }

  // Calculate optimization score
  calculateOptimizationScore(name) {
    const factors = {
      brandability: name.brandability_score || 7,
      creativity: name.creativity_score || 7,
      memorability: name.memorability_score || 7,
      industry_fit: name.industry_fit_score || 7
    };
    
    const weights = {
      brandability: 0.4,
      creativity: 0.3,
      memorability: 0.2,
      industry_fit: 0.1
    };
    
    return Object.keys(factors).reduce((score, factor) => {
      return score + (factors[factor] * weights[factor]);
    }, 0);
  }

  // Calculate final composite score
  calculateFinalScore(name) {
    return (
      (name.optimization_score || 0) * 0.5 +
      (name.brandability_score || 0) * 0.3 +
      (name.seo_potential || 0) * 0.1 +
      (name.memorability_score || 0) * 0.1
    );
  }

  // Calculate average quality of names
  calculateAverageQuality(names) {
    if (!names || names.length === 0) return 0;
    
    const scores = names.map(name => name.final_score || name.optimization_score || 0);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  // Send Server-Sent Event
  sendStreamEvent(response, eventType, data) {
    try {
      const eventData = JSON.stringify(data);
      response.write(`event: ${eventType}\n`);
      response.write(`data: ${eventData}\n\n`);
    } catch (error) {
      console.error('Failed to send stream event:', error);
    }
  }

  // Handle stream errors
  handleStreamError(streamId, error, response) {
    console.error(`Stream ${streamId} error:`, error);
    
    this.sendStreamEvent(response, 'error', {
      stream_id: streamId,
      error: 'Generation failed',
      message: 'An error occurred during name generation. Please try again.',
      timestamp: Date.now()
    });
    
    // Clean up
    if (this.activeStreams.has(streamId)) {
      this.activeStreams.delete(streamId);
      this.streamMetrics.active_streams--;
    }
    
    response.end();
  }

  // Generate fallback names when AI fails
  generateFallbackBatch(params) {
    const { keywords, industry, count } = params;
    const names = [];
    
    const suffixes = ['ly', 'io', 'ai', 'tech', 'lab', 'hub', 'pro'];
    const prefixes = ['smart', 'quick', 'fast', 'easy', 'simple'];
    
    for (let i = 0; i < count && names.length < count; i++) {
      const keyword = keywords[i % keywords.length];
      const suffix = suffixes[i % suffixes.length];
      const prefix = prefixes[i % prefixes.length];
      
      const strategies = [
        `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`,
        `${prefix.charAt(0).toUpperCase() + prefix.slice(1)}${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`,
        `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}Pro`
      ];
      
      const name = strategies[i % strategies.length];
      
      names.push({
        name,
        explanation: `Combines ${keyword} with ${industry} terminology for clear market positioning.`,
        brandability_score: 6.5 + Math.random() * 2,
        creativity_score: 6.0 + Math.random() * 1.5,
        source: 'fallback'
      });
    }
    
    return names;
  }

  // Get market context for industry
  async getMarketContext(industry) {
    const contexts = {
      tech: 'Fast-paced innovation, scalability focus, disruption-oriented',
      health: 'Trust-building, regulatory compliance, patient-centric approach',
      fintech: 'Security-first, regulatory awareness, financial trust building',
      ecommerce: 'Customer experience focus, global reach, brand recognition'
    };
    
    return contexts[industry] || 'Professional business environment';
  }

  // Utility methods
  generateStreamId() {
    return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateStreamMetrics(duration) {
    const currentAvg = this.streamMetrics.average_duration;
    const totalStreams = this.streamMetrics.total_streams;
    
    this.streamMetrics.average_duration = 
      ((currentAvg * (totalStreams - 1)) + duration) / totalStreams;
  }

  // Get streaming service status
  getStatus() {
    return {
      service: 'streaming',
      status: 'active',
      metrics: {
        ...this.streamMetrics,
        active_streams_list: Array.from(this.activeStreams.keys())
      },
      model: this.streamingLLM.modelName,
      capabilities: ['real_time_generation', 'progressive_enhancement', 'batch_processing']
    };
  }

  // Clean up inactive streams
  cleanupInactiveStreams() {
    const now = Date.now();
    const timeout = 5 * 60 * 1000; // 5 minutes
    
    for (const [streamId, stream] of this.activeStreams) {
      if (now - stream.startTime > timeout) {
        console.log(`Cleaning up inactive stream: ${streamId}`);
        this.activeStreams.delete(streamId);
        this.streamMetrics.active_streams--;
      }
    }
  }
}

module.exports = new StreamingService();