import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import outputs from '../amplify_outputs.json';
import { Schema } from '../src/amplify/data/resource';

// Configure Amplify
Amplify.configure(outputs);

const client = generateClient<Schema>();

// Sample data
const DEMO_USERS = [
  {
    email: 'alice@example.com',
    name: 'Alice Johnson',
    location: { city: 'Carmel', state: 'NY', lat: 41.4301, lon: -73.6802 },
    dietaryPreferences: [],
    allergenList: ['peanuts'],
    defaultBudgetPerServing: 5.0,
    householdSize: 4,
  },
  {
    email: 'bob@example.com',
    name: 'Bob Smith',
    location: { city: 'Brewster', state: 'NY', lat: 41.3943, lon: -73.6187 },
    dietaryPreferences: ['vegetarian'],
    allergenList: ['dairy'],
    defaultBudgetPerServing: 4.0,
    householdSize: 2,
  },
  {
    email: 'carol@example.com',
    name: 'Carol Davis',
    location: { city: 'Mahopac', state: 'NY', lat: 41.3718, lon: -73.7385 },
    dietaryPreferences: ['keto'],
    allergenList: [],
    defaultBudgetPerServing: 7.0,
    householdSize: 1,
  },
];

const RECIPES = [
  {
    title: 'Classic Spaghetti Carbonara',
    steps: [
      'Cook spaghetti according to package directions',
      'Fry bacon until crispy, reserve fat',
      'Beat eggs with parmesan cheese',
      'Toss hot pasta with bacon fat',
      'Remove from heat, add egg mixture',
      'Serve immediately with extra parmesan'
    ],
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g', optional: false, tags: ['pasta'] },
      { name: 'Bacon', quantity: 200, unit: 'g', optional: false, tags: ['meat'], substitutions: ['Pancetta', 'Guanciale'] },
      { name: 'Eggs', quantity: 4, unit: 'items', optional: false, tags: ['protein'] },
      { name: 'Parmesan Cheese', quantity: 100, unit: 'g', optional: false, tags: ['dairy'] },
      { name: 'Black Pepper', quantity: 1, unit: 'tsp', optional: false, tags: ['spice'] },
      { name: 'Salt', quantity: 1, unit: 'tsp', optional: false, tags: ['seasoning'] }
    ],
    nutritionPerServing: { kcal: 520, protein_g: 25, carb_g: 45, fat_g: 28 },
    servings: 4,
    cuisine: 'Italian',
    difficulty: 'easy',
    estimatedCostPerServing: 3.50,
    popularityScore: 9.2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    tags: ['dinner', 'pasta', 'quick', 'italian'],
  },
  {
    title: 'Vegetable Stir Fry',
    steps: [
      'Heat oil in wok or large skillet',
      'Add garlic and ginger, stir fry 30 seconds',
      'Add hard vegetables first (carrots, broccoli)',
      'Add softer vegetables (bell peppers, snap peas)',
      'Add sauce and toss to coat',
      'Serve over rice'
    ],
    ingredients: [
      { name: 'Mixed Vegetables', quantity: 500, unit: 'g', optional: false, tags: ['vegetable'] },
      { name: 'Soy Sauce', quantity: 3, unit: 'tbsp', optional: false, tags: ['sauce'] },
      { name: 'Sesame Oil', quantity: 2, unit: 'tbsp', optional: false, tags: ['oil'] },
      { name: 'Garlic', quantity: 3, unit: 'cloves', optional: false, tags: ['aromatic'] },
      { name: 'Ginger', quantity: 1, unit: 'tbsp', optional: false, tags: ['aromatic'] },
      { name: 'Rice', quantity: 2, unit: 'cups', optional: false, tags: ['grain'] }
    ],
    nutritionPerServing: { kcal: 320, protein_g: 8, carb_g: 52, fat_g: 10 },
    servings: 4,
    cuisine: 'Chinese',
    difficulty: 'easy',
    estimatedCostPerServing: 2.75,
    popularityScore: 8.5,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    tags: ['dinner', 'vegetarian', 'vegan', 'quick', 'healthy'],
  },
  {
    title: 'Chicken Caesar Salad',
    steps: [
      'Season and grill chicken breast',
      'Prepare Caesar dressing',
      'Toss romaine lettuce with dressing',
      'Add croutons and parmesan',
      'Top with sliced chicken',
      'Garnish with lemon wedges'
    ],
    ingredients: [
      { name: 'Chicken Breast', quantity: 400, unit: 'g', optional: false, tags: ['protein', 'meat'] },
      { name: 'Romaine Lettuce', quantity: 2, unit: 'heads', optional: false, tags: ['vegetable'] },
      { name: 'Caesar Dressing', quantity: 150, unit: 'ml', optional: false, tags: ['sauce'] },
      { name: 'Croutons', quantity: 1, unit: 'cup', optional: false, tags: ['bread'] },
      { name: 'Parmesan Cheese', quantity: 50, unit: 'g', optional: false, tags: ['dairy'] },
      { name: 'Lemon', quantity: 1, unit: 'item', optional: true, tags: ['citrus'] }
    ],
    nutritionPerServing: { kcal: 380, protein_g: 35, carb_g: 18, fat_g: 20 },
    servings: 4,
    cuisine: 'American',
    difficulty: 'easy',
    estimatedCostPerServing: 4.25,
    popularityScore: 8.8,
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    tags: ['lunch', 'salad', 'protein', 'healthy'],
  },
  {
    title: 'Overnight Oats',
    steps: [
      'Mix oats with milk in jar',
      'Add chia seeds and sweetener',
      'Stir well and refrigerate overnight',
      'In morning, add toppings',
      'Enjoy cold or warmed up'
    ],
    ingredients: [
      { name: 'Rolled Oats', quantity: 0.5, unit: 'cup', optional: false, tags: ['grain'] },
      { name: 'Milk', quantity: 0.5, unit: 'cup', optional: false, tags: ['dairy'], substitutions: ['Almond Milk', 'Soy Milk'] },
      { name: 'Chia Seeds', quantity: 1, unit: 'tbsp', optional: true, tags: ['seed'] },
      { name: 'Honey', quantity: 1, unit: 'tbsp', optional: false, tags: ['sweetener'], substitutions: ['Maple Syrup', 'Sugar'] },
      { name: 'Berries', quantity: 0.5, unit: 'cup', optional: true, tags: ['fruit'] },
      { name: 'Nuts', quantity: 2, unit: 'tbsp', optional: true, tags: ['nuts'] }
    ],
    nutritionPerServing: { kcal: 280, protein_g: 10, carb_g: 45, fat_g: 8 },
    servings: 1,
    cuisine: 'American',
    difficulty: 'easy',
    estimatedCostPerServing: 1.50,
    popularityScore: 8.0,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    tags: ['breakfast', 'healthy', 'make-ahead', 'vegetarian'],
  },
  {
    title: 'Black Bean Tacos',
    steps: [
      'Heat black beans with spices',
      'Warm tortillas',
      'Prepare toppings',
      'Assemble tacos with beans',
      'Add desired toppings',
      'Serve with lime wedges'
    ],
    ingredients: [
      { name: 'Black Beans', quantity: 2, unit: 'cans', optional: false, tags: ['legume', 'protein'] },
      { name: 'Corn Tortillas', quantity: 8, unit: 'items', optional: false, tags: ['bread'] },
      { name: 'Avocado', quantity: 2, unit: 'items', optional: false, tags: ['vegetable', 'healthy-fat'] },
      { name: 'Salsa', quantity: 1, unit: 'cup', optional: false, tags: ['sauce'] },
      { name: 'Cheese', quantity: 1, unit: 'cup', optional: true, tags: ['dairy'] },
      { name: 'Lime', quantity: 2, unit: 'items', optional: false, tags: ['citrus'] },
      { name: 'Cilantro', quantity: 0.5, unit: 'bunch', optional: true, tags: ['herb'] }
    ],
    nutritionPerServing: { kcal: 340, protein_g: 15, carb_g: 48, fat_g: 12 },
    servings: 4,
    cuisine: 'Mexican',
    difficulty: 'easy',
    estimatedCostPerServing: 2.25,
    popularityScore: 8.7,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    tags: ['dinner', 'vegetarian', 'mexican', 'quick'],
  },
];

