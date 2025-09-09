import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import analyticsService from './services/analytics';
import './App.css';

// Lazy load components for better performance
import LandingPage from './pages/LandingPage';
import NamingTool from './components/NamingTool';
import PricingPage from './pages/PricingPage';
import ResultsPage from './components/ResultsPage';
import StartupNamingGuide from './pages/StartupNamingGuide';
import TechStartupNames from './pages/TechStartupNames';
import SEOHelmet from './components/SEOHelmet';

// Enhanced loading component with SEO optimization
const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
    <Helmet>
      <title>Loading - StartupNamer.org</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg font-medium">{message}</p>
      <p className="text-white/60 text-sm mt-2">StartupNamer.org - The Startup Naming Authority</p>
    </div>
  </div>
);

// Analytics tracking component
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route changes
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    
    analyticsService.trackPageView(pagePath, pageTitle);
    
    // Track user journey
    analyticsService.trackUserJourney('page_view', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }, [location]);

  return null;
};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // Track error in analytics
  useEffect(() => {
    analyticsService.trackError(
      error.message,
      error.stack,
      'react_error_boundary'
    );
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              analyticsService.trackEvent('error_recovery_attempt', {
                event_category: 'error',
                event_label: 'try_again_clicked'
              });
              resetErrorBoundary();
            }}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              analyticsService.trackEvent('error_recovery_attempt', {
                event_category: 'error',
                event_label: 'go_home_clicked'
              });
              window.location.href = '/';
            }}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Go Home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">Error Details (Dev Mode)</summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

// Payment page component
const PaymentPage = () => (
  <>
    <Helmet>
      <title>Secure Payment - StartupNamer.org</title>
      <meta name="description" content="Complete your StartupNamer.org purchase with secure payment processing." />
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">Secure Payment</h1>
        <p className="text-slate-600 mb-6 text-center">Payment integration is being finalized. You'll be able to complete your purchase soon!</p>
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-emerald-800 text-sm font-medium">Secure SSL Encryption</span>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-blue-800 text-sm font-medium">PCI DSS Compliant</span>
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
          >
            Return to Previous Page
          </button>
        </div>
      </div>
    </div>
  </>
);

// Enhanced 404 page with SEO optimization
const NotFoundPage = () => (
  <>
    <Helmet>
      <title>Page Not Found - StartupNamer.org</title>
      <meta name="description" content="The page you're looking for doesn't exist. Return to StartupNamer.org to generate perfect startup names with AI." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://startupnamer.org/" />
    </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 text-center border border-white/20">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-white">404</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-white/80 mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off. Let's get you back to generating amazing startup names.
        </p>
        <div className="space-y-4">
          <a
            href="/"
            className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            🚀 Generate Startup Names
          </a>
          <a
            href="/naming-tool"
            className="block w-full bg-white/10 border border-white/30 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            Go to Naming Tool
          </a>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-white/60 text-sm mb-3">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="/pricing" className="text-white/80 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-full transition-colors">
              Pricing
            </a>
            <a href="/privacy-policy" className="text-white/80 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-full transition-colors">
              Privacy
            </a>
            <a href="/terms-of-service" className="text-white/80 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-full transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  </>
);

// Coming Soon component for future pages
const ComingSoonPage = ({ pageName = "This Feature" }) => (
  <>
    <Helmet>
      <title>{`${pageName} - Coming Soon | StartupNamer.org`}</title>
      <meta name="description" content={`${pageName} is coming soon to StartupNamer.org. Stay tuned for more amazing features!`} />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{pageName} Coming Soon!</h1>
        <p className="text-slate-600 mb-8">
          We're working hard to bring you this feature. In the meantime, try our AI-powered startup name generator!
        </p>
        <div className="space-y-4">
          <a
            href="/naming-tool"
            className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Try Name Generator
          </a>
          <a
            href="/"
            className="block w-full bg-slate-100 text-slate-700 font-medium py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  </>
);

// Enhanced App component with comprehensive routing and SEO
function App() {
  // Initialize analytics on app start
  useEffect(() => {
    analyticsService.initialize();
    analyticsService.trackEvent('app_initialized', {
      event_category: 'system',
      event_label: 'app_start'
    });
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <AnalyticsTracker />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="app-container">
            <Header />
            <main className="app-main" id="main-content">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/naming-tool" element={<NamingTool />} />
                  <Route path="/results/:sessionId" element={<ResultsPage />} />
                  <Route path="/features" element={<LandingPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/examples" element={<LandingPage />} />
                  <Route path="/how-it-works" element={<LandingPage />} />
                  <Route path="/faq" element={<LandingPage />} />
                  <Route path="/contact" element={<LandingPage />} />
                  <Route path="/startup-naming-guide" element={<StartupNamingGuide />} />
                  <Route path="/tech-startup-names" element={<TechStartupNames />} />
                  <Route path="/blog" element={<LandingPage />} />
                  <Route path="/ultimate-startup-naming-guide" element={<UltimateStartupNamingGuide />} />
                  <Route path="/successful-tech-startup-names" element={<SuccessfulTechStartupNames />} />
                  <Route path="/ai-vs-human-naming" element={<AiVsHumanNaming />} />
                  <Route path="/privacy-policy" element={<LandingPage />} />
                  <Route path="/terms-of-service" element={<LandingPage />} />
                  {/* Industry-specific pages */}
                  <Route path="/tech-startup-names" element={<TechStartupNames />} />
                  <Route path="/saas-startup-names" element={<SaasStartupNames />} />
                  <Route path="/fintech-startup-names" element={<FintechStartupNames />} />
                  <Route path="/healthcare-startup-names" element={<HealthcareStartupNames />} />
                  <Route path="/ai-startup-names" element={<AiStartupNames />} />
                  <Route path="/ecommerce-startup-names" element={<LandingPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
              }}
            />
          </div>
        </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}

export default App;