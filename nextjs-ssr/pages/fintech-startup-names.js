import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { CreditCard, TrendingUp, Shield, Banknote, Smartphone, Users, ArrowRight, Star, CheckCircle, DollarSign, Globe, Zap } from 'lucide-react';
import { generateIndustryMeta } from '../lib/seo-utils';
import { webApplicationSchema } from '../lib/structured-data';

// Example fintech names for inspiration
const fintechExamples = [
  { name: 'VaultCore', category: 'Banking', score: 94, available: true },
  { name: 'CashFlow AI', category: 'Accounting', score: 91, available: true },
  { name: 'TradeSphere', category: 'Trading', score: 89, available: false },
  { name: 'PayLink Pro', category: 'Payments', score: 92, available: true },
  { name: 'CreditWise', category: 'Credit', score: 88, available: true },
  { name: 'InvestIQ', category: 'Investment', score: 93, available: true },
  { name: 'LendingTree', category: 'Lending', score: 87, available: false },
  { name: 'WealthPath', category: 'Wealth Management', score: 90, available: true },
  { name: 'CryptoVault', category: 'Cryptocurrency', score: 94, available: true },
  { name: 'InsureEasy', category: 'Insurance', score: 86, available: true },
  { name: 'BudgetBot', category: 'Personal Finance', score: 89, available: true },
  { name: 'RiskRadar', category: 'Risk Management', score: 91, available: true }
];

// Fintech categories with descriptions
const fintechCategories = [
  {
    name: 'Digital Banking',
    description: 'Neo-banks, challenger banks, and digital-first financial institutions',
    keywords: ['neobank', 'digital bank', 'challenger bank', 'mobile banking'],
    icon: CreditCard,
    examples: ['VaultCore', 'BankSphere', 'DigitalCash']
  },
  {
    name: 'Payment Processing',
    description: 'Payment gateways, digital wallets, and money transfer services',
    keywords: ['payments', 'wallet', 'transfer', 'gateway'],
    icon: DollarSign,
    examples: ['PayLink', 'TransferWise', 'WalletHub']
  },
  {
    name: 'Investment & Trading',
    description: 'Robo-advisors, trading platforms, and investment management tools',
    keywords: ['trading', 'investment', 'robo-advisor', 'portfolio'],
    icon: TrendingUp,
    examples: ['InvestIQ', 'TradeSphere', 'PortfolioAI']
  },
  {
    name: 'Lending & Credit',
    description: 'P2P lending, credit scoring, and alternative financing solutions',
    keywords: ['lending', 'credit', 'financing', 'loan'],
    icon: Banknote,
    examples: ['LendingCore', 'CreditWise', 'QuickLoan']
  },
  {
    name: 'Insurance Technology',
    description: 'Insurtech solutions, claims processing, and risk assessment',
    keywords: ['insurance', 'insurtech', 'claims', 'coverage'],
    icon: Shield,
    examples: ['InsureEasy', 'ClaimSmart', 'RiskRadar']
  },
  {
    name: 'Personal Finance',
    description: 'Budgeting apps, expense tracking, and financial planning tools',
    keywords: ['budgeting', 'expenses', 'finance', 'planning'],
    icon: Smartphone,
    examples: ['BudgetBot', 'ExpenseTracker', 'FinancePlanner']
  }
];

// Key features for fintech names
const fintechFeatures = [
  {
    icon: Shield,
    title: 'Trust & Security Focus',
    description: 'Names that convey safety, security, and regulatory compliance - essential for financial services.'
  },
  {
    icon: Zap,
    title: 'Innovation & Speed',
    description: 'Modern, tech-forward names that emphasize efficiency, automation, and cutting-edge technology.'
  },
  {
    icon: Globe,
    title: 'Global Scalability',
    description: 'Names that work across international markets and diverse financial regulations.'
  },
  {
    icon: Users,
    title: 'Consumer Friendly',
    description: 'Approachable names that make complex financial services feel simple and accessible.'
  }
];

// Success stories in fintech naming
const successStories = [
  {
    name: 'Stripe',
    category: 'Payments',
    insight: 'Simple, memorable name that became synonymous with online payments',
    valuation: '$95B'
  },
  {
    name: 'Robinhood',
    category: 'Trading',
    insight: 'Storytelling name that positions the brand as democratizing finance',
    valuation: '$32B'
  },
  {
    name: 'Klarna',
    category: 'Buy Now Pay Later',
    insight: 'Scandinavian origin meaning "clear" - perfect for transparent financing',
    valuation: '$46B'
  },
  {
    name: 'Chime',
    category: 'Digital Banking',
    insight: 'Friendly, approachable name that makes banking feel personal',
    valuation: '$25B'
  }
];

