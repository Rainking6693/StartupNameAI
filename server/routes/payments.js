const express = require('express');
const { body, validationResult } = require('express-validator');
const paymentService = require('../services/paymentService');
const router = express.Router();

/**
 * @route   POST /api/payments/create-intent
 * @desc    Create Stripe payment intent for one-time payments
 * @access  Public
 */
router.post('/create-intent', [
  body('amount')
    .isInt({ min: 100, max: 100000 })
    .withMessage('Amount must be between $1 and $1000'),
  body('currency')
    .optional()
    .isIn(['usd', 'eur', 'gbp'])
    .withMessage('Invalid currency'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment request',
        details: errors.array()
      });
    }

    const { amount, currency = 'usd', metadata = {} } = req.body;

    const result = await paymentService.createPaymentIntent(amount, currency, metadata);

    res.json(result);

  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment processing failed'
    });
  }
});

/**
 * @route   POST /api/payments/create-customer
 * @desc    Create Stripe customer
 * @access  Public
 */
router.post('/create-customer', [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('name')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer data',
        details: errors.array()
      });
    }

    const { email, name, metadata = {} } = req.body;

    const result = await paymentService.createCustomer(email, name, metadata);

    res.json(result);

  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Customer creation failed'
    });
  }
});

/**
 * @route   POST /api/payments/create-subscription
 * @desc    Create Stripe subscription
 * @access  Public
 */
router.post('/create-subscription', [
  body('customerId')
    .isString()
    .withMessage('Customer ID is required'),
  body('planType')
    .isIn(['pro', 'enterprise'])
    .withMessage('Invalid plan type'),
  body('billingInterval')
    .optional()
    .isIn(['month', 'year'])
    .withMessage('Invalid billing interval')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription data',
        details: errors.array()
      });
    }

    const { customerId, planType, billingInterval = 'month' } = req.body;

    const result = await paymentService.createSubscription(customerId, planType, billingInterval);

    res.json(result);

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Subscription creation failed'
    });
  }
});

/**
 * @route   POST /api/payments/create-checkout-session
 * @desc    Create Stripe checkout session
 * @access  Public
 */
router.post('/create-checkout-session', [
  body('planType')
    .isIn(['pro', 'enterprise'])
    .withMessage('Invalid plan type'),
  body('billingInterval')
    .optional()
    .isIn(['month', 'year'])
    .withMessage('Invalid billing interval'),
  body('successUrl')
    .isURL()
    .withMessage('Valid success URL is required'),
  body('cancelUrl')
    .isURL()
    .withMessage('Valid cancel URL is required'),
  body('customerEmail')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid checkout session data',
        details: errors.array()
      });
    }

    const {
      planType,
      billingInterval = 'month',
      successUrl,
      cancelUrl,
      customerEmail
    } = req.body;

    const result = await paymentService.createCheckoutSession(
      planType,
      billingInterval,
      successUrl,
      cancelUrl,
      customerEmail
    );

    res.json(result);

  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Checkout session creation failed'
    });
  }
});

/**
 * @route   GET /api/payments/subscription/:id
 * @desc    Get subscription details
 * @access  Public
 */
router.get('/subscription/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID is required'
      });
    }

    const result = await paymentService.getSubscription(id);

    res.json(result);

  } catch (error) {
    console.error('Subscription retrieval error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Subscription retrieval failed'
    });
  }
});

/**
 * @route   PUT /api/payments/subscription/:id
 * @desc    Update subscription
 * @access  Public
 */
router.put('/subscription/:id', [
  body('planType')
    .isIn(['pro', 'enterprise'])
    .withMessage('Invalid plan type'),
  body('billingInterval')
    .optional()
    .isIn(['month', 'year'])
    .withMessage('Invalid billing interval')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription update data',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { planType, billingInterval = 'month' } = req.body;

    const result = await paymentService.updateSubscription(id, planType, billingInterval);

    res.json(result);

  } catch (error) {
    console.error('Subscription update error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Subscription update failed'
    });
  }
});

/**
 * @route   DELETE /api/payments/subscription/:id
 * @desc    Cancel subscription
 * @access  Public
 */
router.delete('/subscription/:id', [
  body('immediately')
    .optional()
    .isBoolean()
    .withMessage('Immediately must be a boolean')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { immediately = false } = req.body;

    const result = await paymentService.cancelSubscription(id, immediately);

    res.json(result);

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Subscription cancellation failed'
    });
  }
});

/**
 * @route   GET /api/payments/plans
 * @desc    Get available plans
 * @access  Public
 */
router.get('/plans', (req, res) => {
  try {
    const plans = paymentService.getAllPlans();

    res.json({
      success: true,
      plans: plans
    });

  } catch (error) {
    console.error('Plans retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Plans retrieval failed'
    });
  }
});

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Stripe webhooks
 * @access  Public
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing Stripe signature'
      });
    }

    const result = await paymentService.handleWebhook(req.body, signature);

    res.json({
      success: true,
      received: true,
      eventType: result.eventType
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Webhook failed'
    });
  }
});

module.exports = router;