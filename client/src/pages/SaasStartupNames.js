import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Zap, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Server,
  Users,
  BarChart,
  Shield,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SaasStartupNames = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const saasNameExamples = [
    { name: 'CloudFlow', score: 9.4, description: 'Perfect for workflow automation platforms' },
    { name: 'DataSync', score: 9.1, description: 'Ideal for data integration and synchronization' },
    { name: 'TeamHub', score: 8.9, description: 'Great for collaboration and team management' },
    { name: 'WorkStream', score: 9.0, description: 'Productivity and project management tools' },
    { name: 'AppForge', score: 8.8, description: 'Application development and deployment' },
    { name: 'MetricsPro', score: 8.7, description: 'Analytics and business intelligence' },
    { name: 'SecureVault', score: 9.2, description: 'Security and compliance management' },
    { name: 'ScaleUp', score: 8.6, description: 'Business scaling and growth platforms' }
  ];

  const saasCategories = [
    { 
      category: 'Productivity & Collaboration', 
      keywords: ['Team', 'Work', 'Flow', 'Sync', 'Hub'],
      examples: ['TeamFlow', 'WorkSync', 'CollabHub'],
      icon: Users
    },
    { 
      category: 'Analytics & Business Intelligence', 
      keywords: ['Data', 'Metrics', 'Insight', 'Analytics', 'Intelligence'],
      examples: ['DataInsight', 'MetricsFlow', 'AnalyticsPro'],
      icon: BarChart
    },
    { 
      category: 'Security & Compliance', 
      keywords: ['Secure', 'Guard', 'Shield', 'Vault', 'Protect'],
      examples: ['SecureFlow', 'GuardVault', 'ShieldPro'],
      icon: Shield
    },
    { 
      category: 'Infrastructure & DevOps', 
      keywords: ['Cloud', 'Deploy', 'Scale', 'Ops', 'Stack'],
      examples: ['CloudOps', 'DeployFlow', 'ScaleStack'],
      icon: Server
    }
  ];

  const successStories = [
    {
      name: 'Sarah Kim',
      company: 'DataFlow',
      funding: '$5.2M Series A',
      quote: 'Our AI-generated name DataFlow perfectly captured our data pipeline vision. Investors immediately understood our value proposition.',
      avatar: '👩‍💼',
      industry: 'Data Integration'
    },
    {
      name: 'Michael Chen',
      company: 'TeamSync',
      funding: '$3.8M Seed',
      quote: 'TeamSync was instantly memorable and available across all domains. The brandability score was 9.1 and it shows in our user adoption.',
      avatar: '👨‍💻',
      industry: 'Team Collaboration'
    },
    {
      name: 'Lisa Rodriguez',
      company: 'CloudVault',
      funding: '$12M Series B',
      quote: 'CloudVault conveyed security and cloud expertise in two words. Our enterprise customers love the professional, trustworthy feel.',
      avatar: '👩‍🔬',
      industry: 'Cloud Security'
    }
  ];

  return (
    <>
      <Helmet>
        <title>SaaS Startup Name Generator - 300+ AI-Generated Software Company Names | StartupNamer.org</title>
        <meta name="description" content="Generate perfect SaaS startup names with AI. 300+ brandable software company names for productivity, analytics, security, and cloud platforms. Free name generator with domain check." />
        <meta name="keywords" content="SaaS startup names, software company names, SaaS name generator, cloud software names, B2B SaaS names, software startup naming, SaaS branding" />
        <link rel="canonical" href="https://startupnamer.org/saas-startup-names" />
        
        {/* Open Graph */}
        <meta property="og:title" content="SaaS Startup Name Generator - 300+ AI-Generated Names" />
        <meta property="og:description" content="Generate perfect SaaS startup names with AI. Brandable software company names for productivity, analytics, and cloud platforms." />
        <meta property="og:url" content="https://startupnamer.org/saas-startup-names" />
        
        {/* Schema Markup for SaaS Names */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "SaaS Startup Name Generator",
            "description": "AI-powered SaaS startup name generator with 300+ brandable software company names",
            "url": "https://startupnamer.org/saas-startup-names",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "SaaS Startup Name Generator",
              "applicationCategory": "BusinessApplication",
              "description": "Generate brandable names for SaaS startups including productivity, analytics, security, and cloud software companies"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cloud className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                SAAS NAMES
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
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  SaaS Startup
                </span>
                <br />
                <span className="text-white">Name Generator</span>
              </h1>
              
              <p className="text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
                Generate 300+ AI-powered SaaS company names for productivity, analytics, security, and cloud platforms. Trained on successful B2B software unicorns.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-3xl mx-auto border border-white/20">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-black text-purple-400 mb-2">300+</div>
                    <div className="text-white/80">SaaS Names Generated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-blue-400 mb-2">B2B</div>
                    <div className="text-white/80">Focused Naming</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-green-400 mb-2">94%</div>
                    <div className="text-white/80">Enterprise Success</div>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-3">
                  <Cloud className="w-6 h-6" />
                  <span>Generate SaaS Names Now</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* SaaS Name Examples */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                AI-Generated SaaS Names That Scale
              </h2>
              <p className="text-xl text-white/80">
                Real examples from our AI trained on 5,000+ successful SaaS companies
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {saasNameExamples.map((example, index) => (
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
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✓ B2B Ready</span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">SaaS-Optimized</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SaaS Categories */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                SaaS Naming by Category
              </h2>
              <p className="text-xl text-white/80">
                Our AI understands naming patterns for different SaaS verticals
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {saasCategories.map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{category.category}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm mb-3">Popular keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.keywords.map((keyword, kidx) => (
                          <span 
                            key={kidx}
                            className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium"
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
                            className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
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
        <section className="px-6 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                SaaS Founders Who Chose AI Naming
              </h2>
              <p className="text-xl text-white/80">
                Real success stories from funded SaaS startups
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
                      <div className="text-purple-400 font-semibold">{story.company}</div>
                      <div className="text-green-400 text-sm">{story.funding}</div>
                      <div className="text-blue-400 text-xs">{story.industry}</div>
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

        {/* Why SaaS Names Matter */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">
                  Why SaaS Names Need Special Attention
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: Users,
                      title: 'B2B Decision Makers',
                      description: 'SaaS names must appeal to business decision makers who value professionalism, trust, and clear value propositions.'
                    },
                    {
                      icon: Layers,
                      title: 'Technical Credibility',
                      description: 'Names need to convey technical competence while remaining accessible to non-technical stakeholders and end users.'
                    },
                    {
                      icon: BarChart,
                      title: 'Scalability Perception',
                      description: 'Enterprise customers need confidence that your platform can scale with their business growth and evolving needs.'
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">SaaS Naming Success Factors</h3>
                <div className="space-y-4">
                  {[
                    { factor: 'Professional Sound', score: 94 },
                    { factor: 'Technical Credibility', score: 91 },
                    { factor: 'Memorability', score: 88 },
                    { factor: 'Domain Availability', score: 85 },
                    { factor: 'International Appeal', score: 82 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white">{item.factor}</span>
                        <span className="font-semibold text-purple-400">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                          style={{width: `${item.score}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Name Your
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                  SaaS Startup?
                </span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Join 2,500+ SaaS founders who used our AI to find their perfect B2B name
              </p>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-4">
                  <Cloud className="w-8 h-8" />
                  <span>Generate SaaS Names Free</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </motion.button>
              
              <div className="text-white/60 mt-6">
                <div className="text-lg">✅ Free to try • ✅ 300+ B2B options • ✅ Enterprise-ready names</div>
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
                { name: 'AI Startup Names', url: '/ai-startup-names' },
                { name: 'Fintech Names', url: '/fintech-startup-names' },
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

export default SaasStartupNames;