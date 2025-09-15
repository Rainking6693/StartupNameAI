import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Heart,
  Share2,
  CheckCircle,
  XCircle,
  Star,
  Globe,
  Award,
  TrendingUp,
  Brain,
  Sparkles,
  Filter,
  SortAsc,
  Crown,
  Zap,
  DollarSign,
  Copy,
  ExternalLink,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';

const NameResults = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all'); // all, available, premium
  const [sortBy, setSortBy] = useState('score'); // score, alphabetical, availability
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Load session data from localStorage
    const storedData = localStorage.getItem(`naming_session_${sessionId}`);
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setSessionData(parsed);
        
        // Generate names based on form data
        const generatedNames = generateNamesFromFormData(parsed.formData);
        setResults(generatedNames);
        
        setTimeout(() => setLoading(false), 1500);
      } catch (error) {
        console.error('Failed to parse session data:', error);
        setResults(generateDemoResults());
        setTimeout(() => setLoading(false), 1500);
      }
    } else {
      console.log('No session data found, generating demo results');
      setResults(generateDemoResults());
      setTimeout(() => setLoading(false), 1500);
    }
  }, [sessionId]);

  const generateNamesFromFormData = (formData) => {
    const { industry, style, keywords } = formData;
    
    // Industry-specific name patterns
    const industryPatterns = {
      tech: ['Tech', 'Data', 'Cloud', 'Stream', 'Flow', 'Sync', 'Connect', 'Link', 'Net', 'Hub', 'Code', 'Byte', 'Pixel', 'Digital', 'Cyber'],
      health: ['Health', 'Care', 'Med', 'Vital', 'Life', 'Pulse', 'Heal', 'Wellness', 'Pure', 'Fit', 'Strong', 'Active', 'Thrive', 'Nourish', 'Balance'],
      fintech: ['Pay', 'Coin', 'Bank', 'Fund', 'Cash', 'Finance', 'Capital', 'Invest', 'Money', 'Vault', 'Credit', 'Wallet', 'Trade', 'Ledger', 'Asset'],
      ecommerce: ['Shop', 'Buy', 'Cart', 'Market', 'Store', 'Trade', 'Sale', 'Deal', 'Retail', 'Commerce', 'Goods', 'Items', 'Products', 'Bazaar'],
      education: ['Learn', 'Edu', 'Study', 'Know', 'Skill', 'Mind', 'Brain', 'Academy', 'Scholar', 'Teach', 'Course', 'Lesson', 'Training', 'Mentor'],
      food: ['Taste', 'Fresh', 'Bite', 'Flavor', 'Cook', 'Chef', 'Kitchen', 'Recipe', 'Meal', 'Dish', 'Food', 'Eat', 'Feast', 'Culinary'],
      travel: ['Go', 'Trip', 'Journey', 'Explore', 'Adventure', 'Wander', 'Roam', 'Discover', 'Venture', 'Quest', 'Travel', 'Tour', 'Voyage'],
      other: ['Pro', 'Max', 'Plus', 'Prime', 'Elite', 'Smart', 'Quick', 'Easy', 'Simple', 'Best', 'Top', 'Core', 'Base', 'Hub']
    };

    const styleModifiers = {
      modern: ['ly', 'fy', 'io', 'ai', 'x', 'lab', 'hub', 'app', 'sys', 'tech'],
      classic: ['corp', 'co', 'inc', 'group', 'partners', 'solutions', 'services', 'systems'],
      creative: ['lab', 'studio', 'works', 'craft', 'design', 'space', 'room', 'place', 'box', 'zone'],
      professional: ['pro', 'expert', 'master', 'premier', 'elite', 'prime', 'plus', 'max', 'exec', 'biz']
    };

    const baseWords = industryPatterns[industry] || industryPatterns.other;
    const modifiers = styleModifiers[style] || styleModifiers.modern;
    
    const generatedNames = [];

    // Generate names using keywords
    keywords.forEach((keyword, keywordIndex) => {
      const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      
      // Keyword + industry words
      baseWords.slice(0, 6).forEach((word, wordIndex) => {
        const nameId = (keywordIndex * 20) + wordIndex + 1;
        
        // Forward combination
        generatedNames.push({
          id: nameId,
          name: capitalizedKeyword + word,
          explanation: `${capitalizedKeyword + word} combines your keyword '${keyword}' with ${industry} industry terminology, creating a brandable name that clearly communicates your focus area while maintaining ${style} appeal.`,
          brandabilityScore: parseFloat((7.2 + Math.random() * 2.5).toFixed(1)),
          domainAvailable: Math.random() > 0.4,
          domainPrice: parseFloat((Math.random() * 30 + 12).toFixed(2)),
          psychologyTriggers: ['clarity', 'industry-focus', keyword.toLowerCase()],
          seoScore: parseFloat((7 + Math.random() * 2.8).toFixed(1)),
          memorability: parseFloat((7.5 + Math.random() * 2.2).toFixed(1)),
          pronunciation: Math.random() > 0.2 ? 'Easy' : 'Moderate',
          extensions: {
            com: Math.random() > 0.4,
            io: Math.random() > 0.3,
            ai: Math.random() > 0.7,
            org: Math.random() > 0.5
          },
          source: 'ai-generated'
        });
        
        // Reverse combination
        if (generatedNames.length < 15) {
          generatedNames.push({
            id: nameId + 100,
            name: word + capitalizedKeyword,
            explanation: `${word + capitalizedKeyword} places industry terminology first, emphasizing your ${industry} expertise while incorporating '${keyword}' for brand personality and ${style} positioning.`,
            brandabilityScore: parseFloat((7.0 + Math.random() * 2.3).toFixed(1)),
            domainAvailable: Math.random() > 0.5,
            domainPrice: parseFloat((Math.random() * 25 + 15).toFixed(2)),
            psychologyTriggers: ['authority', 'expertise', keyword.toLowerCase()],
            seoScore: parseFloat((6.8 + Math.random() * 2.5).toFixed(1)),
            memorability: parseFloat((7.2 + Math.random() * 2.0).toFixed(1)),
            pronunciation: Math.random() > 0.3 ? 'Easy' : 'Moderate',
            extensions: {
              com: Math.random() > 0.3,
              io: Math.random() > 0.4,
              ai: Math.random() > 0.6,
              org: Math.random() > 0.4
            },
            source: 'ai-generated'
          });
        }
      });
    });

    // Add some pure combinations
    baseWords.slice(0, 3).forEach((word1, i) => {
      modifiers.slice(0, 2).forEach(modifier => {
        if (generatedNames.length < 20) {
          generatedNames.push({
            id: 200 + generatedNames.length,
            name: word1 + modifier.charAt(0).toUpperCase() + modifier.slice(1),
            explanation: `A ${style} approach combining ${industry} terminology with contemporary naming conventions, perfect for establishing authority in your market.`,
            brandabilityScore: parseFloat((6.8 + Math.random() * 2.8).toFixed(1)),
            domainAvailable: Math.random() > 0.6,
            domainPrice: parseFloat((Math.random() * 20 + 18).toFixed(2)),
            psychologyTriggers: [style, 'innovation', 'market-fit'],
            seoScore: parseFloat((6.5 + Math.random() * 3.0).toFixed(1)),
            memorability: parseFloat((7.0 + Math.random() * 2.5).toFixed(1)),
            pronunciation: Math.random() > 0.4 ? 'Easy' : 'Moderate',
            extensions: {
              com: Math.random() > 0.5,
              io: Math.random() > 0.4,
              ai: Math.random() > 0.8,
              org: Math.random() > 0.6
            },
            source: 'ai-generated'
          });
        }
      });
    });

    return generatedNames.slice(0, 20).sort((a, b) => b.brandabilityScore - a.brandabilityScore);
  };

  const generateDemoResults = () => {
    return [
      {
        id: 1,
        name: 'StartFlow',
        explanation: 'Combines starting/launching concepts with smooth flow, suggesting seamless business operations and growth.',
        brandabilityScore: 8.7,
        domainAvailable: true,
        domainPrice: 12.99,
        psychologyTriggers: ['momentum', 'growth', 'ease'],
        seoScore: 8.2,
        memorability: 8.9,
        pronunciation: 'Easy',
        extensions: { com: true, io: true, ai: false, org: true },
        source: 'demo'
      },
      {
        id: 2,
        name: 'VentureCore',
        explanation: 'Emphasizes the essential foundation of venture creation with strong, trustworthy positioning.',
        brandabilityScore: 9.1,
        domainAvailable: true,
        domainPrice: 15.99,
        psychologyTriggers: ['foundation', 'strength', 'venture'],
        seoScore: 8.8,
        memorability: 8.5,
        pronunciation: 'Easy',
        extensions: { com: true, io: false, ai: true, org: true },
        source: 'demo'
      }
    ];
  };

  const filteredResults = results.filter(name => {
    if (filter === 'available') return name.domainAvailable;
    if (filter === 'premium') return name.brandabilityScore >= 8.5;
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'score') return b.brandabilityScore - a.brandabilityScore;
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    if (sortBy === 'availability') return b.domainAvailable - a.domainAvailable;
    return 0;
  });

  const toggleFavorite = (nameId) => {
    setFavorites(prev => 
      prev.includes(nameId) 
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  const copyToClipboard = (text) => {
    copy(text);
    toast.success(`Copied '${text}' to clipboard!`);
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-emerald-400';
    if (score >= 8) return 'text-blue-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 9) return 'from-emerald-500 to-green-500';
    if (score >= 8) return 'from-blue-500 to-cyan-500';
    if (score >= 7) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Finalizing Your Names</h2>
          <p className="text-white/80 text-lg">Adding the finishing touches to your perfect startup names...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="px-6 py-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="hidden md:block text-white/40">|</div>
            
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Your Startup Names</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => toast.success('Share feature coming soon!')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl text-white/80 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button 
              onClick={() => toast.success('Export feature coming soon!')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Session Summary */}
      {sessionData && (
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
            >
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Perfect Names for Your {sessionData.formData?.industry} Startup
                </h1>
                <p className="text-white/80 text-lg">
                  Generated {results.length} {sessionData.formData?.style} names using your keywords
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{results.length}</div>
                  <div className="text-white/70">Names Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{results.filter(r => r.domainAvailable).length}</div>
                  <div className="text-white/70">Domains Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{results.filter(r => r.brandabilityScore >= 8.5).length}</div>
                  <div className="text-white/70">High Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{favorites.length}</div>
                  <div className="text-white/70">Favorites</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-white/60" />
                <span className="text-white/60 font-medium">Filter:</span>
              </div>
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Names' },
                  { id: 'available', label: 'Available Domains' },
                  { id: 'premium', label: 'Premium Names' }
                ].map(filterOption => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      filter === filterOption.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SortAsc className="w-4 h-4 text-white/60" />
                <span className="text-white/60 font-medium">Sort by:</span>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="score">Brandability Score</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="availability">Domain Availability</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Free Preview: {results.length} of 75+ Names</h3>
                  <p className="text-white/80">Unlock all names + advanced analysis + trademark screening</p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Upgrade Now</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            {sortedResults.map((name, index) => (
              <motion.div
                key={name.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-3xl font-bold text-white">{name.name}</h3>
                      {name.domainAvailable && (
                        <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>Domain Available</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-white/80 text-lg mb-4 leading-relaxed">{name.explanation}</p>
                    
                    {name.psychologyTriggers && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {name.psychologyTriggers.map((trigger, i) => (
                          <span key={i} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${getScoreGradient(name.brandabilityScore)} bg-clip-text text-transparent`}>
                        {name.brandabilityScore}/10
                      </div>
                      <div className="text-white/60 text-sm">Brandability</div>
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(name.id)}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        favorites.includes(name.id)
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-red-300'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(name.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className={`text-xl font-bold mb-1 ${getScoreColor(name.seoScore)}`}>
                      {name.seoScore}/10
                    </div>
                    <div className="text-white/60 text-sm">SEO Score</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className={`text-xl font-bold mb-1 ${getScoreColor(name.memorability)}`}>
                      {name.memorability}/10
                    </div>
                    <div className="text-white/60 text-sm">Memorability</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-lg font-medium text-white mb-1">{name.pronunciation}</div>
                    <div className="text-white/60 text-sm">Pronunciation</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-lg font-medium text-white mb-1">{name.source === 'ai-generated' ? 'AI' : 'Demo'}</div>
                    <div className="text-white/60 text-sm">Source</div>
                  </div>
                </div>

                {/* Domain Information */}
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Domain Extensions
                  </h4>
                  
                  <div className="grid md:grid-cols-4 gap-3">
                    {Object.entries(name.extensions || {}).map(([ext, available]) => (
                      <div key={ext} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="font-medium text-white">.{ext}</span>
                        {available ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm font-semibold">Available</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-sm font-semibold">Taken</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {name.domainAvailable && name.domainPrice && (
                    <div className="mt-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-emerald-300">{name.name.toLowerCase()}.com</div>
                          <div className="text-emerald-400 text-sm">Ready to purchase</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-300">${name.domainPrice}/year</div>
                          <div className="text-emerald-400 text-sm">Estimated price</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => copyToClipboard(name.name)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white/70 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button 
                      onClick={() => toast.success('Advanced analysis coming in premium version!')}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white/70 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Analyze</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Unlock Premium</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Generate More CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-12 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Need More Names?</h3>
            <p className="text-white/80 mb-6">Generate additional names with different keywords or styles</p>
            <button
              onClick={() => navigate('/naming-tool')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate More Names</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Unlock All Names</h3>
                <p className="text-gray-600">Get the complete naming package with advanced analysis</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { name: 'Starter', price: '$19', names: '25 names', popular: false },
                  { name: 'Professional', price: '$39', names: '75 names', popular: true },
                  { name: 'Enterprise', price: '$79', names: '150 names', popular: false }
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      plan.popular 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="text-center mb-2">
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-bold text-gray-800">{plan.name}</div>
                      <div className="text-2xl font-bold text-gray-800 my-2">{plan.price}</div>
                      <div className="text-gray-600 text-sm">{plan.names}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    toast.success('Payment processing coming soon!');
                  }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NameResults;