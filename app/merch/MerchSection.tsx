'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { formatKES } from '@/lib/utils/pricing'
import styles from './MerchSection.module.css'

export const HOODIE_PRICE_CENTS = 400000 // KES 4,000

const COLOURWAYS = [
  { slug: 'brown', name: 'Roast Brown' },
  { slug: 'black', name: 'Black' },
  { slug: 'white', name: 'White' },
  { slug: 'grey', name: 'Stone Grey' },
  { slug: 'orange', name: 'Crema Orange' },
] as const

const SIZES = ['S', 'M', 'L', 'XL'] as const

export function MerchSection() {
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({})
  const [added, setAdded] = useState<Record<string, boolean>>({})
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  function handleAdd(colour: string, slug: string) {
    const size = selectedSize[colour]
    if (!size || added[colour]) return
    addItem({
      kind: 'merch',
      productName: '65 Degrees Hoodie',
      colour, size,
      price: HOODIE_PRICE_CENTS,
      image: `/merch/hoodie/${slug}-front.jpg`,
    })
    // Same pattern as the coffee product page: brief "Added" feedback on
    // the button itself, then open the shared cart drawer -- previously
    // this just called addItem() and stopped, so the drawer never opened.
    setAdded((prev) => ({ ...prev, [colour]: true }))
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [colour]: false }))
      openCart()
    }, 500)
  }

  return (
    <div className={styles.grid}>
      {COLOURWAYS.map((c) => (
        <div key={c.slug} className={styles.card}>
          <div className={styles['image-wrap']}>
            <Image
              src={`/merch/hoodie/${c.slug}-front.jpg`}
              alt={`65 Degrees hoodie, ${c.name}, front`}
              fill
              className={styles.front}
            />
            <Image
              src={`/merch/hoodie/${c.slug}-back.jpg`}
              alt={`65 Degrees hoodie, ${c.name}, back`}
              fill
              className={styles.back}
            />
          </div>
          <p className={styles.name}>{c.name}</p>
          <p className={styles.price}>{formatKES(HOODIE_PRICE_CENTS)}</p>

          <div className={styles.sizes}>
            {SIZES.map((s) => (
              <button
                key={s}
                className={`${styles['size-btn']} ${selectedSize[c.name] === s ? styles['size-active'] : ''}`}
                onClick={() => setSelectedSize((prev) => ({ ...prev, [c.name]: s }))}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className={styles.order}
            onClick={() => handleAdd(c.name, c.slug)}
            disabled={!selectedSize[c.name] || added[c.name]}
          >
            {added[c.name] ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      ))}
    </div>
  )
}