const STORES = [
  {
    name: 'Whole Foods Market',
    location: { 
      lat: 41.3947, 
      lon: -73.4539, 
      address: '155 US-202, Somers, NY 10589' 
    },
    hours: {
      monday: { open: '08:00', close: '21:00' },
      tuesday: { open: '08:00', close: '21:00' },
      wednesday: { open: '08:00', close: '21:00' },
      thursday: { open: '08:00', close: '21:00' },
      friday: { open: '08:00', close: '21:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '08:00', close: '20:00' }
    },
    deliveryOptions: {
      available: true,
      fee: 9.95,
      minimum: 35
    }
  },
  {
    name: 'ShopRite',
    location: { 
      lat: 41.4301, 
      lon: -73.6802, 
      address: '1894 US-6, Carmel, NY 10512' 
    },
    hours: {
      monday: { open: '07:00', close: '22:00' },
      tuesday: { open: '07:00', close: '22:00' },
      wednesday: { open: '07:00', close: '22:00' },
      thursday: { open: '07:00', close: '22:00' },
      friday: { open: '07:00', close: '22:00' },
      saturday: { open: '07:00', close: '22:00' },
      sunday: { open: '07:00', close: '22:00' }
    },
    deliveryOptions: {
      available: true,
      fee: 5.95,
      minimum: 35
    }
  },
  {
    name: 'ACME Markets',
    location: { 
      lat: 41.3943, 
      lon: -73.6187, 
      address: '1511 US-22, Brewster, NY 10509' 
    },
    hours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '06:00', close: '23:00' },
      sunday: { open: '06:00', close: '23:00' }
    },
    deliveryOptions: {
      available: true,
      fee: 7.95,
      minimum: 30
    }
  },
];

