import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Brain, 
  Target, 
  CheckCircle, 
  Cpu, 
  TrendingUp, 
  Globe, 
  Users,
  ArrowRight,
  Sparkles,
  Database,
  Search
} from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      number: 1,
      title: "Describe Your Startup",
      description: "Tell us about your business idea, target audience, and industry. Our AI needs context to generate relevant names.",
      icon: Target,
      details: [
        "Industry & business model",
        "Target audience demographics", 
        "Key features & benefits",
        "Brand personality preferences"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: 2,
      title: "AI Analysis & Generation",
      description: "Our advanced AI analyzes thousands of naming patterns, linguistic rules, and market trends to create unique options.",
      icon: Brain,
      details: [
        "Natural language processing",
        "Pattern recognition algorithms",
        "Market trend analysis",
        "Linguistic optimization"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      number: 3,
      title: "Smart Filtering & Scoring",
      description: "Each name is evaluated for brandability, memorability, pronunciation, and domain availability.",
      icon: Search,
      details: [
        "Brandability scoring (1-100)",
        "Domain availability check",
        "Pronunciation difficulty",
        "Market resonance testing"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      number: 4,
      title: "Get Your Perfect Names",
      description: "Receive a curated list of high-quality names with detailed analysis and actionable insights.",
      icon: CheckCircle,
      details: [
        "Curated name suggestions",
        "Detailed brandability analysis",
        "Domain availability status",
        "Usage recommendations"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: Cpu,
      title: "Advanced AI Technology",
      description: "Powered by state-of-the-art language models trained on millions of successful brand names and market data."
    },
    {
      icon: TrendingUp,
      title: "Market-Driven Insights",
      description: "Our algorithms analyze current market trends and consumer preferences to suggest names that resonate."
    },
    {
      icon: Globe,
      title: "Global Brand Awareness",
      description: "Names are evaluated for international appeal, avoiding cultural pitfalls and linguistic conflicts."
    },
    {
      icon: Users,
      title: "Industry Specialization",
      description: "Tailored suggestions based on your specific industry, from SaaS to healthcare to fintech."
    }
  ];

  const stats = [
    { number: "100K+", label: "Names Generated" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "50+", label: "Industries Served" },
    { number: "< 30s", label: "Average Generation Time" }
  ];

  return (
    <>
      <Helmet>
        <title>How It Works - AI-Powered Startup Name Generation | StartupNamer.org</title>
        <meta 
          name="description" 
          content="Discover how our AI-powered startup name generator creates perfect brand names in 4 simple steps. Advanced algorithms, market analysis, and brandability scoring." 
        />
        <meta name="keywords" content="how startup name generator works, AI naming process, brand name creation, startup naming methodology" />
        <link rel="canonical" href="https://startupnamer.org/how-it-works" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How Our AI Startup Name Generator Works" />
        <meta property="og:description" content="See how we use advanced AI to generate perfect startup names in just 4 steps. From idea analysis to brandability scoring." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://startupnamer.org/how-it-works" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Our AI Startup Name Generator Works" />
        <meta name="twitter:description" content="Advanced AI technology creates perfect startup names in 4 simple steps." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          <div className="container relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                How Our AI Creates
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Names</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Discover the advanced technology and methodology behind our AI-powered startup name generator. 
                From concept to brandable name in just 4 intelligent steps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/naming-tool"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Try It Now
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <a
                  href="#process"
                  className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-all duration-300 shadow-lg border border-slate-200"
                >
                  See How It Works
                </a>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4-Step Process */}
        <section id="process" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
                Our 4-Step 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Naming Process</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Each step is carefully designed to understand your business and create names that perfectly capture your brand vision.
              </p>
            </div>

            <div className="grid gap-12 lg:gap-16">
              {steps.map((step, index) => (
                <div key={step.number} className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  {/* Step Content */}
                  <div className="flex-1 lg:max-w-xl">
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg`}>
                        {step.number}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{step.title}</h3>
                    </div>
                    
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-slate-600">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step Visual */}
                  <div className="flex-1 lg:max-w-md">
                    <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-6">
                        <step.icon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-2">Step {step.number}</div>
                        <div className="text-white/80">{step.title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Features */}
        <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Powered by 
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Advanced AI</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Our technology combines multiple AI models and data sources to create names that aren't just creative, but strategically sound.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Find Your Perfect Name?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who have discovered their ideal startup name using our AI-powered generator.
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
                to="/examples"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                View Examples
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HowItWorksPage;