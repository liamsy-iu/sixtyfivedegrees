'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMerchCartStore } from '@/lib/store/merchCart'
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
  const { items: cart, addItem, updateQuantity, total, itemCount } = useMerchCartStore()

  function handleAdd(colour: string) {
    const size = selectedSize[colour]
    if (!size) return
    addItem(colour, size)
  }

  const totalItems = itemCount()
  const totalKES = total() / 100

  return (
    <>
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
              onClick={() => handleAdd(c.name)}
              disabled={!selectedSize[c.name]}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className={styles.cart}>
          <p className={styles['cart-title']}>Your cart</p>
          {cart.map((i) => (
            <div key={`${i.colour}-${i.size}`} className={styles['cart-row']}>
              <span className={styles['cart-item']}>{i.colour} · {i.size}</span>
              <span className={styles['cart-qty']}>
                <button onClick={() => updateQuantity(i.colour, i.size, -1)} aria-label="Decrease">–</button>
                {i.quantity}
                <button onClick={() => updateQuantity(i.colour, i.size, 1)} aria-label="Increase">+</button>
              </span>
              <span className={styles['cart-price']}>{formatKES(HOODIE_PRICE_CENTS * i.quantity)}</span>
            </div>
          ))}
          <div className={styles['cart-total']}>
            <span>Total</span>
            <span>{formatKES(totalKES * 100)}</span>
          </div>
          <Link href="/merch/checkout" className={styles.checkout}>
            Proceed to checkout
          </Link>
        </div>
      )}
    </>
  )
}
