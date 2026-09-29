import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'rounded-control border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint',
          'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  )
})
