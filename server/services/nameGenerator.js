const OpenAI = require('openai');

class NameGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Successful startup naming patterns database
    this.successPatterns = {
      tech: ['Uber', 'Airbnb', 'Stripe', 'Slack', 'Zoom'],
      fintech: ['PayPal', 'Square', 'Robinhood', 'Coinbase', 'Plaid'],
      ecommerce: ['Shopify', 'Amazon', 'Etsy', 'eBay', 'Wish'],
      saas: ['Salesforce', 'HubSpot', 'Zendesk', 'Atlassian', 'DocuSign'],
      healthcare: ['Teladoc', 'Veracyte', '23andMe', 'Moderna', 'Illumina']
    };
  }

  /**
   * Generate educational AI naming suggestions with detailed analysis
   */
  async generateNames(industry, description, preferences = {}) {
    try {
      const experiments = await Promise.all([
        this.classicAlgorithm(industry, description),
        this.creativeFusion(industry, description),
        this.brandableFormula(industry, description),
        this.industryExpert(industry, description)
      ]);

      const allNames = experiments.flat();
      
      // Add educational analysis to each name
      const analyzedNames = await Promise.all(
        allNames.map(name => this.addEducationalAnalysis(name, industry))
      );

      return {
        experimentResults: {
          classic: experiments[0],
          creative: experiments[1],
          brandable: experiments[2],
          industrySpecific: experiments[3]
        },
        allNames: analyzedNames,
        totalGenerated: analyzedNames.length,
        confidence: this.calculateConfidence(analyzedNames),
        industryInsights: this.getIndustryInsights(industry),
        namingLessons: this.extractNamingLessons(analyzedNames, industry)
      };
    } catch (error) {
      throw new Error(`Name generation failed: ${error.message}`);
    }
  }

  /**
   * Classic Algorithm - Traditional naming patterns
   */
  async classicAlgorithm(industry, description) {
    const prompt = `
      As a naming expert, generate 10 startup names using CLASSIC naming patterns.
      
      Industry: ${industry}
      Description: ${description}
      
      Focus on:
      - Clear, descriptive naming
      - Professional tone
      - Easy to understand and remember
      - Traditional business naming conventions
      
      Return JSON array with objects containing: name, rationale, pattern_used
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return this.parseNamingResponse(response.choices[0].message.content, 'classic');
  }

  /**
   * Creative Fusion - Unexpected combinations
   */
  async creativeFusion(industry, description) {
    const prompt = `
      Generate 10 startup names using CREATIVE FUSION approach.
      
      Industry: ${industry}
      Description: ${description}
      
      Techniques:
      - Combine unexpected word pairs
      - Use metaphors and abstract concepts
      - Create unique portmanteaus
      - Blend different languages or cultural references
      
      Return JSON array with objects containing: name, fusion_elements, creativity_explanation
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
    });

    return this.parseNamingResponse(response.choices[0].message.content, 'creative');
  }

  /**
   * Brandable Formula - Optimized for memorability
   */
  async brandableFormula(industry, description) {
    const prompt = `
      Generate 10 startup names optimized for BRANDABILITY.
      
      Industry: ${industry}
      Description: ${description}
      
      Optimization criteria:
      - 2-3 syllables maximum
      - Easy to pronounce globally
      - Unique but familiar feeling
      - Strong phonetic appeal
      - Trademark-friendly structure
      
      Return JSON array with objects containing: name, syllable_count, phonetic_appeal, brandability_score
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    return this.parseNamingResponse(response.choices[0].message.content, 'brandable');
  }

  /**
   * Industry Expert - Sector-specific naming
   */
  async industryExpert(industry, description) {
    const successfulNames = this.successPatterns[industry.toLowerCase()] || [];
    
    const prompt = `
      Generate 10 startup names as an INDUSTRY EXPERT in ${industry}.
      
      Description: ${description}
      Successful ${industry} names for reference: ${successfulNames.join(', ')}
      
      Apply industry-specific insights:
      - Follow successful naming patterns in this sector
      - Use industry-appropriate terminology
      - Consider target audience expectations
      - Reflect industry evolution and trends
      
      Return JSON array with objects containing: name, industry_pattern, target_audience, evolution_factor
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    return this.parseNamingResponse(response.choices[0].message.content, 'industry');
  }

  /**
   * Add comprehensive educational analysis to each name
   */
  async addEducationalAnalysis(nameObj, industry) {
    const analysis = await this.analyzeNameEducationally(nameObj.name, industry);
    
    return {
      ...nameObj,
      labAnalysis: {
        whyThisWorks: analysis.explanation,
        brandabilityScore: this.calculateBrandabilityScore(nameObj.name),
        psychologyInsights: analysis.psychology,
        successfulSimilar: this.findSimilarSuccessfulNames(nameObj.name, industry),
        potentialChallenges: analysis.challenges,
        scalingConsiderations: analysis.scaling,
        culturalConsiderations: analysis.cultural,
        domainPotential: this.assessDomainPotential(nameObj.name),
        trademarkLandscape: analysis.trademark
      },
      namingLesson: {
        principleUsed: analysis.principle,
        lessonExplanation: analysis.lesson,
        whenToUseThis: analysis.application,
        avoidanceWarning: analysis.warning
      },
      recommendationLevel: this.calculateRecommendationLevel(nameObj.name, industry)
    };
  }

  /**
   * Analyze name from educational perspective
   */
  async analyzeNameEducationally(name, industry) {
    const prompt = `
      As a naming expert educator, provide comprehensive analysis of the startup name "${name}" for ${industry} industry.
      
      Provide detailed educational insights on:
      1. Why this name works (psychology, linguistics, marketing)
      2. Naming principle/strategy used
      3. Potential challenges or limitations
      4. Scaling considerations for global growth
      5. Cultural and linguistic considerations
      6. Trademark landscape insights
      7. Key lesson entrepreneurs can learn
      8. When to apply this naming strategy
      9. Common mistakes to avoid with this approach
      
      Format as detailed educational content that teaches naming principles.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    return this.parseEducationalAnalysis(response.choices[0].message.content);
  }

  /**
   * Calculate brandability score using multiple factors
   */
  calculateBrandabilityScore(name) {
    let score = 10;
    
    // Length optimization (2-3 syllables ideal)
    const syllables = this.countSyllables(name);
    if (syllables >= 2 && syllables <= 3) score += 2;
    else if (syllables === 1 || syllables === 4) score += 1;
    else score -= 1;
    
    // Pronunciation ease
    if (this.isEasyToPronounce(name)) score += 2;
    
    // Uniqueness check
    if (this.isUniqueName(name)) score += 2;
    
    // Domain potential
    if (name.length <= 8) score += 1;
    
    // Memorability factors
    if (this.hasStrongPhonetics(name)) score += 1;
    
    return Math.min(10, Math.max(1, score));
  }

  /**
   * Find similar successful startup names for learning
   */
  findSimilarSuccessfulNames(name, industry) {
    const allSuccessful = Object.values(this.successPatterns).flat();
    
    return allSuccessful
      .filter(successName => this.calculateSimilarity(name, successName) > 0.3)
      .slice(0, 3)
      .map(similarName => ({
        name: similarName,
        similarity: this.calculateSimilarity(name, similarName),
        lesson: `Similar ${this.identifyNamingPattern(similarName)} pattern`
      }));
  }

  /**
   * Get industry-specific naming insights
   */
  getIndustryInsights(industry) {
    const insights = {
      tech: {
        trends: ['Short, punchy names', 'Made-up words that sound familiar', 'Action-oriented verbs'],
        avoid: ['Generic tech terms', 'Overly complex spellings', 'Hard to pronounce combinations'],
        examples: 'Google, Uber, Slack - all easy to say and remember'
      },
      fintech: {
        trends: ['Trust-building names', 'Financial metaphors', 'Security implications'],
        avoid: ['Playful names that reduce trust', 'Complex financial jargon', 'Risky associations'],
        examples: 'PayPal, Square, Stripe - convey reliability and simplicity'
      },
      healthcare: {
        trends: ['Professional sounding', 'Health/care associations', 'Scientific credibility'],
        avoid: ['Casual or playful tones', 'Scary medical terms', 'Overly technical names'],
        examples: 'Teladoc, Moderna - professional yet approachable'
      }
    };
    
    return insights[industry.toLowerCase()] || insights.tech;
  }

  /**
   * Extract key naming lessons from generated names
   */
  extractNamingLessons(names, industry) {
    return [
      {
        lesson: 'Brandability vs Descriptiveness Balance',
        explanation: 'The best startup names balance being memorable with being understandable',
        examples: names.slice(0, 2).map(n => n.name)
      },
      {
        lesson: 'Industry Pattern Recognition',
        explanation: `${industry} startups often follow specific naming conventions for trust and recognition`,
        examples: names.filter(n => n.experiment === 'industry').slice(0, 2).map(n => n.name)
      },
      {
        lesson: 'Global Scaling Considerations',
        explanation: 'Names should work across cultures and languages for international expansion',
        examples: names.filter(n => n.labAnalysis?.brandabilityScore > 7).slice(0, 2).map(n => n.name)
      }
    ];
  }

  // Utility methods for name analysis
  parseNamingResponse(response, experiment) {
    try {
      const parsed = JSON.parse(response);
      return parsed.map(item => ({ ...item, experiment }));
    } catch (error) {
      // Fallback parsing if JSON fails
      return this.extractNamesFromText(response, experiment);
    }
  }

  parseEducationalAnalysis(content) {
    // Parse the educational analysis response
    return {
      explanation: this.extractSection(content, 'why this works'),
      psychology: this.extractSection(content, 'psychology'),
      principle: this.extractSection(content, 'principle'),
      challenges: this.extractSection(content, 'challenges'),
      scaling: this.extractSection(content, 'scaling'),
      cultural: this.extractSection(content, 'cultural'),
      trademark: this.extractSection(content, 'trademark'),
      lesson: this.extractSection(content, 'lesson'),
      application: this.extractSection(content, 'when to'),
      warning: this.extractSection(content, 'avoid')
    };
  }

  extractSection(content, keyword) {
    const lines = content.split('\n');
    const startIndex = lines.findIndex(line => 
      line.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (startIndex === -1) return `Insight about ${keyword} for this naming approach.`;
    
    const relevantLines = lines.slice(startIndex, startIndex + 3);
    return relevantLines.join(' ').replace(/^\d+\.\s*/, '').trim();
  }

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
    const commonWords = ['app', 'tech', 'soft', 'digital', 'solutions', 'systems'];
    return !commonWords.some(word => name.toLowerCase().includes(word));
  }

  hasStrongPhonetics(name) {
    const strongSounds = /[bkptdg]/i;
    return strongSounds.test(name);
  }

  calculateSimilarity(name1, name2) {
    const longer = name1.length > name2.length ? name1 : name2;
    const shorter = name1.length > name2.length ? name2 : name1;
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitution = matrix[j - 1][i - 1] + (str1[i - 1] === str2[j - 1] ? 0 : 1);
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  identifyNamingPattern(name) {
    if (name.length <= 5) return 'short-punchy';
    if (/[A-Z]/.test(name.slice(1))) return 'camelCase';
    if (name.includes('-')) return 'compound';
    return 'standard';
  }

  assessDomainPotential(name) {
    return {
      dotCom: name.length <= 10 ? 'High' : 'Medium',
      alternatives: ['.io', '.co', '.ai'],
      estimated_availability: Math.random() > 0.7 ? 'Likely Available' : 'Check Required'
    };
  }

  calculateRecommendationLevel(name, industry) {
    const brandability = this.calculateBrandabilityScore(name);
    const industryFit = this.assessIndustryFit(name, industry);
    
    const overall = (brandability + industryFit) / 2;
    
    if (overall >= 8) return 'Highly Recommended';
    if (overall >= 6) return 'Recommended';
    if (overall >= 4) return 'Consider with Caution';
    return 'Not Recommended';
  }

  assessIndustryFit(name, industry) {
    // Simple industry fit assessment
    const industryKeywords = {
      tech: ['tech', 'digital', 'data', 'cloud', 'ai'],
      fintech: ['pay', 'coin', 'wallet', 'bank', 'finance'],
      healthcare: ['health', 'care', 'med', 'doc', 'cure']
    };
    
    const keywords = industryKeywords[industry.toLowerCase()] || [];
    const hasKeyword = keywords.some(keyword => 
      name.toLowerCase().includes(keyword)
    );
    
    return hasKeyword ? 8 : 6; // Base industry fit score
  }

  calculateConfidence(names) {
    const avgBrandability = names.reduce((sum, name) => 
      sum + (name.labAnalysis?.brandabilityScore || 5), 0) / names.length;
    
    return Math.round(avgBrandability * 10);
  }

  extractNamesFromText(text, experiment) {
    // Fallback method to extract names from unstructured text
    const lines = text.split('\n').filter(line => line.trim());
    return lines.slice(0, 10).map((line, index) => ({
      name: line.replace(/^\d+\.\s*/, '').split(' ')[0],
      experiment,
      rationale: `Generated using ${experiment} approach`
    }));
  }
}

module.exports = NameGenerator;