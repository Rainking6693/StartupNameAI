// Performance Optimization Service
// Handles performance monitoring, optimization, and Core Web Vitals tracking

class PerformanceService {
  constructor() {
    this.metrics = {
      LCP: null, // Largest Contentful Paint
      FID: null, // First Input Delay
      CLS: null, // Cumulative Layout Shift
      FCP: null, // First Contentful Paint
      TTFB: null, // Time to First Byte
      SI: null // Speed Index
    };

    this.observers = new Map();
    this.isInitialized = false;

    console.log('⚡ Performance Service initialized');
  }

  // Initialize performance monitoring
  initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.isInitialized = true;
    this.setupWebVitalsMonitoring();
    this.setupResourceTiming();
    this.setupPerformanceObserver();

    console.log('📊 Performance monitoring initialized');
  }

  // Setup Core Web Vitals monitoring
  setupWebVitalsMonitoring() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();

    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  // Observe Largest Contentful Paint
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.metrics.LCP = lastEntry.startTime;
        this.logMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('LCP', observer);
    } catch (error) {
      console.warn('LCP observation failed:', error);
    }
  }

  // Observe First Input Delay
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.logMetric('FID', this.metrics.FID);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('FID', observer);
    } catch (error) {
      console.warn('FID observation failed:', error);
    }
  }

  // Observe Cumulative Layout Shift
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.metrics.CLS = clsValue;
        this.logMetric('CLS', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('CLS', observer);
    } catch (error) {
      console.warn('CLS observation failed:', error);
    }
  }

  // Observe First Contentful Paint
  observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.FCP = entry.startTime;
          this.logMetric('FCP', entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('FCP', observer);
    } catch (error) {
      console.warn('FCP observation failed:', error);
    }
  }

  // Setup resource timing monitoring
  setupResourceTiming() {
    if (!('performance' in window)) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.analyzeResourceTiming();
      }, 0);
    });
  }

  // Analyze resource timing
  analyzeResourceTiming() {
    const resources = performance.getEntriesByType('resource');

    resources.forEach((resource) => {
      const loadTime = resource.responseEnd - resource.startTime;

      // Log slow resources
      if (loadTime > 1000) {
        console.warn(`🐌 Slow resource: ${resource.name} (${loadTime.toFixed(2)}ms)`);
      }
    });

    // Calculate TTFB
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.TTFB = navigation.responseStart - navigation.fetchStart;
      this.logMetric('TTFB', this.metrics.TTFB);
    }
  }

  // Setup general performance observer
  setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Log long tasks
          if (entry.entryType === 'longtask') {
            console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', observer);
    } catch (error) {
      console.warn('Performance observer setup failed:', error);
    }
  }

  // Log performance metrics
  logMetric(name, value) {
    const score = this.getMetricScore(name, value);
    console.log(`📊 ${name}: ${value.toFixed(2)}ms (${score})`);

    // Store in localStorage for debugging
    const metrics = JSON.parse(localStorage.getItem('startupnamer_performance_metrics') || '{}');
    metrics[name] = {
      value,
      score,
      timestamp: Date.now()
    };
    localStorage.setItem('startupnamer_performance_metrics', JSON.stringify(metrics));
  }

  // Get metric score (Good, Needs Improvement, Poor)
  getMetricScore(name, value) {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name];
    if (!threshold) return 'Unknown';

    if (value <= threshold.good) return 'Good';
    if (value <= threshold.poor) return 'Needs Improvement';
    return 'Poor';
  }

  // Get all metrics
  getAllMetrics() {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }

  // Get performance score
  getPerformanceScore() {
    const scores = [];

    Object.entries(this.metrics).forEach(([name, value]) => {
      if (value !== null) {
        const score = this.getMetricScore(name, value);
        scores.push(score === 'Good' ? 100 : score === 'Needs Improvement' ? 60 : 20);
      }
    });

    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  // Optimize images
  optimizeImages() {
    const images = document.querySelectorAll('img');

    images.forEach((img) => {
      // Add loading="lazy" for images below the fold
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });

    console.log(`🖼️ Optimized ${images.length} images`);
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/css/critical.css'
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.woff2') ? 'font' : 'style';
      if (resource.endsWith('.woff2')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });

    console.log('🚀 Critical resources preloaded');
  }

  // Enable service worker for caching
  enableServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('🔧 Service Worker registered:', registration);
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    }
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
    this.isInitialized = false;
  }

  // Performance optimization recommendations
  getOptimizationRecommendations() {
    const recommendations = [];

    if (this.metrics.LCP > 4000) {
      recommendations.push({
        type: 'LCP',
        message: 'Largest Contentful Paint is too slow. Consider optimizing images and reducing render-blocking resources.',
        priority: 'high'
      });
    }

    if (this.metrics.FID > 300) {
      recommendations.push({
        type: 'FID',
        message: 'First Input Delay is too high. Consider reducing JavaScript execution time.',
        priority: 'high'
      });
    }

    if (this.metrics.CLS > 0.25) {
      recommendations.push({
        type: 'CLS',
        message: 'Cumulative Layout Shift is too high. Consider adding size attributes to images and avoiding dynamic content insertion.',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getAllMetrics();
    const score = this.getPerformanceScore();
    const recommendations = this.getOptimizationRecommendations();

    return {
      timestamp: Date.now(),
      score,
      metrics,
      recommendations,
      summary: {
        totalMetrics: Object.keys(metrics).length,
        goodMetrics: Object.values(metrics).filter(value =>
          typeof value === 'number' && this.getMetricScore('LCP', value) === 'Good'
        ).length,
        recommendationsCount: recommendations.length
      }
    };
  }
}

// Create and export singleton instance
const performanceService = new PerformanceService();
export default performanceService;
