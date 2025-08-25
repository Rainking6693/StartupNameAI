const OpenAI = require('openai');
const axios = require('axios');

class NameGeneratorService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Industry-specific successful patterns
    this.industryPatterns = {
      tech: {
        successful: ['Google', 'Apple', 'Uber', 'Airbnb', 'Stripe', 'Slack', 'Zoom'],
        patterns: ['Short & punchy', 'Made-up but familiar', 'Action verbs', 'Tech suffixes'],
        avoid: ['Generic tech terms', 'Complex spellings', 'Hard pronunciations']
      },
      fintech: {
        successful: ['PayPal', 'Square', 'Robinhood', 'Coinbase', 'Plaid', 'Stripe'],
        patterns: ['Trust-building', 'Financial metaphors', 'Security implications'],
        avoid: ['Playful names', 'Complex jargon', 'Risky associations']
      },
      healthcare: {
        successful: ['Teladoc', 'Moderna', 'Illumina', '23andMe', 'Veracyte'],
        patterns: ['Professional tone', 'Health associations', 'Scientific credibility'],
        avoid: ['Casual tone', 'Scary terms', 'Overly technical']
      },
      ecommerce: {
        successful: ['Amazon', 'Shopify', 'Etsy', 'eBay', 'Wish'],
        patterns: ['Marketplace feel', 'Easy to remember', 'Global appeal'],
        avoid: ['Geographic limits', 'Complex concepts', 'Hard to spell']
      },
      saas: {
        successful: ['Salesforce', 'HubSpot', 'Zendesk', 'Atlassian', 'DocuSign'],
        patterns: ['Professional tone', 'Solution-focused', 'B2B friendly'],
        avoid: ['Consumer-focused', 'Trendy slang', 'Ambiguous meaning']
      }
    };

    // Naming strategies and their characteristics
    this.namingStrategies = {
      descriptive: {
        description: 'Names that clearly describe what the company does',
        examples: ['Facebook', 'PayPal', 'LinkedIn'],
        pros: ['Clear purpose', 'Easy to understand', 'SEO benefits'],
        cons: ['Less memorable', 'Harder to trademark', 'Limited scalability']
      },
      abstract: {
        description: 'Made-up or abstract names with no direct meaning',
        examples: ['Google', 'Kodak', 'Xerox'],
        pros: ['Highly brandable', 'Trademark friendly', 'Memorable'],
        cons: ['Requires marketing investment', 'Initial confusion', 'Hard to guess meaning']
      },
      suggestive: {
        description: 'Names that hint at benefits or qualities',
        examples: ['Nike', 'Amazon', 'Uber'],
        pros: ['Brandable + meaningful', 'Emotional connection', 'Scalable'],
        cons: ['Requires creativity', 'Cultural considerations', 'May limit scope']
      },
      compound: {
        description: 'Combining two or more words',
        examples: ['YouTube', 'Facebook', 'Snapchat'],
        pros: ['Descriptive elements', 'Easier to create', 'Can be memorable'],
        cons: ['Longer names', 'Domain challenges', 'May sound generic']
      }
    };
  }

  /**
   * Generate comprehensive startup names with educational analysis
   */
  async generateNames(industry, description, preferences = {}) {
    try {
      const {
        strategy = 'mixed',
        length = 'medium',
        tone = 'professional',
        count = 50
      } = preferences;

      // Generate names using different approaches
      const [
        descriptiveNames,
        abstractNames,
        suggestiveNames,
        compoundNames,
        industrySpecificNames
      ] = await Promise.all([
        this.generateDescriptiveNames(industry, description, Math.ceil(count * 0.2)),
        this.generateAbstractNames(industry, description, Math.ceil(count * 0.2)),
        this.generateSuggestiveNames(industry, description, Math.ceil(count * 0.2)),
        this.generateCompoundNames(industry, description, Math.ceil(count * 0.2)),
        this.generateIndustrySpecificNames(industry, description, Math.ceil(count * 0.2))
      ]);

      // Combine all generated names
      const allNames = [
        ...descriptiveNames,
        ...abstractNames,
        ...suggestiveNames,
        ...compoundNames,
        ...industrySpecificNames
      ];

      // Add comprehensive analysis to each name
      const analyzedNames = await Promise.all(
        allNames.slice(0, count).map(name => this.analyzeNameComprehensively(name, industry, description))
      );

      // Sort by overall score
      analyzedNames.sort((a, b) => b.overallScore - a.overallScore);

      return {
        names: analyzedNames,
        totalGenerated: analyzedNames.length,
        industryInsights: this.getIndustryInsights(industry),
        namingStrategiesUsed: Object.keys(this.namingStrategies),
        recommendations: this.generateRecommendations(analyzedNames, industry),
        educationalContent: this.getEducationalContent(industry, analyzedNames)
      };

    } catch (error) {
      throw new Error(`Name generation failed: ${error.message}`);
    }
  }

  /**
   * Generate descriptive names that clearly explain the business
   */
  async generateDescriptiveNames(industry, description, count) {
    const prompt = `
      Generate ${count} descriptive startup names for a ${industry} company.
      Description: ${description}
      
      Requirements:
      - Names should clearly indicate what the business does
      - Professional and trustworthy tone
      - Easy to understand and remember
      - 1-3 words maximum
      - Avoid generic terms
      
      Return as JSON array: [{"name": "ExampleName", "reasoning": "why this name works"}]
    `;

    return this.callOpenAI(prompt, 'descriptive');
  }

  /**
   * Generate abstract/made-up names
   */
  async generateAbstractNames(industry, description, count) {
    const prompt = `
      Generate ${count} abstract/made-up startup names for a ${industry} company.
      Description: ${description}
      
      Requirements:
      - Creative, unique names that don't exist
      - Easy to pronounce and remember
      - 2-3 syllables ideal
      - Professional sound
      - Brandable and trademarkable
      
      Return as JSON array: [{"name": "ExampleName", "reasoning": "linguistic and phonetic explanation"}]
    `;

    return this.callOpenAI(prompt, 'abstract');
  }

  /**
   * Generate suggestive names that hint at benefits
   */
  async generateSuggestiveNames(industry, description, count) {
    const prompt = `
      Generate ${count} suggestive startup names for a ${industry} company.
      Description: ${description}
      
      Requirements:
      - Names that hint at benefits, qualities, or outcomes
      - Emotional or aspirational connection
      - Not too literal, but meaningful
      - Scalable beyond current business model
      - Globally appropriate
      
      Return as JSON array: [{"name": "ExampleName", "reasoning": "what it suggests and why"}]
    `;

    return this.callOpenAI(prompt, 'suggestive');
  }

  /**
   * Generate compound names by combining words
   */
  async generateCompoundNames(industry, description, count) {
    const prompt = `
      Generate ${count} compound startup names for a ${industry} company.
      Description: ${description}
      
      Requirements:
      - Combine 2-3 relevant words
      - Each part should add meaning
      - Easy to understand combination
      - Professional sounding
      - Consider domain availability
      
      Return as JSON array: [{"name": "ExampleName", "reasoning": "explanation of word combination"}]
    `;

    return this.callOpenAI(prompt, 'compound');
  }

  /**
   * Generate industry-specific names following successful patterns
   */
  async generateIndustrySpecificNames(industry, description, count) {
    const patterns = this.industryPatterns[industry.toLowerCase()] || this.industryPatterns.tech;
    
    const prompt = `
      Generate ${count} startup names following successful ${industry} industry patterns.
      Description: ${description}
      Successful examples in this industry: ${patterns.successful.join(', ')}
      
      Key patterns to follow: ${patterns.patterns.join(', ')}
      Avoid: ${patterns.avoid.join(', ')}
      
      Requirements:
      - Follow proven patterns in this industry
      - Professional and industry-appropriate
      - Memorable and brandable
      - Consider target audience expectations
      
      Return as JSON array: [{"name": "ExampleName", "reasoning": "how it follows industry patterns"}]
    `;

    return this.callOpenAI(prompt, 'industry-specific');
  }

  /**
   * Comprehensive name analysis with educational insights
   */
  async analyzeNameComprehensively(nameObj, industry, description) {
    const name = nameObj.name;
    
    // Calculate various scores
    const brandabilityScore = this.calculateBrandabilityScore(name);
    const pronounciationScore = this.calculatePronunciationScore(name);
    const memorabilityScore = this.calculateMemorabilityScore(name);
    const industryFitScore = this.calculateIndustryFitScore(name, industry);
    const domainScore = await this.calculateDomainScore(name);
    const trademarkScore = this.calculateTrademarkScore(name);

    // Calculate overall score
    const overallScore = Math.round(
      (brandabilityScore * 0.25) +
      (pronounciationScore * 0.15) +
      (memorabilityScore * 0.20) +
      (industryFitScore * 0.15) +
      (domainScore * 0.15) +
      (trademarkScore * 0.10)
    );

    // Generate educational insights
    const insights = await this.generateEducationalInsights(name, industry, nameObj.reasoning);

    return {
      name,
      strategy: nameObj.strategy || 'mixed',
      reasoning: nameObj.reasoning,
      
      // Scoring breakdown
      scores: {
        overall: overallScore,
        brandability: brandabilityScore,
        pronunciation: pronounciationScore,
        memorability: memorabilityScore,
        industryFit: industryFitScore,
        domain: domainScore,
        trademark: trademarkScore
      },
      
      // Educational analysis
      analysis: {
        strengths: this.identifyStrengths(name, nameObj),
        challenges: this.identifyChallenges(name, industry),
        recommendations: this.generateNameRecommendations(name, overallScore),
        psychology: insights.psychology,
        linguistics: insights.linguistics,
        brandingAdvice: insights.branding
      },
      
      // Practical considerations
      practical: {
        domainSuggestions: this.generateDomainSuggestions(name),
        socialHandles: this.generateSocialHandleSuggestions(name),
        internationalConsiderations: this.getInternationalConsiderations(name),
        scalabilityNotes: this.getScalabilityNotes(name, description)
      },
      
      // Comparison data
      similarSuccessfulNames: this.findSimilarSuccessfulNames(name, industry),
      overallScore
    };
  }

  /**
   * Call OpenAI API with error handling and parsing
   */
  async callOpenAI(prompt, strategy) {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      });

      const content = response.choices[0].message.content;
      let names = [];

      try {
        names = JSON.parse(content);
      } catch (parseError) {
        // Fallback parsing if JSON fails
        names = this.parseNamesFromText(content);
      }

      return names.map(nameObj => ({
        ...nameObj,
        strategy
      }));

    } catch (error) {
      console.error(`OpenAI API error for ${strategy}:`, error);
      return this.getFallbackNames(strategy);
    }
  }

  /**
   * Calculate brandability score based on multiple factors
   */
  calculateBrandabilityScore(name) {
    let score = 50; // Base score

    // Length optimization (2-3 syllables ideal)
    const syllables = this.countSyllables(name);
    if (syllables >= 2 && syllables <= 3) score += 15;
    else if (syllables === 1 || syllables === 4) score += 5;
    else score -= 10;

    // Character length (5-12 characters ideal)
    if (name.length >= 5 && name.length <= 12) score += 10;
    else if (name.length >= 3 && name.length <= 15) score += 5;
    else score -= 15;

    // Pronunciation ease
    if (this.isEasyToPronounce(name)) score += 15;

    // Uniqueness
    if (this.isUniqueName(name)) score += 10;

    // Memorability factors
    if (this.hasStrongPhonetics(name)) score += 10;
    if (this.hasRhythm(name)) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate pronunciation difficulty score
   */
  calculatePronunciationScore(name) {
    let score = 80;

    // Check for difficult combinations
    const difficultPatterns = /[xz]{2,}|[qwx](?![u])|[^aeiouy]{4,}/i;
    if (difficultPatterns.test(name)) score -= 30;

    // Consonant clusters
    if (/[bcdfgjklmnpqrstvwxyz]{3,}/i.test(name)) score -= 20;

    // Length penalty for pronunciation
    if (name.length > 12) score -= 15;
    if (name.length > 15) score -= 25;

    // Silent letters or unusual pronunciations
    if (/gh|ough|augh|kn|wr|mb$/i.test(name)) score -= 10;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate memorability score
   */
  calculateMemorabilityScore(name) {
    let score = 50;

    // Rhythm and flow
    if (this.hasGoodRhythm(name)) score += 20;

    // Alliteration
    if (this.hasAlliteration(name)) score += 15;

    // Distinctive sounds
    if (this.hasDistinctiveSounds(name)) score += 15;

    // Length for memorability (shorter is often better)
    if (name.length <= 8) score += 15;
    else if (name.length <= 12) score += 5;
    else score -= 10;

    // Familiar patterns
    if (this.hasFamiliarPatterns(name)) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate how well the name fits the industry
   */
  calculateIndustryFitScore(name, industry) {
    const patterns = this.industryPatterns[industry.toLowerCase()];
    if (!patterns) return 70; // Neutral score for unknown industries

    let score = 50;

    // Check against successful patterns
    const nameStyle = this.analyzeNameStyle(name);
    if (patterns.patterns.some(pattern => this.matchesPattern(nameStyle, pattern))) {
      score += 30;
    }

    // Check against avoid patterns
    if (patterns.avoid.some(avoid => this.matchesAvoidPattern(name, avoid))) {
      score -= 25;
    }

    // Professional tone check for business industries
    if (['fintech', 'healthcare', 'saas'].includes(industry.toLowerCase())) {
      if (this.soundsProfessional(name)) score += 20;
      else score -= 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate domain availability score (mock implementation)
   */
  async calculateDomainScore(name) {
    // In a real implementation, this would check actual domain availability
    // For now, we'll simulate based on name characteristics
    
    let score = 60;

    // Shorter names typically have better domain availability scores
    if (name.length <= 8) score += 20;
    else if (name.length <= 12) score += 10;

    // Common words likely taken
    if (this.isCommonWord(name)) score -= 30;

    // Made-up words likely available
    if (this.isMadeUpWord(name)) score += 25;

    // Extension alternatives boost score
    score += 15; // Assuming alternatives like .io, .co exist

    return Math.min(100, Math.max(10, score));
  }

  /**
   * Calculate trademark potential score
   */
  calculateTrademarkScore(name) {
    let score = 70;

    // Distinctive names score higher
    if (this.isDistinctiveName(name)) score += 20;

    // Common/generic names score lower
    if (this.isGenericName(name)) score -= 40;

    // Made-up names typically trademark well
    if (this.isMadeUpWord(name)) score += 15;

    // Length considerations
    if (name.length >= 4) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate educational insights about the name
   */
  async generateEducationalInsights(name, industry, reasoning) {
    const prompt = `
      Provide educational insights about the startup name "${name}" for a ${industry} business.
      Original reasoning: ${reasoning}
      
      Analyze:
      1. Psychology: Why this name works from a psychological perspective
      2. Linguistics: Sound patterns, syllable structure, phonetic appeal
      3. Branding: How to build a brand around this name
      4. Market positioning: How this name positions the company
      5. Potential challenges: What to watch out for
      
      Keep insights educational and actionable for entrepreneurs.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      });

      const insights = response.choices[0].message.content;
      return this.parseEducationalInsights(insights);
    } catch (error) {
      return this.getFallbackInsights(name);
    }
  }

  /**
   * Get industry-specific insights and patterns
   */
  getIndustryInsights(industry) {
    const patterns = this.industryPatterns[industry.toLowerCase()] || this.industryPatterns.tech;
    
    return {
      industry,
      successfulExamples: patterns.successful,
      recommendedPatterns: patterns.patterns,
      patternsToAvoid: patterns.avoid,
      keyConsiderations: this.getIndustryConsiderations(industry),
      marketTrends: this.getIndustryTrends(industry),
      targetAudiencePreferences: this.getAudiencePreferences(industry)
    };
  }

  /**
   * Generate recommendations based on analysis results
   */
  generateRecommendations(names, industry) {
    const topNames = names.slice(0, 5);
    const avgScore = names.reduce((sum, name) => sum + name.overallScore, 0) / names.length;

    return {
      topPicks: topNames.map(name => ({
        name: name.name,
        score: name.overallScore,
        reason: `${name.reasoning} (Score: ${name.overallScore}/100)`
      })),
      generalAdvice: [
        'Consider how the name will work internationally',
        'Test pronunciation with your target audience',
        'Check social media handle availability',
        'Think about future business expansion'
      ],
      industrySpecific: this.getIndustrySpecificAdvice(industry),
      nextSteps: [
        'Narrow down to 3-5 favorites',
        'Test with potential customers',
        'Check comprehensive trademark databases',
        'Secure domains and social handles'
      ]
    };
  }

  // Helper methods for scoring calculations
  countSyllables(word) {
    return word.toLowerCase().replace(/[^a-z]/g, '')
      .replace(/[^aeiouy]?y[^aeiouy]/g, '')
      .match(/[aeiouy]{1,2}/g)?.length || 1;
  }

  isEasyToPronounce(name) {
    const difficultPatterns = /[xz]{2,}|[qwx](?![u])|[^aeiouy]{4,}/i;
    return !difficultPatterns.test(name) && name.length <= 12;
  }

  isUniqueName(name) {
    const commonWords = ['app', 'tech', 'soft', 'digital', 'solutions', 'systems', 'pro', 'max'];
    return !commonWords.some(word => name.toLowerCase().includes(word.toLowerCase()));
  }

  hasStrongPhonetics(name) {
    return /[bkptdg]/i.test(name);
  }

  hasRhythm(name) {
    return this.countSyllables(name) >= 2 && this.countSyllables(name) <= 4;
  }

  // Additional helper methods would be implemented here...
  
  /**
   * Fallback names if API fails
   */
  getFallbackNames(strategy) {
    const fallbacks = {
      descriptive: [
        { name: 'DataFlow', reasoning: 'Clearly indicates data management' },
        { name: 'CloudSync', reasoning: 'Suggests cloud synchronization' }
      ],
      abstract: [
        { name: 'Zenara', reasoning: 'Unique, memorable sound pattern' },
        { name: 'Vortix', reasoning: 'Strong phonetics, brandable' }
      ],
      // ... more fallbacks
    };
    
    return fallbacks[strategy] || fallbacks.abstract;
  }

  /**
   * Parse names from text when JSON parsing fails
   */
  parseNamesFromText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.slice(0, 10).map(line => ({
      name: line.replace(/^\d+\.\s*/, '').split(/[:\-]/)[0].trim(),
      reasoning: 'Generated name option'
    }));
  }

  /**
   * Get fallback insights when AI analysis fails
   */
  getFallbackInsights(name) {
    return {
      psychology: `The name "${name}" has potential for brand recognition`,
      linguistics: `${this.countSyllables(name)} syllables make it ${this.countSyllables(name) <= 3 ? 'easy' : 'challenging'} to remember`,
      branding: 'Focus on consistent visual identity and messaging'
    };
  }

  // More helper methods would be implemented here for comprehensive analysis...
}

module.exports = NameGeneratorService;