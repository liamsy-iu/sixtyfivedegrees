'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.container}>
          <p className={styles.eye}>Single origin · Kenya · Nairobi roasted</p>
          <h1 className={styles.title}>The beans</h1>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles['filter-bar']}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Roast</span>
              {['all', 'medium', 'dark'].map(r => (
                <button key={r}
                  className={`${styles['filter-btn']} ${roastFilter === r ? styles.active : ''}`}
                  onClick={() => setRoastFilter(r)}>
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Grade</span>
              {['all', 'classic', 'premium'].map(g => (
                <button key={g}
                  className={`${styles['filter-btn']} ${gradeFilter === g ? styles.active : ''}`}
                  onClick={() => setGradeFilter(g)}>
                  {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className={styles.products}>
        <div className={styles.container}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No products match your filters.</p>
              <button onClick={() => { setRoastFilter('all'); setGradeFilter('all') }} className={styles['clear-btn']}>
                Clear filters
              </button>
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
  const isPremium   = p.grade === 'premium'
  const notes       = p.tasting_notes as string[]
  const image       = getProductImage(p.slug)
  const isOOS       = !p.is_available

  return (
    <Link href={`/shop/${p.slug}`} className={`${styles.card} ${isOOS ? styles['card-oos'] : ''}`}>
      {/* Full-bleed image */}
      <div className={styles['card-visual']}>
        {image ? (
          <Image
            src={image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles['card-img']}
          />
        ) : (
          <div className={styles['card-typo']}>
            <span className={styles['typo-mark']}>65°</span>
            <span className={styles['typo-name']}>Kenya</span>
            <span className={styles['typo-grade']}>{isPremium ? 'Premium' : 'Classic'}</span>
          </div>
        )}
        {isOOS && <div className={styles['oos-ribbon']}>Out of stock</div>}
      </div>

      {/* Info panel */}
      <div className={styles['card-info']}>
        <div className={styles['card-top']}>
          <div>
            <p className={styles['card-grade']}>{isPremium ? 'Premium' : 'Classic'} · {p.roast === 'medium' ? 'Medium roast' : 'Dark roast'}</p>
            <h2 className={styles['card-name']}>{p.name}</h2>
          </div>
          {!isOOS && lowestPrice && (
            <div className={styles['card-price-block']}>
              <span className={styles['card-price']}>{formatKES(lowestPrice)}</span>
              <span className={styles['card-per']}>/250g</span>
            </div>
          )}
          {isOOS && <span className={styles['oos-label']}>Unavailable</span>}
        </div>

        <div className={styles['card-notes']}>
          {notes.map((n, i) => (
            <span key={i} className={styles['card-note']}>
              {n}{i < notes.length - 1 && <span className={styles['note-sep']}> · </span>}
            </span>
          ))}
        </div>

        <div className={styles['card-footer']}>
          <span className={styles['card-cta']}>
            {isOOS ? 'View product' : 'Shop now'}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles['card-arrow']}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}
