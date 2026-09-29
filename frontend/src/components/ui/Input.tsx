import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-10 rounded-control border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-faint',
          'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  )
})
