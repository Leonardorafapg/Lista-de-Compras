import { apiClient } from '@/api/client'
import type { Recipe, RecipeDetail } from '@/types'

export interface RecipeInput {
  name: string
  description: string | null
}

export interface RecipeIngredientInput {
  product_id: number
  quantity: number
}

export interface RecipeIngredientUpdateInput {
  quantity: number
}

export const recipesApi = {
  list: () => apiClient.get<Recipe[]>('/api/recipes'),
  get: (id: number) => apiClient.get<RecipeDetail>(`/api/recipes/${id}`),
  create: (data: RecipeInput) => apiClient.post<RecipeDetail>('/api/recipes', data),
  update: (id: number, data: RecipeInput) => apiClient.put<RecipeDetail>(`/api/recipes/${id}`, data),
  remove: (id: number) => apiClient.delete<void>(`/api/recipes/${id}`),
  addIngredient: (recipeId: number, data: RecipeIngredientInput) =>
    apiClient.post<RecipeDetail>(`/api/recipes/${recipeId}/ingredients`, data),
  updateIngredient: (recipeId: number, ingredientId: number, data: RecipeIngredientUpdateInput) =>
    apiClient.put<RecipeDetail>(`/api/recipes/${recipeId}/ingredients/${ingredientId}`, data),
  removeIngredient: (recipeId: number, ingredientId: number) =>
    apiClient.delete<RecipeDetail>(`/api/recipes/${recipeId}/ingredients/${ingredientId}`),
}
