// API utilities for StartupNamer.org
// Handles AI name generation, domain checking, payments, and analytics

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.startupnamer.org';
const DOMAIN_API_KEY = process.env.REACT_APP_DOMAIN_API_KEY || 'demo';
const STRIPE_PK = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2
};

// Error types
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT'
};

/**
 * Generic API request handler with retry logic
 */
const apiRequest = async (endpoint, options = {}, retryCount = 0) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Source': 'startupnamer-web'
    },
    timeout: 30000
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // Add request ID for tracking
    const requestId = generateRequestId();
    mergedOptions.headers['X-Request-ID'] = requestId;

    console.log(`[API] ${options.method || 'GET'} ${endpoint}`, { requestId });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);

    const response = await fetch(url, {
      ...mergedOptions,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        `HTTP ${response.status}`,
        mapHttpStatusToErrorType(response.status),
        response.status,
        await response.text()
      );
    }

    const data = await response.json();
    console.log(`[API] Success ${endpoint}`, { requestId, dataSize: JSON.stringify(data).length });
    
    return data;

  } catch (error) {
    console.error(`[API] Error ${endpoint}`, { error: error.message, retryCount });

    // Handle different error types
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', API_ERRORS.TIMEOUT);
    }

    if (error instanceof APIError) {
      throw error;
    }

    // Network errors
    if (!navigator.onLine) {
      throw new APIError('No internet connection', API_ERRORS.NETWORK_ERROR);
    }

    // Retry logic
    if (retryCount < RETRY_CONFIG.maxRetries && shouldRetry(error)) {
      const delay = RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount);
      console.log(`[API] Retrying ${endpoint} in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiRequest(endpoint, options, retryCount + 1);
    }

    throw new APIError('Network request failed', API_ERRORS.NETWORK_ERROR, 0, error.message);
  }
};

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, type, status = 0, details = null) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.details = details;
  }
}

/**
 * Generate unique request ID
 */
const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Map HTTP status codes to error types
 */
const mapHttpStatusToErrorType = (status) => {
  if (status >= 400 && status < 500) {
    if (status === 429) return API_ERRORS.RATE_LIMIT;
    return API_ERRORS.VALIDATION_ERROR;
  }
  return API_ERRORS.SERVER_ERROR;
};

/**
 * Check if error should be retried
 */
const shouldRetry = (error) => {
  const retryableErrors = ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'];
  return retryableErrors.some(retryable => error.message.includes(retryable));
};

/**
 * AI Name Generation
 */
export const generateNames = async (formData) => {
  // Validate input
  if (!formData.industry || !formData.style || !formData.description) {
    throw new APIError('Missing required fields', API_ERRORS.VALIDATION_ERROR);
  }

  // For demo purposes, return mock data
  // In production, this would call your AI service
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const mockNames = generateMockNames(formData);
        resolve(mockNames);
        
        // Track generation event
        trackEvent('names_generated', {
          industry: formData.industry,
          style: formData.style,
          keyword_count: formData.keywords.length,
          package_type: formData.packageType,
          names_count: mockNames.length
        });

      } catch (error) {
        reject(new APIError('Name generation failed', API_ERRORS.SERVER_ERROR, 500, error.message));
      }
    }, 2000 + Math.random() * 2000); // Simulate API delay
  });

  /* Production implementation:
  return apiRequest('/generate', {
    method: 'POST',
    body: JSON.stringify({
      industry: formData.industry,
      style: formData.style,
      keywords: formData.keywords,
      description: formData.description,
      target_audience: formData.targetAudience,
      package_type: formData.packageType,
      user_session: getSessionId()
    })
  });
  */
};

/**
 * Generate mock names for demo
 */
const generateMockNames = (formData) => {
  const prefixes = {
    tech: ['Smart', 'Cloud', 'Data', 'Sync', 'Flow', 'Core', 'Pixel', 'Neo', 'Quantum', 'Fusion'],
    fintech: ['Pay', 'Coin', 'Bank', 'Fund', 'Vault', 'Trust', 'Secure', 'Capital', 'Mint', 'Ledger'],
    health: ['Care', 'Vital', 'Wellness', 'Heal', 'Fit', 'Life', 'Mind', 'Body', 'Pure', 'Balance'],
    ecommerce: ['Shop', 'Buy', 'Cart', 'Market', 'Store', 'Trade', 'Sell', 'Goods', 'Deal', 'Plaza']
  };

  const suffixes = {
    modern: ['Hub', 'Lab', 'Core', 'Flow', 'Sync', 'Edge', 'Point', 'Stream', 'Works', 'Tech'],
    professional: ['Pro', 'Solutions', 'Systems', 'Group', 'Corp', 'Partners', 'Associates', 'Consulting', 'Services', 'Company'],
    creative: ['Studio', 'Labs', 'Craft', 'Forge', 'Space', 'House', 'Collective', 'Workshop', 'Factory', 'Academy']
  };

  const industryPrefixes = prefixes[formData.industry] || prefixes.tech;
  const styleSuffixes = suffixes[formData.style] || suffixes.modern;
  
  const names = [];
  const nameCount = getNameCount(formData.packageType);

  // Generate combination names
  for (let i = 0; i < Math.floor(nameCount * 0.4); i++) {
    const prefix = industryPrefixes[Math.floor(Math.random() * industryPrefixes.length)];
    const suffix = styleSuffixes[Math.floor(Math.random() * styleSuffixes.length)];
    names.push(`${prefix}${suffix}`);
  }

  // Add keyword-based names
  formData.keywords.forEach(keyword => {
    if (names.length < nameCount) {
      styleSuffixes.slice(0, 3).forEach(suffix => {
        if (names.length < nameCount) {
          names.push(`${keyword}${suffix}`);
        }
      });
    }
  });

  // Fill remaining with creative combinations
  const uniqueNames = ['Zenith', 'Apex', 'Pinnacle', 'Summit', 'Peak', 'Prime', 'Elite', 'Stellar', 'Nexus', 'Vortex'];
  while (names.length < nameCount && uniqueNames.length > 0) {
    const unique = uniqueNames.pop();
    names.push(`${unique}${styleSuffixes[Math.floor(Math.random() * styleSuffixes.length)]}`);
  }

  return names.slice(0, nameCount);
};

/**
 * Get name count based on package
 */
const getNameCount = (packageType) => {
  switch (packageType) {
    case 'starter': return 25;
    case 'professional': return 75;
    case 'enterprise': return 150;
    default: return 25;
  }
};

/**
 * Domain Availability Check
 */
export const checkDomainAvailability = async (domain) => {
  // Mock implementation for demo
  return new Promise((resolve) => {
    setTimeout(() => {
      const isAvailable = Math.random() > 0.6;
      const isPremium = Math.random() > 0.7;
      
      resolve({
        domain,
        available: isAvailable,
        premium: isPremium && isAvailable,
        price: isAvailable ? (isPremium ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 50) + 12) : null,
        currency: 'USD',
        renewal_price: isAvailable ? Math.floor(Math.random() * 50) + 12 : null
      });
    }, 500 + Math.random() * 1000);
  });

  /* Production implementation:
  return apiRequest(`/domains/check`, {
    method: 'POST',
    body: JSON.stringify({ 
      domain,
      tlds: ['.com', '.org', '.io', '.co'],
      include_premium: true
    })
  });
  */
};

/**
 * Batch domain checking
 */
export const checkMultipleDomains = async (domains) => {
  const checks = domains.map(domain => checkDomainAvailability(domain));
  return Promise.all(checks);
};

/**
 * Payment Processing with Stripe
 */
export const createPaymentIntent = async (packageType, customerInfo = {}) => {
  const prices = {
    starter: 1900, // $19.00 in cents
    professional: 3900, // $39.00
    enterprise: 7900 // $79.00
  };

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!prices[packageType]) {
        reject(new APIError('Invalid package type', API_ERRORS.VALIDATION_ERROR));
        return;
      }

      resolve({
        client_secret: `pi_demo_${Date.now()}_secret`,
        amount: prices[packageType],
        currency: 'usd',
        package_type: packageType,
        session_id: generateSessionId()
      });

      trackEvent('payment_intent_created', {
        package_type: packageType,
        amount: prices[packageType]
      });
    }, 1000);
  });

  /* Production implementation:
  return apiRequest('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({
      package_type: packageType,
      customer: customerInfo,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/naming-tool`
    })
  });
  */
};

