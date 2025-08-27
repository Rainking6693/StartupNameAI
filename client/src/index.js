import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializePerformanceOptimizations } from './utils/seo';

// Initialize performance optimizations
initializePerformanceOptimizations();

// Core Web Vitals and performance monitoring
if (typeof window !== 'undefined') {
  // Report web vitals to analytics
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    function sendToGTM(metric) {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_parameter_1: metric.id,
          custom_parameter_2: metric.rating,
          non_interaction: true
        });
      }
    }

    getCLS(sendToGTM);
    getFID(sendToGTM);
    getFCP(sendToGTM);
    getLCP(sendToGTM);
    getTTFB(sendToGTM);
  }).catch(() => {
    // Web vitals not available, continue without them
    console.log('Web Vitals library not available');
  });

  // Performance observer for additional metrics
  if ('PerformanceObserver' in window) {
    try {
      // Monitor long tasks that might impact user experience
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (window.gtag && entry.duration > 50) {
            window.gtag('event', 'long_task', {
              event_category: 'Performance',
              event_label: 'Long Task',
              value: Math.round(entry.duration),
              custom_parameter_1: entry.name,
              non_interaction: true
            });
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        if (window.gtag && clsValue > 0.1) {
          window.gtag('event', 'layout_shift', {
            event_category: 'Performance',
            event_label: 'Cumulative Layout Shift',
            value: Math.round(clsValue * 1000),
            non_interaction: true
          });
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);