// Receipt OCR parsing and item extraction

import { ParsedReceiptItem } from '@/types';

interface ParseResult {
  store?: string;
  date?: Date;
  total?: number;
  items: ParsedReceiptItem[];
  confidence: number;
}

export function parseReceiptText(rawText: string): ParseResult {
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const result: ParseResult = {
    items: [],
    confidence: 0
  };

  // Extract store name (usually in first few lines)
  const storePatterns = [
    /^(walmart|target|kroger|safeway|whole foods|trader joe's|costco)/i,
    /store\s*#?\s*(\d+)/i,
    /^([A-Z][A-Z\s&']+)$/
  ];

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    for (const pattern of storePatterns) {
      const match = lines[i].match(pattern);
      if (match) {
        result.store = match[1].trim();
        break;
      }
    }
    if (result.store) break;
  }

  // Extract date
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\w{3,})\s+(\d{1,2}),?\s+(\d{4})/
  ];

  for (const line of lines) {
    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) {
        result.date = parseDate(match[0]);
        if (result.date) break;
      }
    }
    if (result.date) break;
  }

  // Extract items
  const itemPatterns = [
    // Format: ITEM NAME    QTY @ PRICE    TOTAL
    /^(.+?)\s+(\d+)\s*@\s*\$?(\d+\.?\d*)\s+\$?(\d+\.?\d*)$/,
    // Format: ITEM NAME    TOTAL
    /^(.+?)\s{2,}\$?(\d+\.?\d*)$/,
    // Format: QTY ITEM NAME    PRICE
    /^(\d+)\s+(.+?)\s{2,}\$?(\d+\.?\d*)$/,
    // Format: ITEM NAME QTY x PRICE = TOTAL
    /^(.+?)\s+(\d+)\s*x\s*\$?(\d+\.?\d*)\s*=\s*\$?(\d+\.?\d*)$/
  ];

  const extractedItems: ParsedReceiptItem[] = [];
  const skipWords = ['subtotal', 'total', 'tax', 'cash', 'change', 'balance', 'debit', 'credit', 'visa', 'mastercard'];

  for (const line of lines) {
    // Skip non-item lines
    if (skipWords.some(word => line.toLowerCase().includes(word))) {
      continue;
    }

    let matched = false;
    for (const pattern of itemPatterns) {
      const match = line.match(pattern);
      if (match) {
        const item = parseItemMatch(match, pattern);
        if (item && item.name.length > 2 && item.price > 0) {
          extractedItems.push(item);
          matched = true;
          break;
        }
      }
    }

    // Extract total if not matched as item
    if (!matched && !result.total) {
      const totalMatch = line.match(/total[:\s]+\$?(\d+\.?\d*)/i);
      if (totalMatch) {
        result.total = parseFloat(totalMatch[1]);
      }
    }
  }

  // Clean and normalize items
  result.items = extractedItems.map(item => ({
    ...item,
    name: normalizeItemName(item.name),
    unit: inferUnit(item.name, item.quantity)
  }));

  // Calculate confidence score
  let confidence = 0;
  if (result.store) confidence += 20;
  if (result.date) confidence += 20;
  if (result.total) confidence += 20;
  if (result.items.length > 0) {
    confidence += Math.min(40, result.items.length * 4);
  }
  result.confidence = confidence / 100;

  return result;
}

function parseItemMatch(match: RegExpMatchArray, pattern: RegExp): ParsedReceiptItem | null {
  try {
    // Different patterns have different capture group orders
    if (pattern.source.includes('@')) {
      // Format: ITEM NAME    QTY @ PRICE    TOTAL
      return {
        name: match[1].trim(),
        quantity: parseInt(match[2]),
        unit: 'item',
        price: parseFloat(match[4] || match[3])
      };
    } else if (pattern.source.startsWith('^(\\d+)')) {
      // Format: QTY ITEM NAME    PRICE
      return {
        name: match[2].trim(),
        quantity: parseInt(match[1]),
        unit: 'item',
        price: parseFloat(match[3])
      };
    } else if (pattern.source.includes(' x ')) {
      // Format: ITEM NAME QTY x PRICE = TOTAL
      return {
        name: match[1].trim(),
        quantity: parseInt(match[2]),
        unit: 'item',
        price: parseFloat(match[4])
      };
    } else {
      // Format: ITEM NAME    TOTAL
      return {
        name: match[1].trim(),
        quantity: 1,
        unit: 'item',
        price: parseFloat(match[2])
      };
    }
  } catch {
    return null;
  }
}

