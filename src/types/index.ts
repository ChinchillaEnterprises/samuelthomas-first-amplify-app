// Core type definitions for ContextChef

export interface Location {
  city: string;
  lat: number;
  lon: number;
}

export interface NutritionInfo {
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
  tags?: string[];
  substitutions?: string[];
}

export interface ParsedReceiptItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface ShoppingListItem {
  name: string;
  quantity: number;
  unit: string;
  preferredStoreId?: string;
  estimatedPrice: number;
  purchased: boolean;
}

export interface MealPlanDay {
  breakfast?: { recipeId: string; servings: number };
  lunch?: { recipeId: string; servings: number };
  dinner?: { recipeId: string; servings: number };
}

export interface StoreHours {
  open: string;
  close: string;
}

export interface DeliveryOptions {
  available: boolean;
  fee: number;
  minimum: number;
}

export interface NutritionGoals {
  minProtein?: number;
  maxCarbs?: number;
  minFiber?: number;
  maxSodium?: number;
}

export interface RecipeGenerationConstraints {
  maxPricePerServing: number;
  requiredTags?: string[];
  excludeIngredients?: string[];
  availablePantry?: string[];
  dietaryProfile?: string;
}

export interface MealPlanConstraints extends RecipeGenerationConstraints {
  weekStart: string;
  servingsPerMeal: number;
}

export interface PantryFitScore {
  totalScore: number;
  percentSatisfied: number;
  missingItems: string[];
  substitutionOptions: Record<string, string[]>;
  estimatedExtraCost: number;
}

export type DietaryProfile = 'vegan' | 'vegetarian' | 'keto' | 'paleo' | 'none';
export type RecipeDifficulty = 'easy' | 'medium' | 'hard';
export type ReceiptStatus = 'pending' | 'processed' | 'failed';
export type ShoppingListStatus = 'active' | 'completed' | 'abandoned';

export interface SubstitutionMap {
  [key: string]: {
    alternatives: string[];
    conversionFactor?: number;
    notes?: string;
  };
}