import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { GenerateListModal } from '@/components/shopping-list/GenerateListModal'
import { useShoppingLists } from '@/hooks/useShoppingLists'
import { fromDateKey } from '@/lib/date'
import type { ShoppingList } from '@/types'

function formatRange(list: ShoppingList): string {
  const start = fromDateKey(list.start_date)
  const end = fromDateKey(list.end_date)
  const formatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${formatter.format(start)} → ${formatter.format(end)}`
}

export function ShoppingListsPage() {
  const { shoppingLists, loading, error, reload, generateShoppingList, deleteShoppingList } = useShoppingLists()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleting, setDeleting] = useState<ShoppingList | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  async function handleDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteShoppingList(deleting.id)
      setDeleting(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Não foi possível excluir a lista.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Lista de compras"
        description="Gere listas a partir das receitas planejadas no calendário."
        actions={
          <Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setModalOpen(true)}>
            Nova lista
          </Button>
        }
      />

      {loading && <Spinner />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && shoppingLists.length === 0 && (
        <EmptyState
          icon={<ShoppingCart className="size-6" />}
          title="Você ainda não possui listas de compras."
          description="Planeje suas refeições no calendário e gere sua primeira lista de compras."
          action={
            <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={() => setModalOpen(true)}>
              Gerar lista
            </Button>
          }
        />
      )}

      {!loading && !error && shoppingLists.length > 0 && (
        <div className="flex flex-col gap-2">
          {shoppingLists.map((list) => (
            <div
              key={list.id}
              className="flex items-center justify-between rounded-card border border-border bg-surface px-5 py-4 shadow-card"
            >
              <button onClick={() => navigate(`/listas/${list.id}`)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
                  <ShoppingCart className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{list.name || 'Lista de compras'}</p>
                  <p className="text-xs text-ink-soft">{formatRange(list)}</p>
                </div>
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDeleting(list)}
                  className="rounded-control p-2 text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger"
                  aria-label="Excluir lista"
                >
                  <Trash2 className="size-4" />
                </button>
                <ChevronRight
                  onClick={() => navigate(`/listas/${list.id}`)}
                  className="size-4 cursor-pointer text-ink-faint"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <GenerateListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={generateShoppingList}
        onGenerated={(list) => navigate(`/listas/${list.id}`)}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir lista"
        description={deleteError ?? `Tem certeza que deseja excluir "${deleting?.name || 'esta lista'}"?`}
        confirmLabel="Excluir"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleting(null)
          setDeleteError(null)
        }}
      />
    </div>
  )
}
