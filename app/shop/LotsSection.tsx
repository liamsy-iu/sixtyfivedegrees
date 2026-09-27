import Link from 'next/link'
import type { Lot } from '@/lib/lots'
import { formatKES } from '@/lib/utils/pricing'
import styles from './LotsSection.module.css'

export function LotsSection({ lots }: { lots: Lot[] }) {
  if (lots.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Current Lots</h2>
      <div className={styles.grid}>
        {lots.map((lot) => {
          const availablePrices = lot.variants.filter((v) => v.is_available).map((v) => v.price)
          const fromPrice = availablePrices.length ? Math.min(...availablePrices) : null
          const isSoldOut = lot.status === 'sold_out' || availablePrices.length === 0

          return (
            <Link
              key={lot.id}
              href={`/lots/${lot.lot_code}`}
              className={`${styles.card} ${isSoldOut ? styles.cardSoldOut : ''}`}
            >
              <p className={styles.grade}>{lot.grade} Grade · {lot.region}</p>
              <h3 className={styles.name}>{lot.name}</h3>
              {fromPrice !== null && (
                <p className={styles.price}>From {formatKES(fromPrice)}</p>
              )}
              {lot.tasting_notes && <p className={styles.notes}>{lot.tasting_notes}</p>}
              <span className={styles.cta}>View Lot →</span>
              {isSoldOut && <div className={styles.oosBanner}>Sold Out</div>}
            </Link>
          )
        })}
      </div>
    </section>
  )
}