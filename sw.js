const CACHE_NAME = 'fittimer-pro-v1';
const urlsToCache = [
  '/timer/',
  '/timer/index.html',
  '/timer/manifest.json',
  '/timer/assets/index-BmiGVF78.js',
  '/timer/assets/index-CXZ9nag3.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(res => {
                if (!res.ok) throw new Error(`Fetch failed: ${url}`);
                return cache.put(url, res.clone());
              })
              .catch(err => {
                console.warn(`Failed to cache: ${url}`, err);
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

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
    }).then(() => self.clients.claim())
  );
});