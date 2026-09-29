import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { formatQuantity, roundTo, standardizeUnit } from '@/lib/units'
import type { ShoppingListItem } from '@/types'

interface PortionCalculatorModalProps {
  item: ShoppingListItem | null
  onClose: () => void
}

export function PortionCalculatorModal({ item, onClose }: PortionCalculatorModalProps) {
  const [portion, setPortion] = useState('')

  useEffect(() => {
    if (item) {
      setPortion('')
    }
  }, [item])

  const standardized = item ? standardizeUnit(item.quantity, item.product.unit) : null
  const parsedPortion = Number(portion.replace(',', '.'))
  const validPortion = portion !== '' && !Number.isNaN(parsedPortion) && parsedPortion > 0
  const packages = validPortion && standardized ? Math.ceil(standardized.quantity / parsedPortion) : null
  const total = packages !== null ? roundTo(packages * parsedPortion, 3) : null

  return (
    <Modal open={item !== null} onClose={onClose} title={`Dividir por porção — ${item?.product.name ?? ''}`} size="sm">
      {standardized && (
        <div className="flex flex-col gap-4">
          <div className="rounded-control bg-canvas px-3 py-2.5 text-sm">
            <span className="text-ink-soft">Quantidade necessária: </span>
            <span className="font-medium text-ink">
              {formatQuantity(standardized.quantity)} {standardized.unit}
            </span>
          </div>

          <Input
            label={`Tamanho da embalagem (${standardized.unit})`}
            inputMode="decimal"
            autoFocus
            value={portion}
            onChange={(event) => setPortion(event.target.value)}
            placeholder={`Ex: ${standardized.unit === 'unidade' ? '1' : '500'}`}
          />

          {portion !== '' && !validPortion && (
            <p className="text-xs text-danger">Informe um tamanho de embalagem válido.</p>
          )}

          {packages !== null && total !== null && (
            <div className="rounded-control border border-accent/30 bg-accent-soft px-3 py-3 text-sm text-accent">
              <p className="font-semibold">
                Comprar {packages} {packages === 1 ? 'embalagem' : 'embalagens'}
              </p>
              <p className="mt-0.5 text-accent/80">
                Total: {formatQuantity(total)} {standardized.unit}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
