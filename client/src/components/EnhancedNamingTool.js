import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  ArrowLeft,
  Star,
  Cpu,
  Target,
  Zap,
  CheckCircle,
  Lightbulb,
  Building,
  Palette,
  Hash,
  Clock,
  AlertCircle,
  Settings,
  Filter,
  BarChart3,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import enhancedAI from '../services/enhancedAI';

const EnhancedNamingTool = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('professional');
  const [advancedOptions, setAdvancedOptions] = useState({
    qualityFilter: true,
    includeVariations: true,
    industryDeepDive: true,
    batchSize: 100
  });
  const [formData, setFormData] = useState({
    keywords: [],
    industry: '',
    style: '',
    description: '',
    targetAudience: '',
    brandPersonality: []
  });

  const totalSteps = 5; // Added advanced options step

  // Enhanced industry options with AI insights
  const industries = [
    { 
      id: 'tech', 
      name: 'Technology', 
      icon: 'ð»', 
      desc: 'SaaS, apps, software platforms',
      aiInsights: 'AI optimized for tech naming patterns'
    },
    { 
      id: 'health', 
      name: 'Healthcare', 
      icon: 'ð¥', 
      desc: 'Medical, wellness, fitness',
      aiInsights: 'Trust-focused naming algorithms'
    },
    { 
      id: 'fintech', 
      name: 'FinTech', 
      icon: 'ð³', 
      desc: 'Banking, payments, crypto',
      aiInsights: 'Security-oriented name generation'
    },
    { 
      id: 'ecommerce', 
      name: 'E-commerce', 
      icon: 'ð', 
      desc: 'Online retail, marketplaces',
      aiInsights: 'Conversion-optimized naming'
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: 'ð', 
      desc: 'EdTech, learning, training',
      aiInsights: 'Authority-building name patterns'
    },
    { 
      id: 'food', 
      name: 'Food & Beverage', 
      icon: 'ð½ï¸', 
      desc: 'Restaurants, delivery, food tech',
      aiInsights: 'Appetite-appealing linguistics'
    },
    { 
      id: 'travel', 
      name: 'Travel', 
      icon: 'âï¸', 
      desc: 'Tourism, booking, hospitality',
      aiInsights: 'Adventure-inspiring names'
    },
    { 
      id: 'other', 
      name: 'Other', 
      icon: 'ð¯', 
      desc: 'Tell us more about your industry',
      aiInsights: 'Custom AI analysis'
    }
  ];

  // Enhanced style preferences with psychology insights
  const styles = [
    { 
      id: 'modern', 
      name: 'Modern', 
      icon: 'â¡', 
      desc: 'Clean, tech-forward, innovative',
      psychology: 'Appeals to early adopters and tech-savvy users'
    },
    { 
      id: 'classic', 
      name: 'Classic', 
      icon: 'ðï¸', 
      desc: 'Timeless, established, trustworthy',
      psychology: 'Builds trust with traditional audiences'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      icon: 'ð¨', 
      desc: 'Unique, artistic, memorable',
      psychology: 'Attracts creative and artistic demographics'
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      icon: 'ð¼', 
      desc: 'Corporate, enterprise-ready',
      psychology: 'Resonates with B2B and enterprise clients'
    }
  ];

  // Package options with enhanced features
  const packages = {
    starter: {
      name: 'Starter',
      price: 49,
      originalPrice: 98,
      names: 50,
      features: [
        '50 AI-generated names',
        'Basic trademark search (US)',
        'Brand strategy PDF (8 pages)',
        '3 logo concepts',
        'Domain availability check',
        'Basic legal compliance'
      ],
      badge: 'BEST VALUE'
    },
    professional: {
      name: 'Professional',
      price: 79,
      originalPrice: 158,
      names: 150,
      features: [
        '150 premium AI names',
        'Global trademark research',
        'Comprehensive brand strategy (15 pages)',
        '6 logo concepts + guidelines',
        'Premium domain suggestions',
        'Industry compliance review',
        'Competitor analysis report'
      ],
      badge: 'MOST POPULAR'
    },
    enterprise: {
      name: 'Enterprise',
      price: 159,
      originalPrice: 318,
      names: 300,
      features: [
        '300 premium quality names',
        'Global trademark + 6-month monitoring',
        'Executive brand strategy (25+ pages)',
        '12 custom logo designs',
        'Legal compliance (all jurisdictions)',
        'White-label naming rights',
        'Priority AI processing',
        'Custom brand consultation'
      ],
      badge: 'ENTERPRISE'
    }
  };

  // Brand personality options
  const brandPersonalities = [
    { id: 'innovative', name: 'Innovative', icon: 'ð' },
    { id: 'trustworthy', name: 'Trustworthy', icon: 'ð¡ï¸' },
    { id: 'friendly', name: 'Friendly', icon: 'ð' },
    { id: 'premium', name: 'Premium', icon: 'ð' },
    { id: 'playful', name: 'Playful', icon: 'ð®' },
    { id: 'sophisticated', name: 'Sophisticated', icon: 'ð©' }
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
    if (keyword.trim() && formData.keywords.length < 8 && !formData.keywords.includes(keyword.trim())) {
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

  const handlePersonalityToggle = (personality) => {
    const current = formData.brandPersonality || [];
    const updated = current.includes(personality)
      ? current.filter(p => p !== personality)
      : [...current, personality];
    
    setFormData({
      ...formData,
      brandPersonality: updated
    });
  };

  const handleGenerate = async () => {
    console.log('ð ENHANCED GENERATE CLICKED - Starting AI process...');
    setIsLoading(true);
    setError('');
    
    try {
      console.log('ð Enhanced form data:', formData);
      console.log('âï¸ Advanced options:', advancedOptions);
      console.log('ð¦ Selected package:', selectedPackage);
      
      // Validate form data
      if (!formData.industry || !formData.style || formData.keywords.length === 0) {
        throw new Error('Please complete all required fields');
      }
      
      // Get package configuration
      const packageConfig = packages[selectedPackage];
      const nameCount = packageConfig.names;
      
      console.log('ð Generating', nameCount, 'names with enhanced AI...');
      
      // Generate names using enhanced AI service
      const result = await enhancedAI.generateBatchNames(formData, {
        count: nameCount,
        qualityFilter: advancedOptions.qualityFilter,
        includeVariations: advancedOptions.includeVariations,
        industryDeepDive: advancedOptions.industryDeepDive
      });
      
      console.log('â Enhanced AI generation complete:', result);
      
      if (!result || !result.names || result.names.length === 0) {
        throw new Error('No names were generated by enhanced AI');
      }

      // Create enhanced session data
      const sessionId = Date.now().toString();
      const sessionData = {
        formData,
        advancedOptions,
        selectedPackage,
        packageConfig,
        results: result.names,
        metadata: result.metadata,
        timestamp: new Date().toISOString(),
        enhanced: true
      };
      
      console.log('ð¾ Saving enhanced session data:', sessionId);
      
      // Store in localStorage with enhanced data
      try {
        localStorage.setItem(`naming_session_${sessionId}`, JSON.stringify(sessionData));
        console.log('â Enhanced session data saved');
        
        // Verify the data was saved
        const savedData = localStorage.getItem(`naming_session_${sessionId}`);
        if (!savedData) {
          throw new Error('Failed to save enhanced session data');
        }
        
      } catch (storageError) {
        console.error('â Failed to save to localStorage:', storageError);
        // Continue anyway - results page can handle missing data
      }

      console.log('ð§­ Navigating to enhanced results:', `/results/${sessionId}`);
      
      // Navigate to results
      navigate(`/results/${sessionId}`, { replace: true });

    } catch (error) {
      console.error('â Enhanced name generation failed:', error);
      setError(error.message || 'Failed to generate names. Please try again.');
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.industry !== '';
      case 2: return formData.style !== '';
      case 3: return formData.keywords.length > 0;
      case 4: return selectedPackage !== '';
      case 5: return true;
      default: return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-white to-purple-200 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Star className="w-10 h-10 text-purple-900" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Enhanced AI is Creating Your Names</h2>
          <p className="text-white/80 mb-6">Using advanced algorithms to generate {packages[selectedPackage].names} premium startup names...</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Processing Steps:</h3>
            <div className="space-y-3">
              {[
                'Analyzing industry patterns...',
                'Processing linguistic structures...',
                'Applying brand psychology...',
                'Generating name variants...',
                'Scoring brandability...',
                'Ranking by quality...'
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 1.2 }}
                  className="text-left text-white/80 flex items-center space-x-3"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-white/60 text-sm">
            <p>Package: {packages[selectedPackage].name}</p>
            <p>Names: {packages[selectedPackage].names}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Enhanced Header */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Enhanced AI Naming</span>
              <div className="text-yellow-300 text-sm font-semibold">Enterprise-Grade Platform</div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white transition-colors"
          >
            â Back to Home
          </button>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="px-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-white/80">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-200"
              >
                Ã
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Industry Selection (Enhanced) */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">What's your industry?</h2>
                  <p className="text-xl text-white/80">Our enhanced AI understands 50,000+ industry naming patterns</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {industries.map((industry) => (
                    <motion.div
                      key={industry.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                        formData.industry === industry.id 
                          ? 'border-yellow-400 shadow-lg bg-white/20' 
                          : 'border-transparent hover:bg-white/15'
                      }`}
                      onClick={() => setFormData({...formData, industry: industry.id})}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{industry.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{industry.name}</h3>
                          <p className="text-white/70 text-sm mb-2">{industry.desc}</p>
                          <div className="bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-semibold">
                            {industry.aiInsights}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Style Selection (Enhanced) */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">What's your style?</h2>
                  <p className="text-xl text-white/80">Choose the brand personality that resonates with your target audience</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {styles.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 ${
                        formData.style === style.id 
                          ? 'border-yellow-400 shadow-lg bg-white/20' 
                          : 'border-transparent hover:bg-white/15'
                      }`}
                      onClick={() => setFormData({...formData, style: style.id})}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-4">{style.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{style.name}</h3>
                        <p className="text-white/70 mb-3">{style.desc}</p>
                        <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                          {style.psychology}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Keywords & Brand Personality */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Hash className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Define your brand</h2>
                  <p className="text-xl text-white/80">Keywords and personality traits that represent your startup</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Keywords Section */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Keywords (1-8 words)</h3>
                    <KeywordInput 
                      keywords={formData.keywords}
                      onAdd={handleKeywordAdd}
                      onRemove={handleKeywordRemove}
                      maxKeywords={8}
                    />
                  </div>

                  {/* Brand Personality */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Brand Personality (Optional)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {brandPersonalities.map((personality) => (
                        <button
                          key={personality.id}
                          onClick={() => handlePersonalityToggle(personality.id)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            formData.brandPersonality?.includes(personality.id)
                              ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-lg mb-1">{personality.icon}</div>
                          {personality.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Additional Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Target Audience (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.targetAudience}
                          onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                          placeholder="e.g., Small business owners, Tech professionals, Students"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent text-white placeholder-white/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Brief Description (Optional)
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Tell us more about your startup idea..."
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent resize-none text-white placeholder-white/50"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Package Selection */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Choose Your Package</h2>
                  <p className="text-xl text-white/80">Select the level of AI analysis and deliverables you need</p>
                  
                  <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 max-w-lg mx-auto mt-6">
                    <div className="flex items-center justify-center space-x-2 text-yellow-300">
                      <Clock className="w-5 h-5 animate-pulse" />
                      <span className="font-bold">LIMITED TIME: 50% OFF ALL PACKAGES</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(packages).map(([key, pkg]) => (
                    <motion.div
                      key={key}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 relative ${
                        selectedPackage === key 
                          ? 'border-yellow-400 shadow-lg bg-white/20' 
                          : 'border-transparent hover:bg-white/15'
                      } ${key === 'professional' ? 'ring-2 ring-yellow-400/50' : ''}`}
                      onClick={() => setSelectedPackage(key)}
                    >
                      {pkg.badge && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full font-bold text-xs">
                            {pkg.badge}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center mb-6 pt-2">
                        <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                        <div className="text-3xl font-black text-white mb-2">
                          <span className="line-through text-gray-400 text-lg">${pkg.originalPrice}</span> ${pkg.price}
                        </div>
                        <div className="text-green-400 font-semibold text-sm">Save ${pkg.originalPrice - pkg.price}</div>
                        <div className="text-yellow-300 font-semibold text-sm mt-1">{pkg.names} AI Names</div>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-white/90 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Advanced Options & Review */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Advanced Options & Review</h2>
                  <p className="text-xl text-white/80">Fine-tune your AI generation and review your selections</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Advanced Options */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>AI Generation Options</span>
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={advancedOptions.qualityFilter}
                            onChange={(e) => setAdvancedOptions({...advancedOptions, qualityFilter: e.target.checked})}
                            className="w-5 h-5 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400"
                          />
                          <div>
                            <div className="text-white font-medium">Quality Filter</div>
                            <div className="text-white/60 text-sm">Only show names with 8.0+ brandability score</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={advancedOptions.includeVariations}
                            onChange={(e) => setAdvancedOptions({...advancedOptions, includeVariations: e.target.checked})}
                            className="w-5 h-5 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400"
                          />
                          <div>
                            <div className="text-white font-medium">Include Variations</div>
                            <div className="text-white/60 text-sm">Generate linguistic variations of keywords</div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={advancedOptions.industryDeepDive}
                            onChange={(e) => setAdvancedOptions({...advancedOptions, industryDeepDive: e.target.checked})}
                            className="w-5 h-5 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400"
                          />
                          <div>
                            <div className="text-white font-medium">Industry Deep Dive</div>
                            <div className="text-white/60 text-sm">Advanced industry-specific analysis</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Generation Summary</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80">Industry:</span>
                          <span className="font-semibold text-white capitalize">{formData.industry}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80">Style:</span>
                          <span className="font-semibold text-white capitalize">{formData.style}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80">Package:</span>
                          <span className="font-semibold text-white">{packages[selectedPackage].name}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 block mb-2">Keywords:</span>
                          <div className="flex flex-wrap gap-2">
                            {formData.keywords.map(keyword => (
                              <span key={keyword} className="bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full text-sm font-medium">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {formData.brandPersonality && formData.brandPersonality.length > 0 && (
                          <div className="p-3 bg-white/10 rounded-xl">
                            <span className="text-white/80 block mb-2">Personality:</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.brandPersonality.map(personality => (
                                <span key={personality} className="bg-purple-400/20 text-purple-300 px-2 py-1 rounded-full text-sm font-medium">
                                  {personality}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                      <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                        <Star className="w-5 h-5" />
                        <span>What you'll get with Enhanced AI:</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-white/80 text-sm">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>{packages[selectedPackage].names} AI-generated names</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Advanced brandability scoring</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Psychology insights for each name</span>
                          </li>
                        </ul>
                        <ul className="space-y-2 text-white/80 text-sm">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Industry-specific analysis</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Domain-friendly assessment</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Detailed scoring breakdown</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1 
                  ? 'text-white/40 cursor-not-allowed' 
                  : 'text-white hover:bg-white/10'
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
                      ? 'bg-yellow-400' 
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
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === totalSteps ? 'Generate Enhanced Names' : 'Next'}</span>
              {currentStep === totalSteps ? <Star className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Keyword Input Component
const KeywordInput = ({ keywords, onAdd, onRemove, maxKeywords = 8 }) => {
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
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent text-white placeholder-white/50"
            maxLength={25}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || keywords.length >= maxKeywords}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              inputValue.trim() && keywords.length < maxKeywords
                ? 'bg-yellow-400 text-black hover:bg-yellow-500'
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
            className="flex items-center space-x-2 bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full border border-yellow-400/30"
          >
            <span className="font-medium">{keyword}</span>
            <button
              onClick={() => onRemove(keyword)}
              className="text-yellow-300/70 hover:text-yellow-300 transition-colors font-bold"
            >
              Ã
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-white/60 text-sm mt-3">
        {keywords.length}/{maxKeywords} keywords added
      </p>
    </div>
  );
};

export default EnhancedNamingTool;