'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { formatKES } from '@/lib/utils/pricing'

type Variant = {
  id: string
  roast: 'medium' | 'dark'
  grind: 'whole_bean' | 'ground'
  grind_size: 'coarse' | 'medium-coarse' | 'medium' | 'fine' | null
  size_grams: number
  price: number
  is_available: boolean
}

const SIZES = [250, 500, 1000]
const GRIND_SIZES = ['coarse', 'medium-coarse', 'medium', 'fine'] as const

export function LotVariantSelector({
  lotId, lotName, grade, variants,
}: { lotId: string; lotName: string; grade: 'AA' | 'AB'; variants: Variant[] }) {
  const availableVariants = variants.filter((v) => v.is_available)
  const availableRoasts = [...new Set(availableVariants.map((v) => v.roast))]

  const [roast, setRoast] = useState<'medium' | 'dark' | null>(availableRoasts[0] ?? null)
  const [grind, setGrind] = useState<'whole_bean' | 'ground'>('whole_bean')
  const [grindSize, setGrindSize] = useState<typeof GRIND_SIZES[number]>('medium')
  const [sizeGrams, setSizeGrams] = useState(250)
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const selectedVariant = availableVariants.find(
    (v) => v.roast === roast && v.grind === grind && v.size_grams === sizeGrams &&
      (grind === 'whole_bean' || v.grind_size === grindSize)
  )

  function handleAdd() {
  if (!selectedVariant) return
  addItem({
    kind: 'coffee',
    variantId: selectedVariant.id,
    productId: lotId,
    productName: lotName,
    grade,
    roast: selectedVariant.roast,
    sizeGrams: selectedVariant.size_grams,
    grind: selectedVariant.grind,
    grindSize: selectedVariant.grind_size,
    price: selectedVariant.price,
    image: null,
  })
  setAdded(true)
  setTimeout(() => { setAdded(false); openCart() }, 1200)
}

  if (availableVariants.length === 0) {
    return <p className="lot-out-of-stock">Currently out of stock — check back soon.</p>
  }

  return (
    <div className="lot-variant-selector">
      {availableRoasts.length > 1 && (
        <fieldset>
          <legend>Roast</legend>
          {availableRoasts.map((r) => (
            <button key={r} data-active={roast === r} onClick={() => setRoast(r)}>
              {r === 'medium' ? 'Medium' : 'Dark'}
            </button>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend>Format</legend>
        <button data-active={grind === 'whole_bean'} onClick={() => setGrind('whole_bean')}>Whole Bean</button>
        <button data-active={grind === 'ground'} onClick={() => setGrind('ground')}>Ground</button>
      </fieldset>

      {grind === 'ground' && (
        <fieldset>
          <legend>Grind size</legend>
          {GRIND_SIZES.map((g) => (
            <button key={g} data-active={grindSize === g} onClick={() => setGrindSize(g)}>{g}</button>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend>Size</legend>
        {SIZES.map((s) => (
          <button key={s} data-active={sizeGrams === s} onClick={() => setSizeGrams(s)}>{s}g</button>
        ))}
      </fieldset>

      {selectedVariant ? (
        <>
          <p className="lot-price">{formatKES(selectedVariant.price)}</p>
          <button className="lot-add-to-cart" onClick={handleAdd}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </>
      ) : (
        <p className="lot-variant-unavailable">This combination isn't currently available.</p>
      )}
    </div>
  )
}