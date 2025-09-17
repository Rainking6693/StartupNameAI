class EnhancedAINameGenerator {
  constructor() {
    this.industryIntelligence = {
      tech: {
        metaphors: ['quantum', 'neural', 'fusion', 'nexus', 'vertex', 'apex', 'zenith', 'matrix'],
        emotions: ['innovation', 'disruption', 'precision', 'velocity', 'breakthrough', 'evolution'],
        patterns: ['compound-tech', 'invented-scientific', 'metaphor-future', 'greek-tech'],
        avoid: ['generic-tech', 'overused-cloud', 'cliche-digital'],
        successfulPatterns: ['Google', 'Tesla', 'Nvidia', 'Palantir', 'Anthropic']
      },
      healthcare: {
        metaphors: ['vital', 'harmony', 'beacon', 'sanctuary', 'genesis', 'remedy', 'pulse', 'care'],
        emotions: ['trust', 'care', 'healing', 'hope', 'strength', 'wellness', 'vitality'],
        patterns: ['latin-medical', 'compound-care', 'metaphor-life', 'trust-building'],
        avoid: ['cold-clinical', 'scary-medical', 'impersonal'],
        successfulPatterns: ['Moderna', 'Illumina', 'Veracyte', 'Guardant', 'Tempus']
      },
      fintech: {
        metaphors: ['vault', 'bridge', 'compass', 'anchor', 'summit', 'fortress', 'ledger', 'mint'],
        emotions: ['security', 'growth', 'trust', 'prosperity', 'stability', 'confidence'],
        patterns: ['compound-financial', 'metaphor-security', 'invented-trust', 'latin-finance'],
        avoid: ['risky-gambling', 'complex-financial', 'intimidating'],
        successfulPatterns: ['Stripe', 'Plaid', 'Robinhood', 'Coinbase', 'Affirm']
      },
      saas: {
        metaphors: ['flow', 'sync', 'hub', 'stack', 'forge', 'craft', 'build', 'scale'],
        emotions: ['efficiency', 'productivity', 'simplicity', 'power', 'growth'],
        patterns: ['compound-productivity', 'metaphor-tools', 'invented-workflow'],
        avoid: ['complex-enterprise', 'boring-corporate', 'generic-software'],
        successfulPatterns: ['Slack', 'Notion', 'Figma', 'Airtable', 'Zapier']
      },
      ai: {
        metaphors: ['mind', 'brain', 'synapse', 'cortex', 'neural', 'cognitive', 'sentient'],
        emotions: ['intelligence', 'learning', 'insight', 'understanding', 'wisdom'],
        patterns: ['compound-intelligence', 'metaphor-mind', 'invented-cognitive'],
        avoid: ['scary-ai', 'terminator-references', 'overly-technical'],
        successfulPatterns: ['OpenAI', 'Anthropic', 'Cohere', 'Hugging Face', 'Replicate']
      }
    };
    
    this.creativeTechniques = {
      metaphorical: this.generateMetaphoricalNames.bind(this),
      emotional: this.generateEmotionalNames.bind(this),
      portmanteau: this.generatePortmanteauNames.bind(this),
      invented: this.generateInventedWords.bind(this),
      cultural: this.generateCulturalNames.bind(this),
      compound: this.generateCompoundNames.bind(this)
    };
  }

  generateIntelligentNames(input) {
    const { industry, keywords, style, description } = input;
    console.log('ð§  Generating intelligent names for:', { industry, keywords, style });
    
    // Generate names using multiple sophisticated techniques
    const techniques = [
      this.generateMetaphoricalNames(input),
      this.generateEmotionalNames(input),
      this.generatePortmanteauNames(input),
      this.generateInventedWords(input),
      this.generateCulturalNames(input),
      this.generateCompoundNames(input),
      this.generateBrandableNeologisms(input),
      this.generateContextualNames(input)
    ];
    
    // Combine all generated names
    const allNames = techniques.flat();
    console.log('ð¯ Generated', allNames.length, 'total names before filtering');
    
    // Apply intelligent filtering
    const filteredNames = this.applyIntelligentFiltering(allNames, input);
    console.log('â¨ Filtered to', filteredNames.length, 'high-quality names');
    
    // Rank by quality and return top 50
    const rankedNames = this.rankByQuality(filteredNames, input);
    return rankedNames.slice(0, 50);
  }

  generateMetaphoricalNames(input) {
    const intelligence = this.industryIntelligence[input.industry] || this.industryIntelligence.tech;
    const metaphors = intelligence.metaphors;
    const keywords = input.keywords || [];
    
    const names = [];
    
    metaphors.forEach(metaphor => {
      keywords.forEach(keyword => {
        // Direct combinations
        names.push(this.createNameObject(`${metaphor}${this.capitalize(keyword)}`, input, 'metaphorical'));
        names.push(this.createNameObject(`${this.capitalize(keyword)}${this.capitalize(metaphor)}`, input, 'metaphorical'));
        
        // With connectors
        names.push(this.createNameObject(`${metaphor}${keyword}`, input, 'metaphorical'));
        names.push(this.createNameObject(`${keyword}${metaphor}`, input, 'metaphorical'));
      });
      
      // Standalone metaphors with suffixes
      names.push(this.createNameObject(`${metaphor}Labs`, input, 'metaphorical'));
      names.push(this.createNameObject(`${metaphor}Works`, input, 'metaphorical'));
      names.push(this.createNameObject(`${metaphor}Tech`, input, 'metaphorical'));
    });
    
    return names;
  }

  generateEmotionalNames(input) {
    const intelligence = this.industryIntelligence[input.industry] || this.industryIntelligence.tech;
    const emotions = intelligence.emotions;
    const keywords = input.keywords || [];
    
    const names = [];
    
    emotions.forEach(emotion => {
      keywords.forEach(keyword => {
        // Emotional + keyword combinations
        names.push(this.createNameObject(`${this.capitalize(emotion)}${this.capitalize(keyword)}`, input, 'emotional'));
        names.push(this.createNameObject(`${this.capitalize(keyword)}${this.capitalize(emotion)}`, input, 'emotional'));
      });
      
      // Emotional concepts with tech suffixes
      names.push(this.createNameObject(`${emotion}Flow`, input, 'emotional'));
      names.push(this.createNameObject(`${emotion}Sync`, input, 'emotional'));
      names.push(this.createNameObject(`${emotion}Hub`, input, 'emotional'));
    });
    
    return names;
  }

  generatePortmanteauNames(input) {
    const keywords = input.keywords || [];
    const names = [];
    
    // Blend keywords with industry terms
    const industryTerms = ['tech', 'lab', 'works', 'flow', 'sync', 'hub', 'forge', 'craft'];
    
    keywords.forEach(keyword => {
      industryTerms.forEach(term => {
        // Create portmanteau by blending parts of words
        const blend1 = this.blendWords(keyword, term);
        const blend2 = this.blendWords(term, keyword);
        
        if (blend1) names.push(this.createNameObject(blend1, input, 'portmanteau'));
        if (blend2) names.push(this.createNameObject(blend2, input, 'portmanteau'));
      });
    });
    
    // Blend keywords with each other
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const blend = this.blendWords(keywords[i], keywords[j]);
        if (blend) names.push(this.createNameObject(blend, input, 'portmanteau'));
      }
    }
    
    return names;
  }

  generateInventedWords(input) {
    const keywords = input.keywords || [];
    const names = [];
    
    // Create invented words using phonetic patterns
    const prefixes = ['neo', 'pro', 'meta', 'ultra', 'hyper', 'omni', 'zen', 'flux'];
    const suffixes = ['ify', 'ize', 'ly', 'io', 'ax', 'ex', 'ix', 'on'];
    
    keywords.forEach(keyword => {
      prefixes.forEach(prefix => {
        names.push(this.createNameObject(`${prefix}${keyword}`, input, 'invented'));
      });
      
      suffixes.forEach(suffix => {
        names.push(this.createNameObject(`${keyword}${suffix}`, input, 'invented'));
      });
    });
    
    // Generate completely new words using phonetic patterns
    const phonemes = ['qu', 'zr', 'vx', 'zy', 'nx', 'rx'];
    phonemes.forEach(phoneme => {
      keywords.forEach(keyword => {
        names.push(this.createNameObject(`${phoneme}${keyword.slice(1)}`, input, 'invented'));
      });
    });
    
    return names;
  }

  generateCulturalNames(input) {
    const keywords = input.keywords || [];
    const names = [];
    
    // Latin/Greek inspired names
    const latinPrefixes = ['astra', 'nova', 'terra', 'aqua', 'ignis', 'aero', 'vita', 'lux'];
    const greekSuffixes = ['os', 'is', 'us', 'on', 'ia', 'ys'];
    
    keywords.forEach(keyword => {
      latinPrefixes.forEach(prefix => {
        names.push(this.createNameObject(`${prefix}${keyword}`, input, 'cultural'));
      });
      
      greekSuffixes.forEach(suffix => {
        names.push(this.createNameObject(`${keyword}${suffix}`, input, 'cultural'));
      });
    });
    
    return names;
  }

  generateCompoundNames(input) {
    const keywords = input.keywords || [];
    const intelligence = this.industryIntelligence[input.industry] || this.industryIntelligence.tech;
    const names = [];
    
    // Compound with industry-specific terms
    const industryTerms = ['Labs', 'Works', 'Tech', 'Systems', 'Solutions', 'Platform', 'Engine'];
    
    keywords.forEach(keyword => {
      industryTerms.forEach(term => {
        names.push(this.createNameObject(`${this.capitalize(keyword)}${term}`, input, 'compound'));
      });
    });
    
    // Compound keywords with metaphors
    intelligence.metaphors.forEach(metaphor => {
      keywords.forEach(keyword => {
        names.push(this.createNameObject(`${this.capitalize(metaphor)}${this.capitalize(keyword)}`, input, 'compound'));
      });
    });
    
    return names;
  }

  generateBrandableNeologisms(input) {
    const keywords = input.keywords || [];
    const names = [];
    
    // Create brandable new words
    const brandablePrefixes = ['zi', 'qu', 'vr', 'nx', 'zy', 'rx'];
    const brandableSuffixes = ['ly', 'fy', 'io', 'ax', 'ex', 'on'];
    
    keywords.forEach(keyword => {
      brandablePrefixes.forEach(prefix => {
        const core = keyword.slice(0, -1);
        names.push(this.createNameObject(`${prefix}${core}`, input, 'neologism'));
      });
      
      brandableSuffixes.forEach(suffix => {
        const core = keyword.slice(0, -1);
        names.push(this.createNameObject(`${core}${suffix}`, input, 'neologism'));
      });
    });
    
    return names;
  }

  generateContextualNames(input) {
    const { description, industry } = input;
    const names = [];
    
    if (description) {
      // Extract concepts from description
      const concepts = this.extractConcepts(description);
      const intelligence = this.industryIntelligence[industry] || this.industryIntelligence.tech;
      
      concepts.forEach(concept => {
        intelligence.metaphors.forEach(metaphor => {
          names.push(this.createNameObject(`${this.capitalize(concept)}${this.capitalize(metaphor)}`, input, 'contextual'));
        });
      });
    }
    
    return names;
  }

  createNameObject(name, input, technique) {
    const quality = this.calculateAdvancedQuality(name, input);
    
    return {
      name: this.capitalize(name),
      score: quality.overallScore,
      memorability: quality.memorability,
      pronunciation: quality.pronunciation,
      uniqueness: quality.uniqueness,
      brandability: quality.brandability,
      description: this.generateDescription(name, input, technique),
      reasoning: this.generateReasoning(name, input, technique, quality),
      technique: technique,
      industry: input.industry
    };
  }

  calculateAdvancedQuality(name, input) {
    const memorability = this.calculateMemorability(name);
    const pronunciation = this.calculatePronunciation(name);
    const uniqueness = this.calculateUniqueness(name, input);
    const brandability = this.calculateBrandability(name, input);
    const marketAppeal = this.calculateMarketAppeal(name, input);
    const creativity = this.calculateCreativity(name, input);
    
    const overallScore = (
      memorability * 0.25 +
      pronunciation * 0.20 +
      uniqueness * 0.20 +
      brandability * 0.20 +
      marketAppeal * 0.15
    );
    
    return {
      overallScore: Math.round(overallScore * 10) / 10,
      memorability: Math.round(memorability * 10) / 10,
      pronunciation: Math.round(pronunciation * 10) / 10,
      uniqueness: Math.round(uniqueness * 10) / 10,
      brandability: Math.round(brandability * 10) / 10,
      marketAppeal: Math.round(marketAppeal * 10) / 10,
      creativity: Math.round(creativity * 10) / 10
    };
  }

  calculateMemorability(name) {
    let score = 10;
    
    // Length penalty
    if (name.length > 12) score -= 2;
    if (name.length > 15) score -= 2;
    if (name.length < 4) score -= 1;
    
    // Syllable count (optimal 2-3)
    const syllables = this.countSyllables(name);
    if (syllables === 2 || syllables === 3) score += 1;
    if (syllables > 4) score -= 2;
    
    // Pattern recognition
    if (this.hasRepeatingPatterns(name)) score += 1;
    if (this.hasAlliteration(name)) score += 1;
    
    return Math.max(1, Math.min(10, score));
  }

  calculatePronunciation(name) {
    let score = 10;
    
    // Consonant clusters
    const consonantClusters = (name.match(/[bcdfghjklmnpqrstvwxyz]{3,}/gi) || []).length;
    score -= consonantClusters * 2;
    
    // Vowel balance
    const vowels = (name.match(/[aeiou]/gi) || []).length;
    const consonants = name.length - vowels;
    const ratio = vowels / consonants;
    if (ratio < 0.2 || ratio > 0.8) score -= 1;
    
    // Common phonetic patterns
    if (this.hasCommonPhoneticPatterns(name)) score += 1;
    
    return Math.max(1, Math.min(10, score));
  }

  calculateUniqueness(name, input) {
    let score = 8; // Base uniqueness score
    
    // Check against common words
    if (this.isCommonWord(name)) score -= 3;
    
    // Check industry differentiation
    const intelligence = this.industryIntelligence[input.industry];
    if (intelligence && intelligence.avoid.some(pattern => name.toLowerCase().includes(pattern))) {
      score -= 2;
    }
    
    // Invented word bonus
    if (this.isInventedWord(name)) score += 2;
    
    return Math.max(1, Math.min(10, score));
  }

  calculateBrandability(name, input) {
    let score = 8;
    
    // Visual appeal
    if (this.hasVisualAppeal(name)) score += 1;
    
    // Domain potential
    if (this.hasDomainPotential(name)) score += 1;
    
    // Emotional resonance
    if (this.hasEmotionalResonance(name, input)) score += 1;
    
    // Scalability
    if (this.hasScalabilityPotential(name)) score += 1;
    
    return Math.max(1, Math.min(10, score));
  }

  calculateMarketAppeal(name, input) {
    let score = 8;
    
    const intelligence = this.industryIntelligence[input.industry];
    if (intelligence) {
      // Industry alignment
      if (intelligence.emotions.some(emotion => name.toLowerCase().includes(emotion))) score += 1;
      if (intelligence.metaphors.some(metaphor => name.toLowerCase().includes(metaphor))) score += 1;
    }
    
    // Global appeal
    if (this.hasGlobalAppeal(name)) score += 1;
    
    return Math.max(1, Math.min(10, score));
  }

  calculateCreativity(name, input) {
    let score = 7;
    
    // Technique bonus
    if (this.isPortmanteau(name)) score += 1;
    if (this.isInventedWord(name)) score += 2;
    if (this.isMetaphorical(name, input)) score += 1;
    
    return Math.max(1, Math.min(10, score));
  }

  generateDescription(name, input, technique) {
    const intelligence = this.industryIntelligence[input.industry] || this.industryIntelligence.tech;
    const templates = {
      metaphorical: [
        `Combines powerful metaphorical concepts with ${input.industry} innovation.`,
        `Evokes strength and reliability perfect for ${input.industry} ventures.`,
        `Creates strong visual and emotional associations for your brand.`
      ],
      emotional: [
        `Designed to evoke ${intelligence.emotions[0]} and trust in your target market.`,
        `Builds emotional connection with customers through powerful associations.`,
        `Creates positive emotional response and brand loyalty.`
      ],
      portmanteau: [
        `Clever blend of concepts that creates a unique and memorable brand identity.`,
        `Innovative word combination that stands out in the ${input.industry} space.`,
        `Creative fusion that captures multiple brand values in one name.`
      ],
      invented: [
        `Completely original name that ensures unique brand positioning.`,
        `Fresh, invented word that creates strong trademark potential.`,
        `Unique creation that allows you to define your own brand meaning.`
      ],
      cultural: [
        `Draws from classical roots to convey authority and timeless appeal.`,
        `Cultural sophistication that appeals to educated target markets.`,
        `Classical foundation with modern ${input.industry} relevance.`
      ],
      compound: [
        `Strategic combination that clearly communicates your ${input.industry} focus.`,
        `Professional compound name that builds immediate industry credibility.`,
        `Clear, descriptive name that helps customers understand your value.`
      ]
    };
    
    const templateArray = templates[technique] || templates.compound;
    return templateArray[Math.floor(Math.random() * templateArray.length)];
  }

  generateReasoning(name, input, technique, quality) {
    const reasons = [];
    
    // Quality-based reasoning
    if (quality.memorability >= 8.5) reasons.push('highly memorable due to optimal length and phonetic structure');
    if (quality.pronunciation >= 8.5) reasons.push('easy to pronounce with natural vowel-consonant balance');
    if (quality.uniqueness >= 8.5) reasons.push('unique positioning that differentiates from competitors');
    if (quality.brandability >= 8.5) reasons.push('strong brandability with excellent visual and emotional appeal');
    
    // Technique-based reasoning
    const techniqueReasons = {
      metaphorical: 'uses powerful metaphorical concepts that create strong brand associations',
      emotional: 'designed to evoke specific emotions that resonate with your target audience',
      portmanteau: 'clever word blending creates a unique identity while maintaining meaning',
      invented: 'completely original creation ensures unique trademark and brand positioning',
      cultural: 'draws from classical roots to convey authority and sophistication',
      compound: 'strategic combination clearly communicates industry focus and expertise'
    };
    
    reasons.push(techniqueReasons[technique] || 'professionally crafted for maximum brand impact');
    
    // Industry-specific reasoning
    const intelligence = this.industryIntelligence[input.industry];
    if (intelligence) {
      reasons.push(`optimized for ${input.industry} market expectations and industry trends`);
    }
    
    return `This name ${reasons.join(', ')}.`;
  }

  applyIntelligentFiltering(names, input) {
    return names.filter(name => {
      // Quality thresholds
      if (name.score < 7.0) return false;
      if (name.memorability < 6.0) return false;
      if (name.pronunciation < 6.0) return false;
      
      // Length constraints
      if (name.name.length < 3 || name.name.length > 20) return false;
      
      // Avoid problematic patterns
      const intelligence = this.industryIntelligence[input.industry];
      if (intelligence && intelligence.avoid.some(pattern => 
        name.name.toLowerCase().includes(pattern.replace('-', ''))
      )) return false;
      
      return true;
    });
  }

  rankByQuality(names, input) {
    return names.sort((a, b) => {
      // Primary sort by overall score
      if (b.score !== a.score) return b.score - a.score;
      
      // Secondary sort by brandability
      if (b.brandability !== a.brandability) return b.brandability - a.brandability;
      
      // Tertiary sort by uniqueness
      return b.uniqueness - a.uniqueness;
    });
  }

  // Helper methods
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  blendWords(word1, word2) {
    if (word1.length < 3 || word2.length < 3) return null;
    
    // Take first part of word1 and last part of word2
    const part1 = word1.slice(0, Math.ceil(word1.length * 0.6));
    const part2 = word2.slice(Math.floor(word2.length * 0.4));
    
    const blend = part1 + part2;
    return blend.length >= 4 && blend.length <= 15 ? blend : null;
  }

  extractConcepts(text) {
    // Simple concept extraction from description
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => 
      word.length > 4 && 
      !['the', 'and', 'for', 'with', 'that', 'this', 'will', 'have', 'from'].includes(word)
    ).slice(0, 5);
  }

  countSyllables(word) {
    return (word.toLowerCase().match(/[aeiouy]+/g) || []).length;
  }

  hasRepeatingPatterns(name) {
    return /(..).*\1/.test(name.toLowerCase());
  }

  hasAlliteration(name) {
    const words = name.split(/(?=[A-Z])/);
    if (words.length < 2) return false;
    return words[0][0].toLowerCase() === words[1][0].toLowerCase();
  }

  hasCommonPhoneticPatterns(name) {
    const patterns = ['ch', 'sh', 'th', 'ph', 'ck', 'ng'];
    return patterns.some(pattern => name.toLowerCase().includes(pattern));
  }

  isCommonWord(name) {
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
    return commonWords.includes(name.toLowerCase());
  }

  isInventedWord(name) {
    // Simple heuristic: contains uncommon letter combinations
    const uncommonPatterns = ['zr', 'vx', 'qz', 'nx', 'rx', 'zy'];
    return uncommonPatterns.some(pattern => name.toLowerCase().includes(pattern));
  }

  hasVisualAppeal(name) {
    // Names with good visual balance
    return name.length >= 5 && name.length <= 12 && /[aeiou]/i.test(name);
  }

  hasDomainPotential(name) {
    // Good for domain names
    return name.length <= 15 && !/[^a-zA-Z0-9]/.test(name);
  }

  hasEmotionalResonance(name, input) {
    const intelligence = this.industryIntelligence[input.industry];
    if (!intelligence) return false;
    return intelligence.emotions.some(emotion => 
      name.toLowerCase().includes(emotion.slice(0, 4))
    );
  }

  hasScalabilityPotential(name) {
    // Not too specific, allows for growth
    const specificTerms = ['app', 'web', 'site', 'blog', 'shop'];
    return !specificTerms.some(term => name.toLowerCase().includes(term));
  }

  hasGlobalAppeal(name) {
    // Easy to pronounce internationally
    const difficultCombinations = ['th', 'zh', 'tch', 'dge'];
    return !difficultCombinations.some(combo => name.toLowerCase().includes(combo));
  }

  isPortmanteau(name) {
    // Heuristic: likely a blend if it has characteristics of two words
    return name.length >= 6 && name.length <= 12;
  }

  isMetaphorical(name, input) {
    const intelligence = this.industryIntelligence[input.industry];
    if (!intelligence) return false;
    return intelligence.metaphors.some(metaphor => 
      name.toLowerCase().includes(metaphor)
    );
  }
}

export default EnhancedAINameGenerator;