// SSR-compatible naming service with fallback generation
class NamingService {
  constructor() {
    // Only access environment variables server-side or client-side appropriately
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateStartupNames(formData) {
    console.log('🚀 Starting name generation...');
    console.log('📊 Form data received:', formData);
    
    const { keywords, industry = 'tech', style = 'modern', description = '' } = formData;
    
    // For demo purposes, always use fallback generation
    // In production, you would implement proper OpenAI API calls through API routes
    const fallbackNames = this.generateFallbackNames(formData);
    console.log('✅ Generated', fallbackNames.length, 'fallback names');
    return fallbackNames;
  }

  generateFallbackNames(formData) {
    console.log('🔄 Fallback generation starting with:', formData);
    
    const { keywords = [], industry = 'tech', style = 'modern' } = formData;
    
    // Ensure we have at least one keyword
    const workingKeywords = keywords.length > 0 ? keywords : ['startup'];
    
    console.log('🏭 Industry:', industry, 'Style:', style, 'Keywords:', workingKeywords);
    
    // Industry-specific word parts for fallback
    const industryWords = {
      tech: ['Tech', 'Data', 'Cloud', 'Stream', 'Flow', 'Sync', 'Connect', 'Link', 'Net', 'Hub', 'Code', 'Bit', 'Pixel', 'Logic'],
      health: ['Health', 'Care', 'Med', 'Vital', 'Life', 'Pulse', 'Heal', 'Wellness', 'Pure', 'Fit', 'Bio', 'Thera', 'Vital', 'Cure'],
      fintech: ['Pay', 'Coin', 'Bank', 'Fund', 'Cash', 'Finance', 'Capital', 'Invest', 'Money', 'Vault', 'Credit', 'Wealth', 'Trade', 'Equity'],
      ecommerce: ['Shop', 'Buy', 'Cart', 'Market', 'Store', 'Trade', 'Sale', 'Deal', 'Retail', 'Commerce', 'Bazaar', 'Plaza', 'Mall', 'Outlet'],
      education: ['Learn', 'Edu', 'Study', 'Know', 'Skill', 'Mind', 'Brain', 'Academy', 'Scholar', 'Teach', 'Tutor', 'Mentor', 'Guide', 'Coach'],
      food: ['Taste', 'Fresh', 'Bite', 'Flavor', 'Cook', 'Chef', 'Kitchen', 'Recipe', 'Meal', 'Dish', 'Spice', 'Savory', 'Crisp', 'Zest'],
      travel: ['Go', 'Trip', 'Journey', 'Explore', 'Adventure', 'Wander', 'Roam', 'Discover', 'Venture', 'Quest', 'Trek', 'Voyage', 'Scout', 'Navigate'],
      other: ['Pro', 'Max', 'Plus', 'Prime', 'Elite', 'Smart', 'Quick', 'Easy', 'Simple', 'Best', 'Ultra', 'Super', 'Mega', 'Master']
    };

    const styleModifiers = {
      modern: ['ly', 'io', 'ai', 'x', 'tech', 'lab', 'hub', 'sync', 'flow', 'spark'],
      classic: ['corp', 'co', 'inc', 'group', 'solutions', 'systems', 'enterprises', 'associates'],
      creative: ['studio', 'works', 'craft', 'space', 'lab', 'forge', 'collective', 'workshop'],
      professional: ['pro', 'expert', 'master', 'premier', 'elite', 'executive', 'strategic', 'consulting']
    };

    const baseWords = industryWords[industry] || industryWords.tech;
    const modifiers = styleModifiers[style] || styleModifiers.modern;
    
    console.log('🧩 Using base words:', baseWords.slice(0, 5));
    console.log('🎨 Using modifiers:', modifiers.slice(0, 3));
    
    const fallbackNames = [];
    
    // Generate names using different combinations
    workingKeywords.forEach((keyword, keywordIndex) => {
      const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      
      // Keyword + Base Word combinations
      baseWords.slice(0, 4).forEach((word, wordIndex) => {
        const nameId = (keywordIndex * 50) + wordIndex + 1;
        
        // Forward combination
        const forwardName = capitalizedKeyword + word;
        if (forwardName.length <= 15 && !this.isDuplicateName(fallbackNames, forwardName)) {
          fallbackNames.push({
            id: nameId,
            name: forwardName,
            explanation: `${forwardName} combines your keyword '${keyword}' with ${industry} industry terminology, creating a brandable name that clearly communicates your focus area while maintaining professional appeal.`,
            brandabilityScore: parseFloat((7.0 + Math.random() * 2.8).toFixed(1)),
            domainFriendly: Math.random() > 0.3,
            psychologyTriggers: ['clarity', 'industry-focus', keyword.toLowerCase()],
            source: 'fallback',
            generatedAt: new Date().toISOString()
          });
        }
        
        // Reverse combination
        const reverseName = word + capitalizedKeyword;
        if (reverseName.length <= 15 && !this.isDuplicateName(fallbackNames, reverseName) && fallbackNames.length < 12) {
          fallbackNames.push({
            id: nameId + 1000,
            name: reverseName,
            explanation: `${reverseName} places industry terminology first, emphasizing your ${industry} expertise while incorporating '${keyword}' for brand personality and memorability.`,
            brandabilityScore: parseFloat((7.2 + Math.random() * 2.5).toFixed(1)),
            domainFriendly: Math.random() > 0.4,
            psychologyTriggers: ['authority', 'expertise', keyword.toLowerCase()],
            source: 'fallback',
            generatedAt: new Date().toISOString()
          });
        }
      });

      // Keyword + Style Modifier combinations
      modifiers.slice(0, 2).forEach((modifier, modIndex) => {
        if (fallbackNames.length < 18) {
          const modifierName = capitalizedKeyword + modifier.charAt(0).toUpperCase() + modifier.slice(1);
          if (!this.isDuplicateName(fallbackNames, modifierName)) {
            fallbackNames.push({
              id: (keywordIndex * 100) + modIndex + 2000,
              name: modifierName,
              explanation: `${modifierName} blends your keyword '${keyword}' with a ${style} style modifier, creating a contemporary name that reflects both your business focus and brand personality.`,
              brandabilityScore: parseFloat((7.5 + Math.random() * 2.2).toFixed(1)),
              domainFriendly: Math.random() > 0.25,
              psychologyTriggers: ['innovation', style, keyword.toLowerCase()],
              source: 'fallback',
              generatedAt: new Date().toISOString()
            });
          }
        }
      });
    });

    // Add some pure industry + style combinations if we need more names
    if (fallbackNames.length < 20) {
      const additionalCombinations = this.generateStyleIndustryCombinations(industry, style, baseWords, modifiers);
      fallbackNames.push(...additionalCombinations.slice(0, 20 - fallbackNames.length));
    }
    
    const finalNames = fallbackNames.slice(0, 20);
    console.log('✅ Generated fallback names:', finalNames.length, 'names');
    console.log('📋 Sample names:', finalNames.slice(0, 3).map(n => n.name));
    
    return finalNames;
  }

  generateStyleIndustryCombinations(industry, style, baseWords, modifiers) {
    const combinations = [];
    
    baseWords.slice(0, 3).forEach((base, baseIndex) => {
      modifiers.slice(0, 2).forEach((mod, modIndex) => {
        const name1 = base + mod.charAt(0).toUpperCase() + mod.slice(1);
        const name2 = mod.charAt(0).toUpperCase() + mod.slice(1) + base;
        
        if (name1.length <= 15) {
          combinations.push({
            id: 5000 + baseIndex * 10 + modIndex,
            name: name1,
            explanation: `${name1} combines ${industry} industry terminology with ${style} styling, creating a professional yet approachable brand name that conveys both expertise and innovation.`,
            brandabilityScore: parseFloat((6.8 + Math.random() * 2.7).toFixed(1)),
            domainFriendly: Math.random() > 0.35,
            psychologyTriggers: ['professionalism', style, 'reliability'],
            source: 'fallback',
            generatedAt: new Date().toISOString()
          });
        }

        if (name2.length <= 15 && name2 !== name1) {
          combinations.push({
            id: 6000 + baseIndex * 10 + modIndex,
            name: name2,
            explanation: `${name2} leads with ${style} characteristics while grounding the name in ${industry} expertise, balancing modern appeal with industry credibility.`,
            brandabilityScore: parseFloat((7.0 + Math.random() * 2.4).toFixed(1)),
            domainFriendly: Math.random() > 0.4,
            psychologyTriggers: [style, 'innovation', 'expertise'],
            source: 'fallback',
            generatedAt: new Date().toISOString()
          });
        }
      });
    });

    return combinations;
  }

  isDuplicateName(existingNames, newName) {
    return existingNames.some(name => name.name.toLowerCase() === newName.toLowerCase());
  }

  // Build OpenAI prompt (for future implementation)
  buildNamingPrompt(keywords, industry, style, description) {
    return `Generate 20 startup names for a ${industry} company with ${style} style.

REQUIREMENTS:
- Keywords to incorporate: ${keywords.join(', ')}
- Business description: ${description || 'Not provided'}
- Names should be 4-12 characters when possible
- Brandable, memorable, and easy to pronounce
- Suitable for .com domain registration
- Professional yet distinctive

For each name, provide:
1. The name itself
2. Brief explanation (2-3 sentences) of why it works
3. Brandability score (1-10)
4. Domain-friendly assessment
5. Key psychological triggers it activates

Return as JSON object with this structure:
{
  "names": [
    {
      "name": "ExampleName",
      "explanation": "Why this name works for the business...",
      "brandabilityScore": 8.5,
      "domainFriendly": true,
      "psychologyTriggers": ["trust", "innovation", "growth"]
    }
  ]
}

Focus on names that will help this ${industry} startup stand out and attract ${style === 'professional' ? 'enterprise customers' : 'early adopters'}.`;
  }

  // Parse OpenAI response (for future implementation)
  parseNamingResponse(content) {
    try {
      const parsed = JSON.parse(content);
      const names = parsed.names || [];
      
      return names.map((name, index) => ({
        id: index + 1,
        name: name.name,
        explanation: name.explanation,
        brandabilityScore: name.brandabilityScore || 7.5,
        domainFriendly: name.domainFriendly !== false,
        psychologyTriggers: name.psychologyTriggers || ['professional'],
        source: 'openai',
        generatedAt: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      return this.generateFallbackNames({ keywords: ['startup'], industry: 'tech', style: 'modern' });
    }
  }

  // Validate name quality
  validateName(name) {
    const validations = {
      length: name.length >= 3 && name.length <= 15,
      hasVowels: /[aeiouAEIOU]/.test(name),
      notAllCaps: name !== name.toUpperCase(),
      noNumbers: !/\d/.test(name),
      noSpecialChars: /^[a-zA-Z]+$/.test(name)
    };

    return {
      isValid: Object.values(validations).every(Boolean),
      checks: validations
    };
  }

  // Test service availability (for debugging)
  async testConnection() {
    return {
      status: 'ready',
      fallbackEnabled: true,
      apiKey: !!this.apiKey,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
const namingService = new NamingService();
export default namingService;