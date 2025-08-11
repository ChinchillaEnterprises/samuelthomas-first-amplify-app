// Substitution engine for ingredients

import { SubstitutionMap } from '@/types';

export const commonSubstitutions: SubstitutionMap = {
  // Proteins
  'chicken breast': {
    alternatives: ['turkey breast', 'tofu', 'tempeh', 'chickpeas'],
    notes: 'For vegetarian options, use tofu or chickpeas'
  },
  'ground beef': {
    alternatives: ['ground turkey', 'ground chicken', 'lentils', 'black beans', 'mushrooms'],
    notes: 'Lentils and beans work well for vegetarian versions'
  },
  'bacon': {
    alternatives: ['turkey bacon', 'tempeh bacon', 'mushrooms', 'smoked paprika'],
    notes: 'Add smoked paprika for smoky flavor in vegetarian dishes'
  },
  
  // Dairy
  'milk': {
    alternatives: ['almond milk', 'soy milk', 'oat milk', 'coconut milk'],
    conversionFactor: 1,
    notes: 'Use unsweetened versions for savory dishes'
  },
  'butter': {
    alternatives: ['olive oil', 'coconut oil', 'vegan butter', 'applesauce'],
    conversionFactor: 0.75,
    notes: 'Use 3/4 cup oil for 1 cup butter'
  },
  'sour cream': {
    alternatives: ['greek yogurt', 'cottage cheese', 'cashew cream'],
    conversionFactor: 1
  },
  'heavy cream': {
    alternatives: ['coconut cream', 'cashew cream', 'silken tofu'],
    conversionFactor: 1
  },
  
  // Vegetables
  'fresh spinach': {
    alternatives: ['frozen spinach', 'kale', 'swiss chard', 'arugula'],
    conversionFactor: 0.2,
    notes: '1 cup fresh = 1/5 cup frozen'
  },
  'fresh herbs': {
    alternatives: ['dried herbs'],
    conversionFactor: 0.33,
    notes: 'Use 1/3 amount of dried herbs'
  },
  
  // Pantry staples
  'all-purpose flour': {
    alternatives: ['whole wheat flour', 'almond flour', 'coconut flour', 'gluten-free flour'],
    notes: 'Gluten-free options may need xanthan gum'
  },
  'white rice': {
    alternatives: ['brown rice', 'quinoa', 'cauliflower rice', 'bulgur'],
    notes: 'Adjust cooking times accordingly'
  },
  'pasta': {
    alternatives: ['whole wheat pasta', 'rice noodles', 'zucchini noodles', 'spaghetti squash'],
    notes: 'Vegetable noodles for low-carb options'
  },
  
  // Seasonings
  'salt': {
    alternatives: ['soy sauce', 'tamari', 'miso paste'],
    conversionFactor: 0.5,
    notes: 'Liquid alternatives add umami'
  },
  'sugar': {
    alternatives: ['honey', 'maple syrup', 'stevia', 'dates'],
    conversionFactor: 0.75,
    notes: 'Reduce liquid in recipe when using liquid sweeteners'
  }
};

export function findSubstitutions(
  ingredient: string,
  allergens: string[] = [],
  dietaryProfile?: string
): string[] {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  const substitution = commonSubstitutions[normalizedIngredient];
  
  if (!substitution) {
    return [];
  }
  
  let alternatives = [...substitution.alternatives];
  
  // Filter based on allergens
  if (allergens.length > 0) {
    alternatives = alternatives.filter(alt => {
      const altLower = alt.toLowerCase();
      return !allergens.some(allergen => 
        altLower.includes(allergen.toLowerCase())
      );
    });
  }
  
  // Filter based on dietary profile
  if (dietaryProfile) {
    alternatives = filterByDietaryProfile(alternatives, dietaryProfile);
  }
  
  return alternatives;
}

function filterByDietaryProfile(alternatives: string[], profile: string): string[] {
  switch (profile) {
    case 'vegan':
      return alternatives.filter(alt => {
        const nonVegan = ['milk', 'butter', 'cream', 'yogurt', 'cheese', 'egg', 'honey', 'meat', 'chicken', 'turkey', 'beef', 'pork', 'fish', 'bacon'];
        return !nonVegan.some(item => alt.toLowerCase().includes(item));
      });
    
    case 'vegetarian':
      return alternatives.filter(alt => {
        const nonVeg = ['meat', 'chicken', 'turkey', 'beef', 'pork', 'fish', 'bacon'];
        return !nonVeg.some(item => alt.toLowerCase().includes(item));
      });
    
    case 'keto':
      return alternatives.filter(alt => {
        const highCarb = ['rice', 'pasta', 'flour', 'sugar', 'honey', 'dates', 'beans', 'lentils'];
        return !highCarb.some(item => alt.toLowerCase().includes(item));
      });
    
    case 'paleo':
      return alternatives.filter(alt => {
        const nonPaleo = ['rice', 'pasta', 'flour', 'beans', 'lentils', 'tofu', 'soy'];
        return !nonPaleo.some(item => alt.toLowerCase().includes(item));
      });
    
    default:
      return alternatives;
  }
}

export function getConversionFactor(fromIngredient: string, toIngredient: string): number {
  const sub = commonSubstitutions[fromIngredient.toLowerCase()];
  if (!sub || !sub.conversionFactor) {
    return 1;
  }
  return sub.conversionFactor;
}