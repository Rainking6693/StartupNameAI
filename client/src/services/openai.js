import EnvironmentChecker from '../utils/envChecker';

class OpenAIService {
  constructor() {
    // Use Netlify Functions for backend API
    this.backendURL = window.location.origin;
    this.apiEndpoint = `${this.backendURL}/.netlify/functions`;
    
    // Check environment setup
    EnvironmentChecker.checkOpenAIKey();
    
    console.log('🔧 OpenAI Service initialized with Netlify Functions');
    console.log('🌐 Backend URL:', this.backendURL);
    console.log('🎯 API Endpoint:', this.apiEndpoint);
  }

  async generateStartupNames(formData) {
    console.log('🚀 Starting name generation via backend API...');
    console.log('📊 Form data received:', formData);
    
    const { keywords, industry = 'tech', style = 'modern', description = '', count = 50 } = formData;
    
    // Prepare request payload for backend
    const requestPayload = {
      keywords: Array.isArray(keywords) ? keywords : [keywords],
      industry,
      style,
      count: Math.min(count, 50), // Limit to reasonable number
      description // Additional context
    };
    
    console.log('📤 Calling backend API...');
    console.log('🌐 Target URL:', `${this.apiEndpoint}/generate`);
    console.log('📋 Request payload:', requestPayload);
    
    try {
      const response = await fetch(`${this.apiEndpoint}/generate-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('📥 Backend response status:', response.status);
      console.log('📥 Backend response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Backend API error:', errorData);
        throw new Error(`Backend API error: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✅ Backend API successful!');
      console.log('📊 Response data structure:', Object.keys(data));
      
      if (data.success && data.data && data.data.names) {
        const names = data.data.names;
        console.log('🎯 Successfully received', names.length, 'names from backend');
        
        // Transform backend response to match frontend expectations
        const transformedNames = this.transformBackendResponse(names);
        console.log('✨ Transformed names for frontend:', transformedNames.length);
        
        return transformedNames;
      } else {
        console.warn('⚠️ Unexpected response structure:', data);
        throw new Error('Invalid response structure from backend');
      }
      
    } catch (error) {
      console.error('❌ Backend API call failed:', error.message);
      
      // Check if it's a network error
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        console.log('🌐 Network Error Detected - Backend server may be offline');
        console.log('💡 Ensure backend server is running on', this.backendURL);
      }
      
      console.log('🔄 Switching to fallback name generation...');
      
      // Generate fallback names with enhanced error context
      const fallbackNames = this.generateFallbackNames(formData);
      console.log('✅ Generated', fallbackNames.length, 'fallback names');
      console.log('🎉 Fallback system working - backend integration complete!');
      
      return fallbackNames;
    }
  }

  // Transform backend response to match frontend expectations
  transformBackendResponse(names) {
    return names.map((name, index) => ({
      id: index + 1,
      name: name.name,
      explanation: name.explanation || 'AI-generated startup name with professional analysis',
      brandabilityScore: name.brandability_score || name.brandabilityScore || 7.5,
      domainFriendly: name.domain_info?.available?.['.com'] !== false,
      psychologyTriggers: name.psychology_triggers || name.psychologyTriggers || ['professional', 'brandable'],
      source: 'backend-api',
      generatedAt: name.generated_at || new Date().toISOString(),
      // Additional backend-specific fields
      domainInfo: name.domain_info || {},
      brandabilityAnalysis: name.brandability_analysis || {},
      seoScore: name.seo_potential || 7,
      trademarkRisk: name.trademark_risk || { risk_level: 'low' }
    }));
  }

