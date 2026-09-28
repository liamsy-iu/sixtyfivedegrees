import type { Lot, Variant } from '@/lib/lots'

const LOT_CARD_COLORS = ['#5C2D0E', '#1E4035', '#1A2744', '#7A3120']

// Stable colour per lot: the same lot_code always gets the same colour.
export function getLotCardColor(lotCode: string): string {
  let hash = 0
  for (let i = 0; i < lotCode.length; i++) {
    hash = (hash * 31 + lotCode.charCodeAt(i)) >>> 0
  }
  return LOT_CARD_COLORS[hash % LOT_CARD_COLORS.length]
}

export function isLotSoldOut(lot: Lot): boolean {
  return lot.status === 'sold_out' || !lot.variants.some((v) => v.is_available)
}

// Lowest price at the smallest available pack size (250g when it exists).
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

// tasting_notes is one text field on lots: "Orange, Caramel" -> "Orange · Caramel"
export function formatNotes(notes: string | null): string {
  return (notes ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' · ')
}