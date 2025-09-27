// Netlify Function for Stripe Webhook Handling
// Processes payment events and manages subscription status

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST for webhooks
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook not configured' })
    };
  }

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    };
  }
};

// Handle successful checkout completion
async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);
  
  try {
    // Get customer and subscription details
    const customer = await stripe.customers.retrieve(session.customer);
    const subscription = session.subscription ? 
      await stripe.subscriptions.retrieve(session.subscription) : null;

    // Store subscription information
    const subscriptionData = {
      customerId: customer.id,
      customerEmail: customer.email,
      subscriptionId: subscription?.id,
      status: subscription?.status || 'active',
      planId: subscription?.items?.data[0]?.price?.id,
      currentPeriodStart: subscription?.current_period_start,
      currentPeriodEnd: subscription?.current_period_end,
      checkoutSessionId: session.id,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      createdAt: new Date().toISOString()
    };

    // In a real app, you'd store this in a database
    // For now, we'll log it and could store in a simple JSON file or external service
    console.log('Subscription data to store:', subscriptionData);
    
    // You could send this to a database service like:
    // - Airtable API
    // - Supabase
    // - Firebase
    // - Or a simple webhook to store in your preferred database
    
    await notifySubscriptionCreated(subscriptionData);
    
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded for invoice:', invoice.id);
  
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    const paymentData = {
      customerId: customer.id,
      customerEmail: customer.email,
      subscriptionId: subscription.id,
      invoiceId: invoice.id,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      periodStart: invoice.period_start,
      periodEnd: invoice.period_end,
      paymentDate: new Date().toISOString()
    };
    
    console.log('Payment success data:', paymentData);
    await notifyPaymentSucceeded(paymentData);
    
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
  console.log('Payment failed for invoice:', invoice.id);
  
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    const failureData = {
      customerId: customer.id,
      customerEmail: customer.email,
      subscriptionId: subscription.id,
      invoiceId: invoice.id,
      attemptCount: invoice.attempt_count,
      nextPaymentAttempt: invoice.next_payment_attempt,
      status: 'failed',
      failureDate: new Date().toISOString()
    };
    
    console.log('Payment failure data:', failureData);
    await notifyPaymentFailed(failureData);
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    const subscriptionData = {
      customerId: customer.id,
      customerEmail: customer.email,
      subscriptionId: subscription.id,
      status: subscription.status,
      planId: subscription.items.data[0].price.id,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      trialStart: subscription.trial_start,
      trialEnd: subscription.trial_end,
      createdAt: new Date().toISOString()
    };
    
    console.log('New subscription data:', subscriptionData);
    await notifySubscriptionCreated(subscriptionData);
    
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

// Handle subscription update
async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    const updateData = {
      customerId: customer.id,
      customerEmail: customer.email,
      subscriptionId: subscription.id,
      status: subscription.status,
      planId: subscription.items.data[0].price.id,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Subscription update data:', updateData);
    await notifySubscriptionUpdated(updateData);
    
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    const deletionData = {
      customerId: customer.id,
      customerEmail: customer.email,
      subscriptionId: subscription.id,
      status: 'canceled',
      canceledAt: subscription.canceled_at,
      endedAt: subscription.ended_at,
      deletedAt: new Date().toISOString()
    };
    
    console.log('Subscription deletion data:', deletionData);
    await notifySubscriptionDeleted(deletionData);
    
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

// Notification functions (implement based on your needs)
async function notifySubscriptionCreated(data) {
  // Send to your database/service
  // Could use Airtable, Supabase, webhook to your main app, etc.
  console.log('Notifying subscription created:', data.customerEmail);
}

async function notifyPaymentSucceeded(data) {
  console.log('Notifying payment succeeded:', data.customerEmail);
}

async function notifyPaymentFailed(data) {
  console.log('Notifying payment failed:', data.customerEmail);
  // Could send email notification to customer about failed payment
}

async function notifySubscriptionUpdated(data) {
  console.log('Notifying subscription updated:', data.customerEmail);
}

async function notifySubscriptionDeleted(data) {
  console.log('Notifying subscription deleted:', data.customerEmail);
}