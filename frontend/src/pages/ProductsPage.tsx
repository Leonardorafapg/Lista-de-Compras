import { useMemo, useState } from 'react'
import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProductFormModal } from '@/components/products/ProductFormModal'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { categoryColor } from '@/lib/categoryColor'
import type { Product } from '@/types'

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const filters = useMemo(() => ({ search: search || undefined }), [search])
  const { products, loading, error, reload, createProduct, updateProduct, deleteProduct } = useProducts(filters)
  const { categories } = useCategories()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setFormOpen(true)
  }

  async function handleDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteProduct(deleting.id)
      setDeleting(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Não foi possível excluir o produto.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const hasNoCategories = categories.length === 0

  return (
    <div>
      <PageHeader
        title="Produtos"
        description="Cadastre os produtos que podem ser usados em receitas e listas de compras."
        actions={
          <Button
            variant="primary"
            icon={<Plus className="size-4" />}
            onClick={openCreate}
            disabled={hasNoCategories}
            title={hasNoCategories ? 'Crie uma categoria antes de cadastrar produtos' : undefined}
          >
            Novo produto
          </Button>
        }
      />

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar produto..."
          className="h-10 w-full rounded-control border border-border bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {loading && <Spinner />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && products.length === 0 && (
        <EmptyState
          icon={<Package className="size-6" />}
          title={search ? 'Nenhum produto encontrado.' : 'Você ainda não possui produtos.'}
          description={
            hasNoCategories
              ? 'Crie uma categoria antes de cadastrar seu primeiro produto.'
              : 'Cadastre seu primeiro produto para começar a montar receitas e listas de compras.'
          }
          action={
            !search &&
            !hasNoCategories && (
              <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={openCreate}>
                Criar produto
              </Button>
            )
          }
        />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Produto</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Unidade</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const color = categoryColor(product.category_id)
                return (
                  <tr key={product.id} className={product.active ? undefined : 'opacity-50'}>
                    <td className="px-5 py-3 font-medium text-ink">{product.name}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-ink-soft">
                        <span className={`size-1.5 rounded-full ${color.dot}`} />
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{product.unit}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-control p-2 text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                          aria-label={`Editar ${product.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(product)}
                          className="rounded-control p-2 text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger"
                          aria-label={`Excluir ${product.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        product={editing}
        categories={categories}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => (editing ? updateProduct(editing.id, data) : createProduct(data))}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir produto"
        description={
          deleteError ??
          `Tem certeza que deseja excluir "${deleting?.name}"? Produtos usados em receitas ou listas não podem ser excluídos.`
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
