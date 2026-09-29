import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

interface AddItemModalProps {
  open: boolean
  products: Product[]
  onClose: () => void
  onSubmit: (data: { product_id: number; quantity: number }) => Promise<void>
}

export function AddItemModal({ open, products, onClose, onSubmit }: AddItemModalProps) {
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setProductId(products[0] ? String(products[0].id) : '')
      setQuantity('')
      setError(null)
    }
  }, [open, products])

  const selectedProduct = products.find((product) => String(product.id) === productId)

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
      setError(err instanceof Error ? err.message : 'Não foi possível adicionar o item.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar item" size="sm">
      {products.length === 0 ? (
        <p className="text-sm text-ink-soft">Nenhum produto ativo cadastrado. Cadastre um produto primeiro.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select label="Produto" value={productId} onChange={(event) => setProductId(event.target.value)}>
            {products.map((product) => (
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
            placeholder="Ex: 2"
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
