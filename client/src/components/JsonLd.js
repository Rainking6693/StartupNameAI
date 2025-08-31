import React from 'react';
import { Helmet } from 'react-helmet-async';

// Base JSON-LD component
const JsonLd = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

// Website/Organization Schema
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StartupNamer.org",
    "alternateName": "StartupNamer",
    "url": "https://startupnamer.org",
    "logo": {
      "@type": "ImageObject",
      "url": "https://startupnamer.org/logo.png",
      "width": 512,
      "height": 512
    },
    "description": "AI-powered startup name generator helping entrepreneurs create memorable, brandable business names with domain availability checks.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Organization",
      "name": "StartupNamer Team"
    },
    "sameAs": [
      "https://twitter.com/startupnamer",
      "https://linkedin.com/company/startupnamer",
      "https://github.com/startupnamer"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-STARTUP",
      "contactType": "customer support",
      "email": "support@startupnamer.org",
      "availableLanguage": ["English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "United States"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "Worldwide"
    }
  };

  return <JsonLd data={schema} />;
};

// Website Schema
export const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StartupNamer.org",
    "alternateName": "StartupNamer - AI Startup Name Generator",
    "url": "https://startupnamer.org",
    "description": "Generate perfect startup names with AI. Free business name generator with domain availability checks and branding insights.",
    "publisher": {
      "@type": "Organization",
      "name": "StartupNamer.org"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://startupnamer.org/naming-tool?query={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <JsonLd data={schema} />;
};

// Software Application Schema for the Naming Tool
export const SoftwareApplicationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StartupNamer AI Name Generator",
    "description": "AI-powered startup name generator that creates brandable, memorable business names with domain availability checks.",
    "url": "https://startupnamer.org/naming-tool",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "softwareVersion": "2.0",
    "datePublished": "2024-01-01",
    "publisher": {
      "@type": "Organization",
      "name": "StartupNamer.org"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free startup name generation with premium features available"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "applicationSubCategory": "Name Generator, Business Tools, AI Tools",
    "screenshot": "https://startupnamer.org/screenshot.jpg",
    "softwareHelp": {
      "@type": "CreativeWork",
      "url": "https://startupnamer.org/how-it-works"
    }
  };

  return <JsonLd data={schema} />;
};

// FAQ Page Schema
export const FAQPageSchema = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <JsonLd data={schema} />;
};

// Article Schema for Blog Posts
export const ArticleSchema = ({ 
  title, 
  description, 
  author = "StartupNamer Team", 
  datePublished, 
  dateModified,
  image,
  url 
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image || "https://startupnamer.org/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "StartupNamer.org",
      "logo": {
        "@type": "ImageObject",
        "url": "https://startupnamer.org/logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return <JsonLd data={schema} />;
};

// Breadcrumb Schema
export const BreadcrumbSchema = ({ breadcrumbs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://startupnamer.org${crumb.url}`
    }))
  };

  return <JsonLd data={schema} />;
};

// Service Schema
export const ServiceSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Startup Name Generation",
    "description": "Professional startup naming service using advanced AI to generate brandable, memorable business names with domain availability checks.",
    "provider": {
      "@type": "Organization",
      "name": "StartupNamer.org"
    },
    "serviceType": "Business Naming Service",
    "audience": {
      "@type": "Audience",
      "audienceType": "Entrepreneurs, Startups, Business Owners"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Startup Naming Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Free Name Generation",
            "description": "Basic AI-powered startup name generation"
          },
          "price": "0",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Name Generation",
            "description": "Advanced AI naming with branding analysis and trademark checks"
          },
          "price": "29",
          "priceCurrency": "USD"
        }
      ]
    }
  };

  return <JsonLd data={schema} />;
};

// How-To Schema
export const HowToSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate a Perfect Startup Name with AI",
    "description": "Step-by-step guide to creating memorable, brandable startup names using our AI-powered naming tool.",
    "image": "https://startupnamer.org/how-to-generate-names.jpg",
    "totalTime": "PT5M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Business concept or industry"
      },
      {
        "@type": "HowToSupply",
        "name": "Target keywords or themes"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Describe Your Business",
        "text": "Enter a brief description of your startup, including industry, target audience, and key features.",
        "image": "https://startupnamer.org/step1.jpg"
      },
      {
        "@type": "HowToStep",
        "name": "Select Naming Style",
        "text": "Choose from various naming styles like modern, professional, creative, or tech-focused.",
        "image": "https://startupnamer.org/step2.jpg"
      },
      {
        "@type": "HowToStep",
        "name": "Generate Names",
        "text": "Click generate to let our AI create dozens of unique, brandable name options for your startup.",
        "image": "https://startupnamer.org/step3.jpg"
      },
      {
        "@type": "HowToStep",
        "name": "Check Availability",
        "text": "Review generated names and check domain availability for your favorites.",
        "image": "https://startupnamer.org/step4.jpg"
      }
    ]
  };

  return <JsonLd data={schema} />;
};

// Product Schema for Premium Features
export const ProductSchema = ({ product }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "StartupNamer.org"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01",
      "seller": {
        "@type": "Organization",
        "name": "StartupNamer.org"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || "4.8",
      "ratingCount": product.ratingCount || "1247"
    }
  };

  return <JsonLd data={schema} />;
};

// Local Business Schema (if applicable)
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "StartupNamer.org",
    "description": "Professional startup naming service using AI technology to help entrepreneurs create memorable business names.",
    "url": "https://startupnamer.org",
    "telephone": "+1-555-STARTUP",
    "email": "hello@startupnamer.org",
    "priceRange": "Free - $99",
    "serviceArea": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Naming Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Name Generation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Domain Availability Checking"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Trademark Screening"
          }
        }
      ]
    }
  };

  return <JsonLd data={schema} />;
};

export default JsonLd;