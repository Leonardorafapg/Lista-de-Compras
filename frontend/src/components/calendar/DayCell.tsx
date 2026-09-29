import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { MEAL_TYPE_LABELS, type MealPlan } from '@/types'

const MEAL_TYPE_DOT: Record<MealPlan['meal_type'], string> = {
  breakfast: 'bg-amber-400',
  lunch: 'bg-emerald-400',
  dinner: 'bg-violet-400',
  other: 'bg-sky-400',
}

interface DayCellProps {
  dayNumber: number
  plans: MealPlan[]
  isCurrentPeriod: boolean
  isToday: boolean
  compact?: boolean
  onAddClick: () => void
  onPlanClick: (plan: MealPlan) => void
}

export function DayCell({ dayNumber, plans, isCurrentPeriod, isToday, compact, onAddClick, onPlanClick }: DayCellProps) {
  return (
    <div
      className={cn(
        'group flex min-h-[7rem] flex-col gap-1.5 rounded-control border border-border/70 bg-surface p-2 transition-colors',
        !isCurrentPeriod && 'bg-canvas/60 opacity-50',
        compact && 'min-h-[5.5rem]',
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'flex size-6 items-center justify-center rounded-full text-xs font-semibold',
            isToday ? 'bg-accent text-white' : 'text-ink-soft',
          )}
        >
          {dayNumber}
        </span>
        <button
          onClick={onAddClick}
          className="rounded-control p-1 text-ink-faint opacity-0 transition-opacity hover:bg-ink/5 hover:text-ink group-hover:opacity-100"
          aria-label="Adicionar receita"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-thin">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onPlanClick(plan)}
            className="flex items-start gap-1.5 rounded-md bg-canvas px-1.5 py-1 text-left text-[11px] leading-tight text-ink transition-colors hover:bg-accent-soft"
          >
            <span className={cn('mt-1 size-1.5 shrink-0 rounded-full', MEAL_TYPE_DOT[plan.meal_type])} />
            <span className="min-w-0">
              <span className="block truncate font-medium">{plan.recipe.name}</span>
              {!compact && <span className="block text-ink-faint">{MEAL_TYPE_LABELS[plan.meal_type]}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
