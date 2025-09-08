import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import NameAnalysisModal from './NameAnalysisModal';
import { 
  ArrowLeft, 
  Download, 
  Heart,
  Share2,
  CheckCircle,
  Star,
  Globe,
  Award,
  TrendingUp,
  Cpu,
  Copy,
  RefreshCw,
  BarChart3
} from 'lucide-react';

const NameResults = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [analysisModal, setAnalysisModal] = useState({ isOpen: false, nameData: null });

  useEffect(() => {
    // Load session data from localStorage
    const storedData = localStorage.getItem(`naming_session_${sessionId}`);
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setSessionData(parsed);
        setResults(parsed.results || []);
        console.log('✅ Loaded session data:', parsed);
      } catch (error) {
        console.error('Failed to parse session data:', error);
        // Generate some demo results if session data is missing
        setResults(generateDemoResults());
        setSessionData({ 
          formData: { industry: 'health', style: 'modern', keywords: ['wellness'] },
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Generate demo results if no session found
      console.log('No session data found, generating demo results');
      setResults(generateDemoResults());
      setSessionData({ 
        formData: { industry: 'health', style: 'modern', keywords: ['wellness'] },
        timestamp: new Date().toISOString()
      });
    }
    
    setLoading(false);
  }, [sessionId]);

  const generateDemoResults = () => {
    return [
      {
        id: 1,
        name: 'WellFlow',
        explanation: 'Combines wellness with smooth, continuous progress - perfect for health tech platforms.',
        brandabilityScore: 8.7,
        domainFriendly: true,
        psychologyTriggers: ['wellness', 'progress', 'ease'],
        source: 'demo'
      },
      {
        id: 2,
        name: 'FitCore',
        explanation: 'Strong, foundational name that emphasizes fitness fundamentals and core health.',
        brandabilityScore: 8.5,
        domainFriendly: true,
        psychologyTriggers: ['strength', 'foundation', 'fitness'],
        source: 'demo'
      },
      {
        id: 3,
        name: 'VitalSync',
        explanation: 'Suggests synchronization of vital health metrics - ideal for health monitoring apps.',
        brandabilityScore: 9.1,
        domainFriendly: true,
        psychologyTriggers: ['vitality', 'precision', 'health'],
        source: 'demo'
      },
      {
        id: 4,
        name: 'HealthHub',
        explanation: 'Central gathering place for all health needs - trustworthy and straightforward.',
        brandabilityScore: 7.8,
        domainFriendly: false,
        psychologyTriggers: ['centrality', 'trust', 'health'],
        source: 'demo'
      },
      {
        id: 5,
        name: 'PureFit',
        explanation: 'Clean, simple name emphasizing pure fitness and wellness without complexity.',
        brandabilityScore: 8.9,
        domainFriendly: true,
        psychologyTriggers: ['purity', 'simplicity', 'fitness'],
        source: 'demo'
      }
    ];
  };

  const toggleFavorite = (nameId) => {
    setFavorites(prev => 
      prev.includes(nameId) 
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleAnalyze = (nameData) => {
    console.log('Opening deep analysis for:', nameData.name);
    setAnalysisModal({ isOpen: true, nameData });
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-500';
    if (score >= 8) return 'text-blue-500';
    if (score >= 7) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreGradient = (score) => {
    if (score >= 9) return 'from-green-500 to-emerald-500';
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
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Cpu className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Names</h2>
          <p className="text-white/80">Preparing your personalized startup names...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <div className="px-6 py-6 bg-black/20 backdrop-blur-sm">
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
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Your Startup Names
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {sessionData && (
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
                  <div className="text-3xl font-bold text-green-400 mb-2">{results.filter(r => r.domainFriendly).length}</div>
                  <div className="text-white/70">Domain Friendly</div>
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
          )}

          {/* Results Grid */}
          <div className="grid gap-6">
            {results.map((name, index) => (
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
                      {name.domainFriendly && (
                        <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>Domain Friendly</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-white/80 text-lg mb-4">{name.explanation}</p>
                    
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

                  <div className="flex items-center space-x-4 ml-6">
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

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => copyToClipboard(name.name)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white/80 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button 
                      onClick={() => handleAnalyze(name)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Deep Analysis</span>
                    </button>
                  </div>

                  <div className="text-white/50 text-sm">
                    Generated by {name.source === 'openai' ? 'AI' : 'Smart Algorithm'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-12 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Need More Names?</h3>
            <p className="text-white/80 mb-6">Generate additional names with different keywords or styles</p>
            <button
              onClick={() => navigate('/naming-tool')}
              className="bg-gradient-to-r from-white to-purple-200 text-purple-900 px-8 py-3 rounded-xl font-semibold hover:from-purple-100 hover:to-purple-300 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Generate More Names</span>
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      <NameAnalysisModal
        isOpen={analysisModal.isOpen}
        onClose={() => setAnalysisModal({ isOpen: false, nameData: null })}
        nameData={analysisModal.nameData}
        onUpgrade={() => {
          console.log('Upgrade to premium analysis clicked');
          // Navigate to pricing page with analysis context
          navigate('/pricing?source=analysis&feature=premium-analysis');
        }}
      />
    </div>
  );
};

export default NameResults;