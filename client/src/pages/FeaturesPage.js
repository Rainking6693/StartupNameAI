import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Target, 
  Globe, 
  TrendingUp, 
  Shield,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Lightbulb,
  Database,
  Search,
  FileText,
  Award,
  Cpu,
  BarChart3,
  Lock,
  RefreshCw,
  X
} from 'lucide-react';

const FeaturesPage = () => {
  const heroFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Advanced language models trained on millions of successful brand names",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Industry Specialization",
      description: "Tailored suggestions for 50+ industries from SaaS to healthcare",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Brandability Scoring",
      description: "Comprehensive analysis of memorability, pronunciation, and market appeal",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Global Compatibility",
      description: "Names evaluated for international markets and cultural sensitivity",
      color: "from-orange-500 to-red-500"
    }
  ];

  const coreFeatures = [
    {
      icon: Cpu,
      title: "Advanced AI Engine",
      description: "Our proprietary AI combines multiple language models to understand context, market trends, and linguistic patterns for optimal name generation.",
      features: [
        "Natural language processing",
        "Pattern recognition algorithms",
        "Contextual understanding",
        "Market trend analysis"
      ]
    },
    {
      icon: Search,
      title: "Smart Domain Analysis",
      description: "Real-time domain availability checking across popular TLDs with intelligent suggestions for alternatives.",
      features: [
        "Real-time domain checking",
        "Multiple TLD analysis (.com, .io, .ai, etc.)",
        "Alternative domain suggestions",
        "Domain value estimation"
      ]
    },
    {
      icon: BarChart3,
      title: "Brandability Intelligence",
      description: "Comprehensive scoring system that evaluates names across multiple dimensions for maximum market impact.",
      features: [
        "Memorability assessment",
        "Pronunciation difficulty analysis",
        "Visual brand potential",
        "Market resonance testing"
      ]
    },
    {
      icon: Shield,
      title: "Trademark Protection",
      description: "Advanced screening to help avoid potential legal issues and trademark conflicts across major jurisdictions.",
      features: [
        "US trademark database screening",
        "International trademark checking",
        "Similar name detection",
        "Risk assessment scoring"
      ]
    },
    {
      icon: Users,
      title: "Industry Expertise",
      description: "Specialized knowledge across 50+ industries ensures names that resonate with your target market.",
      features: [
        "SaaS and tech startups",
        "Healthcare and biotech",
        "Fintech and finance",
        "E-commerce and retail"
      ]
    },
    {
      icon: Lightbulb,
      title: "Creative Variations",
      description: "Multiple naming styles and approaches to match your brand personality and business goals.",
      features: [
        "Invented words (like Kodak)",
        "Compound names (like Facebook)",
        "Modified real words (like Netflix)",
        "Abstract concepts (like Uber)"
      ]
    }
  ];

  const businessBenefits = [
    {
      icon: Clock,
      title: "Save Time & Money",
      description: "Generate dozens of professional-quality names in minutes, not months. Skip expensive naming agencies.",
      stat: "Save 90% on naming costs"
    },
    {
      icon: Award,
      title: "Professional Quality",
      description: "Names created with the same methodology used by top branding agencies and Fortune 500 companies.",
      stat: "Agency-level quality"
    },
    {
      icon: RefreshCw,
      title: "Unlimited Iterations",
      description: "Refine and regenerate names until you find the perfect fit. No limits on creativity.",
      stat: "Unlimited generations"
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your ideas and generated names remain completely private and confidential.",
      stat: "100% confidential"
    }
  ];

  const comparisonFeatures = [
    { feature: "AI-Powered Generation", us: true, agencies: true, diy: false },
    { feature: "Industry Specialization", us: true, agencies: true, diy: false },
    { feature: "Real-time Domain Check", us: true, agencies: false, diy: false },
    { feature: "Trademark Screening", us: true, agencies: true, diy: false },
    { feature: "Instant Results", us: true, agencies: false, diy: true },
    { feature: "Unlimited Revisions", us: true, agencies: false, diy: true },
    { feature: "Cost Under $100/month", us: true, agencies: false, diy: true },
    { feature: "Brandability Scoring", us: true, agencies: true, diy: false },
    { feature: "24/7 Availability", us: true, agencies: false, diy: true }
  ];

  return (
    <>
      <Helmet>
        <title>Features - AI Startup Name Generator | StartupNamer.org</title>
        <meta 
          name="description" 
          content="Discover powerful features of our AI startup name generator: brandability scoring, domain checking, trademark screening, and industry specialization." 
        />
        <meta name="keywords" content="AI name generator features, brandability scoring, domain availability, trademark screening, startup naming tools" />
        <link rel="canonical" href="https://startupnamer.org/features" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced AI Features for Startup Naming" />
        <meta property="og:description" content="Professional naming tools with AI technology, brandability analysis, and comprehensive market research." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://startupnamer.org/features" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Startup Name Generator Features" />
        <meta name="twitter:description" content="Advanced AI technology meets professional naming expertise." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          <div className="container relative">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Powerful Features for
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Names</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Advanced AI technology combined with professional naming expertise to help you create 
                the perfect brand identity for your startup.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/naming-tool"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Try All Features
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <a
                  href="#features"
                  className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-all duration-300 shadow-lg border border-slate-200"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Hero Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {heroFeatures.map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
                Comprehensive 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Feature Suite</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Every feature is designed to help you create names that aren't just creative, 
                but strategically sound and market-ready.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {coreFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Benefits */}
        <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Built for 
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Business Success</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Features designed with entrepreneurs in mind - fast, affordable, and professionally effective.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {businessBenefits.map((benefit, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-lg">
                      {benefit.stat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                How We Compare
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                See why StartupNamer.org is the smart choice for startup naming.
              </p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="text-left p-6 font-semibold">Feature</th>
                    <th className="text-center p-6 font-semibold">StartupNamer.org</th>
                    <th className="text-center p-6 font-semibold">Naming Agencies</th>
                    <th className="text-center p-6 font-semibold">DIY Brainstorming</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className={`border-b border-slate-100 ${
                      index % 2 === 1 ? 'bg-slate-50/50' : ''
                    }`}>
                      <td className="p-4 font-medium text-slate-800">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.us ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.agencies ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.diy ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-slate-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Experience All Features Today
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Try our comprehensive feature suite with our free plan. Upgrade when you're ready 
              to unlock advanced capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/naming-tool"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Zap className="w-5 h-5 mr-2 inline" />
                Start Free Trial
              </Link>
              <Link
                to="/pricing"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                View Pricing
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FeaturesPage;