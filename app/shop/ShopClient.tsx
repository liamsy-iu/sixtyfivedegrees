'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { formatKES } from '@/lib/utils/pricing'
import { getProductImage } from '@/lib/utils/productImages'
import styles from './page.module.css'

interface Variant { id: string; size_grams: number; grind: string; price: number; is_available: boolean }
interface Product {
  id: string; name: string; slug: string; grade: string; roast: string
  description: string; tasting_notes: string[]; is_available: boolean; retail_variants: Variant[]
}

function getLowestPrice(variants: Variant[]): number | null {
  const prices = variants.filter(v => v.size_grams === 250 && v.is_available).map(v => v.price)
  return prices.length ? Math.min(...prices) : null
}

const CARD_COLORS: Record<string, string> = {
  'kenya-premium-dark':   '#5C2D0E',
  'kenya-premium-medium': '#1E4035',
  'kenya-classic-dark':   '#1A2744',
  'kenya-classic-medium': '#7A3120',
}

export function ShopClient({ products }: { products: Product[] }) {
  const [roastFilter, setRoastFilter] = useState<string>('all')
  const [gradeFilter, setGradeFilter] = useState<string>('all')

  const filtered = products.filter(p => {
    if (roastFilter !== 'all' && p.roast !== roastFilter) return false
    if (gradeFilter !== 'all' && p.grade !== gradeFilter) return false
    return true
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.container}>
          <p className={styles.eye}>Single origin · Kiambu, Kenya</p>
          <h1 className={styles.title}>The beans</h1>
        </div>
      </div>
      <div className={styles['filter-bar']}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Roast</span>
              {['all', 'medium', 'dark'].map(r => (
                <button key={r} className={`${styles['filter-btn']} ${roastFilter === r ? styles.active : ''}`} onClick={() => setRoastFilter(r)}>
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Grade</span>
              {['all', 'classic', 'premium'].map(g => (
                <button key={g} className={`${styles['filter-btn']} ${gradeFilter === g ? styles.active : ''}`} onClick={() => setGradeFilter(g)}>
                  {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.products}>
        <div className={styles.container}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No products match your filters.</p>
              <button onClick={() => { setRoastFilter('all'); setGradeFilter('all') }} className={styles['clear-btn']}>Clear filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product: p }: { product: Product }) {
  const lowestPrice = getLowestPrice(p.retail_variants)
  const notes       = p.tasting_notes as string[]
  const image       = getProductImage(p.slug)
  const isOOS       = !p.is_available
  const isPremium   = p.grade === 'premium'
  const roastLabel  = p.roast === 'medium' ? 'Medium roast' : 'Dark roast'
  const cardColor   = CARD_COLORS[p.slug] ?? '#2D3A2E'

  return (
    <Link href={`/shop/${p.slug}`} className={`${styles.card} ${isOOS ? styles['card-oos'] : ''}`}
      style={{ '--card-bg': cardColor } as React.CSSProperties}>
      <div className={styles['card-visual']}>
        {image ? (
          <Image src={image} alt={p.name} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles['card-img']} />
        ) : (
          <div className={styles['card-typo']}>
            <span className={styles['typo-origin']}>Kenya</span>
            <span className={styles['typo-grade']}>{isPremium ? 'Premium' : 'Classic'}</span>
          </div>
        )}
        {isOOS && <div className={styles['oos-band']}>Out of stock</div>}
      </div>
      <div className={styles['card-info']}>
        <div className={styles['card-meta']}>
          <span className={styles['card-tag']}>{isPremium ? 'Premium' : 'Classic'}</span>
          <span className={styles['card-dot']}>·</span>
          <span className={styles['card-tag']}>{roastLabel}</span>
        </div>
        <h2 className={styles['card-name']}>{p.name}</h2>
        <p className={styles['card-notes']}>{notes.join(' · ')}</p>
        <p className={styles['card-origin']}>Kiambu, Kenya · Washed</p>
      </div>
      <div className={styles['card-footer']}>
        <span className={styles['card-price']}>
          {isOOS ? 'Unavailable' : lowestPrice ? `${formatKES(lowestPrice)} /250g` : '—'}
        </span>
        <span className={styles['card-btn']}>
          {isOOS ? 'View' : 'Shop now'} <ArrowRight size={12} strokeWidth={2} />
        </span>
      </div>
    </Link>
  )
}
