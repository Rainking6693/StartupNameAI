import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp,
  Globe,
  Award,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const handleEmailSignup = (e) => {
    e.preventDefault();
    // Store email for launch notification
    localStorage.setItem('earlyAccessEmail', email);
    // toast.success('Thanks! We\'ll notify you when we launch!');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">StartupNamer.org</span>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            <a href="#examples" className="text-white/80 hover:text-white transition-colors">Examples</a>
            <button 
              onClick={handleGetStarted}
              className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Naming
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The Startup Naming
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Authority
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Generate perfect startup names with advanced AI technology. Domain checking, 
              brandability analysis, and expert guidance—trusted by 10,000+ entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Generate My Startup Name</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>
              
              <div className="text-white/60 text-sm">
                ✨ Free to try • No signup required • Results in 30 seconds
              </div>
            </div>

            {/* Social Proof */}
            <motion.div 
              className="flex items-center justify-center space-x-8 text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10,000+ founders trust us</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>$50M+ in funding raised</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full"
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-pink-500/20 rounded-full"
          animate={{ y: [0, 20, 0], rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why StartupNamer.org is Different
            </h2>
            <p className="text-xl text-white/80">
              We don't just generate names—we build brands
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Advanced AI Intelligence',
                description: 'GPT-4 powered with training on 50,000+ successful startups',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Globe,
                title: 'Domain Intelligence',
                description: 'Real-time checking across .com, .org, .io with pricing insights',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Target,
                title: 'Brandability Science',
                description: 'Proprietary scoring algorithm based on naming psychology',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get 50+ names with analysis in under 30 seconds',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Award,
                title: 'Trademark Screening',
                description: 'AI-powered conflict detection to protect your brand',
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: CheckCircle,
                title: 'Success Guarantee',
                description: '30-day money-back guarantee if you\'re not satisfied',
                color: 'from-indigo-500 to-purple-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold text-white mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Names That Built Empires
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'TechFlow',
                description: 'SaaS productivity tool',
                funding: '$2.5M raised',
                story: 'Found their perfect name and domain in 15 minutes'
              },
              {
                name: 'MindBridge',
                description: 'AI mental health platform', 
                funding: '$8M Series A',
                story: 'Our AI identified the perfect brandable name'
              },
              {
                name: 'DataVault',
                description: 'Enterprise security',
                funding: '$15M Series B',
                story: 'Trademark screening saved them $50K in legal fees'
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{story.name}</h3>
                <p className="text-purple-300 mb-2">{story.description}</p>
                <p className="text-green-400 font-semibold mb-4">{story.funding}</p>
                <p className="text-white/80 text-sm italic">"{story.story}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/80">
              No subscriptions. Pay once, own forever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '$19',
                description: 'Perfect for testing the waters',
                features: [
                  '25 AI-generated names',
                  'Domain availability check', 
                  'Basic brandability scores',
                  'PDF export',
                  'Email support'
                ],
                popular: false
              },
              {
                name: 'Professional', 
                price: '$39',
                description: 'Best for serious founders',
                features: [
                  '75 AI-generated names',
                  'Advanced brandability analysis',
                  'Trademark risk assessment',
                  'Industry-specific insights',
                  'Premium PDF report',
                  'Priority support'
                ],
                popular: true
              },
              {
                name: 'Enterprise',
                price: '$79', 
                description: 'For funded startups',
                features: [
                  '150 AI-generated names',
                  'Complete brand intelligence',
                  'Multi-extension domain check',
                  'Custom industry training',
                  'Phone consultation',
                  '30-day revision guarantee'
                ],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-8 ${plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                  <p className="text-white/80">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                      : 'bg-white text-purple-900 hover:bg-gray-100'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Name Your Startup?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join 10,000+ founders who found their perfect startup name with AI
            </p>
            
            <motion.button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>Start Your Naming Journey</span>
                <ArrowRight className="w-6 h-6" />
              </span>
            </motion.button>
            
            <p className="text-white/60 text-sm mt-4">
              30-second setup • No credit card required • Instant results
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-xl font-bold text-white">StartupNamer.org</span>
            </div>
            
            <div className="flex items-center space-x-6 text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="text-center text-white/40 text-sm mt-8">
            © 2025 StartupNamer.org. The startup naming authority.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;