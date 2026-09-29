import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-danger/20 bg-danger-soft py-12 text-center">
      <AlertTriangle className="size-8 text-danger" />
      <p className="max-w-sm text-sm text-danger">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
