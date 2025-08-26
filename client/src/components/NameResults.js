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
  AlertTriangle,
  Copy,
  ExternalLink,
  Shield,
  Eye,
  Target,
  Bookmark
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Dynamic name generation based on user input
const generateNamesForInput = (formData) => {
  if (!formData) return [];
  
  const industryPatterns = {
    tech: {
      prefixes: ['Smart', 'Cloud', 'Data', 'Sync', 'Flow', 'Core', 'Pixel', 'Neo', 'Quantum', 'Fusion', 'Digital', 'Cyber', 'Tech', 'Web', 'Net'],
      suffixes: ['Hub', 'Lab', 'Core', 'Flow', 'Sync', 'Edge', 'Point', 'Stream', 'Works', 'Tech', 'Soft', 'Ware', 'Pro', 'Zone', 'Base'],
      adjectives: ['Advanced', 'Intelligent', 'Automated', 'Streamlined', 'Connected', 'Innovative']
    },
    fintech: {
      prefixes: ['Pay', 'Coin', 'Bank', 'Fund', 'Vault', 'Trust', 'Secure', 'Capital', 'Mint', 'Ledger', 'Crypto', 'Block', 'Chain', 'Trade', 'Invest'],
      suffixes: ['Pay', 'Wallet', 'Bank', 'Trade', 'Invest', 'Finance', 'Capital', 'Fund', 'Exchange', 'Vault', 'Ledger', 'Chain', 'Coin', 'Token', 'Credit'],
      adjectives: ['Secure', 'Trusted', 'Smart', 'Digital', 'Instant', 'Global']
    },
    health: {
      prefixes: ['Care', 'Vital', 'Wellness', 'Heal', 'Fit', 'Life', 'Mind', 'Body', 'Pure', 'Balance', 'Health', 'Med', 'Bio', 'Wellness', 'Cure'],
      suffixes: ['Care', 'Health', 'Wellness', 'Life', 'Fit', 'Med', 'Bio', 'Vital', 'Pure', 'Balance', 'Heal', 'Clinic', 'Lab', 'Center', 'Plus'],
      adjectives: ['Healthy', 'Vital', 'Pure', 'Natural', 'Wellness', 'Active']
    },
    ecommerce: {
      prefixes: ['Shop', 'Buy', 'Cart', 'Market', 'Store', 'Trade', 'Sell', 'Goods', 'Deal', 'Plaza', 'Retail', 'Sale', 'Commerce', 'Merchant', 'Vendor'],
      suffixes: ['Shop', 'Store', 'Market', 'Mall', 'Plaza', 'Cart', 'Bay', 'Depot', 'Hub', 'Center', 'Place', 'Zone', 'World', 'Land', 'Express'],
      adjectives: ['Quick', 'Fast', 'Easy', 'Smart', 'Best', 'Prime']
    }
  };
  
  const styleModifiers = {
    modern: {
      suffixes: ['Hub', 'Lab', 'Core', 'Flow', 'Sync', 'Edge', 'Point', 'Stream', 'Works', 'Tech'],
      tone: 'cutting-edge and contemporary'
    },
    professional: {
      suffixes: ['Pro', 'Solutions', 'Systems', 'Group', 'Corp', 'Partners', 'Associates', 'Consulting', 'Services', 'Company'],
      tone: 'established and trustworthy'
    },
    creative: {
      suffixes: ['Studio', 'Labs', 'Craft', 'Forge', 'Space', 'House', 'Collective', 'Workshop', 'Factory', 'Academy'],
      tone: 'innovative and artistic'
    },
    classic: {
      suffixes: ['Group', 'Corp', 'Inc', 'Company', 'Enterprises', 'Industries', 'Holdings', 'Ventures', 'Partners', 'Associates'],
      tone: 'timeless and authoritative'
    }
  };
  
  const industry = industryPatterns[formData.industry] || industryPatterns.tech;
  const style = styleModifiers[formData.style] || styleModifiers.modern;
  
  const names = [];
  let nameId = 1;
  
  // Generate keyword-based names
  formData.keywords.forEach(keyword => {
    const cleanKeyword = keyword.trim().replace(/[^a-zA-Z]/g, '');
    if (cleanKeyword) {
      // Keyword + Style Suffix
      style.suffixes.slice(0, 3).forEach(suffix => {
        const name = cleanKeyword + suffix;
        names.push(createNameEntry(nameId++, name, formData, 'keyword-based'));
      });
      
      // Industry Prefix + Keyword
      industry.prefixes.slice(0, 2).forEach(prefix => {
        const name = prefix + cleanKeyword;
        names.push(createNameEntry(nameId++, name, formData, 'prefix-keyword'));
      });
    }
  });
  
  // Generate industry + style combinations
  for (let i = 0; i < Math.min(5, industry.prefixes.length); i++) {
    for (let j = 0; j < Math.min(3, style.suffixes.length); j++) {
      const name = industry.prefixes[i] + style.suffixes[j];
      names.push(createNameEntry(nameId++, name, formData, 'industry-style'));
    }
  }
  
  // Generate premium single-word options
  const premiumWords = ['Zenith', 'Apex', 'Pinnacle', 'Summit', 'Peak', 'Prime', 'Elite', 'Stellar', 'Nexus', 'Vortex', 'Quantum', 'Fusion', 'Axiom', 'Paradigm', 'Catalyst'];
  premiumWords.slice(0, 5).forEach(word => {
    names.push(createNameEntry(nameId++, word, formData, 'premium', true));
  });
  
  // Shuffle and return top results
  return names.sort(() => Math.random() - 0.5).slice(0, 50);
};

