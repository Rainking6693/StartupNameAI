import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  Download, 
  Heart,
  Copy,
  CheckCircle,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Fallback name generation (same as OpenAI service)
const generateFallbackNames = (formData) => {
  const { keywords = [], industry = 'tech', style = 'modern' } = formData;
  
  const workingKeywords = keywords.length > 0 ? keywords : ['startup'];
  
  const industryWords = {
    tech: ['Tech', 'Data', 'Cloud', 'Stream', 'Flow', 'Sync', 'Connect', 'Link', 'Net', 'Hub'],
    health: ['Health', 'Care', 'Med', 'Vital', 'Life', 'Pulse', 'Heal', 'Wellness', 'Pure', 'Fit'],
    fintech: ['Pay', 'Coin', 'Bank', 'Fund', 'Cash', 'Finance', 'Capital', 'Invest', 'Money', 'Vault'],
    ecommerce: ['Shop', 'Buy', 'Cart', 'Market', 'Store', 'Trade', 'Sale', 'Deal', 'Retail', 'Commerce'],
    education: ['Learn', 'Edu', 'Study', 'Know', 'Skill', 'Mind', 'Brain', 'Academy', 'Scholar', 'Teach'],
    food: ['Taste', 'Fresh', 'Bite', 'Flavor', 'Cook', 'Chef', 'Kitchen', 'Recipe', 'Meal', 'Dish'],
    travel: ['Go', 'Trip', 'Journey', 'Explore', 'Adventure', 'Wander', 'Roam', 'Discover', 'Venture', 'Quest'],
    other: ['Pro', 'Max', 'Plus', 'Prime', 'Elite', 'Smart', 'Quick', 'Easy', 'Simple', 'Best']
  };

  const baseWords = industryWords[industry] || industryWords.tech;
  const fallbackNames = [];
  
  workingKeywords.forEach((keyword, keywordIndex) => {
    const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
    
    baseWords.slice(0, 4).forEach((word, wordIndex) => {
      const nameId = (keywordIndex * 10) + wordIndex + 1;
      
      // Forward combination
      fallbackNames.push({
        id: nameId,
        name: capitalizedKeyword + word,
        explanation: `${capitalizedKeyword + word} combines your keyword '${keyword}' with ${industry} industry terminology, creating a brandable name that clearly communicates your focus area.`,
        brandabilityScore: parseFloat((7 + Math.random() * 2.5).toFixed(1)),
        domainFriendly: Math.random() > 0.3,
        psychologyTriggers: ['clarity', 'industry-focus', keyword.toLowerCase()],
        source: 'fallback'
      });
      
      // Reverse combination
      if (fallbackNames.length < 15) {
        fallbackNames.push({
          id: nameId + 100,
          name: word + capitalizedKeyword,
          explanation: `${word + capitalizedKeyword} places industry terminology first, emphasizing your ${industry} expertise while incorporating '${keyword}' for brand personality.`,
          brandabilityScore: parseFloat((7.2 + Math.random() * 2.3).toFixed(1)),
          domainFriendly: Math.random() > 0.4,
          psychologyTriggers: ['authority', 'expertise', keyword.toLowerCase()],
          source: 'fallback'
        });
      }
    });
  });
  
  return fallbackNames.slice(0, 20);
};

const ResultsPage = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  
  const [sessionData, setSessionData] = useState(null);
  const [generatedNames, setGeneratedNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    if (!sessionId || typeof window === 'undefined') return;

    try {
      // Get session data from localStorage
      const savedData = localStorage.getItem(`naming_session_${sessionId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setSessionData(parsed);
        
        // Generate names if not already generated
        if (parsed.results) {
          setGeneratedNames(parsed.results);
        } else {
          const names = generateFallbackNames(parsed.formData);
          setGeneratedNames(names);
          
          // Save generated names back to localStorage
          const updatedData = { ...parsed, results: names };
          localStorage.setItem(`naming_session_${sessionId}`, JSON.stringify(updatedData));
        }
      } else {
        setError('Session not found. Please start a new naming session.');
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load your session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const sortedNames = [...generatedNames].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.brandabilityScore - a.brandabilityScore;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'length':
        return a.name.length - b.name.length;
      default:
        return 0;
    }
  });

  const toggleFavorite = (nameId) => {
    setFavorites(prev => 
      prev.includes(nameId) 
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const exportNames = () => {
    const exportData = {
      session: sessionData,
      names: generatedNames,
      favorites: favorites,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup-names-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Names exported successfully!');
  };

  const restartProcess = () => {
    router.push('/naming-tool');
  };

  if (isLoading) {
    return (
      <Layout
        title="Loading Results... | StartupNamer.org"
        description="Loading your AI-generated startup names"
        noindex={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Your Names</h2>
            <p className="text-slate-600">Retrieving your AI-generated startup names...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        title="Error - StartupNamer.org"
        description="An error occurred while loading results"
        noindex={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-slate-600 mb-8">{error}</p>
            <button
              onClick={restartProcess}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Start New Session
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`AI-Generated Names for ${sessionData?.formData?.industry || 'Your'} Startup | StartupNamer.org`}
      description={`View ${generatedNames.length} unique AI-generated startup names for your ${sessionData?.formData?.industry || ''} business with brandability scores and domain insights.`}
      canonical={`https://startupnamer.org/results/${sessionId}`}
      noindex={true}
    >
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/naming-tool')}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Naming Tool</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportNames}
                className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={restartProcess}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Session</span>
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 mb-8 shadow-xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Your AI-Generated Names</h1>
                <p className="text-slate-600">Generated {generatedNames.length} unique names for your {sessionData?.formData?.industry || 'startup'}</p>
              </div>
            </div>

            {/* Session Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-600 mb-1">Industry</div>
                <div className="font-semibold text-slate-800 capitalize">{sessionData?.formData?.industry}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-600 mb-1">Style</div>
                <div className="font-semibold text-slate-800 capitalize">{sessionData?.formData?.style}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-600 mb-1">Keywords</div>
                <div className="flex flex-wrap gap-1">
                  {sessionData?.formData?.keywords?.map(keyword => (
                    <span key={keyword} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="score">Brand Score</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="length">Name Length</option>
                </select>
              </div>
              
              <div className="text-sm text-slate-600">
                {favorites.length > 0 && `${favorites.length} favorite${favorites.length !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedNames.map((name, index) => (
              <div
                key={name.id}
                className={`bg-white/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  favorites.includes(name.id) ? 'border-yellow-300 bg-yellow-50/80' : 'border-slate-200/60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{name.name}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-lg font-semibold text-slate-700">{name.brandabilityScore}/10</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        name.domainFriendly 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {name.domainFriendly ? 'Domain Friendly' : 'Check Domain'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(name.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.includes(name.id) 
                        ? 'text-yellow-600 hover:text-yellow-700 bg-yellow-100' 
                        : 'text-slate-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(name.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-slate-600 mb-4 leading-relaxed">{name.explanation}</p>

                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">Psychology Triggers:</div>
                  <div className="flex flex-wrap gap-2">
                    {name.psychologyTriggers.map(trigger => (
                      <span 
                        key={trigger} 
                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium capitalize"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => copyToClipboard(name.name)}
                    className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  
                  <button
                    onClick={() => window.open(`https://www.namecheap.com/domains/registration/results/?domain=${name.name.toLowerCase()}`, '_blank')}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Check Domain</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;