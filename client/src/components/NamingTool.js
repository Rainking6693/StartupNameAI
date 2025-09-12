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
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AINameGenerator from '../utils/aiNamingEngine';
import DomainService from '../utils/domainService';

const NamingTool = () => {
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

  const totalSteps = 4;

  // Industry options
  const industries = [
    { id: 'tech', name: 'Technology', icon: '💻', desc: 'SaaS, apps, software platforms' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', desc: 'Medical, wellness, fitness' },
    { id: 'fintech', name: 'FinTech', icon: '💳', desc: 'Banking, payments, crypto' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒', desc: 'Online retail, marketplaces' },
    { id: 'education', name: 'Education', icon: '🎓', desc: 'EdTech, learning, training' },
    { id: 'food', name: 'Food & Beverage', icon: '🍽️', desc: 'Restaurants, delivery, food tech' },
    { id: 'travel', name: 'Travel', icon: '✈️', desc: 'Tourism, booking, hospitality' },
    { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', desc: 'AI, machine learning, automation' }
  ];

  // Style preferences
  const styles = [
    { id: 'modern', name: 'Modern', icon: '⚡', desc: 'Clean, tech-forward, innovative' },
    { id: 'classic', name: 'Classic', icon: '🏛️', desc: 'Timeless, established, trustworthy' },
    { id: 'creative', name: 'Creative', icon: '🎨', desc: 'Unique, artistic, memorable' },
    { id: 'professional', name: 'Professional', icon: '💼', desc: 'Corporate, enterprise-ready' }
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
    console.log('🚀 GENERATE CLICKED - Starting AI naming process...');
    setIsLoading(true);
    setError('');
    
    try {
      console.log('📊 Form data to process:', formData);
      
      // Validate form data
      if (!formData.industry || !formData.style || formData.keywords.length === 0) {
        throw new Error('Please complete all required fields');
      }
      
      // Initialize AI naming engine
      const aiGenerator = new AINameGenerator();
      
      // Prepare input for AI engine
      const aiInput = {
        industry: formData.industry,
        keywords: formData.keywords,
        style: formData.style,
        targetAudience: formData.industry === 'tech' || formData.industry === 'fintech' ? 'b2b' : 'b2c',
        brandPersonality: formData.style === 'modern' ? 'innovation' : 
                         formData.style === 'creative' ? 'growth' : 
                         formData.style === 'professional' ? 'power' : 'connection'
      };
      
      console.log('🤖 Generating AI-powered names with input:', aiInput);
      
      // Generate names using sophisticated AI algorithms
      const generatedNames = aiGenerator.generateNames(aiInput);
      console.log('✅ AI generated names:', generatedNames);
      
      if (!generatedNames || generatedNames.length === 0) {
        throw new Error('AI failed to generate names. Please try different keywords.');
      }

      // Create session data
      const sessionId = Date.now().toString();
      const sessionData = {
        formData,
        results: generatedNames,
        timestamp: new Date().toISOString(),
        aiGenerated: true
      };
      
      console.log('💾 Saving AI session data:', sessionId, sessionData);
      
      // Store in localStorage with error handling
      try {
        localStorage.setItem(`naming_session_${sessionId}`, JSON.stringify(sessionData));
        console.log('✅ AI session data saved to localStorage');
        
        // Verify the data was saved
        const savedData = localStorage.getItem(`naming_session_${sessionId}`);
        if (!savedData) {
          throw new Error('Failed to save session data');
        }
        
      } catch (storageError) {
        console.error('❌ Failed to save to localStorage:', storageError);
        // Continue anyway - results page can handle missing data
      }

      console.log('🧭 Attempting navigation to:', `/results/${sessionId}`);
      
      // Navigate immediately - no need for delay
      navigate(`/results/${sessionId}`, { replace: true });

    } catch (error) {
      console.error('❌ AI name generation failed:', error);
      setError(error.message || 'Failed to generate names. Please try again.');
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
            className="w-16 h-16 bg-gradient-to-r from-white to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Cpu className="w-8 h-8 text-purple-900" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">AI is Creating Your Names</h2>
          <p className="text-white/80">Advanced algorithms analyzing your requirements...</p>
          
          <div className="mt-8 space-y-2 max-w-md mx-auto">
            {[
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
                className="text-left text-white/70 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4 text-green-400" />
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
      {/* Header */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
