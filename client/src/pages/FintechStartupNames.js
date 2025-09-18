import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Zap, 
  Star, 
  CheckCircle, 
  ArrowRight,
  CreditCard,
  TrendingUp,
  Shield,
  Banknote,
  PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FintechStartupNames = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const fintechNameExamples = [
    { name: 'PayFlow', score: 9.3, description: 'Perfect for payment processing platforms' },
    { name: 'CoinVault', score: 9.0, description: 'Ideal for cryptocurrency and digital wallets' },
    { name: 'TradePro', score: 8.9, description: 'Great for trading and investment platforms' },
    { name: 'LendStream', score: 9.1, description: 'Lending and credit management solutions' },
    { name: 'WealthSync', score: 8.8, description: 'Wealth management and advisory services' },
    { name: 'RiskGuard', score: 8.7, description: 'Risk assessment and compliance tools' },
    { name: 'MoneyBridge', score: 8.9, description: 'Cross-border payments and remittances' },
    { name: 'InsureFlow', score: 8.6, description: 'Insurance technology and claims processing' }
  ];

  const fintechCategories = [
    { 
      category: 'Payments & Digital Wallets', 
      keywords: ['Pay', 'Wallet', 'Transfer', 'Send', 'Flow'],
      examples: ['PayStream', 'WalletFlow', 'SendPro'],
      icon: CreditCard,
      growth: '+127%'
    },
    { 
      category: 'Investment & Trading', 
      keywords: ['Trade', 'Invest', 'Portfolio', 'Market', 'Capital'],
      examples: ['TradeFlow', 'InvestPro', 'CapitalSync'],
      icon: TrendingUp,
      growth: '+89%'
    },
    { 
      category: 'Lending & Credit', 
      keywords: ['Lend', 'Credit', 'Loan', 'Finance', 'Fund'],
      examples: ['LendFlow', 'CreditPro', 'FundSync'],
      icon: Banknote,
      growth: '+156%'
    },
    { 
      category: 'Insurance & Risk', 
      keywords: ['Insure', 'Risk', 'Guard', 'Protect', 'Cover'],
      examples: ['InsurePro', 'RiskFlow', 'GuardSync'],
      icon: Shield,
      growth: '+203%'
    }
  ];

  const fintechTrends = [
    { trend: 'DeFi & Blockchain', percentage: 34, description: 'Decentralized finance solutions' },
    { trend: 'Buy Now Pay Later', percentage: 28, description: 'Flexible payment options' },
    { trend: 'Robo-Advisors', percentage: 22, description: 'Automated investment management' },
    { trend: 'RegTech', percentage: 16, description: 'Regulatory technology solutions' }
  ];

  const successStories = [
    {
      name: 'David Park',
      company: 'PayVault',
      funding: '$25M Series B',
      quote: 'PayVault immediately conveyed security and payments expertise. Our enterprise clients trust the name before they even see our product.',
      avatar: '👨‍💼',
      industry: 'Payment Processing'
    },
    {
      name: 'Maria Santos',
      company: 'LendFlow',
      funding: '$18M Series A',
      quote: 'LendFlow perfectly captured our streamlined lending process. The name helped us close our first enterprise deal within 3 months.',
      avatar: '👩‍💼',
      industry: 'Digital Lending'
    },
    {
      name: 'James Wilson',
      company: 'TradeSync',
      funding: '$42M Series C',
      quote: 'TradeSync resonated with both retail and institutional traders. The brandability score of 9.2 proved accurate in our market success.',
      avatar: '👨‍💻',
      industry: 'Trading Platform'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Fintech Startup Name Generator - 250+ AI-Generated Financial Technology Names | StartupNamer.org</title>
        <meta name="description" content="Generate perfect fintech startup names with AI. 250+ brandable financial technology company names for payments, lending, trading, and insurance. Free name generator." />
        <meta name="keywords" content="fintech startup names, financial technology names, fintech name generator, payment company names, trading platform names, lending startup names, fintech branding" />
        <link rel="canonical" href="https://startupnamer.org/fintech-startup-names" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Fintech Startup Name Generator - 250+ AI-Generated Names" />
        <meta property="og:description" content="Generate perfect fintech startup names with AI. Brandable financial technology names for payments, lending, and trading platforms." />
        <meta property="og:url" content="https://startupnamer.org/fintech-startup-names" />
        
        {/* Schema Markup for Fintech Names */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Fintech Startup Name Generator",
            "description": "AI-powered fintech startup name generator with 250+ brandable financial technology company names",
            "url": "https://startupnamer.org/fintech-startup-names",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "Fintech Startup Name Generator",
              "applicationCategory": "BusinessApplication",
              "description": "Generate brandable names for fintech startups including payments, lending, trading, and insurance companies"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                FINTECH NAMES
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Fintech Startup
                </span>
                <br />
                <span className="text-white">Name Generator</span>
              </h1>
              
              <p className="text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
                Generate 250+ AI-powered fintech company names for payments, lending, trading, and insurance. Trained on successful financial technology unicorns.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-3xl mx-auto border border-white/20">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-black text-green-400 mb-2">250+</div>
                    <div className="text-white/80">Fintech Names</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-emerald-400 mb-2">$2.1T</div>
                    <div className="text-white/80">Market Size</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-teal-400 mb-2">96%</div>
                    <div className="text-white/80">Trust Score</div>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-3">
                  <DollarSign className="w-6 h-6" />
                  <span>Generate Fintech Names Now</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Fintech Market Trends */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Hottest Fintech Trends 2025
              </h2>
              <p className="text-xl text-white/80">
                Our AI identifies the fastest-growing fintech sectors for naming opportunities
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fintechTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl font-black text-green-400 mb-2">{trend.percentage}%</div>
                  <h3 className="text-lg font-bold text-white mb-2">{trend.trend}</h3>
                  <p className="text-white/70 text-sm">{trend.description}</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                        style={{width: `${trend.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fintech Name Examples */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                AI-Generated Fintech Names That Build Trust
              </h2>
              <p className="text-xl text-white/80">
                Real examples from our AI trained on 3,000+ successful fintech companies
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fintechNameExamples.map((example, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">{example.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-semibold">{example.score}</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{example.description}</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✓ Trust-Ready</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">Fintech-Optimized</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fintech Categories */}
        <section className="px-6 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Fintech Naming by Sector
              </h2>
              <p className="text-xl text-white/80">
                Specialized naming patterns for different financial technology verticals
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {fintechCategories.map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                    </div>
                    <div className="text-green-400 font-bold text-sm">{category.growth} Growth</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm mb-3">Popular keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.keywords.map((keyword, kidx) => (
                          <span 
                            key={kidx}
                            className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm mb-3">Example names:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, eidx) => (
                          <span 
                            key={eidx}
                            className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Fintech Founders Who Chose AI Naming
              </h2>
              <p className="text-xl text-white/80">
                Real success stories from funded fintech startups
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{story.avatar}</div>
                    <div>
                      <div className="text-xl font-bold text-white">{story.name}</div>
                      <div className="text-green-400 font-semibold">{story.company}</div>
                      <div className="text-emerald-400 text-sm">{story.funding}</div>
                      <div className="text-teal-400 text-xs">{story.industry}</div>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed italic mb-4">
                    "{story.quote}"
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 bg-gradient-to-r from-green-600/10 to-emerald-600/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Name Your
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent block">
                  Fintech Startup?
                </span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Join 1,800+ fintech founders who used our AI to build trusted financial brands
              </p>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-4">
                  <DollarSign className="w-8 h-8" />
                  <span>Generate Fintech Names Free</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </motion.button>
              
              <div className="text-white/60 mt-6">
                <div className="text-lg">✅ Free to try • ✅ 250+ trusted options • ✅ Financial-grade names</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Industries */}
        <section className="px-6 py-12 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Explore Other Industries</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Tech Names', url: '/tech-startup-names' },
                { name: 'SaaS Names', url: '/saas-startup-names' },
                { name: 'AI Startup Names', url: '/ai-startup-names' },
                { name: 'Healthcare Names', url: '/healthcare-startup-names' },
                { name: 'E-commerce Names', url: '/ecommerce-startup-names' }
              ].map((industry, index) => (
                <button
                  key={index}
                  onClick={() => navigate(industry.url)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FintechStartupNames;