import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { addDays, startOfWeek, toDateKey } from '@/lib/date'
import type { ShoppingListDetail } from '@/types'
import type { ShoppingListGenerateInput } from '@/api/shoppingLists'

type PeriodMode = 'week' | 'custom'

interface GenerateListModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ShoppingListGenerateInput) => Promise<ShoppingListDetail>
  onGenerated: (list: ShoppingListDetail) => void
}

export function GenerateListModal({ open, onClose, onSubmit, onGenerated }: GenerateListModalProps) {
  const [mode, setMode] = useState<PeriodMode>('week')
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      const weekStart = startOfWeek(new Date())
      const weekEnd = addDays(weekStart, 6)
      setMode('week')
      setName('')
      setStartDate(toDateKey(weekStart))
      setEndDate(toDateKey(weekEnd))
      setError(null)
    }
  }, [open])

  function handleModeChange(nextMode: PeriodMode) {
    setMode(nextMode)
    if (nextMode === 'week') {
      const weekStart = startOfWeek(new Date())
      setStartDate(toDateKey(weekStart))
      setEndDate(toDateKey(addDays(weekStart, 6)))
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!startDate || !endDate) {
      setError('Informe o período da lista.')
      return
    }
    if (startDate > endDate) {
      setError('A data inicial deve ser anterior à data final.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const list = await onSubmit({ name: name.trim() || null, start_date: startDate, end_date: endDate })
      onGenerated(list)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar a lista de compras.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova lista de compras" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('week')}
            className={`flex-1 rounded-control border px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'week' ? 'border-accent bg-accent-soft text-accent' : 'border-border text-ink-soft hover:text-ink'
            }`}
          >
            Semana atual
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('custom')}
            className={`flex-1 rounded-control border px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'custom' ? 'border-accent bg-accent-soft text-accent' : 'border-border text-ink-soft hover:text-ink'
            }`}
          >
            Período personalizado
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Data inicial"
            type="date"
            value={startDate}
            disabled={mode === 'week'}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <Input
            label="Data final"
            type="date"
            value={endDate}
            disabled={mode === 'week'}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>

        <Input
          label="Nome (opcional)"
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
            Gerar lista
          </Button>
        </div>
      </form>
    </Modal>
  )
}
