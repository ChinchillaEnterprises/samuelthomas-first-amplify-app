// Shopping list optimization by store and sales

import { ShoppingListItem, Location } from '@/types';

interface Store {
  id: string;
  name: string;
  location: Location & { address: string };
}

interface Sale {
  storeId: string;
  itemName: string;
  price: number;
  unit: string;
  validFrom: Date;
  validTo: Date;
}

interface OptimizedShoppingList {
  stores: Array<{
    store: Store;
    items: Array<ShoppingListItem & { 
      salePrice?: number;
      regularPrice: number;
      savings: number;
    }>;
    subtotal: number;
    savings: number;
    distance: number;
  }>;
  totalCost: number;
  totalSavings: number;
  suggestedSubstitutions: Array<{
    original: string;
    substitute: string;
    savingsAmount: number;
    reason: string;
  }>;
}

export function optimizeShoppingList(
  items: ShoppingListItem[],
  stores: Store[],
  currentSales: Sale[],
  userLocation: Location,
  maxBudget?: number
): OptimizedShoppingList {
  // Group sales by store and item
  const salesByStore = new Map<string, Map<string, Sale>>();
  const now = new Date();
  
  currentSales
    .filter(sale => sale.validFrom <= now && sale.validTo >= now)
    .forEach(sale => {
      if (!salesByStore.has(sale.storeId)) {
        salesByStore.set(sale.storeId, new Map());
      }
      salesByStore.get(sale.storeId)!.set(sale.itemName.toLowerCase(), sale);
    });

  // Calculate optimal store assignments
  const storeAssignments = stores.map(store => {
    const storeSales = salesByStore.get(store.id) || new Map();
    const distance = calculateDistance(userLocation, store.location);
    
    const assignedItems = items.map(item => {
      const sale = storeSales.get(item.name.toLowerCase());
      const regularPrice = item.estimatedPrice;
      const salePrice = sale ? sale.price : regularPrice;
      
      return {
        ...item,
        preferredStoreId: store.id,
        salePrice: sale ? salePrice : undefined,
        regularPrice,
        savings: regularPrice - salePrice
      };
    });

    const subtotal = assignedItems.reduce((sum, item) => 
      sum + (item.salePrice || item.regularPrice) * item.quantity, 0
    );
    
    const savings = assignedItems.reduce((sum, item) => sum + item.savings, 0);

    return {
      store,
      items: assignedItems,
      subtotal,
      savings,
      distance
    };
  });

  // Sort by best value (considering savings and distance)
  storeAssignments.sort((a, b) => {
    const aValue = a.savings - (a.distance * 0.5); // Penalize distance
    const bValue = b.savings - (b.distance * 0.5);
    return bValue - aValue;
  });

  // Multi-store optimization if significant savings
  const optimizedStores = performMultiStoreOptimization(storeAssignments, items);

  // Calculate totals
  const totalCost = optimizedStores.reduce((sum, store) => sum + store.subtotal, 0);
  const totalSavings = optimizedStores.reduce((sum, store) => sum + store.savings, 0);

  // Generate substitution suggestions if over budget
  const substitutions = maxBudget && totalCost > maxBudget
    ? generateSubstitutions(items, totalCost - maxBudget)
    : [];

  return {
    stores: optimizedStores,
    totalCost,
    totalSavings,
    suggestedSubstitutions: substitutions
  };
}

function performMultiStoreOptimization(
  storeAssignments: any[],
  allItems: ShoppingListItem[]
): any[] {
  if (storeAssignments.length <= 1) return storeAssignments;

  // Check if splitting between stores saves enough to justify multiple trips
  const singleStoreBest = storeAssignments[0];
  const multiStoreAssignments: any[] = [];
  const assignedItems = new Set<string>();

  // First pass: assign items with significant sales
  storeAssignments.forEach(storeData => {
    const itemsWithBigSavings = storeData.items.filter((item: any) => 
      item.savings > 2 && !assignedItems.has(item.name)
    );

    if (itemsWithBigSavings.length > 0) {
      multiStoreAssignments.push({
        ...storeData,
        items: itemsWithBigSavings,
        subtotal: itemsWithBigSavings.reduce((sum: number, item: any) => 
          sum + (item.salePrice || item.regularPrice) * item.quantity, 0
        ),
        savings: itemsWithBigSavings.reduce((sum: number, item: any) => 
          sum + item.savings, 0
        )
      });

      itemsWithBigSavings.forEach((item: any) => assignedItems.add(item.name));
    }
  });

  // Second pass: assign remaining items to closest store with decent prices
  const remainingItems = allItems.filter(item => !assignedItems.has(item.name));
  if (remainingItems.length > 0) {
    const bestRemainingStore = storeAssignments
      .sort((a, b) => a.distance - b.distance)[0];
    
    const remainingAssignments = remainingItems.map(item => {
      const storeItem = bestRemainingStore.items.find((si: any) => si.name === item.name);
      return storeItem || { ...item, regularPrice: item.estimatedPrice, savings: 0 };
    });

    // Add to existing store or create new entry
    const existingEntry = multiStoreAssignments.find(ms => 
      ms.store.id === bestRemainingStore.store.id
    );
    
    if (existingEntry) {
      existingEntry.items.push(...remainingAssignments);
      existingEntry.subtotal = existingEntry.items.reduce((sum: number, item: any) => 
        sum + (item.salePrice || item.regularPrice) * item.quantity, 0
      );
      existingEntry.savings = existingEntry.items.reduce((sum: number, item: any) => 
        sum + item.savings, 0
      );
    } else {
      multiStoreAssignments.push({
        ...bestRemainingStore,
        items: remainingAssignments
      });
    }
  }

  // Compare multi-store vs single store
  const multiStoreCost = multiStoreAssignments.reduce((sum, store) => sum + store.subtotal, 0);
  const multiStoreSavings = multiStoreAssignments.reduce((sum, store) => sum + store.savings, 0);
  const extraTripCost = (multiStoreAssignments.length - 1) * 5; // Assume $5 cost per extra trip

  if (multiStoreSavings - extraTripCost > singleStoreBest.savings) {
    return multiStoreAssignments;
  } else {
    return [singleStoreBest];
  }
}

