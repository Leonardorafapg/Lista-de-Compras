import { apiClient } from '@/api/client'
import type { Category } from '@/types'

export interface CategoryInput {
  name: string
}

export const categoriesApi = {
  list: () => apiClient.get<Category[]>('/api/categories'),
  create: (data: CategoryInput) => apiClient.post<Category>('/api/categories', data),
  update: (id: number, data: CategoryInput) => apiClient.put<Category>(`/api/categories/${id}`, data),
  remove: (id: number) => apiClient.delete<void>(`/api/categories/${id}`),
}
