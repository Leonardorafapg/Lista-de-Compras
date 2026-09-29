import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { Category, Product } from '@/types'
import type { ProductInput } from '@/api/products'

const UNIT_SUGGESTIONS = ['unidade', 'kg', 'g', 'litro', 'ml', 'pacote', 'caixa', 'dúzia']

interface ProductFormModalProps {
  open: boolean
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSubmit: (data: ProductInput) => Promise<void>
}

export function ProductFormModal({ open, product, categories, onClose, onSubmit }: ProductFormModalProps) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [unit, setUnit] = useState('unidade')
  const [active, setActive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName(product?.name ?? '')
      setCategoryId(product ? String(product.category_id) : (categories[0] ? String(categories[0].id) : ''))
      setUnit(product?.unit ?? 'unidade')
      setActive(product?.active ?? true)
      setError(null)
    }
  }, [open, product, categories])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Informe o nome do produto.')
      return
    }
    if (!categoryId) {
      setError('Selecione uma categoria.')
      return
    }
    if (!unit.trim()) {
      setError('Informe a unidade de medida.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name: name.trim(), category_id: Number(categoryId), unit: unit.trim(), active })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o produto.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Editar produto' : 'Novo produto'} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nome" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Arroz" />

        <Select label="Categoria" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <Input
          label="Unidade"
          value={unit}
          onChange={(event) => setUnit(event.target.value)}
          onFocus={(event) => event.target.select()}
          placeholder="Ex: kg"
          list="unit-suggestions"
        />
        <datalist id="unit-suggestions">
          {UNIT_SUGGESTIONS.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="size-4 rounded border-border text-accent focus:ring-accent/30"
          />
          Produto ativo
        </label>

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
