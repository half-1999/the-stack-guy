const CACHE_NAME = 'stack-os-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // 1. Completely bypass API requests and non-GET requests to prevent CORS locking
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return; 
  }

  // 2. Safely continue with normal caching checks for assets/HTML
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
