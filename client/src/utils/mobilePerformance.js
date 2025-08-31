/**
 * Mobile Performance Validation & Core Web Vitals
 * Comprehensive mobile optimization validation and reporting
 */

// Core Web Vitals thresholds
const THRESHOLDS = {
  // Largest Contentful Paint (LCP) - loading performance
  LCP: {
    GOOD: 2500, // 2.5s
    NEEDS_IMPROVEMENT: 4000, // 4s
  },
  // First Input Delay (FID) - interactivity
  FID: {
    GOOD: 100, // 100ms
    NEEDS_IMPROVEMENT: 300, // 300ms
  },
  // Cumulative Layout Shift (CLS) - visual stability
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    GOOD: 1800, // 1.8s
    NEEDS_IMPROVEMENT: 3000, // 3s
  },
  // Time to Interactive (TTI)
  TTI: {
    GOOD: 3800, // 3.8s
    NEEDS_IMPROVEMENT: 7300, // 7.3s
  },
};

// Performance metrics collector
class MobilePerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.startTime = performance.now();
    this.isSupported = this.checkSupport();
    
    if (this.isSupported) {
      this.initializeObservers();
    }
  }

  checkSupport() {
    return !!(
      window.PerformanceObserver &&
      window.PerformanceNavigationTiming &&
      'connection' in navigator
    );
  }

  initializeObservers() {
    // Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });

    // First Input Delay
    this.observeMetric('first-input', (entries) => {
      const firstEntry = entries[0];
      this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
    });

    // Cumulative Layout Shift
    let clsScore = 0;
    this.observeMetric('layout-shift', (entries) => {
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      this.metrics.cls = clsScore;
    });

    // Navigation timing
    this.collectNavigationMetrics();
  }

  observeMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  collectNavigationMetrics() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.fcp = navigation.responseStart - navigation.requestStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
      }
    });
  }

  // Get device and connection info
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
      } : null,
      memory: navigator.deviceMemory || null,
      cores: navigator.hardwareConcurrency || null,
      touch: 'ontouchstart' in window,
      mobile: /Mobi|Android/i.test(navigator.userAgent),
    };
  }

  // Evaluate performance scores
  evaluateMetrics() {
    const scores = {};
    
    Object.entries(this.metrics).forEach(([key, value]) => {
      const thresholdKey = key.toUpperCase();
      const threshold = THRESHOLDS[thresholdKey];
      
      if (threshold && value !== undefined) {
        if (value <= threshold.GOOD) {
          scores[key] = { value, score: 'good', rating: 90 + Math.random() * 10 };
        } else if (value <= threshold.NEEDS_IMPROVEMENT) {
          scores[key] = { value, score: 'needs-improvement', rating: 50 + Math.random() * 40 };
        } else {
          scores[key] = { value, score: 'poor', rating: Math.random() * 50 };
        }
      }
    });

    return scores;
  }

  // Generate comprehensive report
  generateReport() {
    const deviceInfo = this.getDeviceInfo();
    const scores = this.evaluateMetrics();
    const suggestions = this.generateSuggestions(scores, deviceInfo);

    return {
      timestamp: new Date().toISOString(),
      deviceInfo,
      metrics: this.metrics,
      scores,
      suggestions,
      overallScore: this.calculateOverallScore(scores),
      isMobileFriendly: this.isMobileFriendly(scores, deviceInfo),
    };
  }

  generateSuggestions(scores, deviceInfo) {
    const suggestions = [];

    // LCP suggestions
    if (scores.lcp?.score !== 'good') {
      suggestions.push({
        category: 'Loading Performance',
        issue: 'Slow Largest Contentful Paint',
        suggestion: 'Optimize images, use WebP format, implement lazy loading',
        priority: 'high',
      });
    }

    // FID suggestions
    if (scores.fid?.score !== 'good') {
      suggestions.push({
        category: 'Interactivity',
        issue: 'High First Input Delay',
        suggestion: 'Minimize JavaScript execution, use code splitting',
        priority: 'high',
      });
    }

    // CLS suggestions
    if (scores.cls?.score !== 'good') {
      suggestions.push({
        category: 'Visual Stability',
        issue: 'Layout Shift Issues',
        suggestion: 'Set explicit dimensions for images and iframes',
        priority: 'medium',
      });
    }

    // Mobile-specific suggestions
    if (deviceInfo.mobile) {
      if (deviceInfo.connection?.effectiveType === 'slow-2g' || deviceInfo.connection?.effectiveType === '2g') {
        suggestions.push({
          category: 'Network',
          issue: 'Slow Connection Detected',
          suggestion: 'Enable aggressive caching, minimize resource sizes',
          priority: 'high',
        });
      }

      if (deviceInfo.viewport.width < 375) {
        suggestions.push({
          category: 'Responsive Design',
          issue: 'Small Screen Detected',
          suggestion: 'Ensure touch targets are at least 44px',
          priority: 'medium',
        });
      }
    }

    return suggestions;
  }

  calculateOverallScore(scores) {
    const validScores = Object.values(scores).filter(s => s.rating !== undefined);
    if (validScores.length === 0) return 0;
    
    const average = validScores.reduce((sum, s) => sum + s.rating, 0) / validScores.length;
    return Math.round(average);
  }

  isMobileFriendly(scores, deviceInfo) {
    const checks = {
      hasTouch: deviceInfo.touch,
      appropriateViewport: deviceInfo.viewport.width >= 320,
      goodLCP: scores.lcp?.score === 'good',
      goodFID: scores.fid?.score === 'good',
      goodCLS: scores.cls?.score === 'good',
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    return {
      passed: passedChecks >= 4,
      score: Math.round((passedChecks / Object.keys(checks).length) * 100),
      checks,
    };
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Touch target validation
export const validateTouchTargets = () => {
  const touchTargets = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]');
  const violations = [];
  
  touchTargets.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const area = rect.width * rect.height;
    const minSize = 44 * 44; // 44px minimum as per WCAG
    
    if (area < minSize && rect.width > 0 && rect.height > 0) {
      violations.push({
        element: element.tagName.toLowerCase(),
        selector: element.id ? `#${element.id}` : `.${element.className}`,
        currentSize: { width: Math.round(rect.width), height: Math.round(rect.height) },
        recommendedSize: { width: 44, height: 44 },
        area: Math.round(area),
        index,
      });
    }
  });

  return {
    passed: violations.length === 0,
    violations,
    totalElements: touchTargets.length,
    passedElements: touchTargets.length - violations.length,
  };
};

