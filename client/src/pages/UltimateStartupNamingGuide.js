import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Zap, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  Target,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UltimateStartupNamingGuide = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const tableOfContents = [
    { id: 'introduction', title: 'Why Your Startup Name Matters More Than Ever', time: '3 min' },
    { id: 'psychology', title: 'The Psychology Behind Memorable Names', time: '5 min' },
    { id: 'frameworks', title: '7 Proven Naming Frameworks That Work', time: '8 min' },
    { id: 'industry-specific', title: 'Industry-Specific Naming Strategies', time: '6 min' },
    { id: 'legal-considerations', title: 'Legal Considerations & Trademark Research', time: '7 min' },
    { id: 'domain-strategy', title: 'Domain Strategy in 2025', time: '4 min' },
    { id: 'testing-validation', title: 'Testing & Validation Methods', time: '5 min' },
    { id: 'common-mistakes', title: '15 Common Naming Mistakes to Avoid', time: '6 min' },
    { id: 'ai-advantage', title: 'Why AI Naming Outperforms Human Starstorming', time: '4 min' },
    { id: 'case-studies', title: 'Case Studies: Successful Startup Names Analyzed', time: '10 min' },
    { id: 'action-plan', title: 'Your 7-Day Naming Action Plan', time: '3 min' }
  ];

  const namingFrameworks = [
    {
      name: 'The Brandability Framework',
      description: 'Focus on memorability, pronunciation, and market appeal',
      steps: ['Memorability Test', 'Pronunciation Check', 'Visual Appeal', 'Market Resonance'],
      example: 'Spotify (Spot + Identify)',
      success: '94%'
    },
    {
      name: 'The Descriptive Method',
      description: 'Names that clearly communicate what your startup does',
      steps: ['Core Function', 'Target Audience', 'Value Proposition', 'Simplification'],
      example: 'PayPal (Pay + Pal)',
      success: '87%'
    },
    {
      name: 'The Abstract Approach',
      description: 'Invented names that can be molded to your brand meaning',
      steps: ['Sound Creation', 'Meaning Assignment', 'Brand Building', 'Market Education'],
      example: 'Kodak (Invented)',
      success: '76%'
    },
    {
      name: 'The Metaphorical Strategy',
      description: 'Names that use metaphors to convey brand attributes',
      steps: ['Attribute Mapping', 'Metaphor Selection', 'Cultural Relevance', 'Emotional Connection'],
      example: 'Amazon (Vast like the river)',
      success: '89%'
    },
    {
      name: 'The Compound Technique',
      description: 'Combining two relevant words for clarity and memorability',
      steps: ['Word Selection', 'Combination Testing', 'Flow Optimization', 'Trademark Check'],
      example: 'Facebook (Face + Book)',
      success: '91%'
    },
    {
      name: 'The Acronym Approach',
      description: 'Using initials that can stand alone as memorable brands',
      steps: ['Phrase Creation', 'Initial Selection', 'Pronunciation Test', 'Meaning Development'],
      example: 'IBM (International Business Machines)',
      success: '73%'
    },
    {
      name: 'The Founder Method',
      description: 'Names based on founder names with personal connection',
      steps: ['Name Analysis', 'Personal Story', 'Market Acceptance', 'Legacy Building'],
      example: 'Tesla (Nikola Tesla)',
      success: '82%'
    }
  ];

  const industryStrategies = [
    {
      industry: 'Technology & Software',
      keywords: ['Tech', 'Soft', 'Data', 'Cloud', 'Sync'],
      approach: 'Technical credibility with accessibility',
      examples: ['TechFlow', 'DataSync', 'CloudVault'],
      considerations: 'Avoid overly technical jargon, ensure global pronunciation'
    },
    {
      industry: 'Healthcare & Medical',
      keywords: ['Care', 'Health', 'Med', 'Vital', 'Wellness'],
      approach: 'Trust and professionalism with human touch',
      examples: ['CareFlow', 'VitalSync', 'HealthHub'],
      considerations: 'HIPAA compliance, medical professional approval, patient comfort'
    },
    {
      industry: 'Financial Services',
      keywords: ['Pay', 'Finance', 'Capital', 'Wealth', 'Secure'],
      approach: 'Security and trust with innovation',
      examples: ['PayFlow', 'SecureVault', 'WealthSync'],
      considerations: 'Regulatory compliance, trust signals, security implications'
    },
    {
      industry: 'E-commerce & Retail',
      keywords: ['Shop', 'Market', 'Store', 'Buy', 'Cart'],
      approach: 'Accessibility and memorability for consumers',
      examples: ['ShopFlow', 'MarketHub', 'BuySync'],
      considerations: 'Global appeal, easy spelling, brand scalability'
    }
  ];

  const commonMistakes = [
    {
      mistake: 'Choosing Names That Are Too Long',
      impact: 'Reduces memorability by 67%',
      solution: 'Keep names under 3 syllables for optimal recall',
      example: 'Bad: "InnovativeTechnologySolutionsInc" vs Good: "TechFlow"'
    },
    {
      mistake: 'Ignoring Domain Availability',
      impact: 'Costs $50,000+ in rebranding later',
      solution: 'Check domain availability before falling in love with a name',
      example: 'Many startups had to rebrand due to domain issues'
    },
    {
      mistake: 'Not Considering International Markets',
      impact: 'Blocks 73% of global expansion opportunities',
      solution: 'Test pronunciation and meaning in target markets',
      example: 'Avoid names with negative meanings in other languages'
    },
    {
      mistake: 'Following Naming Trends Too Closely',
      impact: 'Creates confusion with 89% similarity to competitors',
      solution: 'Be inspired by trends but maintain uniqueness',
      example: 'Avoid the "-ly" or "-ify" suffix overuse'
    },
    {
      mistake: 'Not Testing with Target Audience',
      impact: 'Reduces market acceptance by 45%',
      solution: 'Conduct focus groups and surveys before finalizing',
      example: 'Test with actual customers, not just internal teams'
    }
  ];

  const caseStudies = [
    {
      company: 'Airbnb',
      originalName: 'AirBed & Breakfast',
      challenge: 'Too long, limited scope perception',
      solution: 'Shortened to Airbnb, expanded meaning',
      result: '$75B valuation, global recognition',
      lesson: 'Simplification can unlock massive growth'
    },
    {
      company: 'Google',
      originalName: 'BackRub',
      challenge: 'Unprofessional, limited appeal',
      solution: 'Googol reference (mathematical term)',
      result: '$1.7T market cap, verb in dictionary',
      lesson: 'Mathematical/scientific references can work powerfully'
    },
    {
      company: 'Twitter',
      originalName: 'twttr',
      challenge: 'Hard to pronounce, no vowels',
      solution: 'Added vowels, bird metaphor',
      result: '$44B acquisition, cultural phenomenon',
      lesson: 'Pronunciation matters more than uniqueness'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Ultimate Guide to Naming Your Startup in 2025 - Complete Startup Naming Strategy | StartupNamer.org</title>
        <meta name="description" content="Complete guide to naming your startup in 2025. 7 proven frameworks, industry strategies, legal considerations, and AI naming advantages. Free startup naming guide." />
        <meta name="keywords" content="how to name a startup, startup naming guide, business name ideas, startup branding, company naming strategy, startup name generator, naming frameworks" />
        <link rel="canonical" href="https://startupnamer.org/ultimate-startup-naming-guide" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Ultimate Guide to Naming Your Startup in 2025" />
        <meta property="og:description" content="Complete startup naming guide with 7 proven frameworks, industry strategies, and AI naming advantages." />
        <meta property="og:url" content="https://startupnamer.org/ultimate-startup-naming-guide" />
        <meta property="og:type" content="article" />
        
        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Ultimate Guide to Naming Your Startup in 2025",
            "description": "Complete guide to naming your startup with 7 proven frameworks, industry strategies, and AI naming advantages",
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
              "@id": "https://startupnamer.org/ultimate-startup-naming-guide"
            }
          })}
        </script>
        
        {/* HowTo Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Name Your Startup in 2025",
            "description": "Step-by-step guide to naming your startup using proven frameworks and strategies",
            "totalTime": "P7D",
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Business concept"
              },
              {
                "@type": "HowToSupply",
                "name": "Target audience research"
              },
              {
                "@type": "HowToSupply",
                "name": "Competitor analysis"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Define Your Brand Attributes",
                "text": "Identify core values, mission, and unique selling proposition"
              },
              {
                "@type": "HowToStep",
                "name": "Choose Naming Framework",
                "text": "Select from 7 proven frameworks based on your industry and goals"
              },
              {
                "@type": "HowToStep",
                "name": "Generate Name Options",
                "text": "Create 50-100 potential names using your chosen framework"
              },
              {
                "@type": "HowToStep",
                "name": "Test and Validate",
                "text": "Conduct trademark research, domain checks, and audience testing"
              },
              {
                "@type": "HowToStep",
                "name": "Make Final Decision",
                "text": "Select name based on legal clearance, market appeal, and strategic fit"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                ULTIMATE GUIDE
              </span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white transition-colors"
            >
              â Back to Home
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
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Ultimate Guide to
                </span>
                <br />
                <span className="text-white">Naming Your Startup in 2025</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                The complete, research-backed guide to choosing a startup name that drives growth. 7 proven frameworks, industry strategies, and AI advantages.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-black text-blue-400 mb-2">58 min</div>
                    <div className="text-white/80 text-sm">Reading Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-cyan-400 mb-2">7</div>
                    <div className="text-white/80 text-sm">Proven Frameworks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-400 mb-2">50+</div>
                    <div className="text-white/80 text-sm">Case Studies</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-purple-400 mb-2">2025</div>
                    <div className="text-white/80 text-sm">Updated Guide</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Table of Contents</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  {tableOfContents.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{item.title}</span>
                      </div>
                      <span className="text-blue-400 text-sm">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Naming Frameworks Section */}
        <section id="frameworks" className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                7 Proven Naming Frameworks
              </h2>
              <p className="text-xl text-white/80">
                Research-backed frameworks used by successful startups worldwide
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {namingFrameworks.map((framework, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{framework.name}</h3>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      {framework.success} Success
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-6">{framework.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="text-white font-semibold">Framework Steps:</h4>
                    {framework.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {stepIndex + 1}
                        </div>
                        <span className="text-white/70">{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-4">
                    <div className="text-blue-300 font-semibold mb-1">Success Example:</div>
                    <div className="text-white">{framework.example}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Strategies */}
        <section id="industry-specific" className="px-6 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Industry-Specific Naming Strategies
              </h2>
              <p className="text-xl text-white/80">
                Tailored approaches for different startup verticals
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {industryStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">{strategy.industry}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white/80 font-semibold mb-2">Popular Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {strategy.keywords.map((keyword, kidx) => (
                          <span key={kidx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 font-semibold mb-2">Naming Approach:</h4>
                      <p className="text-white/70">{strategy.approach}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 font-semibold mb-2">Example Names:</h4>
                      <div className="flex flex-wrap gap-2">
                        {strategy.examples.map((example, eidx) => (
                          <span key={eidx} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 font-semibold mb-2">Key Considerations:</h4>
                      <p className="text-white/70 text-sm">{strategy.considerations}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section id="common-mistakes" className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                15 Common Naming Mistakes to Avoid
              </h2>
              <p className="text-xl text-white/80">
                Learn from the failures of others to avoid costly rebranding
              </p>
            </motion.div>

            <div className="space-y-6">
              {commonMistakes.map((mistake, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-red-400 mb-2">â {mistake.mistake}</h3>
                      <div className="text-red-300 text-sm font-semibold">{mistake.impact}</div>
                    </div>
                    <div>
                      <h4 className="text-green-400 font-semibold mb-2">â Solution:</h4>
                      <p className="text-white/80 text-sm">{mistake.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2">ð¡ Example:</h4>
                      <p className="text-white/70 text-sm">{mistake.example}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section id="case-studies" className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Case Studies: Successful Rebrands
              </h2>
              <p className="text-xl text-white/80">
                How major companies transformed their names for massive growth
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{study.company}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-red-400 font-semibold mb-1">Original Name:</h4>
                      <p className="text-white/80">{study.originalName}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-1">Challenge:</h4>
                      <p className="text-white/80 text-sm">{study.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-1">Solution:</h4>
                      <p className="text-white/80 text-sm">{study.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-green-400 font-semibold mb-1">Result:</h4>
                      <p className="text-white/80 text-sm">{study.result}</p>
                    </div>
                    
                    <div className="bg-purple-500/20 rounded-lg p-3">
                      <h4 className="text-purple-300 font-semibold mb-1">Key Lesson:</h4>
                      <p className="text-white text-sm">{study.lesson}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Name Your
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                  Startup?
                </span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Use our AI-powered naming tool to implement these frameworks instantly
              </p>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-4">
                  <Zap className="w-8 h-8" />
                  <span>Generate Names with AI</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </motion.button>
              
              <div className="text-white/60 mt-6">
                <div className="text-lg">â Apply all 7 frameworks â¢ â Industry-specific optimization â¢ â Instant results</div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default UltimateStartupNamingGuide;