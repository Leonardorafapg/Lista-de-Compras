import { DayCell } from '@/components/calendar/DayCell'
import { addDays, isToday, toDateKey, WEEKDAY_LABELS } from '@/lib/date'
import type { MealPlan } from '@/types'

interface WeekViewProps {
  weekStart: Date
  mealPlans: MealPlan[]
  onAddClick: (date: Date) => void
  onPlanClick: (plan: MealPlan) => void
}

export function WeekView({ weekStart, mealPlans, onAddClick, onPlanClick }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
      {days.map((day, index) => {
        const key = toDateKey(day)
        const plansForDay = mealPlans
          .filter((plan) => plan.date === key)
          .sort((a, b) => a.meal_type.localeCompare(b.meal_type))
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="px-1 text-xs font-medium text-ink-soft sm:text-center">
              {WEEKDAY_LABELS[index]} <span className="text-ink-faint">{day.getDate()}</span>
            </div>
            <DayCell
              dayNumber={day.getDate()}
              plans={plansForDay}
              isCurrentPeriod
              isToday={isToday(day)}
              onAddClick={() => onAddClick(day)}
              onPlanClick={onPlanClick}
            />
          </div>
        )
      })}
    </div>
  )
}
