import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Target, 
  Zap,
  CheckCircle,
  Loader,
  Plus,
  X,
  Lightbulb,
  TrendingUp,
  Globe
} from 'lucide-react';
import { generateNames, checkDomainAvailability } from '../utils/api';

const NamingTool = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    style: '',
    keywords: [],
    description: '',
    targetAudience: '',
    packageType: 'starter'
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [generatedNames, setGeneratedNames] = useState([]);

  const industries = [
    { id: 'tech', name: 'Technology & Software', icon: '💻', desc: 'SaaS, apps, AI, dev tools' },
    { id: 'fintech', name: 'Financial Technology', icon: '💳', desc: 'Payments, crypto, banking' },
    { id: 'health', name: 'Healthcare & Wellness', icon: '🏥', desc: 'Medical, fitness, mental health' },
    { id: 'ecommerce', name: 'E-commerce & Retail', icon: '🛍️', desc: 'Online stores, marketplaces' },
    { id: 'education', name: 'Education & Learning', icon: '📚', desc: 'EdTech, courses, training' },
    { id: 'marketing', name: 'Marketing & Agency', icon: '📈', desc: 'Advertising, consulting, PR' },
    { id: 'consulting', name: 'Business Consulting', icon: '💼', desc: 'Strategy, operations, coaching' },
    { id: 'creative', name: 'Creative & Media', icon: '🎨', desc: 'Design, content, entertainment' }
  ];

  const styles = [
    { id: 'modern', name: 'Modern & Tech', desc: 'Clean, minimal, forward-thinking', color: 'from-sky-400 to-blue-500' },
    { id: 'professional', name: 'Professional', desc: 'Trustworthy, established, corporate', color: 'from-slate-500 to-slate-600' },
    { id: 'creative', name: 'Creative & Playful', desc: 'Unique, memorable, fun', color: 'from-amber-400 to-orange-500' },
    { id: 'luxurious', name: 'Premium & Luxury', desc: 'Sophisticated, exclusive, high-end', color: 'from-purple-500 to-indigo-600' },
    { id: 'friendly', name: 'Approachable', desc: 'Warm, accessible, human', color: 'from-emerald-400 to-teal-500' },
    { id: 'innovative', name: 'Innovative', desc: 'Cutting-edge, disruptive, bold', color: 'from-rose-400 to-pink-500' }
  ];

  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$19',
      names: 25,
      features: ['25 AI names', 'Domain check', 'Basic scoring', 'PDF export']
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$39',
      names: 75,
      features: ['75 AI names', 'Advanced analysis', 'Trademark check', 'Industry insights'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$79',
      names: 150,
      features: ['150 AI names', 'Full intelligence', 'Multi-domain check', 'Phone support']
    }
  ];

  const suggestedKeywords = {
    tech: ['smart', 'cloud', 'digital', 'data', 'connect', 'sync', 'flow', 'hub', 'core', 'pixel'],
    fintech: ['pay', 'coin', 'bank', 'fund', 'vault', 'trust', 'secure', 'capital', 'mint', 'ledger'],
    health: ['care', 'vital', 'wellness', 'heal', 'fit', 'life', 'mind', 'body', 'pure', 'balance'],
    ecommerce: ['shop', 'buy', 'cart', 'market', 'store', 'trade', 'sell', 'goods', 'deals', 'plaza'],
    education: ['learn', 'teach', 'study', 'academy', 'skill', 'knowledge', 'course', 'mentor', 'wise', 'bright'],
    marketing: ['brand', 'grow', 'reach', 'scale', 'boost', 'launch', 'market', 'lead', 'convert', 'viral'],
    consulting: ['advise', 'guide', 'strategy', 'solve', 'optimize', 'transform', 'excel', 'peak', 'success', 'impact'],
    creative: ['design', 'create', 'studio', 'craft', 'vision', 'art', 'media', 'pixel', 'canvas', 'spark']
  };

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const addKeyword = (keyword) => {
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const names = await generateNames(formData);
      setGeneratedNames(names);
      // Navigate to results with session ID
      const sessionId = Date.now().toString();
      localStorage.setItem(`session_${sessionId}`, JSON.stringify({
        formData,
        names,
        timestamp: new Date().toISOString()
      }));
      navigate(`/results/${sessionId}`);
    } catch (error) {
      console.error('Generation failed:', error);
      // Show error toast here
    }
    setIsGenerating(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.industry;
      case 2: return formData.style;
      case 3: return formData.keywords.length > 0;
      case 4: return formData.description.trim().length > 10;
      case 5: return true; // Review step - always ready
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-amber-300 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">AI Startup Namer</h1>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Step {currentStep} of {totalSteps}</span>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step 1: Industry Selection */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <Target className="w-16 h-16 text-sky-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-800 mb-4">What's your industry?</h2>
              <p className="text-xl text-slate-600">Help us understand your business sector for better name suggestions</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setFormData({ ...formData, industry: industry.id })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                    formData.industry === industry.id
                      ? 'border-sky-400 bg-sky-50 shadow-lg transform scale-105'
                      : 'border-slate-200 bg-white/80 hover:border-sky-300'
                  }`}
                >
                  <div className="text-3xl mb-3">{industry.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{industry.name}</h3>
                  <p className="text-sm text-slate-600">{industry.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Style Selection */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <Zap className="w-16 h-16 text-amber-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose your style</h2>
              <p className="text-xl text-slate-600">What personality should your startup name have?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setFormData({ ...formData, style: style.id })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                    formData.style === style.id
                      ? 'border-sky-400 bg-sky-50 shadow-lg transform scale-105'
                      : 'border-slate-200 bg-white/80 hover:border-sky-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${style.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{style.name}</h3>
                  <p className="text-slate-600">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Keywords */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <Lightbulb className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Add keywords</h2>
              <p className="text-xl text-slate-600">Words that describe your product, values, or vision</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-200">
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword(keywordInput);
                    }
                  }}
                  placeholder="Type a keyword and press Enter"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <button
                  onClick={() => addKeyword(keywordInput)}
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-amber-400 text-white rounded-xl hover:from-sky-600 hover:to-amber-500 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Current Keywords */}
              {formData.keywords.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Your keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="text-sky-600 hover:text-sky-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Keywords */}
              {formData.industry && suggestedKeywords[formData.industry] && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Suggested for {formData.industry}:</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedKeywords[formData.industry]
                      .filter(keyword => !formData.keywords.includes(keyword))
                      .slice(0, 8)
                      .map((keyword) => (
                        <button
                          key={keyword}
                          onClick={() => addKeyword(keyword)}
                          className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-full text-sm hover:bg-sky-50 hover:border-sky-300 transition-all"
                        >
                          {keyword}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Description */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <Brain className="w-16 h-16 text-purple-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Describe your startup</h2>
              <p className="text-xl text-slate-600">Help our AI understand what makes your business unique</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-200 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What does your startup do? *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="We're building an AI-powered platform that helps small businesses automate their customer support..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
                />
                <div className="text-sm text-slate-500 mt-1">
                  {formData.description.length}/500 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Who's your target audience?
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Small business owners, developers, healthcare professionals..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Generate */}
        {currentStep === 5 && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Ready to Generate!</h2>
              <p className="text-xl text-slate-600">We'll create perfect startup names based on your preferences</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Your Requirements:</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Industry:</span>
                    <span className="font-semibold text-slate-800 capitalize">{formData.industry}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Style:</span>
                    <span className="font-semibold text-slate-800 capitalize">{formData.style}</span>
                  </div>
                  
                  <div className="flex justify-between items-start p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Keywords:</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map(keyword => (
                        <span key={keyword} className="bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-sm font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-slate-600 mb-2">Description:</div>
                    <div className="font-medium text-slate-800 text-sm">{formData.description}</div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-sky-50 to-amber-50 rounded-xl border border-sky-200">
                  <h4 className="font-bold text-slate-800 mb-2">What you'll get:</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>10 AI-generated names (free preview)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Basic brandability scores</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Domain availability check</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 text-sm text-slate-500">
                    Upgrade for 50+ more names, advanced analysis, and trademark screening
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 1 ? 'Back to Home' : 'Previous'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isGenerating}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              canProceed() && !isGenerating
                ? 'bg-gradient-to-r from-sky-500 to-amber-400 text-white hover:from-sky-600 hover:to-amber-500 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating Names...</span>
              </>
            ) : (
              <>
                <span>{currentStep === totalSteps ? 'Generate Names (Free)' : 'Next'}</span>
                {currentStep === totalSteps ? <Zap className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NamingTool;