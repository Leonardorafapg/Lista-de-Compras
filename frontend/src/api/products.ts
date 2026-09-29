import { apiClient } from '@/api/client'
import type { Product } from '@/types'

export interface ProductInput {
  name: string
  category_id: number
  unit: string
  active: boolean
}

export interface ProductFilters {
  search?: string
  category_id?: number
}

function buildQuery(filters: ProductFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.category_id !== undefined) params.set('category_id', String(filters.category_id))
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const productsApi = {
  list: (filters: ProductFilters = {}) => apiClient.get<Product[]>(`/api/products${buildQuery(filters)}`),
  get: (id: number) => apiClient.get<Product>(`/api/products/${id}`),
  create: (data: ProductInput) => apiClient.post<Product>('/api/products', data),
  update: (id: number, data: ProductInput) => apiClient.put<Product>(`/api/products/${id}`, data),
  remove: (id: number) => apiClient.delete<void>(`/api/products/${id}`),
}
