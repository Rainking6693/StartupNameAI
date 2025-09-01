import React from 'react';
import { Zap, Star, Cpu, Target } from 'lucide-react';

/**
 * Comprehensive Loading States & Skeleton Screens
 * Mobile-optimized with accessibility and smooth animations
 */

// Primary loading spinner with multiple variants
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  'aria-label': ariaLabel = 'Loading'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-slate-200 border-t-blue-500',
    white: 'border-slate-300 border-t-white',
    slate: 'border-slate-300 border-t-slate-600'
  };

  return (
    <div
      className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Animated dots loader
export const DotsLoader = ({ 
  className = '',
  'aria-label': ariaLabel = 'Loading'
}) => (
  <div className={`flex items-center space-x-1 ${className}`} role="status" aria-label={ariaLabel}>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
    <span className="sr-only">{ariaLabel}</span>
  </div>
);

// Pulsing loader with icon
export const PulseLoader = ({ 
  icon: Icon = Zap, 
  text = 'Loading...', 
  className = '' 
}) => (
  <div className={`flex flex-col items-center space-y-4 ${className}`} role="status">
    <div className="relative">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
        <Icon className="w-8 h-8 text-white" aria-hidden="true" />
      </div>
      <div className="absolute inset-0 rounded-2xl border-2 border-blue-300 animate-ping opacity-75" aria-hidden="true"></div>
    </div>
    <p className="text-sm font-medium text-slate-600" aria-live="polite">{text}</p>
  </div>
);

// Skeleton components for different content types
export const SkeletonText = ({ 
  lines = 1, 
  className = '',
  animated = true 
}) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {[...Array(lines)].map((_, index) => (
      <div
        key={index}
        className={`h-4 bg-slate-200 rounded ${animated ? 'skeleton' : ''} ${
          index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const SkeletonButton = ({ 
  size = 'md',
  className = '',
  animated = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-11 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <div 
      className={`${sizeClasses[size]} bg-slate-200 rounded-lg ${animated ? 'skeleton' : ''} ${className}`}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard = ({ 
  className = '',
  animated = true,
  hasImage = true,
  hasButton = true 
}) => (
  <div className={`card p-6 ${className}`} aria-hidden="true">
    {hasImage && (
      <div className={`w-full h-48 bg-slate-200 rounded-lg mb-4 ${animated ? 'skeleton' : ''}`} />
    )}
    <div className={`h-6 bg-slate-200 rounded mb-2 ${animated ? 'skeleton' : ''}`} />
    <SkeletonText lines={3} className="mb-4" animated={animated} />
    {hasButton && (
      <SkeletonButton animated={animated} />
    )}
  </div>
);

// Specialized loading states for the app
export const NameGenerationLoader = ({ 
  stage = 'processing',
  className = '' 
}) => {
  const stages = {
    processing: {
      icon: Cpu,
      text: 'Analyzing your requirements...',
      color: 'from-blue-500 to-cyan-500'
    },
    generating: {
      icon: Star,
      text: 'Generating creative names...',
      color: 'from-purple-500 to-pink-500'
    },
    analyzing: {
      icon: Target,
      text: 'Checking domain availability...',
      color: 'from-green-500 to-emerald-500'
    },
    finalizing: {
      icon: Star,
      text: 'Finalizing your results...',
      color: 'from-yellow-500 to-orange-500'
    }
  };

  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  return (
    <div className={`text-center py-12 ${className}`} role="status">
      <div className="relative mb-6">
        <div className={`w-20 h-20 bg-gradient-to-br ${currentStage.color} rounded-3xl flex items-center justify-center mx-auto shadow-xl animate-pulse`}>
          <Icon className="w-10 h-10 text-white" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 rounded-3xl border-4 border-opacity-30 animate-ping" 
             style={{ borderColor: currentStage.color.split(' ')[1] }} aria-hidden="true"></div>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        AI is working its magic
      </h3>
      <p className="text-slate-600 mb-6" aria-live="polite">
        {currentStage.text}
      </p>
      
      {/* Progress dots */}
      <div className="flex justify-center space-x-2 mb-8">
        {Object.keys(stages).map((key, index) => {
          const isActive = Object.keys(stages).indexOf(stage) >= index;
          return (
            <div
              key={key}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-blue-500' : 'bg-slate-300'
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Estimated time */}
      <p className="text-xs text-slate-500">
        This usually takes 10-15 seconds
      </p>
    </div>
  );
};

// Result skeleton for name generation
export const NameResultsSkeleton = ({ 
  count = 6,
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`} aria-hidden="true">
    <div className="flex items-center justify-between mb-6">
      <div className="h-8 w-48 bg-slate-200 rounded skeleton" />
      <div className="h-6 w-24 bg-slate-200 rounded skeleton" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 w-32 bg-slate-200 rounded skeleton" />
            <div className="w-8 h-8 bg-slate-200 rounded-full skeleton" />
          </div>
          <div className="h-4 w-full bg-slate-200 rounded skeleton mb-2" />
          <div className="h-4 w-3/4 bg-slate-200 rounded skeleton mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-slate-200 rounded-full skeleton" />
            <div className="h-6 w-20 bg-slate-200 rounded-full skeleton" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Page loading skeleton
export const PageSkeleton = ({ className = '' }) => (
  <div className={`space-y-8 ${className}`} aria-hidden="true">
    {/* Header skeleton */}
    <div className="text-center space-y-4">
      <div className="h-12 w-64 bg-slate-200 rounded mx-auto skeleton" />
      <div className="h-4 w-96 bg-slate-200 rounded mx-auto skeleton" />
    </div>
    
    {/* Content skeleton */}
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <SkeletonCard key={index} animated={true} />
      ))}
    </div>
  </div>
);

// Error state component
export const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  action,
  className = '' 
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 mb-6">{message}</p>
    {action && action}
  </div>
);

// Empty state component
export const EmptyState = ({ 
  title = 'No results found',
  message = 'Try adjusting your search criteria.',
  action,
  className = '' 
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 mb-6">{message}</p>
    {action && action}
  </div>
);

// Success state component
export const SuccessState = ({ 
  title = 'Success!',
  message = 'Your request was completed successfully.',
  action,
  className = '' 
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 mb-6">{message}</p>
    {action && action}
  </div>
);