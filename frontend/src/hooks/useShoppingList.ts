import { useCallback, useEffect, useState } from 'react'
import {
  shoppingListsApi,
  type ShoppingListItemInput,
  type ShoppingListItemUpdateInput,
  type ShoppingListUpdateInput,
} from '@/api/shoppingLists'
import type { ShoppingListDetail } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useShoppingList(id: number) {
  const [shoppingList, setShoppingList] = useState<ShoppingListDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setShoppingList(await shoppingListsApi.get(id))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar a lista de compras.'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const updateList = useCallback(
    async (data: ShoppingListUpdateInput) => {
      setShoppingList(await shoppingListsApi.update(id, data))
    },
    [id],
  )

  const regenerate = useCallback(async () => {
    setShoppingList(await shoppingListsApi.regenerate(id))
  }, [id])

  const addItem = useCallback(
    async (data: ShoppingListItemInput) => {
      setShoppingList(await shoppingListsApi.addItem(id, data))
    },
    [id],
  )

  const updateItem = useCallback(
    async (itemId: number, data: ShoppingListItemUpdateInput) => {
      setShoppingList(await shoppingListsApi.updateItem(id, itemId, data))
    },
    [id],
  )

  const removeItem = useCallback(
    async (itemId: number) => {
      setShoppingList(await shoppingListsApi.removeItem(id, itemId))
    },
    [id],
  )

  return { shoppingList, loading, error, reload: load, updateList, regenerate, addItem, updateItem, removeItem }
}
