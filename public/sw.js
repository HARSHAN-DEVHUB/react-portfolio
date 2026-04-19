const CACHE_NAME = 'harshan-portfolio-v2';
const urlsToCache = [
  '/',
  '/Me.jpg',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  // HTML/navigation: always try network first to avoid stale hashed bundles
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', responseClone));
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match('/');
          return cachedResponse || Response.error();
        })
    );
    return;
  }

  // Static assets: cache first, then network fallback + cache update
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Handle offline form submissions
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      for (const data of offlineData) {
        await submitFormData(data);
      }
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline data
async function getOfflineData() {
  const cache = await caches.open('offline-data');
  const response = await cache.match('form-data');
  return response ? await response.json() : [];
}

async function _saveOfflineData(data) {
  const cache = await caches.open('offline-data');
  const existingData = await getOfflineData();
  existingData.push(data);
  await cache.put('form-data', new Response(JSON.stringify(existingData)));
}

async function clearOfflineData() {
  const cache = await caches.open('offline-data');
  await cache.delete('form-data');
}

async function submitFormData(data) {
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit form data');
  }
} 