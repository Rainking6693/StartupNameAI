// SEO and Performance Utilities for StartupNamer.org
// Master SEO Performance Engineer - Technical Implementation

/**
 * Core Web Vitals Monitoring and Performance Optimization
 */

// Performance monitoring and tracking
export const trackCoreWebVitals = () => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Import web-vitals dynamically for better performance
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS((metric) => {
      window.gtag('event', 'web_vital', {
        event_category: 'Web Vitals',
        event_label: 'CLS',
        value: Math.round(metric.value * 1000),
        custom_parameter_1: metric.rating,
        non_interaction: true
      });
    });

    getFID((metric) => {
      window.gtag('event', 'web_vital', {
        event_category: 'Web Vitals', 
        event_label: 'FID',
        value: Math.round(metric.value),
        custom_parameter_1: metric.rating,
        non_interaction: true
      });
    });

    getFCP((metric) => {
      window.gtag('event', 'web_vital', {
        event_category: 'Web Vitals',
        event_label: 'FCP', 
        value: Math.round(metric.value),
        custom_parameter_1: metric.rating,
        non_interaction: true
      });
    });

    getLCP((metric) => {
      window.gtag('event', 'web_vital', {
        event_category: 'Web Vitals',
        event_label: 'LCP',
        value: Math.round(metric.value),
        custom_parameter_1: metric.rating,
        non_interaction: true
      });
    });

    getTTFB((metric) => {
      window.gtag('event', 'web_vital', {
        event_category: 'Web Vitals',
        event_label: 'TTFB',
        value: Math.round(metric.value),
        custom_parameter_1: metric.rating,
        non_interaction: true
      });
    });
  }).catch((error) => {
    console.warn('Web Vitals library not available:', error);
  });
};

// Resource loading optimization
export const preloadCriticalResources = () => {
  const criticalResources = [
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap', as: 'style' },
    { href: '/api/config', as: 'fetch', crossorigin: 'anonymous' },
    { href: '/favicon-32x32.png', as: 'image' },
    { href: '/og-image.jpg', as: 'image' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    document.head.appendChild(link);
  });
};

// Lazy loading utilities
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Image optimization and lazy loading
export const optimizeImage = (src, alt, className = '', lazy = true) => {
  const img = document.createElement('img');
  img.alt = alt;
  img.className = className;
  
  if (lazy) {
    img.loading = 'lazy';
    img.decoding = 'async';
  }
  
  // Use WebP format if supported
  if ('loading' in HTMLImageElement.prototype) {
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    img.src = webpSrc;
    
    img.onerror = () => {
      img.src = src; // Fallback to original format
    };
  } else {
    img.src = src;
  }
  
  return img;
};

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && 'caches' in window) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Update available
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Show update notification
                if (window.gtag) {
                  window.gtag('event', 'sw_update_available', {
                    event_category: 'Service Worker',
                    event_label: 'Update Available'
                  });
                }
              }
            });
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Performance budget monitoring
export const checkPerformanceBudget = () => {
  if (!window.performance || !window.performance.getEntriesByType) return;

  const navigation = window.performance.getEntriesByType('navigation')[0];
  if (!navigation) return;

  const metrics = {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    totalTime: navigation.loadEventEnd - navigation.fetchStart,
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpConnection: navigation.connectEnd - navigation.connectStart,
    serverResponse: navigation.responseEnd - navigation.requestStart
  };

  // Performance budgets (in milliseconds)
  const budgets = {
    domContentLoaded: 1500,
    loadComplete: 3000,
    totalTime: 5000,
    dnsLookup: 200,
    tcpConnection: 500,
    serverResponse: 1000
  };

  // Check budget violations
  Object.keys(budgets).forEach(metric => {
    if (metrics[metric] > budgets[metric]) {
      console.warn(`Performance budget exceeded for ${metric}: ${metrics[metric]}ms > ${budgets[metric]}ms`);
      
      if (window.gtag) {
        window.gtag('event', 'performance_budget_exceeded', {
          event_category: 'Performance',
          event_label: metric,
          value: Math.round(metrics[metric]),
          custom_parameter_1: Math.round(budgets[metric])
        });
      }
    }
  });

  return { metrics, budgets };
};

