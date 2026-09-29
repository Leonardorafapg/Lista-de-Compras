import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AddIngredientModal } from '@/components/recipes/AddIngredientModal'
import { EditIngredientModal } from '@/components/recipes/EditIngredientModal'
import { useRecipe } from '@/hooks/useRecipe'
import { useProducts } from '@/hooks/useProducts'
import { recipesApi } from '@/api/recipes'
import type { RecipeIngredient } from '@/types'

const EMPTY_FILTERS = {}

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const recipeId = Number(id)
  const navigate = useNavigate()

  const { recipe, loading, error, reload, updateRecipe, addIngredient, updateIngredient, removeIngredient } =
    useRecipe(recipeId)
  const { products } = useProducts(EMPTY_FILTERS)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [savingInfo, setSavingInfo] = useState(false)
  const [infoError, setInfoError] = useState<string | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<RecipeIngredient | null>(null)
  const [removingIngredient, setRemovingIngredient] = useState<RecipeIngredient | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)

  const [deletingRecipe, setDeletingRecipe] = useState(false)
  const [deleteRecipeError, setDeleteRecipeError] = useState<string | null>(null)
  const [deletingRecipeLoading, setDeletingRecipeLoading] = useState(false)

  useEffect(() => {
    if (recipe) {
      setName(recipe.name)
      setDescription(recipe.description ?? '')
    }
  }, [recipe])

  async function handleSaveInfo(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setInfoError('Informe o nome da receita.')
      return
    }
    setSavingInfo(true)
    setInfoError(null)
    try {
      await updateRecipe({ name: name.trim(), description: description.trim() || null })
    } catch (err) {
      setInfoError(err instanceof Error ? err.message : 'Não foi possível salvar a receita.')
    } finally {
      setSavingInfo(false)
    }
  }

  async function handleRemoveIngredient() {
    if (!removingIngredient) return
    setRemoving(true)
    setRemoveError(null)
    try {
      await removeIngredient(removingIngredient.id)
      setRemovingIngredient(null)
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : 'Não foi possível remover o ingrediente.')
    } finally {
      setRemoving(false)
    }
  }

  async function handleDeleteRecipe() {
    setDeletingRecipeLoading(true)
    setDeleteRecipeError(null)
    try {
      await recipesApi.remove(recipeId)
      navigate('/receitas')
    } catch (err) {
      setDeleteRecipeError(err instanceof Error ? err.message : 'Não foi possível excluir a receita.')
    } finally {
      setDeletingRecipeLoading(false)
    }
  }

  if (loading) return <Spinner />
  if (error || !recipe) return <ErrorState message={error ?? 'Receita não encontrada.'} onRetry={reload} />

  const usedProductIds = new Set(recipe.ingredients.map((ingredient) => ingredient.product_id))
  const availableProducts = products.filter((product) => product.active && !usedProductIds.has(product.id))

  return (
    <div>
      <button
        onClick={() => navigate('/receitas')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Receitas
      </button>

      <div className="mb-6 rounded-card border border-border bg-surface p-5 shadow-card">
        <form onSubmit={handleSaveInfo} className="flex flex-col gap-4">
          <Input label="Nome da receita" value={name} onChange={(event) => setName(event.target.value)} />
          <Textarea
            label="Descrição (opcional)"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {infoError && <p className="text-xs text-danger">{infoError}</p>}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDeletingRecipe(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-danger hover:opacity-80"
            >
              <Trash2 className="size-4" />
              Excluir receita
            </button>
            <Button type="submit" variant="primary" loading={savingInfo}>
              Salvar alterações
            </Button>
          </div>
        </form>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Ingredientes</h2>
        <Button variant="secondary" size="sm" icon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
          Adicionar ingrediente
        </Button>
      </div>

      {recipe.ingredients.length === 0 ? (
        <div className="rounded-card border border-dashed border-border py-10 text-center text-sm text-ink-soft">
          Nenhum ingrediente adicionado ainda.
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Produto</th>
                <th className="px-5 py-3">Quantidade</th>
                <th className="px-5 py-3">Unidade</th>
                <th className="px-5 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recipe.ingredients.map((ingredient) => (
                <tr key={ingredient.id}>
                  <td className="px-5 py-3 font-medium text-ink">{ingredient.product.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{ingredient.quantity}</td>
                  <td className="px-5 py-3 text-ink-soft">{ingredient.product.unit}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingIngredient(ingredient)}
                        className="rounded-control p-2 text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                        aria-label={`Editar ${ingredient.product.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setRemovingIngredient(ingredient)}
                        className="rounded-control p-2 text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger"
                        aria-label={`Remover ${ingredient.product.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddIngredientModal
        open={addOpen}
        availableProducts={availableProducts}
        onClose={() => setAddOpen(false)}
        onSubmit={(data) => addIngredient(data)}
      />

      <EditIngredientModal
        ingredient={editingIngredient}
        onClose={() => setEditingIngredient(null)}
        onSubmit={(quantity) => updateIngredient(editingIngredient!.id, { quantity })}
      />

      <ConfirmDialog
        open={removingIngredient !== null}
        title="Remover ingrediente"
        description={removeError ?? `Remover "${removingIngredient?.product.name}" desta receita?`}
        confirmLabel="Remover"
        loading={removing}
        onConfirm={handleRemoveIngredient}
        onCancel={() => {
          setRemovingIngredient(null)
          setRemoveError(null)
        }}
      />

      <ConfirmDialog
        open={deletingRecipe}
        title="Excluir receita"
        description={
          deleteRecipeError ??
          'Tem certeza que deseja excluir esta receita? Receitas associadas ao calendário não podem ser excluídas.'
        }
        confirmLabel="Excluir"
        loading={deletingRecipeLoading}
        onConfirm={handleDeleteRecipe}
        onCancel={() => {
          setDeletingRecipe(false)
          setDeleteRecipeError(null)
        }}
      />
    </div>
  )
}
