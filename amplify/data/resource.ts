import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // User entity with dietary preferences and location
  User: a
    .model({
      email: a.email().required(),
      name: a.string().required(),
      location: a.json().required(), // {city: string, lat: number, lon: number}
      dietaryPreferences: a.string().array(),
      allergenList: a.string().array(),
      defaultBudgetPerServing: a.float().default(5.0),
      householdSize: a.integer().default(2),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => allow.owner()),

  // Pantry items tracking
  PantryItem: a
    .model({
      userId: a.id().required(),
      name: a.string().required(),
      brand: a.string(),
      quantity: a.float().required(),
      unit: a.string().required(),
      expiresOn: a.date(),
      tags: a.string().array(),
      nutritionEstimate: a.json(), // {kcal, protein_g, carb_g, fat_g per unit}
      source: a.string(), // 'manual', 'receipt', 'generated'
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => allow.owner()),

  // Recipe database
  Recipe: a
    .model({
      title: a.string().required(),
      steps: a.string().array().required(),
      ingredients: a.json().required(), // Array of {name, quantity, unit, optional, tags, substitutions[]}
      nutritionPerServing: a.json().required(), // {kcal, protein_g, carb_g, fat_g}
      servings: a.integer().required(),
      cuisine: a.string(),
      difficulty: a.string().required(), // 'easy', 'medium', 'hard'
      estimatedCostPerServing: a.float().required(),
      popularityScore: a.float().default(0),
      prepTimeMinutes: a.integer(),
      cookTimeMinutes: a.integer(),
      tags: a.string().array(),
      imageUrl: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated().to(['read']), allow.owner().to(['create', 'update', 'delete'])]),

  // Store information
  Store: a
    .model({
      name: a.string().required(),
      location: a.json().required(), // {lat, lon, address}
      hours: a.json().required(), // {monday: {open, close}, ...}
      deliveryOptions: a.json(), // {available: boolean, fee: number, minimum: number}
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated().to(['read']), allow.owner().to(['create', 'update', 'delete'])]),

  // Sale items at stores
  Sale: a
    .model({
      storeId: a.id().required(),
      itemName: a.string().required(),
      price: a.float().required(),
      unit: a.string().required(),
      validFrom: a.datetime().required(),
      validTo: a.datetime().required(),
      tags: a.string().array(),
      confidence: a.float().default(1.0),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated().to(['read']), allow.owner().to(['create', 'update', 'delete'])]),

  // Receipt scanning results
  Receipt: a
    .model({
      userId: a.id().required(),
      storeId: a.id(),
      date: a.datetime().required(),
      total: a.float().required(),
      rawText: a.string(),
      parsedItems: a.json().required(), // Array of {name, quantity, unit, price}
      status: a.string().required(), // 'pending', 'processed', 'failed'
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => allow.owner()),

  // Weekly meal plans
  MealPlan: a
    .model({
      userId: a.id().required(),
      startDate: a.date().required(),
      days: a.json().required(), // Array[7] of {breakfast, lunch, dinner} with recipe IDs and servings
      totalCost: a.float(),
      avgNutritionPerDay: a.json(), // {kcal, protein_g, carb_g, fat_g}
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => allow.owner()),

  // Shopping lists
  ShoppingList: a
    .model({
      userId: a.id().required(),
      planId: a.id(),
      items: a.json().required(), // Array of {name, quantity, unit, preferredStoreId, estimatedPrice, purchased}
      totalEstimatedCost: a.float(),
      status: a.string().default('active'), // 'active', 'completed', 'abandoned'
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => allow.owner()),

  // User preferences
  Preferences: a
    .model({
      userId: a.id().required(),
      dietaryProfile: a.string(), // 'vegan', 'vegetarian', 'keto', 'paleo', 'none'
      allergens: a.string().array(),
      dislikedIngredients: a.string().array(),
      cuisineLikes: a.string().array(),
      costTargetMin: a.float().default(2.0),
      costTargetMax: a.float().default(10.0),
      nutritionGoals: a.json(), // {minProtein, maxCarbs, etc}
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => allow.owner()),

  // Analytics events
  AnalyticsEvent: a
    .model({
      userId: a.id(),
      eventType: a.string().required(), // 'recipe_generated', 'mealplan_created', etc
      eventData: a.json(),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated().to(['create']), allow.owner().to(['read'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});