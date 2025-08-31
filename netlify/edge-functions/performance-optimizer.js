import { Context } from "https://edge.netlify.com";

// Critical resource patterns for prioritization
const CRITICAL_RESOURCES = [
  '/static/css/main.',
  '/static/js/main.',
  '/static/js/runtime-main.',
  '/manifest.json'
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const FONT_EXTENSIONS = ['.woff2', '.woff', '.ttf', '.otf'];

export default async (request, context) => {
  const { url, headers, method } = request;
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  
  // Only process GET requests
  if (method !== 'GET') {
    return context.next();
  }

  // Skip processing for API endpoints
  if (pathname.startsWith('/api/')) {
    return context.next();
  }

  const userAgent = headers.get('user-agent') || '';
  const acceptHeader = headers.get('accept') || '';
  const isBot = headers.get('x-bot-detected') === 'true';

  // Device and capability detection
  const deviceInfo = analyzeDevice(userAgent);
  const connectionInfo = analyzeConnection(headers);
  
  console.log('Performance optimizer:', {
    pathname,
    device: deviceInfo.type,
    connection: connectionInfo.type,
    isBot
  });

  let response;

  // Handle different resource types
  if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
    // HTML pages - apply full optimization
    response = await optimizeHTMLResponse(request, context, deviceInfo, connectionInfo, isBot);
  } else if (IMAGE_EXTENSIONS.some(ext => pathname.includes(ext))) {
    // Image optimization
    response = await optimizeImageResponse(request, context, deviceInfo, connectionInfo);
  } else if (FONT_EXTENSIONS.some(ext => pathname.includes(ext))) {
    // Font optimization
    response = await optimizeFontResponse(request, context);
  } else if (pathname.includes('.js') || pathname.includes('.css')) {
    // Static asset optimization
    response = await optimizeStaticAsset(request, context, deviceInfo, connectionInfo);
  } else {
    // Default processing
    response = await context.next();
  }

  // Apply global performance headers
  return applyGlobalPerformanceHeaders(response, deviceInfo, connectionInfo, isBot);
};

async function optimizeHTMLResponse(request, context, deviceInfo, connectionInfo, isBot) {
  const response = await context.next();
  
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }

  // For slow connections, add aggressive preloading hints
  if (connectionInfo.type === 'slow') {
    const existingLink = response.headers.get('Link') || '';
    const criticalPreloads = CRITICAL_RESOURCES.map(resource => 
      `<${resource}>; rel=preload; as=${resource.includes('.css') ? 'style' : 'script'}`
    ).join(', ');
    
    const combinedLinks = existingLink ? `${existingLink}, ${criticalPreloads}` : criticalPreloads;
    response.headers.set('Link', combinedLinks);
  }

  // Add performance headers based on device capabilities
  if (deviceInfo.type === 'mobile') {
    response.headers.set('X-Mobile-Optimized', 'true');
    
    // For mobile, add resource hints
    const resourceHints = [
      '</static/css/main.css>; rel=preload; as=style',
      '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
      '<https://fonts.googleapis.com>; rel=preconnect'
    ].join(', ');
    
    const existingLink = response.headers.get('Link') || '';
    response.headers.set('Link', existingLink ? `${existingLink}, ${resourceHints}` : resourceHints);
  }

  // Add early hints for critical resources
  response.headers.set('X-Critical-Resources', CRITICAL_RESOURCES.join(','));
  
  return response;
}

async function optimizeImageResponse(request, context, deviceInfo, connectionInfo) {
  const response = await context.next();
  
  if (!response.ok) {
    return response;
  }

  // Set optimal caching for images
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  response.headers.set('Vary', 'Accept');
  
  // Add image optimization hints
  if (deviceInfo.supportsWebP && request.headers.get('accept')?.includes('image/webp')) {
    response.headers.set('X-Image-Format', 'webp-supported');
  }
  
  // For slow connections, add lazy loading hints
  if (connectionInfo.type === 'slow') {
    response.headers.set('X-Lazy-Load', 'recommended');
  }
  
  return response;
}

