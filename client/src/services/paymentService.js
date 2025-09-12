// Frontend Payment Service for StartupNamer.org
// Handles Stripe integration, payment processing, and subscription management

import { loadStripe } from '@stripe/stripe-js';

class PaymentService {
  constructor() {
    this.stripe = null;
    this.stripePromise = null;
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

    this.initializeStripe();

    console.log('💳 Frontend Payment Service initialized');
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
    const url = `${this.apiBaseUrl}/api/payments${endpoint}`;

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

  // Create Payment Intent
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      console.log('💳 Creating payment intent:', { amount, currency, metadata });

      const result = await this.apiRequest('/create-intent', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          currency,
          metadata
        })
      });

      console.log('✅ Payment intent created:', result);
      return result;
    } catch (error) {
      console.error('❌ Payment intent creation failed:', error);
      throw error;
    }
  }

  // Create Customer
  async createCustomer(email, name, metadata = {}) {
    try {
      console.log('👤 Creating customer:', { email, name });

      const result = await this.apiRequest('/create-customer', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          metadata
        })
      });

      console.log('✅ Customer created:', result);
      return result;
    } catch (error) {
      console.error('❌ Customer creation failed:', error);
      throw error;
    }
  }

  // Create Subscription
  async createSubscription(customerId, planType, billingInterval = 'month') {
    try {
      console.log('📋 Creating subscription:', { customerId, planType, billingInterval });

      const result = await this.apiRequest('/create-subscription', {
        method: 'POST',
        body: JSON.stringify({
          customerId,
          planType,
          billingInterval
        })
      });

      console.log('✅ Subscription created:', result);
      return result;
    } catch (error) {
      console.error('❌ Subscription creation failed:', error);
      throw error;
    }
  }

  // Create Checkout Session
  async createCheckoutSession(planType, billingInterval = 'month', customerEmail = null) {
    try {
      console.log('🛒 Creating checkout session:', { planType, billingInterval });

      const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/pricing?cancelled=true`;

      const result = await this.apiRequest('/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          planType,
          billingInterval,
          successUrl,
          cancelUrl,
          customerEmail
        })
      });

      console.log('✅ Checkout session created:', result);
      return result;
    } catch (error) {
      console.error('❌ Checkout session creation failed:', error);
      throw error;
    }
  }

  // Redirect to Checkout
  async redirectToCheckout(planType, billingInterval = 'month', customerEmail = null) {
    try {
      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { sessionId } = await this.createCheckoutSession(planType, billingInterval, customerEmail);

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        throw error;
      }

      console.log('✅ Redirected to checkout');
    } catch (error) {
      console.error('❌ Checkout redirect failed:', error);
      throw error;
    }
  }

  // Process Payment with Elements
  async processPayment(clientSecret, paymentMethodData = {}) {
    try {
      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method_data: paymentMethodData
        }
      });

      if (error) {
        throw error;
      }

      console.log('✅ Payment processed:', paymentIntent);
      return paymentIntent;
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      throw error;
    }
  }

  // Get Subscription Details
  async getSubscription(subscriptionId) {
    try {
      console.log('📋 Getting subscription:', subscriptionId);

      const result = await this.apiRequest(`/subscription/${subscriptionId}`, {
        method: 'GET'
      });

      console.log('✅ Subscription retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Subscription retrieval failed:', error);
      throw error;
    }
  }

  // Update Subscription
  async updateSubscription(subscriptionId, planType, billingInterval = 'month') {
    try {
      console.log('🔄 Updating subscription:', { subscriptionId, planType, billingInterval });

      const result = await this.apiRequest(`/subscription/${subscriptionId}`, {
        method: 'PUT',
        body: JSON.stringify({
          planType,
          billingInterval
        })
      });

      console.log('✅ Subscription updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Subscription update failed:', error);
      throw error;
    }
  }

  // Cancel Subscription
  async cancelSubscription(subscriptionId, immediately = false) {
    try {
      console.log('❌ Canceling subscription:', { subscriptionId, immediately });

      const result = await this.apiRequest(`/subscription/${subscriptionId}`, {
        method: 'DELETE',
        body: JSON.stringify({
          immediately
        })
      });

      console.log('✅ Subscription canceled:', result);
      return result;
    } catch (error) {
      console.error('❌ Subscription cancellation failed:', error);
      throw error;
    }
  }

  // Get Available Plans
  async getPlans() {
    try {
      console.log('📊 Getting available plans');

      const result = await this.apiRequest('/plans', {
        method: 'GET'
      });

      console.log('✅ Plans retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Plans retrieval failed:', error);
      throw error;
    }
  }

  // Utility Methods
  formatAmount(amount) {
    return (amount / 100).toFixed(2);
  }

  getPlanPrice(planType, billingInterval = 'month') {
    const prices = {
      pro: {
        month: 1900, // $19.00
        year: 18000  // $180.00
      },
      enterprise: {
        month: 9900, // $99.00
        year: 94800  // $948.00
      }
    };

    return prices[planType]?.[billingInterval] || 0;
  }

  getPlanFeatures(planType) {
    const features = {
      free: [
        '10 name generations per month',
        'Basic brandability scoring',
        'Domain availability check',
        '5 industries supported',
        'Email support'
      ],
      pro: [
        '100 name generations per month',
        'Advanced brandability scoring',
        'Domain availability check',
        'All industries supported',
        'Priority email support',
        'Advanced AI analysis',
        'Basic trademark screening',
        'Custom naming styles',
        'Export to PDF',
        'Name history & favorites'
      ],
      enterprise: [
        'Unlimited name generations',
        'Premium brandability scoring',
        'Domain availability check',
        'All industries + custom',
        '24/7 priority support',
        'Advanced AI analysis',
        'Full trademark screening',
        'Custom naming styles',
        'Export to PDF & CSV',
        'Team collaboration tools'
      ]
    };

    return features[planType] || features.free;
  }

  // Payment Success Handler
  handlePaymentSuccess(sessionId) {
    console.log('✅ Payment successful:', sessionId);

    // Update user premium status
    this.updateUserPremiumStatus('pro');

    // Track conversion
    this.trackConversion(sessionId);

    // Show success message
    this.showPaymentSuccessMessage();

    // Trigger page refresh to update premium status
    window.location.reload();
  }

  // Payment Cancellation Handler
  handlePaymentCancellation() {
    console.log('❌ Payment cancelled');

    // Track cancellation
    this.trackCancellation();

    // Show cancellation message
    this.showCancellationMessage();
  }

  // Helper Methods
  updateUserPremiumStatus(tier = 'pro') {
    // Update local storage or user state
    localStorage.setItem('startupnamer_user_tier', tier);
    localStorage.setItem('startupnamer_premium_activated', new Date().toISOString());
    console.log('👤 User premium status updated to:', tier);
  }

  trackConversion(sessionId) {
    // Track conversion analytics
    console.log('📈 Conversion tracked:', sessionId);
    // Implement analytics tracking
  }

  trackCancellation() {
    // Track cancellation analytics
    console.log('📉 Cancellation tracked');
    // Implement analytics tracking
  }

  showPaymentSuccessMessage() {
    // Show success notification
    console.log('🎉 Payment success message displayed');
    // Implement success notification
  }

  showCancellationMessage() {
    // Show cancellation notification
    console.log('💔 Payment cancellation message displayed');
    // Implement cancellation notification
  }
}

// Create and export singleton instance
const paymentService = new PaymentService();
export default paymentService;
