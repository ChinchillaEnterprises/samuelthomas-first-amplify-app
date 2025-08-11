// Budget optimization for recipes and meal plans

import { Ingredient, NutritionInfo } from '@/types';

interface StorePrice {
  storeId: string;
  itemName: string;
  price: number;
  unit: string;
  onSale: boolean;
}

interface OptimizationResult {
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    storeId: string;
    price: number;
    substituted?: boolean;
    originalName?: string;
  }>;
  totalCost: number;
  nutritionInfo: NutritionInfo;
  meetsNutritionGoals: boolean;
}

export function optimizeRecipeForBudget(
  ingredients: Ingredient[],
  targetCostPerServing: number,
  servings: number,
  storePrices: StorePrice[],
  nutritionData: Map<string, NutritionInfo>,
  minProteinPerServing: number = 15,
  minFiberPerServing: number = 5
): OptimizationResult {
  const targetTotalCost = targetCostPerServing * servings;
  
  // Create price map for quick lookup
  const priceMap = new Map<string, StorePrice[]>();
  storePrices.forEach(sp => {
    const key = sp.itemName.toLowerCase();
    if (!priceMap.has(key)) {
      priceMap.set(key, []);
    }
    priceMap.get(key)!.push(sp);
  });

  // Start with original ingredients
  let optimizedIngredients = ingredients.map(ing => {
    const prices = priceMap.get(ing.name.toLowerCase()) || [];
    const bestPrice = findBestPrice(prices, ing.quantity, ing.unit);
    
    return {
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      storeId: bestPrice?.storeId || 'unknown',
      price: bestPrice?.totalPrice || estimateDefaultPrice(ing),
      substituted: false
    };
  });

  let totalCost = optimizedIngredients.reduce((sum, ing) => sum + ing.price, 0);
  let nutrition = calculateNutrition(optimizedIngredients, nutritionData, servings);

  // If under budget and meets nutrition, we're done
  if (totalCost <= targetTotalCost && meetsNutritionRequirements(nutrition, minProteinPerServing, minFiberPerServing)) {
    return {
      ingredients: optimizedIngredients,
      totalCost,
      nutritionInfo: nutrition,
      meetsNutritionGoals: true
    };
  }

  // Try substitutions if over budget
  if (totalCost > targetTotalCost) {
    optimizedIngredients = attemptSubstitutions(
      optimizedIngredients,
      ingredients,
      priceMap,
      nutritionData,
      targetTotalCost,
      servings,
      minProteinPerServing,
      minFiberPerServing
    );
    
    totalCost = optimizedIngredients.reduce((sum, ing) => sum + ing.price, 0);
    nutrition = calculateNutrition(optimizedIngredients, nutritionData, servings);
  }

  return {
    ingredients: optimizedIngredients,
    totalCost,
    nutritionInfo: nutrition,
    meetsNutritionGoals: meetsNutritionRequirements(nutrition, minProteinPerServing, minFiberPerServing)
  };
}

function findBestPrice(prices: StorePrice[], quantity: number, unit: string): { storeId: string; totalPrice: number } | null {
  if (prices.length === 0) return null;

  // Sort by unit price, prioritizing sale items
  const sortedPrices = prices.sort((a, b) => {
    const aUnitPrice = a.price / (a.onSale ? 0.9 : 1); // Give 10% preference to sale items
    const bUnitPrice = b.price / (b.onSale ? 0.9 : 1);
    return aUnitPrice - bUnitPrice;
  });

  const bestPrice = sortedPrices[0];
  const convertedQuantity = convertUnits(quantity, unit, bestPrice.unit);
  
  return {
    storeId: bestPrice.storeId,
    totalPrice: bestPrice.price * convertedQuantity
  };
}

function attemptSubstitutions(
  ingredients: any[],
  originalIngredients: Ingredient[],
  priceMap: Map<string, StorePrice[]>,
  nutritionData: Map<string, NutritionInfo>,
  targetCost: number,
  servings: number,
  minProtein: number,
  minFiber: number
): any[] {
  // Sort ingredients by price (most expensive first)
  const sortedIngredients = [...ingredients].sort((a, b) => b.price - a.price);
  
  for (let i = 0; i < sortedIngredients.length; i++) {
    const ing = sortedIngredients[i];
    const original = originalIngredients.find(o => o.name === ing.name);
    if (!original || !original.substitutions) continue;

    // Try each substitution
    for (const sub of original.substitutions) {
      const subPrices = priceMap.get(sub.toLowerCase()) || [];
      const bestSubPrice = findBestPrice(subPrices, ing.quantity, ing.unit);
      
      if (bestSubPrice && bestSubPrice.totalPrice < ing.price) {
        // Check if substitution maintains nutrition requirements
        const testIngredients = [...sortedIngredients];
        testIngredients[i] = {
          ...ing,
          name: sub,
          price: bestSubPrice.totalPrice,
          storeId: bestSubPrice.storeId,
          substituted: true,
          originalName: ing.name
        };
        
        const testNutrition = calculateNutrition(testIngredients, nutritionData, servings);
        const testCost = testIngredients.reduce((sum, item) => sum + item.price, 0);
        
        if (meetsNutritionRequirements(testNutrition, minProtein, minFiber)) {
          sortedIngredients[i] = testIngredients[i];
          
          // Check if we've reached target
          if (testCost <= targetCost) {
            return sortedIngredients;
          }
          break; // Move to next ingredient
        }
      }
    }
  }
  
  return sortedIngredients;
}

function calculateNutrition(
  ingredients: any[],
  nutritionData: Map<string, NutritionInfo>,
  servings: number
): NutritionInfo {
  const totals = {
    kcal: 0,
    protein_g: 0,
    carb_g: 0,
    fat_g: 0
  };

  ingredients.forEach(ing => {
    const nutrition = nutritionData.get(ing.name.toLowerCase()) || estimateNutrition(ing.name);
    const factor = ing.quantity; // Simplified - would need unit conversion in production
    
    totals.kcal += nutrition.kcal * factor;
    totals.protein_g += nutrition.protein_g * factor;
    totals.carb_g += nutrition.carb_g * factor;
    totals.fat_g += nutrition.fat_g * factor;
  });

  // Return per serving
  return {
    kcal: totals.kcal / servings,
    protein_g: totals.protein_g / servings,
    carb_g: totals.carb_g / servings,
    fat_g: totals.fat_g / servings
  };
}

function meetsNutritionRequirements(
  nutrition: NutritionInfo,
  minProtein: number,
  minFiber: number
): boolean {
  return nutrition.protein_g >= minProtein;
}

function convertUnits(quantity: number, fromUnit: string, toUnit: string): number {
  // Simplified unit conversion
  if (fromUnit === toUnit) return quantity;
  
  const conversions: Record<string, Record<string, number>> = {
    'cup': { 'tbsp': 16, 'tsp': 48 },
    'lb': { 'oz': 16 },
    'kg': { 'g': 1000 }
  };
  
  const factor = conversions[fromUnit]?.[toUnit];
  return factor ? quantity * factor : quantity;
}

function estimateDefaultPrice(ingredient: Ingredient): number {
  // Basic price estimation
  const basePrice = 2.0;
  return basePrice * ingredient.quantity;
}

function estimateNutrition(ingredientName: string): NutritionInfo {
  // Basic nutrition estimation
  return {
    kcal: 100,
    protein_g: 5,
    carb_g: 15,
    fat_g: 3
  };
}