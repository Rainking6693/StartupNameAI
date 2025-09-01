import '../styles/globals.css';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Global error boundary for unhandled errors
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <Head>
        <title>Application Error - StartupNamer.org</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        <div className="space-y-4">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
          >
            Try Again
          </button>
          <a
            href="/"
            className="block w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
};

function MyApp({ Component, pageProps, router }) {
  // Track page views for analytics
  React.useEffect(() => {
    const handleRouteChange = (url) => {
      // Send pageview to Google Analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Global Error:', error, errorInfo);
        // Send error to monitoring service
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: error.toString(),
            fatal: false,
          });
        }
      }}
    >
      <Head>
        {/* Global meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        
        {/* Global SEO */}
        <meta name="application-name" content="StartupNamer.org" />
        <meta name="apple-mobile-web-app-title" content="StartupNamer" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: true,
                    anonymize_ip: true,
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* Global structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "StartupNamer.org",
              "url": "https://startupnamer.org",
              "logo": "https://startupnamer.org/logo.png",
              "description": "The AI-powered startup naming authority. Generate unique, brandable business names with domain availability checking.",
              "foundingDate": "2024",
              "sameAs": [
                "https://twitter.com/StartupNamerAI",
                "https://linkedin.com/company/startupnamer"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "hello@startupnamer.org"
              }
            })
          }}
        />
      </Head>
      
      <Component {...pageProps} />
      
      {/* Analytics components */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </ErrorBoundary>
  );
}

export default MyApp;