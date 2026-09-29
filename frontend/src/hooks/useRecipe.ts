import { useCallback, useEffect, useState } from 'react'
import {
  recipesApi,
  type RecipeIngredientInput,
  type RecipeIngredientUpdateInput,
  type RecipeInput,
} from '@/api/recipes'
import type { RecipeDetail } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useRecipe(recipeId: number) {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRecipe(await recipesApi.get(recipeId))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar a receita.'))
    } finally {
      setLoading(false)
    }
  }, [recipeId])

  useEffect(() => {
    void load()
  }, [load])

  const updateRecipe = useCallback(
    async (data: RecipeInput) => {
      setRecipe(await recipesApi.update(recipeId, data))
    },
    [recipeId],
  )

  const addIngredient = useCallback(
    async (data: RecipeIngredientInput) => {
      setRecipe(await recipesApi.addIngredient(recipeId, data))
    },
    [recipeId],
  )

  const updateIngredient = useCallback(
    async (ingredientId: number, data: RecipeIngredientUpdateInput) => {
      setRecipe(await recipesApi.updateIngredient(recipeId, ingredientId, data))
    },
    [recipeId],
  )

  const removeIngredient = useCallback(
    async (ingredientId: number) => {
      setRecipe(await recipesApi.removeIngredient(recipeId, ingredientId))
    },
    [recipeId],
  )

  return { recipe, loading, error, reload: load, updateRecipe, addIngredient, updateIngredient, removeIngredient }
}
