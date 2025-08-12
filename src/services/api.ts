// API service layer for all backend communication

import { generateClient } from 'aws-amplify/api';
import { getCurrentUser as getCurrentAuthUser } from 'aws-amplify/auth';
import { Schema } from '@/amplify/data/resource';
import { OfflineStorage } from '@/utils/offline-storage';
import { 
  RecipeGenerationConstraints, 
  MealPlanConstraints,
  ParsedReceiptItem,
  ShoppingListItem
} from '@/types';

const client = generateClient<Schema>();
const offlineStorage = new OfflineStorage();

// Initialize offline storage
offlineStorage.init();

// Generic error handler
function handleError(error: any, fallbackMessage: string): Error {
  console.error(fallbackMessage, error);
  if (error.errors && error.errors.length > 0) {
    return new Error(error.errors[0].message);
  }
  return new Error(fallbackMessage);
}

// User & Auth APIs
export const userApi = {
  async getCurrentUser() {
    try {
      // Get the current authenticated user's attributes
      const { userId, signInDetails } = await getCurrentAuthUser();
      
      // Try to find existing user by email
      const { data } = await client.models.User.list({
        filter: { email: { eq: signInDetails?.loginId || '' } }
      });
      
      return data[0] || null;
    } catch (error) {
      throw handleError(error, 'Failed to fetch current user');
    }
  },

  async createUser(userData: any) {
    try {
      const { data } = await client.models.User.create(userData);
      return data;
    } catch (error) {
      throw handleError(error, 'Failed to create user');
    }
  },

  async updateProfile(userId: string, updates: any) {
    try {
      const { data } = await client.models.User.update({
        id: userId,
        ...updates
      });
      return data;
    } catch (error) {
      throw handleError(error, 'Failed to update profile');
    }
  },

  async getPreferences(userId: string) {
    try {
      const cached = await offlineStorage.getFromCache('preferences', userId);
      if (cached) return cached;

      const { data } = await client.models.Preferences.list({
        filter: { userId: { eq: userId } },
        limit: 1
      });
      
      const preferences = data[0] || null;
      if (preferences) {
        await offlineStorage.saveToCache('preferences', preferences);
      }
      return preferences;
    } catch (error) {
      throw handleError(error, 'Failed to fetch preferences');
    }
  },

  async updatePreferences(userId: string, updates: any) {
    try {
      const existing = await this.getPreferences(userId);
      
      if (existing) {
        const { data } = await client.models.Preferences.update({
          id: existing.id,
          ...updates
        });
        const preferences = Array.isArray(data) ? data[0] : data;
        await offlineStorage.saveToCache('preferences', preferences);
        return preferences;
      } else {
        const { data } = await client.models.Preferences.create({
          userId,
          ...updates
        });
        const preferences = Array.isArray(data) ? data[0] : data;
        await offlineStorage.saveToCache('preferences', preferences);
        return preferences;
      }
    } catch (error) {
      // Queue for sync if offline
      await offlineStorage.addToSyncQueue({
        type: 'preferences',
        method: 'PUT',
        endpoint: `/preferences/${userId}`,
        data: updates
      });
      throw handleError(error, 'Failed to update preferences');
    }
  }
};

