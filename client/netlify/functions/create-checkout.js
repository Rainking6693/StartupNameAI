// Netlify Function for Creating Stripe Checkout Sessions
// Handles payment processing for StartupNamer subscriptions

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { 
      planType, 
      billingInterval = 'month', 
      customerEmail,
      successUrl,
      cancelUrl 
    } = JSON.parse(event.body);

    // Validate input
    if (!planType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Plan type is required' })
      };
    }

    // Get price IDs based on plan and billing interval
    const priceId = getPriceId(planType, billingInterval);
    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan type or billing interval' })
      };
    }

    // Set default URLs if not provided
    const baseUrl = 'https://startupnamer.org';
    const defaultSuccessUrl = successUrl || `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = cancelUrl || `${baseUrl}/pricing?cancelled=true`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      subscription_data: {
        metadata: {
          planType: planType,
          billingInterval: billingInterval,
          source: 'startupnamer-web'
        }
      },
      metadata: {
        planType: planType,
        billingInterval: billingInterval,
        source: 'startupnamer-web'
      },
      success_url: defaultSuccessUrl,
      cancel_url: defaultCancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      payment_intent_data: {
        setup_future_usage: 'off_session'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sessionId: session.id,
        url: session.url,
        planType: planType,
        billingInterval: billingInterval
      })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: error.message 
      })
    };
  }
};

// Get Stripe price ID based on plan and billing interval
function getPriceId(planType, billingInterval) {
  // These would be your actual Stripe price IDs
  // Create these in your Stripe dashboard
  const priceIds = {
    starter: {
      month: process.env.STRIPE_PRICE_STARTER_MONTHLY,
      year: process.env.STRIPE_PRICE_STARTER_YEARLY
    },
    pro: {
      month: process.env.STRIPE_PRICE_PRO_MONTHLY,
      year: process.env.STRIPE_PRICE_PRO_YEARLY
    },
    enterprise: {
      month: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
      year: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY
    }
  };

  // Fallback price IDs for testing (replace with your actual price IDs)
  const fallbackPriceIds = {
    starter: {
      month: 'price_starter_monthly_fallback',
      year: 'price_starter_yearly_fallback'
    },
    pro: {
      month: 'price_pro_monthly_fallback', 
      year: 'price_pro_yearly_fallback'
    },
    enterprise: {
      month: 'price_enterprise_monthly_fallback',
      year: 'price_enterprise_yearly_fallback'
    }
  };

  const planPrices = priceIds[planType] || fallbackPriceIds[planType];
  return planPrices ? planPrices[billingInterval] : null;
}