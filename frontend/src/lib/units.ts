const MASS_UNITS = new Set(['g', 'kg'])

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/**
 * Padroniza quantidades em massa: abaixo de 1kg exibe em g, a partir de 1kg exibe em kg.
 * Outras unidades (unidade, litro, ml, pacote, caixa, dúzia...) permanecem inalteradas.
 */
export function standardizeUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  if (!MASS_UNITS.has(unit)) {
    return { quantity, unit }
  }
  const grams = unit === 'kg' ? quantity * 1000 : quantity
  if (grams >= 1000) {
    return { quantity: roundTo(grams / 1000, 3), unit: 'kg' }
  }
  return { quantity: roundTo(grams, 3), unit: 'g' }
}

export function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toString().replace('.', ',')
}
