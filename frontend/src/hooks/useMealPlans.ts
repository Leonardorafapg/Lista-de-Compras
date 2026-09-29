import { useCallback, useEffect, useState } from 'react'
import { mealPlansApi, type MealPlanFilters, type MealPlanInput } from '@/api/mealPlans'
import type { MealPlan } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useMealPlans(filters: MealPlanFilters) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setMealPlans(await mealPlansApi.list(filters))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar o calendário.'))
    } finally {
      setLoading(false)
    }
  }, [filters.start_date, filters.end_date])

  useEffect(() => {
    void load()
  }, [load])

  const createMealPlan = useCallback(
    async (data: MealPlanInput) => {
      await mealPlansApi.create(data)
      await load()
    },
    [load],
  )

  const updateMealPlan = useCallback(
    async (id: number, data: MealPlanInput) => {
      await mealPlansApi.update(id, data)
      await load()
    },
    [load],
  )

  const deleteMealPlan = useCallback(
    async (id: number) => {
      await mealPlansApi.remove(id)
      await load()
    },
    [load],
  )

  return { mealPlans, loading, error, reload: load, createMealPlan, updateMealPlan, deleteMealPlan }
}