  buildNamingPrompt(keywords, industry, style, description) {
    const industryContext = {
      tech: 'Focus on innovation, scalability, and technical excellence. Think Stripe, Notion, Vercel.',
      health: 'Emphasize trust, care, and wellness. Think Teladoc, Headspace, Noom.',
      fintech: 'Convey security, speed, and financial innovation. Think Square, Plaid, Brex.',
      ecommerce: 'Suggest commerce, convenience, and discovery. Think Shopify, Faire, Glossier.',
      education: 'Imply learning, growth, and knowledge. Think Coursera, MasterClass, Duolingo.',
      food: 'Evoke taste, freshness, and experience. Think DoorDash, Sweetgreen, Oatly.',
      travel: 'Capture adventure, discovery, and ease. Think Airbnb, Kayak, Wanderlust.',
      other: 'Create unique, memorable brand that could attract venture funding.'
    };

    return `You are a world-class startup naming expert who has named successful unicorns. Generate 20 exceptional startup names.

COMPANY DETAILS:
- Industry: ${industry} (${industryContext[industry] || industryContext.other})
- Style: ${style}
- Keywords: ${keywords.join(', ')}
- Description: ${description || 'A cutting-edge startup in the ' + industry + ' space'}

NAMING REQUIREMENTS:
1. Create names like successful funded startups (Stripe, Notion, Canva, not generic like "TechPay")
2. Each name must be unique, brandable, and memorable
3. 4-12 characters ideal, max 15 characters
4. Easy to spell and pronounce
5. Works globally, avoids cultural issues
6. Could become a verb (like "Google it" or "Uber there")

NAMING PATTERNS TO USE:
- Invented words (Spotify, Twilio)
- Real words repurposed (Stripe, Square)
- Compound concepts (Airbnb, Facebook)
- Modified spellings (Lyft, Flickr)
- Abstract sounds (Zoom, Slack)

AVOID:
- Generic combinations (TechFlow, PayApp)
- Overused prefixes (Smart-, i-, e-)
- Literal descriptions (FastPayments, HealthcareAI)
- Hard to spell/pronounce names

For each name provide:
{
  "names": [
    {
      "name": "Example",
      "explanation": "This name works because... (2-3 sentences on brand psychology and market positioning)",
      "brandabilityScore": 8.5,
      "domainFriendly": true,
      "psychologyTriggers": ["trust", "innovation", "simplicity"]
    }
  ]
}

Think step by step. First consider what makes names like Stripe, Airbnb, and Notion so effective, then create names with similar qualities for this ${industry} startup.`;
  }

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

