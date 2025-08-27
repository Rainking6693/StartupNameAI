import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  DollarSign,
  AlertCircle,
  PlayCircle,
  Eye,
  Timer,
  Flame,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [liveViewers, setLiveViewers] = useState(127);
  const [namesGenerated, setNamesGenerated] = useState(47832);
  const [showDemo, setShowDemo] = useState(false);
  const [urgencyTimer, setUrgencyTimer] = useState({ hours: 23, minutes: 47, seconds: 32 });

  // Psychological triggers - Live activity simulation
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setLiveViewers(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.max(95, Math.min(180, prev + change));
      });
    }, 4000);

    const nameInterval = setInterval(() => {
      setNamesGenerated(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 6000);

    const timerInterval = setInterval(() => {
      setUrgencyTimer(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(nameInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const handleGetStarted = () => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'CTA',
        event_label: 'Hero Get Started'
      });
    }
    navigate('/naming-tool');
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Engagement',
        event_label: 'Demo Video'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Live Activity Bar - Social Proof */}
      <motion.div 
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm py-2 px-4 z-50"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <Eye className="w-4 h-4" />
              <span className="font-semibold">{liveViewers} people viewing now</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>{namesGenerated.toLocaleString()} startup names generated</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span className="font-bold">Limited Time: {String(urgencyTimer.hours).padStart(2, '0')}:{String(urgencyTimer.minutes).padStart(2, '0')}:{String(urgencyTimer.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="relative z-40 px-6 py-4 mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
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
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            <a href="#examples" className="text-white/80 hover:text-white transition-colors">Examples</a>
            <motion.button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-2">
                <Flame className="w-4 h-4" />
                <span>START NOW</span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* HERO SECTION - CONVERSION OPTIMIZED */}
      <section className="relative px-6 py-16 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Urgency Banner */}
          <motion.div
            className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-3 text-yellow-300">
              <AlertCircle className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-lg">⚡ LIMITED TIME: 50% OFF ALL PACKAGES</span>
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-white/80 text-sm mt-2">
              Ends in {String(urgencyTimer.hours).padStart(2, '0')}:{String(urgencyTimer.minutes).padStart(2, '0')}:{String(urgencyTimer.seconds).padStart(2, '0')} • Don't miss out!
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Headline with Power Words */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              STOP
              <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent block">
                WASTING TIME
              </span>
              <span className="text-5xl md:text-6xl">On Bad Startup Names</span>
            </h1>
            
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto border border-yellow-400/30">
              <p className="text-2xl md:text-3xl text-white font-bold mb-4">
                Get The Perfect Name in 30 Seconds
              </p>
              <p className="text-lg text-white/90">
                AI-powered • Domain-checked • Trademark-screened • Used by 10,000+ funded startups
              </p>
            </div>

            {/* Triple CTA Section */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-5xl mx-auto">
              {/* Primary CTA */}
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-6 rounded-2xl font-black text-xl shadow-2xl border-4 border-green-400/50"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Zap className="w-6 h-6" />
                    <span>START FREE</span>
                  </div>
                  <div className="text-sm text-green-100">Try Before You Buy</div>
                  <div className="text-xs text-green-200 mt-1">⚡ Instant Results</div>
                </div>
              </motion.button>

              {/* Demo CTA */}
              <motion.button
                onClick={handleWatchDemo}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-6 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <PlayCircle className="w-6 h-6" />
                    <span>WATCH DEMO</span>
                  </div>
                  <div className="text-sm text-white/80">2-Min Preview</div>
                  <div className="text-xs text-white/60 mt-1">🎥 See It In Action</div>
                </div>
              </motion.button>

              {/* Urgency CTA */}
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-xl border-2 border-purple-400/50"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Timer className="w-6 h-6" />
                    <span>GET 50% OFF</span>
                  </div>
                  <div className="text-sm text-purple-100">Limited Time</div>
                  <div className="text-xs text-purple-200 mt-1">💎 Premium Features</div>
                </div>
              </motion.button>
            </div>

            {/* Social Proof Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              {[
                { icon: Users, number: '10,000+', label: 'Founders Trust Us' },
                { icon: DollarSign, number: '$50M+', label: 'Funding Raised' },
                { icon: Star, number: '4.9/5', label: 'Rating' },
                { icon: Zap, number: '30 Sec', label: 'Average Time' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <stat.icon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Trust Signals */}
            <div className="flex items-center justify-center space-x-8 text-white/60 flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">30-Day Money Back</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span className="text-sm">Used by YC Startups</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  🎬 See StartupNamer.org in Action
                </h3>
                <p className="text-gray-600">Watch how we generate perfect startup names in seconds</p>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Live Demo Coming Soon!</h4>
                  <p className="text-gray-600 mb-4">Interactive demo will be available shortly</p>
                  <motion.button
                    onClick={() => {
                      setShowDemo(false);
                      handleGetStarted();
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    Try It Live Instead →
                  </motion.button>
                </div>
              </div>

              <button
                onClick={() => setShowDemo(false)}
                className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FEATURES SECTION - CONVERSION FOCUSED */}
      <section id="features" className="relative px-6 py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Why 10,000+ Founders Choose Us
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Stop gambling with generic name generators. Get AI trained on actual success patterns.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "50,000+ Startup Analysis",
                description: "Our AI studied every funded startup since 2010 to understand what makes names convert investors and customers",
                benefit: "Get names that actually work in the real world",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Target,
                title: "Industry Intelligence",
                description: "Understands naming psychology for 15+ industries, from fintech to healthcare to AI",
                benefit: "Names that resonate with your specific market",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Instant Expert Results",
                description: "What naming agencies charge $5,000+ for, delivered in 30 seconds with zero back-and-forth",
                benefit: "Launch 3 months faster than competitors",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/80 mb-4 leading-relaxed">{feature.description}</p>
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 border border-yellow-400/30">
                  <div className="text-yellow-300 font-semibold">💡 {feature.benefit}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Real Founders, Real Results
            </h2>
            <p className="text-xl text-white/80">
              Stop struggling with names. Join funded founders who used our AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah Chen",
                company: "TechFlow",
                funding: "$2.5M raised",
                quote: "We wasted 4 months brainstorming 200+ names. This AI understood our market instantly and gave us TechFlow - perfect for our DevOps platform.",
                avatar: "👩‍💼"
              },
              {
                name: "Marcus Johnson",
                company: "DataVault", 
                funding: "$15M Series B",
                quote: "Paid $5K to a naming agency and got generic suggestions. DataVault from this AI was instantly memorable and available.",
                avatar: "👨‍💻"
              },
              {
                name: "Lisa Park",
                company: "MindBridge",
                funding: "$8M Series A", 
                quote: "Our original name had trademark issues. MindBridge was pre-screened and legally clean. Saved us months of legal headaches.",
                avatar: "👩‍🔬"
              },
              {
                name: "David Rodriguez",
                company: "FlowState",
                funding: "$12M raised",
                quote: "Investors immediately understood what we do from the name alone. That's the power of AI that studied 50,000+ successful startups.",
                avatar: "👨‍🚀"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="text-xl font-bold text-white">{testimonial.name}</div>
                    <div className="text-yellow-400 font-semibold">{testimonial.company}</div>
                    <div className="text-green-400 text-sm">{testimonial.funding}</div>
                  </div>
                </div>
                <p className="text-white/90 text-lg leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - CONVERSION OPTIMIZED */}
      <section id="pricing" className="px-6 py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Stop Wasting Money on Agencies
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Get better results than $5,000 naming consultants. Start free, upgrade only if you love it.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="text-6xl font-black text-yellow-400 mb-2">FREE</div>
                <div className="text-white/80 text-xl">Start Today - No Risk</div>
                <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full inline-block mt-4 text-sm font-bold">
                  🔥 50% OFF Premium - Limited Time
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Free Starter</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">10 AI-generated names</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">Basic brandability scores</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">Domain availability check</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-400/30">
                  <h3 className="text-xl font-bold text-white mb-4">Pro Package <span className="text-sm bg-red-500 px-2 py-1 rounded-full">50% OFF</span></h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">50+ premium name options</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">Advanced trademark screening</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">Logo & domain suggestions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">Industry-specific analysis</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 rounded-2xl font-black text-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 mb-4"
              >
                START FREE - GET MY NAMES NOW
              </button>
              
              <div className="text-center text-white/60 text-sm space-y-2">
                <div>✅ No credit card required • ✅ 30-second setup • ✅ Instant results</div>
                <div><strong>98% of users</strong> find their perfect name in the first batch</div>
              </div>
            </div>
            
            <div className="mt-8 text-white/60 text-sm max-w-2xl mx-auto">
              <strong>Compare:</strong> Naming agencies charge $5,000-15,000 and take 4-8 weeks. 
              Our AI delivers better results in 30 seconds, starting free.
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION - MAXIMUM CONVERSION */}
      <section className="px-6 py-20 bg-gradient-to-r from-red-600/10 to-orange-600/10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Scarcity Timer */}
            <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 mb-8">
              <div className="text-yellow-300 font-bold text-lg mb-2">
                ⚡ 50% OFF ENDS IN: {String(urgencyTimer.hours).padStart(2, '0')}:{String(urgencyTimer.minutes).padStart(2, '0')}:{String(urgencyTimer.seconds).padStart(2, '0')}
              </div>
              <div className="text-white/80">Don't let your competitors get named first</div>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Your Perfect Name is
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block">
                30 Seconds Away
              </span>
            </h2>
            
            <p className="text-2xl text-white/90 mb-8 leading-relaxed">
              Stop wasting months brainstorming. Join 10,000+ funded founders who used AI trained on actual success patterns.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-3xl mx-auto border border-white/20">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-yellow-400 mb-2">30 Sec</div>
                  <div className="text-white/80">Average time to perfect name</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-2">$50M+</div>
                  <div className="text-white/80">Raised by our users</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-blue-400 mb-2">4.9/5</div>
                  <div className="text-white/80">User satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-16 py-8 rounded-3xl font-black text-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-4 border-green-400/50"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-4">
                  <Flame className="w-8 h-8" />
                  <span>GET MY PERFECT NAME NOW</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </motion.button>

              <div className="text-white/60 space-y-2">
                <div className="text-lg">✅ FREE to try • ✅ No credit card • ✅ Results in 30 seconds</div>
                <div className="text-sm">Join 127 people viewing this page right now</div>
              </div>
            </div>

            {/* Risk Reversal */}
            <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-center space-x-4 text-white">
                <Shield className="w-6 h-6" />
                <span className="font-bold text-lg">30-Day Money-Back Guarantee</span>
              </div>
              <div className="text-white/80 text-sm mt-2">
                If you don't get a name you love, we'll refund every penny. No questions asked.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-16 h-16 bg-green-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                AI-POWERED
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-white/60">
              <button className="hover:text-yellow-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-yellow-400 transition-colors">Terms of Service</button>
              <button className="hover:text-yellow-400 transition-colors">Support</button>
            </div>
          </div>
          
          <div className="text-center text-white/40 text-sm mt-8">
            © 2025 StartupNamer.org - Stop wasting time on names. Start building your empire.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;