// Pantry fit scoring algorithm

import { Ingredient, PantryFitScore } from '@/types';
import { findSubstitutions } from './substitutions';

interface PantryItem {
  name: string;
  quantity: number;
  unit: string;
}

export function calculatePantryFitScore(
  recipeIngredients: Ingredient[],
  pantryItems: PantryItem[],
  currentPrices: Map<string, number>,
  allergens: string[] = [],
  dietaryProfile?: string
): PantryFitScore {
  const pantryMap = new Map<string, PantryItem>();
  pantryItems.forEach(item => {
    pantryMap.set(item.name.toLowerCase(), item);
  });

  let satisfiedCount = 0;
  let totalRequired = 0;
  const missingItems: string[] = [];
  const substitutionOptions: Record<string, string[]> = {};
  let estimatedExtraCost = 0;

  for (const ingredient of recipeIngredients) {
    if (ingredient.optional) continue;
    
    totalRequired++;
    const normalizedName = ingredient.name.toLowerCase();
    const pantryItem = pantryMap.get(normalizedName);

    if (pantryItem && isQuantitySufficient(pantryItem, ingredient)) {
      satisfiedCount++;
    } else {
      // Check for substitutions
      const substitutes = findSubstitutions(ingredient.name, allergens, dietaryProfile);
      let foundSubstitute = false;

      for (const sub of substitutes) {
        const subItem = pantryMap.get(sub.toLowerCase());
        if (subItem && isQuantitySufficient(subItem, ingredient)) {
          satisfiedCount++;
          foundSubstitute = true;
          if (!substitutionOptions[ingredient.name]) {
            substitutionOptions[ingredient.name] = [];
          }
          substitutionOptions[ingredient.name].push(sub);
          break;
        }
      }

      if (!foundSubstitute) {
        missingItems.push(ingredient.name);
        // Estimate cost for missing item
        const price = currentPrices.get(normalizedName) || estimatePrice(ingredient);
        estimatedExtraCost += price * ingredient.quantity;
      }
    }
  }

  const percentSatisfied = totalRequired > 0 ? (satisfiedCount / totalRequired) * 100 : 0;
  
  // Calculate composite score (0-100)
  const satisfactionScore = percentSatisfied * 0.6; // 60% weight
  const costScore = Math.max(0, 100 - estimatedExtraCost * 10) * 0.3; // 30% weight
  const substitutionScore = (Object.keys(substitutionOptions).length / Math.max(missingItems.length, 1)) * 100 * 0.1; // 10% weight
  
  const totalScore = Math.round(satisfactionScore + costScore + substitutionScore);

  return {
    totalScore,
    percentSatisfied: Math.round(percentSatisfied),
    missingItems,
    substitutionOptions,
    estimatedExtraCost: Math.round(estimatedExtraCost * 100) / 100
  };
}

function isQuantitySufficient(pantryItem: PantryItem, required: Ingredient): boolean {
  // Simple unit conversion for common cases
  const conversions: Record<string, Record<string, number>> = {
    'cup': { 'tbsp': 16, 'tsp': 48, 'ml': 237, 'l': 0.237 },
    'tbsp': { 'tsp': 3, 'ml': 15, 'cup': 0.0625 },
    'tsp': { 'ml': 5, 'tbsp': 0.333, 'cup': 0.0208 },
    'lb': { 'oz': 16, 'g': 453.6, 'kg': 0.4536 },
    'oz': { 'g': 28.35, 'lb': 0.0625, 'kg': 0.0283 },
    'kg': { 'g': 1000, 'lb': 2.205, 'oz': 35.27 },
    'g': { 'kg': 0.001, 'oz': 0.0353, 'lb': 0.0022 }
  };

  let pantryQuantity = pantryItem.quantity;
  let requiredQuantity = required.quantity;

  // Convert units if different
  if (pantryItem.unit !== required.unit) {
    const conversion = conversions[pantryItem.unit]?.[required.unit];
    if (conversion) {
      pantryQuantity = pantryQuantity * conversion;
    } else {
      // If we can't convert, assume insufficient
      return false;
    }
  }

  return pantryQuantity >= requiredQuantity;
}

function estimatePrice(ingredient: Ingredient): number {
  // Basic price estimation based on ingredient type
  const priceEstimates: Record<string, number> = {
    // Proteins (per lb)
    'meat': 5.00,
    'chicken': 3.00,
    'fish': 8.00,
    'tofu': 2.50,
    
    // Dairy (per unit)
    'milk': 3.00,
    'cheese': 4.00,
    'yogurt': 2.00,
    
    // Produce (per lb)
    'vegetable': 2.00,
    'fruit': 2.50,
    
    // Pantry (per unit)
    'grain': 1.50,
    'spice': 3.00,
    'oil': 4.00,
    
    // Default
    'default': 2.00
  };

  // Try to categorize the ingredient
  const name = ingredient.name.toLowerCase();
  for (const [category, price] of Object.entries(priceEstimates)) {
    if (name.includes(category) || ingredient.tags?.includes(category)) {
      return price;
    }
  }

  return priceEstimates.default;
}