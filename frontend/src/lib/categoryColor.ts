const PALETTE = [
  { dot: 'bg-violet-400', text: 'text-violet-600' },
  { dot: 'bg-rose-400', text: 'text-rose-600' },
  { dot: 'bg-amber-400', text: 'text-amber-600' },
  { dot: 'bg-emerald-400', text: 'text-emerald-600' },
  { dot: 'bg-sky-400', text: 'text-sky-600' },
  { dot: 'bg-fuchsia-400', text: 'text-fuchsia-600' },
  { dot: 'bg-lime-500', text: 'text-lime-600' },
  { dot: 'bg-orange-400', text: 'text-orange-600' },
]

export function categoryColor(categoryId: number) {
  return PALETTE[categoryId % PALETTE.length]
}
