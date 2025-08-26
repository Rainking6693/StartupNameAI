import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, CheckCircle } from 'lucide-react';

const NameResults = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // DEBUG: Log everything to see what's happening
  console.log('NameResults - location.state:', location.state);
  console.log('NameResults - sessionId:', sessionId);

  const generateDynamicNames = (formData) => {
    console.log('generateDynamicNames called with:', formData);
    
    if (!formData || !formData.keywords) {
      console.log('No form data, using defaults');
      formData = {
        industry: 'tech',
        style: 'modern', 
        keywords: ['default'],
        description: ''
      };
    }

    const { industry, style, keywords } = formData;
    
    // Industry-specific word parts
    const industryWords = {
      tech: ['Tech', 'Data', 'Cloud', 'Stream', 'Flow', 'Sync', 'Connect', 'Link', 'Net', 'Hub', 'Code', 'Byte', 'Pixel', 'Digital', 'Cyber'],
      health: ['Health', 'Care', 'Med', 'Vital', 'Life', 'Pulse', 'Heal', 'Wellness', 'Pure', 'Fit', 'Strong', 'Active', 'Thrive', 'Nourish'],
      fintech: ['Pay', 'Coin', 'Bank', 'Fund', 'Cash', 'Finance', 'Capital', 'Invest', 'Money', 'Vault', 'Credit', 'Wallet', 'Trade', 'Ledger'],
      ecommerce: ['Shop', 'Buy', 'Cart', 'Market', 'Store', 'Trade', 'Sale', 'Deal', 'Retail', 'Commerce', 'Goods', 'Items', 'Products'],
      education: ['Learn', 'Edu', 'Study', 'Know', 'Skill', 'Mind', 'Brain', 'Academy', 'Scholar', 'Teach', 'Course', 'Lesson', 'Training'],
      food: ['Taste', 'Fresh', 'Bite', 'Flavor', 'Cook', 'Chef', 'Kitchen', 'Recipe', 'Meal', 'Dish', 'Food', 'Eat', 'Feast'],
      travel: ['Go', 'Trip', 'Journey', 'Explore', 'Adventure', 'Wander', 'Roam', 'Discover', 'Venture', 'Quest', 'Travel', 'Tour']
    };

    const styleEndings = {
      modern: ['ly', 'fy', 'io', 'ai', 'x', 'tech', 'lab', 'hub', 'app', 'sys'],
      classic: ['corp', 'co', 'inc', 'group', 'partners', 'solutions', 'services', 'systems'],
      creative: ['lab', 'studio', 'works', 'craft', 'design', 'space', 'room', 'place'],
      professional: ['pro', 'expert', 'master', 'premier', 'elite', 'prime', 'plus', 'max']
    };

    const industryWordList = industryWords[industry] || industryWords.tech;
    const styleEndingList = styleEndings[style] || styleEndings.modern;
    
    const generatedNames = [];

    // Generate names using keywords
    keywords.forEach(keyword => {
      const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      
      // Keyword + industry words
      industryWordList.slice(0, 5).forEach(industryWord => {
        generatedNames.push(capitalizedKeyword + industryWord);
        generatedNames.push(industryWord + capitalizedKeyword);
      });
      
      // Keyword + style endings
      styleEndingList.slice(0, 3).forEach(ending => {
        generatedNames.push(capitalizedKeyword + ending.charAt(0).toUpperCase() + ending.slice(1));
      });
    });

    // Add some industry + style combinations
    industryWordList.slice(0, 3).forEach(industryWord => {
      styleEndingList.slice(0, 2).forEach(ending => {
        generatedNames.push(industryWord + ending.charAt(0).toUpperCase() + ending.slice(1));
      });
    });

    // Remove duplicates and create final objects
    const uniqueNames = [...new Set(generatedNames)]
      .slice(0, 20)
      .map((name, index) => ({
        id: index + 1,
        name: name,
        brandabilityScore: (7.0 + Math.random() * 3.0).toFixed(1),
        domainAvailable: Math.random() > 0.5,
        domainPrice: (Math.random() * 40 + 12).toFixed(2),
        trademarkRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        explanation: `${name} is crafted for the ${industry} industry with ${style} styling, incorporating your keyword '${keywords[0]}' for brand relevance.`,
        psychology: `Appeals to ${industry} customers seeking ${style} solutions.`,
        seoScore: (6.5 + Math.random() * 3.0).toFixed(1),
        memorability: (7.0 + Math.random() * 2.5).toFixed(1),
        pronunciation: 'Easy',
        extensions: {
          com: Math.random() > 0.4,
          io: Math.random() > 0.3,
          ai: Math.random() > 0.7,
          org: Math.random() > 0.5
        },
        premium: Math.random() > 0.7,
        industry: industry,
        style: style
      }));

    console.log('Generated names:', uniqueNames);
    return uniqueNames;
  };

  useEffect(() => {
    console.log('useEffect triggered');
    setLoading(true);
    
    // Get form data from navigation state or use test data
    const formData = location.state?.formData || {
      industry: 'tech',
      style: 'modern',
      keywords: ['test'],
      description: 'Test business'
    };

    console.log('Using formData:', formData);

    // Generate names immediately for testing
    setTimeout(() => {
      const dynamicResults = generateDynamicNames(formData);
      console.log('Setting results:', dynamicResults);
      setResults(dynamicResults);
      setLoading(false);
    }, 1500);

  }, [location.state]);

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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Creating Your Names</h2>
          <p className="text-slate-600">Processing your requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50">
      {/* Header */}
      <div className="px-6 py-6 bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-amber-300 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-amber-600 bg-clip-text text-transparent">
              Your Generated Names
            </span>
          </div>
        </div>
      </div>

      {/* Form Data Debug Display */}
      <div className="px-6 py-4 bg-yellow-100">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-bold text-slate-800 mb-2">DEBUG - Generated for:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Industry:</span> {location.state?.formData?.industry || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Style:</span> {location.state?.formData?.style || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Keywords:</span> {location.state?.formData?.keywords?.join(', ') || 'Not provided'}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            {results.map((name, index) => (
              <motion.div
                key={name.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{name.name}</h3>
                    <p className="text-slate-600">{name.explanation}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-sky-600">{name.brandabilityScore}/10</div>
                    <div className="text-sm text-slate-500">Brandability</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No names generated. Check console for debugging info.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameResults;