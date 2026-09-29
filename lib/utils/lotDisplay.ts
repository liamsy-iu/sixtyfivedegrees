import type { Lot, Variant } from '@/lib/lots'

const LOT_CARD_COLORS = [
  '#5C2D0E', // rust
  '#1E4035', // forest
  '#1A2744', // navy
  '#7A3120', // sienna
  '#4A1E2E', // wine
  '#5C4A1E', // olive
  '#1F3A3A', // teal
  '#3B2E52', // plum
]

// For a single lot shown on its own (quiz result, etc.) — stable per lot_code,
// but two different lots can still land on the same colour by chance.
export function getLotCardColor(lotCode: string): string {
  let hash = 0
  for (let i = 0; i < lotCode.length; i++) {
    hash = (hash * 31 + lotCode.charCodeAt(i)) >>> 0
  }
  return LOT_CARD_COLORS[hash % LOT_CARD_COLORS.length]
}

// For a grid of lots shown together — colour by position, so cards on the
// same page never collide (unless there are more than 8 lots at once).
export function getLotCardColorForIndex(index: number): string {
  return LOT_CARD_COLORS[index % LOT_CARD_COLORS.length]
}

export function isLotSoldOut(lot: Lot): boolean {
  return lot.status === 'sold_out' || !lot.variants.some((v) => v.is_available)
}

export function getStartingPrice(variants: Variant[]): { price: number; sizeGrams: number } | null {
  const available = variants.filter((v) => v.is_available && v.price > 0)
  if (available.length === 0) return null
  const smallest = Math.min(...available.map((v) => v.size_grams))
  const atSize = available.filter((v) => v.size_grams === smallest)
  return { price: Math.min(...atSize.map((v) => v.price)), sizeGrams: smallest }
}

export function getAvailableRoasts(variants: Variant[]): Array<'medium' | 'dark'> {
  const roasts = new Set(variants.filter((v) => v.is_available).map((v) => v.roast))
  return (['medium', 'dark'] as const).filter((r) => roasts.has(r))
}

export function getRoastLabel(roasts: Array<'medium' | 'dark'>): string | null {
  if (roasts.length === 2) return 'Medium & dark roast'
  if (roasts[0] === 'medium') return 'Medium roast'
  if (roasts[0] === 'dark') return 'Dark roast'
  return null
}

export function formatNotes(notes: string | null): string {
  return (notes ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' · ')
}