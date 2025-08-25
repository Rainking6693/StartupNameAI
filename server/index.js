require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');

// Route imports
const nameRoutes = require('./routes/names');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.openai.com"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: (process.env.AI_RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.AI_RATE_LIMIT_MAX || 10,
  message: {
    error: 'AI request limit exceeded. Please upgrade to premium for more requests.',
    upgrade: 'https://startupnamer.org/pricing',
    retryAfter: (process.env.AI_RATE_LIMIT_WINDOW || 15) * 60 * 1000
  },
  skip: (req) => {
    // Skip rate limiting for premium users (implement your premium check logic)
    return req.user && req.user.isPremium;
  }
});

// Middleware
app.use(generalLimiter);
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'StartupNamer.org API',
    version: process.env.API_VERSION || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      community: process.env.ENABLE_COMMUNITY === 'true',
      expertReviews: process.env.ENABLE_EXPERT_REVIEWS === 'true',
      trademarkCheck: process.env.ENABLE_TRADEMARK_CHECK === 'true',
      domainSuggestions: process.env.ENABLE_DOMAIN_SUGGESTIONS === 'true'
    }
  });
});

// API Routes
app.use('/api/names', aiLimiter, nameRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to StartupNamer.org API',
    authority: 'The definitive startup naming authority',
    documentation: 'https://docs.startupnamer.org',
    version: process.env.API_VERSION || '1.0.0',
    endpoints: {
      health: '/api/health',
      names: '/api/names/*',
      auth: '/api/auth/*',
      payments: '/api/payments/*'
    }
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    available: [
      'GET /api/health',
      'POST /api/names/generate',
      'POST /api/names/analyze',
      'GET /api/names/history',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/payments/create-intent'
    ],
    documentation: 'https://docs.startupnamer.org'
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  logger.error(`Global error handler: ${error.message}`, {
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong on our end',
      support: 'support@startupnamer.org',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`
🚀 StartupNamer.org API Server Started
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔒 Security: Enhanced with Helmet
⚡ Rate limiting: Active
📚 AI-powered naming: Ready
🎯 Authority positioning: Enabled
📊 Logging: Winston configured
🔧 Health check: /api/health

${process.env.NODE_ENV === 'development' ? 
  `🔗 Local URL: http://localhost:${PORT}` : 
  '🔗 Production server running'}
  `);
});

module.exports = app;