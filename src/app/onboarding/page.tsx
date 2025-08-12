'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  DollarSign, 
  Utensils,
  Heart,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { userApi } from '@/services/api';
import { useAppStore } from '@/stores/useAppStore';
import { toast } from 'sonner';
import { DietaryProfile } from '@/types';

const STEPS = [
  { id: 'location', title: 'Set Your Location', icon: MapPin },
  { id: 'household', title: 'Household Info', icon: Users },
  { id: 'dietary', title: 'Dietary Preferences', icon: Utensils },
  { id: 'allergies', title: 'Allergies & Dislikes', icon: Heart },
  { id: 'budget', title: 'Budget Goals', icon: DollarSign },
];

const DIETARY_PROFILES: { value: DietaryProfile | 'none'; label: string; description: string }[] = [
  { value: 'none', label: 'No Restrictions', description: 'I eat everything' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { value: 'vegan', label: 'Vegan', description: 'No animal products' },
  { value: 'keto', label: 'Keto', description: 'Low carb, high fat' },
  { value: 'paleo', label: 'Paleo', description: 'Whole foods, no grains' },
];

const COMMON_ALLERGENS = [
  'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts', 
  'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
];

const CUISINE_OPTIONS = [
  'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian',
  'Thai', 'Mediterranean', 'American', 'French', 'Korean'
];

export default function Onboarding() {
  const router = useRouter();
  const { setUser, setPreferences } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    zipCode: '',
    householdSize: 2,
    dietaryProfile: 'none' as DietaryProfile | 'none',
    allergens: [] as string[],
    dislikedIngredients: [] as string[],
    cuisineLikes: [] as string[],
    budgetMin: 3,
    budgetMax: 10,
    defaultBudget: 5,
  });

  const [customAllergen, setCustomAllergen] = useState('');
  const [customDislike, setCustomDislike] = useState('');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Get current authenticated user info
      const authUser = await getCurrentUser();
      if (!authUser || !authUser.signInDetails?.loginId) {
        throw new Error('No authenticated user found');
      }

      // Check if user exists in database
      let currentUser = await userApi.getCurrentUser();
      
      if (!currentUser) {
        // Create new user record
        currentUser = await userApi.createUser({
          email: authUser.signInDetails.loginId,
          name: formData.name || authUser.signInDetails.loginId.split('@')[0],
          location: {
            city: formData.city,
            state: formData.state,
            lat: 41.3947, // Would use geocoding API in production
            lon: -73.6847
          },
          dietaryPreferences: formData.dietaryProfile === 'none' ? [] : [formData.dietaryProfile],
          allergenList: formData.allergens,
          defaultBudgetPerServing: formData.defaultBudget,
          householdSize: formData.householdSize,
        });
      } else {
        // Update existing user
        currentUser = await userApi.updateProfile(currentUser.id, {
          location: {
            city: formData.city,
            state: formData.state,
            lat: 41.3947,
            lon: -73.6847
          },
          householdSize: formData.householdSize,
          defaultBudgetPerServing: formData.defaultBudget,
        });
      }

      // Create preferences
      const preferences = await userApi.updatePreferences(currentUser.id, {
        dietaryProfile: formData.dietaryProfile === 'none' ? null : formData.dietaryProfile,
        allergens: formData.allergens,
        dislikedIngredients: formData.dislikedIngredients,
        cuisineLikes: formData.cuisineLikes,
        costTargetMin: formData.budgetMin,
        costTargetMax: formData.budgetMax,
      });

      // Update store
      setUser(currentUser);
      setPreferences(preferences);

      toast.success('Welcome to ContextChef! Let\'s start cooking.');
      router.push('/');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string, field: keyof typeof formData) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData({ ...formData, [field]: newArray });
  };

  const addCustomItem = (value: string, field: 'allergens' | 'dislikedIngredients') => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      });
      if (field === 'allergens') {
        setCustomAllergen('');
      } else {
        setCustomDislike('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${index <= currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-400'}
                  `}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2
                      ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {STEPS[currentStep].title}
          </h2>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="elevated">
            <CardContent className="p-8">
              {/* Location Step */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Let's get to know you and find stores near you.
                  </p>
                  <Input
                    label="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Smith"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Carmel"
                      required
                    />
                    <Input
                      label="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g., NY"
                      required
                    />
                  </div>
                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="e.g., 10512"
                  />
                </div>
              )}

              {/* Household Step */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    This helps us suggest the right portion sizes and shopping quantities.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      How many people are in your household?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFormData({ ...formData, householdSize: size })}
                          className={`
                            py-3 px-4 rounded-md font-medium transition-colors
                            ${formData.householdSize === size
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                        >
                          {size}{size === 8 ? '+' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dietary Step */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Select your dietary preference to see compatible recipes.
                  </p>
                  <div className="space-y-3">
                    {DIETARY_PROFILES.map((profile) => (
                      <button
                        key={profile.value}
                        onClick={() => setFormData({ ...formData, dietaryProfile: profile.value })}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-colors
                          ${formData.dietaryProfile === profile.value
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <div className="font-medium text-gray-900">{profile.label}</div>
                        <div className="text-sm text-gray-600">{profile.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergies Step */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Food Allergies</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select any allergens we should always avoid.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                      {COMMON_ALLERGENS.map((allergen) => (
                        <button
                          key={allergen}
                          onClick={() => toggleArrayItem(formData.allergens, allergen, 'allergens')}
                          className={`
                            py-2 px-3 rounded-md text-sm font-medium transition-colors
                            ${formData.allergens.includes(allergen)
                              ? 'bg-red-100 text-red-700 border-2 border-red-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                        >
                          {allergen}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom allergen"
                        value={customAllergen}
                        onChange={(e) => setCustomAllergen(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomItem(customAllergen, 'allergens');
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => addCustomItem(customAllergen, 'allergens')}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Disliked Ingredients</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add ingredients you prefer to avoid.
                    </p>
                    {formData.dislikedIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.dislikedIngredients.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                          >
                            {item}
                            <button
                              onClick={() => toggleArrayItem(formData.dislikedIngredients, item, 'dislikedIngredients')}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., mushrooms, olives"
                        value={customDislike}
                        onChange={(e) => setCustomDislike(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomItem(customDislike, 'dislikedIngredients');
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => addCustomItem(customDislike, 'dislikedIngredients')}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Favorite Cuisines</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select cuisines you enjoy (optional).
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CUISINE_OPTIONS.map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={() => toggleArrayItem(formData.cuisineLikes, cuisine, 'cuisineLikes')}
                          className={`
                            py-2 px-3 rounded-md text-sm font-medium transition-colors
                            ${formData.cuisineLikes.includes(cuisine)
                              ? 'bg-green-100 text-green-700 border-2 border-green-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Step */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Set your target price per serving to find budget-friendly recipes.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Default budget per serving: ${formData.defaultBudget}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      step="0.5"
                      value={formData.defaultBudget}
                      onChange={(e) => setFormData({ ...formData, defaultBudget: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>$2 (Very Frugal)</span>
                      <span>$15 (Premium)</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">Budget Range</p>
                        <p className="text-blue-700 mt-1">
                          We'll show recipes between ${formData.budgetMin} - ${formData.budgetMax} per serving,
                          with ${formData.defaultBudget} as your target.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-gray-600">
                    <p className="font-medium mb-2">What this means for you:</p>
                    <p className="text-sm">
                      A family of {formData.householdSize} targeting ${formData.defaultBudget}/serving 
                      would spend about ${(formData.defaultBudget * formData.householdSize * 3).toFixed(0)} per day 
                      on meals.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  loading={loading}
                  disabled={
                    loading ||
                    (currentStep === 0 && (!formData.name || !formData.city || !formData.state))
                  }
                >
                  {currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Next'}
                  {currentStep < STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}