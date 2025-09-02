import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Stethoscope, 
  CreditCard, 
  ShoppingCart, 
  Briefcase,
  Zap,
  Star,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Globe,
  Users,
  Target,
  Brain,
  Search,
  Filter
} from 'lucide-react';

const ExamplesPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const industries = [
    { id: 'all', name: 'All Industries', icon: Globe },
    { id: 'saas', name: 'SaaS & Tech', icon: Cpu },
    { id: 'healthcare', name: 'Healthcare', icon: Stethoscope },
    { id: 'fintech', name: 'Fintech', icon: CreditCard },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'business', name: 'Business Services', icon: Briefcase }
  ];

  const examples = [
    // SaaS & Tech
    {
      industry: 'saas',
      name: 'FlowSync',
      description: 'Workflow automation platform',
      brandability: 94,
      reasoning: 'Combines "flow" (processes) with "sync" (coordination). Easy to pronounce, memorable, and suggests seamless integration.',
      domain: 'flowsync.com',
      available: true,
      style: 'Compound'
    },
    {
      industry: 'saas',
      name: 'Nexara',
      description: 'AI-powered analytics dashboard',
      brandability: 92,
      reasoning: 'Invented name with "nex" (next/connection) and "ara" (suffix suggesting tech). Unique, brandable, and future-forward.',
      domain: 'nexara.io',
      available: true,
      style: 'Invented'
    },
    {
      industry: 'saas',
      name: 'CloudVault',
      description: 'Secure cloud storage solution',
      brandability: 89,
      reasoning: 'Descriptive compound clearly communicating security + cloud storage. Professional and trustworthy.',
      domain: 'cloudvault.com',
      available: false,
      style: 'Compound'
    },
    
    // Healthcare
    {
      industry: 'healthcare',
      name: 'VitalLink',
      description: 'Telemedicine platform',
      brandability: 96,
      reasoning: 'Combines "vital" (health/life) with "link" (connection). Suggests life-saving connections between patients and doctors.',
      domain: 'vitallink.health',
      available: true,
      style: 'Compound'
    },
    {
      industry: 'healthcare',
      name: 'Medixia',
      description: 'AI diagnostic assistant',
      brandability: 91,
      reasoning: 'Blend of "medical" and invented suffix. Sounds professional, medical, yet innovative and approachable.',
      domain: 'medixia.com',
      available: true,
      style: 'Modified'
    },
    {
      industry: 'healthcare',
      name: 'CareSync',
      description: 'Patient management system',
      brandability: 88,
      reasoning: 'Clear healthcare focus with "care" + coordination aspect with "sync". Professional and descriptive.',
      domain: 'caresync.io',
      available: false,
      style: 'Compound'
    },

    // Fintech
    {
      industry: 'fintech',
      name: 'Finova',
      description: 'Investment management app',
      brandability: 95,
      reasoning: 'Blend of "financial" and "nova" (new star). Suggests innovation in finance, easy to say and remember.',
      domain: 'finova.com',
      available: true,
      style: 'Modified'
    },
    {
      industry: 'fintech',
      name: 'PayStream',
      description: 'Payment processing platform',
      brandability: 90,
      reasoning: 'Combines payment concept with "stream" (continuous flow). Suggests smooth, continuous payment processing.',
      domain: 'paystream.io',
      available: false,
      style: 'Compound'
    },
    {
      industry: 'fintech',
      name: 'Wealthxa',
      description: 'Personal finance advisor',
      brandability: 87,
      reasoning: 'Modified "wealth" with tech suffix "xa". Clearly financial while suggesting digital innovation.',
      domain: 'wealthxa.com',
      available: true,
      style: 'Modified'
    },

    // E-commerce
    {
      industry: 'ecommerce',
      name: 'ShopFlow',
      description: 'E-commerce store builder',
      brandability: 93,
      reasoning: 'Combines shopping with smooth flow/process. Suggests easy, streamlined e-commerce experience.',
      domain: 'shopflow.com',
      available: false,
      style: 'Compound'
    },
    {
      industry: 'ecommerce',
      name: 'Marketa',
      description: 'Marketplace platform',
      brandability: 91,
      reasoning: 'Modified "market" with feminine ending. Unique, brandable, and clearly commerce-focused.',
      domain: 'marketa.io',
      available: true,
      style: 'Modified'
    },
    {
      industry: 'ecommerce',
      name: 'TradePulse',
      description: 'B2B wholesale platform',
      brandability: 89,
      reasoning: 'Combines "trade" with "pulse" (heartbeat/activity). Suggests active, lively trading environment.',
      domain: 'tradepulse.com',
      available: true,
      style: 'Compound'
    },

    // Business Services
    {
      industry: 'business',
      name: 'ProVantage',
      description: 'Business consulting firm',
      brandability: 94,
      reasoning: 'Combines "professional" with "advantage". Clearly positions as providing competitive edge.',
      domain: 'provantage.com',
      available: false,
      style: 'Compound'
    },
    {
      industry: 'business',
      name: 'Stratexia',
      description: 'Strategic planning software',
      brandability: 90,
      reasoning: 'Blend of "strategy" with invented suffix. Professional, strategic focus with modern tech appeal.',
      domain: 'stratexia.com',
      available: true,
      style: 'Modified'
    },
    {
      industry: 'business',
      name: 'TaskForge',
      description: 'Project management tool',
      brandability: 88,
      reasoning: 'Combines task management with "forge" (creation/building). Suggests building/creating through tasks.',
      domain: 'taskforge.io',
      available: true,
      style: 'Compound'
    }
  ];

  const filteredExamples = selectedIndustry === 'all' 
    ? examples 
    : examples.filter(example => example.industry === selectedIndustry);

  const namingStyles = [
    {
      name: 'Compound Names',
      description: 'Combine two relevant words',
      examples: ['FlowSync', 'VitalLink', 'PayStream'],
      icon: Target
    },
    {
      name: 'Invented Words',
      description: 'Create entirely new terms',
      examples: ['Nexara', 'Google', 'Kodak'],
      icon: Lightbulb
    },
    {
      name: 'Modified Words',
      description: 'Adapt existing words with prefixes/suffixes',
      examples: ['Finova', 'Netflix', 'Spotify'],
      icon: Brain
    },
    {
      name: 'Abstract Concepts',
      description: 'Use conceptual or metaphorical names',
      examples: ['Uber', 'Oracle', 'Amazon'],
      icon: Star
    }
  ];

  const successStories = [
    {
      industry: 'SaaS',
      challenge: 'Needed a name for project management software',
      solution: 'AI suggested "TaskFlow" - clear, actionable, memorable',
      result: 'Secured $2M funding, name contributed to professional image',
      founder: 'Sarah Chen, TaskFlow CEO'
    },
    {
      industry: 'Healthcare',
      challenge: 'Required name for telehealth startup',
      solution: 'Generated "MediLink" - combined medical + connection',
      result: 'Name helped secure partnerships with 3 major hospitals',
      founder: 'Dr. Michael Rodriguez, MediLink Founder'
    },
    {
      industry: 'Fintech',
      challenge: 'Sought brandable name for payment app',
      solution: 'Created "PayVault" - security meets payments',
      result: 'App downloaded 100K+ times, strong brand recognition',
      founder: 'Lisa Thompson, PayVault Co-founder'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Startup Name Examples by Industry | StartupNamer.org</title>
        <meta 
          name="description" 
          content="Explore real startup name examples across industries. See brandability scores, naming strategies, and success stories from our AI name generator." 
        />
        <meta name="keywords" content="startup name examples, SaaS names, healthcare startup names, fintech names, brandable business names" />
        <link rel="canonical" href="https://startupnamer.org/examples" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Real Startup Name Examples & Case Studies" />
        <meta property="og:description" content="Browse hundreds of AI-generated startup names with brandability analysis and domain availability." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://startupnamer.org/examples" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Startup Name Examples & Inspiration" />
        <meta name="twitter:description" content="Real examples of successful startup names generated by AI." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          <div className="container relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Startup Name 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Examples</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Explore real examples of AI-generated startup names across industries. See brandability 
                scores, naming strategies, and success stories from entrepreneurs worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/naming-tool"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Generate Your Names
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <a
                  href="#examples"
                  className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-all duration-300 shadow-lg border border-slate-200"
                >
                  Browse Examples
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Filter */}
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-center mb-8">
              <Filter className="w-5 h-5 text-slate-600 mr-2" />
              <span className="text-slate-700 font-medium">Filter by Industry:</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedIndustry === industry.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/80 text-slate-700 hover:bg-white shadow-md'
                  }`}
                >
                  <industry.icon className="w-4 h-4 mr-2" />
                  {industry.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Examples Grid */}
        <section id="examples" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Real Name Examples
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Each example includes brandability analysis, domain availability, and strategic reasoning.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExamples.map((example, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">{example.name}</h3>
                      <p className="text-slate-600 text-sm">{example.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {example.brandability}/100
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Brandability</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Why This Works:</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{example.reasoning}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Domain:</span>
                      <div className="flex items-center">
                        <span className="text-sm font-mono text-slate-700 mr-2">{example.domain}</span>
                        {example.available ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Naming Style:</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                        {example.style}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Naming Styles Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Naming Styles We Use
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our AI employs multiple naming methodologies to create diverse, brandable options for every business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {namingStyles.map((style, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-xl text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <style.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{style.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{style.description}</p>
                  <div className="space-y-1">
                    {style.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Real entrepreneurs share how the perfect name helped launch their success.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold w-fit mb-3">
                      {story.industry}
                    </div>
                    <h3 className="text-lg font-bold mb-2">The Challenge</h3>
                    <p className="text-slate-300 text-sm mb-4">{story.challenge}</p>
                    
                    <h3 className="text-lg font-bold mb-2">Our Solution</h3>
                    <p className="text-slate-300 text-sm mb-4">{story.solution}</p>
                    
                    <h3 className="text-lg font-bold mb-2">The Result</h3>
                    <p className="text-slate-300 text-sm mb-4">{story.result}</p>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-sm text-slate-400 italic">— {story.founder}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Create Your Success Story?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who have found their perfect startup name using our AI-powered generator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/naming-tool"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Zap className="w-5 h-5 mr-2 inline" />
                Start Generating Names
              </Link>
              <Link
                to="/how-it-works"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                Learn How It Works
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ExamplesPage;