// Global state management with Zustand

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { 
  Location, 
  DietaryProfile,
  ShoppingListItem,
  MealPlanDay
} from '@/types';

interface User {
  id: string;
  email: string;
  name: string;
  location: Location;
  dietaryPreferences: string[];
  allergenList: string[];
  defaultBudgetPerServing: number;
  householdSize: number;
}

interface Preferences {
  id: string;
  userId: string;
  dietaryProfile?: DietaryProfile;
  allergens: string[];
  dislikedIngredients: string[];
  cuisineLikes: string[];
  costTargetMin: number;
  costTargetMax: number;
  nutritionGoals?: any;
}

interface AppState {
  // User & Auth
  user: User | null;
  preferences: Preferences | null;
  isAuthenticated: boolean;
  
  // UI State
  isOnline: boolean;
  isSyncing: boolean;
  activeView: string;
  sidebarOpen: boolean;
  
  // Pantry
  pantryItems: any[];
  pantryFilter: string;
  pantrySort: 'name' | 'expiry' | 'quantity';
  
  // Recipes
  favoriteRecipes: string[];
  recentRecipes: string[];
  recipeFilters: {
    maxPrice?: number;
    difficulty?: string;
    cuisine?: string;
    tags?: string[];
  };
  
  // Meal Plan
  currentMealPlan: {
    id?: string;
    days: MealPlanDay[];
    startDate: string;
  } | null;
  
  // Shopping List
  activeShoppingList: {
    id?: string;
    items: ShoppingListItem[];
    totalEstimatedCost: number;
  } | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setPreferences: (preferences: Preferences) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncStatus: (isSyncing: boolean) => void;
  
  // Pantry actions
  setPantryItems: (items: any[]) => void;
  addPantryItem: (item: any) => void;
  updatePantryItem: (id: string, updates: any) => void;
  removePantryItem: (id: string) => void;
  setPantryFilter: (filter: string) => void;
  setPantrySort: (sort: 'name' | 'expiry' | 'quantity') => void;
  
  // Recipe actions
  toggleFavoriteRecipe: (recipeId: string) => void;
  addRecentRecipe: (recipeId: string) => void;
  setRecipeFilters: (filters: any) => void;
  
  // Meal plan actions
  setMealPlan: (plan: any) => void;
  updateMealPlanDay: (dayIndex: number, meal: 'breakfast' | 'lunch' | 'dinner', recipe: any) => void;
  clearMealPlan: () => void;
  
  // Shopping list actions
  setShoppingList: (list: any) => void;
  toggleItemPurchased: (itemIndex: number) => void;
  updateShoppingListItem: (itemIndex: number, updates: any) => void;
  clearShoppingList: () => void;
  
  // UI actions
  setActiveView: (view: string) => void;
  toggleSidebar: () => void;
  
  // Utility
  reset: () => void;
}

