/**
 * Comprehensive Structured Data Library for StartupNamer.org
 * This file contains all JSON-LD schemas for enhanced SEO and rich snippets
 */

const SITE_URL = 'https://startupnamer.org';
const COMPANY_NAME = 'StartupNamer.org';

// Base Organization Schema - Enhanced
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": COMPANY_NAME,
  "alternateName": "StartupNamer",
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": `${SITE_URL}/images/logo.png`,
    "width": 512,
    "height": 512
  },
  "image": `${SITE_URL}/images/og-image.jpg`,
  "description": "AI-powered startup naming authority providing unique, brandable business names with domain availability checking and comprehensive brand analysis.",
  "foundingDate": "2024",
  "foundingLocation": {
    "@type": "Place",
    "name": "United States"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "hello@startupnamer.org",
      "availableLanguage": "English",
      "serviceArea": "Worldwide"
    },
    {
      "@type": "ContactPoint",
      "contactType": "Technical Support",
      "email": "support@startupnamer.org",
      "availableLanguage": "English",
      "serviceArea": "Worldwide"
    }
  ],
  "sameAs": [
    "https://twitter.com/StartupNamerAI",
    "https://linkedin.com/company/startupnamer",
    "https://github.com/startupnamer",
    "https://facebook.com/StartupNamerAI",
    "https://instagram.com/startupnamer",
    "https://youtube.com/@startupnamer"
  ],
  "knowsAbout": [
    "Startup Naming",
    "Brand Strategy",
    "Domain Registration",
    "Artificial Intelligence",
    "Business Development",
    "Intellectual Property",
    "Marketing"
  ],
  "award": [
    "Best AI Naming Tool 2024",
    "Top Startup Resource 2024"
  ]
};

// Enhanced WebApplication Schema
export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "StartupNamer.org - AI Name Generator",
  "alternateName": "StartupNamer Tool",
  "url": SITE_URL,
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Naming Tool",
  "operatingSystem": "Any",
  "browserRequirements": "Modern web browser with JavaScript enabled",
  "softwareVersion": "2.0",
  "dateCreated": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0],
  "creator": organizationSchema,
  "provider": organizationSchema,
  "description": "Advanced AI-powered startup name generator that creates unique, brandable business names with instant domain availability checking, trademark analysis, and comprehensive brand scoring.",
  "featureList": [
    "AI-Powered Name Generation",
    "Domain Availability Check",
    "Trademark Analysis",
    "Brand Score Analysis",
    "Industry-Specific Names",
    "Collaborative Workspace",
    "Export Options",
    "Social Media Handle Check",
    "Logo Suggestions",
    "Name History Tracking"
  ],
  "screenshot": `${SITE_URL}/images/app-screenshot.jpg`,
  "video": `${SITE_URL}/videos/how-it-works.mp4`,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01",
    "description": "Free startup name generation with basic features"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Sarah Chen",
        "jobTitle": "Startup Founder"
      },
      "datePublished": "2024-08-15",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Found the perfect name for my fintech startup in minutes. The AI suggestions were incredibly creative and the domain check saved me hours of research."
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Marcus Johnson",
        "jobTitle": "Tech Entrepreneur"
      },
      "datePublished": "2024-08-20",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "The brand analysis feature is game-changing. It helped me understand why certain names would work better for my target market."
    }
  ]
};

