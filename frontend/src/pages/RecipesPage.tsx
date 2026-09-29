import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, ChevronRight, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { RecipeFormModal } from '@/components/recipes/RecipeFormModal'
import { useRecipes } from '@/hooks/useRecipes'

export function RecipesPage() {
  const { recipes, loading, error, reload, createRecipe } = useRecipes()
  const [formOpen, setFormOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Receitas"
        description="Cada receita é calculada para 5 pessoas."
        actions={
          <Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setFormOpen(true)}>
            Nova receita
          </Button>
        }
      />

      {loading && <Spinner />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && recipes.length === 0 && (
        <EmptyState
          icon={<ChefHat className="size-6" />}
          title="Você ainda não possui receitas."
          description="Crie sua primeira receita para começar a planejar suas refeições."
          action={
            <Button variant="primary" size="sm" icon={<Plus className="size-4" />} onClick={() => setFormOpen(true)}>
              Criar receita
            </Button>
          }
        />
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => navigate(`/receitas/${recipe.id}`)}
              className="flex items-center justify-between rounded-card border border-border bg-surface px-5 py-4 text-left shadow-card transition-colors hover:border-border-strong"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{recipe.name}</p>
                {recipe.description && <p className="mt-0.5 truncate text-xs text-ink-soft">{recipe.description}</p>}
              </div>
              <ChevronRight className="size-4 shrink-0 text-ink-faint" />
            </button>
          ))}
        </div>
      )}

      <RecipeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={async (data) => {
          const recipe = await createRecipe(data)
          navigate(`/receitas/${recipe.id}`)
        }}
      />
    </div>
  )
}