const createNameEntry = (id, name, formData, type, isPremium = false) => {
  const baseScore = 7 + Math.random() * 2.5;
  const premiumBonus = isPremium ? 0.5 : 0;
  const lengthPenalty = name.length > 12 ? -0.5 : name.length < 6 ? 0.3 : 0;
  
  const brandabilityScore = Math.min(10, Math.max(1, baseScore + premiumBonus + lengthPenalty));
  const isAvailable = Math.random() > 0.4;
  const isPremiumDomain = Math.random() > 0.8;
  
  // Generate description based on name and industry
  const explanations = {
    'keyword-based': `Incorporates your key term "${formData.keywords[0]}" with ${formData.style} styling, creating direct relevance to your ${formData.industry} business.`,
    'prefix-keyword': `Combines industry-specific terminology with your target keyword, establishing clear positioning in the ${formData.industry} space.`,
    'industry-style': `Perfect blend of ${formData.industry} industry signals with ${formData.style} aesthetic, appealing to your target market.`,
    'premium': `Single-word premium name suggesting excellence and authority. Ideal for building a memorable ${formData.industry} brand.`
  };
  
  return {
    id,
    name,
    brandabilityScore: Math.round(brandabilityScore * 10) / 10,
    domainAvailable: isAvailable,
    domainPrice: isAvailable ? (isPremiumDomain ? Math.floor(Math.random() * 500) + 100 : Math.floor(Math.random() * 50) + 12) : null,
    trademarkRisk: ['low', 'low', 'medium', 'high'][Math.floor(Math.random() * 4)],
    explanation: explanations[type] || `Thoughtfully crafted name for your ${formData.industry} startup with ${formData.style} appeal.`,
    psychology: `Appeals to ${formData.targetAudience || 'your target audience'} through ${formData.style} positioning and ${formData.industry} industry associations.`,
    seoScore: Math.round((6 + Math.random() * 3.5) * 10) / 10,
    memorability: Math.round((7 + Math.random() * 2.5) * 10) / 10,
    pronunciation: name.length <= 8 ? 'Easy' : name.length <= 12 ? 'Moderate' : 'Complex',
    extensions: {
      com: Math.random() > 0.3,
      io: Math.random() > 0.5,
      ai: Math.random() > 0.7,
      org: Math.random() > 0.4
    },
    premium: isPremium,
    industry: formData.industry,
    style: formData.style,
    competitors: generateCompetitors(name, formData.industry),
    socialHandles: {
      twitter: Math.random() > 0.6,
      instagram: Math.random() > 0.5,
      linkedin: Math.random() > 0.4
    },
    lengthScore: Math.max(1, Math.min(10, 11 - (name.length / 2))),
    internationalFriendly: !name.match(/[^a-zA-Z]/) && name.length <= 10,
    logoability: Math.round((7 + Math.random() * 2.5) * 10) / 10
  };
};

