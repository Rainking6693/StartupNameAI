// Enhanced Web Vitals collection with comprehensive analytics
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

// Configuration
const VITALS_ENDPOINT = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/vitals`
  : '/api/vitals';

const BATCH_SIZE = 5;
const BATCH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Storage for batching vitals
let vitalsBuffer = [];
let batchTimer = null;

// Session management
const sessionId = generateSessionId();
let userId = null;
let pageLoadStartTime = performance.now();

// Enhanced metrics collection
const enhancedMetrics = {
  navigationStart: performance.timeOrigin,
  pageLoadTime: null,
  domContentLoaded: null,
  firstPaint: null,
  deviceMemory: navigator.deviceMemory || 'unknown',
  hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
  connectionType: getConnectionType(),
  viewportSize: getViewportSize(),
  screenSize: getScreenSize(),
  userAgent: navigator.userAgent,
  language: navigator.language,
  cookieEnabled: navigator.cookieEnabled,
  javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
  doNotTrack: navigator.doNotTrack || 'unknown'
};

/**
 * Initialize Web Vitals collection
 * @param {Object} options - Configuration options
 * @param {string} options.userId - User ID for tracking
 * @param {string} options.apiUrl - Custom API endpoint
 * @param {boolean} options.enableBatching - Enable batching (default: true)
 */
export function initWebVitals(options = {}) {
  try {
    // Set configuration
    if (options.userId) userId = options.userId;
    if (options.apiUrl) VITALS_ENDPOINT = options.apiUrl;
    
    // Collect additional performance metrics
    collectAdditionalMetrics();
    
    // Set up Core Web Vitals collection
    setupCoreWebVitals(options);
    
    // Set up page lifecycle tracking
    setupPageLifecycle();
    
    // Set up error tracking
    setupErrorTracking();
    
    console.log('Web Vitals collection initialized', { sessionId, userId });
    
  } catch (error) {
    console.warn('Web Vitals initialization failed:', error);
  }
}

/**
 * Set up Core Web Vitals collection
 */
function setupCoreWebVitals(options) {
  const onVitalReport = (vital) => {
    const enhancedVital = enhanceVitalData(vital);
    
    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital collected:', enhancedVital);
    }
    
    // Send vital data
    if (options.enableBatching !== false) {
      addToBatch(enhancedVital);
    } else {
      sendVitalData(enhancedVital);
    }
  };

  // Collect Core Web Vitals
  getCLS(onVitalReport, { reportAllChanges: true });
  getFCP(onVitalReport);
  getFID(onVitalReport);
  getLCP(onVitalReport, { reportAllChanges: true });
  getTTFB(onVitalReport);
  
  // Collect additional Web Vitals for comprehensive analysis
  collectNavigationTiming();
  collectResourceTiming();
}

/**
 * Enhance vital data with additional context
 */
function enhanceVitalData(vital) {
  return {
    url: window.location.href,
    metrics: {
      [vital.name]: vital.value,
      // Add any additional metrics specific to this vital
      ...(vital.name === 'LCP' && { 
        lcpElement: vital.entries?.[vital.entries.length - 1]?.element?.tagName || 'unknown',
        lcpLoadTime: vital.entries?.[vital.entries.length - 1]?.loadTime || null
      }),
      ...(vital.name === 'CLS' && { 
        clsEntries: vital.entries?.length || 0,
        clsHadRecentInput: vital.entries?.some(entry => entry.hadRecentInput) || false
      }),
      ...(vital.name === 'FID' && { 
        fidEventType: vital.entries?.[0]?.name || 'unknown',
        fidStartTime: vital.entries?.[0]?.startTime || null
      })
    },
    timestamp: Date.now(),
    sessionId,
    userId,
    userAgent: navigator.userAgent,
    connection: getConnectionInfo(),
    navigation: getNavigationInfo(),
    viewport: getViewportSize(),
    device: {
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      platform: navigator.platform || 'unknown'
    },
    performance: {
      navigationStart: performance.timeOrigin,
      pageLoadTime: enhancedMetrics.pageLoadTime,
      domContentLoaded: enhancedMetrics.domContentLoaded,
      firstPaint: enhancedMetrics.firstPaint
    }
  };
}

/**
 * Collect additional timing metrics
 */
function collectAdditionalMetrics() {
  // Page load completion
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enhancedMetrics.domContentLoaded = performance.now() - pageLoadStartTime;
    });
    
    window.addEventListener('load', () => {
      enhancedMetrics.pageLoadTime = performance.now() - pageLoadStartTime;
      
      // Send page load completion metric
      const pageLoadVital = {
        url: window.location.href,
        metrics: {
          PAGE_LOAD: enhancedMetrics.pageLoadTime,
          DOM_CONTENT_LOADED: enhancedMetrics.domContentLoaded
        },
        timestamp: Date.now(),
        sessionId,
        userId,
        userAgent: navigator.userAgent,
        connection: getConnectionInfo(),
        navigation: getNavigationInfo()
      };
      
      addToBatch(pageLoadVital);
    });
  }
  
  // First Paint timing
  if ('PerformanceObserver' in window) {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            enhancedMetrics.firstPaint = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Paint observer not supported:', error);
    }
  }
}

/**
 * Collect Navigation Timing API data
 */
function collectNavigationTiming() {
  if (!('performance' in window) || !performance.getEntriesByType) return;
  
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!navigation) return;
  
  const navigationVital = {
    url: window.location.href,
    metrics: {
      DNS_LOOKUP: navigation.domainLookupEnd - navigation.domainLookupStart,
      TCP_CONNECT: navigation.connectEnd - navigation.connectStart,
      TLS_NEGOTIATE: navigation.secureConnectionStart > 0 
        ? navigation.connectEnd - navigation.secureConnectionStart 
        : 0,
      REQUEST_TIME: navigation.responseStart - navigation.requestStart,
      RESPONSE_TIME: navigation.responseEnd - navigation.responseStart,
      DOM_PARSE: navigation.domContentLoadedEventStart - navigation.responseEnd,
      RESOURCE_LOAD: navigation.loadEventStart - navigation.domContentLoadedEventEnd
    },
    timestamp: Date.now(),
    sessionId,
    userId,
    type: 'navigation'
  };
  
  setTimeout(() => addToBatch(navigationVital), 1000); // Delay to ensure metrics are available
}

/**
 * Collect Resource Timing for critical resources
 */
function collectResourceTiming() {
  if (!('PerformanceObserver' in window)) return;
  
  try {
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only track critical resources
        if (isCriticalResource(entry.name)) {
          const resourceVital = {
            url: window.location.href,
            metrics: {
              RESOURCE_LOAD_TIME: entry.duration,
              RESOURCE_SIZE: entry.transferSize || 0
            },
            timestamp: Date.now(),
            sessionId,
            userId,
            type: 'resource',
            resource: {
              name: entry.name,
              type: getResourceType(entry.name),
              cached: entry.transferSize === 0 && entry.decodedBodySize > 0
            }
          };
          
          addToBatch(resourceVital);
        }
      }
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('Resource observer not supported:', error);
  }
}

/**
 * Set up page lifecycle tracking
 */
function setupPageLifecycle() {
  // Page visibility changes
  document.addEventListener('visibilitychange', () => {
    const visibilityVital = {
      url: window.location.href,
      metrics: {
        VISIBILITY_CHANGE: Date.now(),
        HIDDEN: document.hidden
      },
      timestamp: Date.now(),
      sessionId,
      userId,
      type: 'visibility'
    };
    
    if (document.hidden) {
      // Page is becoming hidden - flush any pending vitals
      flushBatch();
    }
    
    addToBatch(visibilityVital);
  });
  
  // Page unload - flush remaining data
  window.addEventListener('beforeunload', () => {
    flushBatch(true); // Synchronous flush
  });
  
  // Page freeze/resume (for mobile)
  window.addEventListener('freeze', () => {
    flushBatch(true);
  });
}

/**
 * Set up error tracking for performance correlation
 */
function setupErrorTracking() {
  window.addEventListener('error', (event) => {
    const errorVital = {
      url: window.location.href,
      metrics: {
        ERROR_TIME: Date.now() - pageLoadStartTime
      },
      timestamp: Date.now(),
      sessionId,
      userId,
      type: 'error',
      error: {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      }
    };
    
    addToBatch(errorVital);
  });
  
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const rejectionVital = {
      url: window.location.href,
      metrics: {
        REJECTION_TIME: Date.now() - pageLoadStartTime
      },
      timestamp: Date.now(),
      sessionId,
      userId,
      type: 'promise_rejection',
      error: {
        reason: event.reason?.toString() || 'Unknown'
      }
    };
    
    addToBatch(rejectionVital);
  });
}

/**
 * Add vital to batch for efficient sending
 */
function addToBatch(vital) {
  vitalsBuffer.push(vital);
  
  // Auto-flush when batch is full
  if (vitalsBuffer.length >= BATCH_SIZE) {
    flushBatch();
  } else {
    // Schedule batch flush
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(() => flushBatch(), BATCH_TIMEOUT);
  }
}

/**
 * Flush current batch of vitals
 */
function flushBatch(sync = false) {
  if (vitalsBuffer.length === 0) return;
  
  const batch = [...vitalsBuffer];
  vitalsBuffer = [];
  
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  
  if (sync) {
    sendVitalsBatch(batch, true);
  } else {
    sendVitalsBatch(batch);
  }
}

/**
 * Send individual vital data
 */
async function sendVitalData(vital, retryCount = 0) {
  try {
    const response = await fetch(VITALS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vital),
      keepalive: true
    });
    
    if (!response.ok && retryCount < MAX_RETRIES) {
      setTimeout(() => {
        sendVitalData(vital, retryCount + 1);
      }, RETRY_DELAY * (retryCount + 1));
    }
    
  } catch (error) {
    console.warn('Failed to send vital data:', error);
    
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => {
        sendVitalData(vital, retryCount + 1);
      }, RETRY_DELAY * (retryCount + 1));
    }
  }
}

/**
 * Send batch of vitals
 */
async function sendVitalsBatch(batch, sync = false, retryCount = 0) {
  try {
    const payload = {
      vitals: batch
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true
    };
    
    let response;
    if (sync && 'sendBeacon' in navigator) {
      // Use sendBeacon for synchronous sending (e.g., page unload)
      const success = navigator.sendBeacon(
        `${VITALS_ENDPOINT}/batch`,
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );
      
      if (!success && retryCount < MAX_RETRIES) {
        setTimeout(() => {
          sendVitalsBatch(batch, false, retryCount + 1);
        }, RETRY_DELAY * (retryCount + 1));
      }
      return;
    }
    
    response = await fetch(`${VITALS_ENDPOINT}/batch`, options);
    
    if (!response.ok && retryCount < MAX_RETRIES) {
      setTimeout(() => {
        sendVitalsBatch(batch, sync, retryCount + 1);
      }, RETRY_DELAY * (retryCount + 1));
    }
    
  } catch (error) {
    console.warn('Failed to send vitals batch:', error);
    
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => {
        sendVitalsBatch(batch, sync, retryCount + 1);
      }, RETRY_DELAY * (retryCount + 1));
    }
  }
}

// Utility functions
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getConnectionType() {
  if (!('connection' in navigator)) return 'unknown';
  return navigator.connection?.effectiveType || navigator.connection?.type || 'unknown';
}

function getConnectionInfo() {
  if (!('connection' in navigator)) return {};
  
  const conn = navigator.connection;
  return {
    effectiveType: conn.effectiveType,
    type: conn.type,
    downlink: conn.downlink,
    rtt: conn.rtt,
    saveData: conn.saveData
  };
}

function getNavigationInfo() {
  if (!('performance' in window) || !performance.getEntriesByType) return {};
  
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!navigation) return {};
  
  return {
    type: navigation.type,
    redirectCount: navigation.redirectCount,
    transferSize: navigation.transferSize,
    encodedBodySize: navigation.encodedBodySize,
    decodedBodySize: navigation.decodedBodySize
  };
}

function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function getScreenSize() {
  return {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth
  };
}

function isCriticalResource(url) {
  return (
    url.includes('/static/css/') ||
    url.includes('/static/js/main.') ||
    url.includes('/static/js/runtime-main.') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    url.includes('manifest.json')
  );
}

function getResourceType(url) {
  if (url.includes('.css')) return 'css';
  if (url.includes('.js')) return 'js';
  if (url.includes('.woff') || url.includes('.ttf')) return 'font';
  if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) return 'image';
  return 'other';
}

// Export for custom usage
export {
  sendVitalData,
  flushBatch,
  enhancedMetrics
};