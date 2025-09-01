import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { Zap, Brain, Star, Shield, Clock, Users, ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';

// JSON-LD structured data for homepage
const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "StartupNamer.org",
  "description": "AI-powered startup name generator that creates unique, brandable business names with domain availability checking",
  "url": "https://startupnamer.org",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "StartupNamer.org",
    "url": "https://startupnamer.org"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1247",
    "bestRating": "5",
    "worstRating": "1"
  }
};

// Hero section component
const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">AI-Powered Naming Technology</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight block">
            Generate Perfect
          </span>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight block">
            Startup Names
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Create unique, brandable business names with our AI-powered naming tool. 
          Get instant domain availability checks and comprehensive brand analysis.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <Link href="/naming-tool">
            <a className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <Zap className="w-6 h-6" />
              <span>Start Naming Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Link>
          <Link href="/examples">
            <a className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>View Examples</span>
            </a>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50K+</div>
            <div className="text-slate-400">Names Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-slate-400">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">5★</div>
            <div className="text-slate-400">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Features section
const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Our proprietary AI analyzes millions of successful brands to create names that resonate with your target market.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Industry-Specific Names",
      description: "Generate names tailored for tech, SaaS, fintech, healthcare, and dozens of other industry verticals.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Domain & Trademark Check",
      description: "Instantly verify domain availability and get trademark insights to ensure your name is legally viable.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "Lightning Fast Results",
      description: "Get hundreds of creative name suggestions in seconds, not days. Save time and focus on building your business.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Collaborative Workspace",
      description: "Share names with your team, collect feedback, and make decisions together with our collaboration tools.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Brand Score Analysis",
      description: "Each name comes with a comprehensive brand score analyzing memorability, uniqueness, and market fit.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Why Choose StartupNamer.org?
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The most advanced AI naming platform trusted by thousands of entrepreneurs worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 hover:shadow-2xl hover:border-slate-300/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// CTA section
const CTASection = () => (
  <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Ready to Name Your Next Venture?
      </h2>
      <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
        Join thousands of entrepreneurs who have found their perfect brand name with StartupNamer.org
      </p>
      <Link href="/naming-tool">
        <a className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
          <Zap className="w-6 h-6" />
          <span>Generate Names Now</span>
          <ArrowRight className="w-5 h-5" />
        </a>
      </Link>
    </div>
  </section>
);

// Main homepage component
export default function Home() {
  return (
    <Layout
      title="StartupNamer.org - AI-Powered Startup Name Generator"
      description="Generate perfect startup names with our AI-powered naming tool. Get unique, brandable business names with domain availability checking and comprehensive brand analysis."
      canonical="https://startupnamer.org"
      jsonLd={homePageJsonLd}
    >
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
}

// This function gets called at build time for static generation
export async function getStaticProps() {
  return {
    props: {
      // Props for the page
    },
    // Revalidate every hour
    revalidate: 3600,
  };
}