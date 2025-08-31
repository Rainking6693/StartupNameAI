import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  noFollow = false,
  children
}) => {
  const siteUrl = 'https://startupnamer.org';
  const defaultTitle = 'StartupNamer.org - AI-Powered Startup Name Generator';
  const defaultDescription = 'Generate perfect startup names with AI. Get brandable, memorable names for your business in seconds. Free startup name generator with domain availability checks.';
  const defaultKeywords = 'startup names, business names, company names, AI name generator, startup name generator, brand names, business naming tool';
  const defaultImage = `${siteUrl}/og-image.jpg`;

  // Construct full title
  const fullTitle = title ? `${title} | StartupNamer.org` : defaultTitle;
  
  // Use provided or default values
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const canonical = canonicalUrl || `${siteUrl}${window.location.pathname}`;
  const image = ogImage || defaultImage;

  // Robots directive
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="StartupNamer.org" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@startupnamer" />
      <meta name="twitter:creator" content="@startupnamer" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="StartupNamer.org" />
      <meta name="publisher" content="StartupNamer.org" />
      <meta name="copyright" content="StartupNamer.org" />
      <meta name="language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.country" content="United States" />
      
      {/* Theme and Mobile Optimization */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-navbutton-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://api.startupnamer.org" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Additional custom meta tags */}
      {children}
    </Helmet>
  );
};

// Predefined SEO configurations for different page types
export const HomePageSEO = () => (
  <SEOHead
    title="AI-Powered Startup Name Generator - Free & Instant"
    description="Generate perfect startup names with AI. Get brandable, memorable names for your business in seconds. Free startup name generator with domain availability checks and branding insights."
    keywords="startup names, business names, AI name generator, startup name generator, brand names, business naming tool, company names, free name generator"
    ogType="website"
  />
);

export const NamingToolSEO = () => (
  <SEOHead
    title="Startup Name Generator Tool - Create Unique Business Names"
    description="Use our AI-powered naming tool to create unique, brandable startup names. Generate hundreds of creative business names instantly with domain availability checks."
    keywords="naming tool, startup name generator, business name creator, AI naming, brand name generator, company name ideas"
  />
);

export const FeaturesPageSEO = () => (
  <SEOHead
    title="Features - Advanced AI Name Generation Technology"
    description="Discover the powerful features of StartupNamer.org. AI-powered name generation, domain availability, trademark checking, and brand analysis tools."
    keywords="name generator features, AI naming technology, domain checker, trademark search, brand analysis"
  />
);

export const PricingPageSEO = () => (
  <SEOHead
    title="Pricing - Affordable Startup Naming Solutions"
    description="Choose the perfect plan for your startup naming needs. Free basic name generation or premium features with advanced AI analysis and branding insights."
    keywords="startup naming pricing, business name generator cost, naming tool plans, affordable branding"
  />
);

export const ExamplesPageSEO = () => (
  <SEOHead
    title="Startup Name Examples - Successful Brand Names by Industry"
    description="Explore successful startup name examples across different industries. Learn what makes a great business name and get inspiration for your venture."
    keywords="startup name examples, business name ideas, successful brand names, naming inspiration, company name samples"
  />
);

export const HowItWorksPageSEO = () => (
  <SEOHead
    title="How It Works - AI Startup Name Generation Process"
    description="Learn how our AI-powered startup name generator creates perfect business names. From concept to brandable name in seconds with advanced algorithms."
    keywords="AI name generation process, how startup naming works, business name creation, AI naming algorithm"
  />
);

export const BlogPageSEO = () => (
  <SEOHead
    title="Startup Naming Blog - Business Branding Tips & Insights"
    description="Expert insights on startup naming, business branding, and entrepreneurship. Learn naming strategies that help successful companies stand out."
    keywords="startup naming blog, business branding tips, naming strategies, entrepreneurship insights"
  />
);

export const FAQPageSEO = () => (
  <SEOHead
    title="FAQ - Startup Name Generator Questions & Answers"
    description="Find answers to common questions about our AI startup name generator. Learn about features, pricing, domain checking, and more."
    keywords="startup name generator FAQ, naming tool questions, business name help, AI naming support"
  />
);

export const ContactPageSEO = () => (
  <SEOHead
    title="Contact Us - StartupNamer.org Support & Feedback"
    description="Get in touch with the StartupNamer.org team. We're here to help with your startup naming needs and answer any questions."
    keywords="contact startup naming, business naming support, StartupNamer help, naming consultation"
  />
);

// Industry-specific SEO components
export const TechStartupNamesSEO = () => (
  <SEOHead
    title="Tech Startup Names - AI-Generated Technology Company Names"
    description="Generate perfect names for your tech startup. AI-powered naming for software, SaaS, and technology companies with brandable, memorable options."
    keywords="tech startup names, technology company names, software startup names, tech business names, SaaS company names"
  />
);

export const SaaSStartupNamesSEO = () => (
  <SEOHead
    title="SaaS Startup Names - Software Company Name Generator"
    description="Create compelling names for your SaaS startup. Generate brandable software company names that resonate with B2B audiences and investors."
    keywords="SaaS startup names, software company names, B2B business names, cloud software names, SaaS branding"
  />
);

export const FintechStartupNamesSEO = () => (
  <SEOHead
    title="Fintech Startup Names - Financial Technology Company Names"
    description="Generate trustworthy names for your fintech startup. AI-powered naming for financial services, payment platforms, and banking technology companies."
    keywords="fintech startup names, financial technology names, fintech company names, banking startup names, payment company names"
  />
);

export const HealthcareStartupNamesSEO = () => (
  <SEOHead
    title="Healthcare Startup Names - Medical Technology Company Names"
    description="Create professional names for your healthcare startup. Generate medical technology company names that inspire trust and convey innovation."
    keywords="healthcare startup names, medical company names, health tech names, biotech startup names, medical device names"
  />
);

export const AIStartupNamesSEO = () => (
  <SEOHead
    title="AI Startup Names - Artificial Intelligence Company Names"
    description="Generate cutting-edge names for your AI startup. Create artificial intelligence company names that showcase innovation and technical expertise."
    keywords="AI startup names, artificial intelligence company names, machine learning startup names, AI tech names, robotics company names"
  />
);

export const EcommerceStartupNamesSEO = () => (
  <SEOHead
    title="E-commerce Startup Names - Online Business Name Generator"
    description="Create memorable names for your e-commerce startup. Generate online business names that attract customers and build brand recognition."
    keywords="ecommerce startup names, online business names, retail startup names, marketplace names, e-commerce branding"
  />
);

export const PrivacyPolicySEO = () => (
  <SEOHead
    title="Privacy Policy - Data Protection & User Privacy"
    description="Learn how StartupNamer.org protects your privacy and handles your data. Transparent privacy policy for our startup name generator service."
    keywords="privacy policy, data protection, user privacy, StartupNamer privacy"
    noIndex={true}
  />
);

export const TermsOfServiceSEO = () => (
  <SEOHead
    title="Terms of Service - StartupNamer.org Usage Terms"
    description="Terms and conditions for using StartupNamer.org startup name generator. User agreement and service terms for our AI naming platform."
    keywords="terms of service, user agreement, service terms, StartupNamer terms"
    noIndex={true}
  />
);

export default SEOHead;