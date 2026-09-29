export interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  category_id: number
  unit: string
  active: boolean
  created_at: string
  updated_at: string
  category: Category
}

export interface RecipeIngredient {
  id: number
  recipe_id: number
  product_id: number
  quantity: number
  product: Product
}

export interface Recipe {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface RecipeDetail extends Recipe {
  ingredients: RecipeIngredient[]
}

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'other'] as const
export type MealType = (typeof MEAL_TYPES)[number]

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Café da manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  other: 'Outro',
}

export interface MealPlan {
  id: number
  date: string
  meal_type: MealType
  recipe_id: number
  created_at: string
  updated_at: string
  recipe: Recipe
}

export interface ShoppingListItem {
  id: number
  shopping_list_id: number
  product_id: number
  quantity: number
  checked: boolean
  created_at: string
  updated_at: string
  product: Product
}

export interface ShoppingList {
  id: number
  name: string | null
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface ShoppingListDetail extends ShoppingList {
  items: ShoppingListItem[]
}
