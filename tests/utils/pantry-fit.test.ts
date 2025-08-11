import { calculatePantryFitScore } from '@/utils/pantry-fit';
import { Ingredient } from '@/types';

describe('calculatePantryFitScore', () => {
  const mockPrices = new Map([
    ['milk', 3.00],
    ['eggs', 2.50],
    ['flour', 1.50],
    ['sugar', 2.00],
    ['butter', 4.00],
  ]);

  it('should return 100% satisfaction when all ingredients are in pantry', () => {
    const recipeIngredients: Ingredient[] = [
      { name: 'Milk', quantity: 1, unit: 'cup' },
      { name: 'Eggs', quantity: 2, unit: 'items' },
    ];

    const pantryItems = [
      { name: 'Milk', quantity: 4, unit: 'cup' },
      { name: 'Eggs', quantity: 12, unit: 'items' },
    ];

    const result = calculatePantryFitScore(
      recipeIngredients,
      pantryItems,
      mockPrices
    );

    expect(result.percentSatisfied).toBe(100);
    expect(result.missingItems).toHaveLength(0);
    expect(result.estimatedExtraCost).toBe(0);
    expect(result.totalScore).toBeGreaterThan(90);
  });

  it('should identify missing items correctly', () => {
    const recipeIngredients: Ingredient[] = [
      { name: 'Milk', quantity: 1, unit: 'cup' },
      { name: 'Chocolate', quantity: 100, unit: 'g' },
    ];

    const pantryItems = [
      { name: 'Milk', quantity: 4, unit: 'cup' },
    ];

    const result = calculatePantryFitScore(
      recipeIngredients,
      pantryItems,
      mockPrices
    );

    expect(result.percentSatisfied).toBe(50);
    expect(result.missingItems).toContain('Chocolate');
    expect(result.estimatedExtraCost).toBeGreaterThan(0);
  });

  it('should handle optional ingredients', () => {
    const recipeIngredients: Ingredient[] = [
      { name: 'Flour', quantity: 2, unit: 'cup' },
      { name: 'Chocolate Chips', quantity: 1, unit: 'cup', optional: true },
    ];

    const pantryItems = [
      { name: 'Flour', quantity: 5, unit: 'cup' },
    ];

    const result = calculatePantryFitScore(
      recipeIngredients,
      pantryItems,
      mockPrices
    );

    expect(result.percentSatisfied).toBe(100);
    expect(result.missingItems).not.toContain('Chocolate Chips');
  });

  it('should find substitutions based on dietary profile', () => {
    const recipeIngredients: Ingredient[] = [
      { name: 'Milk', quantity: 1, unit: 'cup', substitutions: ['Almond Milk', 'Soy Milk'] },
    ];

    const pantryItems = [
      { name: 'Almond Milk', quantity: 2, unit: 'cup' },
    ];

    const result = calculatePantryFitScore(
      recipeIngredients,
      pantryItems,
      mockPrices,
      [],
      'vegan'
    );

    expect(result.percentSatisfied).toBe(100);
    expect(result.substitutionOptions['Milk']).toContain('Almond Milk');
  });

  it('should handle insufficient quantities', () => {
    const recipeIngredients: Ingredient[] = [
      { name: 'Flour', quantity: 5, unit: 'cup' },
    ];

    const pantryItems = [
      { name: 'Flour', quantity: 2, unit: 'cup' },
    ];

    const result = calculatePantryFitScore(
      recipeIngredients,
      pantryItems,
      mockPrices
    );

    expect(result.percentSatisfied).toBe(0);
    expect(result.missingItems).toContain('Flour');
  });

  it('should convert units when comparing quantities', () => {
    const recipeIngredients: Ingredient[] = [
      { name: 'Butter', quantity: 4, unit: 'tbsp' },
    ];

    const pantryItems = [
      { name: 'Butter', quantity: 1, unit: 'cup' }, // 1 cup = 16 tbsp
    ];

    const result = calculatePantryFitScore(
      recipeIngredients,
      pantryItems,
      mockPrices
    );

    expect(result.percentSatisfied).toBe(100);
    expect(result.missingItems).toHaveLength(0);
  });

  it('should filter substitutions by allergens', () => {
    const recipeIngredients: Ingredient[] = [
      { name: 'Flour', quantity: 2, unit: 'cup', substitutions: ['Almond Flour', 'Coconut Flour'] },
    ];

    const pantryItems = [
      { name: 'Almond Flour', quantity: 3, unit: 'cup' },
    ];

    const result = calculatePantryFitScore(
      recipeIngredients,
      pantryItems,
      mockPrices,
      ['nuts']
    );

    expect(result.percentSatisfied).toBe(0);
    expect(result.missingItems).toContain('Flour');
    expect(result.substitutionOptions['Flour']).not.toContain('Almond Flour');
  });
});