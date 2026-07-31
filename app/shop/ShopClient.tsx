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
          <p className={styles.eye}>Single origin · Kiambu, Kenya · 250g to 1kg</p>
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
  const isPremium   = p.grade === 'premium'
  const notes       = p.tasting_notes as string[]
  const image       = getProductImage(p.slug)
  const isOOS       = !p.is_available

  if (!isPremium) {
    return (
      <Link href={`/shop/${p.slug}`} className={`${styles.card} ${styles['classic-card']} ${isOOS ? styles['card-oos'] : ''}`}>
        <div className={styles['classic-body']}>
          <p className={styles['classic-grade']}>Classic · {p.roast === 'medium' ? 'Medium roast' : 'Dark roast'}</p>
          <h2 className={styles['classic-name']}>{p.name}</h2>
          <div className={styles['classic-notes']}>
            {notes.map((n, i) => <span key={i} className={styles['classic-note']}>{n}</span>)}
          </div>
          <div className={styles['classic-footer']}>
            {isOOS ? (
              <span className={styles['oos-label']}>Currently unavailable</span>
            ) : (
              <div className={styles['classic-price-block']}>
                <span className={styles['classic-price']}>{lowestPrice ? formatKES(lowestPrice) : '—'}</span>
                <span className={styles['classic-per']}>/250g</span>
              </div>
            )}
            <ArrowRight size={14} strokeWidth={1.5} className={styles['card-arrow']} />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/shop/${p.slug}`} className={`${styles.card} ${isOOS ? styles['card-oos'] : ''}`}>
      <div className={styles['card-visual']}>
        {image && (
          <Image src={image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 25vw" className={styles['card-img']} />
        )}
        {isOOS && <div className={styles['oos-ribbon']}>Out of stock</div>}
      </div>
      <div className={styles['card-info']}>
        <p className={styles['card-grade']}>Premium · {p.roast === 'medium' ? 'Medium roast' : 'Dark roast'}</p>
        <h2 className={styles['card-name']}>{p.name}</h2>
        {isOOS ? (
          <span className={styles['oos-label']}>Currently unavailable</span>
        ) : (
          <div className={styles['card-price-block']}>
            <span className={styles['card-price']}>{lowestPrice ? formatKES(lowestPrice) : '—'}</span>
            <span className={styles['card-per']}>/250g</span>
          </div>
        )}
        <div className={styles['card-notes']}>
          {notes.map((n, i) => <span key={i} className={styles['card-note']}>{n}</span>)}
        </div>
        <div className={styles['card-footer']}>
          <span className={styles['card-cta']}>{isOOS ? 'View product' : 'Shop now'}</span>
          <ArrowRight size={14} strokeWidth={1.5} className={styles['card-arrow']} />
        </div>
      </div>
    </Link>
  )
}
