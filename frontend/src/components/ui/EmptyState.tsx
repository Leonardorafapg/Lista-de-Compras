import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      </div>
      {action}
    </div>
  )
}
