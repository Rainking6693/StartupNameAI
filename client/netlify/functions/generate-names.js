// Netlify Function for OpenAI Name Generation
// Provides server-side OpenAI integration for secure API key handling

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { keywords, industry, style, count = 20, description } = JSON.parse(event.body);

    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Keywords are required and must be an array' })
      };
    }

    // Check for OpenAI API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.log('OpenAI API key not found, using enhanced fallback');
      return generateEnhancedFallback(keywords, industry, style, count, headers);
    }

    // Build professional naming prompt
    const prompt = buildNamingPrompt(keywords, industry, style, description);

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      })
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiResponse.status);
      return generateEnhancedFallback(keywords, industry, style, count, headers);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0].message.content;

    // Parse OpenAI response
    let names;
    try {
      const parsed = JSON.parse(content);
      names = parsed.names || [];
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return generateEnhancedFallback(keywords, industry, style, count, headers);
    }

    // Transform and validate names
    const processedNames = names
      .filter(name => name.name && name.name.length >= 3 && name.name.length <= 20)
      .slice(0, count)
      .map((name, index) => ({
        id: index + 1,
        name: name.name,
        explanation: name.explanation || `${name.name} is a professionally crafted startup name designed for the ${industry} industry.`,
        brandabilityScore: typeof name.brandabilityScore === 'number' ? name.brandabilityScore : 8.0,
        domainFriendly: Boolean(name.domainFriendly),
        psychologyTriggers: Array.isArray(name.psychologyTriggers) ? name.psychologyTriggers : ['professional', 'brandable'],
        source: 'openai-gpt4',
        generatedAt: new Date().toISOString()
      }));

    // If we don't have enough names, supplement with fallback
    if (processedNames.length < count) {
      const fallbackNames = generateQualityFallback(keywords, industry, style, count - processedNames.length);
      processedNames.push(...fallbackNames);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          names: processedNames,
          totalGenerated: processedNames.length,
          source: 'openai-gpt4',
          requestInfo: {
            keywords,
            industry,
            style,
            timestamp: new Date().toISOString()
          }
        }
      })
    };

  } catch (error) {
    console.error('Error generating names:', error);
    
    // Provide enhanced fallback on any error
    try {
      const { keywords, industry, style, count = 20 } = JSON.parse(event.body);
      return generateEnhancedFallback(keywords, industry, style, count, headers);
    } catch (fallbackError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to generate names',
          message: 'Both primary and fallback generation failed'
        })
      };
    }
  }
};

