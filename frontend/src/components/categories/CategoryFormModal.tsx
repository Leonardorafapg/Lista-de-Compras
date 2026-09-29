import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'
import type { CategoryInput } from '@/api/categories'

interface CategoryFormModalProps {
  open: boolean
  category: Category | null
  onClose: () => void
  onSubmit: (data: CategoryInput) => Promise<void>
}

export function CategoryFormModal({ open, category, onClose, onSubmit }: CategoryFormModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '')
      setError(null)
    }
  }, [open, category])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Informe um nome para a categoria.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name: name.trim() })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a categoria.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={category ? 'Editar categoria' : 'Nova categoria'} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: Alimentação"
          error={error ?? undefined}
        />
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
