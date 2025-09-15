import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Star, 
  ArrowRight,
  Eye,
  Network,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AiStartupNames = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const aiNameExamples = [
    { name: 'NeuralFlow', score: 9.4, description: 'Perfect for machine learning platforms' },
    { name: 'MindForge', score: 9.2, description: 'Ideal for AI development tools' },
    { name: 'CogniSync', score: 9.0, description: 'Great for cognitive computing solutions' },
    { name: 'IntelliStream', score: 9.1, description: 'AI-powered data processing' },
    { name: 'StarVault', score: 8.9, description: 'Knowledge management and AI storage' },
    { name: 'AutoMind', score: 8.8, description: 'Automation and intelligent systems' },
    { name: 'VisionPro', score: 9.0, description: 'Computer vision and image AI' },
    { name: 'SynthAI', score: 8.7, description: 'Synthetic data and AI generation' }
  ];

  const aiCategories = [
    { 
      category: 'Machine Learning & Deep Learning', 
      keywords: ['Neural', 'Learn', 'Deep', 'Model', 'Train'],
      examples: ['NeuralFlow', 'DeepMind', 'LearnPro'],
      icon: Star,
      growth: '+312%',
      funding: '$45B'
    },
    { 
      category: 'Computer Vision & Image AI', 
      keywords: ['Vision', 'Image', 'Visual', 'See', 'Detect'],
      examples: ['VisionFlow', 'ImageAI', 'VisualPro'],
      icon: Eye,
      growth: '+267%',
      funding: '$18B'
    },
    { 
      category: 'Natural Language Processing', 
      keywords: ['Language', 'Text', 'Chat', 'Voice', 'Speech'],
      examples: ['LanguageFlow', 'TextAI', 'ChatPro'],
      icon: Bot,
      growth: '+289%',
      funding: '$32B'
    },
    { 
      category: 'AI Infrastructure & MLOps', 
      keywords: ['Ops', 'Deploy', 'Scale', 'Platform', 'Cloud'],
      examples: ['MLOpsFlow', 'DeployAI', 'ScalePro'],
      icon: Network,
      growth: '+234%',
      funding: '$12B'
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI Startup Name Generator - 400+ AI-Generated Artificial Intelligence Company Names | StartupNamer.org</title>
        <meta name="description" content="Generate perfect AI startup names with AI. 400+ brandable artificial intelligence company names for machine learning, computer vision, and NLP startups. Free AI name generator." />
        <meta name="keywords" content="AI startup names, artificial intelligence company names, AI name generator, machine learning startup names, deep learning company names, AI branding, neural network names" />
        <link rel="canonical" href="https://startupnamer.org/ai-startup-names" />
        
        <meta property="og:title" content="AI Startup Name Generator - 400+ AI-Generated Names" />
        <meta property="og:description" content="Generate perfect AI startup names with AI. Brandable artificial intelligence company names for machine learning and deep learning startups." />
        <meta property="og:url" content="https://startupnamer.org/ai-startup-names" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                AI NAMES
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
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI Startup
                </span>
                <br />
                <span className="text-white">Name Generator</span>
              </h1>
              
              <p className="text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
                Generate 400+ AI-powered artificial intelligence company names for machine learning, computer vision, NLP, and deep learning startups. Trained on AI unicorns.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-3xl mx-auto border border-white/20">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-black text-purple-400 mb-2">400+</div>
                    <div className="text-white/80">AI Names Generated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-pink-400 mb-2">$180B</div>
                    <div className="text-white/80">AI Market Size</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-blue-400 mb-2">97%</div>
                    <div className="text-white/80">Innovation Score</div>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-3">
                  <Star className="w-6 h-6" />
                  <span>Generate AI Names Now</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* AI Name Examples */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                AI-Generated AI Names That Think
              </h2>
              <p className="text-xl text-white/80">
                Real examples from our AI trained on 4,000+ successful AI companies
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiNameExamples.map((example, index) => (
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
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">✓ AI-Ready</span>
                    <span className="bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full">Tech-Forward</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Categories */}
        <section className="px-6 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                AI Naming by Technology
              </h2>
              <p className="text-xl text-white/80">
                Specialized naming patterns for different AI technology verticals
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {aiCategories.map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold text-sm">{category.growth} Growth</div>
                      <div className="text-green-400 font-bold text-xs">{category.funding} Funding</div>
                    </div>
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
                            className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-medium"
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
                  AI Startup?
                </span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Join 2,800+ AI founders who used our AI to build intelligent brands
              </p>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-4">
                  <Star className="w-8 h-8" />
                  <span>Generate AI Names Free</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </motion.button>
              
              <div className="text-white/60 mt-6">
                <div className="text-lg">✅ Free to try • ✅ 400+ intelligent options • ✅ AI-grade names</div>
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

export default AiStartupNames;