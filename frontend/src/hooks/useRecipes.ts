import { useCallback, useEffect, useState } from 'react'
import { recipesApi, type RecipeInput } from '@/api/recipes'
import type { Recipe } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRecipes(await recipesApi.list())
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar as receitas.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const createRecipe = useCallback(
    async (data: RecipeInput) => {
      const recipe = await recipesApi.create(data)
      await load()
      return recipe
    },
    [load],
  )

  const deleteRecipe = useCallback(
    async (id: number) => {
      await recipesApi.remove(id)
      await load()
    },
    [load],
  )

  return { recipes, loading, error, reload: load, createRecipe, deleteRecipe }
}
