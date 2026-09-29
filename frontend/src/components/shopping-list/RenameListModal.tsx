import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface RenameListModalProps {
  open: boolean
  currentName: string | null
  onClose: () => void
  onSubmit: (name: string | null) => Promise<void>
}

export function RenameListModal({ open, currentName, onClose, onSubmit }: RenameListModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName(currentName ?? '')
      setError(null)
    }
  }, [open, currentName])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(name.trim() || null)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível renomear a lista.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Renomear lista" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: Compras da semana"
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
