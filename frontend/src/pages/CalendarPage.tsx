import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { WeekView } from '@/components/calendar/WeekView'
import { MonthView } from '@/components/calendar/MonthView'
import { MealPlanFormModal } from '@/components/calendar/MealPlanFormModal'
import { useMealPlans } from '@/hooks/useMealPlans'
import { useRecipes } from '@/hooks/useRecipes'
import { cn } from '@/lib/cn'
import {
  addDays,
  addMonths,
  getMonthGridDays,
  MONTH_LABELS,
  startOfWeek,
  toDateKey,
} from '@/lib/date'
import type { MealPlan } from '@/types'

type ViewMode = 'week' | 'month'

export function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [referenceDate, setReferenceDate] = useState(() => new Date())

  const [modalDate, setModalDate] = useState<Date | null>(null)
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<MealPlan | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { rangeStart, rangeEnd, title } = useMemo(() => {
    if (viewMode === 'week') {
      const start = startOfWeek(referenceDate)
      const end = addDays(start, 6)
      const sameMonth = start.getMonth() === end.getMonth()
      const label = sameMonth
        ? `${start.getDate()} – ${end.getDate()} de ${MONTH_LABELS[start.getMonth()]} de ${start.getFullYear()}`
        : `${start.getDate()} de ${MONTH_LABELS[start.getMonth()]} – ${end.getDate()} de ${MONTH_LABELS[end.getMonth()]}`
      return { rangeStart: start, rangeEnd: end, title: label }
    }
    const gridDays = getMonthGridDays(referenceDate)
    return {
      rangeStart: gridDays[0],
      rangeEnd: gridDays[gridDays.length - 1],
      title: `${MONTH_LABELS[referenceDate.getMonth()]} de ${referenceDate.getFullYear()}`,
    }
  }, [viewMode, referenceDate])

  const filters = useMemo(
    () => ({ start_date: toDateKey(rangeStart), end_date: toDateKey(rangeEnd) }),
    [rangeStart, rangeEnd],
  )
  const { mealPlans, loading, error, reload, createMealPlan, updateMealPlan, deleteMealPlan } = useMealPlans(filters)
  const { recipes } = useRecipes()

  function goToPrevious() {
    setReferenceDate((current) => (viewMode === 'week' ? addDays(current, -7) : addMonths(current, -1)))
  }

  function goToNext() {
    setReferenceDate((current) => (viewMode === 'week' ? addDays(current, 7) : addMonths(current, 1)))
  }

  function goToToday() {
    setReferenceDate(new Date())
  }

  function openAddModal(date: Date) {
    setEditingPlan(null)
    setModalDate(date)
  }

  function openEditModal(plan: MealPlan) {
    setEditingPlan(plan)
    setModalDate(null)
  }

  function closeModal() {
    setModalDate(null)
    setEditingPlan(null)
  }

  async function handleDelete() {
    if (!deletingPlan) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteMealPlan(deletingPlan.id)
      setDeletingPlan(null)
      closeModal()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Não foi possível remover o planejamento.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Calendário" description="Planeje suas refeições e gere a lista de compras a partir delas." />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="flex size-8 items-center justify-center rounded-control border border-border bg-surface text-ink-soft hover:bg-ink/5"
            aria-label="Período anterior"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={goToNext}
            className="flex size-8 items-center justify-center rounded-control border border-border bg-surface text-ink-soft hover:bg-ink/5"
            aria-label="Próximo período"
          >
            <ChevronRight className="size-4" />
          </button>
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Hoje
          </Button>
          <span className="ml-1 text-sm font-semibold text-ink">{title}</span>
        </div>

        <div className="flex items-center gap-1 rounded-control border border-border bg-surface p-1">
          {(['week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === mode ? 'bg-accent-soft text-accent' : 'text-ink-soft hover:text-ink',
              )}
            >
              {mode === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      {loading && <Spinner />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && viewMode === 'week' && (
        <WeekView weekStart={rangeStart} mealPlans={mealPlans} onAddClick={openAddModal} onPlanClick={openEditModal} />
      )}

      {!loading && !error && viewMode === 'month' && (
        <MonthView
          referenceDate={referenceDate}
          mealPlans={mealPlans}
          onAddClick={openAddModal}
          onPlanClick={openEditModal}
        />
      )}

      <MealPlanFormModal
        open={modalDate !== null || editingPlan !== null}
        date={modalDate}
        mealPlan={editingPlan}
        recipes={recipes}
        onClose={closeModal}
        onSubmit={(data) => (editingPlan ? updateMealPlan(editingPlan.id, data) : createMealPlan(data))}
        onDelete={editingPlan ? () => setDeletingPlan(editingPlan) : undefined}
      />

      <ConfirmDialog
        open={deletingPlan !== null}
        title="Remover planejamento"
        description={deleteError ?? `Remover "${deletingPlan?.recipe.name}" deste dia?`}
        confirmLabel="Remover"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeletingPlan(null)
          setDeleteError(null)
        }}
      />
    </div>
  )
}
