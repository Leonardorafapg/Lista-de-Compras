import { apiClient } from '@/api/client'
import type { MealPlan, MealType } from '@/types'

export interface MealPlanInput {
  date: string
  meal_type: MealType
  recipe_id: number
}

export interface MealPlanFilters {
  start_date?: string
  end_date?: string
}

function buildQuery(filters: MealPlanFilters): string {
  const params = new URLSearchParams()
  if (filters.start_date) params.set('start_date', filters.start_date)
  if (filters.end_date) params.set('end_date', filters.end_date)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const mealPlansApi = {
  list: (filters: MealPlanFilters = {}) => apiClient.get<MealPlan[]>(`/api/meal-plans${buildQuery(filters)}`),
  create: (data: MealPlanInput) => apiClient.post<MealPlan>('/api/meal-plans', data),
  update: (id: number, data: MealPlanInput) => apiClient.put<MealPlan>(`/api/meal-plans/${id}`, data),
  remove: (id: number) => apiClient.delete<void>(`/api/meal-plans/${id}`),
}
