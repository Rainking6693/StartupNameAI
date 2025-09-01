import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  Clock, 
  Users, 
  TrendingUp, 
  Globe, 
  Search, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

// JSON-LD for features page
const featuresJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Features - StartupNamer.org",
  "description": "Discover the powerful features of our AI-powered startup name generator including domain checking, trademark insights, and brand analysis.",
  "url": "https://startupnamer.org/features",
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "StartupNamer AI Features",
    "featureList": [
      "AI-powered name generation",
      "Domain availability checking", 
      "Trademark insights",
      "Brand score analysis",
      "Industry-specific naming",
      "Collaborative workspace"
    ]
  }
};

const Features = () => {
  const coreFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Our proprietary AI analyzes millions of successful brands to create names that resonate with your target market and industry trends.",
      benefits: [
        "Neural network trained on 500K+ brand names",
        "Industry-specific pattern recognition", 
        "Cultural and linguistic analysis",
        "Trend-aware naming suggestions"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Search,
      title: "Instant Domain Checking",
      description: "Real-time domain availability across all major TLDs including .com, .io, .ai, and industry-specific extensions.",
      benefits: [
        "Check 50+ domain extensions instantly",
        "Alternative domain suggestions",
        "Premium domain recommendations",
        "International domain support"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Trademark Intelligence",
      description: "Advanced trademark screening helps you avoid legal issues and find names that are truly available for your business.",
      benefits: [
        "USPTO trademark database search",
        "International trademark checking",
        "Similar name conflict analysis", 
        "Legal risk assessment"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Brand Score Analysis",
      description: "Each generated name comes with a comprehensive brand score analyzing memorability, uniqueness, and market potential.",
      benefits: [
        "Memorability scoring algorithm",
        "Uniqueness and differentiation analysis",
        "Market fit assessment",
        "Pronunciation difficulty rating"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Target,
      title: "Industry Specialization",
      description: "Generate names tailored for specific industries including tech, SaaS, fintech, healthcare, and many more verticals.",
      benefits: [
        "20+ industry-specific models",
        "Sector-relevant terminology",
        "Industry trend integration",
        "Competitive landscape analysis"
      ],
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share generated names with your team, collect feedback, and make naming decisions together with built-in collaboration tools.",
      benefits: [
        "Real-time team sharing",
        "Voting and rating system",
        "Comment and feedback tools",
        "Decision tracking history"
      ],
      color: "from-teal-500 to-blue-500"
    }
  ];

  const additionalFeatures = [
    "Lightning-fast generation (under 3 seconds)",
    "Unlimited name generations",
    "Export to CSV and PDF",
    "API access for developers", 
    "Multi-language support",
    "Social media handle checking",
    "Logo concept suggestions",
    "Brand story generation"
  ];

  return (
    <Layout
      title="Features - AI-Powered Startup Name Generator | StartupNamer.org"
      description="Discover the powerful features of our AI startup name generator including domain checking, trademark insights, brand analysis, and industry-specific naming."
      canonical="https://startupnamer.org/features"
      jsonLd={featuresJsonLd}
    >
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100/10 backdrop-blur-sm border border-blue-300/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Powerful AI Features</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Everything You Need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Name Your Startup
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Our comprehensive AI-powered platform provides all the tools and insights you need 
            to find the perfect name for your startup or business.
          </p>
          
          <Link href="/naming-tool">
            <a className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
              <Zap className="w-6 h-6" />
              <span>Try It Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Core Features
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced AI technology meets practical business needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-slate-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Additional Features
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Even more tools to help you find the perfect name
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have found their perfect brand name with our AI-powered platform
          </p>
          <Link href="/naming-tool">
            <a className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
              <Globe className="w-6 h-6" />
              <span>Start Generating Names</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Features;

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400, // Revalidate once per day
  };
}