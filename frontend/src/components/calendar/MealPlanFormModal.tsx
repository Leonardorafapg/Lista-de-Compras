import { useEffect, useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MEAL_TYPES, MEAL_TYPE_LABELS, type MealPlan, type MealType, type Recipe } from '@/types'
import type { MealPlanInput } from '@/api/mealPlans'
import { toDateKey } from '@/lib/date'

interface MealPlanFormModalProps {
  open: boolean
  date: Date | null
  mealPlan: MealPlan | null
  recipes: Recipe[]
  onClose: () => void
  onSubmit: (data: MealPlanInput) => Promise<void>
  onDelete?: () => void
}

export function MealPlanFormModal({ open, date, mealPlan, recipes, onClose, onSubmit, onDelete }: MealPlanFormModalProps) {
  const [dateValue, setDateValue] = useState('')
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [recipeId, setRecipeId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setDateValue(mealPlan?.date ?? (date ? toDateKey(date) : ''))
      setMealType(mealPlan?.meal_type ?? 'lunch')
      setRecipeId(mealPlan ? String(mealPlan.recipe_id) : recipes[0] ? String(recipes[0].id) : '')
      setError(null)
    }
  }, [open, date, mealPlan, recipes])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!dateValue) {
      setError('Selecione uma data.')
      return
    }
    if (!recipeId) {
      setError('Selecione uma receita.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ date: dateValue, meal_type: mealType, recipe_id: Number(recipeId) })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o planejamento.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={mealPlan ? 'Editar planejamento' : 'Adicionar receita ao dia'} size="sm">
      {recipes.length === 0 ? (
        <p className="text-sm text-ink-soft">Cadastre uma receita antes de planejar o calendário.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Data"
            type="date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
          />
          <Select label="Refeição" value={mealType} onChange={(event) => setMealType(event.target.value as MealType)}>
            {MEAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {MEAL_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
          <Select label="Receita" value={recipeId} onChange={(event) => setRecipeId(event.target.value)}>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name}
              </option>
            ))}
          </Select>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex items-center justify-between">
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-danger hover:opacity-80"
              >
                <Trash2 className="size-4" />
                Remover
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Salvar
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}
