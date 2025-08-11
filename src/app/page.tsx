'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  Package, 
  Calendar, 
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore, selectExpiringItems } from '@/stores/useAppStore';
import { userApi, pantryApi, recipeApi } from '@/services/api';
import { getCurrentUser } from 'aws-amplify/auth';

export default function Home() {
  const router = useRouter();
  const { 
    user, 
    setUser,
    pantryItems,
    setPantryItems,
    currentMealPlan,
    activeShoppingList 
  } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [topRecipes, setTopRecipes] = useState<any[]>([]);
  const expiringItems = selectExpiringItems(useAppStore.getState());

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check authentication
      const authUser = await getCurrentUser();
      
      if (!authUser) {
        router.push('/auth/signin');
        return;
      }

      // Load user data
      let userData = await userApi.getCurrentUser();
      
      if (!userData) {
        // First time user - redirect to onboarding
        router.push('/onboarding');
        return;
      }

      setUser(userData);

      // Load pantry items
      const items = await pantryApi.getPantryItems(userData.id);
      setPantryItems(items);

      // Load top recipes based on pantry
      const recipes = await recipeApi.searchRecipes('', { limit: 6 });
      setTopRecipes(recipes);

    } catch (error) {
      console.error('Error initializing app:', error);
      router.push('/auth/signin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-green-100">
            Let's plan some delicious meals that fit your pantry and budget.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/pantry/scan')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Scan Receipt</h3>
              <p className="text-sm text-gray-600 mt-1">Add items to pantry</p>
            </CardContent>
          </Card>

          <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/recipes/generate')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChefHat className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Find Recipes</h3>
              <p className="text-sm text-gray-600 mt-1">Based on your pantry</p>
            </CardContent>
          </Card>

          <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/meal-plan/create')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Plan Week</h3>
              <p className="text-sm text-gray-600 mt-1">Create meal plan</p>
            </CardContent>
          </Card>

          <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/shopping')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Shopping List</h3>
              <p className="text-sm text-gray-600 mt-1">
                {activeShoppingList ? 'View active list' : 'Create new list'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pantry Status */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Pantry Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {pantryItems.length}
                  </span>
                </div>
                
                {expiringItems.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          {expiringItems.length} items expiring soon
                        </p>
                        <p className="text-sm text-orange-700 mt-1">
                          Use these items first to reduce waste
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Link href="/pantry">
                  <Button variant="outline" className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Pantry
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Current Meal Plan */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>This Week's Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {currentMealPlan ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {currentMealPlan.days.filter(d => 
                        d.breakfast || d.lunch || d.dinner
                      ).length}
                    </p>
                    <p className="text-sm text-gray-600">days planned</p>
                  </div>
                  <Link href="/meal-plan">
                    <Button variant="outline" className="w-full">
                      View Full Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No active meal plan</p>
                  <Link href="/meal-plan/create">
                    <Button variant="primary">
                      Create Meal Plan
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Insights */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Budget Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-green-600">
                    ${user?.defaultBudgetPerServing || 5}.00
                  </p>
                  <p className="text-sm text-gray-600">target per serving</p>
                </div>
                
                <div className="bg-green-50 rounded-md p-3">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      Saved $23.45 this week
                    </p>
                  </div>
                </div>

                <Link href="/budget">
                  <Button variant="outline" className="w-full">
                    View Insights
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Suggestions */}
        {topRecipes.length > 0 && (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recipes You Can Make Today</CardTitle>
              <Link href="/recipes">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRecipes.slice(0, 3).map((recipe) => (
                  <Link 
                    key={recipe.id} 
                    href={`/recipes/${recipe.id}`}
                    className="block"
                  >
                    <Card variant="bordered" className="hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                          <span>${recipe.estimatedCostPerServing}/serving</span>
                        </div>
                        <div className="mt-3 flex items-center text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            recipe.difficulty === 'easy' 
                              ? 'bg-green-100 text-green-700'
                              : recipe.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {recipe.difficulty}
                          </span>
                          {recipe.cuisine && (
                            <span className="ml-2 text-gray-500">
                              {recipe.cuisine}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}