async function optimizeFontResponse(request, context) {
  const response = await context.next();
  
  if (!response.ok) {
    return response;
  }

  // Optimal font caching
  response.headers.set('Cache-Control', 'public, max-age=2592000, immutable');
  response.headers.set('Access-Control-Allow-Origin', '*');
  
  // Font display optimization
  response.headers.set('X-Font-Display', 'swap');
  
  return response;
}

async function optimizeStaticAsset(request, context, deviceInfo, connectionInfo) {
  const response = await context.next();
  
  if (!response.ok) {
    return response;
  }

  // Long-term caching for static assets
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  // Compression hints
  response.headers.set('Vary', 'Accept-Encoding');
  
  // For critical resources, add priority hints
  if (CRITICAL_RESOURCES.some(resource => request.url.includes(resource))) {
    response.headers.set('X-Critical-Resource', 'true');
  }
  
  return response;
}

function applyGlobalPerformanceHeaders(response, deviceInfo, connectionInfo, isBot) {
  // Server timing for performance monitoring
  const serverTiming = [
    `edge;dur=${Date.now() % 1000}`,
    `device;desc="${deviceInfo.type}"`,
    `connection;desc="${connectionInfo.type}"`
  ].join(', ');
  
  response.headers.set('Server-Timing', serverTiming);
  
  // Performance policy headers
  response.headers.set('X-Device-Type', deviceInfo.type);
  response.headers.set('X-Connection-Type', connectionInfo.type);
  
  // Network error logging for performance monitoring
  if (!isBot) {
    response.headers.set('NEL', JSON.stringify({
      report_to: 'performance',
      max_age: 86400,
      include_subdomains: true
    }));
    
    response.headers.set('Report-To', JSON.stringify({
      group: 'performance',
      max_age: 86400,
      endpoints: [{ url: '/api/vitals' }]
    }));
  }
  
  // DNS prefetch control
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  return response;
}

function analyzeDevice(userAgent) {
  const ua = userAgent.toLowerCase();
  
  const device = {
    type: 'desktop',
    supportsWebP: true, // Most modern browsers support WebP
    supportsAvif: false,
    isLowEnd: false
  };

  // Mobile detection
  if (/mobile|android|iphone|ipad|tablet/.test(ua)) {
    device.type = 'mobile';
    
    // Check for low-end devices
    if (/android [0-4]\.|cpu os [0-9]_|windows phone/.test(ua)) {
      device.isLowEnd = true;
      device.supportsWebP = false;
    }
  }
  
  // Tablet detection
  if (/ipad|tablet|kindle/.test(ua)) {
    device.type = 'tablet';
  }
  
  // Modern browser capabilities
  if (/chrome|safari|firefox|edge/.test(ua)) {
    device.supportsAvif = /chrome|firefox/.test(ua); // Simplified check
  }
  
  return device;
}

function analyzeConnection(headers) {
  const connection = {
    type: 'unknown',
    speed: 'unknown'
  };

  // Client hints (if available)
  const ect = headers.get('ect'); // Effective connection type
  const downlink = headers.get('downlink');
  const rtt = headers.get('rtt');

  if (ect) {
    connection.type = ect;
    
    // Categorize connection speed
    if (ect === '4g' || ect === '3g') {
      connection.speed = ect === '4g' ? 'fast' : 'medium';
    } else if (ect === '2g' || ect === 'slow-2g') {
      connection.speed = 'slow';
      connection.type = 'slow';
    }
  } else if (downlink) {
    const dl = parseFloat(downlink);
    if (dl >= 1.5) {
      connection.speed = 'fast';
      connection.type = 'fast';
    } else if (dl >= 0.5) {
      connection.speed = 'medium';
      connection.type = 'medium';
    } else {
      connection.speed = 'slow';
      connection.type = 'slow';
    }
  }

  // RTT-based analysis
  if (rtt) {
    const roundTripTime = parseInt(rtt);
    if (roundTripTime > 300) {
      connection.type = 'slow';
    }
  }

  // Fallback to medium for unknown connections
  if (connection.type === 'unknown') {
    connection.type = 'medium';
    connection.speed = 'medium';
  }

  return connection;
}

export const config = {
  path: "/*",
  cache: "manual"
};