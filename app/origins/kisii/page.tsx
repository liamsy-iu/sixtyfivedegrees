import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { KenyaMap } from '@/components/illustrations/KenyaMap/KenyaMap'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Kisii Coffee — A 65 Degrees Sourcing Origin in Kenya',
  description: 'Kisii County coffee: 1,700–2,400m altitude, washed process, SCA cupping score 85. Our current Rift Valley and Western Kenya lot, sourced through Misadhi Coffee.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/origins/kisii' },
}

const FACTS = [
  { label: 'Region', value: 'Kisii County, Rift Valley & Western Kenya' },
  { label: 'Altitude', value: '1,700 – 2,400m above sea level' },
  { label: 'Process', value: 'Washed (wet process)' },
  { label: 'Variety', value: 'SL28, SL34' },
  { label: 'Cupping score', value: '85 · Specialty grade' },
  { label: 'Source', value: 'Misadhi Coffee' },
]

const TASTING = [
  { note: 'Chocolate', desc: 'A cocoa depth in the base of the cup, from our current lot\'s cupping notes.' },
  { note: 'Bright lime & citrus', desc: 'A sharp, clean acidity that lifts the cup, again straight from our own cupping notes.' },
  { note: 'Juicy blackcurrant', desc: 'A jammy fruit sweetness that carries through the finish.' },
]

export default function KisiiPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles['hero-inner']}>
              <div>
                <p className={styles.eye}>Origin · Rift Valley &amp; Western</p>
                <h1 className={styles.title}>Kisii</h1>
                <p className={styles.sub}>
                  We buy traceable, single origin, SCA-graded coffee from across Kenya, wherever
                  we find it. Kisii is a different growing region entirely from our Central Kenya
                  origins, on a different mountain system closer to Lake Victoria. It&apos;s our
                  current lot from here, sourced through Misadhi Coffee.
                </p>
              </div>
              <div className={styles['hero-map']}>
                <KenyaMap highlight="kisii" />
              </div>
            </div>
          </div>
        </section>

        {/* Fast facts */}
        <section className={styles.facts}>
          <div className={styles.container}>
            <div className={styles['facts-grid']}>
              {FACTS.map(f => (
                <div key={f.label} className={styles.fact}>
                  <span className={styles['fact-label']}>{f.label}</span>
                  <span className={styles['fact-val']}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className={styles.story}>
          <div className={styles.container}>
            <div className={styles['story-layout']}>
              <div className={styles['story-text']}>
                <p className={styles['sec-eye']}>The land</p>
                <h2 className={styles['sec-title']}>A different mountain system entirely</h2>
                <p className={styles.para}>
                  Kisii sits in the highlands of Western Kenya, closer to Lake Victoria than
                  to Mount Kenya, at elevations between roughly 1,700 and 2,400 metres for the
                  lot we&apos;re currently sourcing. Coffee here shares a growing region with tea
                  and bananas, on fertile, well-drained highland soil.
                </p>
                <p className={styles.para}>
                  Kisii isn&apos;t as widely documented in specialty coffee circles as the
                  Mount Kenya counties, which is part of why we&apos;re glad to have found this
                  lot. It scored 85 on our cupping table, comfortably clearing the specialty
                  threshold, and processed the same way as our Central Kenya origins: fully
                  washed, pulped, fermented, and dried slowly.
                </p>
              </div>
              <div className={styles['story-aside']}>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Further from the roastery</p>
                  <p className={styles['aside-desc']}>
                    Kisii is roughly 300km from Nairobi, further than any of our Central Kenya
                    origins. We still get it roasted fresh within days of arrival.
                  </p>
                </div>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Sourced through Misadhi Coffee</p>
                  <p className={styles['aside-desc']}>
                    This lot comes to us through Misadhi Coffee, our current relationship in
                    the region.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tasting notes */}
        <section className={styles.tasting}>
          <div className={styles.container}>
            <p className={styles['sec-eye']} style={{ color: 'var(--color-crema)' }}>In the cup</p>
            <h2 className={styles['sec-title']} style={{ color: 'var(--color-parchment)' }}>What this Kisii lot tastes like</h2>
            <div className={styles['tasting-grid']}>
              {TASTING.map(t => (
                <div key={t.note} className={styles['tasting-card']}>
                  <h3 className={styles['tasting-note']}>{t.note}</h3>
                  <p className={styles['tasting-desc']}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles['cta-title']}>Taste this Kisii lot for yourself</h2>
            <p className={styles['cta-sub']}>
              AA grade, medium and dark roast. Delivered to your door in Nairobi.
            </p>
            <Link href="/shop" className={styles['cta-btn']}>Shop the beans</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}