function generateSubstitutions(
  items: ShoppingListItem[],
  amountToSave: number
): any[] {
  const substitutions: any[] = [];
  let savedSoFar = 0;

  // Sort items by price to find biggest impact substitutions
  const sortedItems = [...items].sort((a, b) => 
    (b.estimatedPrice * b.quantity) - (a.estimatedPrice * a.quantity)
  );

  const substitutionOptions = [
    { from: 'organic', to: 'regular', savingsPercent: 30, reason: 'Switch to non-organic' },
    { from: 'name brand', to: 'store brand', savingsPercent: 25, reason: 'Try store brand' },
    { from: 'fresh', to: 'frozen', savingsPercent: 40, reason: 'Use frozen instead' },
    { from: 'meat', to: 'beans/lentils', savingsPercent: 60, reason: 'Plant-based protein' },
    { from: 'cheese', to: 'nutritional yeast', savingsPercent: 50, reason: 'Cheese alternative' }
  ];

  for (const item of sortedItems) {
    if (savedSoFar >= amountToSave) break;

    for (const option of substitutionOptions) {
      if (item.name.toLowerCase().includes(option.from)) {
        const savingsAmount = (item.estimatedPrice * item.quantity) * (option.savingsPercent / 100);
        
        substitutions.push({
          original: item.name,
          substitute: item.name.replace(new RegExp(option.from, 'i'), option.to),
          savingsAmount,
          reason: option.reason
        });

        savedSoFar += savingsAmount;
        break;
      }
    }
  }

  return substitutions.slice(0, 5); // Return top 5 suggestions
}

function calculateDistance(from: Location, to: Location): number {
  // Haversine formula for distance between two points
  const R = 3959; // Earth's radius in miles
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLon = (to.lon - from.lon) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function exportShoppingList(
  optimizedList: OptimizedShoppingList,
  format: 'text' | 'markdown' = 'text'
): string {
  if (format === 'markdown') {
    let output = '# Shopping List\n\n';
    output += `**Total Cost:** $${optimizedList.totalCost.toFixed(2)}\n`;
    output += `**Total Savings:** $${optimizedList.totalSavings.toFixed(2)}\n\n`;

    optimizedList.stores.forEach(storeData => {
      output += `## ${storeData.store.name}\n`;
      output += `*${storeData.store.location.address} (${storeData.distance.toFixed(1)} miles)*\n\n`;
      output += '| Item | Quantity | Price | Savings |\n';
      output += '|------|----------|-------|----------|\n';
      
      storeData.items.forEach(item => {
        const price = item.salePrice || item.regularPrice;
        output += `| ${item.name} | ${item.quantity} ${item.unit} | $${(price * item.quantity).toFixed(2)} | ${item.savings > 0 ? `$${item.savings.toFixed(2)}` : '-'} |\n`;
      });
      
      output += `\n**Subtotal:** $${storeData.subtotal.toFixed(2)}\n\n`;
    });

    if (optimizedList.suggestedSubstitutions.length > 0) {
      output += '## Money-Saving Substitutions\n\n';
      optimizedList.suggestedSubstitutions.forEach(sub => {
        output += `- **${sub.original}** → ${sub.substitute} (Save ~$${sub.savingsAmount.toFixed(2)})\n`;
        output += `  *${sub.reason}*\n\n`;
      });
    }

    return output;
  } else {
    // Plain text format
    let output = 'SHOPPING LIST\n';
    output += '=============\n\n';
    output += `Total: $${optimizedList.totalCost.toFixed(2)}`;
    if (optimizedList.totalSavings > 0) {
      output += ` (Save $${optimizedList.totalSavings.toFixed(2)})\n\n`;
    }

    optimizedList.stores.forEach(storeData => {
      output += `${storeData.store.name.toUpperCase()}\n`;
      output += `${storeData.store.location.address}\n`;
      output += '-'.repeat(40) + '\n';
      
      storeData.items.forEach(item => {
        const price = item.salePrice || item.regularPrice;
        output += `[ ] ${item.name} - ${item.quantity} ${item.unit}`;
        if (item.salePrice) {
          output += ' (SALE!)';
        }
        output += '\n';
      });
      
      output += `\nSubtotal: $${storeData.subtotal.toFixed(2)}\n\n`;
    });

    return output;
  }
}