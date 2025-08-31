import { Context } from "https://edge.netlify.com";

// Comprehensive bot detection patterns
const BOT_USER_AGENTS = [
  // Search engine crawlers
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
  'facebookexternalhit', 'twitterbot', 'rogerbot', 'linkedinbot', 'embedly',
  'quora link preview', 'showyoubot', 'outbrain', 'pinterest/0.',
  'developers.google.com/+/web/snippet',
  
  // SEO and monitoring tools
  'lighthouse', 'gtmetrix', 'pagespeed', 'pingdom', 'uptimerobot',
  'site24x7', 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
  
  // Social media crawlers  
  'whatsapp', 'telegram', 'skype', 'instagram', 'snapchat',
  
  // Generic bot patterns
  'bot/', 'crawler', 'spider', 'scraper', 'archiver', 'fetcher'
];

const BOT_IPS = [
  // Google IP ranges (simplified - in production use full CIDR blocks)
  '66.249.', '74.125.', '173.194.', '216.58.',
  // Bing IP ranges
  '207.46.', '65.55.', '131.253.',
  // Facebook IP ranges  
  '31.13.', '173.252.', '204.15.',
  // Other known bot IPs would be added here
];

const PRERENDER_QUERY_PARAMS = [
  '_escaped_fragment_',
  'prerender',
  'bot'
];

export default async (request, context) => {
  const { url, headers } = request;
  const userAgent = headers.get('user-agent')?.toLowerCase() || '';
  const acceptHeader = headers.get('accept') || '';
  
  // Get client IP (accounting for CDN headers)
  const clientIP = headers.get('cf-connecting-ip') || 
                   headers.get('x-forwarded-for')?.split(',')[0] || 
                   headers.get('x-real-ip') || 
                   context.clientIP || '';

  // Parse URL for analysis
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // Bot detection logic
  const botDetection = {
    isBot: false,
    confidence: 0,
    reasons: [],
    type: null
  };

  // 1. User Agent Analysis
  const userAgentLower = userAgent.toLowerCase();
  for (const botPattern of BOT_USER_AGENTS) {
    if (userAgentLower.includes(botPattern)) {
      botDetection.isBot = true;
      botDetection.confidence += 0.8;
      botDetection.reasons.push(`User-Agent contains: ${botPattern}`);
      
      // Determine bot type
      if (['googlebot', 'bingbot', 'slurp', 'duckduckbot'].some(bot => botPattern.includes(bot))) {
        botDetection.type = 'search_engine';
      } else if (['facebookexternalhit', 'twitterbot', 'linkedinbot'].some(bot => botPattern.includes(bot))) {
        botDetection.type = 'social_media';
      } else if (['lighthouse', 'pagespeed', 'gtmetrix'].some(bot => botPattern.includes(bot))) {
        botDetection.type = 'performance_tool';
      } else {
        botDetection.type = 'other_bot';
      }
      break;
    }
  }

  // 2. IP Address Analysis
  for (const botIP of BOT_IPS) {
    if (clientIP.startsWith(botIP)) {
      botDetection.isBot = true;
      botDetection.confidence += 0.7;
      botDetection.reasons.push(`IP matches known bot range: ${botIP}*`);
      break;
    }
  }

  // 3. Accept Header Analysis
  if (!acceptHeader.includes('text/html') && !acceptHeader.includes('*/*')) {
    botDetection.confidence += 0.3;
    botDetection.reasons.push('Non-browser Accept header');
  }

  // 4. Missing typical browser headers
  const browserHeaders = ['accept-language', 'accept-encoding', 'cache-control'];
  const missingHeaders = browserHeaders.filter(header => !headers.get(header));
  if (missingHeaders.length >= 2) {
    botDetection.confidence += 0.4;
    botDetection.reasons.push(`Missing browser headers: ${missingHeaders.join(', ')}`);
  }

  // 5. Prerender query parameters
  for (const param of PRERENDER_QUERY_PARAMS) {
    if (searchParams.has(param)) {
      botDetection.isBot = true;
      botDetection.confidence += 0.9;
      botDetection.reasons.push(`Prerender query param: ${param}`);
      botDetection.type = 'prerender_service';
      break;
    }
  }

  // 6. Request patterns analysis
  const referer = headers.get('referer');
  if (!referer && !pathname.endsWith('/')) {
    botDetection.confidence += 0.2;
    botDetection.reasons.push('No referer for deep page');
  }

  // Final bot determination
  if (botDetection.confidence >= 0.7) {
    botDetection.isBot = true;
  }

  // Handle bot requests
  if (botDetection.isBot) {
    console.log('Bot detected:', {
      userAgent,
      ip: clientIP,
      url: url,
      confidence: botDetection.confidence,
      reasons: botDetection.reasons,
      type: botDetection.type
    });

    // Add bot detection headers for downstream processing
    const response = await context.next();
    response.headers.set('X-Bot-Detected', 'true');
    response.headers.set('X-Bot-Type', botDetection.type || 'unknown');
    response.headers.set('X-Bot-Confidence', botDetection.confidence.toString());
    
    // For SEO bots, ensure they get the prerendered version
    if (botDetection.type === 'search_engine' || botDetection.type === 'social_media') {
      // Check if prerendered version exists
      const prerenderPath = pathname === '/' ? '/index.html' : `${pathname}/index.html`;
      
      try {
        // Try to fetch the prerendered version
        const prerenderUrl = new URL(prerenderPath, url.origin);
        const prerenderResponse = await fetch(prerenderUrl.href);
        
        if (prerenderResponse.ok) {
          console.log('Serving prerendered version:', prerenderPath);
          
          // Clone the response and add SEO headers
          const prerenderBody = await prerenderResponse.text();
          const modifiedResponse = new Response(prerenderBody, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
              'X-Prerendered': 'true',
              'X-Prerender-Source': 'react-snap',
              'X-Bot-Served': 'true'
            }
          });
          
          return modifiedResponse;
        }
      } catch (error) {
        console.warn('Failed to fetch prerendered version:', error);
      }
    }
    
    return response;
  }

  // For regular users, continue normally but add performance headers
  const response = await context.next();
  
  // Add performance optimization hints for real users
  response.headers.set('X-Bot-Detected', 'false');
  response.headers.set('Link', '</static/js/main.js>; rel=preload; as=script, </static/css/main.css>; rel=preload; as=style');
  response.headers.set('X-Performance-Mode', 'optimized');
  
  return response;
};

export const config = {
  path: "/*",
  cache: "manual"
};