// Premium Feature Management Service
// Handles premium feature gates, user tiers, and upgrade flows

class PremiumService {
  constructor() {
    this.userTier = this.getUserTier();
    this.featureLimits = this.getFeatureLimits();
    this.upgradeUrls = {
      pro: '/pricing?plan=pro',
      enterprise: '/pricing?plan=enterprise',
      analysis: '/pricing?source=analysis&feature=premium-analysis',
      domain: '/pricing?source=domain&feature=domain-reservation',
      export: '/pricing?source=export&feature=pdf-export'
    };

    console.log('💎 Premium Service initialized');
    console.log('👤 User tier:', this.userTier);
    console.log('🔒 Feature limits:', this.featureLimits);
  }

  // User Tier Management
  getUserTier() {
    // In a real app, this would come from user authentication
    // For now, we'll simulate different tiers for testing
    const storedTier = localStorage.getItem('startupnamer_user_tier');

    if (storedTier) {
      return storedTier;
    }

    // Default to free tier
    return 'free';
  }

  setUserTier(tier) {
    localStorage.setItem('startupnamer_user_tier', tier);
    this.userTier = tier;
    this.featureLimits = this.getFeatureLimits();

    console.log('👤 User tier updated to:', tier);
  }

  // Feature Limits Configuration
  getFeatureLimits() {
    const limits = {
      free: {
        nameGenerationsPerMonth: 10,
        maxNamesPerGeneration: 5,
        industriesSupported: ['tech', 'health', 'fintech'],
        features: {
          basicAnalysis: true,
          domainCheck: true,
          exportPdf: false,
          premiumAnalysis: false,
          trademarkCheck: false,
          customStyles: false,
          prioritySupport: false,
          unlimitedGenerations: false
        }
      },
      pro: {
        nameGenerationsPerMonth: 100,
        maxNamesPerGeneration: 50,
        industriesSupported: ['tech', 'health', 'fintech', 'ecommerce', 'saas', 'education'],
        features: {
          basicAnalysis: true,
          domainCheck: true,
          exportPdf: true,
          premiumAnalysis: true,
          trademarkCheck: true,
          customStyles: true,
          prioritySupport: true,
          unlimitedGenerations: false
        }
      },
      enterprise: {
        nameGenerationsPerMonth: -1, // Unlimited
        maxNamesPerGeneration: 500,
        industriesSupported: 'all',
        features: {
          basicAnalysis: true,
          domainCheck: true,
          exportPdf: true,
          premiumAnalysis: true,
          trademarkCheck: true,
          customStyles: true,
          prioritySupport: true,
          unlimitedGenerations: true
        }
      }
    };

    return limits[this.userTier] || limits.free;
  }

  // Feature Access Control
  canAccessFeature(feature) {
    return this.featureLimits.features[feature] || false;
  }

  canGenerateNames(count = 1) {
    if (this.featureLimits.unlimitedGenerations) {
      return true;
    }

    const used = this.getUsageThisMonth();
    const remaining = this.featureLimits.nameGenerationsPerMonth - used;

    return remaining >= count;
  }

  canGenerateCount(count) {
    return count <= this.featureLimits.maxNamesPerGeneration;
  }

  canAccessIndustry(industry) {
    if (this.featureLimits.industriesSupported === 'all') {
      return true;
    }

    return this.featureLimits.industriesSupported.includes(industry);
  }

  // Usage Tracking
  getUsageThisMonth() {
    const usageKey = `startupnamer_usage_${new Date().getFullYear()}_${new Date().getMonth()}`;
    const usage = localStorage.getItem(usageKey);

    return usage ? parseInt(usage) : 0;
  }

  incrementUsage(count = 1) {
    const usageKey = `startupnamer_usage_${new Date().getFullYear()}_${new Date().getMonth()}`;
    const currentUsage = this.getUsageThisMonth();
    const newUsage = currentUsage + count;

    localStorage.setItem(usageKey, newUsage.toString());

    console.log('📊 Usage incremented:', count, 'Total this month:', newUsage);
  }

  // Upgrade Flow Management
  getUpgradeUrl(context = 'general') {
    return this.upgradeUrls[context] || this.upgradeUrls.pro;
  }

  triggerUpgradeFlow(context, feature, currentAction) {
    console.log('🚀 Triggering upgrade flow:', { context, feature, currentAction });

    // Track upgrade attempt
    this.trackUpgradeAttempt(context, feature);

    // Get appropriate upgrade URL
    const upgradeUrl = this.getUpgradeUrl(context);

    // Store context for post-upgrade experience
    this.storeUpgradeContext(context, feature, currentAction);

    return upgradeUrl;
  }

