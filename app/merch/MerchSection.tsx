'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MerchOrderForm } from './MerchOrderForm'
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

export interface CartItem {
  colour: string
  size: string
  quantity: number
}

export function MerchSection() {
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({})
  const [cart, setCart] = useState<CartItem[]>([])

  function addToCart(colour: string) {
    const size = selectedSize[colour]
    if (!size) return
    setCart((prev) => {
      const existing = prev.find((i) => i.colour === colour && i.size === size)
      if (existing) {
        return prev.map((i) =>
          i.colour === colour && i.size === size ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { colour, size, quantity: 1 }]
    })
  }

  function changeQty(colour: string, size: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.colour === colour && i.size === size ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const totalKES = (HOODIE_PRICE_CENTS / 100) * totalItems

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
              onClick={() => addToCart(c.name)}
              disabled={!selectedSize[c.name]}
            >
              Add to order
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className={styles.cart}>
          <p className={styles['cart-title']}>Your order</p>
          {cart.map((i) => (
            <div key={`${i.colour}-${i.size}`} className={styles['cart-row']}>
              <span className={styles['cart-item']}>{i.colour} · {i.size}</span>
              <span className={styles['cart-qty']}>
                <button onClick={() => changeQty(i.colour, i.size, -1)} aria-label="Decrease">–</button>
                {i.quantity}
                <button onClick={() => changeQty(i.colour, i.size, 1)} aria-label="Increase">+</button>
              </span>
              <span className={styles['cart-price']}>{formatKES(HOODIE_PRICE_CENTS * i.quantity)}</span>
            </div>
          ))}
          <div className={styles['cart-total']}>
            <span>Total</span>
            <span>{formatKES(totalKES * 100)}</span>
          </div>
        </div>
      )}

      <div id="order" className={styles['order-section']}>
        <p className={styles['order-eye']}>Checkout</p>
        <h2 className={styles['order-title']}>
          {totalItems > 0 ? `${totalItems} ${totalItems === 1 ? 'hoodie' : 'hoodies'}` : 'Order a hoodie'}
        </h2>
        <p className={styles['order-sub']}>
          Add at least one hoodie above, then pay securely with M-Pesa or choose pay on delivery.
        </p>
        <MerchOrderForm cart={cart} totalKES={totalKES} />
      </div>
    </>
  )
}
