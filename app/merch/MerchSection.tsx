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

export function MerchSection() {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  function chooseColour(name: string) {
    setSelected(name)
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
            <p className={styles.hint}>Hover to see the back</p>
            <button className={styles.order} onClick={() => chooseColour(c.name)}>
              Order this colour
            </button>
          </div>
        ))}
      </div>

      <div id="order" className={styles['order-section']}>
        <p className={styles['order-eye']}>Place an order</p>
        <h2 className={styles['order-title']}>
          {selected ? `${selected} hoodie` : 'Order a hoodie'}
        </h2>
        <p className={styles['order-sub']}>
          {formatKES(HOODIE_PRICE_CENTS)} each. We'll confirm delivery and payment when we reach out.
        </p>
        <MerchOrderForm defaultColour={selected} key={selected} />
      </div>
    </>
  )
}
