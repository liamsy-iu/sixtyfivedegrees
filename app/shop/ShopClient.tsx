'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Lot } from '@/lib/lots'
import { formatKES } from '@/lib/utils/pricing'
import {
  getLotCardColorForIndex, getStartingPrice, getAvailableRoasts,
  getRoastLabel, formatNotes, isLotSoldOut,
} from '@/lib/utils/lotDisplay'
import styles from './page.module.css'

export function ShopClient({ lots }: { lots: Lot[] }) {
  const [roastFilter, setRoastFilter] = useState<string>('all')
  const [gradeFilter, setGradeFilter] = useState<string>('all')

  const filtered = lots.filter((l) => {
    if (roastFilter !== 'all' && !getAvailableRoasts(l.variants).includes(roastFilter as 'medium' | 'dark')) return false
    if (gradeFilter !== 'all' && l.grade !== gradeFilter) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => Number(isLotSoldOut(a)) - Number(isLotSoldOut(b)))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.container}>
          <p className={styles.eye}>Single origin · Kenya</p>
          <h1 className={styles.title}>The beans</h1>
          <Link href="/quiz" className={styles['quiz-link']}>Not sure which one? Find your roast →</Link>
        </div>
      </div>
      <div className={styles['filter-bar']}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Roast</span>
              {['all', 'medium', 'dark'].map((r) => (
                <button key={r} className={`${styles['filter-btn']} ${roastFilter === r ? styles.active : ''}`} onClick={() => setRoastFilter(r)}>
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles['filter-group']}>
              <span className={styles['filter-label']}>Grade</span>
              {['all', 'AA', 'AB'].map((g) => (
                <button key={g} className={`${styles['filter-btn']} ${gradeFilter === g ? styles.active : ''}`} onClick={() => setGradeFilter(g)}>
                  {g === 'all' ? 'All' : g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.products}>
        <div className={styles.container}>
          {lots.length === 0 ? (
            <div className={styles.empty}>
              <p>New lots are on their way. Check back soon.</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className={styles.empty}>
              <p>No lots match your filters.</p>
              <button onClick={() => { setRoastFilter('all'); setGradeFilter('all') }} className={styles['clear-btn']}>Clear filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {sorted.map((lot, i) => <LotCard key={lot.id} lot={lot} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LotCard({ lot, index }: { lot: Lot; index: number }) {
  const isOOS      = isLotSoldOut(lot)
  const start      = getStartingPrice(lot.variants)
  const roastLabel = getRoastLabel(getAvailableRoasts(lot.variants))
  const notes      = formatNotes(lot.tasting_notes)

  return (
    <Link
      href={`/lots/${lot.lot_code}`}
      className={`${styles.card} ${isOOS ? styles['card-oos'] : ''}`}
      style={{ '--card-bg': getLotCardColorForIndex(index) } as React.CSSProperties}
    >
      <div className={styles['card-visual']}>
        {lot.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lot.image_url}
            alt={lot.name}
            className={styles['card-img']}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        ) : (
          <div className={styles['card-typo']}>
            <span className={styles['typo-origin']}>{lot.name}</span>
            <span className={styles['typo-grade']}>{lot.grade} Grade</span>
          </div>
        )}
        {isOOS && <div className={styles['oos-band']}>Out of stock</div>}
      </div>
      <div className={styles['card-info']}>
        <div className={styles['card-meta']}>
          <span className={styles['card-tag']}>{lot.grade} grade</span>
          {roastLabel && (
            <>
              <span className={styles['card-dot']}>·</span>
              <span className={styles['card-tag']}>{roastLabel}</span>
            </>
          )}
        </div>
        {lot.image_url && <h2 className={styles['card-name']}>{lot.name}</h2>}
        {notes && <p className={styles['card-notes']}>{notes}</p>}
        <p className={styles['card-origin']}>{lot.region}{lot.process ? ` · ${lot.process}` : ''}</p>
      </div>
      <div className={styles['card-footer']}>
        <span className={styles['card-price']}>
          {isOOS ? 'Unavailable' : start ? `${formatKES(start.price)} /${start.sizeGrams}g` : '—'}
        </span>
        <span className={styles['card-btn']}>
          {isOOS ? 'View' : 'Shop now'} <ArrowRight size={12} strokeWidth={2} />
        </span>
      </div>
    </Link>
  )
}