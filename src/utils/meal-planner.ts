// Meal planning algorithm

import { Recipe, MealPlanConstraints, MealPlanDay, NutritionInfo } from '@/types';
import { generateRecipes } from './recipe-generator';

interface MealPlanResult {
  days: MealPlanDay[];
  totalCost: number;
  avgNutritionPerDay: NutritionInfo;
  shoppingList: Map<string, { quantity: number; unit: string; estimatedPrice: number }>;
}

export function generateMealPlan(
  constraints: MealPlanConstraints,
  availableRecipes: Recipe[],
  pantryItems: any[],
  currentPrices: Map<string, number>,
  allergens: string[] = []
): MealPlanResult {
  const days: MealPlanDay[] = [];
  const usedRecipeIds = new Set<string>();
  const shoppingList = new Map<string, { quantity: number; unit: string; estimatedPrice: number }>();
  
  // Generate 7 days of meals
  for (let day = 0; day < 7; day++) {
    const dayPlan: MealPlanDay = {};
    
    // Generate breakfast
    const breakfastCandidates = generateRecipes(
      {
        ...constraints,
        requiredTags: [...(constraints.requiredTags || []), 'breakfast']
      },
      availableRecipes.filter(r => !usedRecipeIds.has(r.id)),
      pantryItems,
      currentPrices,
      allergens
    );
    
    if (breakfastCandidates.length > 0) {
      const breakfast = selectBestCandidate(breakfastCandidates, usedRecipeIds);
      dayPlan.breakfast = {
        recipeId: breakfast.id,
        servings: constraints.servingsPerMeal
      };
      usedRecipeIds.add(breakfast.id);
      updateShoppingList(shoppingList, breakfast, pantryItems, constraints.servingsPerMeal, currentPrices);
    }
    
    // Generate lunch
    const lunchCandidates = generateRecipes(
      {
        ...constraints,
        requiredTags: [...(constraints.requiredTags || []), 'lunch', 'main']
      },
      availableRecipes.filter(r => !usedRecipeIds.has(r.id)),
      pantryItems,
      currentPrices,
      allergens
    );
    
    if (lunchCandidates.length > 0) {
      const lunch = selectBestCandidate(lunchCandidates, usedRecipeIds);
      dayPlan.lunch = {
        recipeId: lunch.id,
        servings: constraints.servingsPerMeal
      };
      usedRecipeIds.add(lunch.id);
      updateShoppingList(shoppingList, lunch, pantryItems, constraints.servingsPerMeal, currentPrices);
    }
    
    // Generate dinner
    const dinnerCandidates = generateRecipes(
      {
        ...constraints,
        requiredTags: [...(constraints.requiredTags || []), 'dinner', 'main']
      },
      availableRecipes.filter(r => !usedRecipeIds.has(r.id)),
      pantryItems,
      currentPrices,
      allergens
    );
    
    if (dinnerCandidates.length > 0) {
      const dinner = selectBestCandidate(dinnerCandidates, usedRecipeIds);
      dayPlan.dinner = {
        recipeId: dinner.id,
        servings: constraints.servingsPerMeal
      };
      usedRecipeIds.add(dinner.id);
      updateShoppingList(shoppingList, dinner, pantryItems, constraints.servingsPerMeal, currentPrices);
    }
    
    days.push(dayPlan);
    
    // Allow recipe reuse after 3 days
    if (day >= 3) {
      const oldRecipes = [];
      for (const oldDay of days.slice(0, day - 2)) {
        if (oldDay.breakfast) oldRecipes.push(oldDay.breakfast.recipeId);
        if (oldDay.lunch) oldRecipes.push(oldDay.lunch.recipeId);
        if (oldDay.dinner) oldRecipes.push(oldDay.dinner.recipeId);
      }
      oldRecipes.forEach(id => usedRecipeIds.delete(id));
    }
  }
  
  // Calculate totals
  const { totalCost, avgNutrition } = calculateMealPlanTotals(days, availableRecipes, constraints.servingsPerMeal);
  
  return {
    days,
    totalCost,
    avgNutritionPerDay: avgNutrition,
    shoppingList
  };
}

function selectBestCandidate(candidates: any[], usedRecipeIds: Set<string>): any {
  // Prefer variety - penalize recently used recipes
  const scoredCandidates = candidates.map(candidate => {
    let score = candidate.finalScore;
    
    // Variety bonus for different cuisines
    if (candidate.cuisine) {
      score += 5;
    }
    
    // Prefer recipes with fewer missing items for meal planning
    if (candidate.pantryFitScore.missingItems.length <= 2) {
      score += 10;
    }
    
    return { ...candidate, adjustedScore: score };
  });
  
  scoredCandidates.sort((a, b) => b.adjustedScore - a.adjustedScore);
  return scoredCandidates[0];
}

function updateShoppingList(
  shoppingList: Map<string, { quantity: number; unit: string; estimatedPrice: number }>,
  recipe: any,
  pantryItems: any[],
  servings: number,
  currentPrices: Map<string, number>
) {
  const pantryMap = new Map(pantryItems.map(item => [item.name.toLowerCase(), item]));
  
  recipe.ingredients.forEach((ingredient: any) => {
    const needed = ingredient.quantity * servings;
    const inPantry = pantryMap.get(ingredient.name.toLowerCase());
    
    let toBuy = needed;
    if (inPantry && inPantry.unit === ingredient.unit) {
      toBuy = Math.max(0, needed - inPantry.quantity);
    }
    
    if (toBuy > 0) {
      const key = `${ingredient.name}_${ingredient.unit}`;
      const existing = shoppingList.get(key) || { quantity: 0, unit: ingredient.unit, estimatedPrice: 0 };
      const price = currentPrices.get(ingredient.name.toLowerCase()) || 2.0;
      
      shoppingList.set(key, {
        quantity: existing.quantity + toBuy,
        unit: ingredient.unit,
        estimatedPrice: existing.estimatedPrice + (toBuy * price)
      });
    }
  });
}

function calculateMealPlanTotals(
  days: MealPlanDay[],
  recipes: Recipe[],
  servingsPerMeal: number
): { totalCost: number; avgNutrition: NutritionInfo } {
  const recipeMap = new Map(recipes.map(r => [r.id, r]));
  let totalCost = 0;
  let totalNutrition = { kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0 };
  let mealCount = 0;
  
  days.forEach(day => {
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const meal = day[mealType as keyof MealPlanDay];
      if (meal) {
        const recipe = recipeMap.get(meal.recipeId);
        if (recipe) {
          totalCost += recipe.estimatedCostPerServing * meal.servings;
          totalNutrition.kcal += recipe.nutritionPerServing.kcal * meal.servings;
          totalNutrition.protein_g += recipe.nutritionPerServing.protein_g * meal.servings;
          totalNutrition.carb_g += recipe.nutritionPerServing.carb_g * meal.servings;
          totalNutrition.fat_g += recipe.nutritionPerServing.fat_g * meal.servings;
          mealCount++;
        }
      }
    });
  });
  
  const avgNutrition = mealCount > 0 ? {
    kcal: totalNutrition.kcal / 7,
    protein_g: totalNutrition.protein_g / 7,
    carb_g: totalNutrition.carb_g / 7,
    fat_g: totalNutrition.fat_g / 7
  } : { kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0 };
  
  return { totalCost, avgNutrition };
}