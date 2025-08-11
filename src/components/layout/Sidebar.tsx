'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Package,
  Book,
  Calendar,
  ShoppingCart,
  Store,
  TrendingDown,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Pantry', href: '/pantry', icon: Package },
  { name: 'Recipes', href: '/recipes', icon: Book },
  { name: 'Meal Plan', href: '/meal-plan', icon: Calendar },
  { name: 'Shopping List', href: '/shopping', icon: ShoppingCart },
  { name: 'Stores & Sales', href: '/stores', icon: Store },
  { name: 'Budget Insights', href: '/budget', icon: TrendingDown },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <item.icon
                      className={clsx(
                        'mr-3 h-5 w-5',
                        isActive ? 'text-green-600' : 'text-gray-400'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <item.icon
                        className={clsx(
                          'mr-3 h-5 w-5',
                          isActive ? 'text-green-600' : 'text-gray-400'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Storage usage indicator */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Offline Storage</span>
                <span className="text-gray-900 font-medium">2.3 MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '23%' }}
                />
              </div>
              <p className="text-xs text-gray-500">
                23% of 10 MB used
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}