  storeUpgradeContext(context, feature, currentAction) {
    const upgradeContext = {
      context,
      feature,
      currentAction,
      timestamp: new Date().toISOString(),
      returnUrl: window.location.href
    };

    localStorage.setItem('startupnamer_upgrade_context', JSON.stringify(upgradeContext));
  }

  getUpgradeContext() {
    const context = localStorage.getItem('startupnamer_upgrade_context');
    return context ? JSON.parse(context) : null;
  }

  clearUpgradeContext() {
    localStorage.removeItem('startupnamer_upgrade_context');
  }

  // Analytics and Tracking
  trackUpgradeAttempt(context, feature) {
    // In a real app, this would send to analytics service
    console.log('📈 Upgrade attempt tracked:', { context, feature, userTier: this.userTier });

    // Track in localStorage for debugging
    const attempts = JSON.parse(localStorage.getItem('startupnamer_upgrade_attempts') || '[]');
    attempts.push({
      context,
      feature,
      userTier: this.userTier,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('startupnamer_upgrade_attempts', JSON.stringify(attempts));
  }

  // Premium Feature Gates
  gateFeature(feature, fallbackAction, context = 'general') {
    if (this.canAccessFeature(feature)) {
      return true; // Allow access
    }

    // Show upgrade prompt
    this.showUpgradePrompt(feature, context);

    // Execute fallback action if provided
    if (fallbackAction) {
      fallbackAction();
    }

    return false; // Deny access
  }

  showUpgradePrompt(feature, context) {
    const featureNames = {
      premiumAnalysis: 'Premium AI Analysis',
      exportPdf: 'PDF Export',
      trademarkCheck: 'Trademark Screening',
      customStyles: 'Custom Naming Styles',
      prioritySupport: 'Priority Support',
      unlimitedGenerations: 'Unlimited Generations'
    };

    const featureName = featureNames[feature] || 'Premium Feature';

    // Create upgrade prompt
    const upgradePrompt = {
      title: `Upgrade to Access ${featureName}`,
      message: `This feature is available in our Pro and Enterprise plans. Upgrade now to unlock ${featureName} and many more premium features.`,
      action: 'Upgrade Now',
      context: context
    };

    // Store prompt for display
    this.storeUpgradePrompt(upgradePrompt);

    // Trigger upgrade flow
    const upgradeUrl = this.triggerUpgradeFlow(context, feature);

    // In a real app, this would show a modal or navigate
    console.log('💎 Upgrade prompt:', upgradePrompt);
    console.log('🔗 Upgrade URL:', upgradeUrl);

    return upgradePrompt;
  }

  storeUpgradePrompt(prompt) {
    localStorage.setItem('startupnamer_upgrade_prompt', JSON.stringify(prompt));
  }

  getUpgradePrompt() {
    const prompt = localStorage.getItem('startupnamer_upgrade_prompt');
    return prompt ? JSON.parse(prompt) : null;
  }

  clearUpgradePrompt() {
    localStorage.removeItem('startupnamer_upgrade_prompt');
  }

  // Utility Methods
  isFreeUser() {
    return this.userTier === 'free';
  }

  isProUser() {
    return this.userTier === 'pro';
  }

  isEnterpriseUser() {
    return this.userTier === 'enterprise';
  }

  getRemainingGenerations() {
    if (this.featureLimits.unlimitedGenerations) {
      return 'unlimited';
    }

    const used = this.getUsageThisMonth();
    const remaining = this.featureLimits.nameGenerationsPerMonth - used;

    return Math.max(0, remaining);
  }

  getUsagePercentage() {
    if (this.featureLimits.unlimitedGenerations) {
      return 0;
    }

    const used = this.getUsageThisMonth();
    const total = this.featureLimits.nameGenerationsPerMonth;

    return Math.round((used / total) * 100);
  }

  // Feature Status Helpers
  getFeatureStatus() {
    return {
      tier: this.userTier,
      limits: this.featureLimits,
      usage: {
        used: this.getUsageThisMonth(),
        remaining: this.getRemainingGenerations(),
        percentage: this.getUsagePercentage()
      },
      canUpgrade: this.isFreeUser() || this.isProUser()
    };
  }
}

// Create and export singleton instance
const premiumService = new PremiumService();
export default premiumService;
