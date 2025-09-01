import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus,
  X,
  Check,
  AlertCircle,
  Zap,
  Cpu,
  Target,
  Star,
  Building,
  Clock,
  Lightbulb
} from 'lucide-react';

/**
 * Mobile-First Form Component
 * Optimized for touch interaction, accessibility, and mobile keyboards
 * Features 44px+ touch targets, proper ARIA labels, and keyboard navigation
 */
const MobileForm = ({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false,
  className = "" 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    keywords: [],
    industry: '',
    style: '',
    description: '',
    ...initialData
  });
  const [errors, setErrors] = useState({});
  const [keywordInput, setKeywordInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  // Refs for auto-focus and keyboard navigation
  const keywordInputRef = useRef(null);
  const descriptionRef = useRef(null);
  const stepRefs = useRef({});

  const totalSteps = 4;

  // Industry options with mobile-friendly icons and descriptions
  const industries = [
    { 
      id: 'tech', 
      name: 'Technology', 
      icon: '💻', 
      desc: 'SaaS, apps, software platforms',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'health', 
      name: 'Healthcare', 
      icon: '🏥', 
      desc: 'Medical, wellness, fitness',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'fintech', 
      name: 'FinTech', 
      icon: '💳', 
      desc: 'Banking, payments, crypto',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'ecommerce', 
      name: 'E-commerce', 
      icon: '🛒', 
      desc: 'Online retail, marketplaces',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: '🎓', 
      desc: 'EdTech, learning, training',
      color: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'food', 
      name: 'Food & Beverage', 
      icon: '🍽️', 
      desc: 'Restaurants, delivery, food tech',
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'travel', 
      name: 'Travel', 
      icon: '✈️', 
      desc: 'Tourism, booking, hospitality',
      color: 'from-sky-500 to-blue-500'
    },
    { 
      id: 'other', 
      name: 'Other', 
      icon: '🎯', 
      desc: 'Tell us more about your industry',
      color: 'from-slate-500 to-gray-500'
    }
  ];

  // Style preferences with visual indicators
  const styles = [
    { 
      id: 'modern', 
      name: 'Modern', 
      icon: Zap, 
      desc: 'Clean, tech-forward, innovative',
      example: 'TechFlow, DataSync, CloudVault'
    },
    { 
      id: 'classic', 
      name: 'Classic', 
      icon: Building, 
      desc: 'Timeless, established, trustworthy',
      example: 'Sterling & Co, Heritage Group'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      icon: Star, 
      desc: 'Unique, artistic, memorable',
      example: 'WhimsiCorp, DreamCraft'
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      icon: Target, 
      desc: 'Corporate, enterprise-ready',
      example: 'ProVision, CoreLogic'
    }
  ];

  // Auto-focus on step change
  useEffect(() => {
    const timeout = setTimeout(() => {
      const stepRef = stepRefs.current[currentStep];
      if (stepRef && stepRef.focus) {
        stepRef.focus();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (formData.keywords.length === 0) {
          newErrors.keywords = 'Add at least one keyword to describe your startup';
        }
        break;
      case 2:
        if (!formData.industry) {
          newErrors.industry = 'Please select an industry';
        }
        break;
      case 3:
        if (!formData.style) {
          newErrors.style = 'Please select a naming style';
        }
        break;
      case 4:
        if (!formData.description.trim()) {
          newErrors.description = 'Please describe what your startup does';
        } else if (formData.description.trim().length < 10) {
          newErrors.description = 'Please provide a more detailed description (at least 10 characters)';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Keyword management
  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && formData.keywords.length < 5 && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
      setKeywordInput('');
      setErrors(prev => ({ ...prev, keywords: undefined }));
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keywordToRemove)
    }));
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // Navigation functions
  const handleNext = async () => {
    setIsValidating(true);
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
    
    setIsValidating(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Step rendering functions
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax={totalSteps} aria-label={`Step ${currentStep} of ${totalSteps}`}>
      {[...Array(totalSteps)].map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        
        return (
          <React.Fragment key={step}>
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              isActive 
                ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-110' 
                : isCompleted 
                ? 'border-green-500 bg-green-500 text-white' 
                : 'border-slate-300 bg-white text-slate-400'
            }`}>
              {isCompleted ? (
                <Check className="w-5 h-5" aria-hidden="true" />
              ) : (
                <span className="text-sm font-semibold">{step}</span>
              )}
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping" aria-hidden="true"></div>
              )}
            </div>
            {step < totalSteps && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                step < currentStep ? 'bg-green-500' : 'bg-slate-200'
              }`} aria-hidden="true"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Lightbulb className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">What describes your startup?</h2>
        <p className="text-slate-600">Add keywords that capture the essence of your business idea</p>
      </div>

      <div className="space-y-4">
        <label htmlFor="keyword-input" className="form-label required">
          Keywords (up to 5)
        </label>
        
        <div className="flex gap-2">
          <input
            id="keyword-input"
            ref={keywordInputRef}
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={handleKeywordKeyPress}
            placeholder="e.g., AI, productivity, automation"
            className={`form-input flex-1 ${errors.keywords ? 'error' : ''}`}
            maxLength={30}
            aria-describedby="keyword-help keyword-error"
            autoComplete="off"
            autoCapitalize="words"
          />
          <button
            onClick={addKeyword}
            disabled={!keywordInput.trim() || formData.keywords.length >= 5}
            className="btn btn-primary touch-target"
            aria-label="Add keyword"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div id="keyword-help" className="form-help">
          Think about your industry, target audience, and unique value proposition
        </div>

        {errors.keywords && (
          <div id="keyword-error" className="form-error">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{errors.keywords}</span>
          </div>
        )}

        {/* Keyword tags */}
        <div className="flex flex-wrap gap-2 min-h-[3rem]" role="list" aria-label="Added keywords">
          {formData.keywords.map((keyword, index) => (
            <div
              key={keyword}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium border border-blue-200"
              role="listitem"
            >
              <span>{keyword}</span>
              <button
                onClick={() => removeKeyword(keyword)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded touch-target-sm"
                aria-label={`Remove ${keyword} keyword`}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          {formData.keywords.length === 0 && (
            <div className="text-slate-400 text-sm italic py-2">No keywords added yet</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Building className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">What's your industry?</h2>
        <p className="text-slate-600">Help us understand your market and target audience</p>
      </div>

      <fieldset>
        <legend className="form-label required mb-4">Select your industry</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {industries.map((industry) => (
            <label
              key={industry.id}
              className={`relative cursor-pointer touch-target-lg border-2 rounded-xl p-4 transition-all duration-200 ${
                formData.industry === industry.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <input
                type="radio"
                name="industry"
                value={industry.id}
                checked={formData.industry === industry.id}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, industry: e.target.value }));
                  setErrors(prev => ({ ...prev, industry: undefined }));
                }}
                className="sr-only"
                aria-describedby={`industry-${industry.id}-desc`}
              />
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${industry.color} rounded-lg flex items-center justify-center text-2xl shadow-sm flex-shrink-0`}>
                  {industry.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 mb-1">{industry.name}</div>
                  <div id={`industry-${industry.id}-desc`} className="text-sm text-slate-600 leading-tight">
                    {industry.desc}
                  </div>
                </div>
              </div>
              {formData.industry === industry.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
              )}
            </label>
          ))}
        </div>

        {errors.industry && (
          <div className="form-error mt-4">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{errors.industry}</span>
          </div>
        )}
      </fieldset>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Star className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Choose your style</h2>
        <p className="text-slate-600">What naming style best fits your brand personality?</p>
      </div>

      <fieldset>
        <legend className="form-label required mb-4">Select naming style</legend>
        <div className="space-y-3">
          {styles.map((style) => {
            const IconComponent = style.icon;
            return (
              <label
                key={style.id}
                className={`relative cursor-pointer touch-target-lg border-2 rounded-xl p-4 transition-all duration-200 ${
                  formData.style === style.id
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="style"
                  value={style.id}
                  checked={formData.style === style.id}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, style: e.target.value }));
                    setErrors(prev => ({ ...prev, style: undefined }));
                  }}
                  className="sr-only"
                  aria-describedby={`style-${style.id}-desc style-${style.id}-example`}
                />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 flex-shrink-0">
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 mb-1">{style.name}</div>
                    <div id={`style-${style.id}-desc`} className="text-sm text-slate-600 mb-2">
                      {style.desc}
                    </div>
                    <div id={`style-${style.id}-example`} className="text-xs text-slate-500 font-medium">
                      Examples: {style.example}
                    </div>
                  </div>
                </div>
                {formData.style === style.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                )}
              </label>
            );
          })}
        </div>

        {errors.style && (
          <div className="form-error mt-4">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{errors.style}</span>
          </div>
        )}
      </fieldset>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Tell us more</h2>
        <p className="text-slate-600">Describe what your startup does and who it serves</p>
      </div>

      <div className="space-y-4">
        <label htmlFor="description" className="form-label required">
          Business Description
        </label>
        <textarea
          id="description"
          ref={descriptionRef}
          value={formData.description}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, description: e.target.value }));
            setErrors(prev => ({ ...prev, description: undefined }));
          }}
          placeholder="We are building a platform that helps small businesses manage their social media presence through AI-powered content generation and automated scheduling..."
          className={`form-input resize-none ${errors.description ? 'error' : ''}`}
          rows={5}
          maxLength={500}
          aria-describedby="description-help description-error description-count"
          autoComplete="off"
        />
        
        <div className="flex items-center justify-between">
          <div id="description-help" className="form-help">
            Be specific about your target market and unique value proposition
          </div>
          <div id="description-count" className="text-xs text-slate-500">
            {formData.description.length}/500
          </div>
        </div>

        {errors.description && (
          <div id="description-error" className="form-error">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{errors.description}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg ${className}`}>
      {renderStepIndicator()}
      
      <div className="mb-8">
        {renderCurrentStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            disabled={isLoading || isValidating}
            className="btn btn-secondary flex-1 sm:flex-initial"
            aria-label="Go to previous step"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}
        
        <button
          onClick={handleNext}
          disabled={isLoading || isValidating}
          className={`btn btn-primary flex-1 ${isValidating || isLoading ? 'btn-loading' : ''}`}
          aria-label={currentStep === totalSteps ? 'Generate startup names' : 'Go to next step'}
        >
          {!isValidating && !isLoading && (
            <>
              <span>{currentStep === totalSteps ? 'Generate Names' : 'Continue'}</span>
              {currentStep === totalSteps ? (
                <Zap className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Progress text for screen readers */}
      <div className="sr-only" aria-live="polite">
        {isValidating && "Validating step..."}
        {isLoading && "Generating startup names..."}
      </div>
    </div>
  );
};

export default MobileForm;