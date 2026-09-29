import { useState } from 'react'
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { CategoryFormModal } from '@/components/categories/CategoryFormModal'
import { useCategories } from '@/hooks/useCategories'
import type { Category } from '@/types'

export function CategoriesPage() {
  const { categories, loading, error, reload, createCategory, updateCategory, deleteCategory } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setFormOpen(true)
  }

  async function handleDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteCategory(deleting.id)
      setDeleting(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Não foi possível excluir a categoria.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Categorias"
        description="Organize seus produtos em categorias personalizadas."
        actions={
          <Button variant="primary" icon={<Plus className="size-4" />} onClick={openCreate}>
            Nova categoria
          </Button>
        }
      />

      {loading && <Spinner />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && categories.length === 0 && (
        <EmptyState
          icon={<Tags className="size-6" />}
          title="Você ainda não possui categorias."
          description="Crie sua primeira categoria para organizar os produtos cadastrados."
          action={
            <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={openCreate}>
              Criar categoria
            </Button>
          }
        />
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
          <ul className="divide-y divide-border">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm font-medium text-ink">{category.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(category)}
                    className="rounded-control p-2 text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                    aria-label={`Editar ${category.name}`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(category)}
                    className="rounded-control p-2 text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger"
                    aria-label={`Excluir ${category.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        category={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => (editing ? updateCategory(editing.id, data) : createCategory(data))}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir categoria"
        description={
          deleteError ??
          `Tem certeza que deseja excluir "${deleting?.name}"? Categorias com produtos associados não podem ser excluídas.`
        }
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