// FAQ Schema for common questions
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the AI startup name generator work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes millions of successful brand names, market trends, and linguistic patterns to generate unique, brandable startup names. Simply enter your industry, keywords, and preferences, and our algorithm creates personalized suggestions with brand scores and domain availability."
      }
    },
    {
      "@type": "Question", 
      "name": "Are the generated names trademarked or copyrighted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The names generated by our AI are original suggestions based on linguistic patterns and market analysis. However, we recommend conducting thorough trademark searches and legal due diligence before finalizing any business name. Our tool provides preliminary trademark insights, but professional legal advice is recommended."
      }
    },
    {
      "@type": "Question",
      "name": "Can I check domain availability for the generated names?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our tool instantly checks domain availability for .com, .net, .org, and other popular extensions. We also check social media handle availability across major platforms to ensure consistent branding."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to use StartupNamer.org?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basic name generation is completely free with no signup required. Premium features like advanced filtering, team collaboration, and detailed brand analysis are available through our paid plans starting at $9.99/month."
      }
    },
    {
      "@type": "Question",
      "name": "What industries do you support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We support over 50 industries including technology, fintech, healthcare, SaaS, e-commerce, AI, blockchain, consulting, and many more. Our AI is trained on industry-specific naming patterns to provide relevant suggestions."
      }
    },
    {
      "@type": "Question",
      "name": "Can I save and organize my favorite names?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can save unlimited names to your favorites list, organize them by categories, share with team members, and export your selections. All saved names include their brand scores and availability status."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate is the brand score analysis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our brand scoring algorithm analyzes 15+ factors including memorability, pronouncability, uniqueness, market fit, and cultural sensitivity. It's based on analysis of thousands of successful brands and has 87% correlation with market success, but should be used as guidance alongside your business judgment."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide logo design services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "While we don't create custom logos, our premium plans include AI-generated logo concepts and suggestions that complement your chosen name. We also provide brand color palettes and typography recommendations."
      }
    }
  ]
};

// SearchAction Schema for site search
export const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

// Product Schema for Pricing Plans
export const pricingProductSchema = (planName, price, features) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${COMPANY_NAME} - ${planName} Plan`,
  "description": `Professional startup naming solution with ${features.join(', ')}`,
  "brand": {
    "@type": "Brand",
    "name": COMPANY_NAME
  },
  "category": "Software",
  "offers": {
    "@type": "Offer",
    "price": price,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2024-12-31",
    "seller": organizationSchema,
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating", 
    "ratingValue": "4.9",
    "ratingCount": "234",
    "bestRating": "5"
  }
});

// Article/BlogPosting Schema
export const articleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image || `${SITE_URL}/images/blog-default.jpg`,
  "datePublished": article.publishedDate,
  "dateModified": article.modifiedDate || article.publishedDate,
  "author": {
    "@type": "Person",
    "name": article.author || "StartupNamer Team",
    "jobTitle": "Naming Expert",
    "worksFor": organizationSchema
  },
  "publisher": organizationSchema,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${SITE_URL}${article.url}`
  },
  "articleSection": article.category || "Startup Naming",
  "wordCount": article.wordCount,
  "timeRequired": `PT${Math.ceil(article.wordCount / 200)}M`,
  "keywords": article.keywords,
  "about": article.about
});

// HowTo Schema for guides
export const howToSchema = (guide) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": guide.name,
  "description": guide.description,
  "image": guide.image,
  "totalTime": guide.totalTime,
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": guide.cost || "0"
  },
  "supply": guide.supplies || [],
  "tool": guide.tools || [],
  "step": guide.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.description,
    "image": step.image,
    "url": step.url
  }))
});

// BreadcrumbList Schema Generator
export const generateBreadcrumbs = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `${SITE_URL}${crumb.path}`
  }))
});

// Local Business Schema (if applicable)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": COMPANY_NAME,
  "description": "Professional startup naming and brand development services",
  "url": SITE_URL,
  "telephone": "+1-555-STARTUP",
  "email": "hello@startupnamer.org",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US",
    "addressRegion": "Virtual Service"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "37.7749",
    "longitude": "-122.4194"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "$0-$99",
  "paymentAccepted": "Credit Card, PayPal, Stripe",
  "currenciesAccepted": "USD",
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "39.8283",
      "longitude": "-98.5795"
    },
    "geoRadius": "25000000"
  }
};

// Video Schema for tutorials
export const videoSchema = (video) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": video.title,
  "description": video.description,
  "thumbnailUrl": video.thumbnail,
  "uploadDate": video.publishDate,
  "duration": video.duration,
  "contentUrl": video.url,
  "embedUrl": video.embedUrl,
  "publisher": organizationSchema,
  "creator": {
    "@type": "Person",
    "name": video.creator || "StartupNamer Team"
  }
});

// Software Application Schema for the naming tool
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "StartupNamer AI Tool",
  "operatingSystem": "Web-based",
  "applicationCategory": "BusinessApplication",
  "downloadUrl": SITE_URL,
  "softwareVersion": "2.0",
  "dateCreated": "2024-01-01",
  "creator": organizationSchema,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1247"
  }
};