// public/sw.js - Service Worker for PWA
const CACHE_NAME = 'mashallah-furniture-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/global.css',
  '/js/store.js',
  '/js/performance.js',
  '/js/errorHandler.js',
  '/js/pwa.js',
  '/data/products.json',
  '/data/categories.json',
  '/data/collections.json',
  '/data/testimonials.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});