// Pantry APIs
export const pantryApi = {
  async getPantryItems(userId: string) {
    try {
      const cached = await offlineStorage.getAllFromCache('pantry');
      if (cached.length > 0 && navigator.onLine === false) {
        return cached;
      }

      const { data } = await client.models.PantryItem.list({
        filter: { userId: { eq: userId } }
      });
      
      // Cache results
      for (const item of data) {
        await offlineStorage.saveToCache('pantry', item);
      }
      
      return data;
    } catch (error) {
      // Return cached data if available
      const cached = await offlineStorage.getAllFromCache('pantry');
      if (cached.length > 0) return cached;
      throw handleError(error, 'Failed to fetch pantry items');
    }
  },

  async addPantryItem(item: any) {
    try {
      const { data } = await client.models.PantryItem.create(item);
      await offlineStorage.saveToCache('pantry', data);
      return data;
    } catch (error) {
      // Queue for sync if offline
      await offlineStorage.addToSyncQueue({
        type: 'pantry',
        method: 'POST',
        endpoint: '/pantry',
        data: item
      });
      
      // Save to cache with temporary ID
      const tempItem = { ...item, id: `temp-${Date.now()}` };
      await offlineStorage.saveToCache('pantry', tempItem);
      return tempItem;
    }
  },

  async updatePantryItem(id: string, updates: any) {
    try {
      const { data } = await client.models.PantryItem.update({
        id,
        ...updates
      });
      await offlineStorage.saveToCache('pantry', data);
      return data;
    } catch (error) {
      // Queue for sync and update cache
      await offlineStorage.addToSyncQueue({
        type: 'pantry',
        method: 'PATCH',
        endpoint: `/pantry/${id}`,
        data: updates
      });
      
      const cached = await offlineStorage.getFromCache('pantry', id);
      if (cached) {
        const updated = { ...cached, ...updates };
        await offlineStorage.saveToCache('pantry', updated);
        return updated;
      }
      throw handleError(error, 'Failed to update pantry item');
    }
  },

  async deletePantryItem(id: string) {
    try {
      await client.models.PantryItem.delete({ id });
      await offlineStorage.deleteFromCache('pantry', id);
    } catch (error) {
      // Queue for sync
      await offlineStorage.addToSyncQueue({
        type: 'pantry',
        method: 'DELETE',
        endpoint: `/pantry/${id}`,
        data: { id }
      });
      await offlineStorage.deleteFromCache('pantry', id);
    }
  },

  async importReceipt(receiptData: {
    userId: string;
    storeId?: string;
    imageData?: string;
    textData?: string;
  }) {
    try {
      // This would normally call an OCR service
      // For now, we'll create a receipt record and parse text if provided
      const { data: receipt } = await client.models.Receipt.create({
        userId: receiptData.userId,
        storeId: receiptData.storeId,
        date: new Date().toISOString(),
        total: 0,
        rawText: receiptData.textData || '',
        parsedItems: [],
        status: 'pending'
      });

      // In a real implementation, this would trigger a Lambda function
      // that processes the image/text and updates the receipt
      return receipt;
    } catch (error) {
      throw handleError(error, 'Failed to import receipt');
    }
  }
};

