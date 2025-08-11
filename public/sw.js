// Service Worker for ContextChef
const CACHE_NAME = 'contextchef-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline use
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  '/_next/static/chunks/webpack.js',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
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
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle API calls differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // Try to return cached API response
          return caches.match(event.request);
        })
    );
    return;
  }

  // For navigation requests, try network first, then cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pantry') {
    event.waitUntil(syncPantryData());
  } else if (event.tag === 'sync-shopping-list') {
    event.waitUntil(syncShoppingList());
  }
});

async function syncPantryData() {
  try {
    // Get all pending pantry updates from IndexedDB
    const db = await openDB();
    const tx = db.transaction(['sync-queue'], 'readonly');
    const store = tx.objectStore('sync-queue');
    const index = store.index('type');
    const pantryUpdates = await index.getAll('pantry');
    
    // Process each update
    for (const update of pantryUpdates) {
      await fetch(update.endpoint, {
        method: update.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update.data),
      });
      
      // Mark as synced
      await markAsSynced(update.id);
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function syncShoppingList() {
  // Similar implementation for shopping list sync
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('contextchef-offline', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function markAsSynced(id) {
  const db = await openDB();
  const tx = db.transaction(['sync-queue'], 'readwrite');
  const store = tx.objectStore('sync-queue');
  const request = store.get(id);
  
  request.onsuccess = () => {
    const record = request.result;
    if (record) {
      record.status = 'completed';
      store.put(record);
    }
  };
}