// Sales data generator
function generateSales(storeId: string): any[] {
  const items = [
    { name: 'Milk', basePrice: 3.99, unit: 'gallon' },
    { name: 'Eggs', basePrice: 2.99, unit: 'dozen' },
    { name: 'Chicken Breast', basePrice: 5.99, unit: 'lb' },
    { name: 'Ground Beef', basePrice: 4.99, unit: 'lb' },
    { name: 'Bread', basePrice: 2.49, unit: 'loaf' },
    { name: 'Bananas', basePrice: 0.59, unit: 'lb' },
    { name: 'Apples', basePrice: 1.99, unit: 'lb' },
    { name: 'Lettuce', basePrice: 2.99, unit: 'head' },
    { name: 'Tomatoes', basePrice: 2.49, unit: 'lb' },
    { name: 'Pasta', basePrice: 1.49, unit: 'box' },
    { name: 'Rice', basePrice: 3.99, unit: '5lb bag' },
    { name: 'Cheese', basePrice: 4.99, unit: 'lb' },
    { name: 'Yogurt', basePrice: 3.99, unit: '32oz' },
    { name: 'Orange Juice', basePrice: 3.49, unit: 'half gallon' },
    { name: 'Cereal', basePrice: 3.99, unit: 'box' },
  ];

  const sales = [];
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Generate 5-10 random sales per store
  const numSales = Math.floor(Math.random() * 6) + 5;
  const selectedItems = items.sort(() => 0.5 - Math.random()).slice(0, numSales);

  for (const item of selectedItems) {
    const discount = 0.1 + Math.random() * 0.4; // 10-50% off
    sales.push({
      storeId,
      itemName: item.name,
      price: Number((item.basePrice * (1 - discount)).toFixed(2)),
      unit: item.unit,
      validFrom: now.toISOString(),
      validTo: weekFromNow.toISOString(),
      tags: ['sale', 'weekly-special'],
      confidence: 0.95,
    });
  }

  return sales;
}

