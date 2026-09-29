import { apiClient } from '@/api/client'
import type { ShoppingList, ShoppingListDetail } from '@/types'

export interface ShoppingListGenerateInput {
  name: string | null
  start_date: string
  end_date: string
}

export interface ShoppingListUpdateInput {
  name: string | null
}

export interface ShoppingListItemInput {
  product_id: number
  quantity: number
}

export interface ShoppingListItemUpdateInput {
  quantity?: number
  checked?: boolean
}

export const shoppingListsApi = {
  list: () => apiClient.get<ShoppingList[]>('/api/shopping-lists'),
  get: (id: number) => apiClient.get<ShoppingListDetail>(`/api/shopping-lists/${id}`),
  generate: (data: ShoppingListGenerateInput) => apiClient.post<ShoppingListDetail>('/api/shopping-lists', data),
  regenerate: (id: number) => apiClient.post<ShoppingListDetail>(`/api/shopping-lists/${id}/regenerate`),
  update: (id: number, data: ShoppingListUpdateInput) =>
    apiClient.put<ShoppingListDetail>(`/api/shopping-lists/${id}`, data),
  remove: (id: number) => apiClient.delete<void>(`/api/shopping-lists/${id}`),
  addItem: (id: number, data: ShoppingListItemInput) =>
    apiClient.post<ShoppingListDetail>(`/api/shopping-lists/${id}/items`, data),
  updateItem: (id: number, itemId: number, data: ShoppingListItemUpdateInput) =>
    apiClient.put<ShoppingListDetail>(`/api/shopping-lists/${id}/items/${itemId}`, data),
  removeItem: (id: number, itemId: number) =>
    apiClient.delete<ShoppingListDetail>(`/api/shopping-lists/${id}/items/${itemId}`),
}
