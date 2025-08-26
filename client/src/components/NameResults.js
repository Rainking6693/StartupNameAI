import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Download,
  Heart,
  ExternalLink,
  Shield,
  TrendingUp,
  Globe,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  RefreshCw,
  Share2,
  Filter
} from 'lucide-react';

const NameResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [favoriteNames, setFavoriteNames] = useState([]);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session data
    const data = localStorage.getItem(`session_${sessionId}`);
    if (data) {
      const parsed = JSON.parse(data);
      setSessionData(parsed);
      
      // Simulate some domain checking and scoring
      const enhancedNames = enhanceNamesWithData(parsed.names || generateMockNames(parsed.formData));
      setSessionData({ ...parsed, names: enhancedNames });
    } else {
      navigate('/naming-tool');
    }
    setLoading(false);
  }, [sessionId, navigate]);

  const generateMockNames = (formData) => {
    // Mock name generation based on form data
    const mockNames = [
      'FlowCore', 'DataSync', 'SmartHub', 'CloudVault', 'TechFlow',
      'InnovateLab', 'PixelForge', 'CodeCraft', 'DevStream', 'NexusPoint',
      'BrightMind', 'SwiftScale', 'PureTech', 'ElevateCo', 'VelocityApp',
      'FusionWorks', 'ZenithLabs', 'PrimePulse', 'ApexCore', 'VitalFlow',
      'CrystalClear', 'RocketLabs', 'StellarTech', 'QuantumLeap', 'InfiniteEdge'
    ];
    
    return mockNames.slice(0, formData.packageType === 'starter' ? 25 : formData.packageType === 'professional' ? 75 : 150);
  };

  const enhanceNamesWithData = (names) => {
    return names.map((name) => ({
      name,
      brandabilityScore: Math.floor(Math.random() * 30) + 70,
      domainStatus: Math.random() > 0.6 ? 'available' : Math.random() > 0.3 ? 'premium' : 'taken',
      domainPrice: Math.floor(Math.random() * 2000) + 12,
      trademarkRisk: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
      industryFit: Math.floor(Math.random() * 25) + 75,
      memorability: Math.floor(Math.random() * 30) + 70,
      pronunciation: Math.floor(Math.random() * 20) + 80,
      rationale: generateRationale(name),
      tags: generateTags()
    }));
  };

  const generateRationale = (name) => {
    const reasons = [
      `"${name}" conveys innovation and forward-thinking, perfect for tech startups`,
      `The name "${name}" is memorable and easy to pronounce across cultures`,
      `"${name}" suggests reliability and professionalism, building trust with customers`,
      `This name combines modern appeal with business credibility`,
      `"${name}" has strong brandability potential with clear visual identity options`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const generateTags = () => {
    const allTags = ['Modern', 'Professional', 'Tech-focused', 'Memorable', 'Brandable', 'International', 'Short', 'Catchy'];
    return allTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const toggleFavorite = (name) => {
    setFavoriteNames(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const getDomainStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200';
      case 'premium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'taken': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getDomainStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'premium': return <Star className="w-4 h-4" />;
      case 'taken': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTrademarkRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredAndSortedNames = () => {
    if (!sessionData?.names) return [];
    
    let filtered = sessionData.names;
    
    // Apply filters
    if (filterBy === 'favorites') {
      filtered = filtered.filter(item => favoriteNames.includes(item.name));
    } else if (filterBy === 'available') {
      filtered = filtered.filter(item => item.domainStatus === 'available');
    } else if (filterBy === 'high-score') {
      filtered = filtered.filter(item => item.brandabilityScore >= 85);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.brandabilityScore - a.brandabilityScore;
        case 'name': return a.name.localeCompare(b.name);
        case 'domain': return a.domainStatus === 'available' ? -1 : 1;
        default: return 0;
      }
    });

    return filtered;
  };

  const exportToPDF = () => {
    // Mock PDF export
    const exportData = {
      session: sessionData.formData,
      favorites: favoriteNames,
      timestamp: new Date().toISOString()
    };
    console.log('Exporting to PDF:', exportData);
    // In real implementation, integrate with PDF generation library
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Session not found</p>
          <button onClick={() => navigate('/naming-tool')} className="mt-4 text-sky-600 hover:text-sky-800">
            Start new session
          </button>
        </div>
      </div>
    );
  }

  const displayedNames = filteredAndSortedNames();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/naming-tool')}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Tool</span>
              </button>
              
              <div className="h-6 w-px bg-slate-300" />
              
              <div>
                <h1 className="text-xl font-bold text-slate-800">Your Startup Names</h1>
                <p className="text-sm text-slate-600">
                  {displayedNames.length} names • {sessionData.formData.industry} • {sessionData.formData.style}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={exportToPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-amber-400 text-white rounded-lg hover:from-sky-600 hover:to-amber-500 transition-all">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-sky-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Filter:</span>
              </div>
              
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All Names' },
                  { key: 'favorites', label: `Favorites (${favoriteNames.length})` },
                  { key: 'available', label: 'Available' },
                  { key: 'high-score', label: '85+ Score' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterBy(filter.key)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filterBy === filter.key
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-sky-400"
                >
                  <option value="score">Brandability Score</option>
                  <option value="name">Name A-Z</option>
                  <option value="domain">Domain Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Names Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedNames.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-sky-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{item.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-sky-100 text-sky-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleFavorite(item.name)}
                  className={`p-2 rounded-full transition-colors ${
                    favoriteNames.includes(item.name)
                      ? 'text-red-500 bg-red-50'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favoriteNames.includes(item.name) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(item.brandabilityScore)} rounded-lg p-2`}>
                    {item.brandabilityScore}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Brandability</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(item.industryFit)} rounded-lg p-2`}>
                    {item.industryFit}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Industry Fit</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(item.memorability)} rounded-lg p-2`}>
                    {item.memorability}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Memorable</div>
                </div>
              </div>

              {/* Domain Status */}
              <div className="mb-4">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${getDomainStatusColor(item.domainStatus)}`}>
                  <div className="flex items-center space-x-2">
                    {getDomainStatusIcon(item.domainStatus)}
                    <span className="font-medium text-sm">
                      {item.name.toLowerCase()}.com
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {item.domainStatus === 'available' ? `$${item.domainPrice}/yr` : 
                       item.domainStatus === 'premium' ? `$${item.domainPrice * 100}` : 'Taken'}
                    </div>
                    <div className="text-xs opacity-75 capitalize">{item.domainStatus}</div>
                  </div>
                </div>
              </div>

              {/* Trademark Risk */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Trademark Risk:</span>
                  <div className={`flex items-center space-x-1 ${getTrademarkRiskColor(item.trademarkRisk)}`}>
                    <Shield className="w-4 h-4" />
                    <span className="font-medium text-sm capitalize">{item.trademarkRisk}</span>
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="mb-4">
                <p className="text-sm text-slate-600 italic">{item.rationale}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-gradient-to-r from-sky-500 to-amber-400 text-white rounded-lg text-sm font-medium hover:from-sky-600 hover:to-amber-500 transition-all">
                  Check Details
                </button>
                <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayedNames.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No names match your filters</h3>
            <p className="text-slate-500">Try adjusting your filters to see more results</p>
            <button
              onClick={() => setFilterBy('all')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-sky-500 to-amber-400 text-white rounded-lg hover:from-sky-600 hover:to-amber-500 transition-all"
            >
              Show All Names
            </button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Session Summary</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-sky-600 mb-2">{sessionData.names.length}</div>
                <div className="text-slate-600">Names Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {sessionData.names.filter(n => n.domainStatus === 'available').length}
                </div>
                <div className="text-slate-600">Available Domains</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {sessionData.names.filter(n => n.brandabilityScore >= 85).length}
                </div>
                <div className="text-slate-600">High Scores (85+)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{favoriteNames.length}</div>
                <div className="text-slate-600">Favorites</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameResults;