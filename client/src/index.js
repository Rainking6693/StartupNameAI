import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { initializePerformanceOptimizations } from './utils/seo';
import { initWebVitals } from './utils/webVitals';

// Initialize performance optimizations (skip during pre-rendering)
if (typeof window !== 'undefined' && !window.__REACT_SNAP__) {
  initializePerformanceOptimizations();
  
  // Initialize enhanced Web Vitals collection
  initWebVitals({
    enableBatching: true,
    apiUrl: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/vitals` : '/api/vitals'
  });
}

// Core Web Vitals and performance monitoring
if (typeof window !== 'undefined' && !window.__REACT_SNAP__) {
  // Enhanced web vitals reporting with INP and additional metrics  
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    function sendToGTM(metric) {
      if (window.gtag) {
        // Send to Google Analytics
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_parameter_1: metric.id,
          custom_parameter_2: metric.rating,
          custom_parameter_3: metric.navigationType || 'unknown',
          non_interaction: true
        });

        // Send specific metric events for better analysis
        window.gtag('event', `metric_${metric.name.toLowerCase()}`, {
          event_category: 'Core Web Vitals',
          event_label: `${metric.name} - ${metric.rating}`,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_parameter_1: metric.id,
          custom_parameter_2: window.location.pathname,
          non_interaction: true
        });
      }

      // Send to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
          navigationType: metric.navigationType
        });
      }
    }

    // Core Web Vitals
    onCLS(sendToGTM);
    onFCP(sendToGTM);
    onLCP(sendToGTM);
    onTTFB(sendToGTM);

    // INP metric (replacing FID)
    if (onINP) {
      onINP(sendToGTM);
    }
  }).catch(() => {
    // Web vitals not available, continue without them
    console.log('Web Vitals library not available');
  });

  // Enhanced performance monitoring with additional metrics
  if ('PerformanceObserver' in window) {
    try {
      // Monitor long tasks that might impact user experience and INP
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            if (window.gtag) {
              window.gtag('event', 'long_task', {
                event_category: 'Performance',
                event_label: 'Long Task',
                value: Math.round(entry.duration),
                custom_parameter_1: entry.name,
                custom_parameter_2: window.location.pathname,
                non_interaction: true
              });
            }
            
            // Log severe long tasks
            if (entry.duration > 200) {
              console.warn(`[Performance] Severe long task detected: ${entry.duration}ms`);
            }
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Monitor layout shifts with more detailed tracking
      const layoutShiftObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        let shiftCount = 0;
        
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            shiftCount++;
          }
        });
        
        if (clsValue > 0.1) {
          if (window.gtag) {
            window.gtag('event', 'layout_shift', {
              event_category: 'Performance',
              event_label: 'Cumulative Layout Shift',
              value: Math.round(clsValue * 1000),
              custom_parameter_1: shiftCount.toString(),
              custom_parameter_2: window.location.pathname,
              non_interaction: true
            });
          }
          
          console.warn(`[Performance] High CLS detected: ${clsValue.toFixed(3)} (${shiftCount} shifts)`);
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor First Input Delay and general input responsiveness
      const eventObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.processingStart && entry.startTime) {
            const inputDelay = entry.processingStart - entry.startTime;
            
            if (inputDelay > 100 && window.gtag) {
              window.gtag('event', 'input_delay', {
                event_category: 'Performance',
                event_label: 'High Input Delay',
                value: Math.round(inputDelay),
                custom_parameter_1: entry.name || 'unknown',
                custom_parameter_2: window.location.pathname,
                non_interaction: true
              });
            }
          }
        });
      });

      // Monitor different types of performance events
      try {
        eventObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // first-input might not be supported
      }

      // Monitor resource loading performance
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 3000) { // Resources taking more than 3 seconds
            if (window.gtag) {
              window.gtag('event', 'slow_resource', {
                event_category: 'Performance',
                event_label: 'Slow Resource Load',
                value: Math.round(entry.duration),
                custom_parameter_1: entry.name.split('/').pop() || 'unknown',
                custom_parameter_2: entry.initiatorType || 'unknown',
                non_interaction: true
              });
            }
            
            console.warn(`[Performance] Slow resource load: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        // Resource timing might not be supported
      }

    } catch (error) {
      console.log('Performance Observer not fully supported');
    }
  }

  // Report JavaScript errors that might impact SEO
  window.addEventListener('error', (event) => {
    if (window.gtag) {
      window.gtag('event', 'js_error', {
        event_category: 'Error',
        event_label: event.error?.message || 'Unknown Error',
        value: 1,
        custom_parameter_1: event.filename,
        custom_parameter_2: event.lineno,
        non_interaction: true
      });
    }
  });

  // Report unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (window.gtag) {
      window.gtag('event', 'promise_rejection', {
        event_category: 'Error',
        event_label: event.reason?.message || 'Unhandled Promise Rejection',
        value: 1,
        non_interaction: true
      });
    }
  });
}

// Enhanced hydration support for react-snap prerendering
const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Check if the page was pre-rendered by react-snap
if (typeof window !== 'undefined') {
  if (container.hasChildNodes() && !window.__REACT_SNAP__) {
    // Hydrate the pre-rendered content
    hydrateRoot(container, app);
  } else if (!window.__REACT_SNAP__) {
    // Render normally for client-side navigation
    const root = createRoot(container);
    root.render(app);
  } else {
    // During pre-rendering with react-snap
    const root = createRoot(container);
    root.render(app);
  }
} else {
  // Server-side rendering fallback
  const root = createRoot(container);
  root.render(app);
}