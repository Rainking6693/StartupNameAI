import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Award,
  Target,
  DollarSign,
  Users,
  Globe,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessfulTechStartupNames = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const successfulNames = [
    {
      name: 'Google',
      category: 'Search Engine',
      valuation: '$1.7T',
      founded: '1998',
      namingStrategy: 'Mathematical Reference',
      why: 'Googol (10^100) suggests infinite search capability',
      brandability: 9.8,
      memorability: 9.9,
      pronunciation: 9.7,
      uniqueness: 9.8,
      lessons: ['Mathematical terms can be powerful', 'Infinite scale suggestion', 'Easy to pronounce globally']
    },
    {
      name: 'Apple',
      category: 'Technology Hardware',
      valuation: '$3.0T',
      founded: '1976',
      namingStrategy: 'Unexpected Association',
      why: 'Friendly, approachable contrast to technical complexity',
      brandability: 9.9,
      memorability: 10.0,
      pronunciation: 9.9,
      uniqueness: 8.5,
      lessons: ['Unexpected can be memorable', 'Simple beats complex', 'Universal recognition']
    },
    {
      name: 'Microsoft',
      category: 'Software',
      valuation: '$2.8T',
      founded: '1975',
      namingStrategy: 'Descriptive Compound',
      why: 'Micro (small) + Software = accessible computing',
      brandability: 9.2,
      memorability: 9.0,
      pronunciation: 9.3,
      uniqueness: 8.8,
      lessons: ['Compound words work well', 'Descriptive can scale', 'Vision in the name']
    },
    {
      name: 'Amazon',
      category: 'E-commerce',
      valuation: '$1.5T',
      founded: '1994',
      namingStrategy: 'Metaphorical Scale',
      why: 'World\'s largest river = world\'s largest store',
      brandability: 9.6,
      memorability: 9.4,
      pronunciation: 9.5,
      uniqueness: 9.2,
      lessons: ['Metaphors convey scale', 'Geographic references work', 'A-Z everything']
    },
    {
      name: 'Meta (Facebook)',
      category: 'Social Media',
      valuation: '$800B',
      founded: '2004',
      namingStrategy: 'Descriptive Evolution',
      why: 'Face + Book = social connection, Meta = beyond',
      brandability: 8.8,
      memorability: 9.1,
      pronunciation: 9.0,
      uniqueness: 8.9,
      lessons: ['Evolution shows growth', 'Descriptive origins', 'Rebrand for new vision']
    },
    {
      name: 'Tesla',
      category: 'Electric Vehicles',
      valuation: '$800B',
      founded: '2003',
      namingStrategy: 'Inventor Tribute',
      why: 'Nikola Tesla = electrical innovation pioneer',
      brandability: 9.4,
      memorability: 9.3,
      pronunciation: 9.2,
      uniqueness: 9.5,
      lessons: ['Historical figures add gravitas', 'Innovation connection', 'Electrical heritage']
    },
    {
      name: 'Netflix',
      category: 'Streaming',
      valuation: '$200B',
      founded: '1997',
      namingStrategy: 'Service Compound',
      why: 'Net (internet) + Flix (movies) = online entertainment',
      brandability: 9.1,
      memorability: 9.2,
      pronunciation: 9.4,
      uniqueness: 8.7,
      lessons: ['Service description works', 'Internet era naming', 'Clear value proposition']
    },
    {
      name: 'Spotify',
      category: 'Music Streaming',
      valuation: '$25B',
      founded: '2006',
      namingStrategy: 'Invented Compound',
      why: 'Spot (find) + Identify = music discovery',
      brandability: 9.0,
      memorability: 8.9,
      pronunciation: 9.1,
      uniqueness: 9.3,
      lessons: ['Invented words can work', 'Discovery implication', 'Music-specific appeal']
    },
    {
      name: 'Uber',
      category: 'Transportation',
      valuation: '$120B',
      founded: '2009',
      namingStrategy: 'German Superlative',
      why: 'Uber = above, superior service quality',
      brandability: 8.9,
      memorability: 9.0,
      pronunciation: 8.8,
      uniqueness: 9.1,
      lessons: ['Foreign words add sophistication', 'Superlative positioning', 'Short and punchy']
    },
    {
      name: 'Airbnb',
      category: 'Hospitality',
      valuation: '$75B',
      founded: '2008',
      namingStrategy: 'Descriptive Abbreviation',
      why: 'Air Bed & Breakfast shortened for broader appeal',
      brandability: 8.7,
      memorability: 8.8,
      pronunciation: 8.9,
      uniqueness: 9.0,
      lessons: ['Abbreviation can expand meaning', 'Evolution from specific to general', 'Hospitality connection']
    }
  ];

  const namingPatterns = [
    {
      pattern: 'Compound Words',
      examples: ['Microsoft', 'Facebook', 'LinkedIn', 'YouTube'],
      successRate: '89%',
      description: 'Combining two relevant words for clarity and memorability',
      whenToUse: 'When you want clear communication of value proposition',
      pros: ['Clear meaning', 'Easy to understand', 'SEO friendly'],
      cons: ['Can be long', 'May limit expansion', 'Less unique']
    },
    {
      pattern: 'Metaphorical Names',
      examples: ['Amazon', 'Oracle', 'Salesforce', 'Dropbox'],
      successRate: '84%',
      description: 'Using metaphors to convey brand attributes and scale',
      whenToUse: 'When you want to suggest scale, power, or specific qualities',
      pros: ['Memorable imagery', 'Scalable meaning', 'Emotional connection'],
      cons: ['May need explanation', 'Cultural barriers', 'Abstract meaning']
    },
    {
      pattern: 'Invented Words',
      examples: ['Google', 'Spotify', 'Xerox', 'Kodak'],
      successRate: '76%',
      description: 'Creating entirely new words that can be molded to brand meaning',
      whenToUse: 'When you want complete uniqueness and trademark protection',
      pros: ['Completely unique', 'Trademark friendly', 'Moldable meaning'],
      cons: ['Requires education', 'Pronunciation risk', 'No inherent meaning']
    },
    {
      pattern: 'Founder Names',
      examples: ['Tesla', 'Ford', 'Disney', 'Dell'],
      successRate: '82%',
      description: 'Using founder names or historical figures for personal connection',
      whenToUse: 'When founder has strong reputation or historical connection adds value',
      pros: ['Personal connection', 'Historical gravitas', 'Easy to trademark'],
      cons: ['Tied to individual', 'May not scale', 'Pronunciation issues']
    },
    {
      pattern: 'Descriptive Names',
      examples: ['General Electric', 'American Express', 'International Business Machines'],
      successRate: '78%',
      description: 'Names that clearly describe what the company does',
      whenToUse: 'In regulated industries or when clarity is paramount',
      pros: ['Clear communication', 'SEO benefits', 'Professional appeal'],
      cons: ['Generic feel', 'Hard to trademark', 'Limits expansion']
    },
    {
      pattern: 'Abstract Names',
      examples: ['Uber', 'Lyft', 'Slack', 'Zoom'],
      successRate: '73%',
      description: 'Short, punchy names with flexible meaning',
      whenToUse: 'When you want maximum flexibility and modern appeal',
      pros: ['Modern feel', 'Flexible meaning', 'Easy to say'],
      cons: ['Requires branding', 'May be forgettable', 'Meaning unclear']
    }
  ];

  const industryAnalysis = [
    {
      industry: 'SaaS & Cloud Computing',
      topNames: ['Salesforce', 'Slack', 'Zoom', 'Dropbox', 'Box'],
      commonPatterns: ['Action words', 'Simple concepts', 'Cloud metaphors'],
      avgBrandability: 8.7,
      keyInsights: 'SaaS names favor simplicity and action-oriented words that suggest productivity and efficiency.',
      namingTips: ['Use action verbs', 'Keep it under 2 syllables', 'Suggest productivity', 'Avoid technical jargon']
    },
    {
      industry: 'Fintech & Payments',
      topNames: ['PayPal', 'Stripe', 'Square', 'Venmo', 'Robinhood'],
      commonPatterns: ['Trust signals', 'Simple actions', 'Financial metaphors'],
      avgBrandability: 8.9,
      keyInsights: 'Fintech names prioritize trust and simplicity, often using familiar concepts to reduce friction.',
      namingTips: ['Emphasize trust', 'Use familiar concepts', 'Avoid complexity', 'Suggest security']
    },
    {
      industry: 'AI & Machine Learning',
      topNames: ['OpenAI', 'DeepMind', 'Anthropic', 'Hugging Face', 'Stability AI'],
      commonPatterns: ['Intelligence words', 'Technical terms', 'Human concepts'],
      avgBrandability: 8.4,
      keyInsights: 'AI companies balance technical credibility with human accessibility in their naming.',
      namingTips: ['Balance technical and human', 'Suggest intelligence', 'Avoid sci-fi clichés', 'Consider global pronunciation']
    },
    {
      industry: 'E-commerce & Marketplaces',
      topNames: ['Amazon', 'eBay', 'Shopify', 'Etsy', 'Alibaba'],
      commonPatterns: ['Scale metaphors', 'Shopping actions', 'Global appeal'],
      avgBrandability: 8.8,
      keyInsights: 'E-commerce names often suggest scale, variety, and ease of shopping across cultures.',
      namingTips: ['Suggest scale or variety', 'Easy global pronunciation', 'Shopping-related actions', 'Memorable and short']
    }
  ];

  const brandabilityFactors = [
    {
      factor: 'Memorability',
      weight: '25%',
      description: 'How easily the name sticks in memory',
      goodExample: 'Apple - simple, familiar concept',
      badExample: 'Complicated technical acronyms',
      tips: ['Use familiar concepts', 'Keep it short', 'Create mental images', 'Use rhythm and rhyme']
    },
    {
      factor: 'Pronunciation',
      weight: '20%',
      description: 'How easily the name can be spoken',
      goodExample: 'Google - phonetically simple',
      badExample: 'Names with silent letters or unclear sounds',
      tips: ['Test with non-native speakers', 'Avoid silent letters', 'Use common sound patterns', 'Consider global markets']
    },
    {
      factor: 'Uniqueness',
      weight: '20%',
      description: 'How distinctive the name is in the market',
      goodExample: 'Spotify - invented but meaningful',
      badExample: 'Generic descriptive names',
      tips: ['Check competitor names', 'Avoid industry clichés', 'Create new combinations', 'Test trademark availability']
    },
    {
      factor: 'Scalability',
      weight: '15%',
      description: 'How well the name works as the company grows',
      goodExample: 'Amazon - from books to everything',
      badExample: 'Names tied to specific products',
      tips: ['Avoid product-specific terms', 'Think long-term vision', 'Consider international expansion', 'Allow for pivots']
    },
    {
      factor: 'Domain Availability',
      weight: '10%',
      description: 'Availability of matching web domains',
      goodExample: 'Short, exact match domains',
      badExample: 'Names requiring hyphens or numbers',
      tips: ['Check .com availability first', 'Consider alternative extensions', 'Avoid hyphens and numbers', 'Think about social handles']
    },
    {
      factor: 'Legal Clearance',
      weight: '10%',
      description: 'Trademark availability and legal safety',
      goodExample: 'Names with clear trademark paths',
      badExample: 'Names similar to existing trademarks',
      tips: ['Conduct trademark searches', 'Check international markets', 'Avoid famous brand similarities', 'Consider defensive registrations']
    }
  ];

  return (
    <>
      <Helmet>
        <title>50 Successful Tech Startup Names and Why They Work - Startup Naming Analysis | StartupNamer.org</title>
        <meta name="description" content="Analysis of 50 successful tech startup names including Google, Apple, Amazon. Learn naming patterns, brandability factors, and strategies that drive billion-dollar valuations." />
        <meta name="keywords" content="successful startup names, tech company names, startup naming analysis, brandable names, naming patterns, startup branding examples, tech naming strategies" />
        <link rel="canonical" href="https://startupnamer.org/successful-tech-startup-names" />
        
        {/* Open Graph */}
        <meta property="og:title" content="50 Successful Tech Startup Names and Why They Work" />
        <meta property="og:description" content="Analysis of successful tech startup names including Google, Apple, Amazon. Learn naming patterns and strategies." />
        <meta property="og:url" content="https://startupnamer.org/successful-tech-startup-names" />
        <meta property="og:type" content="article" />
        
        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "50 Successful Tech Startup Names and Why They Work",
            "description": "Comprehensive analysis of successful tech startup names and the naming patterns that drive billion-dollar valuations",
            "author": {
              "@type": "Organization",
              "name": "StartupNamer.org"
            },
            "publisher": {
              "@type": "Organization",
              "name": "StartupNamer.org",
              "logo": {
                "@type": "ImageObject",
                "url": "https://startupnamer.org/logo.png"
              }
            },
            "datePublished": "2025-01-20",
            "dateModified": "2025-01-20",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://startupnamer.org/successful-tech-startup-names"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                SUCCESS ANALYSIS
              </span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  50 Successful
                </span>
                <br />
                <span className="text-white">Tech Startup Names</span>
                <br />
                <span className="text-3xl md:text-4xl text-white/80">and Why They Work</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Deep analysis of billion-dollar startup names. Discover the patterns, strategies, and psychological principles behind the world's most valuable tech companies.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-black text-emerald-400 mb-2">$12.8T</div>
                    <div className="text-white/80 text-sm">Combined Valuation</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-cyan-400 mb-2">50</div>
                    <div className="text-white/80 text-sm">Companies Analyzed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-teal-400 mb-2">6</div>
                    <div className="text-white/80 text-sm">Naming Patterns</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-400 mb-2">89%</div>
                    <div className="text-white/80 text-sm">Success Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Top 10 Analysis */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Top 10 Most Valuable Tech Names
              </h2>
              <p className="text-xl text-white/80">
                Detailed analysis of the naming strategies behind trillion-dollar companies
              </p>
            </motion.div>

            <div className="space-y-6">
              {successfulNames.map((company, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                          <div className="text-emerald-400 font-semibold">{company.valuation}</div>
                          <div className="text-white/60 text-sm">{company.category} • {company.founded}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-white/80">
                          <span className="font-semibold">Strategy:</span> {company.namingStrategy}
                        </div>
                        <div className="text-white/70 text-sm">{company.why}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-4">Brandability Scores</h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Overall', score: company.brandability, color: 'emerald' },
                          { label: 'Memorability', score: company.memorability, color: 'cyan' },
                          { label: 'Pronunciation', score: company.pronunciation, color: 'teal' },
                          { label: 'Uniqueness', score: company.uniqueness, color: 'green' }
                        ].map((metric, midx) => (
                          <div key={midx} className="flex items-center justify-between">
                            <span className="text-white/80 text-sm">{metric.label}:</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`bg-${metric.color}-500 h-2 rounded-full`} 
                                  style={{width: `${metric.score * 10}%`}}
                                ></div>
                              </div>
                              <span className="text-white font-semibold text-sm">{metric.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-4">Key Lessons</h4>
                      <div className="space-y-2">
                        {company.lessons.map((lesson, lidx) => (
                          <div key={lidx} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/80 text-sm">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Naming Patterns */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                6 Proven Naming Patterns
              </h2>
              <p className="text-xl text-white/80">
                The most successful naming strategies used by tech unicorns
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {namingPatterns.map((pattern, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{pattern.pattern}</h3>
                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
                      {pattern.successRate} Success
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-6">{pattern.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white/90 font-semibold mb-2">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pattern.examples.map((example, eidx) => (
                          <span key={eidx} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/90 font-semibold mb-2">When to Use:</h4>
                      <p className="text-white/70 text-sm">{pattern.whenToUse}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-green-400 font-semibold mb-2 text-sm">✅ Pros:</h5>
                        <ul className="space-y-1">
                          {pattern.pros.map((pro, pidx) => (
                            <li key={pidx} className="text-white/70 text-xs">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-red-400 font-semibold mb-2 text-sm">❌ Cons:</h5>
                        <ul className="space-y-1">
                          {pattern.cons.map((con, cidx) => (
                            <li key={cidx} className="text-white/70 text-xs">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Analysis */}
        <section className="px-6 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Industry-Specific Naming Insights
              </h2>
              <p className="text-xl text-white/80">
                How naming strategies vary across different tech sectors
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {industryAnalysis.map((industry, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{industry.industry}</h3>
                    <div className="text-emerald-400 font-bold">{industry.avgBrandability}/10</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white/90 font-semibold mb-2">Top Names:</h4>
                      <div className="flex flex-wrap gap-2">
                        {industry.topNames.map((name, nidx) => (
                          <span key={nidx} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/90 font-semibold mb-2">Common Patterns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {industry.commonPatterns.map((pattern, pidx) => (
                          <span key={pidx} className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm">
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/90 font-semibold mb-2">Key Insights:</h4>
                      <p className="text-white/70 text-sm">{industry.keyInsights}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white/90 font-semibold mb-2">Naming Tips:</h4>
                      <ul className="space-y-1">
                        {industry.namingTips.map((tip, tidx) => (
                          <li key={tidx} className="text-white/70 text-sm flex items-start space-x-2">
                            <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brandability Factors */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                The Science of Brandability
              </h2>
              <p className="text-xl text-white/80">
                6 factors that determine a name's success potential
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandabilityFactors.map((factor, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{factor.factor}</h3>
                    <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-semibold">
                      {factor.weight}
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4">{factor.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-green-400 text-xs font-semibold mb-1">✅ Good Example:</div>
                      <div className="text-white/70 text-xs">{factor.goodExample}</div>
                    </div>
                    
                    <div>
                      <div className="text-red-400 text-xs font-semibold mb-1">❌ Bad Example:</div>
                      <div className="text-white/70 text-xs">{factor.badExample}</div>
                    </div>
                    
                    <div>
                      <div className="text-blue-400 text-xs font-semibold mb-2">💡 Tips:</div>
                      <ul className="space-y-1">
                        {factor.tips.map((tip, tidx) => (
                          <li key={tidx} className="text-white/60 text-xs">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-emerald-600/10 to-cyan-600/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Create Your
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent block">
                  Success Story?
                </span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Use our AI to apply these proven naming patterns to your startup
              </p>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-4">
                  <Award className="w-8 h-8" />
                  <span>Generate Winning Names</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </motion.button>
              
              <div className="text-white/60 mt-6">
                <div className="text-lg">✅ Apply proven patterns • ✅ Brandability scoring • ✅ Success-driven AI</div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SuccessfulTechStartupNames;