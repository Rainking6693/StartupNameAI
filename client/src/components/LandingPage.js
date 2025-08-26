import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp,
  Globe,
  Award,
  Zap
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
    localStorage.setItem('earlyAccessEmail', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-amber-300 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-amber-600 bg-clip-text text-transparent">
              StartupNamer.org
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-sky-600 transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-slate-600 hover:text-sky-600 transition-colors font-medium">Pricing</a>
            <a href="#examples" className="text-slate-600 hover:text-sky-600 transition-colors font-medium">Examples</a>
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-6 py-2.5 rounded-full font-semibold hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Naming
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              The Startup Naming
              <span className="bg-gradient-to-r from-sky-500 to-amber-500 bg-clip-text text-transparent block mt-2">
                Authority
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Generate perfect startup names with advanced AI technology. Domain checking, 
              brandability analysis, and expert guidance—trusted by 10,000+ entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-sky-600 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center space-x-3">
                  <Brain className="w-6 h-6" />
                  <span>Generate My Startup Name</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
              </button>
              
              <div className="text-slate-500 text-sm bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                ✨ Free to try • No signup required • Results in 30 seconds
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-slate-500 flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-4 h-4" />
                <span className="font-medium">10,000+ founders trust us</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="font-medium">4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">$50M+ in funding raised</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Why StartupNamer.org is Different
            </h2>
            <p className="text-xl text-slate-600">
              We don't just generate names—we build brands
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Advanced AI Intelligence',
                description: 'GPT-4 powered with training on 50,000+ successful startups',
                color: 'from-sky-400 to-blue-500'
              },
              {
                icon: Globe,
                title: 'Domain Intelligence',
                description: 'Real-time checking across .com, .org, .io with pricing insights',
                color: 'from-emerald-400 to-teal-500'
              },
              {
                icon: Target,
                title: 'Brandability Science',
                description: 'Proprietary scoring algorithm based on naming psychology',
                color: 'from-amber-400 to-orange-500'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get 50+ names with analysis in under 30 seconds',
                color: 'from-yellow-400 to-amber-500'
              },
              {
                icon: Award,
                title: 'Trademark Screening',
                description: 'AI-powered conflict detection to protect your brand',
                color: 'from-rose-400 to-pink-500'
              },
              {
                icon: CheckCircle,
                title: 'Success Guarantee',
                description: '30-day money-back guarantee if you\'re not satisfied',
                color: 'from-indigo-400 to-purple-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-16">
            Names That Built Empires
          </h2>

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
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{story.name}</h3>
                <p className="text-sky-600 font-medium mb-2">{story.description}</p>
                <p className="text-emerald-600 font-semibold mb-4">{story.funding}</p>
                <p className="text-slate-600 text-sm italic">"{story.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              No subscriptions. Pay once, own forever.
            </p>
          </div>

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
              <div
                key={index}
                className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-sky-400 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-slate-800 mb-2">{plan.price}</div>
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
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-sky-500 to-amber-400 text-white hover:from-sky-600 hover:to-amber-500 shadow-lg hover:shadow-xl' 
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Ready to Name Your Startup?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join 10,000+ founders who found their perfect startup name with AI
            </p>
            
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>Start Your Naming Journey</span>
                <ArrowRight className="w-6 h-6" />
              </span>
            </button>
            
            <p className="text-slate-500 text-sm mt-6">
              30-second setup • No credit card required • Instant results
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-50/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-amber-300 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-amber-600 bg-clip-text text-transparent">
                StartupNamer.org
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-slate-500">
              <a href="#" className="hover:text-sky-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Support</a>
            </div>
          </div>
          
          <div className="text-center text-slate-400 text-sm mt-8">
            © 2025 StartupNamer.org. The startup naming authority.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;