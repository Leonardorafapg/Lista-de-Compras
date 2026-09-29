import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { RecipeIngredient } from '@/types'

interface EditIngredientModalProps {
  ingredient: RecipeIngredient | null
  onClose: () => void
  onSubmit: (quantity: number) => Promise<void>
}

export function EditIngredientModal({ ingredient, onClose, onSubmit }: EditIngredientModalProps) {
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (ingredient) {
      setQuantity(String(ingredient.quantity))
      setError(null)
    }
  }, [ingredient])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedQuantity = Number(quantity.replace(',', '.'))
    if (!quantity || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError('Informe uma quantidade válida.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(parsedQuantity)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o ingrediente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={ingredient !== null} onClose={onClose} title={`Editar ${ingredient?.product.name ?? ''}`} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={`Quantidade (${ingredient?.product.unit})`}
          inputMode="decimal"
          autoFocus
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
