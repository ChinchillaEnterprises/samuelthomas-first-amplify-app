'use client';

import { ReactNode, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';
import { useAppStore } from '@/stores/useAppStore';
import { setupNetworkListener, registerServiceWorker } from '@/utils/offline-storage';
import { syncOfflineQueue } from '@/services/api';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { setOnlineStatus, setSyncStatus } = useAppStore();

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Setup network listeners
    const cleanup = setupNetworkListener(
      async () => {
        setOnlineStatus(true);
        setSyncStatus(true);
        try {
          await syncOfflineQueue();
        } catch (error) {
          console.error('Sync failed:', error);
        } finally {
          setSyncStatus(false);
        }
      },
      () => {
        setOnlineStatus(false);
      }
    );

    return cleanup;
  }, [setOnlineStatus, setSyncStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#363636',
          },
          className: 'shadow-lg',
        }}
      />
    </div>
  );
}