const generateCompetitors = (name, industry) => {
  const competitors = {
    tech: ['TechFlow', 'DataCore', 'CloudSync', 'DevHub', 'CodeLab'],
    fintech: ['PayCore', 'CoinBase', 'TradeTech', 'FinanceFlow', 'CryptoHub'],
    health: ['HealthTech', 'MedCore', 'WellnessHub', 'CareFlow', 'VitalTech'],
    ecommerce: ['ShopTech', 'RetailHub', 'CommerceFlow', 'MarketCore', 'SalesTech']
  };
  
  const industryCompetitors = competitors[industry] || competitors.tech;
  return industryCompetitors.slice(0, 3);
};

const NameResults = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all'); // all, available, premium
  const [sortBy, setSortBy] = useState('score'); // score, alphabetical, availability
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('free'); // 'free' or 'premium'

  useEffect(() => {
    // Get form data from location state
    const formData = location.state?.formData;
    
    if (!formData) {
      console.error('No form data found, redirecting to naming tool');
      navigate('/naming-tool');
      return;
    }
    
    // Simulate API loading with realistic delay
    const timer = setTimeout(() => {
      const generatedNames = generateNamesForInput(formData);
      setResults(generatedNames);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  // Enhanced filtering logic
  const filteredResults = results.filter(name => {
    if (filter === 'available') return name.domainAvailable;
    if (filter === 'premium') return name.premium;
    if (filter === 'favorites') return favorites.includes(name.id);
    if (filter === 'high-score') return name.brandabilityScore >= 9.0;
    return true;
  });

  // Enhanced sorting logic
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'score') return b.brandabilityScore - a.brandabilityScore;
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    if (sortBy === 'availability') return (b.domainAvailable ? 1 : 0) - (a.domainAvailable ? 1 : 0);
    if (sortBy === 'price') return (a.domainPrice || 999) - (b.domainPrice || 999);
    return 0;
  });

  // Show only first 10 results in free mode
  const displayResults = viewMode === 'free' 
    ? sortedResults.slice(0, 10) 
    : sortedResults;

  const toggleFavorite = (nameId) => {
    setFavorites(prev => 
      prev.includes(nameId) 
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600 bg-green-50';
    if (score >= 8) return 'text-blue-600 bg-blue-50';
    if (score >= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-sky-500 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Finalizing Your Names</h2>
          <p className="text-slate-600">Adding the finishing touches to your perfect startup names...</p>
          <div className="mt-4 max-w-md mx-auto bg-white/60 backdrop-blur-sm rounded-full p-2">
            <motion.div 
              className="bg-gradient-to-r from-sky-500 to-amber-400 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50">
      {/* Enhanced Header */}
      <div className="px-6 py-6 bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
            
            <div className="hidden md:block text-slate-400">|</div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-amber-300 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-amber-600 bg-clip-text text-transparent">
                  Your Startup Names
                </span>
                <div className="text-sm text-slate-500">
                  {displayResults.length} names • {location.state?.formData?.industry || 'Technology'} • {location.state?.formData?.style || 'Modern'}
                  {location.state?.formData?.keywords?.length > 0 && (
                    <span> • Keywords: {location.state.formData.keywords.slice(0, 2).join(', ')}{location.state.formData.keywords.length > 2 && '...'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-slate-600 hover:text-slate-800 transition-colors shadow-sm hover:shadow-md">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-amber-400 text-white rounded-xl hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Summary */}
      {location.state?.formData && (
        <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-sm font-medium text-slate-600">Industry:</span>
                  <span className="ml-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-semibold capitalize">
                    {location.state.formData.industry}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Style:</span>
                  <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold capitalize">
                    {location.state.formData.style}
                  </span>
                </div>
                {location.state.formData.keywords?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-slate-600">Keywords:</span>
                    <div className="inline-flex ml-2 space-x-1">
                      {location.state.formData.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                      {location.state.formData.keywords.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                          +{location.state.formData.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate('/naming-tool')}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Edit Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Results Summary */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20"
          >
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-slate-800 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {results.length}
                </motion.div>
                <div className="text-slate-600">Names Generated</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-green-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {results.filter(r => r.domainAvailable).length}
                </motion.div>
                <div className="text-slate-600">Domains Available</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-blue-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {results.filter(r => r.brandabilityScore >= 9.0).length}
                </motion.div>
                <div className="text-slate-600">Premium Quality</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-purple-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {results.filter(r => r.premium).length}
                </motion.div>
                <div className="text-slate-600">Premium Names</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-amber-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {favorites.length}
                </motion.div>
                <div className="text-slate-600">Your Favorites</div>
              </div>
            </div>
          </motion.div>

          {/* Freemium Banner */}
          {viewMode === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 mb-8 border border-purple-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Free Preview: 10 of 50+ Names</h3>
                  <p className="text-slate-600">Unlock all names + advanced analysis + trademark screening</p>
                </div>
                <button
                  onClick={() => setShowPaywall(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade Now</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Enhanced Filters and Sorting */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600 font-medium">Filter:</span>
                </div>
                <div className="flex space-x-2 flex-wrap">
                  {[
                    { id: 'all', label: 'All Names', count: results.length },
                    { id: 'available', label: 'Available Domains', count: results.filter(r => r.domainAvailable).length },
                    { id: 'premium', label: 'Premium Names', count: results.filter(r => r.premium).length },
                    { id: 'favorites', label: 'Favorites', count: favorites.length },
                    { id: 'high-score', label: '9+ Score', count: results.filter(r => r.brandabilityScore >= 9.0).length }
                  ].map(filterOption => (
                    <button
                      key={filterOption.id}
                      onClick={() => setFilter(filterOption.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        filter === filterOption.id
                          ? 'bg-gradient-to-r from-sky-500 to-amber-400 text-white shadow-md'
                          : 'bg-white/60 text-slate-600 hover:bg-white/80 border border-slate-200'
                      }`}
                    >
                      {filterOption.label} ({filterOption.count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600 font-medium">Sort by:</span>
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 text-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                >
                  <option value="score">Brandability Score</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="availability">Domain Availability</option>
                  <option value="price">Domain Price</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Results Grid */}
          <div className="grid gap-6">
            <AnimatePresence>
              {displayResults.map((name, index) => (
                <motion.div
                  key={name.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20 hover:border-sky-200"
                >
                  <div className="p-8">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-3xl font-bold text-slate-800">{name.name}</h3>
                          {name.premium && (
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                              <Crown className="w-4 h-4" />
                              <span>Premium</span>
                            </div>
                          )}
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(name.trademarkRisk)}`}>
                            {name.trademarkRisk.toUpperCase()} RISK
                          </div>
                        </div>
                        
                        <p className="text-slate-600 text-lg mb-4 leading-relaxed">{name.explanation}</p>
                        <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-4">
                          <h5 className="font-semibold text-slate-800 mb-2 flex items-center">
                            <Brain className="w-4 h-4 mr-2 text-sky-600" />
                            Psychology Insights
                          </h5>
                          <p className="text-slate-600 text-sm italic">{name.psychology}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-6">
                        <button
                          onClick={() => toggleFavorite(name.id)}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            favorites.includes(name.id)
                              ? 'bg-red-100 text-red-600 hover:bg-red-200 scale-110'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(name.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Metrics Grid */}
                    <div className="grid md:grid-cols-5 gap-4 mb-6">
                      <div className={`text-center p-4 rounded-xl ${getScoreColor(name.brandabilityScore)} border`}>
                        <div className="text-2xl font-bold mb-1">
                          {name.brandabilityScore}/10
                        </div>
                        <div className="text-xs font-medium">Brandability</div>
                      </div>
                      
                      <div className={`text-center p-4 rounded-xl ${getScoreColor(name.seoScore)} border`}>
                        <div className="text-2xl font-bold mb-1">
                          {name.seoScore}/10
                        </div>
                        <div className="text-xs font-medium">SEO Score</div>
                      </div>
                      
                      <div className={`text-center p-4 rounded-xl ${getScoreColor(name.memorability)} border`}>
                        <div className="text-2xl font-bold mb-1">
                          {name.memorability}/10
                        </div>
                        <div className="text-xs font-medium">Memorability</div>
                      </div>

                      <div className={`text-center p-4 rounded-xl ${getScoreColor(name.logoability)} border`}>
                        <div className="text-2xl font-bold mb-1">
                          {name.logoability}/10
                        </div>
                        <div className="text-xs font-medium">Logo Potential</div>
                      </div>

                      <div className={`text-center p-4 rounded-xl ${getScoreColor(name.lengthScore)} border`}>
                        <div className="text-2xl font-bold mb-1">
                          {name.lengthScore}/10
                        </div>
                        <div className="text-xs font-medium">Name Length</div>
                      </div>
                    </div>

                    {/* Enhanced Domain Section */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Domain & Social Media Availability
                      </h4>
                      
                      {/* Domain Extensions */}
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        {Object.entries(name.extensions).map(([ext, available]) => (
                          <div key={ext} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                            <span className="font-medium text-slate-700">.{ext}</span>
                            {available ? (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 text-sm font-semibold">Available</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-red-600 text-sm font-semibold">Taken</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Social Media Handles */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        {Object.entries(name.socialHandles).map(([platform, available]) => (
                          <div key={platform} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                            <span className="font-medium text-slate-700 capitalize">{platform}</span>
                            {available ? (
                              <span className="text-green-600 text-sm font-semibold">@{name.name.toLowerCase()}</span>
                            ) : (
                              <span className="text-red-600 text-sm font-semibold">Taken</span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Primary Domain Pricing */}
                      {name.domainAvailable && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-green-800 text-lg">{name.name.toLowerCase()}.com</div>
                              <div className="text-green-600 text-sm">Available for registration</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-800 text-xl">${name.domainPrice}/year</div>
                              <div className="text-green-600 text-sm">
                                Check GoDaddy • Namecheap • Google
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Competitive Analysis */}
                    {name.competitors && name.competitors.length > 0 && (
                      <div className="bg-amber-50 rounded-xl p-6 mb-6 border border-amber-200">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-amber-600" />
                          Competitive Landscape
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {name.competitors.map((competitor, idx) => (
                            <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                              {competitor}
                            </span>
                          ))}
                        </div>
                        <p className="text-amber-700 text-sm mt-2">
                          These similar names exist in the market. {name.name} offers unique positioning opportunities.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => copyToClipboard(name.name)}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setSelectedName(name);
                            setShowDetailModal(true);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Details</span>
                        </button>

                        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                          <TrendingUp className="w-4 h-4" />
                          <span>Analyze</span>
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-white border-2 border-sky-500 text-sky-600 px-6 py-3 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-300">
                          Save for Later
                        </button>
                        <button
                          onClick={() => setSelectedName(name)}
                          className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-8 py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-amber-500 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                          <Zap className="w-4 h-4" />
                          <span>Choose This Name</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results State */}
          {displayResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-600 mb-4">No names match your filters</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Try adjusting your filters to see more results, or generate additional names with different parameters.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/naming-tool')}
                  className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-8 py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-amber-500 transition-all duration-300"
                >
                  Generate More Names
                </button>
              </div>
            </motion.div>
          )}

          {/* Enhanced Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-sky-500/10 to-amber-400/10 rounded-2xl p-8 mt-12 text-center border border-white/20"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Need More Options?</h3>
              <p className="text-slate-600 mb-8 text-lg">
                Generate additional names with different keywords, industries, or styles to find your perfect match.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                  Refine Search
                </button>
                <button
                  onClick={() => navigate('/naming-tool')}
                  className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-8 py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Generate More Names
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedName && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">
                  Detailed Analysis: {selectedName.name}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              {/* Detailed content would go here */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">Complete Brand Analysis</h3>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <p className="text-slate-600 mb-4">{selectedName.explanation}</p>
                    <p className="text-slate-600 italic">{selectedName.psychology}</p>
                  </div>
                </div>
                
                {/* Additional detailed sections could be added here */}
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="bg-gradient-to-r from-sky-500 to-amber-400 text-white px-8 py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-amber-500 transition-all duration-300">
                    Choose This Name
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
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
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Unlock All Names</h3>
              <p className="text-slate-600">Get the complete naming package with advanced analysis</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { name: 'Starter', price: '$19', names: '25 names' },
                { name: 'Pro', price: '$39', names: '75 names', popular: true },
                { name: 'Enterprise', price: '$79', names: '150 names' }
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    plan.popular 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-slate-800">{plan.name}</div>
                    <div className="text-2xl font-bold text-slate-800 my-2">{plan.price}</div>
                    <div className="text-slate-600 text-sm">{plan.names}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPaywall(false)}
                className="flex-1 py-3 px-6 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setViewMode('premium');
                  setShowPaywall(false);
                }}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NameResults;