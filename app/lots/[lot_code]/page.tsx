import { notFound } from 'next/navigation'
import { getLotByCode } from '@/lib/lots'

export default async function LotPage({
  params,
}: {
  params: Promise<{ lot_code: string }>
}) {
  const { lot_code } = await params
  const lot = await getLotByCode(lot_code)
  if (!lot) notFound()

  return (
    <main className="lot-page">
      <p className="lot-grade">{lot.grade} Grade</p>
      <h1 className="lot-name">{lot.name}</h1>
      <p className="lot-region">{lot.region}{lot.farm ? ` · ${lot.farm}` : ''}</p>

      {lot.status === 'sold_out' && (
        <p className="lot-status-badge">Currently sold out</p>
      )}

      <dl className="lot-details">
        {lot.process && (<><dt>Process</dt><dd>{lot.process}</dd></>)}
        {lot.altitude && (<><dt>Altitude</dt><dd>{lot.altitude}</dd></>)}
        {lot.variety && (<><dt>Variety</dt><dd>{lot.variety}</dd></>)}
        {lot.harvest_date && (<><dt>Harvest</dt><dd>{new Date(lot.harvest_date).toLocaleDateString()}</dd></>)}
        {lot.cupping_score && (<><dt>Cupping Score</dt><dd>{lot.cupping_score}</dd></>)}
      </dl>

      {lot.tasting_notes && (
        <section className="lot-tasting-notes">
          <h2>Tasting Notes</h2>
          <p>{lot.tasting_notes}</p>
        </section>
      )}

      {lot.story && (
        <section className="lot-story">
          <h2>The Story</h2>
          <p>{lot.story}</p>
        </section>
      )}

      {/* Roast level + grind-size + pack-size selectors and add-to-cart go here — wired in the variant work next */}
    </main>
  )
}