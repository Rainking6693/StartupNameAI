/**
 * SEO Utilities Library for StartupNamer.org
 * Comprehensive SEO optimization functions and helpers
 */

const SITE_URL = 'https://startupnamer.org';
const SITE_NAME = 'StartupNamer.org';

// Title optimization with proper length limits
export const optimizeTitle = (title, maxLength = 60) => {
  if (!title) return SITE_NAME;
  
  // Remove extra whitespace
  const cleanTitle = title.trim().replace(/\s+/g, ' ');
  
  // If title is too long, truncate intelligently
  if (cleanTitle.length <= maxLength) {
    return cleanTitle;
  }
  
  // Try to truncate at word boundary
  const truncated = cleanTitle.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

// Meta description optimization
export const optimizeDescription = (description, maxLength = 155) => {
  if (!description) return '';
  
  const cleanDesc = description.trim().replace(/\s+/g, ' ');
  
  if (cleanDesc.length <= maxLength) {
    return cleanDesc;
  }
  
  const truncated = cleanDesc.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  const lastSentence = truncated.lastIndexOf('.');
  
  // Prefer ending at sentence boundary
  if (lastSentence > maxLength * 0.8) {
    return cleanDesc.substring(0, lastSentence + 1);
  }
  
  // Otherwise truncate at word boundary
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

// Generate canonical URL
export const generateCanonicalUrl = (path) => {
  if (!path) return SITE_URL;
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove trailing slash and normalize
  const normalizedPath = cleanPath.replace(/\/$/, '');
  
  return normalizedPath ? `${SITE_URL}/${normalizedPath}` : SITE_URL;
};

// Industry-specific SEO data
export const industryData = {
  tech: {
    keywords: ['tech startup names', 'technology company names', 'software startup naming', 'tech brand names'],
    description: 'Generate innovative tech startup names with our AI-powered naming tool. Perfect for software, hardware, and technology companies.',
    title: 'Tech Startup Names - AI Name Generator for Technology Companies',
    category: 'Technology'
  },
  saas: {
    keywords: ['saas startup names', 'software as a service names', 'saas company names', 'cloud software names'],
    description: 'Create compelling SaaS startup names that convey innovation, reliability, and scalability. Perfect for cloud software companies.',
    title: 'SaaS Startup Names - AI Generator for Software Companies',
    category: 'Software'
  },
  fintech: {
    keywords: ['fintech startup names', 'financial technology names', 'finance app names', 'banking startup names'],
    description: 'Generate trustworthy fintech startup names that inspire confidence and innovation in financial technology.',
    title: 'Fintech Startup Names - AI Generator for Financial Technology',
    category: 'Financial Services'
  },
  healthcare: {
    keywords: ['healthcare startup names', 'medical startup names', 'health tech names', 'medtech company names'],
    description: 'Create professional healthcare startup names that convey trust, care, and medical expertise.',
    title: 'Healthcare Startup Names - AI Generator for Medical Companies',
    category: 'Healthcare'
  },
  ai: {
    keywords: ['ai startup names', 'artificial intelligence names', 'machine learning company names', 'ai tech names'],
    description: 'Generate cutting-edge AI startup names that reflect innovation, intelligence, and technological advancement.',
    title: 'AI Startup Names - Generator for Artificial Intelligence Companies',
    category: 'Artificial Intelligence'
  },
  ecommerce: {
    keywords: ['ecommerce startup names', 'online store names', 'retail startup names', 'marketplace names'],
    description: 'Create memorable ecommerce startup names that build trust and encourage online shopping.',
    title: 'Ecommerce Startup Names - AI Generator for Online Retailers',
    category: 'E-commerce'
  }
};

// Generate SEO-optimized meta tags for industry pages
export const generateIndustryMeta = (industry) => {
  const data = industryData[industry];
  if (!data) return {};
  
  return {
    title: optimizeTitle(data.title),
    description: optimizeDescription(data.description),
    keywords: data.keywords.join(', '),
    canonical: generateCanonicalUrl(`${industry}-startup-names`),
    category: data.category
  };
};

// Generate breadcrumb data
export const generateBreadcrumbs = (path, title) => {
  const breadcrumbs = [
    { name: 'Home', path: '/' }
  ];
  
  if (path === '/') return breadcrumbs;
  
  const pathSegments = path.split('/').filter(Boolean);
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert slug to readable name
    let name = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    // Use provided title for the last breadcrumb
    if (index === pathSegments.length - 1 && title) {
      name = title;
    }
    
    breadcrumbs.push({
      name,
      path: currentPath
    });
  });
  
  return breadcrumbs;
};

// Generate hreflang tags for international SEO
export const generateHreflangTags = (path) => {
  const languages = [
    { code: 'en', region: 'us', label: 'English (US)' },
    { code: 'en', region: 'gb', label: 'English (UK)' },
    { code: 'en', region: 'ca', label: 'English (Canada)' },
    { code: 'en', region: 'au', label: 'English (Australia)' }
  ];
  
  return languages.map(lang => ({
    hreflang: `${lang.code}-${lang.region}`,
    href: `${SITE_URL}${path}`,
    label: lang.label
  }));
};

