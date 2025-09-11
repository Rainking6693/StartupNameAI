// API Service Layer - Connects Frontend to Backend
// Handles all API communication for StartupNamer.org

class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.startupnamer.org';
    this.timeout = 10000; // 10 second timeout
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second

    console.log('🌐 API Service initialized with base URL:', this.baseURL);
  }

  // Generic API request method with error handling and retries
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      timeout: this.timeout,
      ...options
    };

    // Add authentication if available
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🔄 API Request (attempt ${attempt}):`, url, config.method);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ API Response:`, data);

        return {
          success: true,
          data: data.data || data,
          message: data.message,
          metadata: data.metadata
        };

      } catch (error) {
        lastError = error;
        console.error(`❌ API Request failed (attempt ${attempt}):`, error.message);

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    // All retries failed
    console.error('🚨 API Request failed after all retries:', lastError);
    return {
      success: false,
      error: lastError.message || 'API request failed',
      details: lastError
    };
  }

  // Name Generation API
  async generateNames(formData) {
    console.log('🧠 Generating names with API:', formData);

    const requestData = {
      keywords: formData.keywords || ['startup'],
      industry: formData.industry || 'tech',
      style: formData.style || 'modern',
      count: formData.count || 50,
      description: formData.description
    };

    const response = await this.makeRequest('/api/names/generate', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    if (response.success) {
      console.log('✅ Names generated successfully:', response.data.names.length);
      return {
        success: true,
        names: response.data.names,
        sessionId: response.data.sessionId,
        sessionToken: response.data.sessionToken,
        metadata: response.data.metadata
      };
    } else {
      console.error('❌ Name generation failed:', response.error);
      // Fallback to enhanced local generation
      return await this.generateFallbackNames(formData);
    }
  }

  // Fallback name generation using enhanced AI engine
  async generateFallbackNames(formData) {
    console.log('🔄 Using fallback name generation...');

    try {
      // Import the enhanced AI naming engine
      const { default: EnhancedAINameGenerator } = await import('../utils/enhancedAiNamingEngine');
      const generator = new EnhancedAINameGenerator();

      const names = generator.generateIntelligentNames({
        keywords: formData.keywords || ['startup'],
        industry: formData.industry || 'tech',
        style: formData.style || 'modern',
        description: formData.description
      });

      console.log('✅ Fallback names generated:', names.length);

      return {
        success: true,
        names: names.slice(0, 50), // Limit to 50 names
        sessionId: `fallback_${Date.now()}`,
        sessionToken: this.generateSessionToken(),
        metadata: {
          totalGenerated: names.length,
          fallbackUsed: true,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Fallback generation failed:', error);
      return {
        success: false,
        error: 'Name generation failed',
        names: []
      };
    }
  }

  // Domain Checking API
  async checkDomainAvailability(name) {
    console.log('🌐 Checking domain availability for:', name);

    const response = await this.makeRequest('/api/domains/check', {
      method: 'POST',
      body: JSON.stringify({ name })
    });

    if (response.success) {
      return response.data;
    } else {
      // Fallback to local domain service
      console.log('🔄 Using fallback domain checking...');
      const { default: DomainService } = await import('../utils/domainService');
      const domainService = new DomainService();
      return await domainService.checkDomainAvailability(name);
    }
  }

  // Domain Reservation API
  async reserveDomain(domainInfo, userInfo) {
    console.log('🔒 Reserving domain:', domainInfo.domain);

    const requestData = {
      domain: domainInfo.domain,
      extension: domainInfo.extension,
      price: domainInfo.price,
      userInfo: {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: userInfo.phone
      }
    };

    const response = await this.makeRequest('/api/domains/reserve', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    if (response.success) {
      return response.data;
    } else {
      // Fallback to local domain service
      console.log('🔄 Using fallback domain reservation...');
      const { default: DomainService } = await import('../utils/domainService');
      const domainService = new DomainService();
      return await domainService.reserveDomain(domainInfo, userInfo);
    }
  }

  // Payment Processing API
  async createPaymentIntent(amount, plan) {
    console.log('💳 Creating payment intent:', { amount, plan });

    const response = await this.makeRequest('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, plan })
    });

    return response;
  }

  // User Authentication API
  async authenticateUser(email, password) {
    console.log('🔐 Authenticating user:', email);

    const response = await this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  // User Registration API
  async registerUser(userData) {
    console.log('📝 Registering user:', userData.email);

    const response = await this.makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  // Session Management
  async getSession(sessionId) {
    console.log('📋 Retrieving session:', sessionId);

    const response = await this.makeRequest(`/api/names/session/${sessionId}`);
    return response;
  }

  // Analytics and Tracking
  async trackEvent(eventType, eventData) {
    console.log('📊 Tracking event:', eventType, eventData);

    // Non-blocking analytics call
    this.makeRequest('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        eventType,
        eventData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(error => {
      console.warn('Analytics tracking failed:', error);
    });
  }

  // Health Check
  async healthCheck() {
    console.log('🏥 Performing health check...');

    const response = await this.makeRequest('/api/health');
    return response;
  }

  // Utility Methods
  getAuthToken() {
    return localStorage.getItem('startupnamer_auth_token');
  }

  setAuthToken(token) {
    localStorage.setItem('startupnamer_auth_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('startupnamer_auth_token');
  }

  generateSessionToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Error handling helpers
  handleAPIError(error, context = 'API request') {
    console.error(`❌ ${context} failed:`, error);

    if (error.name === 'AbortError') {
      return 'Request timed out. Please try again.';
    }

    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to server. Please check your internet connection.';
    }

    if (error.message.includes('HTTP 401')) {
      return 'Authentication required. Please log in.';
    }

    if (error.message.includes('HTTP 429')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    return error.message || 'An unexpected error occurred.';
  }
}

// Create and export singleton instance
const apiService = new APIService();
export default apiService;