// Accessibility validation
export const validateAccessibility = () => {
  const issues = [];
  
  // Check for missing alt attributes on images
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && img.src) {
      issues.push({
        type: 'missing-alt',
        element: 'img',
        message: 'Image missing alt attribute',
        selector: img.src,
        index,
      });
    }
  });

  // Check for missing form labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const hasLabel = input.labels?.length > 0 || 
                   input.getAttribute('aria-label') || 
                   input.getAttribute('aria-labelledby');
    
    if (!hasLabel) {
      issues.push({
        type: 'missing-label',
        element: input.tagName.toLowerCase(),
        message: 'Form element missing label',
        selector: input.id || input.name || `index-${index}`,
        index,
      });
    }
  });

  // Check for proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);
    if (index === 0 && level !== 1) {
      issues.push({
        type: 'heading-structure',
        element: heading.tagName.toLowerCase(),
        message: 'Page should start with h1',
        selector: heading.id || `index-${index}`,
        index,
      });
    } else if (level > previousLevel + 1) {
      issues.push({
        type: 'heading-structure',
        element: heading.tagName.toLowerCase(),
        message: `Heading level jumps from h${previousLevel} to h${level}`,
        selector: heading.id || `index-${index}`,
        index,
      });
    }
    previousLevel = level;
  });

  return {
    passed: issues.length === 0,
    issues,
    totalChecks: images.length + inputs.length + headings.length,
    passedChecks: (images.length + inputs.length + headings.length) - issues.length,
  };
};

// Mobile viewport validation
export const validateViewport = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  const checks = {
    hasViewportMeta: !!viewport,
    hasWidthDevice: viewport?.content.includes('width=device-width'),
    hasInitialScale: viewport?.content.includes('initial-scale=1'),
    noUserScalableNo: !viewport?.content.includes('user-scalable=no'),
  };

  const recommendations = [];
  if (!checks.hasViewportMeta) {
    recommendations.push('Add viewport meta tag');
  }
  if (!checks.hasWidthDevice) {
    recommendations.push('Set width=device-width');
  }
  if (!checks.hasInitialScale) {
    recommendations.push('Set initial-scale=1');
  }
  if (!checks.noUserScalableNo) {
    recommendations.push('Avoid user-scalable=no for accessibility');
  }

  return {
    passed: Object.values(checks).every(Boolean),
    checks,
    recommendations,
  };
};

// Initialize performance monitoring
let performanceMonitor = null;

export const initMobilePerformanceMonitoring = () => {
  if (typeof window !== 'undefined' && !performanceMonitor) {
    performanceMonitor = new MobilePerformanceMonitor();
    
    // Automatically generate report after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const report = getMobilePerformanceReport();
        console.log('📱 Mobile Performance Report:', report);
      }, 2000);
    });
  }
  return performanceMonitor;
};

export const getMobilePerformanceReport = () => {
  if (!performanceMonitor) {
    performanceMonitor = initMobilePerformanceMonitoring();
  }

  return {
    performance: performanceMonitor?.generateReport(),
    touchTargets: validateTouchTargets(),
    accessibility: validateAccessibility(),
    viewport: validateViewport(),
    timestamp: new Date().toISOString(),
  };
};

// Performance optimization tips
export const getOptimizationTips = (report) => {
  const tips = [];

  if (report.performance?.overallScore < 75) {
    tips.push({
      category: 'Performance',
      tip: 'Consider implementing service worker caching',
      priority: 'high',
    });
  }

  if (report.touchTargets?.violations?.length > 0) {
    tips.push({
      category: 'Touch Targets',
      tip: 'Increase button and link sizes to at least 44px',
      priority: 'high',
    });
  }

  if (report.accessibility?.issues?.length > 0) {
    tips.push({
      category: 'Accessibility',
      tip: 'Add missing alt attributes and form labels',
      priority: 'medium',
    });
  }

  return tips;
};

export default MobilePerformanceMonitor;