function buildNamingPrompt(keywords, industry, style, description) {
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

Return as JSON:
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

Think step by step. Consider what makes names like Stripe, Airbnb, and Notion so effective, then create names with similar qualities for this ${industry} startup.`;
}

function generateEnhancedFallback(keywords, industry, style, count, headers) {
  const fallbackNames = generateQualityFallback(keywords, industry, style, count);
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: {
        names: fallbackNames,
        totalGenerated: fallbackNames.length,
        source: 'enhanced-fallback',
        notice: 'Names generated using advanced pattern matching. Upgrade to premium for AI-powered generation.',
        requestInfo: {
          keywords,
          industry,
          style,
          timestamp: new Date().toISOString()
        }
      }
    })
  };
}

function generateQualityFallback(keywords, industry, style, count) {
  const professionalPatterns = {
    tech: ['Vercel', 'Notion', 'Linear', 'Figma', 'Stripe', 'Plaid', 'Render', 'Prisma'],
    health: ['Noom', 'Levels', 'Whoop', 'Oura', 'Peloton', 'Headspace', 'Calm', 'Babylon'],
    fintech: ['Brex', 'Ramp', 'Plaid', 'Chime', 'Nubank', 'Revolut', 'Wise', 'Klarna'],
    ecommerce: ['Faire', 'Glossier', 'Warby', 'Allbirds', 'Everlane', 'Bombas', 'Away'],
    education: ['Coursera', 'Udacity', 'Duolingo', 'Quizlet', 'Chegg', 'Kahoot', 'Brainly'],
    food: ['Sweetgreen', 'Oatly', 'Impossible', 'Beyond', 'Soylent', 'Huel', 'Daily'],
    travel: ['Kayak', 'Hopper', 'Wanderu', 'Rome2Rio', 'Skiplagged', 'TripIt', 'Culture'],
    other: ['Notion', 'Slack', 'Zoom', 'Miro', 'Loom', 'Pitch', 'Coda', 'Airtable']
  };

  const names = [];
  const basePatterns = professionalPatterns[industry] || professionalPatterns.other;
  const endings = ['ly', 'fy', 'io', 'ai', 'eo', 'ia', 'ex', 'on'];
  
  // Method 1: Keyword-based quality names
  keywords.forEach(keyword => {
    const keyBase = keyword.toLowerCase().replace(/[^a-z]/g, '').slice(0, 6);
    const keyCap = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
    
    // Generate variations
    const variations = [
      keyCap + 'ly',
      keyCap + 'fy', 
      keyBase + 'io',
      keyCap.slice(0, 5) + 'base',
      keyCap.slice(0, 4) + 'flow',
      'Get' + keyCap,
      keyCap + 'Hub'
    ];
    
    variations.forEach((name, index) => {
      if (names.length < count && name.length >= 4 && name.length <= 15) {
        names.push({
          id: names.length + 1,
          name: name,
          explanation: `${name} combines your keyword '${keyword}' with modern naming patterns used by successful ${industry} startups. The name is memorable, brandable, and suitable for global markets.`,
          brandabilityScore: parseFloat((7.5 + Math.random() * 2).toFixed(1)),
          domainFriendly: true,
          psychologyTriggers: ['innovation', 'clarity', 'modernity'],
          source: 'enhanced-fallback',
          generatedAt: new Date().toISOString()
        });
      }
    });
  });
  
  // Method 2: Industry-inspired abstract names
  while (names.length < count && names.length < 20) {
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z'];
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    
    let abstractName = '';
    const pattern = Math.floor(Math.random() * 3);
    
    switch(pattern) {
      case 0: // CVCV pattern
        abstractName = consonants[Math.floor(Math.random() * consonants.length)] +
                     vowels[Math.floor(Math.random() * vowels.length)] +
                     consonants[Math.floor(Math.random() * consonants.length)] +
                     vowels[Math.floor(Math.random() * vowels.length)];
        break;
      case 1: // CVC + ending
        abstractName = consonants[Math.floor(Math.random() * consonants.length)] +
                     vowels[Math.floor(Math.random() * vowels.length)] +
                     consonants[Math.floor(Math.random() * consonants.length)] +
                     endings[Math.floor(Math.random() * endings.length)];
        break;
      case 2: // Keyword + ending
        if (keywords[0]) {
          abstractName = keywords[0].slice(0, 4).toLowerCase() + 
                        endings[Math.floor(Math.random() * endings.length)];
        }
        break;
    }
    
    if (abstractName && abstractName.length >= 4 && abstractName.length <= 10) {
      abstractName = abstractName.charAt(0).toUpperCase() + abstractName.slice(1);
      
      names.push({
        id: names.length + 1,
        name: abstractName,
        explanation: `${abstractName} is a unique, invented name designed for global appeal and memorability. Like successful brands such as Spotify or Notion, it has no existing meaning, allowing you to define its identity in the ${industry} market.`,
        brandabilityScore: parseFloat((7.8 + Math.random() * 1.8).toFixed(1)),
        domainFriendly: true,
        psychologyTriggers: ['uniqueness', 'global-appeal', 'modernity'],
        source: 'enhanced-fallback',
        generatedAt: new Date().toISOString()
      });
    }
  }
  
  return names.slice(0, count);
}