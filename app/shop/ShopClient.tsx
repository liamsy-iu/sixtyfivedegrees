'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatKES, formatSize } from '@/lib/utils/pricing'
import styles from './page.module.css'

interface Variant { id: string; size_grams: number; grind: string; price: number; is_available: boolean }
interface Product {
  id: string; name: string; slug: string; grade: string; roast: string
  description: string; tasting_notes: string[]; retail_variants: Variant[]
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

  const medium = filtered.filter(p => p.roast === 'medium')
  const dark   = filtered.filter(p => p.roast === 'dark')

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.container}>
          <p className={styles['sec-eye']}>Retail · 250g to 1kg</p>
          <h1 className={styles.title}>The beans</h1>
          <p className={styles.subtitle}>
            Single origin Kenyan coffee. Whole bean or ground. Delivered to your door in Nairobi.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles['filter-bar']}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Roast</span>
              {['all', 'medium', 'dark'].map(r => (
                <button
                  key={r}
                  className={`${styles['filter-btn']} ${roastFilter === r ? styles.active : ''}`}
                  onClick={() => setRoastFilter(r)}
                >
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Grade</span>
              {['all', 'classic', 'premium'].map(g => (
                <button
                  key={g}
                  className={`${styles['filter-btn']} ${gradeFilter === g ? styles.active : ''}`}
                  onClick={() => setGradeFilter(g)}
                >
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
            <>
              {medium.length > 0 && (
                <RoastSection label="Medium roast" products={medium} />
              )}
              {dark.length > 0 && (
                <RoastSection label="Dark roast" products={dark} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function RoastSection({ label, products }: { label: string; products: Product[] }) {
  return (
    <div className={styles['roast-group']}>
      <div className={styles['roast-label']}>
        <span>{label}</span>
        <div className={styles['roast-line']} />
      </div>
      <div className={styles.grid}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product: p }: { product: Product }) {
  const lowestPrice = getLowestPrice(p.retail_variants)
  const isPremium = p.grade === 'premium'

  return (
    <Link href={`/shop/${p.slug}`} className={styles.card}>
      <div className={`${styles.visual} ${styles[p.roast]}`}>
        <span className={styles.badge} data-grade={p.grade}>
          {isPremium ? 'Premium' : 'Classic'}
        </span>
        <BagIllustration grade={p.grade} roast={p.roast} />
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{p.name}</h2>
        <p className={styles.meta}>{p.roast === 'medium' ? 'Medium' : 'Dark'} · Whole bean or ground</p>
        <p className={styles.notes}>{(p.tasting_notes as string[]).join(' · ')}</p>
        <div className={styles.footer}>
          <div>
            <span className={styles.price}>
              {lowestPrice ? `From ${formatKES(lowestPrice)}` : '—'}
            </span>
            <span className={styles['price-label']}> / 250g</span>
          </div>
          <ArrowRight size={16} strokeWidth={1.5} className={styles.arrow} />
        </div>
      </div>
    </Link>
  )
}

function BagIllustration({ grade, roast }: { grade: string; roast: string }) {
  const isPremium = grade === 'premium'
  const accent = isPremium ? '#C8922A' : 'rgba(245,240,232,0.35)'
  const fill   = isPremium ? 'rgba(200,146,42,0.1)' : 'rgba(245,240,232,0.05)'
  return (
    <div className={styles['bag-wrap']}>
      <svg viewBox="0 0 100 140" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect x="6" y="18" width="88" height="114" rx="5" fill={fill} stroke={accent} strokeWidth="0.8"/>
        <rect x="20" y="7" width="60" height="16" rx="3" fill={fill} stroke={accent} strokeWidth="0.5"/>
        <line x1="18" y1="56" x2="82" y2="56" stroke={accent} strokeWidth="0.4" strokeOpacity="0.5"/>
        <line x1="18" y1="100" x2="82" y2="100" stroke={accent} strokeWidth="0.4" strokeOpacity="0.5"/>
      </svg>
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'rgba(245,240,232,0.4)', marginBottom: 4 }}>65°</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: isPremium ? '#C8922A' : 'rgba(245,240,232,0.5)', lineHeight: 1, marginBottom: 4 }}>Kenya</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>{isPremium ? 'Premium' : 'Classic'}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', marginTop: 6 }}>{roast} roast</div>
      </div>
    </div>
  )
}
