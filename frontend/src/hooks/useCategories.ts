import { useCallback, useEffect, useState } from 'react'
import { categoriesApi, type CategoryInput } from '@/api/categories'
import type { Category } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCategories(await categoriesApi.list())
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar as categorias.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const createCategory = useCallback(
    async (data: CategoryInput) => {
      await categoriesApi.create(data)
      await load()
    },
    [load],
  )

  const updateCategory = useCallback(
    async (id: number, data: CategoryInput) => {
      await categoriesApi.update(id, data)
      await load()
    },
    [load],
  )

  const deleteCategory = useCallback(
    async (id: number) => {
      await categoriesApi.remove(id)
      await load()
    },
    [load],
  )

  return { categories, loading, error, reload: load, createCategory, updateCategory, deleteCategory }
}
