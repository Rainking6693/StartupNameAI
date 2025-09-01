import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { Zap, Brain, Code, Rocket, TrendingUp, ArrowRight, Star, CheckCircle } from 'lucide-react';

// JSON-LD structured data for tech startup names page
const techStartupNamesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Tech Startup Names - AI Name Generator",
  "description": "Generate perfect technology startup names with our AI-powered tool. Get unique, brandable tech company names with domain availability checking.",
  "url": "https://startupnamer.org/tech-startup-names",
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "Tech Startup Name Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any"
  }
};

const TechStartupNames = () => {
  // Example names for tech startups
  const exampleNames = [
    { name: 'TechFlow', category: 'Software Development', available: true },
    { name: 'CodeSphere', category: 'Development Tools', available: true },
    { name: 'InnovateLab', category: 'Innovation Hub', available: false },
    { name: 'ByteForge', category: 'Software Engineering', available: true },
    { name: 'CloudPulse', category: 'Cloud Computing', available: true },
    { name: 'DataNexus', category: 'Data Analytics', available: true },
    { name: 'TechVault', category: 'Cybersecurity', available: false },
    { name: 'QuantumTech', category: 'Quantum Computing', available: true },
  ];

  const techCategories = [
    { name: 'Software Development', icon: Code, description: 'Development tools and platforms' },
    { name: 'Artificial Intelligence', icon: Brain, description: 'AI and machine learning solutions' },
    { name: 'Cloud Computing', icon: Rocket, description: 'Cloud infrastructure and services' },
    { name: 'Cybersecurity', icon: CheckCircle, description: 'Security and privacy solutions' },
  ];

  const namingTips = [
    'Keep it short and memorable (2-3 syllables work best)',
    'Avoid numbers and hyphens in your domain name',
    'Consider .io, .ai, or .tech domains for tech startups',
    'Test pronunciation across different languages',
    'Ensure the name scales as your company grows',
    'Check social media handle availability'
  ];

  return (
    <Layout
      title="Tech Startup Names - AI Name Generator | StartupNamer.org"
      description="Generate perfect technology startup names with our AI-powered tool. Get unique, brandable tech company names with domain availability checking and trademark insights."
      canonical="https://startupnamer.org/tech-startup-names"
      jsonLd={techStartupNamesJsonLd}
    >
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100/10 backdrop-blur-sm border border-blue-300/20 rounded-full px-4 py-2 mb-6">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-200">Technology Startup Names</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Tech Startup Name Generator
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Create innovative, memorable names for your technology startup. Our AI specializes in generating 
              names that resonate with tech-savvy audiences and investors.
            </p>
            
            <Link href="/naming-tool">
              <a className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                <Zap className="w-6 h-6" />
                <span>Generate Tech Names</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Example Names Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Tech Startup Name Examples
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get inspired by these AI-generated technology startup names
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {exampleNames.map((nameExample, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-800">{nameExample.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    nameExample.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {nameExample.available ? '✓' : '✗'}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{nameExample.category}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/naming-tool">
              <a className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                <span>Generate Your Own Names</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Tech Startup Categories
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Specialized naming for different technology sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{category.name}</h3>
                  </div>
                  <p className="text-slate-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Naming Tips Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Tech Startup Naming Tips
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Expert advice for choosing the perfect tech startup name
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {namingTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-slate-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Name Your Tech Startup?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Use our AI-powered tool to generate hundreds of unique, brandable technology startup names
          </p>
          <Link href="/naming-tool">
            <a className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
              <TrendingUp className="w-6 h-6" />
              <span>Start Generating Names</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default TechStartupNames;

// This function gets called at build time for static generation
export async function getStaticProps() {
  return {
    props: {
      // Props for the page
    },
    // Revalidate every 24 hours
    revalidate: 86400,
  };
}