// Recipe APIs
export const recipeApi = {
  async searchRecipes(query: string, filters?: any) {
    try {
      const cached = await offlineStorage.getAllFromCache('recipes');
      
      if (cached.length > 0 && navigator.onLine === false) {
        // Basic offline search
        return cached.filter(recipe => 
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }

      const filterConditions: any = {};
      
      if (query) {
        filterConditions.or = [
          { title: { contains: query } },
          { cuisine: { contains: query } }
        ];
      }
      
      if (filters?.maxPrice) {
        filterConditions.estimatedCostPerServing = { le: filters.maxPrice };
      }
      
      if (filters?.difficulty) {
        filterConditions.difficulty = { eq: filters.difficulty };
      }

      const { data } = await client.models.Recipe.list({
        filter: Object.keys(filterConditions).length > 0 ? filterConditions : undefined
      });
      
      // Cache results
      for (const recipe of data) {
        await offlineStorage.saveToCache('recipes', recipe);
      }
      
      return data;
    } catch (error) {
      const cached = await offlineStorage.getAllFromCache('recipes');
      if (cached.length > 0) return cached;
      throw handleError(error, 'Failed to search recipes');
    }
  },

  async getRecipe(id: string) {
    try {
      const cached = await offlineStorage.getFromCache('recipes', id);
      if (cached) return cached;

      const { data } = await client.models.Recipe.get({ id });
      if (data) {
        await offlineStorage.saveToCache('recipes', data);
      }
      return data;
    } catch (error) {
      throw handleError(error, 'Failed to fetch recipe');
    }
  },

  async generateRecipes(constraints: RecipeGenerationConstraints) {
    try {
      // This would normally call a Lambda function that runs the generation logic
      // For now, we'll fetch recipes and filter client-side
      const allRecipes = await this.searchRecipes('', {
        maxPrice: constraints.maxPricePerServing
      });
      
      // Apply additional filtering based on constraints
      return allRecipes.filter(recipe => {
        if (constraints.excludeIngredients?.length) {
          const hasExcluded = recipe.ingredients.some((ing: any) =>
            constraints.excludeIngredients!.some(excluded =>
              ing.name.toLowerCase().includes(excluded.toLowerCase())
            )
          );
          if (hasExcluded) return false;
        }
        
        if (constraints.requiredTags?.length) {
          const hasAllTags = constraints.requiredTags.every(tag =>
            recipe.tags?.includes(tag)
          );
          if (!hasAllTags) return false;
        }
        
        return true;
      });
    } catch (error) {
      throw handleError(error, 'Failed to generate recipes');
    }
  }
};

// Store & Sales APIs
export const storeApi = {
  async getNearbyStores(location: { lat: number; lon: number }, radiusKm: number = 10) {
    try {
      const cached = await offlineStorage.getAllFromCache('stores');
      if (cached.length > 0 && navigator.onLine === false) {
        return cached;
      }

      const { data } = await client.models.Store.list();
      
      // Filter by distance (would be done server-side in production)
      const nearby = data.filter(store => {
        const distance = calculateDistance(
          location,
          { lat: store.location.lat, lon: store.location.lon }
        );
        return distance <= radiusKm;
      });
      
      // Cache results
      for (const store of nearby) {
        await offlineStorage.saveToCache('stores', store);
      }
      
      return nearby;
    } catch (error) {
      const cached = await offlineStorage.getAllFromCache('stores');
      if (cached.length > 0) return cached;
      throw handleError(error, 'Failed to fetch nearby stores');
    }
  },

  async getCurrentSales(storeId?: string) {
    try {
      const cached = await offlineStorage.getAllFromCache('sales');
      const now = new Date();
      
      if (cached.length > 0 && navigator.onLine === false) {
        return cached.filter(sale => 
          (!storeId || sale.storeId === storeId) &&
          new Date(sale.validFrom) <= now &&
          new Date(sale.validTo) >= now
        );
      }

      const filter: any = {
        validFrom: { le: now.toISOString() },
        validTo: { ge: now.toISOString() }
      };
      
      if (storeId) {
        filter.storeId = { eq: storeId };
      }

      const { data } = await client.models.Sale.list({ filter });
      
      // Cache results
      for (const sale of data) {
        await offlineStorage.saveToCache('sales', sale);
      }
      
      return data;
    } catch (error) {
      const cached = await offlineStorage.getAllFromCache('sales');
      if (cached.length > 0) return cached;
      throw handleError(error, 'Failed to fetch sales');
    }
  }
};

// Meal Plan APIs
export const mealPlanApi = {
  async generateMealPlan(constraints: MealPlanConstraints) {
    try {
      // This would normally call a Lambda function
      // For now, we'll use client-side generation
      const recipes = await recipeApi.generateRecipes(constraints);
      
      // Create a basic meal plan
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push({
          breakfast: recipes[i % recipes.length] ? { recipeId: recipes[i % recipes.length].id, servings: constraints.servingsPerMeal } : null,
          lunch: recipes[(i + 1) % recipes.length] ? { recipeId: recipes[(i + 1) % recipes.length].id, servings: constraints.servingsPerMeal } : null,
          dinner: recipes[(i + 2) % recipes.length] ? { recipeId: recipes[(i + 2) % recipes.length].id, servings: constraints.servingsPerMeal } : null
        });
      }
      
      return { days };
    } catch (error) {
      throw handleError(error, 'Failed to generate meal plan');
    }
  },

  async saveMealPlan(mealPlan: any) {
    try {
      const { data } = await client.models.MealPlan.create(mealPlan);
      return data;
    } catch (error) {
      throw handleError(error, 'Failed to save meal plan');
    }
  },

  async getMealPlans(userId: string) {
    try {
      const { data } = await client.models.MealPlan.list({
        filter: { userId: { eq: userId } }
      });
      return data;
    } catch (error) {
      throw handleError(error, 'Failed to fetch meal plans');
    }
  }
};

