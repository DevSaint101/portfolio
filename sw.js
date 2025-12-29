/**
 * Service Worker for Devsaint Portfolio
 * Implements smart caching strategies for optimal performance
 */

const CACHE_VERSION = 'v2';
const CACHE_NAME = `devsaint-portfolio-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/skills.html',
    '/projects.html',
    '/contact.html',
    '/styles.css',
    '/script.js',
    '/manifest.json'
];

// Assets to cache on first fetch
const RUNTIME_CACHE_ASSETS = [
    '/Me.jpg',
    '/apple-icon-180.png',
    '/manifest-icon-192.maskable.png',
    '/manifest-icon-512.maskable.png',
    '/contact.vcf'
];

// Cache durations (in seconds)
const CACHE_DURATIONS = {
    html: 60 * 60,           // 1 hour
    css: 60 * 60 * 24 * 7,   // 1 week
    js: 60 * 60 * 24 * 7,    // 1 week
    images: 60 * 60 * 24 * 30, // 30 days
    fonts: 60 * 60 * 24 * 365  // 1 year
};

// ============================================
// INSTALL EVENT
// ============================================
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pre-caching assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                // Immediately activate the new service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Pre-cache failed:', error);
            })
    );
});

// ============================================
// ACTIVATE EVENT
// ============================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old caches
                            return cacheName.startsWith('devsaint-portfolio-') && 
                                   cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// ============================================
// FETCH EVENT
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Only handle same-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Determine caching strategy based on resource type
    const strategy = getCachingStrategy(url.pathname);
    
    event.respondWith(
        handleRequest(request, strategy)
    );
});

// ============================================
// CACHING STRATEGIES
// ============================================

/**
 * Determine caching strategy based on file type
 */
function getCachingStrategy(pathname) {
    // HTML pages: Network first, fallback to cache
    if (pathname.endsWith('.html') || pathname === '/') {
        return 'network-first';
    }
    
    // CSS & JS: Stale-while-revalidate
    if (pathname.endsWith('.css') || pathname.endsWith('.js')) {
        return 'stale-while-revalidate';
    }
    
    // Images: Cache first
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(pathname)) {
        return 'cache-first';
    }
    
    // Fonts: Cache first (long-term)
    if (/\.(woff|woff2|ttf|otf|eot)$/i.test(pathname)) {
        return 'cache-first';
    }
    
    // Default: Network first
    return 'network-first';
}

/**
 * Handle request with appropriate strategy
 */
async function handleRequest(request, strategy) {
    switch (strategy) {
        case 'cache-first':
            return cacheFirst(request);
        case 'network-first':
            return networkFirst(request);
        case 'stale-while-revalidate':
            return staleWhileRevalidate(request);
        default:
            return networkFirst(request);
    }
}

/**
 * Cache First Strategy
 * Good for static assets that don't change often
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache first fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

/**
 * Network First Strategy
 * Good for HTML pages that need fresh content
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network first falling back to cache');
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/index.html');
            return offlinePage || new Response('Offline', { status: 503 });
        }
        
        return new Response('Offline', { status: 503 });
    }
}

/**
 * Stale-While-Revalidate Strategy
 * Returns cached version immediately while fetching update
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Fetch fresh version in background
    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch((error) => {
            console.log('[SW] Background fetch failed:', error);
            return cachedResponse;
        });
    
    // Return cached version immediately, or wait for network
    return cachedResponse || fetchPromise;
}

// ============================================
// MESSAGE HANDLING
// ============================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }
});

// ============================================
// BACKGROUND SYNC (if supported)
// ============================================
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncForms());
    }
});

async function syncForms() {
    // Placeholder for form sync functionality
    console.log('[SW] Syncing forms...');
}

console.log(`[SW] Service Worker ${CACHE_VERSION} loaded`);