// Pantry items for demo user
const PANTRY_ITEMS = [
  { name: 'Milk', brand: 'Organic Valley', quantity: 0.5, unit: 'gallon', expiresOn: '2024-08-18', tags: ['dairy'], source: 'manual' },
  { name: 'Eggs', brand: 'Happy Eggs', quantity: 8, unit: 'items', expiresOn: '2024-08-25', tags: ['protein'], source: 'manual' },
  { name: 'Bread', brand: 'Dave\'s Killer', quantity: 0.75, unit: 'loaf', expiresOn: '2024-08-15', tags: ['grain'], source: 'manual' },
  { name: 'Chicken Breast', brand: 'Perdue', quantity: 1.5, unit: 'lb', expiresOn: '2024-08-16', tags: ['protein', 'meat'], source: 'manual' },
  { name: 'Pasta', brand: 'Barilla', quantity: 2, unit: 'boxes', tags: ['grain', 'pantry'], source: 'manual' },
  { name: 'Canned Tomatoes', brand: 'San Marzano', quantity: 3, unit: 'cans', tags: ['vegetable', 'pantry'], source: 'manual' },
  { name: 'Olive Oil', brand: 'Colavita', quantity: 500, unit: 'ml', tags: ['oil', 'pantry'], source: 'manual' },
  { name: 'Garlic', quantity: 1, unit: 'head', tags: ['vegetable', 'aromatic'], source: 'manual' },
  { name: 'Onion', quantity: 3, unit: 'items', tags: ['vegetable', 'aromatic'], source: 'manual' },
  { name: 'Rice', brand: 'Lundberg', quantity: 3, unit: 'lb', tags: ['grain', 'pantry'], source: 'manual' },
  { name: 'Black Beans', brand: 'Goya', quantity: 2, unit: 'cans', tags: ['protein', 'legume', 'pantry'], source: 'manual' },
  { name: 'Cheese', brand: 'Cabot', quantity: 0.5, unit: 'lb', expiresOn: '2024-09-01', tags: ['dairy'], source: 'manual' },
  { name: 'Yogurt', brand: 'Chobani', quantity: 4, unit: 'cups', expiresOn: '2024-08-20', tags: ['dairy'], source: 'manual' },
  { name: 'Bananas', quantity: 6, unit: 'items', expiresOn: '2024-08-14', tags: ['fruit'], source: 'manual' },
  { name: 'Apples', brand: 'Honeycrisp', quantity: 5, unit: 'items', tags: ['fruit'], source: 'manual' },
];

