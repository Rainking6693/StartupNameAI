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
  Crown,
  Lock,
  Award,
  Package,
  CreditCard
} from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DomainService from '../utils/domainService';
import paymentServicePhase4 from '../services/paymentServicePhase4';

const ResultsPagePhase4 = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [domainResults, setDomainResults] = useState(null);
  const [isCheckingDomains, setIsCheckingDomains] = useState(false);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');
  
  // Phase 4 freemium features
  const [showFreemiumModal, setShowFreemiumModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userTier, setUserTier] = useState('free');
  const [freeNamesShown, setFreeNamesShown] = useState(10);
  const [copiedName, setCopiedName] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [packages, setPackages] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('premium');

  const domainService = new DomainService();

  useEffect(() => {
    loadSessionData();
    checkPremiumStatus();
    handlePaymentCallback();
    loadPackages();
  }, [sessionId]);

  const checkPremiumStatus = () => {
    const tier = paymentServicePhase4.getUserTier();
    const isPrem = paymentServicePhase4.isPremiumUser();
    
    setUserTier(tier);
    setIsPremium(isPrem);
    
    if (isPrem) {
      setFreeNamesShown(100); // Show more names for premium users
    }
    
    console.log('👤 User status:', { tier, isPremium: isPrem });
  };

  const handlePaymentCallback = () => {
    const paymentStatus = searchParams.get('payment');
    const packageId = searchParams.get('package');
    
    if (paymentStatus === 'success' && packageId) {
      paymentServicePhase4.handlePaymentSuccess(sessionId, packageId);
      checkPremiumStatus(); // Refresh status
      
      // Clean up URL
      navigate(`/results/${sessionId}`, { replace: true });
    } else if (paymentStatus === 'cancelled') {
      paymentServicePhase4.handlePaymentCancellation(sessionId);
      
      // Clean up URL
      navigate(`/results/${sessionId}`, { replace: true });
    }
  };

  const loadPackages = async () => {
    try {
      const result = await paymentServicePhase4.getPackages();
      if (result.success) {
        setPackages(result.data.packages);
      }
    } catch (error) {
      console.error('Failed to load packages:', error);
    }
  };

  const loadSessionData = () => {
    try {
      const data = localStorage.getItem(`naming_session_${sessionId}`);
      if (data) {
        const parsed = JSON.parse(data);
        setSessionData(parsed);
        console.log('✅ Loaded session data:', parsed);
      } else {
        setError('Session not found. Please generate names again.');
      }
    } catch (error) {
      console.error('❌ Failed to load session data:', error);
      setError('Failed to load results. Please try again.');
    }
  };

  const handleFavorite = (name) => {
    setFavorites(prev => 
      prev.includes(name) 
        ? prev.filter(f => f !== name)
        : [...prev, name]
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

  const handleCheckDomains = async (nameData) => {
    if (!isPremium) {
      setShowFreemiumModal(true);
      return;
    }

    setSelectedName(nameData);
    setIsCheckingDomains(true);
    setError('');
    
    try {
      console.log('🔍 Checking domains for:', nameData.name);
      const results = await domainService.checkDomainAvailability(nameData.name);
      console.log('✅ Domain check results:', results);
      
      if (results.success) {
        setDomainResults(results);
      } else {
        setError(results.error || 'Failed to check domain availability');
      }
    } catch (error) {
      console.error('❌ Domain check failed:', error);
      setError('Failed to check domains. Please try again.');
    } finally {
      setIsCheckingDomains(false);
    }
  };

  const handleReserveDomain = async (domainInfo, userEmail) => {
    setIsReserving(true);
    setError('');
    
    try {
      console.log('🔒 Reserving domain:', domainInfo.domain);
      
      const userInfo = {
        email: userEmail || 'user@example.com',
        name: 'Startup Founder'
      };
      
      const reservation = await domainService.reserveDomain(domainInfo, userInfo);
      console.log('✅ Reservation result:', reservation);
      
      if (reservation.success) {
        setReservationStatus({
          success: true,
          reservationId: reservation.reservationId,
          domain: reservation.domain,
          price: reservation.price,
          paymentUrl: reservation.paymentUrl,
          expiresAt: reservation.expiresAt
        });
      } else {
        setError(reservation.error || 'Failed to reserve domain');
      }
    } catch (error) {
      console.error('❌ Domain reservation failed:', error);
      setError('Failed to reserve domain. Please try again.');
    } finally {
      setIsReserving(false);
    }
  };

  const handleViewMore = () => {
    if (isPremium) {
      setFreeNamesShown(sessionData.results.length);
    } else {
      setShowFreemiumModal(true);
    }
  };

  const handleUpgrade = () => {
    setShowFreemiumModal(false);
    setShowPackageModal(true);
  };

  const handlePackageSelection = async (packageId) => {
    setIsUpgrading(true);
    setSelectedPackage(packageId);
    
    try {
      const customerEmail = prompt('Please enter your email address:');
      if (!customerEmail) {
        setIsUpgrading(false);
        return;
      }

      await paymentServicePhase4.redirectToCheckout(
        sessionId, 
        packageId, 
        customerEmail, 
        'Startup Founder'
      );
    } catch (error) {
      console.error('Upgrade failed:', error);
      setError('Failed to start upgrade process. Please try again.');
      setIsUpgrading(false);
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
    if (score >= 7) return { icon: CheckCircle, label: 'Good', color: 'bg-green-500/20 text-green-300' };
    return { icon: Target, label: 'Fair', color: 'bg-gray-500/20 text-gray-300' };
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
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-300 text-sm font-semibold">{userTier.charAt(0).toUpperCase() + userTier.slice(1)} User</span>
                </div>
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
              {totalNames} intelligent names created for your {sessionData.formData?.industry || 'startup'}
            </p>
            
            {!isPremium && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-yellow-300">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Showing {freeNamesShown} of {totalNames} names</span>
                </div>
                <p className="text-yellow-200/80 text-sm mt-2">
                  Upgrade to unlock all {totalNames} names with premium features
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
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => !isPremium ? setShowFreemiumModal(true) : null}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
                {!isPremium && <Lock className="w-3 h-3" />}
              </button>
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
                ×
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Enhanced Names Grid */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNames.map((nameData, index) => (
              <NameCard 
                key={index}
                nameData={nameData}
                index={index}
                favorites={favorites}
                onFavorite={handleFavorite}
                onCopy={handleCopyName}
                onCheckDomains={handleCheckDomains}
                copiedName={copiedName}
                isCheckingDomains={isCheckingDomains}
                selectedName={selectedName}
                getScoreColor={getScoreColor}
                getScoreLabel={getScoreLabel}
                getScoreBadge={getScoreBadge}
                isPremium={isPremium}
              />
            ))}
          </div>
          
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
                See all {totalNames} AI-generated names with advanced features
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
      <PackageModal 
        show={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        packages={packages}
        onSelectPackage={handlePackageSelection}
        isUpgrading={isUpgrading}
        selectedPackage={selectedPackage}
      />

      {/* Domain Results Modal */}
      <DomainModal 
        show={!!domainResults}
        onClose={() => setDomainResults(null)}
        domainResults={domainResults}
        onReserveDomain={handleReserveDomain}
        isReserving={isReserving}
      />

      {/* Reservation Success Modal */}
      <ReservationModal 
        show={!!reservationStatus}
        onClose={() => setReservationStatus(null)}
        reservationStatus={reservationStatus}
      />
    </div>
  );
};

// Enhanced Name Card Component
const NameCard = ({ 
  nameData, 
  index, 
  favorites, 
  onFavorite, 
  onCopy, 
  onCheckDomains,
  copiedName, 
  isCheckingDomains,
  selectedName,
  getScoreColor, 
  getScoreLabel, 
  getScoreBadge, 
  isPremium 
}) => {
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
            onClick={() => onFavorite(nameData.name)}
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
        <button
          onClick={() => onCheckDomains(nameData)}
          disabled={isCheckingDomains}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50"
        >
          {isCheckingDomains && selectedName?.name === nameData.name ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span>
            {isCheckingDomains && selectedName?.name === nameData.name 
              ? 'Checking...' 
              : 'Check Domains'
            }
          </span>
          {!isPremium && <Lock className="w-3 h-3" />}
        </button>
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
                Choose Package
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
const PackageModal = ({ show, onClose, packages, onSelectPackage, isUpgrading, selectedPackage }) => {
  if (!show || !packages) return null;
  
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
              <div key={key} className={`bg-white/10 rounded-xl p-6 border border-white/20 ${key === 'premium' ? 'ring-2 ring-yellow-400' : ''}`}>
                {key === 'premium' && (
                  <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full inline-block mb-3">
                    MOST POPULAR
                  </div>
                )}
                <h4 className="text-xl font-bold text-white mb-2">{pkg.name}</h4>
                <div className="text-3xl font-bold text-white mb-1">${(pkg.price / 100).toFixed(2)}</div>
                <div className="text-white/60 text-sm mb-4 line-through">${(pkg.originalPrice / 100).toFixed(2)}</div>
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => onSelectPackage(key)}
                  disabled={isUpgrading}
                  className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 ${
                    key === 'premium' 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                  }`}
                >
                  {isUpgrading && selectedPackage === key ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Select {pkg.name}</span>
                    </div>
                  )}
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

// Domain Modal Component
const DomainModal = ({ show, onClose, domainResults, onReserveDomain, isReserving }) => {
  if (!show || !domainResults) return null;
  
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
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Domain Availability for "{domainResults.name}"</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {domainResults.domains.map((domain, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-white">{domain.domain}</span>
                  <div className="flex items-center space-x-2">
                    {domain.available ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Available</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-semibold">Taken</span>
                      </>
                    )}
                  </div>
                </div>
                
                {domain.available && (
                  <div className="flex items-center justify-between">
                    <div className="text-white/80">
                      <span className="text-green-400 font-bold">${domain.price}/year</span>
                      <span className="text-sm text-white/60 ml-2">via {domain.registrar}</span>
                    </div>
                    <button
                      onClick={() => onReserveDomain(domain)}
                      disabled={isReserving}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50"
                    >
                      {isReserving ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                      <span>{isReserving ? 'Reserving...' : 'Reserve'}</span>
                    </button>
                  </div>
                )}
                
                {!domain.available && domain.alternatives && domain.alternatives.length > 0 && (
                  <div className="mt-3">
                    <p className="text-white/60 text-sm mb-2">Alternatives:</p>
                    <div className="flex flex-wrap gap-2">
                      {domain.alternatives.map((alt, altIndex) => (
                        <span key={altIndex} className="bg-white/20 text-white px-2 py-1 rounded text-sm">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {domainResults.recommendations && domainResults.recommendations.length > 0 && (
            <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <h4 className="font-bold text-white mb-3">💡 Recommendations:</h4>
              <div className="space-y-2">
                {domainResults.recommendations.map((rec, index) => (
                  <div key={index} className="text-blue-200 text-sm">
                    <strong>{rec.domain}:</strong> {rec.reason}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Reservation Modal Component
const ReservationModal = ({ show, onClose, reservationStatus }) => {
  if (!show || !reservationStatus) return null;
  
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
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Domain Reserved!</h3>
            <p className="text-white/80 mb-6">
              {reservationStatus.domain} has been reserved for you.
            </p>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Reservation ID:</span>
                  <span className="text-white font-mono">{reservationStatus.reservationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Price:</span>
                  <span className="text-green-400 font-bold">${reservationStatus.price}/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Expires:</span>
                  <span className="text-yellow-400">{new Date(reservationStatus.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.open(reservationStatus.paymentUrl, '_blank')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Complete Payment</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultsPagePhase4;