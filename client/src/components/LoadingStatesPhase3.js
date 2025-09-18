import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu,
  Star,
  CheckCircle,
  Zap,
  Target,
  Lightbulb,
  Rocket,
  Crown
} from 'lucide-react';

// Enhanced Loading States for Phase 3

// Primary loading component with realistic timing
export const NameGenerationLoader = ({ stage = 'connecting', progress = 0 }) => {
  const stages = {
    connecting: {
      title: 'Connecting to AI Backend',
      subtitle: 'Establishing secure connection to our naming servers...',
      icon: Zap,
      color: 'from-blue-400 to-cyan-400'
    },
    processing: {
      title: 'AI is Analyzing Your Input',
      subtitle: 'Processing keywords and industry patterns...',
      icon: Star,
      color: 'from-purple-400 to-pink-400'
    },
    generating: {
      title: 'Creating Your Startup Names',
      subtitle: 'Advanced algorithms generating brandable combinations...',
      icon: Star,
      color: 'from-green-400 to-emerald-400'
    },
    scoring: {
      title: 'Calculating Brandability Scores',
      subtitle: 'Analyzing each name for market potential...',
      icon: Target,
      color: 'from-yellow-400 to-orange-400'
    },
    finalizing: {
      title: 'Finalizing Your Results',
      subtitle: 'Preparing your professional naming report...',
      icon: Crown,
      color: 'from-indigo-400 to-purple-400'
    }
  };

  const currentStage = stages[stage] || stages.connecting;
  const IconComponent = currentStage.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            rotate: stage === 'connecting' ? 360 : 0,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className={`w-24 h-24 bg-gradient-to-r ${currentStage.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl`}
        >
          <IconComponent className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title and Subtitle */}
        <motion.h2 
          key={stage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-4"
        >
          {currentStage.title}
        </motion.h2>
        
        <motion.p 
          key={`${stage}-subtitle`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/80 mb-8 text-lg"
        >
          {currentStage.subtitle}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-8">
          <motion.div
            className={`bg-gradient-to-r ${currentStage.color} h-3 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Processing Steps */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Processing Pipeline:</h3>
          <ProcessingSteps currentStage={stage} />
        </div>
        
        {/* Status Info */}
        <div className="text-white/60 text-sm space-y-1">
          <p>Using Phase 2 backend infrastructure</p>
          <p>Enhanced with Phase 3 improvements</p>
          <p className="font-semibold text-white/80">{progress}% Complete</p>
        </div>
      </div>
    </div>
  );
};

// Processing steps component
const ProcessingSteps = ({ currentStage }) => {
  const steps = [
    { id: 'connecting', label: 'Connecting to backend API', icon: Zap },
    { id: 'processing', label: 'Processing keywords with AI', icon: Star },
    { id: 'generating', label: 'Generating brandable combinations', icon: Lightbulb },
    { id: 'scoring', label: 'Calculating brandability scores', icon: Target },
    { id: 'finalizing', label: 'Preparing results', icon: Rocket }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStage);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const IconComponent = step.icon;
        
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
              isCompleted ? 'bg-green-500/20' :
              isCurrent ? 'bg-white/20' : 'bg-white/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-500' :
              isCurrent ? 'bg-white/30' : 'bg-white/10'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <IconComponent className={`w-4 h-4 ${
                  isCurrent ? 'text-white' : 'text-white/50'
                }`} />
              )}
            </div>
            <span className={`text-sm ${
              isCompleted ? 'text-green-300' :
              isCurrent ? 'text-white' : 'text-white/60'
            }`}>
              {step.label}
            </span>
            {isCurrent && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-auto"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// Compact loading spinner for inline use
export const InlineLoader = ({ size = 'md', color = 'white' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizes[size]} border-2 border-${color}/20 border-t-${color} rounded-full`}
    />
  );
};

// Success animation component
export const SuccessAnimation = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-full p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Error state component
export const ErrorState = ({ error, onRetry, onGoBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <span className="text-4xl">⚠️</span>
          </motion.div>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Generation Failed</h2>
        <p className="text-white/80 mb-6">{error}</p>
        
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onGoBack}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Step transition animation
export const StepTransition = ({ children, direction = 'forward' }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: direction === 'forward' ? 50 : -50 
      }}
      animate={{ 
        opacity: 1, 
        x: 0 
      }}
      exit={{ 
        opacity: 0, 
        x: direction === 'forward' ? -50 : 50 
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Progress indicator for wizard steps
export const WizardProgress = ({ currentStep, totalSteps, stepTitles = [] }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/80">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-white/80">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-3 mb-4">
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
      
      {stepTitles.length > 0 && (
        <div className="flex justify-between text-xs text-white/60">
          {stepTitles.map((title, index) => (
            <span 
              key={index}
              className={index + 1 <= currentStep ? 'text-white/80 font-medium' : ''}
            >
              {title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Floating action button with loading state
export const FloatingActionButton = ({ 
  onClick, 
  loading = false, 
  disabled = false, 
  children,
  className = ''
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative overflow-hidden
        ${disabled || loading 
          ? 'bg-white/20 text-white/40 cursor-not-allowed' 
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
        }
        font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <InlineLoader size="sm" />
            <span>Processing...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default {
  NameGenerationLoader,
  InlineLoader,
  SuccessAnimation,
  ErrorState,
  StepTransition,
  WizardProgress,
  FloatingActionButton
};