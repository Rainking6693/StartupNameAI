// Phase 4 Payment Service for StartupNamer.org
// Handles freemium conversion and package-based payments

import { loadStripe } from '@stripe/stripe-js';

class PaymentServicePhase4 {
  constructor() {
    this.stripe = null;
    this.stripePromise = null;
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

    this.initializeStripe();

    console.log('💳 Phase 4 Payment Service initialized');
  }

  // Initialize Stripe
  async initializeStripe() {
    try {
      this.stripePromise = loadStripe(this.publishableKey);
      this.stripe = await this.stripePromise;
      console.log('✅ Stripe initialized successfully');
    } catch (error) {
      console.error('❌ Stripe initialization failed:', error);
    }
  }

  // Get Stripe instance
  async getStripe() {
    if (!this.stripe) {
      this.stripe = await this.stripePromise;
    }
    return this.stripe;
  }

  // API Helper Methods
  async apiRequest(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}/api/payments/phase4${endpoint}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Create checkout session for package purchase
  async createCheckoutSession(sessionId, packageId, customerEmail, customerName = 'Startup Founder') {
    try {
      console.log('🛒 Creating Phase 4 checkout session:', { sessionId, packageId, customerEmail });

      const result = await this.apiRequest('/create-checkout', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          packageId,
          customerEmail,
          customerName,
          successUrl: `${window.location.origin}/results/${sessionId}?payment=success&package=${packageId}`,
          cancelUrl: `${window.location.origin}/results/${sessionId}?payment=cancelled`
        })
      });

      console.log('✅ Checkout session created:', result);
      return result;
    } catch (error) {
      console.error('❌ Checkout session creation failed:', error);
      throw error;
    }
  }

  // Redirect to Stripe checkout for package purchase
  async redirectToCheckout(sessionId, packageId, customerEmail, customerName) {
    try {
      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { data } = await this.createCheckoutSession(sessionId, packageId, customerEmail, customerName);

      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;

      console.log('✅ Redirected to checkout');
    } catch (error) {
      console.error('❌ Checkout redirect failed:', error);
      throw error;
    }
  }

  // Get payment status for a session
  async getSessionPaymentStatus(sessionId) {
    try {
      console.log('📋 Getting payment status for session:', sessionId);

      const result = await this.apiRequest(`/session/${sessionId}`, {
        method: 'GET'
      });

      console.log('✅ Payment status retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Payment status retrieval failed:', error);
      throw error;
    }
  }

  // Get available packages
  async getPackages() {
    try {
      console.log('📦 Getting available packages');

      const result = await this.apiRequest('/packages', {
        method: 'GET'
      });

      console.log('✅ Packages retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Package retrieval failed:', error);
      throw error;
    }
  }

  // Upgrade existing session
  async upgradeSession(sessionId, packageId, customerEmail, customerName) {
    try {
      console.log('⬆️ Upgrading session:', { sessionId, packageId });

      const result = await this.apiRequest('/upgrade-session', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          packageId,
          customerEmail,
          customerName
        })
      });

      console.log('✅ Session upgrade initiated:', result);
      return result;
    } catch (error) {
      console.error('❌ Session upgrade failed:', error);
      throw error;
    }
  }

  // Handle payment success
  handlePaymentSuccess(sessionId, packageId) {
    console.log('✅ Payment successful:', { sessionId, packageId });

    // Update local storage to reflect premium status
    this.updateUserPremiumStatus(packageId);

    // Track conversion
    this.trackConversion(sessionId, packageId);

    // Show success message
    this.showPaymentSuccessMessage(packageId);

    return true;
  }

  // Handle payment cancellation
  handlePaymentCancellation(sessionId) {
    console.log('❌ Payment cancelled for session:', sessionId);

    // Track cancellation
    this.trackCancellation(sessionId);

    // Show cancellation message
    this.showCancellationMessage();

    return false;
  }

  // Update user premium status
  updateUserPremiumStatus(packageId) {
    const tierMap = {
      'basic': 'basic',
      'premium': 'pro',
      'enterprise': 'enterprise'
    };

    const tier = tierMap[packageId] || 'pro';
    
    localStorage.setItem('startupnamer_user_tier', tier);
    localStorage.setItem('startupnamer_package_id', packageId);
    localStorage.setItem('startupnamer_premium_activated', new Date().toISOString());
    
    console.log('👤 User premium status updated to:', tier, 'with package:', packageId);
  }

  // Check if user has premium access
  isPremiumUser() {
    const tier = localStorage.getItem('startupnamer_user_tier');
    return tier && tier !== 'free';
  }

  // Get user's current package
  getUserPackage() {
    return localStorage.getItem('startupnamer_package_id') || null;
  }

  // Get user's tier
  getUserTier() {
    return localStorage.getItem('startupnamer_user_tier') || 'free';
  }

  // Track conversion analytics
  trackConversion(sessionId, packageId) {
    console.log('📈 Conversion tracked:', { sessionId, packageId });
    
    // Track with analytics service if available
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: sessionId,
        value: this.getPackagePrice(packageId),
        currency: 'USD',
        items: [{
          item_id: packageId,
          item_name: `StartupNamer ${packageId} Package`,
          category: 'naming_package',
          quantity: 1,
          price: this.getPackagePrice(packageId)
        }]
      });
    }

    // Track with custom analytics
    if (window.analytics) {
      window.analytics.track('Package Purchased', {
        sessionId,
        packageId,
        price: this.getPackagePrice(packageId),
        timestamp: new Date().toISOString()
      });
    }
  }

  // Track cancellation analytics
  trackCancellation(sessionId) {
    console.log('📉 Cancellation tracked:', sessionId);
    
    if (window.gtag) {
      window.gtag('event', 'checkout_abandoned', {
        session_id: sessionId,
        step: 'payment'
      });
    }

    if (window.analytics) {
      window.analytics.track('Payment Cancelled', {
        sessionId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get package price (in dollars)
  getPackagePrice(packageId) {
    const prices = {
      'basic': 2.99,
      'premium': 9.99,
      'enterprise': 29.99
    };
    return prices[packageId] || 0;
  }

  // Show payment success message
  showPaymentSuccessMessage(packageId) {
    const packageName = packageId.charAt(0).toUpperCase() + packageId.slice(1);
    
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-semibold">Payment Successful!</span>
      </div>
      <p class="text-sm mt-1">Your ${packageName} package is now active.</p>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Show cancellation message
  showCancellationMessage() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <span class="font-semibold">Payment Cancelled</span>
      </div>
      <p class="text-sm mt-1">You can upgrade anytime to unlock all features.</p>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Format amount for display
  formatAmount(amount) {
    return (amount / 100).toFixed(2);
  }

  // Get package features
  getPackageFeatures(packageId) {
    const features = {
      basic: [
        'All generated names',
        'Basic brandability analysis',
        'Copy and export functionality',
        'Domain suggestions',
        'Email support'
      ],
      premium: [
        'All generated names + bonus variations',
        'Advanced brandability analysis',
        'Domain checking and availability',
        'PDF export with branding guide',
        'Priority customer support',
        'Trademark screening guidance'
      ],
      enterprise: [
        'Everything in Premium',
        'Custom logo concepts',
        'Trademark screening guidance',
        'White-label rights',
        'Dedicated account manager',
        'Custom branding consultation'
      ]
    };

    return features[packageId] || features.basic;
  }

  // Clear premium status (for testing)
  clearPremiumStatus() {
    localStorage.removeItem('startupnamer_user_tier');
    localStorage.removeItem('startupnamer_package_id');
    localStorage.removeItem('startupnamer_premium_activated');
    console.log('🔄 Premium status cleared');
  }
}

// Create and export singleton instance
const paymentServicePhase4 = new PaymentServicePhase4();
export default paymentServicePhase4;