/**
 * Session Management
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem('startupnamer_session');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('startupnamer_session', sessionId);
  }
  return sessionId;
};

export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Analytics Tracking
 */
export const trackEvent = (eventName, properties = {}) => {
  const eventData = {
    event: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      url: window.location.href
    }
  };

  console.log('[Analytics]', eventData);

  /* Production implementation:
  // Send to analytics service
  apiRequest('/analytics/track', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }).catch(error => {
    console.error('Analytics tracking failed:', error);
  });
  */
};

/**
 * Trademark Risk Assessment
 */
export const checkTrademarkRisk = async (name, industry) => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const riskLevels = ['low', 'medium', 'high'];
      const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      
      resolve({
        name,
        industry,
        risk_level: risk,
        confidence: Math.floor(Math.random() * 30) + 70,
        similar_marks: Math.floor(Math.random() * 10),
        recommendation: getRiskRecommendation(risk)
      });
    }, 800);
  });
};

/**
 * Get risk recommendation
 */
const getRiskRecommendation = (risk) => {
  switch (risk) {
    case 'low':
      return 'Low risk of trademark conflicts. Proceed with confidence.';
    case 'medium':
      return 'Moderate risk detected. Consider professional trademark search.';
    case 'high':
      return 'High risk of conflicts. Professional legal review recommended.';
    default:
      return 'Risk assessment unavailable.';
  }
};