// Receipt samples
const RECEIPT_SAMPLES = [
  {
    text: `SHOPRITE #123
1894 US-6, CARMEL NY 10512
08/10/2024 3:45 PM

MILK WHOLE GAL    1 @ 3.99    3.99
EGGS LARGE DOZ    2 @ 2.49    4.98
BREAD WHEAT       1 @ 2.99    2.99
CHICKEN BRST LB   2.5 @ 5.99  14.98
APPLES GALA LB    3 @ 1.99    5.97
LETTUCE ROMAINE   1 @ 2.49    2.49
TOMATOES LB       2 @ 2.99    5.98

SUBTOTAL                      41.38
TAX                           0.00
TOTAL                        41.38

CASH                         50.00
CHANGE                        8.62

THANK YOU FOR SHOPPING!`,
  },
  {
    text: `WHOLE FOODS MARKET
155 US-202, SOMERS NY 10589
Date: 08/09/2024

Organic Milk 1/2 Gal         4.99
Free Range Eggs              5.99
Dave's Killer Bread          5.49
Wild Salmon 1lb             12.99
Organic Spinach              3.99
Avocados (3)                 5.97
Quinoa 1lb                   4.99
Almond Butter                8.99

Subtotal:                   53.40
Tax:                         0.00
Total:                      53.40

Payment: VISA ****1234
Thank you!`,
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Seed users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of DEMO_USERS) {
      const { data: user } = await client.models.User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name}`);
    }

    // Seed recipes
    console.log('\nCreating recipes...');
    const createdRecipes = [];
    for (const recipeData of RECIPES) {
      const { data: recipe } = await client.models.Recipe.create(recipeData);
      createdRecipes.push(recipe);
      console.log(`✅ Created recipe: ${recipe.title}`);
    }

    // Add more recipes (total 30)
    for (let i = 0; i < 25; i++) {
      const cuisines = ['Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Mediterranean', 'American'];
      const difficulties = ['easy', 'medium', 'hard'];
      
      const recipe = {
        title: `Recipe ${i + 6}`,
        steps: ['Step 1', 'Step 2', 'Step 3'],
        ingredients: [
          { name: 'Ingredient 1', quantity: 1, unit: 'cup', optional: false, tags: ['pantry'] },
          { name: 'Ingredient 2', quantity: 2, unit: 'tbsp', optional: false, tags: ['spice'] },
        ],
        nutritionPerServing: { 
          kcal: 300 + Math.floor(Math.random() * 300), 
          protein_g: 10 + Math.floor(Math.random() * 20),
          carb_g: 20 + Math.floor(Math.random() * 40),
          fat_g: 5 + Math.floor(Math.random() * 20)
        },
        servings: 4,
        cuisine: cuisines[Math.floor(Math.random() * cuisines.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        estimatedCostPerServing: 2 + Math.random() * 8,
        popularityScore: 5 + Math.random() * 5,
        prepTimeMinutes: 10 + Math.floor(Math.random() * 20),
        cookTimeMinutes: 15 + Math.floor(Math.random() * 45),
        tags: ['dinner'],
      };
      
      const { data } = await client.models.Recipe.create(recipe);
      createdRecipes.push(data);
    }
    console.log(`✅ Created ${createdRecipes.length} recipes total`);

    // Seed stores
    console.log('\nCreating stores...');
    const createdStores = [];
    for (const storeData of STORES) {
      const { data: store } = await client.models.Store.create(storeData);
      createdStores.push(store);
      console.log(`✅ Created store: ${store.name}`);
    }

    // Seed sales
    console.log('\nCreating sales...');
    let totalSales = 0;
    for (const store of createdStores) {
      const sales = generateSales(store.id);
      for (const saleData of sales) {
        await client.models.Sale.create(saleData);
        totalSales++;
      }
    }
    console.log(`✅ Created ${totalSales} sales across all stores`);

    // Seed pantry items for first user
    console.log('\nCreating pantry items for demo user...');
    const demoUser = createdUsers[0];
    for (const item of PANTRY_ITEMS) {
      const itemData = {
        ...item,
        userId: demoUser.id,
        nutritionEstimate: {
          kcal: 100 + Math.floor(Math.random() * 200),
          protein_g: 5 + Math.floor(Math.random() * 15),
          carb_g: 10 + Math.floor(Math.random() * 30),
          fat_g: 2 + Math.floor(Math.random() * 10),
        }
      };
      
      if (item.expiresOn) {
        // Adjust expiry dates relative to current date
        const daysAhead = Math.floor(Math.random() * 14) - 2; // -2 to 12 days
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + daysAhead);
        itemData.expiresOn = expiryDate.toISOString().split('T')[0];
      }
      
      await client.models.PantryItem.create(itemData);
    }
    console.log(`✅ Created ${PANTRY_ITEMS.length} pantry items for ${demoUser.name}`);

    // Create preferences for demo users
    console.log('\nCreating user preferences...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const preferences = {
        userId: user.id,
        dietaryProfile: i === 1 ? 'vegetarian' : i === 2 ? 'keto' : null,
        allergens: user.allergenList || [],
        dislikedIngredients: i === 0 ? ['mushrooms', 'olives'] : [],
        cuisineLikes: ['Italian', 'Mexican', 'American'],
        costTargetMin: 2.0,
        costTargetMax: 10.0,
      };
      
      await client.models.Preferences.create(preferences);
      console.log(`✅ Created preferences for ${user.name}`);
    }

    console.log('\n✨ Database seeding complete!');
    console.log('\nDemo credentials:');
    console.log('Email: alice@example.com');
    console.log('Password: DemoPass123!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();