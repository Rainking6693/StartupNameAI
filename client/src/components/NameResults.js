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

  // Enhanced mock data with comprehensive analysis
  const mockResults = [
    {
      id: 1,
      name: 'StreamFlow',
      brandabilityScore: 9.2,
      domainAvailable: true,
      domainPrice: 12.99,
      trademarkRisk: 'low',
      explanation: 'Combines movement and technology, suggesting smooth data processing and continuous innovation. The word "flow" creates positive associations with seamless user experiences.',
      psychology: 'Flow states trigger productivity associations. "Stream" suggests modernity while "Flow" implies ease of use, reducing customer friction anxiety.',
      seoScore: 8.5,
      memorability: 9.1,
      pronunciation: 'Easy',
      extensions: { com: true, io: true, ai: false, org: true },
      premium: false,
      industry: 'Technology',
      style: 'Modern',
      competitors: ['DataFlow', 'StreamTech', 'FlowCore'],
      socialHandles: { twitter: true, instagram: false, linkedin: true },
      lengthScore: 9.0,
      internationalFriendly: true,
      logoability: 8.8
    },
    {
      id: 2,
      name: 'DataVault',
      brandabilityScore: 8.8,
      domainAvailable: true,
      domainPrice: 15.99,
      trademarkRisk: 'low',
      explanation: 'Security-focused name that builds immediate trust while emphasizing data protection capabilities. Perfect for B2B enterprises concerned about data security.',
      psychology: 'Vault implies Fort Knox-level security and value storage, directly addressing customer anxiety about data breaches and privacy concerns.',
      seoScore: 8.2,
      memorability: 8.7,
      pronunciation: 'Easy',
      extensions: { com: true, io: false, ai: true, org: true },
      premium: false,
      industry: 'Technology',
      style: 'Professional',
      competitors: ['SecureData', 'VaultTech', 'DataGuard'],
      socialHandles: { twitter: false, instagram: true, linkedin: true },
      lengthScore: 8.5,
      internationalFriendly: true,
      logoability: 8.9
    },
    {
      id: 3,
      name: 'Nexus',
      brandabilityScore: 9.5,
      domainAvailable: false,
      domainPrice: null,
      trademarkRisk: 'medium',
      explanation: 'Premium single-word name suggesting connection and centrality in business ecosystems. Commands authority and implies being the hub of important networks.',
      psychology: 'Latin roots create intellectual authority. Suggests being the center of important connections, appealing to power and influence motivations.',
      seoScore: 9.2,
      memorability: 9.8,
      pronunciation: 'Easy',
      extensions: { com: false, io: true, ai: true, org: false },
      premium: true,
      industry: 'Technology',
      style: 'Classic',
      competitors: ['Hub', 'Connect', 'Central'],
      socialHandles: { twitter: false, instagram: false, linkedin: false },
      lengthScore: 10.0,
      internationalFriendly: true,
      logoability: 9.5
    },
    {
      id: 4,
      name: 'CloudSync',
      brandabilityScore: 7.9,
      domainAvailable: false,
      domainPrice: null,
      trademarkRisk: 'high',
      explanation: 'Descriptive name clearly communicating cloud synchronization services. Instantly understood by technical audiences.',
      psychology: 'Familiar terms reduce cognitive load and learning curve. Immediately understood by target B2B audience, reducing sales friction.',
      seoScore: 7.5,
      memorability: 7.2,
      pronunciation: 'Easy',
      extensions: { com: false, io: false, ai: false, org: true },
      premium: false,
      industry: 'Technology',
      style: 'Modern',
      competitors: ['CloudFlow', 'SyncTech', 'CloudBridge'],
      socialHandles: { twitter: false, instagram: true, linkedin: false },
      lengthScore: 7.8,
      internationalFriendly: false,
      logoability: 6.5
    },
    {
      id: 5,
      name: 'Zenith',
      brandabilityScore: 9.7,
      domainAvailable: true,
      domainPrice: 189.99,
      trademarkRisk: 'low',
      explanation: 'Premium name suggesting peak performance and highest achievement. Single-word names like this are extremely valuable for building iconic brands.',
      psychology: 'Peak/summit associations trigger achievement motivation and aspiration. Appeals to success-driven entrepreneurs and ambitious customers.',
      seoScore: 9.0,
      memorability: 9.9,
      pronunciation: 'Easy',
      extensions: { com: true, io: true, ai: true, org: true },
      premium: true,
      industry: 'Technology',
      style: 'Classic',
      competitors: ['Peak', 'Summit', 'Apex'],
      socialHandles: { twitter: true, instagram: true, linkedin: true },
      lengthScore: 10.0,
      internationalFriendly: true,
      logoability: 9.8
    },
    {
      id: 6,
      name: 'InnovateLab',
      brandabilityScore: 8.4,
      domainAvailable: true,
      domainPrice: 24.99,
      trademarkRisk: 'medium',
      explanation: 'Innovation-focused name that appeals to forward-thinking companies. "Lab" suggests experimentation and cutting-edge development.',
      psychology: 'Innovation triggers progress associations while Lab implies scientific rigor and breakthrough discoveries.',
      seoScore: 7.8,
      memorability: 8.2,
      pronunciation: 'Easy',
      extensions: { com: true, io: true, ai: false, org: true },
      premium: false,
      industry: 'Technology',
      style: 'Modern',
      competitors: ['TechLab', 'InnovateNow', 'LabTech'],
      socialHandles: { twitter: true, instagram: false, linkedin: true },
      lengthScore: 7.2,
      internationalFriendly: false,
      logoability: 8.1
    }
  ];

  useEffect(() => {
    // Simulate API loading with realistic delay
    const timer = setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
                <div className="text-sm text-slate-500">{sortedResults.length} names • Technology • Modern</div>
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
              {sortedResults.map((name, index) => (
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
                              <div className="text-green-600 text-sm">Ready to purchase • International friendly: {name.internationalFriendly ? 'Yes' : 'No'}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-800 text-xl">${name.domainPrice}/year</div>
                              <button className="text-green-600 text-sm hover:text-green-800 transition-colors flex items-center space-x-1 mt-1">
                                <span>Buy now</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
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
          {sortedResults.length === 0 && (
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
    </div>
  );
};

export default NameResults;