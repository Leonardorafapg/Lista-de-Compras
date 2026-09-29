import { useCallback, useEffect, useState } from 'react'
import { productsApi, type ProductFilters, type ProductInput } from '@/api/products'
import type { Product } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useProducts(filters: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProducts(await productsApi.list(filters))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar os produtos.'))
    } finally {
      setLoading(false)
    }
  }, [filters.search, filters.category_id])

  useEffect(() => {
    void load()
  }, [load])

  const createProduct = useCallback(
    async (data: ProductInput) => {
      await productsApi.create(data)
      await load()
    },
    [load],
  )

  const updateProduct = useCallback(
    async (id: number, data: ProductInput) => {
      await productsApi.update(id, data)
      await load()
    },
    [load],
  )

  const deleteProduct = useCallback(
    async (id: number) => {
      await productsApi.remove(id)
      await load()
    },
    [load],
  )

  return { products, loading, error, reload: load, createProduct, updateProduct, deleteProduct }
}