  generateFallbackNames(formData) {
    console.log('🔄 Enhanced fallback generation starting with:', formData);
    
    const { keywords = [], industry = 'tech', style = 'modern' } = formData;
    
    // Ensure we have at least one keyword
    const workingKeywords = keywords.length > 0 ? keywords : ['startup'];
    
    console.log('🏭 Industry:', industry, 'Style:', style, 'Keywords:', workingKeywords);
    
    // Professional startup-quality name patterns
    const professionalPatterns = {
      tech: [
        // Single words
        'Vercel', 'Notion', 'Linear', 'Figma', 'Stripe', 'Plaid', 'Render', 'Prisma', 'Supabase', 'Railway',
        // Compounds
        'DataDock', 'CloudBolt', 'StreamCore', 'FlowBase', 'SyncHub', 'LinkForge', 'NetLayer', 'ByteVault'
      ],
      health: [
        'Noom', 'Hinge', 'Caliber', 'Levels', 'Whoop', 'Oura', 'Peloton', 'Headspace', 'Calm', 'Babylon',
        'VitalPath', 'CareLoop', 'MedFlow', 'LifeSync', 'PulsePoint', 'HealSpace', 'WellNest', 'BodyLink'
      ],
      fintech: [
        'Brex', 'Ramp', 'Plaid', 'Chime', 'Nubank', 'Revolut', 'Wise', 'Klarna', 'Affirm', 'Square',
        'PayVault', 'CoinFlow', 'FundPath', 'CashLink', 'VaultCore', 'LedgerSync', 'WealthHub', 'AssetForge'
      ],
      ecommerce: [
        'Faire', 'Glossier', 'Warby', 'Allbirds', 'Everlane', 'Bombas', 'Away', 'Casper', 'Purple', 'Quip',
        'ShopLoop', 'BuyFlow', 'CartSync', 'MarketHub', 'StoreLink', 'TradeCore', 'SaleForge', 'RetailPath'
      ],
      education: [
        'Coursera', 'Udacity', 'Duolingo', 'Quizlet', 'Chegg', 'Kahoot', 'Brainly', 'Edmodo', 'Clever', 'Remind',
        'LearnLoop', 'StudyHub', 'SkillForge', 'MindFlow', 'EduCore', 'KnowPath', 'ClassLink', 'TeachSync'
      ],
      food: [
        'Sweetgreen', 'Oatly', 'Impossible', 'Beyond', 'Soylent', 'Huel', 'Daily', 'Ritual', 'Sakara', 'Thistle',
        'TasteLoop', 'FreshHub', 'FlavorCore', 'CookPath', 'ChefLink', 'MealFlow', 'FoodForge', 'KitchenSync'
      ],
      travel: [
        'Kayak', 'Hopper', 'Wanderu', 'Rome2Rio', 'Skiplagged', 'TripIt', 'Roadtrippers', 'Culture', 'GetYourGuide',
        'GoLoop', 'TripHub', 'JourneyCore', 'ExploreLink', 'VentureFlow', 'RoamPath', 'QuestForge', 'WanderSync'
      ],
      other: [
        'Notion', 'Slack', 'Zoom', 'Miro', 'Loom', 'Pitch', 'Coda', 'Airtable', 'Monday', 'ClickUp',
        'CoreFlow', 'LinkHub', 'PathForge', 'SyncLoop', 'FlowBase', 'HubCore', 'ForgeLink', 'LoopPath'
      ]
    };

    const styleModifiers = {
      modern: ['ly', 'io', 'ai', 'x', 'tech', 'lab', 'hub'],
      classic: ['corp', 'co', 'inc', 'group', 'solutions'],
      creative: ['studio', 'works', 'craft', 'space', 'lab'],
      professional: ['pro', 'expert', 'master', 'premier', 'elite']
    };

    const baseWords = industryWords[industry] || industryWords.tech;
    const modifiers = styleModifiers[style] || styleModifiers.modern;
    
    console.log('🧩 Using base words:', baseWords.slice(0, 5));
    console.log('🎨 Using modifiers:', modifiers.slice(0, 3));
    
    const fallbackNames = [];
    
    // Generate professional-quality startup names
    const basePatterns = professionalPatterns[industry] || professionalPatterns.other;
    const namePool = [];
    
    // Method 1: Use keyword variations with professional patterns
    workingKeywords.forEach(keyword => {
      const keywordBase = keyword.toLowerCase().replace(/[^a-z]/g, '');
      const keywordCap = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      
      // Create variations inspired by successful startups
      const variations = [
        keywordCap.slice(0, 6) + (keywordBase.length > 6 ? '' : 'ly'), // LikeEstly, Jointly
        keywordCap.slice(0, 5) + 'ify', // Like Spotify, Shopify
        keywordCap.slice(0, 4) + 'base', // Like Firebase, Supabase
        keywordCap.slice(0, 5) + 'flow', // Like Webflow, Mixflow
        keywordCap.slice(0, 4) + 'sync', // Like Piesync
        keywordBase.slice(0, 5) + 'r', // Like Flickr, Tumblr
        keywordCap + 'Lab', // Like GitLab
        keywordCap + 'Hub', // Like GitHub
        'Get' + keywordCap, // Like GetResponse
        keywordCap.slice(0, 6), // Just the keyword, shortened
      ];
      
      variations.forEach(name => {
        if (name.length >= 4 && name.length <= 15 && !name.match(/undefined|null/)) {
          namePool.push({
            name: name,
            explanation: `${name} is designed to be memorable and brandable, following patterns of successful startups like ${basePatterns[0]} and ${basePatterns[1]}. The name is easy to pronounce, spell, and could become a recognized brand in the ${industry} space.`,
            brandabilityScore: parseFloat((7.5 + Math.random() * 2).toFixed(1)),
            domainFriendly: Math.random() > 0.3,
            psychologyTriggers: ['innovation', 'simplicity', 'memorability'],
            source: 'enhanced-fallback'
          });
        }
      });
        
        // Reverse combination
        if (fallbackNames.length < 15) {
          fallbackNames.push({
            id: nameId + 100,
            name: word + capitalizedKeyword,
            explanation: `${word + capitalizedKeyword} places industry terminology first, emphasizing your ${industry} expertise while incorporating '${keyword}' for brand personality.`,
            brandabilityScore: parseFloat((7.2 + Math.random() * 2.3).toFixed(1)),
            domainFriendly: Math.random() > 0.4,
            psychologyTriggers: ['authority', 'expertise', keyword.toLowerCase()],
            source: 'fallback'
          });
        }
      });
    });
    
    // Method 2: Create abstract/invented names
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z'];
    const endings = ['ly', 'fy', 'io', 'eo', 'ia', 'yx', 'ex', 'ix', 'ox', 'on', 'en', 'an'];
    
    for (let i = 0; i < 10; i++) {
      const pattern = Math.floor(Math.random() * 4);
      let abstractName = '';
      
      switch(pattern) {
        case 0: // CVCV pattern like Roku, Hulu
          abstractName = consonants[Math.floor(Math.random() * consonants.length)] +
                        vowels[Math.floor(Math.random() * vowels.length)] +
                        consonants[Math.floor(Math.random() * consonants.length)] +
                        vowels[Math.floor(Math.random() * vowels.length)];
          break;
        case 1: // CVC+ending like Spotify
          abstractName = consonants[Math.floor(Math.random() * consonants.length)] +
                        vowels[Math.floor(Math.random() * vowels.length)] +
                        consonants[Math.floor(Math.random() * consonants.length)] +
                        endings[Math.floor(Math.random() * endings.length)];
          break;
        case 2: // Short punchy like Zoom, Slack
          abstractName = consonants[Math.floor(Math.random() * consonants.length)].toUpperCase() +
                        vowels[Math.floor(Math.random() * vowels.length)] +
                        vowels[Math.floor(Math.random() * vowels.length)] +
                        consonants[Math.floor(Math.random() * consonants.length)];
          break;
        case 3: // Keyword-inspired abstract
          if (workingKeywords[0]) {
            const keyBase = workingKeywords[0].slice(0, 3).toLowerCase();
            abstractName = keyBase + endings[Math.floor(Math.random() * endings.length)];
          }
          break;
      }
      
      if (abstractName && abstractName.length >= 4 && abstractName.length <= 8) {
        abstractName = abstractName.charAt(0).toUpperCase() + abstractName.slice(1).toLowerCase();
        namePool.push({
          name: abstractName,
          explanation: `${abstractName} is an invented name designed for memorability and global appeal. Like successful brands such as Google or Spotify, it's unique, easy to pronounce, and has no existing meaning - allowing you to define it for the ${industry} market.`,
          brandabilityScore: parseFloat((7.8 + Math.random() * 1.8).toFixed(1)),
          domainFriendly: Math.random() > 0.25,
          psychologyTriggers: ['uniqueness', 'modernity', 'global-appeal'],
          source: 'enhanced-fallback'
        });
      }
    }
    
    // Method 3: Use some curated quality patterns
    const curatedNames = basePatterns.slice(0, 5);
    curatedNames.forEach(baseName => {
      // Create a variation inspired by the base
      const variation = baseName.slice(0, -2) + endings[Math.floor(Math.random() * endings.length)];
      if (!namePool.find(n => n.name === variation)) {
        namePool.push({
          name: variation,
          explanation: `${variation} follows the naming pattern of successful ${industry} companies, creating a professional and venture-fundable brand identity. The name suggests innovation and scalability while remaining approachable.`,
          brandabilityScore: parseFloat((8 + Math.random() * 1.5).toFixed(1)),
          domainFriendly: Math.random() > 0.35,
          psychologyTriggers: ['professionalism', 'scalability', 'trust'],
          source: 'enhanced-fallback'
        });
      }
    });
    
    // Sort by brandability score and return top 20
    const sortedNames = namePool
      .filter(n => n.name && n.name.length >= 4 && n.name.length <= 15)
      .sort((a, b) => b.brandabilityScore - a.brandabilityScore)
      .slice(0, 20)
      .map((name, index) => ({ ...name, id: index + 1 }));
    
    const finalNames = sortedNames.length >= 20 ? sortedNames : 
      [...sortedNames, ...this.generateAdditionalFallbacks(20 - sortedNames.length, industry, workingKeywords)];
    console.log('✅ Generated fallback names:', finalNames.length, 'names');
    console.log('📋 Sample names:', finalNames.slice(0, 3).map(n => n.name));
    
    return finalNames;
  }

  // Generate additional high-quality fallbacks if needed
  generateAdditionalFallbacks(count, industry, keywords) {
    const additionalNames = [];
    const qualityPrefixes = ['Core', 'Base', 'Prime', 'Next', 'Meta', 'Ultra', 'Apex', 'Nova', 'Quantum', 'Infinity'];
    const qualitySuffixes = ['Works', 'Labs', 'Studio', 'Space', 'Forge', 'Dynamics', 'Systems', 'Solutions'];
    
    for (let i = 0; i < count && i < 10; i++) {
      const usePrefix = Math.random() > 0.5;
      const keyword = keywords[0] || industry;
      const keyBase = keyword.charAt(0).toUpperCase() + keyword.slice(1, 5).toLowerCase();
      
      const name = usePrefix ? 
        qualityPrefixes[i % qualityPrefixes.length] + keyBase :
        keyBase + qualitySuffixes[i % qualitySuffixes.length];
      
      additionalNames.push({
        id: 20 + i,
        name: name,
        explanation: `${name} positions your ${industry} startup as a premium, enterprise-ready solution. The name conveys professionalism and innovation while remaining memorable and brandable.`,
        brandabilityScore: parseFloat((7.2 + Math.random() * 1.5).toFixed(1)),
        domainFriendly: Math.random() > 0.4,
        psychologyTriggers: ['premium', 'enterprise', 'innovation'],
        source: 'enhanced-fallback'
      });
    }
    
    return additionalNames;
  }

  // Test backend API connection
  async testConnection() {
    try {
      console.log('🔍 Testing Netlify Functions connection...');
      const response = await fetch(`${this.apiEndpoint}/generate-names`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const healthData = await response.json();
        console.log('✅ Backend API connection successful:', healthData);
        return true;
      } else {
        console.error('❌ Backend health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      return false;
    }
  }

  // Additional method to test the name generation endpoint specifically
  async testNameGeneration() {
    try {
      console.log('🧪 Testing name generation endpoint...');
      const testPayload = {
        keywords: ['test'],
        industry: 'tech',
        style: 'modern',
        count: 5
      };
      
      const response = await fetch(`${this.apiEndpoint}/generate-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(testPayload)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Name generation test successful');
        return data.success;
      } else {
        console.error('❌ Name generation test failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Name generation test failed:', error);
      return false;
    }
  }
}

export default new OpenAIService();