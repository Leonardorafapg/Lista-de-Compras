import { DayCell } from '@/components/calendar/DayCell'
import { getMonthGridDays, isSameMonth, isToday, toDateKey, WEEKDAY_SHORT_LABELS } from '@/lib/date'
import type { MealPlan } from '@/types'

interface MonthViewProps {
  referenceDate: Date
  mealPlans: MealPlan[]
  onAddClick: (date: Date) => void
  onPlanClick: (plan: MealPlan) => void
}

export function MonthView({ referenceDate, mealPlans, onAddClick, onPlanClick }: MonthViewProps) {
  const days = getMonthGridDays(referenceDate)

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-2 px-1 text-xs font-medium text-ink-soft">
        {WEEKDAY_SHORT_LABELS.map((label) => (
          <div key={label} className="text-center">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = toDateKey(day)
          const plansForDay = mealPlans
            .filter((plan) => plan.date === key)
            .sort((a, b) => a.meal_type.localeCompare(b.meal_type))
          return (
            <DayCell
              key={key}
              dayNumber={day.getDate()}
              plans={plansForDay}
              isCurrentPeriod={isSameMonth(day, referenceDate)}
              isToday={isToday(day)}
              compact
              onAddClick={() => onAddClick(day)}
              onPlanClick={onPlanClick}
            />
          )
        })}
      </div>
    </div>
  )
}
