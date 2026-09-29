import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

interface AddIngredientModalProps {
  open: boolean
  availableProducts: Product[]
  onClose: () => void
  onSubmit: (data: { product_id: number; quantity: number }) => Promise<void>
}

export function AddIngredientModal({ open, availableProducts, onClose, onSubmit }: AddIngredientModalProps) {
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setProductId(availableProducts[0] ? String(availableProducts[0].id) : '')
      setQuantity('')
      setError(null)
    }
  }, [open, availableProducts])

  const selectedProduct = availableProducts.find((product) => String(product.id) === productId)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedQuantity = Number(quantity.replace(',', '.'))
    if (!productId) {
      setError('Selecione um produto.')
      return
    }
    if (!quantity || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError('Informe uma quantidade válida.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ product_id: Number(productId), quantity: parsedQuantity })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível adicionar o ingrediente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar ingrediente" size="sm">
      {availableProducts.length === 0 ? (
        <p className="text-sm text-ink-soft">
          Todos os produtos cadastrados já fazem parte desta receita, ou nenhum produto foi cadastrado ainda.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select label="Produto" value={productId} onChange={(event) => setProductId(event.target.value)}>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
          <Input
            label={`Quantidade${selectedProduct ? ` (${selectedProduct.unit})` : ''}`}
            inputMode="decimal"
            autoFocus
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Ex: 500"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Adicionar
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
