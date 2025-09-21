const CACHE_NAME = 'ai-disaster-management-v2';
const STATIC_CACHE = 'ai-disaster-management-static-v2';
const DYNAMIC_CACHE = 'ai-disaster-management-dynamic-v2';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
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

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same origin requests
    event.respondWith(cacheFirst(request));
  } else if (url.hostname === 'api.maptiler.com' || url.hostname === 'maps.googleapis.com') {
    // Map tiles and API calls - network first
    event.respondWith(networkFirst(request));
  } else {
    // Other external requests - network only
    event.respondWith(fetch(request));
  }
});

// Cache first strategy for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache first failed:', error);
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/');
    }
    throw error;
  }
}

// Network first strategy for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle emergency notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Emergency alert received',
    icon: '/icon-192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'emergency-alert',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Alert',
        icon: '/view-icon.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/close-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AI Disaster Management Alert', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});