/**
 * Export data to PDF
 */
export const exportResultsToPDF = async (sessionData, favoriteNames) => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const pdfData = {
        session_id: sessionData.sessionId,
        generated_at: new Date().toISOString(),
        user_inputs: sessionData.formData,
        total_names: sessionData.names.length,
        favorite_names: favoriteNames,
        download_url: `https://cdn.startupnamer.org/exports/session_${Date.now()}.pdf`
      };

      resolve(pdfData);
      
      trackEvent('pdf_exported', {
        session_id: sessionData.sessionId,
        names_count: sessionData.names.length,
        favorites_count: favoriteNames.length
      });
    }, 2000);
  });
};

/**
 * User feedback submission
 */
export const submitFeedback = async (type, content, rating = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        feedback_id: `fb_${Date.now()}`,
        message: 'Thank you for your feedback!'
      });
      
      trackEvent('feedback_submitted', {
        type,
        rating,
        content_length: content.length
      });
    }, 500);
  });
};

/**
 * Error handling utility
 */
export const handleApiError = (error, context = '') => {
  console.error(`[API Error] ${context}:`, error);
  
  // Track error for monitoring
  trackEvent('api_error', {
    error_type: error.type || 'unknown',
    error_message: error.message,
    context,
    status: error.status || 0
  });

  // Return user-friendly error message
  switch (error.type) {
    case API_ERRORS.NETWORK_ERROR:
      return 'Connection error. Please check your internet and try again.';
    case API_ERRORS.VALIDATION_ERROR:
      return 'Please check your input and try again.';
    case API_ERRORS.RATE_LIMIT:
      return 'Too many requests. Please wait a moment and try again.';
    case API_ERRORS.TIMEOUT:
      return 'Request timed out. Please try again.';
    default:
      return 'Something went wrong. Please try again or contact support.';
  }
};

// Export error types and classes for use in components
export { APIError };

// Initialize analytics on module load
trackEvent('app_loaded');