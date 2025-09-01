/**
 * Enhanced API route for generating robots.txt
 * Comprehensive search engine crawling directives for StartupNamer.org
 */

export default function handler(req, res) {
  // Set content type to plain text with advanced caching
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600');
  
  const baseUrl = 'https://startupnamer.org';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Development robots.txt - block all crawling
  if (isDevelopment) {
    const devRobots = `User-agent: *
Disallow: /

# Development environment - no indexing allowed`;
    
    res.status(200).send(devRobots);
    return;
  }
  
  // Production robots.txt - comprehensive SEO optimization
  const robotsTxt = `# StartupNamer.org Robots.txt
# AI-Powered Startup Name Generator - Enhanced SEO Configuration

# === MAJOR SEARCH ENGINES ===
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 3

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Social media bots for rich previews
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Default rule for all other bots
User-agent: *
Allow: /
Crawl-delay: 2

# === HIGH-PRIORITY SEO PAGES ===
Allow: /
Allow: /naming-tool
Allow: /features
Allow: /pricing
Allow: /faq
Allow: /how-it-works
Allow: /examples

# Industry-specific landing pages (critical for SEO)
Allow: /tech-startup-names
Allow: /saas-startup-names
Allow: /fintech-startup-names
Allow: /healthcare-startup-names
Allow: /ai-startup-names
Allow: /ecommerce-startup-names

# Content and resource pages
Allow: /blog
Allow: /blog/*
Allow: /startup-naming-guide
Allow: /domain-tips
Allow: /brand-strategy

# Legal and policy pages
Allow: /privacy-policy
Allow: /terms-of-service
Allow: /contact

# === BLOCKED SECTIONS ===
# Admin and system areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /api/

# User-specific areas
Disallow: /user/
Disallow: /account/
Disallow: /profile/
Disallow: /settings/
Disallow: /billing/
Disallow: /payment/

# Temporary and dynamic content
Disallow: /results/temp*
Disallow: /cache/
Disallow: /tmp/

# URLs with parameters that create duplicate content
Disallow: /*?*utm_*
Disallow: /*?*debug=*
Disallow: /*?*test=*
Disallow: /*?*sessionid=*
Disallow: /*?*sid=*

# Development and testing
Disallow: /dev/
Disallow: /test/
Disallow: /staging/
Disallow: /.well-known/

# Prevent infinite pagination crawling
Disallow: /*?page=*
Disallow: /*?offset=*

# === SITEMAPS ===
Sitemap: ${baseUrl}/api/sitemap
Sitemap: ${baseUrl}/sitemap.xml

# === SEO BOT SPECIFIC RULES ===
User-agent: Googlebot-Image
Allow: /images/
Allow: /assets/
Allow: /*.jpg
Allow: /*.png
Allow: /*.webp

User-agent: AdsBot-Google
Allow: /
Disallow: /user/
Disallow: /account/

# Rate-limited SEO crawlers
User-agent: AhrefsBot
Crawl-delay: 5

User-agent: SemrushBot
Crawl-delay: 5

User-agent: MJ12bot
Crawl-delay: 10

# Block unwanted scrapers
User-agent: SiteSnagger
Disallow: /

User-agent: WebZip
Disallow: /

User-agent: HTTrack
Disallow: /

# Block AI training bots (uncomment if desired)
# User-agent: GPTBot
# Disallow: /

# User-agent: ChatGPT-User
# Disallow: /

# === CONFIGURATION ===
Host: ${baseUrl}

# Last updated: ${new Date().toISOString().split('T')[0]}
# Contact: hello@startupnamer.org`;

  res.status(200).send(robotsTxt);
}