// Shopping List APIs
export const shoppingListApi = {
  async createFromMealPlan(mealPlanId: string, userId: string) {
    try {
      // This would normally be done server-side
      // For now, we'll create a basic shopping list
      const { data } = await client.models.ShoppingList.create({
        userId,
        planId: mealPlanId,
        items: [],
        totalEstimatedCost: 0,
        status: 'active'
      });
      
      await offlineStorage.saveToCache('shoppingList', data);
      return data;
    } catch (error) {
      throw handleError(error, 'Failed to create shopping list');
    }
  },

  async getActiveShoppingList(userId: string) {
    try {
      const cached = await offlineStorage.getAllFromCache('shoppingList');
      const active = cached.find(list => list.userId === userId && list.status === 'active');
      if (active && navigator.onLine === false) return active;

      const { data } = await client.models.ShoppingList.list({
        filter: {
          userId: { eq: userId },
          status: { eq: 'active' }
        },
        limit: 1
      });
      
      const list = data[0] || null;
      if (list) {
        await offlineStorage.saveToCache('shoppingList', list);
      }
      return list;
    } catch (error) {
      const cached = await offlineStorage.getAllFromCache('shoppingList');
      const active = cached.find(list => list.userId === userId && list.status === 'active');
      if (active) return active;
      throw handleError(error, 'Failed to fetch shopping list');
    }
  },

  async updateShoppingList(id: string, updates: any) {
    try {
      const { data } = await client.models.ShoppingList.update({
        id,
        ...updates
      });
      await offlineStorage.saveToCache('shoppingList', data);
      return data;
    } catch (error) {
      // Queue for sync and update cache
      await offlineStorage.addToSyncQueue({
        type: 'shoppingList',
        method: 'PATCH',
        endpoint: `/shopping-list/${id}`,
        data: updates
      });
      
      const cached = await offlineStorage.getFromCache('shoppingList', id);
      if (cached) {
        const updated = { ...cached, ...updates };
        await offlineStorage.saveToCache('shoppingList', updated);
        return updated;
      }
      throw handleError(error, 'Failed to update shopping list');
    }
  },

  async markItemPurchased(listId: string, itemIndex: number) {
    try {
      const list = await offlineStorage.getFromCache('shoppingList', listId);
      if (!list) throw new Error('Shopping list not found');
      
      const updatedItems = [...list.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], purchased: true };
      
      return this.updateShoppingList(listId, { items: updatedItems });
    } catch (error) {
      throw handleError(error, 'Failed to mark item as purchased');
    }
  }
};

// Analytics APIs
export const analyticsApi = {
  async trackEvent(eventType: string, eventData?: any) {
    try {
      await client.models.AnalyticsEvent.create({
        eventType,
        eventData: eventData || {},
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Don't throw for analytics failures
      console.error('Analytics tracking failed:', error);
    }
  }
};

// Helper function for distance calculation
function calculateDistance(from: { lat: number; lon: number }, to: { lat: number; lon: number }): number {
  const R = 6371; // Earth's radius in km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLon = (to.lon - from.lon) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Sync manager for offline queue
export async function syncOfflineQueue() {
  const queue = await offlineStorage.getSyncQueue();
  
  for (const item of queue) {
    try {
      // Process each queued item
      switch (item.type) {
        case 'pantry':
          if (item.method === 'POST') {
            await pantryApi.addPantryItem(item.data);
          } else if (item.method === 'PATCH') {
            await pantryApi.updatePantryItem(item.data.id, item.data);
          } else if (item.method === 'DELETE') {
            await pantryApi.deletePantryItem(item.data.id);
          }
          break;
        
        case 'preferences':
          await userApi.updatePreferences(item.data.userId, item.data);
          break;
        
        case 'shoppingList':
          await shoppingListApi.updateShoppingList(item.data.id, item.data);
          break;
      }
      
      await offlineStorage.updateSyncStatus(item.id, 'completed');
    } catch (error) {
      await offlineStorage.updateSyncStatus(item.id, 'failed', error.message);
    }
  }
  
  // Cleanup old completed items
  await offlineStorage.cleanupSyncQueue();
}