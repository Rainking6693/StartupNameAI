import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const EnhancedNamingToolPhase3 = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    keywords: [],
    industry: '',
    style: '',
    description: ''
  });

  const totalSteps = 4; // Step 4 is now Review & Confirmation

  // Industry options
  const industries = [
    { id: 'tech', name: 'Technology', icon: 'ð»', desc: 'SaaS, apps, software platforms' },
    { id: 'health', name: 'Healthcare', icon: 'ð¥', desc: 'Medical, wellness, fitness' },
    { id: 'fintech', name: 'FinTech', icon: 'ð³', desc: 'Banking, payments, crypto' },
    { id: 'ecommerce', name: 'E-commerce', icon: 'ð', desc: 'Online retail, marketplaces' },
    { id: 'education', name: 'Education', icon: 'ð', desc: 'EdTech, learning, training' },
    { id: 'food', name: 'Food & Beverage', icon: 'ð½ï¸', desc: 'Restaurants, delivery, food tech' },
    { id: 'travel', name: 'Travel', icon: 'âï¸', desc: 'Tourism, booking, hospitality' },
    { id: 'ai', name: 'Artificial Intelligence', icon: 'ð¤', desc: 'AI, machine learning, automation' }
  ];

  // Style preferences
  const styles = [
    { id: 'modern', name: 'Modern', icon: 'â¡', desc: 'Clean, tech-forward, innovative' },
    { id: 'classic', name: 'Classic', icon: 'ðï¸', desc: 'Timeless, established, trustworthy' },
    { id: 'creative', name: 'Creative', icon: 'ð¨', desc: 'Unique, artistic, memorable' },
    { id: 'professional', name: 'Professional', icon: 'ð¼', desc: 'Corporate, enterprise-ready' }
  ];

  const handleNext = () => {
    // Validate current step before proceeding
    if (!canProceed()) {
      setError(getValidationMessage());
      return;
    }
    
    setError(''); // Clear any previous errors
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(''); // Clear errors when going back
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
    console.log('ð PHASE 3 GENERATE - Starting backend API integration...');
    setIsLoading(true);
    setError('');
    
    try {
      console.log('ð Form data to process:', formData);
      
      // Validate form data
      if (!formData.industry || !formData.style || formData.keywords.length === 0) {
        throw new Error('Please complete all required fields');
      }
      
      // Use Phase 2 backend API for name generation
      console.log('ð Connecting to Phase 2 backend API...');
      
      const response = await apiService.generateNames({
        keywords: formData.keywords,
        industry: formData.industry,
        style: formData.style,
        count: 50,
        description: formData.description
      });
      
      console.log('â Backend API response:', response);
      
      if (!response.success || !response.names || response.names.length === 0) {
        throw new Error('Failed to generate names from backend API');
      }

      // Create session data with backend response
      const sessionId = response.sessionId || Date.now().toString();
      const sessionData = {
        formData,
        results: response.names,
        sessionId: sessionId,
        sessionToken: response.sessionToken,
        metadata: response.metadata,
        timestamp: new Date().toISOString(),
        backendGenerated: true,
        phase3Enhanced: true
      };
      
      console.log('ð¾ Saving Phase 3 session data:', sessionId, sessionData);
      
      // Store in localStorage with error handling
      try {
        localStorage.setItem(`naming_session_${sessionId}`, JSON.stringify(sessionData));
        console.log('â Phase 3 session data saved to localStorage');
        
        // Verify the data was saved
        const savedData = localStorage.getItem(`naming_session_${sessionId}`);
        if (!savedData) {
          throw new Error('Failed to save session data');
        }
        
      } catch (storageError) {
        console.error('â Failed to save to localStorage:', storageError);
        // Continue anyway - results page can handle missing data
      }

      console.log('ð§­ Navigating to results with backend data:', `/results/${sessionId}`);
      
      // Navigate to results page
      navigate(`/results/${sessionId}`, { replace: true });

    } catch (error) {
      console.error('â Phase 3 name generation failed:', error);
      setError(error.message || 'Failed to generate names. Please try again.');
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.industry !== '';
      case 2: return formData.style !== '';
      case 3: return formData.keywords.length > 0;
      case 4: return true; // Review step - always can proceed if reached
      default: return false;
    }
  };
  
  const getValidationMessage = () => {
    switch (currentStep) {
      case 1: return 'Please select an industry to continue';
      case 2: return 'Please choose a style preference';
      case 3: return 'Please add at least one keyword';
      case 4: return 'Please review your selections';
      default: return 'Please complete this step';
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'What\'s your industry?';
      case 2: return 'What\'s your style?';
      case 3: return 'Add your keywords';
      case 4: return 'Review & Confirm';
      default: return 'Startup Name Generator';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Choose your industry for targeted name generation';
      case 2: return 'Select the style that matches your brand vision';
      case 3: return 'Add keywords that represent your startup (1-5 words)';
      case 4: return 'Review your selections and generate your startup names';
      default: return 'AI-powered startup naming tool';
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
          <h2 className="text-3xl font-bold text-white mb-4">AI is Creating Your Names</h2>
          <p className="text-white/80 mb-6">Connecting to our advanced backend AI system...</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Processing Steps:</h3>
            <div className="space-y-3">
              {[
                'Connecting to backend API...',
                'Processing your keywords with AI...',
                'Analyzing industry naming patterns...',
                'Generating brandable combinations...',
                'Calculating brandability scores...',
                'Finalizing intelligent recommendations!'
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.8 }}
                  className="text-left text-white/80 flex items-center space-x-3"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-white/60 text-sm">
            <p>Using Phase 2 backend infrastructure</p>
            <p>Enhanced with Phase 3 improvements</p>
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <div className="text-purple-300 text-sm font-semibold">Phase 3 Enhanced</div>
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
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full flex items-center justify-end pr-2"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            >
              {currentStep > 1 && (
                <CheckCircle className="w-4 h-4 text-white" />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 mb-8">
          <div className="max-w-4xl mx-auto">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">{getStepTitle()}</h2>
                  <p className="text-xl text-white/80">{getStepDescription()}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {industries.map((industry) => (
                    <motion.div
                      key={industry.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                        formData.industry === industry.id 
                          ? 'border-purple-400 shadow-lg bg-white/20' 
                          : 'border-transparent hover:bg-white/15'
                      }`}
                      onClick={() => setFormData({...formData, industry: industry.id})}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{industry.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{industry.name}</h3>
                          <p className="text-white/70 text-sm">{industry.desc}</p>
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
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">{getStepTitle()}</h2>
                  <p className="text-xl text-white/80">{getStepDescription()}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {styles.map((style) => (
                    <motion.div
                      key={style.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 ${
                        formData.style === style.id 
                          ? 'border-purple-400 shadow-lg bg-white/20' 
                          : 'border-transparent hover:bg-white/15'
                      }`}
                      onClick={() => setFormData({...formData, style: style.id})}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-4">{style.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{style.name}</h3>
                        <p className="text-white/70">{style.desc}</p>
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
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Hash className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">{getStepTitle()}</h2>
                  <p className="text-xl text-white/80">{getStepDescription()}</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <KeywordInput 
                      keywords={formData.keywords}
                      onAdd={handleKeywordAdd}
                      onRemove={handleKeywordRemove}
                      maxKeywords={5}
                    />
                    
                    <div className="mt-8">
                      <label className="block text-white font-medium mb-3">
                        Brief Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Tell us more about your startup idea..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/50 focus:border-transparent resize-none text-white placeholder-white/50"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review & Confirmation */}
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
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">{getStepTitle()}</h2>
                  <p className="text-xl text-white/80">{getStepDescription()}</p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Your Selections</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                          <span className="text-white/80">Industry:</span>
                          <span className="font-semibold text-white capitalize">
                            {industries.find(i => i.id === formData.industry)?.name || formData.industry}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                          <span className="text-white/80">Style:</span>
                          <span className="font-semibold text-white capitalize">
                            {styles.find(s => s.id === formData.style)?.name || formData.style}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white/10 rounded-xl">
                          <span className="text-white/80 block mb-2">Keywords:</span>
                          <div className="flex flex-wrap gap-2">
                            {formData.keywords.map(keyword => (
                              <span key={keyword} className="bg-purple-400/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {formData.description && (
                          <div className="p-4 bg-white/10 rounded-xl">
                            <span className="text-white/80 block mb-2">Description:</span>
                            <p className="text-white text-sm">{formData.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                      <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                        <Star className="w-5 h-5" />
                        <span>What you'll get:</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-white/80 text-sm">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>50 AI-generated startup names</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Brandability scores for each name</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Industry-specific analysis</span>
                          </li>
                        </ul>
                        <ul className="space-y-2 text-white/80 text-sm">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Domain availability insights</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Naming recommendations</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Professional results page</span>
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
                      ? 'bg-purple-400' 
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
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === totalSteps ? 'Generate Names' : 'Next'}</span>
              {currentStep === totalSteps ? <Star className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Keyword Input Component
const KeywordInput = ({ keywords, onAdd, onRemove, maxKeywords = 5 }) => {
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
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/50 focus:border-transparent text-white placeholder-white/50"
            maxLength={25}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || keywords.length >= maxKeywords}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              inputValue.trim() && keywords.length < maxKeywords
                ? 'bg-purple-500 text-white hover:bg-purple-600'
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
            className="flex items-center space-x-2 bg-purple-400/20 text-purple-300 px-4 py-2 rounded-full border border-purple-400/30"
          >
            <span className="font-medium">{keyword}</span>
            <button
              onClick={() => onRemove(keyword)}
              className="text-purple-300/70 hover:text-purple-300 transition-colors font-bold"
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

export default EnhancedNamingToolPhase3;