// SEO-optimized schema for fintech page
const fintechSchema = {
  ...webApplicationSchema,
  "name": "Fintech Startup Name Generator - StartupNamer.org",
  "description": "Generate perfect fintech startup names with our AI-powered tool. Create brandable names for digital banking, payments, investment, and financial technology companies.",
  "applicationSubCategory": "Fintech Naming Tool",
  "audience": {
    "@type": "Audience",
    "audienceType": "Fintech Entrepreneurs"
  },
  "featureList": [
    "Fintech-Specific Name Generation",
    "Financial Terminology Integration",
    "Regulatory Compliance Considerations",
    "Trust-Building Name Analysis",
    "Global Financial Market Optimization"
  ]
};

export default function FintechStartupNames() {
  const industryMeta = generateIndustryMeta('fintech');
  
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries' },
    { name: 'Fintech Names', path: '/fintech-startup-names' }
  ];

  return (
    <Layout
      title={industryMeta.title}
      description={industryMeta.description}
      canonical={industryMeta.canonical}
      keywords={industryMeta.keywords}
      path="/fintech-startup-names"
      breadcrumbs={breadcrumbs}
      jsonLd={fintechSchema}
      industry="fintech"
      additionalSchema={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Fintech Startup Name Examples",
          "description": "Curated collection of fintech startup name examples and inspiration",
          "mainEntity": fintechExamples.map(example => ({
            "@type": "CreativeWork",
            "name": example.name,
            "category": example.category,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": (example.score / 20).toFixed(1),
              "ratingCount": "1"
            }
          }))
        }
      ]}
    >
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <CreditCard className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Fintech Industry Specialist</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight block">
                Fintech Startup Names
              </span>
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight block">
                That Build Trust
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Generate brandable fintech startup names that convey trust, innovation, and financial expertise. 
              Perfect for digital banking, payments, investment, and financial technology companies.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link href="/naming-tool">
                <a className="group bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                  <CreditCard className="w-6 h-6" />
                  <span>Generate Fintech Names</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Link>
              <Link href="#examples">
                <a className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>View Examples</span>
                </a>
              </Link>
            </div>
            
            {/* Trust indicators for fintech */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">$2.1T</div>
                <div className="text-slate-400">Global Fintech Market</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-slate-400">Fintech Names Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">94%</div>
                <div className="text-slate-400">Trust Score Average</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fintech Categories */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Fintech Categories We Specialize In
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI is trained on successful fintech brands across all major financial technology sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fintechCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 hover:shadow-2xl hover:border-slate-300/60 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{category.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{category.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="text-sm font-semibold text-slate-700 mb-2">Example Names:</div>
                    <div className="flex flex-wrap gap-2">
                      {category.examples.map(example => (
                        <span key={example} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 space-x-1">
                    {category.keywords.map(keyword => (
                      <span key={keyword}>#{keyword}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Example Names */}
      <section id="examples" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Fintech Name Examples
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              AI-generated fintech startup names with brand scores and availability status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fintechExamples.map((example, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{example.name}</h3>
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                      {example.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{example.score}</div>
                    <div className="text-xs text-slate-500">Brand Score</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {example.available ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-700">Available</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-700">Taken</span>
                      </>
                    )}
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/naming-tool">
              <a className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Generate More Fintech Names
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Fintech Naming Features */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Why Fintech Names Matter
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              In financial services, your name is your first impression. It needs to build trust, convey expertise, and inspire confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {fintechFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Fintech Naming Success Stories
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Learn from the most successful fintech brands and their naming strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{story.name}</h3>
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                      {story.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{story.valuation}</div>
                    <div className="text-sm text-slate-500">Valuation</div>
                  </div>
                </div>
                
                <p className="text-slate-700 leading-relaxed font-medium">
                  "{story.insight}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Name Your Fintech Startup?
          </h2>
          <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of fintech entrepreneurs who found their perfect brand name with our AI-powered generator
          </p>
          <Link href="/naming-tool">
            <a className="inline-flex items-center space-x-3 bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
              <CreditCard className="w-6 h-6" />
              <span>Generate Fintech Names Now</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

// Static generation with revalidation
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600, // Revalidate every hour
  };
}