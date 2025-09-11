const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const domainChecker = require('../services/domainChecker');
const { AppError, logger } = require('../middleware/errorHandler');

// POST /api/domains/check - Check domain availability
router.post('/check', [
  body('name')
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage('Name must be 2-50 characters, alphanumeric and hyphens only')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid name format',
        errors: errors.array()
      });
    }

    const { name } = req.body;

    logger.info('Domain check request:', { name, ip: req.ip });

    // Check domain availability
    const result = await domainChecker.checkAvailability(name);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Domain check failed:', error);
    next(new AppError('Domain check failed', 500));
  }
});

// POST /api/domains/reserve - Reserve a domain
router.post('/reserve', [
  body('domain')
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z0-9.-]+$/)
    .withMessage('Invalid domain format'),
  body('userInfo.email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('userInfo.firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name is required'),
  body('userInfo.lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation request',
        errors: errors.array()
      });
    }

    const { domain, userInfo } = req.body;

    logger.info('Domain reservation request:', {
      domain,
      email: userInfo.email,
      ip: req.ip
    });

    // Simulate domain reservation
    const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // In a real implementation, this would:
    // 1. Check domain availability again
    // 2. Create reservation record in database
    // 3. Send confirmation email
    // 4. Generate payment link

    const reservation = {
      success: true,
      reservationId: reservationId,
      domain: domain,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      paymentUrl: `https://payments.startupnamer.org/${reservationId}`,
      instructions: [
        'Complete payment within 24 hours to secure your domain',
        'Visit your preferred registrar to complete registration',
        'Use the provided reservation code during checkout',
        'Domain will be registered in your name upon payment confirmation'
      ]
    };

    res.status(200).json({
      success: true,
      data: reservation
    });

  } catch (error) {
    logger.error('Domain reservation failed:', error);
    next(new AppError('Domain reservation failed', 500));
  }
});

// GET /api/domains/status/:reservationId - Check reservation status
router.get('/status/:reservationId', async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    if (!reservationId || !reservationId.startsWith('RES-')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation ID'
      });
    }

    // Simulate status check
    const status = Math.random() > 0.1 ? 'pending' : 'confirmed'; // 90% pending

    res.status(200).json({
      success: true,
      data: {
        reservationId,
        status,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        paymentRequired: status === 'pending'
      }
    });

  } catch (error) {
    logger.error('Reservation status check failed:', error);
    next(new AppError('Failed to check reservation status', 500));
  }
});

module.exports = router;
