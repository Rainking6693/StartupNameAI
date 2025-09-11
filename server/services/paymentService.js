// Comprehensive Payment Service for StartupNamer.org
// Handles Stripe integration, subscription management, and payment processing

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.stripe = stripe;
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    this.plans = {
      pro: {
        monthly: {
          priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
          amount: 1900, // $19.00
          currency: 'usd',
          interval: 'month'
        },
        annual: {
          priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
          amount: 18000, // $180.00 (15 months for price of 12)
          currency: 'usd',
          interval: 'year'
        }
      },
      enterprise: {
        monthly: {
          priceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
          amount: 9900, // $99.00
          currency: 'usd',
          interval: 'month'
        },
        annual: {
          priceId: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || 'price_enterprise_annual',
          amount: 94800, // $948.00 (12 months for price of 10)
          currency: 'usd',
          interval: 'year'
        }
      }
    };

    console.log('💳 Payment Service initialized');
    console.log('📊 Available plans:', Object.keys(this.plans));
  }

  // Create Payment Intent for one-time payments
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      console.log('💳 Creating payment intent:', { amount, currency, metadata });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: {
          ...metadata,
          source: 'startupnamer_web',
          timestamp: new Date().toISOString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log('✅ Payment intent created:', paymentIntent.id);

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      };
    } catch (error) {
      console.error('❌ Payment intent creation failed:', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  // Create Customer for subscription management
  async createCustomer(email, name, metadata = {}) {
    try {
      console.log('👤 Creating customer:', { email, name });

      const customer = await this.stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          ...metadata,
          source: 'startupnamer_web',
          created_at: new Date().toISOString()
        }
      });

      console.log('✅ Customer created:', customer.id);

      return {
        success: true,
        customerId: customer.id,
        email: customer.email,
        name: customer.name
      };
    } catch (error) {
      console.error('❌ Customer creation failed:', error);
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }

  // Create Subscription
  async createSubscription(customerId, planType, billingInterval = 'month') {
    try {
      console.log('📋 Creating subscription:', { customerId, planType, billingInterval });

      const plan = this.plans[planType];
      if (!plan) {
        throw new Error(`Invalid plan type: ${planType}`);
      }

      const priceConfig = plan[billingInterval];
      if (!priceConfig) {
        throw new Error(`Invalid billing interval: ${billingInterval}`);
      }

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceConfig.priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          plan_type: planType,
          billing_interval: billingInterval,
          source: 'startupnamer_web'
        }
      });

      console.log('✅ Subscription created:', subscription.id);

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status,
        planType: planType,
        billingInterval: billingInterval,
        amount: priceConfig.amount
      };
    } catch (error) {
      console.error('❌ Subscription creation failed:', error);
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  // Update Subscription
  async updateSubscription(subscriptionId, newPlanType, newBillingInterval = 'month') {
    try {
      console.log('🔄 Updating subscription:', { subscriptionId, newPlanType, newBillingInterval });

      const plan = this.plans[newPlanType];
      if (!plan) {
        throw new Error(`Invalid plan type: ${newPlanType}`);
      }

      const priceConfig = plan[newBillingInterval];
      if (!priceConfig) {
        throw new Error(`Invalid billing interval: ${newBillingInterval}`);
      }

      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: priceConfig.priceId,
        }],
        metadata: {
          plan_type: newPlanType,
          billing_interval: newBillingInterval,
          updated_at: new Date().toISOString()
        }
      });

      console.log('✅ Subscription updated:', subscriptionId);

      return {
        success: true,
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
        planType: newPlanType,
        billingInterval: newBillingInterval,
        amount: priceConfig.amount
      };
    } catch (error) {
      console.error('❌ Subscription update failed:', error);
      throw new Error(`Subscription update failed: ${error.message}`);
    }
  }

  // Cancel Subscription
  async cancelSubscription(subscriptionId, immediately = false) {
    try {
      console.log('❌ Canceling subscription:', { subscriptionId, immediately });

      let subscription;

      if (immediately) {
        subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      } else {
        subscription = await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        });
      }

      console.log('✅ Subscription canceled:', subscriptionId);

      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at
      };
    } catch (error) {
      console.error('❌ Subscription cancellation failed:', error);
      throw new Error(`Subscription cancellation failed: ${error.message}`);
    }
  }

  // Get Subscription Details
  async getSubscription(subscriptionId) {
    try {
      console.log('📋 Retrieving subscription:', subscriptionId);

      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['customer', 'items.data.price']
      });

      return {
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          planType: subscription.metadata.plan_type,
          billingInterval: subscription.metadata.billing_interval,
          customer: {
            id: subscription.customer.id,
            email: subscription.customer.email,
            name: subscription.customer.name
          }
        }
      };
    } catch (error) {
      console.error('❌ Subscription retrieval failed:', error);
      throw new Error(`Subscription retrieval failed: ${error.message}`);
    }
  }

  // Create Checkout Session
  async createCheckoutSession(planType, billingInterval = 'month', successUrl, cancelUrl, customerEmail = null) {
    try {
      console.log('🛒 Creating checkout session:', { planType, billingInterval });

      const plan = this.plans[planType];
      if (!plan) {
        throw new Error(`Invalid plan type: ${planType}`);
      }

      const priceConfig = plan[billingInterval];
      if (!priceConfig) {
        throw new Error(`Invalid billing interval: ${billingInterval}`);
      }

      const sessionConfig = {
        payment_method_types: ['card'],
        line_items: [{
          price: priceConfig.priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          plan_type: planType,
          billing_interval: billingInterval,
          source: 'startupnamer_web'
        },
        subscription_data: {
          metadata: {
            plan_type: planType,
            billing_interval: billingInterval,
            source: 'startupnamer_web'
          }
        }
      };

      // Add customer email if provided
      if (customerEmail) {
        sessionConfig.customer_email = customerEmail;
      }

      const session = await this.stripe.checkout.sessions.create(sessionConfig);

      console.log('✅ Checkout session created:', session.id);

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
        planType: planType,
        billingInterval: billingInterval,
        amount: priceConfig.amount
      };
    } catch (error) {
      console.error('❌ Checkout session creation failed:', error);
      throw new Error(`Checkout session creation failed: ${error.message}`);
    }
  }

  // Handle Webhooks
  async handleWebhook(payload, signature) {
    try {
      console.log('🔔 Processing webhook...');

      // Verify webhook signature
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );

      console.log('✅ Webhook verified:', event.type);

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        default:
          console.log('ℹ️ Unhandled webhook event type:', event.type);
      }

      return { success: true, eventType: event.type };
    } catch (error) {
      console.error('❌ Webhook processing failed:', error);
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  // Webhook Event Handlers
  async handleCheckoutCompleted(session) {
    console.log('✅ Checkout completed:', session.id);

    // Update user subscription status
    // In a real app, this would update your database
    const subscriptionData = {
      customerId: session.customer,
      subscriptionId: session.subscription,
      planType: session.metadata.plan_type,
      billingInterval: session.metadata.billing_interval,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Store subscription data (implement database storage)
    await this.storeSubscriptionData(subscriptionData);
  }

  async handleSubscriptionCreated(subscription) {
    console.log('✅ Subscription created:', subscription.id);

    // Update user access permissions
    await this.updateUserAccess(subscription.customer, subscription.metadata.plan_type);
  }

  async handleSubscriptionUpdated(subscription) {
    console.log('🔄 Subscription updated:', subscription.id);

    // Update user access permissions
    await this.updateUserAccess(subscription.customer, subscription.metadata.plan_type);
  }

  async handleSubscriptionDeleted(subscription) {
    console.log('❌ Subscription deleted:', subscription.id);

    // Downgrade user to free tier
    await this.downgradeUser(subscription.customer);
  }

  async handlePaymentSucceeded(invoice) {
    console.log('✅ Payment succeeded:', invoice.id);

    // Send confirmation email, update billing, etc.
    await this.processSuccessfulPayment(invoice);
  }

  async handlePaymentFailed(invoice) {
    console.log('❌ Payment failed:', invoice.id);

    // Send payment failure notification, retry logic, etc.
    await this.processFailedPayment(invoice);
  }

  // Helper Methods
  async storeSubscriptionData(data) {
    // Implement database storage
    console.log('💾 Storing subscription data:', data);
    // This would typically save to your database
  }

  async updateUserAccess(customerId, planType) {
    // Implement user access update
    console.log('👤 Updating user access:', { customerId, planType });
    // This would typically update user permissions in your system
  }

  async downgradeUser(customerId) {
    // Implement user downgrade
    console.log('⬇️ Downgrading user:', customerId);
    // This would typically downgrade user to free tier
  }

  async processSuccessfulPayment(invoice) {
    // Implement successful payment processing
    console.log('💰 Processing successful payment:', invoice.id);
    // Send emails, update records, etc.
  }

  async processFailedPayment(invoice) {
    // Implement failed payment processing
    console.log('💸 Processing failed payment:', invoice.id);
    // Send notifications, retry logic, etc.
  }

  // Utility Methods
  getPlanDetails(planType, billingInterval = 'month') {
    const plan = this.plans[planType];
    if (!plan) return null;

    return plan[billingInterval] || null;
  }

  getAllPlans() {
    return this.plans;
  }

  formatAmount(amount) {
    return (amount / 100).toFixed(2);
  }

  generateIdempotencyKey() {
    return crypto.randomBytes(16).toString('hex');
  }
}

// Create and export singleton instance
const paymentService = new PaymentService();
module.exports = paymentService;
