/**
 * Enhanced API route for generating comprehensive sitemap.xml
 * Optimized for maximum SEO impact and search engine discoverability
 */

export default async function handler(req, res) {
  // Set comprehensive headers for XML sitemap
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'index, follow');
  
  const baseUrl = 'https://startupnamer.org';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Core application pages (highest priority)
  const coreRoutes = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0',
      images: [`${baseUrl}/images/og-image.jpg`]
    },
    {
      url: '/naming-tool',
      lastmod: currentDate,
      changefreq: 'daily', 
      priority: '0.9',
      images: [`${baseUrl}/images/naming-tool-screenshot.jpg`]
    },
    {
      url: '/features',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/features-overview.jpg`]
    },
    {
      url: '/pricing',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/pricing-plans.jpg`]
    }
  ];

  // Content and information pages
  const contentRoutes = [
    {
      url: '/faq',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/how-it-works',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/examples',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/blog',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/startup-naming-guide',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/domain-name-tips',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/brand-naming-best-practices',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];

  // Industry-specific landing pages (critical for SEO)
  const industryRoutes = [
    {
      url: '/tech-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/tech-startups.jpg`]
    },
    {
      url: '/saas-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/saas-startups.jpg`]
    },
    {
      url: '/fintech-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/fintech-startups.jpg`]
    },
    {
      url: '/healthcare-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/healthcare-startups.jpg`]
    },
    {
      url: '/ai-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/ai-startups.jpg`]
    },
    {
      url: '/ecommerce-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      images: [`${baseUrl}/images/ecommerce-startups.jpg`]
    },
    {
      url: '/blockchain-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/biotech-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/edtech-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/cleantech-startup-names',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    }
  ];

  // Resource and tool pages
  const resourceRoutes = [
    {
      url: '/startup-name-checklist',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/trademark-search-tool',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      url: '/domain-availability-checker',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      url: '/brand-name-analyzer',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    }
  ];

  // Company and legal pages (lower priority but necessary)
  const companyRoutes = [
    {
      url: '/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/contact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/privacy-policy',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.3'
    },
    {
      url: '/terms-of-service',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.3'
    },
    {
      url: '/cookie-policy',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.2'
    }
  ];

  // Dynamic blog posts (would typically fetch from CMS/database)
  const blogRoutes = [
    {
      url: '/blog/how-to-name-your-startup',
      lastmod: '2024-08-15',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/blog/startup-naming-trends-2024',
      lastmod: '2024-08-20',
      changefreq: 'monthly', 
      priority: '0.6'
    },
    {
      url: '/blog/domain-name-strategy',
      lastmod: '2024-08-25',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/blog/trademark-basics-for-startups',
      lastmod: '2024-08-30',
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];

  // Combine all routes
  const allRoutes = [
    ...coreRoutes,
    ...contentRoutes,
    ...industryRoutes,
    ...resourceRoutes,
    ...companyRoutes,
    ...blogRoutes
  ];

  // Helper function to generate image tags
  const generateImageTags = (images) => {
    if (!images || images.length === 0) return '';
    
    return images.map(image => `    <image:image>
      <image:loc>${image}</image:loc>
      <image:caption>StartupNamer.org - AI-Powered Startup Name Generator</image:caption>
      <image:title>StartupNamer.org Screenshot</image:title>
    </image:image>`).join('\n');
  };

  // Generate comprehensive XML sitemap with images
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${route.images ? generateImageTags(route.images) : ''}
  </url>`).join('\n')}
</urlset>`;

  res.status(200).send(sitemap);
}