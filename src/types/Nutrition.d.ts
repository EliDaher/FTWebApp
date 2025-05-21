// src/types.ts
export interface FoodItem {
  food: string;
  quantity: string;
  unit: string;
}

export interface Meal {
  name: string;
  items: FoodItem[];
}

export interface NutritionProgram {
  title: string;
  description: string;
  price: string;
  calories: string;
  createdAt: string;
  meals: Meal[];
}
