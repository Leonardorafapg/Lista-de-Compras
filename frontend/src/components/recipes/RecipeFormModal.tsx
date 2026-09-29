import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { Recipe } from '@/types'
import type { RecipeInput } from '@/api/recipes'

interface RecipeFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: RecipeInput) => Promise<Recipe | void>
}

export function RecipeFormModal({ open, onClose, onSubmit }: RecipeFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName('')
      setDescription('')
      setError(null)
    }
  }, [open])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Informe o nome da receita.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || null })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a receita.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova receita" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nome" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Macarronada" />
        <Textarea
          label="Descrição (opcional)"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Breve descrição da receita"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Criar receita
          </Button>
        </div>
      </form>
    </Modal>
  )
}