// Generate Open Graph tags
export const generateOpenGraphTags = ({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags
}) => {
  const ogTags = {
    'og:type': type,
    'og:locale': 'en_US',
    'og:url': generateCanonicalUrl(path),
    'og:title': optimizeTitle(title),
    'og:description': optimizeDescription(description),
    'og:image': image || `${SITE_URL}/images/og-image.jpg`,
    'og:image:alt': `${title} - Screenshot`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:site_name': SITE_NAME
  };
  
  // Add article-specific tags
  if (type === 'article') {
    if (publishedTime) ogTags['article:published_time'] = publishedTime;
    if (modifiedTime) ogTags['article:modified_time'] = modifiedTime;
    if (author) ogTags['article:author'] = author;
    if (tags) {
      tags.forEach(tag => {
        ogTags[`article:tag`] = tag;
      });
    }
  }
  
  return ogTags;
};

// Generate Twitter Card tags
export const generateTwitterTags = ({
  title,
  description,
  path,
  image,
  cardType = 'summary_large_image',
  site = '@StartupNamerAI',
  creator = '@StartupNamerAI'
}) => ({
  'twitter:card': cardType,
  'twitter:site': site,
  'twitter:creator': creator,
  'twitter:url': generateCanonicalUrl(path),
  'twitter:title': optimizeTitle(title),
  'twitter:description': optimizeDescription(description),
  'twitter:image': image || `${SITE_URL}/images/twitter-card.jpg`,
  'twitter:image:alt': `${title} - Screenshot`
});

// Generate structured data for different content types
export const generateStructuredData = (type, data) => {
  const baseSchema = {
    "@context": "https://schema.org"
  };
  
  switch (type) {
    case 'webpage':
      return {
        ...baseSchema,
        "@type": "WebPage",
        "name": data.title,
        "description": data.description,
        "url": generateCanonicalUrl(data.path),
        "isPartOf": {
          "@type": "WebSite",
          "name": SITE_NAME,
          "url": SITE_URL
        },
        "dateCreated": data.publishedTime,
        "dateModified": data.modifiedTime || data.publishedTime,
        "author": {
          "@type": "Organization",
          "name": SITE_NAME
        }
      };
      
    case 'tool':
      return {
        ...baseSchema,
        "@type": "WebApplication",
        "name": data.title,
        "description": data.description,
        "url": generateCanonicalUrl(data.path),
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };
      
    case 'guide':
      return {
        ...baseSchema,
        "@type": "HowTo",
        "name": data.title,
        "description": data.description,
        "image": data.image,
        "totalTime": data.readingTime || "PT5M",
        "step": data.steps || []
      };
      
    default:
      return baseSchema;
  }
};

// SEO-friendly URL slug generator
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
};

// Calculate reading time
export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return {
    minutes,
    wordCount,
    duration: `PT${minutes}M` // ISO 8601 duration format
  };
};

// Generate keywords from content
export const extractKeywords = (content, maxKeywords = 10) => {
  // Common stop words to filter out
  const stopWords = [
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'among', 'a', 'an', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must',
    'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
    'her', 'its', 'our', 'their'
  ];
  
  // Extract words and count frequency
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

// Validate and optimize content for SEO
export const validateSEOContent = (content) => {
  const issues = [];
  const recommendations = [];
  
  // Title validation
  if (!content.title) {
    issues.push('Missing page title');
  } else if (content.title.length > 60) {
    issues.push('Title too long (over 60 characters)');
  } else if (content.title.length < 30) {
    recommendations.push('Consider making title longer for better SEO');
  }
  
  // Description validation
  if (!content.description) {
    issues.push('Missing meta description');
  } else if (content.description.length > 155) {
    issues.push('Meta description too long (over 155 characters)');
  } else if (content.description.length < 120) {
    recommendations.push('Consider making description longer');
  }
  
  // Content validation
  if (content.body) {
    const wordCount = content.body.split(/\s+/).length;
    if (wordCount < 300) {
      recommendations.push('Content is quite short, consider adding more detail');
    }
    
    // Check for headings
    const headings = content.body.match(/<h[1-6][^>]*>/gi) || [];
    if (headings.length === 0) {
      issues.push('No headings found in content');
    }
    
    // Check for images
    const images = content.body.match(/<img[^>]*>/gi) || [];
    if (images.length === 0) {
      recommendations.push('Consider adding images to break up text');
    }
    
    // Check for alt text
    const imagesWithoutAlt = content.body.match(/<img(?![^>]*alt=)[^>]*>/gi) || [];
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    }
  }
  
  return {
    score: Math.max(0, 100 - (issues.length * 10) - (recommendations.length * 2)),
    issues,
    recommendations
  };
};

export default {
  optimizeTitle,
  optimizeDescription,
  generateCanonicalUrl,
  industryData,
  generateIndustryMeta,
  generateBreadcrumbs,
  generateHreflangTags,
  generateOpenGraphTags,
  generateTwitterTags,
  generateStructuredData,
  generateSlug,
  calculateReadingTime,
  extractKeywords,
  validateSEOContent
};