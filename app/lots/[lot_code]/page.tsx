import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLotByCode } from '@/lib/lots'
import { LotVariantSelector } from './LotVariantSelector'
import styles from './page.module.css'

export default async function LotPage({
  params,
}: {
  params: Promise<{ lot_code: string }>
}) {
  const { lot_code } = await params
  const lot = await getLotByCode(lot_code)
  if (!lot) notFound()

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/shop" className={styles.back}>← Back to shop</Link>

        <div className={styles.layout}>
          <div className={styles.visual}>
            {lot.image_url ? (
              <img src={lot.image_url} alt={lot.name} />
            ) : (
              <div className={styles['visual-fallback']}>
                <p className={styles['visual-fallback-name']}>{lot.name}</p>
              </div>
            )}
          </div>

          <div>
            <p className={styles.badge}>{lot.grade} Grade</p>
            <h1 className={styles.name}>{lot.name}</h1>
            <p className={styles.region}>{lot.region}{lot.farm ? ` · ${lot.farm}` : ''}</p>

            {lot.status === 'sold_out' && (
              <p className={styles['status-badge']}>Currently sold out</p>
            )}

            <dl className={styles.details}>
              {lot.process && (<><dt>Process</dt><dd>{lot.process}</dd></>)}
              {lot.altitude && (<><dt>Altitude</dt><dd>{lot.altitude}</dd></>)}
              {lot.variety && (<><dt>Variety</dt><dd>{lot.variety}</dd></>)}
              {lot.harvest_date && (<><dt>Harvest</dt><dd>{new Date(lot.harvest_date).toLocaleDateString()}</dd></>)}
              {lot.cupping_score && (<><dt>Cupping Score</dt><dd>{lot.cupping_score}</dd></>)}
            </dl>

            {lot.tasting_notes && (
              <div className={styles.section}>
                <h2>Tasting Notes</h2>
                <p>{lot.tasting_notes}</p>
              </div>
            )}

            {lot.story && (
              <div className={styles.section}>
                <h2>The Story</h2>
                <p>{lot.story}</p>
              </div>
            )}

            <LotVariantSelector
              lotId={lot.id}
              lotName={lot.name}
              grade={lot.grade}
              variants={lot.variants}
              imageUrl={lot.image_url}
              lotCode={lot.lot_code}
              region={lot.region}
            />
          </div>
        </div>
      </div>
    </main>
  )
}