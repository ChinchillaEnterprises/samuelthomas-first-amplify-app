// Recipe generation and ranking logic

import { Recipe, RecipeGenerationConstraints, PantryFitScore } from '@/types';
import { calculatePantryFitScore } from './pantry-fit';

interface RecipeCandidate extends Recipe {
  pantryFitScore: PantryFitScore;
  relevanceScore: number;
  finalScore: number;
}

export function generateRecipes(
  constraints: RecipeGenerationConstraints,
  availableRecipes: Recipe[],
  pantryItems: any[],
  currentPrices: Map<string, number>,
  allergens: string[] = []
): RecipeCandidate[] {
  // Filter recipes based on constraints
  let candidates = availableRecipes.filter(recipe => {
    // Price constraint
    if (recipe.estimatedCostPerServing > constraints.maxPricePerServing) {
      return false;
    }

    // Dietary profile
    if (constraints.dietaryProfile) {
      if (!isRecipeSuitableForDiet(recipe, constraints.dietaryProfile)) {
        return false;
      }
    }

    // Excluded ingredients
    if (constraints.excludeIngredients && constraints.excludeIngredients.length > 0) {
      const hasExcluded = recipe.ingredients.some(ing => 
        constraints.excludeIngredients!.some(excluded => 
          ing.name.toLowerCase().includes(excluded.toLowerCase())
        )
      );
      if (hasExcluded) return false;
    }

    // Required tags
    if (constraints.requiredTags && constraints.requiredTags.length > 0) {
      const hasAllTags = constraints.requiredTags.every(tag =>
        recipe.tags?.includes(tag)
      );
      if (!hasAllTags) return false;
    }

    return true;
  });

  // Score and rank recipes
  const scoredCandidates: RecipeCandidate[] = candidates.map(recipe => {
    // Calculate pantry fit score
    const pantryFitScore = calculatePantryFitScore(
      recipe.ingredients,
      pantryItems,
      currentPrices,
      allergens,
      constraints.dietaryProfile
    );

    // Calculate relevance score based on multiple factors
    const relevanceScore = calculateRelevanceScore(recipe, constraints, pantryFitScore);

    // Final score combines pantry fit and relevance
    const finalScore = (pantryFitScore.totalScore * 0.6) + (relevanceScore * 0.4);

    return {
      ...recipe,
      pantryFitScore,
      relevanceScore,
      finalScore
    };
  });

  // Sort by final score (highest first)
  scoredCandidates.sort((a, b) => b.finalScore - a.finalScore);

  // Return top candidates with reasoning
  return scoredCandidates.slice(0, 10);
}

function isRecipeSuitableForDiet(recipe: Recipe, dietaryProfile: string): boolean {
  const ingredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase());
  
  switch (dietaryProfile) {
    case 'vegan':
      const nonVeganIngredients = ['meat', 'chicken', 'beef', 'pork', 'fish', 'egg', 'milk', 'cheese', 'butter', 'cream', 'honey'];
      return !ingredientNames.some(name => 
        nonVeganIngredients.some(nonVegan => name.includes(nonVegan))
      );

    case 'vegetarian':
      const nonVegIngredients = ['meat', 'chicken', 'beef', 'pork', 'fish', 'bacon', 'ham'];
      return !ingredientNames.some(name => 
        nonVegIngredients.some(nonVeg => name.includes(nonVeg))
      );

    case 'keto':
      // Check if low carb (less than 10g per serving)
      return recipe.nutritionPerServing.carb_g < 10;

    case 'paleo':
      const nonPaleoIngredients = ['grain', 'wheat', 'bread', 'pasta', 'rice', 'bean', 'legume', 'dairy', 'milk', 'cheese'];
      return !ingredientNames.some(name => 
        nonPaleoIngredients.some(nonPaleo => name.includes(nonPaleo))
      );

    default:
      return true;
  }
}

function calculateRelevanceScore(
  recipe: Recipe,
  constraints: RecipeGenerationConstraints,
  pantryFitScore: PantryFitScore
): number {
  let score = 50; // Base score

  // Popularity bonus
  score += Math.min(recipe.popularityScore * 10, 20);

  // Price advantage (cheaper is better)
  const priceRatio = recipe.estimatedCostPerServing / constraints.maxPricePerServing;
  score += (1 - priceRatio) * 20;

  // Difficulty penalty (easier is better for everyday cooking)
  if (recipe.difficulty === 'easy') score += 10;
  if (recipe.difficulty === 'hard') score -= 10;

  // Quick recipes bonus
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  if (totalTime <= 30) score += 15;
  else if (totalTime <= 45) score += 10;
  else if (totalTime > 90) score -= 10;

  // Nutrition bonus
  const nutrition = recipe.nutritionPerServing;
  if (nutrition.protein_g >= 20) score += 5;
  if (nutrition.kcal >= 300 && nutrition.kcal <= 600) score += 5;

  // Few missing items bonus
  if (pantryFitScore.missingItems.length <= 2) score += 10;
  else if (pantryFitScore.missingItems.length <= 4) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function explainRecipeChoice(candidate: RecipeCandidate): string {
  const reasons = [];

  // Pantry fit
  if (candidate.pantryFitScore.percentSatisfied >= 80) {
    reasons.push(`You have ${candidate.pantryFitScore.percentSatisfied}% of ingredients`);
  } else if (candidate.pantryFitScore.percentSatisfied >= 50) {
    reasons.push(`You have most ingredients (${candidate.pantryFitScore.percentSatisfied}%)`);
  }

  // Missing items
  if (candidate.pantryFitScore.missingItems.length > 0) {
    const missing = candidate.pantryFitScore.missingItems.slice(0, 3).join(', ');
    reasons.push(`Only need: ${missing}`);
  }

  // Cost
  if (candidate.estimatedCostPerServing <= 3) {
    reasons.push('Very budget-friendly');
  }

  // Time
  const totalTime = (candidate.prepTimeMinutes || 0) + (candidate.cookTimeMinutes || 0);
  if (totalTime <= 30) {
    reasons.push('Quick to make');
  }

  // Nutrition
  if (candidate.nutritionPerServing.protein_g >= 20) {
    reasons.push('High protein');
  }

  return reasons.join(' • ');
}