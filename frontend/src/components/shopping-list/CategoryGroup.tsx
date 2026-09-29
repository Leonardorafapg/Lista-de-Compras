import { ShoppingListItemRow } from '@/components/shopping-list/ShoppingListItemRow'
import { categoryColor } from '@/lib/categoryColor'
import type { ShoppingListItem } from '@/types'

interface CategoryGroupProps {
  categoryId: number
  categoryName: string
  items: ShoppingListItem[]
  onToggle: (item: ShoppingListItem) => void
  onEdit: (item: ShoppingListItem) => void
  onRemove: (item: ShoppingListItem) => void
  onDivide: (item: ShoppingListItem) => void
}

export function CategoryGroup({ categoryId, categoryName, items, onToggle, onEdit, onRemove, onDivide }: CategoryGroupProps) {
  const color = categoryColor(categoryId)
  const checkedCount = items.filter((item) => item.checked).length

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${color.dot}`} />
          <h3 className="text-sm font-semibold text-ink">{categoryName}</h3>
        </div>
        <span className="text-xs text-ink-faint">
          {checkedCount}/{items.length}
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <ShoppingListItemRow
            key={item.id}
            item={item}
            onToggle={() => onToggle(item)}
            onEdit={() => onEdit(item)}
            onRemove={() => onRemove(item)}
            onDivide={() => onDivide(item)}
          />
        ))}
      </div>
    </div>
  )
}
