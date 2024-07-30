const CACHE_NAME = 'my-cache';
let OFFLINE_URL = './html/offline.html';
const URLs_TO_CACHE = [
  './src/Untitled-9.png',
  OFFLINE_URL
];

// Install event - cache the necessary files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  );
});

// Fetch event - serve cached files or fallback to offline page
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(async () => {
        const response = await caches.match(event.request);
          return response || caches.match(URLs_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});