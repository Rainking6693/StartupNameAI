import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  Lightbulb,
  Target,
  Zap,
  CheckCircle,
  Building,
  Palette,
  Hash,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const NamingTool = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    style: '',
    keywords: [],
    description: '',
    nameCount: 50,
    package: 'professional'
  });

  const totalSteps = 4;

  // Industry options with enhanced descriptions
  const industries = [
    { 
      id: 'tech', 
      name: 'Technology', 
      icon: '💻', 
      desc: 'SaaS, apps, software platforms',
      examples: 'Like Stripe, Notion, Figma'
    },
    { 
      id: 'health', 
      name: 'Healthcare', 
      icon: '🏥', 
      desc: 'Medical, wellness, fitness',
      examples: 'Like Teladoc, Calm, MyFitnessPal'
    },
    { 
      id: 'fintech', 
      name: 'FinTech', 
      icon: '💳', 
      desc: 'Banking, payments, crypto',
      examples: 'Like Robinhood, Square, Coinbase'
    },
    { 
      id: 'ecommerce', 
      name: 'E-commerce', 
      icon: '🛒', 
      desc: 'Online retail, marketplaces',
      examples: 'Like Shopify, Etsy, Amazon'
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: '🎓', 
      desc: 'EdTech, learning, training',
      examples: 'Like Coursera, Duolingo, Khan Academy'
    },
    { 
      id: 'food', 
      name: 'Food & Beverage', 
      icon: '🍽️', 
      desc: 'Restaurants, delivery, food tech',
      examples: 'Like DoorDash, Blue Apron, Grubhub'
    },
    { 
      id: 'travel', 
      name: 'Travel', 
      icon: '✈️', 
      desc: 'Tourism, booking, hospitality',
      examples: 'Like Airbnb, Booking.com, Uber'
    },
    { 
      id: 'other', 
      name: 'Other', 
      icon: '🎯', 
      desc: 'Tell us more about your industry',
      examples: 'Custom industry analysis'
    }
  ];

  // Style preferences with personality insights
  const styles = [
    { 
      id: 'modern', 
      name: 'Modern', 
      icon: '⚡', 
      desc: 'Clean, tech-forward, innovative',
      personality: 'Appeals to early adopters and tech-savvy users'
    },
    { 
      id: 'classic', 
      name: 'Classic', 
      icon: '🏛️', 
      desc: 'Timeless, established, trustworthy',
      personality: 'Builds trust with traditional industries'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      icon: '🎨', 
      desc: 'Unique, artistic, memorable',
      personality: 'Stands out in crowded markets'
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      icon: '💼', 
      desc: 'Corporate, enterprise-ready',
      personality: 'Perfect for B2B and enterprise sales'
    }
  ];

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
    }
  };

  const handleKeywordAdd = (keyword) => {
    if (keyword.trim() && formData.keywords.length < 5 && !formData.keywords.includes(keyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword.trim()]
      });
    }
  };

  const handleKeywordRemove = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI processing
      toast.success('🧠 AI is analyzing your requirements...');
      
      // Store session data
      const sessionId = Date.now().toString();
      const sessionData = {
        formData,
        sessionId,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`naming_session_${sessionId}`, JSON.stringify(sessionData));
      
      // Navigate to results after processing
      setTimeout(() => {
        navigate(`/results/${sessionId}`);
      }, 3000);
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.industry !== '';
      case 2: return formData.style !== '';
      case 3: return formData.keywords.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Lightbulb className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Generating Your Names</h2>
          <p className="text-white/80 text-lg mb-8">Our AI is crafting the perfect startup names for you...</p>
          
          <div className="max-w-md mx-auto space-y-3">
            {[
              'Analyzing your industry trends...',
              'Processing your keywords...',
              'Checking domain availability...',
              'Scoring brandability...',
              'Almost ready!'
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.6 }}
                className="text-left text-white/70 flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">StartupNamer.org</span>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-white/80 font-medium">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Industry Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">What's your industry?</h2>
                  <p className="text-xl text-white/80">This helps our AI understand your market and naming conventions</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {industries.map((industry) => (
                    <motion.div
                      key={industry.id}
                      whileHover={{ y: -4 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                        formData.industry === industry.id 
                          ? 'border-purple-400 bg-white/20' 
                          : 'border-transparent hover:bg-white/15'
                      }`}
                      onClick={() => setFormData({...formData, industry: industry.id})}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{industry.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{industry.name}</h3>
                          <p className="text-white/70 text-sm mb-2">{industry.desc}</p>
                          <p className="text-purple-300 text-xs">{industry.examples}</p>
                        </div>
                        {formData.industry === industry.id && (
                          <CheckCircle className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Style Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">What's your style?</h2>
                  <p className="text-xl text-white/80">Choose the personality that best fits your brand vision</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {styles.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ y: -4 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-xl p-8 cursor-pointer transition-all duration-300 border-2 ${
                        formData.style === style.id 
                          ? 'border-purple-400 bg-white/20' 
                          : 'border-transparent hover:bg-white/15'
                      }`}
                      onClick={() => setFormData({...formData, style: style.id})}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-4">{style.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{style.name}</h3>
                        <p className="text-white/70 mb-3">{style.desc}</p>
                        <p className="text-purple-300 text-sm">{style.personality}</p>
                        {formData.style === style.id && (
                          <CheckCircle className="w-6 h-6 text-purple-400 mx-auto mt-4" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Keywords Input */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Hash className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Add your keywords</h2>
                  <p className="text-xl text-white/80">What words describe your startup? (1-5 keywords)</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                    <KeywordInput 
                      keywords={formData.keywords}
                      onAdd={handleKeywordAdd}
                      onRemove={handleKeywordRemove}
                    />
                    
                    <div className="mt-8">
                      <label className="block text-white font-medium mb-3">
                        Brief description (optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Tell us more about your startup idea..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review & Generate */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Ready to generate!</h2>
                  <p className="text-xl text-white/80">We'll create perfect startup names based on your preferences</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Your Requirements:</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                        <span className="text-white/80">Industry:</span>
                        <span className="font-semibold text-white capitalize">{formData.industry}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                        <span className="text-white/80">Style:</span>
                        <span className="font-semibold text-white capitalize">{formData.style}</span>
                      </div>
                      
                      <div className="flex justify-between items-start p-4 bg-white/10 rounded-xl">
                        <span className="text-white/80">Keywords:</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.keywords.map(keyword => (
                            <span key={keyword} className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                      <h4 className="font-bold text-white mb-3">What you'll get (FREE):</h4>
                      <ul className="space-y-2 text-white/80">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>10 AI-generated names (free preview)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Basic brandability scores</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Domain availability check</span>
                        </li>
                      </ul>
                      
                      <div className="mt-4 text-sm text-white/60">
                        💎 Upgrade for 75+ more names, advanced analysis, and trademark screening
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1 
                  ? 'text-white/40 cursor-not-allowed' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index + 1 <= currentStep 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === totalSteps ? 'Generate Names (Free)' : 'Next'}</span>
              {currentStep === totalSteps ? <Zap className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keyword Input Component
const KeywordInput = ({ keywords, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a keyword..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            maxLength={20}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || keywords.length >= 5}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              inputValue.trim() && keywords.length < 5
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-white/20 text-white/40 cursor-not-allowed'
            }`}
          >
            Add
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2 bg-purple-500/30 px-4 py-2 rounded-full"
          >
            <span className="text-purple-200 font-medium">{keyword}</span>
            <button
              onClick={() => onRemove(keyword)}
              className="text-purple-300 hover:text-white transition-colors"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-white/60 text-sm mt-3">
        {keywords.length}/5 keywords added
      </p>
    </div>
  );
};

export default NamingTool;