function normalizeItemName(name: string): string {
  // Remove common abbreviations and codes
  let normalized = name
    .replace(/\b(org|orgn|organic)\b/gi, 'Organic')
    .replace(/\b(whl|whole)\b/gi, 'Whole')
    .replace(/\b(mlk|milk)\b/gi, 'Milk')
    .replace(/\b(chkn|chicken)\b/gi, 'Chicken')
    .replace(/\b(veg|vegetable)\b/gi, 'Vegetable')
    .replace(/\b(frz|frzn|frozen)\b/gi, 'Frozen')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove SKU/UPC codes
  normalized = normalized.replace(/\b\d{5,}\b/g, '').trim();

  // Capitalize properly
  return normalized
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function inferUnit(name: string, quantity: number): string {
  const nameLower = name.toLowerCase();
  
  // Weight-based items
  if (nameLower.includes(' lb') || nameLower.includes('pound')) return 'lb';
  if (nameLower.includes(' oz') || nameLower.includes('ounce')) return 'oz';
  if (nameLower.includes(' kg') || nameLower.includes('kilogram')) return 'kg';
  if (nameLower.includes(' g ') || nameLower.includes('gram')) return 'g';
  
  // Volume-based items
  if (nameLower.includes('gallon')) return 'gallon';
  if (nameLower.includes('quart')) return 'quart';
  if (nameLower.includes('liter')) return 'liter';
  if (nameLower.includes(' ml')) return 'ml';
  
  // Package-based
  if (nameLower.includes('dozen')) return 'dozen';
  if (nameLower.includes('pack') || nameLower.includes('pkg')) return 'pack';
  if (nameLower.includes('bunch')) return 'bunch';
  if (nameLower.includes('bag')) return 'bag';
  if (nameLower.includes('box')) return 'box';
  if (nameLower.includes('can')) return 'can';
  
  // Default
  return quantity === 1 ? 'item' : 'items';
}

function parseDate(dateStr: string): Date | null {
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch {
    // Continue to manual parsing
  }

  // Try manual parsing for common formats
  const match = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (match) {
    const month = parseInt(match[1]);
    const day = parseInt(match[2]);
    let year = parseInt(match[3]);
    
    if (year < 100) {
      year += 2000;
    }
    
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day);
    }
  }

  return null;
}

export function categorizePantryItems(items: ParsedReceiptItem[]): Record<string, ParsedReceiptItem[]> {
  const categories: Record<string, ParsedReceiptItem[]> = {
    'Produce': [],
    'Dairy': [],
    'Meat & Seafood': [],
    'Bakery': [],
    'Frozen': [],
    'Canned Goods': [],
    'Dry Goods': [],
    'Beverages': [],
    'Snacks': [],
    'Other': []
  };

  const categoryKeywords = {
    'Produce': ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'potato', 'onion', 'carrot', 'broccoli', 'fruit', 'vegetable', 'veg', 'salad'],
    'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy', 'cottage', 'sour cream'],
    'Meat & Seafood': ['chicken', 'beef', 'pork', 'turkey', 'fish', 'salmon', 'shrimp', 'meat', 'bacon', 'sausage'],
    'Bakery': ['bread', 'bagel', 'muffin', 'cake', 'cookie', 'pastry', 'donut', 'croissant'],
    'Frozen': ['frozen', 'ice cream', 'pizza'],
    'Canned Goods': ['can', 'canned', 'soup', 'beans', 'tomato sauce'],
    'Dry Goods': ['rice', 'pasta', 'flour', 'sugar', 'cereal', 'oats'],
    'Beverages': ['water', 'soda', 'juice', 'coffee', 'tea', 'drink', 'beverage'],
    'Snacks': ['chips', 'crackers', 'nuts', 'popcorn', 'candy', 'chocolate']
  };

  items.forEach(item => {
    const itemNameLower = item.name.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => itemNameLower.includes(keyword))) {
        categories[category].push(item);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories['Other'].push(item);
    }
  });

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([_, items]) => items.length > 0)
  );
}