import { useCallback, useEffect, useState } from 'react'
import { shoppingListsApi, type ShoppingListGenerateInput } from '@/api/shoppingLists'
import type { ShoppingList } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setShoppingLists(await shoppingListsApi.list())
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar as listas de compras.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const generateShoppingList = useCallback(async (data: ShoppingListGenerateInput) => {
    return shoppingListsApi.generate(data)
  }, [])

  const deleteShoppingList = useCallback(
    async (id: number) => {
      await shoppingListsApi.remove(id)
      await load()
    },
    [load],
  )

  return { shoppingLists, loading, error, reload: load, generateShoppingList, deleteShoppingList }
}
