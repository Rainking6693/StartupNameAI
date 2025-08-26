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
  Sparkles,
  Shield,
  BookOpen
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
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-amber-400 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-amber-600 bg-clip-text text-transparent">
              StartupNamer.org
            </span>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Pricing
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Success Stories
            </a>
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Naming
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-sky-200/50 mb-8 shadow-soft">
              <Award className="w-4 h-4 text-amber-500 mr-2" />
              <span className="text-sm font-medium text-slate-600">
                🏆 Trusted by 10,000+ entrepreneurs worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-8 leading-tight">
              The Startup Naming
              <span className="block bg-gradient-to-r from-sky-500 to-amber-400 bg-clip-text text-transparent mt-2">
                Authority
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Generate perfect startup names with advanced AI technology. Professional domain checking, 
              brandability analysis, and expert guidance you can trust.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-large hover:shadow-xl transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Generate My Startup Name</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>
              
              <div className="text-slate-500 text-sm">
                ✨ Free to try • No signup required • Results in 30 seconds
              </div>
            </div>

            {/* Social Proof */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-8 text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-100">
                <Users className="w-4 h-4 text-sky-500" />
                <span className="font-medium">10,000+ founders</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-100">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-medium">4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">$50M+ funded</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-sky-200/30 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-amber-200/30 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Why StartupNamer.org is Different
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We don't just generate names—we build brands with professional-grade tools and insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Advanced AI Intelligence',
                description: 'GPT-4 powered system trained on 50,000+ successful startups and naming patterns',
                color: 'from-sky-400 to-blue-500',
                bgColor: 'bg-sky-50',
                borderColor: 'border-sky-200'
              },
              {
                icon: Globe,
                title: 'Domain Intelligence',
                description: 'Real-time availability checking across .com, .org, .io with instant pricing insights',
                color: 'from-emerald-400 to-teal-500',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200'
              },
              {
                icon: Target,
                title: 'Brandability Science',
                description: 'Proprietary scoring algorithm based on psychology, memorability, and market research',
                color: 'from-amber-400 to-orange-500',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200'
              },
              {
                icon: Zap,
                title: 'Lightning Fast Results',
                description: 'Get 50+ names with complete analysis in under 30 seconds—no waiting around',
                color: 'from-violet-400 to-purple-500',
                bgColor: 'bg-violet-50',
                borderColor: 'border-violet-200'
              },
              {
                icon: Shield,
                title: 'Trademark Protection',
                description: 'AI-powered conflict detection and legal screening to protect your brand investment',
                color: 'from-red-400 to-pink-500',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200'
              },
              {
                icon: BookOpen,
                title: 'Expert Guidance',
                description: 'Educational insights and naming strategies from successful entrepreneurs and experts',
                color: 'from-indigo-400 to-blue-500',
                bgColor: 'bg-indigo-50',
                borderColor: 'border-indigo-200'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`glass-card rounded-2xl p-8 ${feature.bgColor} ${feature.borderColor} hover-lift`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-medium`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="testimonials" className="px-6 py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Names That Built Empires
            </h2>
            <p className="text-xl text-slate-600">
              Real success stories from entrepreneurs who found their perfect names
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'TechFlow',
                description: 'SaaS productivity platform',
                funding: '$2.5M Series A raised',
                story: 'Found their perfect name and .com domain in just 15 minutes',
                founder: 'Sarah Chen, CEO',
                color: 'border-sky-200 bg-sky-50'
              },
              {
                name: 'MindBridge',
                description: 'AI mental health platform', 
                funding: '$8M Series B raised',
                story: 'Our AI identified the perfect brandable name that resonated with users',
                founder: 'Marcus Rodriguez, Founder',
                color: 'border-emerald-200 bg-emerald-50'
              },
              {
                name: 'DataVault',
                description: 'Enterprise security solution',
                funding: '$15M Series C raised',
                story: 'Trademark screening saved us $50K in legal fees and rebranding costs',
                founder: 'Emily Watson, Co-founder',
                color: 'border-amber-200 bg-amber-50'
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                className={`glass-card rounded-2xl p-8 ${story.color} hover-lift`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{story.name}</h3>
                  <p className="text-slate-600 mb-2">{story.description}</p>
                  <p className="text-emerald-600 font-semibold text-sm">{story.funding}</p>
                </div>
                <p className="text-slate-700 italic mb-6">"{story.story}"</p>
                <p className="text-sm text-slate-500 font-medium">— {story.founder}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              No subscriptions. Pay once, own forever. 30-day money-back guarantee.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
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
                popular: false,
                bgColor: 'bg-white/80',
                borderColor: 'border-slate-200'
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
                popular: true,
                bgColor: 'bg-gradient-to-br from-sky-50 to-amber-50',
                borderColor: 'border-sky-300'
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
                popular: false,
                bgColor: 'bg-white/80',
                borderColor: 'border-slate-200'
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative glass-card rounded-2xl p-8 ${plan.bgColor} ${plan.borderColor} ${plan.popular ? 'ring-2 ring-sky-400 transform scale-105' : ''} hover-lift`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                  <div className="text-5xl font-bold text-slate-800 mb-2">{plan.price}</div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={handleGetStarted}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-sky-500 to-amber-400 text-white hover:from-sky-600 hover:to-amber-500 shadow-large' 
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300'
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
      <section className="px-6 py-24 bg-gradient-to-r from-sky-500/10 to-amber-400/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Ready to Name Your Startup?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join 10,000+ founders who found their perfect startup name with professional AI guidance
            </p>
            
            <motion.button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-large hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>Start Your Naming Journey</span>
                <ArrowRight className="w-6 h-6" />
              </span>
            </motion.button>
            
            <p className="text-slate-500 text-sm mt-6">
              30-second setup • No credit card required • Instant results • 30-day guarantee
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white/60 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-amber-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-amber-600 bg-clip-text text-transparent">
                StartupNamer.org
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Support</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Blog</a>
            </div>
          </div>
          
          <div className="text-center text-slate-500 text-sm mt-8">
            © 2025 StartupNamer.org. The startup naming authority. Built with care for entrepreneurs.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;