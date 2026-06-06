export interface Ingredient {
  id: string;
  name: string;
  category: "vegetables" | "fruits" | "protein" | "grains" | "dairy" | "other";
  inPantry: boolean;
}

export interface Substitution {
  original: string;
  alternative: string;
  ratio: string;
  reason: string;
  nutritionImpact: string;
}

export interface Meal {
  name: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    inPantry: boolean;
    substituteFor?: string;
  }[];
  steps: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  prepTime: number; // minutes
  costEstimate: number; // USD
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  totalCost: number;
  savings: number;
  confidenceScore: number; // percentage
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface UserPreferences {
  budget: number;
  familySize: number;
  diet: string;
}
