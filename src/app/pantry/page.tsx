'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertCircle,
  Package,
  Calendar,
  Edit2,
  Trash2,
  SortAsc
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore, selectFilteredPantryItems, selectExpiringItems } from '@/stores/useAppStore';
import { pantryApi } from '@/services/api';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

export default function Pantry() {
  const router = useRouter();
  const { 
    user,
    pantryFilter,
    pantrySort,
    setPantryFilter,
    setPantrySort,
    setPantryItems,
    removePantryItem
  } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const filteredItems = selectFilteredPantryItems(useAppStore.getState());
  const expiringItems = selectExpiringItems(useAppStore.getState());

  useEffect(() => {
    loadPantryItems();
  }, [user]);

  const loadPantryItems = async () => {
    if (!user) return;
    
    try {
      const items = await pantryApi.getPantryItems(user.id);
      setPantryItems(items);
    } catch (error) {
      console.error('Error loading pantry:', error);
      toast.error('Failed to load pantry items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await pantryApi.deletePantryItem(itemId);
      removePantryItem(itemId);
      toast.success('Item removed from pantry');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const getExpiryStatus = (expiresOn?: string) => {
    if (!expiresOn) return null;
    
    const daysUntilExpiry = differenceInDays(new Date(expiresOn), new Date());
    
    if (daysUntilExpiry < 0) {
      return { color: 'text-red-600 bg-red-50', text: 'Expired' };
    } else if (daysUntilExpiry <= 3) {
      return { color: 'text-orange-600 bg-orange-50', text: `${daysUntilExpiry}d left` };
    } else if (daysUntilExpiry <= 7) {
      return { color: 'text-yellow-600 bg-yellow-50', text: `${daysUntilExpiry}d left` };
    }
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Pantry</h1>
            <p className="text-gray-600">
              {filteredItems.length} items in your pantry
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => router.push('/pantry/scan')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Scan Receipt
            </Button>
            <Button 
              variant="primary"
              onClick={() => router.push('/pantry/add')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Expiring Items Alert */}
        {expiringItems.length > 0 && (
          <Card variant="bordered" className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-orange-900">
                    {expiringItems.length} items expiring soon
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Use these items first: {expiringItems.slice(0, 3).map(item => item.name).join(', ')}
                    {expiringItems.length > 3 && `, and ${expiringItems.length - 3} more`}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-orange-700 hover:text-orange-800"
                    onClick={() => router.push('/recipes/generate?useExpiring=true')}
                  >
                    Find recipes using these items →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card variant="bordered">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="search"
                    placeholder="Search items..."
                    value={pantryFilter}
                    onChange={(e) => setPantryFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={pantrySort}
                  onChange={(e) => setPantrySort(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="expiry">Sort by Expiry</option>
                  <option value="quantity">Sort by Quantity</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <Card variant="bordered">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {pantryFilter ? 'No items found' : 'Your pantry is empty'}
              </h3>
              <p className="text-gray-600 mb-4">
                {pantryFilter 
                  ? 'Try adjusting your search terms'
                  : 'Start by adding items or scanning a receipt'}
              </p>
              {!pantryFilter && (
                <Button
                  variant="primary"
                  onClick={() => router.push('/pantry/scan')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Items
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const expiryStatus = getExpiryStatus(item.expiresOn);
              
              return (
                <Card 
                  key={item.id} 
                  variant="bordered"
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        {item.brand && (
                          <p className="text-sm text-gray-600">{item.brand}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => router.push(`/pantry/edit/${item.id}`)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quantity</span>
                        <span className="font-medium">
                          {item.quantity} {item.unit}
                        </span>
                      </div>

                      {item.expiresOn && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Expires</span>
                          <span className={`text-sm font-medium ${
                            expiryStatus ? expiryStatus.color : 'text-gray-900'
                          } px-2 py-0.5 rounded`}>
                            {expiryStatus?.text || format(new Date(item.expiresOn), 'MMM d')}
                          </span>
                        </div>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === item.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          Delete this item?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="flex-1"
                          >
                            Delete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}