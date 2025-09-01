/**
 * Performance Optimizer Component
 * Implements Core Web Vitals optimizations and performance monitoring
 */

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Web Vitals measurement and reporting
const sendToGoogleAnalytics = ({ name, delta, value, id }) => {
  // Only send metrics in production
  if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      non_interaction: true,
      custom_map: { metric_value: value }
    });
  }
  
  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, { value, delta, id });
  }
};

// Performance optimization utilities
class PerformanceOptimizer {
  constructor() {
    this.resourceHints = new Set();
    this.criticalResources = new Set();
  }

  // Preload critical resources
  preloadResource(href, as, type = null, crossorigin = null) {
    if (typeof window === 'undefined' || this.resourceHints.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = crossorigin;
    
    document.head.appendChild(link);
    this.resourceHints.add(href);
  }

  // Prefetch resources for next navigation
  prefetchResource(href) {
    if (typeof window === 'undefined' || this.resourceHints.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
    this.resourceHints.add(href);
  }

  // DNS prefetch for external domains
  dnsPrefetch(domain) {
    if (typeof window === 'undefined' || this.resourceHints.has(domain)) return;
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    
    document.head.appendChild(link);
    this.resourceHints.add(domain);
  }

  // Preconnect to critical third-party origins
  preconnect(origin, crossorigin = false) {
    if (typeof window === 'undefined' || this.resourceHints.has(origin)) return;
    
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    if (crossorigin) link.crossOrigin = '';
    
    document.head.appendChild(link);
    this.resourceHints.add(origin);
  }

  // Lazy load images with intersection observer
  initLazyLoading() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load the actual image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // Remove loading placeholder
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Resource loading optimization
  optimizeResourceLoading() {
    if (typeof window === 'undefined') return;

    // Critical third-party connections
    this.preconnect('https://fonts.googleapis.com', true);
    this.preconnect('https://fonts.gstatic.com', true);
    this.preconnect('https://www.google-analytics.com');
    
    // DNS prefetch for other domains
    this.dnsPrefetch('https://api.openai.com');
    this.dnsPrefetch('https://vercel.live');
    
    // Preload critical CSS and fonts
    this.preloadResource('/fonts/inter-var.woff2', 'font', 'font/woff2', 'anonymous');
    
    // Prefetch likely next pages
    setTimeout(() => {
      this.prefetchResource('/naming-tool');
      this.prefetchResource('/features');
      this.prefetchResource('/pricing');
    }, 2000);
  }

  // Service Worker registration for caching
  registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Critical CSS inlining
  inlineCriticalCSS() {
    if (typeof window === 'undefined') return;

    const criticalCSS = `
      /* Critical above-the-fold styles */
      .hero-section { min-height: 100vh; }
      .nav-header { position: fixed; top: 0; width: 100%; z-index: 50; }
      .loading-placeholder { 
        background: linear-gradient(90deg, #f0f0f0 25%, transparent 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  // Initialize all optimizations
  init() {
    this.optimizeResourceLoading();
    this.initLazyLoading();
    this.registerServiceWorker();
    this.inlineCriticalCSS();
  }
}

// Main Performance Optimizer Component
export default function PerformanceOptimizerComponent() {
  useEffect(() => {
    // Initialize performance optimizations
    const optimizer = new PerformanceOptimizer();
    optimizer.init();

    // Measure Web Vitals
    getCLS(sendToGoogleAnalytics);
    getFID(sendToGoogleAnalytics);
    getFCP(sendToGoogleAnalytics);
    getLCP(sendToGoogleAnalytics);
    getTTFB(sendToGoogleAnalytics);

    // Performance monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor long tasks that block the main thread
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration}ms`, entry);
              
              // Report to analytics
              if (window.gtag) {
                window.gtag('event', 'long_task', {
                  event_category: 'Performance',
                  event_label: entry.name,
                  value: Math.round(entry.duration),
                  non_interaction: true
                });
              }
            }
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task observer not supported
      }

      // Monitor layout shifts
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          let totalScore = 0;
          list.getEntries().forEach((entry) => {
            totalScore += entry.value;
            
            if (entry.value > 0.1) {
              console.warn('Large layout shift detected:', entry);
            }
          });
        });
        
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Layout shift observer not supported
      }

      // Monitor paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log(`${entry.name}: ${entry.startTime}ms`);
          });
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // Paint observer not supported
      }
    }

    // Connection speed detection and optimization
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const { effectiveType, downlink, rtt } = connection;
        
        // Adjust performance based on connection
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          // Disable heavy animations and reduce image quality
          document.documentElement.classList.add('slow-connection');
        }
        
        // Log connection info for analytics
        if (window.gtag) {
          window.gtag('event', 'connection_info', {
            event_category: 'Performance',
            custom_map: {
              effective_type: effectiveType,
              downlink: downlink,
              rtt: rtt
            },
            non_interaction: true
          });
        }
      }
    }

    // Memory usage monitoring
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memoryInfo = performance.memory;
      
      // Log memory usage periodically
      const memoryInterval = setInterval(() => {
        const used = Math.round(memoryInfo.usedJSHeapSize / 1048576);
        const total = Math.round(memoryInfo.totalJSHeapSize / 1048576);
        const limit = Math.round(memoryInfo.jsHeapSizeLimit / 1048576);
        
        console.log(`Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`);
        
        // Warn if memory usage is high
        if (used / limit > 0.8) {
          console.warn('High memory usage detected');
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(memoryInterval);
    }

    // Page visibility optimization
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - pause non-critical operations
        console.log('Page hidden - pausing non-critical operations');
      } else {
        // Page is visible - resume operations
        console.log('Page visible - resuming operations');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Utility function for lazy loading images
export const LazyImage = ({ src, srcSet, alt, className, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={loaded ? src : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
      srcSet={loaded ? srcSet : undefined}
      alt={alt}
      className={`${className} ${loaded ? 'lazy-loaded' : 'lazy-loading'}`}
      loading="lazy"
      {...props}
    />
  );
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Track page load performance
    const trackPageLoad = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const perfData = window.performance.getEntriesByType('navigation')[0];
      
      if (perfData && window.gtag) {
        window.gtag('event', 'page_load_timing', {
          event_category: 'Performance',
          custom_map: {
            dns_time: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
            connect_time: Math.round(perfData.connectEnd - perfData.connectStart),
            response_time: Math.round(perfData.responseEnd - perfData.requestStart),
            dom_load_time: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
            total_load_time: Math.round(perfData.loadEventEnd - perfData.navigationStart)
          },
          non_interaction: true
        });
      }
    };

    // Track on page load
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
      return () => window.removeEventListener('load', trackPageLoad);
    }
  }, []);
};