import { Check, Divide, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatQuantity, standardizeUnit } from '@/lib/units'
import type { ShoppingListItem } from '@/types'

interface ShoppingListItemRowProps {
  item: ShoppingListItem
  onToggle: () => void
  onEdit: () => void
  onRemove: () => void
  onDivide: () => void
}

export function ShoppingListItemRow({ item, onToggle, onEdit, onRemove, onDivide }: ShoppingListItemRowProps) {
  const standardized = standardizeUnit(item.quantity, item.product.unit)

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <button
        onClick={onToggle}
        aria-label={item.checked ? 'Marcar como não comprado' : 'Marcar como comprado'}
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          item.checked ? 'border-accent bg-accent text-white' : 'border-border-strong text-transparent hover:border-accent',
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </button>

      <button onClick={onToggle} className="min-w-0 flex-1 text-left">
        <span className={cn('block truncate text-sm', item.checked ? 'text-ink-faint line-through' : 'text-ink')}>
          {item.product.name}
        </span>
      </button>

      <span className={cn('shrink-0 text-sm tabular-nums', item.checked ? 'text-ink-faint line-through' : 'text-ink-soft')}>
        {formatQuantity(standardized.quantity)} {standardized.unit}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          onClick={onDivide}
          className="rounded-control p-1.5 text-ink-faint hover:bg-ink/5 hover:text-ink"
          aria-label={`Dividir ${item.product.name} por porção de compra`}
        >
          <Divide className="size-3.5" />
        </button>
        <button
          onClick={onEdit}
          className="rounded-control p-1.5 text-ink-faint hover:bg-ink/5 hover:text-ink"
          aria-label={`Editar ${item.product.name}`}
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={onRemove}
          className="rounded-control p-1.5 text-ink-faint hover:bg-danger-soft hover:text-danger"
          aria-label={`Remover ${item.product.name}`}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
