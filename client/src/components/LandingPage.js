import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Zap,
  X,
  Clock,
  DollarSign,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const demoNames = [
    { name: 'StreamFlow', score: 9.2, available: true },
    { name: 'DataVault', score: 8.8, available: true },
    { name: 'CloudSync', score: 8.5, available: false },
    { name: 'InnovateLab', score: 9.1, available: true }
  ];

  const runDemo = () => {
    setShowDemo(true);
    setDemoStep(0);
    
    const steps = ['Analyzing keywords...', 'Checking domains...', 'Scoring brandability...', 'Complete!'];
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        setDemoStep(index + 1);
      }, (index + 1) * 800);
    });
  };

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    };

    // Add click handlers to navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

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
            <a href="#problem" className="text-slate-600 hover:text-sky-600 transition-colors font-medium">Problems We Solve</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-sky-600 transition-colors font-medium">How It Works</a>
            <a href="#pricing" className="text-slate-600 hover:text-sky-600 transition-colors font-medium">Pricing</a>
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-6 py-2.5 rounded-full font-semibold hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Naming →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Conversion Optimized */}
      <section className="relative px-6 py-12 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Main Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-sky-100 to-amber-100 text-slate-700 px-4 py-2 rounded-full inline-block mb-6 text-sm font-semibold">
              🚀 Used by 10,000+ funded startups
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Stop Wasting Months on
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent block mt-2">
                Bad Startup Names
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get the perfect startup name in 30 seconds. AI-powered, domain-checked, 
              trademark-screened. <strong>No more endless brainstorming sessions.</strong>
            </p>

            {/* Interactive Demo Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-sky-600 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center space-x-3">
                  <Brain className="w-6 h-6" />
                  <span>Generate My Names Now</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
              </button>
              
              <button
                onClick={runDemo}
                className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200"
              >
                <span className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>See Live Demo</span>
                </span>
              </button>
            </div>

            {/* Trust Signals */}
            <div className="text-slate-500 text-sm bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full inline-block mb-12">
              ✨ Free to try • No credit card • Results in 30 seconds • 4.9/5 rating
            </div>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl">
                <div className="text-3xl font-bold text-slate-800 mb-2">$50M+</div>
                <div className="text-slate-600">Funding Raised by Our Users</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl">
                <div className="text-3xl font-bold text-slate-800 mb-2">10,000+</div>
                <div className="text-slate-600">Startups Named Successfully</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl">
                <div className="text-3xl font-bold text-slate-800 mb-2">98%</div>
                <div className="text-slate-600">Find Their Perfect Name</div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Demo Modal */}
          {showDemo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Live Demo: AI Naming</h3>
                  <button 
                    onClick={() => setShowDemo(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-sm text-slate-600 mb-2">Input: "cloud storage, secure, business"</div>
                    <div className="text-lg font-semibold text-slate-800">Industry: Technology • Style: Professional</div>
                  </div>

                  {demoStep > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="grid gap-3">
                        {demoNames.map((name, index) => (
                          <motion.div
                            key={name.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-amber-50 rounded-xl border border-sky-200"
                          >
                            <div>
                              <div className="font-bold text-slate-800">{name.name}</div>
                              <div className="text-sm text-slate-600">Brandability: {name.score}/10</div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                name.available 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {name.available ? '.com Available' : '.com Taken'}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {demoStep === 0 && (
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 bg-gradient-to-r from-sky-500 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Brain className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="text-slate-600">Starting AI analysis...</div>
                    </div>
                  )}

                  {demoStep === 4 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => {
                          setShowDemo(false);
                          handleGetStarted();
                        }}
                        className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-8 py-3 rounded-xl font-bold hover:from-sky-600 hover:to-amber-500 transition-all duration-300"
                      >
                        Get Your Names Now →
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Problem Agitation Section */}
      <section id="problem" className="px-6 py-20 bg-red-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              The Startup Naming Nightmare
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every day you delay naming your startup costs you time, money, and momentum
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Before State - Problems */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-red-100/80 backdrop-blur-sm rounded-2xl p-8 border border-red-200">
                <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                  <X className="w-6 h-6 mr-3" />
                  Without StartupNamer.org
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-red-800">Months of Wasted Time</div>
                      <div className="text-red-700 text-sm">Endless brainstorming sessions with your co-founders</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-red-800">Expensive Mistakes</div>
                      <div className="text-red-700 text-sm">Domain squatters, trademark conflicts, legal fees</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-red-800">Mediocre Names</div>
                      <div className="text-red-700 text-sm">Generic names that don't stand out or convert</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-red-800">Team Frustration</div>
                      <div className="text-red-700 text-sm">Arguments, indecision, missed opportunities</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-200 rounded-xl">
                  <div className="text-red-800 font-bold text-lg">Cost: $50,000+ in delays</div>
                  <div className="text-red-700 text-sm">Average cost of poor naming decisions</div>
                </div>
              </div>
            </motion.div>

            {/* After State - Solution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-100/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  With StartupNamer.org
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800">Names in 30 Seconds</div>
                      <div className="text-green-700 text-sm">AI generates 50+ perfect names instantly</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800">Domain-Checked Names</div>
                      <div className="text-green-700 text-sm">Every name comes with .com availability status</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800">Trademark Screened</div>
                      <div className="text-green-700 text-sm">AI checks for conflicts before you see the names</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-green-800">Scientifically Optimized</div>
                      <div className="text-green-700 text-sm">Brandability scores based on startup psychology</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-200 rounded-xl">
                  <div className="text-green-800 font-bold text-lg">Value: Launch 3 months faster</div>
                  <div className="text-green-700 text-sm">Get to market while competitors are still naming</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transformation Stories */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            From Stuck to Funded
          </motion.h2>
          <p className="text-xl text-slate-600 mb-16">Real transformations from founders who stopped struggling with names</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'TechFlow',
                founder: 'Sarah Chen',
                before: '"We spent 4 months arguing about names. Nothing felt right."',
                after: '"Found TechFlow in 10 minutes. Raised $2.5M Series A."',
                funding: '$2.5M raised',
                time: '4 months → 10 minutes'
              },
              {
                name: 'DataVault',
                founder: 'Mike Rodriguez',
                before: '"Paid $5K to a naming agency. Got generic suggestions."',
                after: '"DataVault was perfect. Customers remember us instantly."',
                funding: '$15M Series B',
                time: 'Generic → Memorable'
              },
              {
                name: 'MindBridge',
                founder: 'Lisa Park',
                before: '"Legal said our name had trademark issues."',
                after: '"MindBridge was pre-screened. No legal problems."',
                funding: '$8M Series A',
                time: 'Legal nightmare → Peace of mind'
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-2xl font-bold text-slate-800 mb-2">{story.name}</div>
                <div className="text-sky-600 font-medium mb-4">{story.founder}</div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <div className="text-red-600 text-sm font-medium mb-1">BEFORE:</div>
                    <div className="text-red-800 italic">{story.before}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="text-green-600 text-sm font-medium mb-1">AFTER:</div>
                    <div className="text-green-800 italic">{story.after}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-emerald-600 font-semibold">{story.funding}</div>
                  <div className="text-slate-600 text-sm">{story.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 bg-sky-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 mb-12">
              Stop wasting money on expensive naming agencies. Get better results for less.
            </p>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-sky-600 mb-2">FREE</div>
                <div className="text-slate-600">Get Started Today</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">10 AI-generated names</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Domain availability check</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Basic brandability scores</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">Instant results</span>
                </div>
              </div>
              
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-sky-500 to-amber-400 text-white py-4 rounded-2xl font-bold text-lg hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Free Now
              </button>
              
              <div className="text-center text-slate-500 text-sm mt-4">
                No credit card required • Instant access
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <div className="text-slate-600 mb-4">
                <strong>Want more names and advanced features?</strong>
              </div>
              <div className="text-sm text-slate-500">
                Upgrade options available after you see your free results
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-sky-500/10 to-amber-400/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Stop Wasting Time. Start Building.
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join 10,000+ founders who got their perfect name and moved on to what matters: building their business.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Get My Perfect Name Now</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
              </button>
            </div>
            
            <div className="text-slate-500 text-sm space-y-1">
              <div>✅ 30-second setup • ✅ No credit card • ✅ Instant results</div>
              <div><strong>98% of users</strong> find their perfect name in the first batch</div>
            </div>
          </motion.div>
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
              <button className="hover:text-sky-600 transition-colors">Privacy</button>
              <button className="hover:text-sky-600 transition-colors">Terms</button>
              <button className="hover:text-sky-600 transition-colors">Support</button>
            </div>
          </div>
          
          <div className="text-center text-slate-400 text-sm mt-8">
            © 2025 StartupNamer.org. Stop wasting time on names. Start building your empire.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;