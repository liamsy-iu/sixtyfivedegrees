/**
 * Format KES amount from cents
 * e.g. 75000 → "KES 750"
 */
export function formatKES(cents: number, compact = false): string {
  const amount = cents / 100
  if (compact && amount >= 1000) {
    return `KES ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
  }
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

/**
 * Calculate wholesale price per kg based on total quantity ordered
 */
export interface WholesaleTier {
  grade: 'classic' | 'premium'
  min_kg: number
  max_kg: number | null
  price_per_kg: number
}

export function getWholesalePrice(
  tiers: WholesaleTier[],
  grade: 'classic' | 'premium',
  totalKg: number
): number | null {
  const gradeTiers = tiers.filter((t) => t.grade === grade)
  const tier = gradeTiers.find(
    (t) => totalKg >= t.min_kg && (t.max_kg === null || totalKg <= t.max_kg)
  )
  if (!tier || tier.max_kg === null) return null
  return tier.price_per_kg * totalKg
}

/**
 * Format size label
 */
export function formatSize(grams: number): string {
  if (grams >= 1000) return `${grams / 1000}kg`
  return `${grams}g`
}

/**
 * Format grind label
 */
export function formatGrind(grind: string): string {
  return grind === 'whole_bean' ? 'Whole bean' : 'Ground'
}

/**
 * Generate a unique order reference
 */
export function generateOrderRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = '65D-'
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)]
  }
  return ref
}
