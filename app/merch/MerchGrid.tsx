'use client'

import Image from 'next/image'
import styles from './MerchGrid.module.css'

const COLORWAYS = [
  { slug: 'brown', name: 'Roast Brown' },
  { slug: 'black', name: 'Black' },
  { slug: 'white', name: 'White' },
  { slug: 'grey', name: 'Stone Grey' },
  { slug: 'orange', name: 'Crema Orange' },
] as const

export function MerchGrid() {
  return (
    <div className={styles.grid}>
      {COLORWAYS.map((c) => (
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
          <p className={styles.hint}>Hover to see the back</p>
          <span className={styles.badge}>Coming soon</span>
        </div>
      ))}
    </div>
  )
}
