import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ListChecks, Pencil, Plus, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { CategoryGroup } from '@/components/shopping-list/CategoryGroup'
import { AddItemModal } from '@/components/shopping-list/AddItemModal'
import { EditItemModal } from '@/components/shopping-list/EditItemModal'
import { PortionCalculatorModal } from '@/components/shopping-list/PortionCalculatorModal'
import { RenameListModal } from '@/components/shopping-list/RenameListModal'
import { useShoppingList } from '@/hooks/useShoppingList'
import { useProducts } from '@/hooks/useProducts'
import { fromDateKey } from '@/lib/date'
import type { ShoppingListItem } from '@/types'

const EMPTY_FILTERS = {}

export function ShoppingListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const listId = Number(id)
  const navigate = useNavigate()

  const { shoppingList, loading, error, reload, updateList, regenerate, addItem, updateItem, removeItem } =
    useShoppingList(listId)
  const { products } = useProducts(EMPTY_FILTERS)

  const [addOpen, setAddOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null)
  const [dividingItem, setDividingItem] = useState<ShoppingListItem | null>(null)
  const [removingItem, setRemovingItem] = useState<ShoppingListItem | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)
  const [regenerateOpen, setRegenerateOpen] = useState(false)
  const [regenerateError, setRegenerateError] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  const groups = useMemo(() => {
    if (!shoppingList) return []
    const byCategory = new Map<number, { categoryId: number; categoryName: string; items: ShoppingListItem[] }>()
    for (const item of shoppingList.items) {
      const category = item.product.category
      const existing = byCategory.get(category.id)
      if (existing) {
        existing.items.push(item)
      } else {
        byCategory.set(category.id, { categoryId: category.id, categoryName: category.name, items: [item] })
      }
    }
    return Array.from(byCategory.values()).sort((a, b) => a.categoryName.localeCompare(b.categoryName))
  }, [shoppingList])

  async function handleRemoveItem() {
    if (!removingItem) return
    setRemoving(true)
    setRemoveError(null)
    try {
      await removeItem(removingItem.id)
      setRemovingItem(null)
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : 'Não foi possível remover o item.')
    } finally {
      setRemoving(false)
    }
  }

  async function handleRegenerate() {
    setRegenerating(true)
    setRegenerateError(null)
    try {
      await regenerate()
      setRegenerateOpen(false)
    } catch (err) {
      setRegenerateError(err instanceof Error ? err.message : 'Não foi possível regenerar a lista.')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) return <Spinner />
  if (error || !shoppingList) return <ErrorState message={error ?? 'Lista não encontrada.'} onRetry={reload} />

  const totalItems = shoppingList.items.length
  const checkedItems = shoppingList.items.filter((item) => item.checked).length
  const formatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Listas de compras
      </button>

      <div className="mb-6 rounded-card border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-ink">{shoppingList.name || 'Lista de compras'}</h1>
              <button
                onClick={() => setRenameOpen(true)}
                className="rounded-control p-1 text-ink-faint hover:bg-ink/5 hover:text-ink"
                aria-label="Renomear lista"
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-sm text-ink-soft">
              {formatter.format(fromDateKey(shoppingList.start_date))} → {formatter.format(fromDateKey(shoppingList.end_date))}
            </p>
            {totalItems > 0 && (
              <p className="mt-1 text-xs font-medium text-ink-faint">
                {checkedItems} de {totalItems} itens
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<RotateCw className="size-3.5" />} onClick={() => setRegenerateOpen(true)}>
              Regenerar lista
            </Button>
            <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
              Adicionar item
            </Button>
          </div>
        </div>
      </div>

      {totalItems === 0 ? (
        <EmptyState
          icon={<ListChecks className="size-6" />}
          title="Nenhum item nesta lista."
          description="Não havia receitas planejadas para este período, ou adicione itens manualmente."
          action={
            <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
              Adicionar item
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <CategoryGroup
              key={group.categoryId}
              categoryId={group.categoryId}
              categoryName={group.categoryName}
              items={group.items}
              onToggle={(item) => updateItem(item.id, { checked: !item.checked })}
              onEdit={setEditingItem}
              onRemove={setRemovingItem}
              onDivide={setDividingItem}
            />
          ))}
        </div>
      )}

      <AddItemModal
        open={addOpen}
        products={products.filter((product) => product.active)}
        onClose={() => setAddOpen(false)}
        onSubmit={(data) => addItem(data)}
      />

      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={(quantity) => updateItem(editingItem!.id, { quantity })}
      />

      <PortionCalculatorModal item={dividingItem} onClose={() => setDividingItem(null)} />

      <RenameListModal
        open={renameOpen}
        currentName={shoppingList.name}
        onClose={() => setRenameOpen(false)}
        onSubmit={(name) => updateList({ name })}
      />

      <ConfirmDialog
        open={removingItem !== null}
        title="Remover item"
        description={removeError ?? `Remover "${removingItem?.product.name}" da lista?`}
        confirmLabel="Remover"
        loading={removing}
        onConfirm={handleRemoveItem}
        onCancel={() => {
          setRemovingItem(null)
          setRemoveError(null)
        }}
      />

      <ConfirmDialog
        open={regenerateOpen}
        title="Regenerar lista"
        description={
          regenerateError ??
          'Os itens desta lista serão recalculados com base no planejamento atual do calendário para este período. Itens adicionados manualmente ou alterados serão substituídos.'
        }
        confirmLabel="Regenerar"
        danger={false}
        loading={regenerating}
        onConfirm={handleRegenerate}
        onCancel={() => {
          setRegenerateOpen(false)
          setRegenerateError(null)
        }}
      />
    </div>
  )
}
