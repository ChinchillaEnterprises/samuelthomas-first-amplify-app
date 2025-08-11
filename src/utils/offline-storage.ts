// Offline storage utilities for PWA functionality

interface CacheConfig {
  name: string;
  version: number;
  maxAge: number; // milliseconds
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  pantry: { name: 'pantry-cache', version: 1, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  recipes: { name: 'recipes-cache', version: 1, maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
  shoppingList: { name: 'shopping-list-cache', version: 1, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  stores: { name: 'stores-cache', version: 1, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  sales: { name: 'sales-cache', version: 1, maxAge: 6 * 60 * 60 * 1000 }, // 6 hours
};

export class OfflineStorage {
  private dbName = 'contextchef-offline';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores for each cache type
        Object.entries(CACHE_CONFIGS).forEach(([key, config]) => {
          if (!db.objectStoreNames.contains(config.name)) {
            const store = db.createObjectStore(config.name, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('type', 'type', { unique: false });
          }
        });

        // Create sync queue store
        if (!db.objectStoreNames.contains('sync-queue')) {
          const syncStore = db.createObjectStore('sync-queue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }

  async saveToCache(type: keyof typeof CACHE_CONFIGS, data: any): Promise<void> {
    if (!this.db) await this.init();

    const config = CACHE_CONFIGS[type];
    const transaction = this.db!.transaction([config.name], 'readwrite');
    const store = transaction.objectStore(config.name);

    const cacheEntry = {
      id: data.id || generateId(),
      type,
      data,
      timestamp: Date.now(),
      version: config.version
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFromCache(type: keyof typeof CACHE_CONFIGS, id: string): Promise<any | null> {
    if (!this.db) await this.init();

    const config = CACHE_CONFIGS[type];
    const transaction = this.db!.transaction([config.name], 'readonly');
    const store = transaction.objectStore(config.name);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }

        // Check if cache is expired
        const age = Date.now() - result.timestamp;
        if (age > config.maxAge) {
          // Delete expired entry
          this.deleteFromCache(type, id);
          resolve(null);
          return;
        }

        resolve(result.data);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFromCache(type: keyof typeof CACHE_CONFIGS): Promise<any[]> {
    if (!this.db) await this.init();

    const config = CACHE_CONFIGS[type];
    const transaction = this.db!.transaction([config.name], 'readonly');
    const store = transaction.objectStore(config.name);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        const results = request.result;
        const validEntries = results
          .filter(entry => {
            const age = Date.now() - entry.timestamp;
            return age <= config.maxAge;
          })
          .map(entry => entry.data);
        
        resolve(validEntries);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFromCache(type: keyof typeof CACHE_CONFIGS, id: string): Promise<void> {
    if (!this.db) await this.init();

    const config = CACHE_CONFIGS[type];
    const transaction = this.db!.transaction([config.name], 'readwrite');
    const store = transaction.objectStore(config.name);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearCache(type?: keyof typeof CACHE_CONFIGS): Promise<void> {
    if (!this.db) await this.init();

    if (type) {
      const config = CACHE_CONFIGS[type];
      const transaction = this.db!.transaction([config.name], 'readwrite');
      const store = transaction.objectStore(config.name);

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      // Clear all caches
      const promises = Object.keys(CACHE_CONFIGS).map(key => 
        this.clearCache(key as keyof typeof CACHE_CONFIGS)
      );
      await Promise.all(promises);
    }
  }

  // Sync queue methods for offline actions
  async addToSyncQueue(action: {
    type: string;
    method: string;
    endpoint: string;
    data: any;
  }): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['sync-queue'], 'readwrite');
    const store = transaction.objectStore('sync-queue');

    const syncEntry = {
      ...action,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const request = store.add(syncEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<any[]> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['sync-queue'], 'readonly');
    const store = transaction.objectStore('sync-queue');
    const index = store.index('status');

    return new Promise((resolve, reject) => {
      const request = index.getAll('pending');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSyncStatus(id: number, status: 'completed' | 'failed', error?: string): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['sync-queue'], 'readwrite');
    const store = transaction.objectStore('sync-queue');

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const entry = getRequest.result;
        if (!entry) {
          reject(new Error('Sync entry not found'));
          return;
        }

        entry.status = status;
        entry.lastAttempt = Date.now();
        if (status === 'failed') {
          entry.retryCount = (entry.retryCount || 0) + 1;
          entry.error = error;
        }

        const putRequest = store.put(entry);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async cleanupSyncQueue(): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['sync-queue'], 'readwrite');
    const store = transaction.objectStore('sync-queue');
    const index = store.index('status');

    // Remove completed entries older than 24 hours
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000);

    return new Promise((resolve, reject) => {
      const request = index.openCursor('completed');
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          if (cursor.value.timestamp < cutoffTime) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Service Worker registration for offline support
export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Network status detection
export function setupNetworkListener(onOnline: () => void, onOffline: () => void): () => void {
  const handleOnline = () => {
    console.log('Network: Online');
    onOnline();
  };

  const handleOffline = () => {
    console.log('Network: Offline');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}