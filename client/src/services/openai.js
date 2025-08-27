import EnvironmentChecker from '../utils/envChecker';

class OpenAIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    
    // Check environment setup
    EnvironmentChecker.checkOpenAIKey();
    
    if (!this.apiKey) {
      console.warn('🚨 OpenAI API key not found. Name generation will use fallback mode.');
    }
  }

  async generateStartupNames(formData) {
    const { keywords, industry = 'tech', style = 'modern', description = '' } = formData;
    
    // Check if we have API key first
    if (!this.apiKey) {
      console.log('🔄 Using fallback name generation (no API key)');
      return this.generateFallbackNames(formData);
    }
    
    try {
      const prompt = this.buildNamingPrompt(keywords, industry, style, description);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a world-class startup naming consultant with 20+ years of experience helping companies find perfect, brandable names that attract customers and investors.'
            },
            {
              role: 'user', 
              content: prompt
            }
          ],
          max_tokens: 2500,
          temperature: 0.8,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      return this.parseNamingResponse(content);
      
    } catch (error) {
      console.error('OpenAI name generation failed:', error);
      
      // Fallback to pattern-based generation if API fails
      return this.generateFallbackNames(formData);
    }
  }

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
    const { keywords, industry, style } = formData;
    
    // Industry-specific word parts for fallback
    const industryWords = {
      tech: ['Tech', 'Data', 'Cloud', 'Stream', 'Flow', 'Sync', 'Connect', 'Link', 'Net', 'Hub'],
      health: ['Health', 'Care', 'Med', 'Vital', 'Life', 'Pulse', 'Heal', 'Wellness', 'Pure', 'Fit'],
      fintech: ['Pay', 'Coin', 'Bank', 'Fund', 'Cash', 'Finance', 'Capital', 'Invest', 'Money', 'Vault'],
      ecommerce: ['Shop', 'Buy', 'Cart', 'Market', 'Store', 'Trade', 'Sale', 'Deal', 'Retail', 'Commerce'],
      education: ['Learn', 'Edu', 'Study', 'Know', 'Skill', 'Mind', 'Brain', 'Academy', 'Scholar', 'Teach']
    };

    const styleModifiers = {
      modern: ['ly', 'io', 'ai', 'x', 'tech', 'lab', 'hub'],
      classic: ['corp', 'co', 'inc', 'group', 'solutions'],
      creative: ['studio', 'works', 'craft', 'space', 'lab'],
      professional: ['pro', 'expert', 'master', 'premier', 'elite']
    };

    const baseWords = industryWords[industry] || industryWords.tech;
    const modifiers = styleModifiers[style] || styleModifiers.modern;
    
    const fallbackNames = [];
    
    // Generate names using keywords + base words
    keywords.forEach(keyword => {
      const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      
      baseWords.slice(0, 5).forEach(word => {
        fallbackNames.push({
          id: fallbackNames.length + 1,
          name: capitalizedKeyword + word,
          explanation: `${capitalizedKeyword + word} combines your keyword '${keyword}' with ${industry} industry terminology, creating a brandable name that clearly communicates your focus area.`,
          brandabilityScore: 7 + Math.random() * 2,
          domainFriendly: true,
          psychologyTriggers: ['clarity', 'industry-focus'],
          source: 'fallback'
        });
      });
    });

    return fallbackNames.slice(0, 20);
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}

export default new OpenAIService();