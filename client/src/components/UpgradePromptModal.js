import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Crown,
  Lock,
  Sparkles,
  Star,
  X,
  Zap
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import premiumService from '../services/premiumService';

const UpgradePromptModal = ({ isOpen, onClose, feature, context, currentAction }) => {
  const navigate = useNavigate();

  const featureDetails = {
    premiumAnalysis: {
      title: 'Premium AI Analysis',
      description: 'Get detailed brandability insights, competitor analysis, and market intelligence',
      icon: Sparkles,
      benefits: [
        'Advanced brandability scoring',
        'Competitor landscape analysis',
        'Market trend insights',
        'Psychological triggers analysis'
      ]
    },
    exportPdf: {
      title: 'PDF Export',
      description: 'Export your name analysis to professional PDF reports',
      icon: CheckCircle,
      benefits: [
        'Professional PDF reports',
        'Brand strategy insights',
        'Market analysis data',
        'Executive summary'
      ]
    },
    trademarkCheck: {
      title: 'Trademark Screening',
      description: 'Advanced trademark screening to protect your brand',
      icon: Lock,
      benefits: [
        'Global trademark database check',
        'Conflict risk assessment',
        'Legal compliance guidance',
        'Trademark filing recommendations'
      ]
    },
    customStyles: {
      title: 'Custom Naming Styles',
      description: 'Access to premium naming styles and creative techniques',
      icon: Star,
      benefits: [
        '8 creative naming techniques',
        'Industry-specific patterns',
        'Custom brand personality',
        'Advanced linguistic analysis'
      ]
    },
    unlimitedGenerations: {
      title: 'Unlimited Generations',
      description: 'Generate unlimited names without monthly limits',
      icon: Zap,
      benefits: [
        'No monthly generation limits',
        'Unlimited name variations',
        'Bulk name generation',
        'Priority processing'
      ]
    }
  };

  const featureInfo = featureDetails[feature] || featureDetails.premiumAnalysis;
  const FeatureIcon = featureInfo.icon;

  const handleUpgrade = () => {
    // Track upgrade click
    premiumService.trackUpgradeAttempt(context, feature);

    // Get upgrade URL and navigate
    const upgradeUrl = premiumService.getUpgradeUrl(context);
    navigate(upgradeUrl);

    // Close modal
    onClose();
  };

  const handleContinueFree = () => {
    // Execute current action if provided (with limitations)
    if (currentAction) {
      currentAction();
    }

    // Close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <FeatureIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Unlock {featureInfo.title}</h2>
                <p className="text-gray-600">{featureInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
              <div className="space-y-3">
                {featureInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Pro Plan Features:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <div className="font-medium">100 names/month</div>
                  <div className="text-gray-500">vs 10 free</div>
                </div>
                <div>
                  <div className="font-medium">All industries</div>
                  <div className="text-gray-500">vs 3 free</div>
                </div>
                <div>
                  <div className="font-medium">Premium analysis</div>
                  <div className="text-gray-500">vs basic only</div>
                </div>
                <div>
                  <div className="font-medium">Trademark check</div>
                  <div className="text-gray-500">not available free</div>
                </div>
              </div>
            </div>

            {/* Current Usage */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">This month's usage</span>
                <span className="text-sm text-gray-500">
                  {premiumService.getUsageThisMonth()}/10 names used
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${premiumService.getUsagePercentage()}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {premiumService.getRemainingGenerations()} names remaining this month
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleContinueFree}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Continue with Free Plan
              </button>
              <button
                onClick={handleUpgrade}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>30-day money back</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant access</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpgradePromptModal;
