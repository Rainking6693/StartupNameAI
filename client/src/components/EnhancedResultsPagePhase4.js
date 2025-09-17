import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star,
  Heart,
  Download,
  Share2,
  ArrowLeft,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  Target,
  TrendingUp,
  ExternalLink,
  Clock,
  AlertCircle,
  Loader,
  Copy,
  FileText,
  Crown,
  Lock,
  Award,
  Filter,
  Grid,
  List,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import apiServicePhase3 from '../services/apiPhase3';

const EnhancedResultsPagePhase4 = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [domainResults, setDomainResults] = useState(null);
  const [isCheckingDomains, setIsCheckingDomains] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFreemiumModal, setShowFreemiumModal] = useState(false);
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const [copiedName, setCopiedName] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Freemium state
  const [freeNamesShown, setFreeNamesShown] = useState(10);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      console.log('ð Loading Phase 4 enhanced session data:', sessionId);
      
      // Try backend first, then localStorage fallback
      const response = await apiServicePhase3.getSessionWithFallback(sessionId);
      
      if (response.success) {
        setSessionData(response.data);
        console.log('â Loaded enhanced session data:', response.data);
        
        // Check if user has premium access
        if (response.data.packageConfig || response.data.isPremium) {
          setIsPremium(true);
          setFreeNamesShown(response.data.results?.length || 50);
        }
      } else {
        setError('Session not found. Please generate names again.');
      }
    } catch (error) {
      console.error('â Failed to load session data:', error);
      setError('Failed to load results. Please try again.');
    }
  };

  const handleFavorite = (nameData) => {
    const nameId = nameData.name;
    setFavorites(prev => 
      prev.includes(nameId) 
        ? prev.filter(f => f !== nameId)
        : [...prev, nameId]
    );
  };

  const handleCopyName = async (name) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    } catch (error) {
      console.error('Failed to copy name:', error);
    }
  };

  const handleViewMore = () => {
    if (isPremium) {
      // Show all names for premium users
      setFreeNamesShown(sessionData.results.length);
    } else {
      // Show freemium modal for free users
      setShowFreemiumModal(true);
    }
  };

  const handleUpgrade = () => {
    setShowFreemiumModal(false);
    setShowPackageSelection(true);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportFormat(format);
    
    try {
      console.log(`ð Exporting results as ${format}...`);
      
      const exportData = {
        sessionId,
        names: getSortedAndFilteredNames(),
        formData: sessionData.formData,
        format,
        timestamp: new Date().toISOString()
      };
      
      // In a real implementation, this would call the backend export API
      // For now, we'll simulate the export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('â Export completed:', format);
      
      // Trigger download (simulated)
      const filename = `startup-names-${sessionId}.${format}`;
      console.log(`ð¥ Download triggered: ${filename}`);
      
    } catch (error) {
      console.error('â Export failed:', error);
      setError(`Failed to export as ${format}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const getSortedAndFilteredNames = () => {
    if (!sessionData?.results) return [];
    
    let filtered = sessionData.results;
    
    // Apply filters
    if (filterBy === 'favorites') {
      filtered = filtered.filter(name => favorites.includes(name.name));
    } else if (filterBy === 'high-score') {
      filtered = filtered.filter(name => name.score >= 8.0);
    } else if (filterBy === 'premium') {
      filtered = filtered.filter(name => name.score >= 8.5);
    }
    
    // Apply freemium limit
    if (!isPremium && filterBy !== 'favorites') {
      filtered = filtered.slice(0, freeNamesShown);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'memorability':
          return b.memorability - a.memorability;
        case 'uniqueness':
          return b.uniqueness - a.uniqueness;
        case 'brandability':
          return b.brandability - a.brandability;
        default:
          return 0;
      }
    });
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 8) return 'text-blue-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Very Good';
    if (score >= 7) return 'Good';
    return 'Fair';
  };

  const getScoreBadge = (score) => {
    if (score >= 9) return { icon: Crown, label: 'Premium', color: 'bg-yellow-500/20 text-yellow-300' };
    if (score >= 8) return { icon: Award, label: 'Excellent', color: 'bg-blue-500/20 text-blue-300' };
    if (score >= 7) return { icon: ThumbsUp, label: 'Good', color: 'bg-green-500/20 text-green-300' };
    return { icon: Eye, label: 'Fair', color: 'bg-gray-500/20 text-gray-300' };
  };

  if (error && !sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => navigate('/naming-tool')}
            className="bg-gradient-to-r from-white to-purple-200 text-purple-900 px-6 py-3 rounded-xl font-semibold hover:from-purple-100 hover:to-purple-300 transition-all duration-300"
          >
            Generate New Names
          </button>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading your results...</p>
        </div>
      </div>
    );
  }

  const sortedNames = getSortedAndFilteredNames();
  const totalNames = sessionData.results?.length || 0;
  const hasMoreNames = !isPremium && totalNames > freeNamesShown;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Enhanced Header */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              {isPremium && (
                <div className="text-yellow-300 text-sm font-semibold">Premium Results</div>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/naming-tool')}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Generate New Names</span>
          </button>
        </div>
      </div>

      {/* Enhanced Results Header */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Your AI-Generated Names
            </h1>
            <p className="text-xl text-white/80 mb-4">
              {totalNames} intelligent names created for your {sessionData.formData?.industry} startup
            </p>
            
            {!isPremium && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-yellow-300">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Showing {freeNamesShown} of {totalNames} names</span>
                </div>
                <p className="text-yellow-200/80 text-sm mt-2">
                  Upgrade to see all {totalNames} names with advanced features
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Filters and Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-400/50"
              >
                <option value="score">Sort by Overall Score</option>
                <option value="name">Sort by Name</option>
                <option value="memorability">Sort by Memorability</option>
                <option value="uniqueness">Sort by Uniqueness</option>
                <option value="brandability">Sort by Brandability</option>
              </select>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-400/50"
              >
                <option value="all">All Names</option>
                <option value="high-score">High Score (8.0+)</option>
                <option value="premium">Premium Quality (8.5+)</option>
                <option value="favorites">Favorites ({favorites.length})</option>
              </select>
              
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/10 rounded-lg">
                <button 
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/20 transition-colors rounded-l-lg disabled:opacity-50"
                >
                  {isExporting && exportFormat === 'pdf' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>PDF</span>
                </button>
                <button 
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/20 transition-colors rounded-r-lg disabled:opacity-50"
                >
                  {isExporting && exportFormat === 'csv' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>CSV</span>
                </button>
              </div>
              
              <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 mb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-200"
              >
                Ã
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Enhanced Names Display */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedNames.map((nameData, index) => (
                <NameCard 
                  key={index}
                  nameData={nameData}
                  index={index}
                  favorites={favorites}
                  onFavorite={handleFavorite}
                  onCopy={handleCopyName}
                  copiedName={copiedName}
                  getScoreColor={getScoreColor}
                  getScoreLabel={getScoreLabel}
                  getScoreBadge={getScoreBadge}
                  isPremium={isPremium}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedNames.map((nameData, index) => (
                <NameListItem 
                  key={index}
                  nameData={nameData}
                  index={index}
                  favorites={favorites}
                  onFavorite={handleFavorite}
                  onCopy={handleCopyName}
                  copiedName={copiedName}
                  getScoreColor={getScoreColor}
                  getScoreLabel={getScoreLabel}
                  getScoreBadge={getScoreBadge}
                  isPremium={isPremium}
                />
              ))}
            </div>
          )}
          
          {/* View More Button */}
          {hasMoreNames && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewMore}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5" />
                  <span>Unlock {totalNames - freeNamesShown} More Premium Names</span>
                  <Star className="w-5 h-5" />
                </div>
              </motion.button>
              <p className="text-white/60 text-sm mt-3">
                See all {totalNames} AI-generated names with advanced scoring
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Freemium Modal */}
      <FreemiumModal 
        show={showFreemiumModal}
        onClose={() => setShowFreemiumModal(false)}
        onUpgrade={handleUpgrade}
        totalNames={totalNames}
        freeNamesShown={freeNamesShown}
      />

      {/* Package Selection Modal */}
      <PackageSelectionModal 
        show={showPackageSelection}
        onClose={() => setShowPackageSelection(false)}
        sessionData={sessionData}
      />
    </div>
  );
};

// Enhanced Name Card Component
const NameCard = ({ nameData, index, favorites, onFavorite, onCopy, copiedName, getScoreColor, getScoreLabel, getScoreBadge, isPremium }) => {
  const badge = getScoreBadge(nameData.score);
  const BadgeIcon = badge.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
    >
      {/* Name Header with Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{nameData.name}</h3>
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
            <BadgeIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onCopy(nameData.name)}
            className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            {copiedName === nameData.name ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onFavorite(nameData)}
            className={`p-2 rounded-lg transition-colors ${
              favorites.includes(nameData.name)
                ? 'bg-red-500/20 text-red-400'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.includes(nameData.name) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Enhanced Overall Score */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/80">Overall Score:</span>
        <div className="flex items-center space-x-2">
          <span className={`text-3xl font-bold ${getScoreColor(nameData.score)}`}>
            {nameData.score}
          </span>
          <span className={`text-sm ${getScoreColor(nameData.score)}`}>
            {getScoreLabel(nameData.score)}
          </span>
        </div>
      </div>

      {/* Enhanced Detailed Scores */}
      <div className="space-y-3 mb-4">
        {[
          { label: 'Memorability', value: nameData.memorability, icon: Star },
          { label: 'Pronunciation', value: nameData.pronunciation, icon: Target },
          { label: 'Uniqueness', value: nameData.uniqueness, icon: Zap },
          { label: 'Brandability', value: nameData.brandability, icon: TrendingUp }
        ].map((metric, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <metric.icon className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">{metric.label}:</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(metric.value).replace('text-', 'bg-')}`}
                  style={{width: `${metric.value * 10}%`}}
                ></div>
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(metric.value)} min-w-[2rem]`}>
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm mb-4">{nameData.description}</p>
      
      {/* Reasoning */}
      <p className="text-white/60 text-xs mb-6 italic">{nameData.reasoning}</p>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
          <Globe className="w-4 h-4" />
          <span>Check Domains</span>
        </button>
        
        {isPremium && (
          <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            <Shield className="w-4 h-4" />
            <span>Reserve Domain</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced Name List Item Component
const NameListItem = ({ nameData, index, favorites, onFavorite, onCopy, copiedName, getScoreColor, getScoreLabel, getScoreBadge, isPremium }) => {
  const badge = getScoreBadge(nameData.score);
  const BadgeIcon = badge.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 flex-1">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-white">{nameData.name}</h3>
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                <BadgeIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </div>
            </div>
            <p className="text-white/70 text-sm">{nameData.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(nameData.score)}`}>
                {nameData.score}
              </div>
              <div className="text-white/60 text-xs">Overall</div>
            </div>
            
            <div className="flex space-x-3">
              {[
                { label: 'Mem', value: nameData.memorability },
                { label: 'Pro', value: nameData.pronunciation },
                { label: 'Uniq', value: nameData.uniqueness },
                { label: 'Brand', value: nameData.brandability }
              ].map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-sm font-semibold ${getScoreColor(metric.value)}`}>
                    {metric.value}
                  </div>
                  <div className="text-white/60 text-xs">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-6">
          <button
            onClick={() => onCopy(nameData.name)}
            className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            {copiedName === nameData.name ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onFavorite(nameData)}
            className={`p-2 rounded-lg transition-colors ${
              favorites.includes(nameData.name)
                ? 'bg-red-500/20 text-red-400'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.includes(nameData.name) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Freemium Modal Component
const FreemiumModal = ({ show, onClose, onUpgrade, totalNames, freeNamesShown }) => {
  if (!show) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Unlock All Premium Names</h3>
            <p className="text-white/80 mb-6">
              You've seen {freeNamesShown} of {totalNames} AI-generated names. Upgrade to access all premium names with advanced features.
            </p>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-white mb-3">Premium Features:</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>All {totalNames} premium quality names</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Advanced brandability analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Domain checking & reservation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>PDF & CSV export</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
              >
                Upgrade Now - $2.99
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Package Selection Modal Component
const PackageSelectionModal = ({ show, onClose, sessionData }) => {
  if (!show) return null;
  
  const packages = {
    basic: {
      name: 'Basic',
      price: 2.99,
      features: ['All generated names', 'Basic export', 'Domain suggestions']
    },
    premium: {
      name: 'Premium', 
      price: 9.99,
      features: ['All generated names', 'Advanced analysis', 'Domain checking', 'PDF export', 'Priority support']
    },
    enterprise: {
      name: 'Enterprise',
      price: 29.99, 
      features: ['All features', 'Custom branding', 'API access', 'Dedicated support']
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full border border-white/20 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Choose Your Package</h3>
            <p className="text-white/80">Unlock the full potential of your startup names</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(packages).map(([key, pkg]) => (
              <div key={key} className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-2">{pkg.name}</h4>
                <div className="text-3xl font-bold text-white mb-4">${pkg.price}</div>
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                  Select {pkg.name}
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedResultsPagePhase4;