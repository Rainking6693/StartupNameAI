// Service Worker for StartupNamer.org
// Performance-optimized caching strategy for SEO and Core Web Vitals

const CACHE_NAME = 'startupnamer-v1.0.0';
const STATIC_CACHE = 'startupnamer-static-v1.0.0';
const DYNAMIC_CACHE = 'startupnamer-dynamic-v1.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/site.webmanifest'
];

// Resources to cache with network-first strategy
const NETWORK_FIRST = [
  '/api/',
  '/naming-tool',
  '/results/'
];

// Resources to cache with cache-first strategy  
const CACHE_FIRST = [
  '/static/',
  '/fonts/',
  '/images/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different resource types with appropriate strategies
  if (shouldUseNetworkFirst(url.pathname)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (shouldUseCacheFirst(url.href)) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Offline - StartupNamer.org</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                     display: flex; align-items: center; justify-content: center; 
                     min-height: 100vh; margin: 0; background: #f8fafc; }
              .container { text-align: center; padding: 2rem; }
              .icon { font-size: 4rem; margin-bottom: 1rem; }
              h1 { color: #1e293b; margin-bottom: 0.5rem; }
              p { color: #64748b; margin-bottom: 2rem; }
              button { background: #0ea5e9; color: white; border: none; 
                      padding: 0.75rem 1.5rem; border-radius: 0.5rem; 
                      font-weight: 600; cursor: pointer; }
              button:hover { background: #0284c7; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">📡</div>
              <h1>You're Offline</h1>
              <p>Please check your internet connection and try again.</p>
              <button onclick="window.location.reload()">Retry</button>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache-first failed:', error);
    throw error;
  }
}

// Stale-while-revalidate strategy for general content
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[SW] Network failed in stale-while-revalidate:', error);
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Helper functions to determine caching strategy
function shouldUseNetworkFirst(pathname) {
  return NETWORK_FIRST.some(path => pathname.startsWith(path));
}

function shouldUseCacheFirst(href) {
  return CACHE_FIRST.some(pattern => href.includes(pattern));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-analytics') {
    event.waitUntil(sendAnalytics());
  }
});

// Send queued analytics data when online
async function sendAnalytics() {
  try {
    const cache = await caches.open('analytics-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
        console.log('[SW] Sent queued analytics:', request.url);
      } catch (error) {
        console.log('[SW] Failed to send analytics:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

// Handle push notifications (if needed later)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: 'New startup names are ready for you!',
    icon: '/android-chrome-192x192.png',
    badge: '/badge-96x96.png',
    tag: 'startup-names',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Names',
        icon: '/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('StartupNamer.org', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/naming-tool')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.ports[0].postMessage({
      cacheName: CACHE_NAME,
      cacheSize: getCacheSize()
    });
  }
});

// Get cache size for performance monitoring
async function getCacheSize() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    return keys.length;
  } catch (error) {
    console.log('[SW] Failed to get cache size:', error);
    return 0;
  }
}

console.log('[SW] Service Worker loaded successfully');