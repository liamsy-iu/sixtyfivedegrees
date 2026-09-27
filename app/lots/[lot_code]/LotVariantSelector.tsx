'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { formatKES } from '@/lib/utils/pricing'
import styles from './LotVariantSelector.module.css'

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
  lotId, lotName, grade, variants, imageUrl, lotCode, region,
}: {
  lotId: string
  lotName: string
  grade: 'AA' | 'AB'
  variants: Variant[]
  imageUrl: string | null
  lotCode: string
  region: string
}) {
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
      image: imageUrl,
      lotCode,
      lotRegion: region,
    })
    setAdded(true)
    setTimeout(() => { setAdded(false); openCart() }, 1200)
  }

  if (availableVariants.length === 0) {
    return <p className={styles.outOfStock}>Currently out of stock — check back soon.</p>
  }

  return (
    <div className={styles.selector}>
      {availableRoasts.length > 1 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>Roast</span>
          <div className={styles.row}>
            {availableRoasts.map((r) => (
              <button
                key={r}
                className={`${styles.pill} ${roast === r ? styles.pillActive : ''}`}
                onClick={() => setRoast(r)}
              >
                {r === 'medium' ? 'Medium' : 'Dark'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.group}>
        <span className={styles.groupLabel}>Format</span>
        <div className={styles.row}>
          <button className={`${styles.pill} ${grind === 'whole_bean' ? styles.pillActive : ''}`} onClick={() => setGrind('whole_bean')}>Whole Bean</button>
          <button className={`${styles.pill} ${grind === 'ground' ? styles.pillActive : ''}`} onClick={() => setGrind('ground')}>Ground</button>
        </div>
      </div>

      {grind === 'ground' && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>Grind size</span>
          <div className={styles.row}>
            {GRIND_SIZES.map((g) => (
              <button key={g} className={`${styles.pill} ${grindSize === g ? styles.pillActive : ''}`} onClick={() => setGrindSize(g)}>
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.group}>
        <span className={styles.groupLabel}>Size</span>
        <div className={styles.row}>
          {SIZES.map((s) => (
            <button key={s} className={`${styles.pill} ${sizeGrams === s ? styles.pillActive : ''}`} onClick={() => setSizeGrams(s)}>
              {s}g
            </button>
          ))}
        </div>
      </div>

      {selectedVariant ? (
        <>
          <p className={styles.price}>{formatKES(selectedVariant.price)}</p>
          <button className={styles.addBtn} onClick={handleAdd}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </>
      ) : (
        <p className={styles.unavailable}>This combination isn't currently available.</p>
      )}
    </div>
  )
}