const initialState = {
  user: null,
  preferences: null,
  isAuthenticated: false,
  isOnline: true,
  isSyncing: false,
  activeView: 'dashboard',
  sidebarOpen: true,
  pantryItems: [],
  pantryFilter: '',
  pantrySort: 'name' as const,
  favoriteRecipes: [],
  recentRecipes: [],
  recipeFilters: {},
  currentMealPlan: null,
  activeShoppingList: null,
};

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      ...initialState,

      // User & Auth
      setUser: (user) => set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      }),

      setPreferences: (preferences) => set((state) => {
        state.preferences = preferences;
      }),

      setOnlineStatus: (isOnline) => set((state) => {
        state.isOnline = isOnline;
      }),

      setSyncStatus: (isSyncing) => set((state) => {
        state.isSyncing = isSyncing;
      }),

      // Pantry actions
      setPantryItems: (items) => set((state) => {
        state.pantryItems = items;
      }),

      addPantryItem: (item) => set((state) => {
        state.pantryItems.push(item);
      }),

      updatePantryItem: (id, updates) => set((state) => {
        const index = state.pantryItems.findIndex(item => item.id === id);
        if (index !== -1) {
          state.pantryItems[index] = { ...state.pantryItems[index], ...updates };
        }
      }),

      removePantryItem: (id) => set((state) => {
        state.pantryItems = state.pantryItems.filter(item => item.id !== id);
      }),

      setPantryFilter: (filter) => set((state) => {
        state.pantryFilter = filter;
      }),

      setPantrySort: (sort) => set((state) => {
        state.pantrySort = sort;
      }),

      // Recipe actions
      toggleFavoriteRecipe: (recipeId) => set((state) => {
        const index = state.favoriteRecipes.indexOf(recipeId);
        if (index === -1) {
          state.favoriteRecipes.push(recipeId);
        } else {
          state.favoriteRecipes.splice(index, 1);
        }
      }),

      addRecentRecipe: (recipeId) => set((state) => {
        // Remove if already exists
        state.recentRecipes = state.recentRecipes.filter(id => id !== recipeId);
        // Add to beginning
        state.recentRecipes.unshift(recipeId);
        // Keep only last 10
        state.recentRecipes = state.recentRecipes.slice(0, 10);
      }),

      setRecipeFilters: (filters) => set((state) => {
        state.recipeFilters = { ...state.recipeFilters, ...filters };
      }),

      // Meal plan actions
      setMealPlan: (plan) => set((state) => {
        state.currentMealPlan = plan;
      }),

      updateMealPlanDay: (dayIndex, meal, recipe) => set((state) => {
        if (state.currentMealPlan) {
          state.currentMealPlan.days[dayIndex][meal] = recipe;
        }
      }),

      clearMealPlan: () => set((state) => {
        state.currentMealPlan = null;
      }),

      // Shopping list actions
      setShoppingList: (list) => set((state) => {
        state.activeShoppingList = list;
      }),

      toggleItemPurchased: (itemIndex) => set((state) => {
        if (state.activeShoppingList && state.activeShoppingList.items[itemIndex]) {
          state.activeShoppingList.items[itemIndex].purchased = 
            !state.activeShoppingList.items[itemIndex].purchased;
        }
      }),

      updateShoppingListItem: (itemIndex, updates) => set((state) => {
        if (state.activeShoppingList && state.activeShoppingList.items[itemIndex]) {
          state.activeShoppingList.items[itemIndex] = {
            ...state.activeShoppingList.items[itemIndex],
            ...updates
          };
        }
      }),

      clearShoppingList: () => set((state) => {
        state.activeShoppingList = null;
      }),

      // UI actions
      setActiveView: (view) => set((state) => {
        state.activeView = view;
      }),

      toggleSidebar: () => set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),

      // Utility
      reset: () => set(() => initialState),
    })),
    {
      name: 'contextchef-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        favoriteRecipes: state.favoriteRecipes,
        recentRecipes: state.recentRecipes,
        recipeFilters: state.recipeFilters,
        pantrySort: state.pantrySort,
      }),
    }
  )
);

// Selectors
export const selectFilteredPantryItems = (state: AppState) => {
  let items = [...state.pantryItems];
  
  // Apply filter
  if (state.pantryFilter) {
    const filter = state.pantryFilter.toLowerCase();
    items = items.filter(item => 
      item.name.toLowerCase().includes(filter) ||
      item.brand?.toLowerCase().includes(filter) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(filter))
    );
  }
  
  // Apply sort
  items.sort((a, b) => {
    switch (state.pantrySort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'expiry':
        if (!a.expiresOn) return 1;
        if (!b.expiresOn) return -1;
        return new Date(a.expiresOn).getTime() - new Date(b.expiresOn).getTime();
      case 'quantity':
        return b.quantity - a.quantity;
      default:
        return 0;
    }
  });
  
  return items;
};

export const selectExpiringItems = (state: AppState, daysAhead: number = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
  
  return state.pantryItems.filter(item => {
    if (!item.expiresOn) return false;
    const expiryDate = new Date(item.expiresOn);
    return expiryDate <= cutoffDate && expiryDate >= new Date();
  });
};

export const selectPurchasedItemsCount = (state: AppState) => {
  if (!state.activeShoppingList) return 0;
  return state.activeShoppingList.items.filter(item => item.purchased).length;
};

export const selectShoppingProgress = (state: AppState) => {
  if (!state.activeShoppingList || state.activeShoppingList.items.length === 0) {
    return 0;
  }
  return (selectPurchasedItemsCount(state) / state.activeShoppingList.items.length) * 100;
};