// SEO meta tag generation for dynamic pages
export const generateMetaTags = (pageData) => {
  const {
    title = 'StartupNamer.org - AI-Powered Startup Names',
    description = 'Generate perfect startup names with AI technology',
    keywords = 'startup names, AI naming, business names',
    image = '/og-image.jpg',
    url = 'https://startupnamer.org/',
    type = 'website'
  } = pageData;

  return {
    title,
    description,
    keywords,
    canonical: url,
    openGraph: {
      type,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      site_name: 'StartupNamer.org'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@StartupNamer',
      title,
      description,
      image
    }
  };
};

// Structured data generators
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StartupNamer.org',
    alternateName: 'The Startup Naming Authority',
    url: 'https://startupnamer.org',
    logo: {
      '@type': 'ImageObject',
      url: 'https://startupnamer.org/logo.png',
      width: 300,
      height: 300
    },
    description: 'The leading AI-powered startup naming platform trusted by over 10,000 entrepreneurs worldwide',
    foundingDate: '2023-01-01',
    sameAs: [
      'https://www.facebook.com/StartupNamer',
      'https://twitter.com/StartupNamer',
      'https://www.linkedin.com/company/startupnamer'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@startupnamer.org',
      availableLanguage: 'English'
    }
  };
};

export const generateWebApplicationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'StartupNamer.org',
    alternateName: 'Startup Naming Authority',
    description: 'AI-powered startup naming platform with domain checking, brandability analysis, and expert guidance for entrepreneurs',
    url: 'https://startupnamer.org',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      name: 'Premium Startup Naming Package',
      description: 'Advanced AI naming with domain checking and brandability analysis',
      price: '19',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://startupnamer.org/pricing'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1247',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'StartupNamer.org',
      url: 'https://startupnamer.org'
    }
  };
};

// Critical CSS injection
export const injectCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Font display optimization
export const optimizeFontLoading = () => {
  const fontFaces = [
    {
      family: 'Inter',
      src: '/fonts/inter-var.woff2',
      weight: '100 900',
      display: 'swap'
    }
  ];

  fontFaces.forEach(font => {
    const fontFace = new FontFace(font.family, `url(${font.src})`, {
      weight: font.weight,
      display: font.display
    });

    fontFace.load().then(() => {
      document.fonts.add(fontFace);
    }).catch(error => {
      console.warn('Font loading failed:', error);
    });
  });
};

// Enhanced error tracking for SEO issues
export const trackSEOErrors = (error, context = {}) => {
  console.error('SEO Error:', error, context);
  
  if (window.gtag) {
    window.gtag('event', 'seo_error', {
      event_category: 'SEO',
      event_label: error.message || 'Unknown Error',
      value: 1,
      custom_parameter_1: context.component || 'Unknown',
      custom_parameter_2: context.action || 'Unknown'
    });
  }
};

// Initialize all performance optimizations
export const initializePerformanceOptimizations = () => {
  // Track Core Web Vitals
  trackCoreWebVitals();
  
  // Register Service Worker
  registerServiceWorker();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Check performance budget after page load
  window.addEventListener('load', () => {
    setTimeout(checkPerformanceBudget, 1000);
  });
  
  // Report any critical errors
  window.addEventListener('error', (event) => {
    trackSEOErrors(event.error, { context: 'global_error' });
  });
  
  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackSEOErrors(new Error(event.reason), { context: 'promise_rejection' });
  });
};

// Export all utilities
export default {
  trackCoreWebVitals,
  preloadCriticalResources,
  createIntersectionObserver,
  optimizeImage,
  registerServiceWorker,
  checkPerformanceBudget,
  generateMetaTags,
  generateOrganizationSchema,
  generateWebApplicationSchema,
  injectCriticalCSS,
  optimizeFontLoading,
  trackSEOErrors,
  initializePerformanceOptimizations
};