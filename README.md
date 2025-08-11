# ContextChef - Smart Meal Planning Application

ContextChef helps users cook meals that fit their pantry inventory, local grocery sales, dietary preferences, and cost per serving targets. Built with Next.js, AWS Amplify, and TypeScript.

## Features

- 🥘 **Pantry Management** - Track inventory with receipt scanning and expiration alerts
- 🍳 **Recipe Generation** - Find recipes based on what you have and your budget
- 📅 **Meal Planning** - Create weekly meal plans with nutrition tracking
- 🛒 **Smart Shopping Lists** - Optimized by store sales and location
- 💰 **Budget Optimization** - Hit cost targets with intelligent substitutions
- 📱 **Offline Support** - PWA with offline functionality
- 🥗 **Dietary Profiles** - Support for vegan, vegetarian, keto, paleo diets
- 🚫 **Allergy Management** - Avoid allergens and disliked ingredients

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│  AWS Amplify    │────▶│   DynamoDB     │
│   (Frontend)    │     │    (Backend)    │     │   (Database)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Service Worker │     │     Lambda      │
│  (Offline PWA)  │     │   Functions     │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **State Management**: Zustand with persistence
- **Backend**: AWS Amplify Gen 2, GraphQL API
- **Database**: DynamoDB with single-table design
- **Authentication**: AWS Cognito
- **Offline**: Service Worker, IndexedDB
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions, AWS Amplify Hosting

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- AWS Account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/contextchef.git
   cd contextchef
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up AWS Amplify**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

4. **Initialize Amplify backend**
   ```bash
   npx ampx sandbox
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

6. **Seed the database**
   ```bash
   npm run seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3001](http://localhost:3001)

### Environment Variables

Create a `.env.local` file:

```env
# AWS Amplify
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your-client-id

# Optional: External APIs
NEXT_PUBLIC_MAPS_API_KEY=your-maps-api-key
NEXT_PUBLIC_OCR_API_KEY=your-ocr-api-key
```

## Running Tests

```bash
# Unit tests
npm test

# Test with coverage
npm run test:coverage

# E2E tests (requires Playwright)
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Deployment

### AWS Amplify Hosting

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **Amplify will automatically deploy**
   - Preview deployments for PRs
   - Production deployment on main branch

### Manual Deployment

```bash
amplify push
amplify publish
```

## API Documentation

### Core Endpoints

#### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in
- `POST /auth/signout` - Sign out
- `POST /auth/refresh` - Refresh tokens

#### Pantry Management
- `GET /pantry` - List pantry items
- `POST /pantry` - Add item
- `PATCH /pantry/:id` - Update item
- `DELETE /pantry/:id` - Remove item
- `POST /pantry/import-receipt` - OCR receipt import

#### Recipe Operations
- `GET /recipes` - Search recipes
- `GET /recipes/:id` - Get recipe details
- `POST /generate/recipes` - Generate recipes based on constraints

#### Meal Planning
- `POST /generate/mealplan` - Generate weekly meal plan
- `GET /mealplans` - List saved plans
- `POST /mealplans` - Save plan

#### Shopping
- `POST /shopping-list/from-mealplan/:id` - Create from meal plan
- `GET /shopping-list` - Get active list
- `PATCH /shopping-list/:id` - Update list

## Data Models

### User
```typescript
{
  id: string
  email: string
  name: string
  location: { city: string, lat: number, lon: number }
  dietaryPreferences: string[]
  allergenList: string[]
  defaultBudgetPerServing: number
  householdSize: number
}
```

### PantryItem
```typescript
{
  id: string
  userId: string
  name: string
  brand?: string
  quantity: number
  unit: string
  expiresOn?: string
  tags?: string[]
  nutritionEstimate?: NutritionInfo
}
```

### Recipe
```typescript
{
  id: string
  title: string
  ingredients: Ingredient[]
  steps: string[]
  nutritionPerServing: NutritionInfo
  estimatedCostPerServing: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}
```

## Design Decisions & Tradeoffs

### Why AWS Amplify?
- **Pros**: Integrated auth, API, and hosting; automatic GraphQL generation; built-in real-time subscriptions
- **Cons**: Vendor lock-in; less flexibility than custom backend
- **Decision**: Speed of development and managed services outweigh lock-in concerns for MVP

### Why Zustand over Redux?
- **Pros**: Simpler API; less boilerplate; built-in persistence; smaller bundle
- **Cons**: Less ecosystem; fewer dev tools
- **Decision**: Zustand's simplicity better fits our needs

### Single-table DynamoDB Design
- **Pros**: Cost-effective; consistent performance; simplified backup
- **Cons**: Complex queries require GSIs; learning curve
- **Decision**: Performance and cost benefits worth the complexity

### Offline-first Architecture
- **Pros**: Works without internet; better perceived performance
- **Cons**: Sync complexity; storage limitations
- **Decision**: Critical for shopping list use case in stores

## Future Improvements

1. **Enhanced Features**
   - Barcode scanning for faster item entry
   - Photo recognition for produce
   - Voice input for hands-free cooking
   - Social features for recipe sharing

2. **Integrations**
   - Grocery store APIs for real-time pricing
   - Nutrition databases for accurate data
   - Smart home integration (Alexa/Google)
   - Calendar sync for meal planning

3. **Performance**
   - Image optimization and lazy loading
   - GraphQL query batching
   - Edge caching with CloudFront
   - Background sync optimization

4. **ML/AI Enhancements**
   - Personalized recipe recommendations
   - Predictive pantry restocking
   - Smart substitution suggestions
   - Seasonal meal planning

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All API endpoints require authentication except public recipe browsing
- User data is isolated by Cognito identity
- Sensitive data encrypted at rest and in transit
- Regular security audits and dependency updates

Report security vulnerabilities to security@contextchef.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Recipe data adapted from public cooking databases
- Icons by Lucide React
- UI components inspired by Tailwind UI

---

Built with ❤️ for home cooks everywhere
