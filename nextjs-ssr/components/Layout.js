import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { generateBreadcrumbs, generateHreflangTags, generateOpenGraphTags, generateTwitterTags } from '../lib/seo-utils';
import { organizationSchema } from '../lib/structured-data';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <Head>
        <title>Error - StartupNamer.org</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error while loading the page. Our team has been notified.
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

export default function Layout({ 
  children, 
  title = "StartupNamer.org - AI-Powered Startup Name Generator",
  description = "Generate perfect startup names with our AI-powered naming tool. Get unique, brandable business names with domain availability checking.",
  canonical,
  ogImage,
  jsonLd,
  noindex = false,
  keywords,
  author = "StartupNamer.org Team",
  publishedTime,
  modifiedTime,
  breadcrumbs,
  path = "/",
  contentType = "website",
  industry,
  hreflangAlternates = true,
  additionalSchema = []
}) {
  const defaultOgImage = "https://startupnamer.org/images/og-image.jpg";
  const siteUrl = "https://startupnamer.org";
  
  // Generate additional SEO data
  const defaultKeywords = "startup names, business names, AI name generator, brand names, company names, domain names, brandable names";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  
  // Generate breadcrumbs if not provided
  const schemaBreadcrumbs = breadcrumbs || generateBreadcrumbs(path, title);
  
  // Generate social media tags
  const ogTags = generateOpenGraphTags({
    title,
    description,
    path,
    image: ogImage,
    type: contentType,
    publishedTime,
    modifiedTime,
    author
  });
  
  const twitterTags = generateTwitterTags({
    title,
    description,
    path,
    image: ogImage
  });
  
  // Generate hreflang tags for international SEO
  const hreflangTags = hreflangAlternates ? generateHreflangTags(path) : [];
  
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Layout Error:', error, errorInfo);
        // Send to monitoring service if available
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'layout_error', {
            event_category: 'Error',
            event_label: error.message,
            value: 1,
            non_interaction: true
          });
        }
      }}
    >
      <Head>
        {/* Essential Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={finalKeywords} />
        <meta name="author" content={author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="language" content="EN" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="web" />
        <meta name="rating" content="general" />
        {publishedTime && <meta name="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta name="article:modified_time" content={modifiedTime} />}
        
        {/* SEO Tags */}
        {canonical && <link rel="canonical" href={canonical} />}
        <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
        
        {/* Open Graph / Facebook */}
        {Object.entries(ogTags).map(([property, content]) => (
          <meta key={property} property={property} content={content} />
        ))}
        
        {/* Twitter */}
        {Object.entries(twitterTags).map(([name, content]) => (
          <meta key={name} name={name} content={content} />
        ))}
        
        {/* Hreflang for international SEO */}
        {hreflangTags.map(tag => (
          <link key={tag.hreflang} rel="alternate" hrefLang={tag.hreflang} href={tag.href} />
        ))}
        
        {/* Additional Social Media */}
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta name="pinterest-rich-pin" content="true" />
        
        {/* Favicons and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        
        {/* Mobile and PWA Meta Tags */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="application-name" content="StartupNamer.org" />
        <meta name="apple-mobile-web-app-title" content="StartupNamer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Performance and Preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://www.namecheap.com" />
        
        {/* Breadcrumb Structured Data */}
        {schemaBreadcrumbs && schemaBreadcrumbs.length > 1 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": schemaBreadcrumbs.map((crumb, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": crumb.name,
                  "item": `${siteUrl}${crumb.path}`
                }))
              })
            }}
          />
        )}
        
        {/* Main JSON-LD Structured Data */}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        
        {/* Additional Schema Markup */}
        {additionalSchema.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        
        {/* Organization Structured Data - Enhanced */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        
        <main className="flex-grow" role="main">
          {children}
        </main>
        
        <Footer />
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}