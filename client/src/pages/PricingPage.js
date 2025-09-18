import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  Crown, 
  Shield, 
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = (plan) => {
    // Track the plan selection
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Pricing',
        event_label: `${plan} Plan Selected`
      });
    }
    navigate('/naming-tool');
  };

  return (
    <>
      <Helmet>
        <title>Pricing - Professional AI Startup Naming | StartupNamer.org</title>
        <meta name="description" content="Professional AI startup naming packages starting at $19. Get brandable business names with trademark research and domain guidance. 30-day money-back guarantee." />
        <meta name="keywords" content="startup naming pricing, AI name generator cost, business naming packages, professional naming service" />
        <link rel="canonical" href="https://startupnamer.org/pricing" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Navigation */}
        <nav className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Star className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold ml-2">
                #1 AI NAMING
              </span>
            </motion.div>
            
            <motion.div 
              className="hidden md:flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button onClick={() => navigate('/')} className="text-white/80 hover:text-white transition-colors">Home</button>
              <button onClick={() => navigate('/#features')} className="text-white/80 hover:text-white transition-colors">Features</button>
              <button onClick={() => navigate('/#examples')} className="text-white/80 hover:text-white transition-colors">Examples</button>
              <motion.button 
                onClick={() => handleGetStarted('Free')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>START FREE</span>
                </span>
              </motion.button>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Professional AI Startup Naming
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Packages
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Choose the perfect package for your startup naming needs. All plans include our advanced AI technology and professional brandability analysis.
              </p>

              <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 max-w-lg mx-auto mb-8">
                <div className="flex items-center justify-center space-x-2 text-blue-300">
                  <Award className="w-5 h-5" />
                  <span className="font-bold">Trusted by 1,000+ entrepreneurs worldwide</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter Package */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                  <div className="text-5xl font-black text-white mb-2">
                    $19
                  </div>
                  <div className="text-blue-400 font-semibold">Perfect for Testing</div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {[
                    '25 AI-generated names',
                    'Industry-specific analysis',
                    'Basic brandability scores',
                    'Domain strategy guidance',
                    'Email support',
                    'Instant results'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => handleGetStarted('Starter')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Professional Package - Most Popular */}
              <motion.div
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/50 relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center space-x-2">
                    <Crown className="w-4 h-4" />
                    <span>MOST POPULAR</span>
                  </div>
                </div>
                
                <div className="text-center mb-8 pt-4">
                  <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                  <div className="text-5xl font-black text-white mb-2">
                    $39
                  </div>
                  <div className="text-purple-400 font-semibold">Most Popular Choice</div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {[
                    '100+ premium name options',
                    'Enhanced brandability analysis',
                    'Trademark conflict guidance',
                    'Logo design suggestions',
                    'Social media handle check',
                    'Priority support',
                    'Competitor analysis',
                    'Brand strategy insights'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => handleGetStarted('Professional')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Choose Professional</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Enterprise Package */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-5xl font-black text-white mb-2">
                    $79
                  </div>
                  <div className="text-yellow-400 font-semibold">Complete Solution</div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {[
                    'Unlimited name generation',
                    'Comprehensive brand strategy',
                    'Custom logo designs',
                    '1-on-1 naming expert call',
                    'Legal compliance review',
                    'Market research insights',
                    'Brand positioning guide',
                    'Priority phone support'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => handleGetStarted('Enterprise')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-4 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Go Enterprise</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Guarantee Section */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h3 className="text-2xl font-bold text-white">30-Day Money-Back Guarantee</h3>
                </div>
                <p className="text-white/80 text-lg mb-6">
                  If you don't get a name you love, we'll refund every penny. No questions asked.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">1,000+</div>
                    <div className="text-white/80">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">4.8/5</div>
                    <div className="text-white/80">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">60 Sec</div>
                    <div className="text-white/80">Average Generation Time</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    q: "Can I upgrade my plan later?",
                    a: "Yes! You can upgrade to any higher plan at any time. We'll credit your previous purchase toward the upgrade."
                  },
                  {
                    q: "What if I don't like any of the names?",
                    a: "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your purchase completely."
                  },
                  {
                    q: "How quickly will I get my names?",
                    a: "Most customers receive their AI-generated names within 60 seconds. Professional analysis is delivered instantly."
                  },
                  {
                    q: "Do you check trademarks?",
                    a: "We provide trademark conflict guidance and recommendations, but professional legal verification is required for final clearance."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h4 className="font-bold text-white mb-3">{faq.q}</h4>
                    <p className="text-white/80">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Perfect Startup Name?</h2>
              <button
                onClick={() => handleGetStarted('Free')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl"
              >
                Start Free Preview Now
              </button>
              <p className="text-white/60 mt-4">Join 1,000+ entrepreneurs who found their perfect name</p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PricingPage;