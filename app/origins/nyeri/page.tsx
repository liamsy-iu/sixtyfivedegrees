import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Nyeri County Coffee — A Kenyan Sourcing Region | 65 Degrees',
  description: 'Nyeri County produces some of Kenya\'s most celebrated arabica — 1,600–2,000m on Mount Kenya\'s northern slopes, SL28 and SL34, intense blackcurrant acidity.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/origins/nyeri' },
}

const FACTS = [
  { label: 'Region', value: 'Nyeri County, Central Kenya' },
  { label: 'Altitude', value: '1,600 – 2,000m above sea level' },
  { label: 'Soil', value: 'Deep red volcanic soil' },
  { label: 'Process', value: 'Washed (double-washed)' },
  { label: 'Variety', value: 'SL28, SL34' },
  { label: 'Main harvest', value: 'October – December' },
  { label: 'Fly crop', value: 'May – July' },
]

const TASTING = [
  { note: 'Blackcurrant', desc: 'Intense, wine-like cassis acidity — the profile Nyeri is best known for among specialty buyers.' },
  { note: 'Tomato', desc: 'A savoury, structural complexity in the mid-palate that’s unusual outside Kenyan coffee, and especially pronounced here.' },
  { note: 'Red fruit & citrus', desc: 'Layered on top of the blackcurrant — plum, red berry, and a clean citrus lift.' },
  { note: 'Wine-textured body', desc: 'Juicy and full despite the high acidity, with a long finish that keeps evolving.' },
]

export default function NyeriPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>Origin · Central Kenya</p>
            <h1 className={styles.title}>Nyeri</h1>
            <p className={styles.sub}>
              On the northern slopes of Mount Kenya, with the Aberdare Range to the west,
              Nyeri County produces what a lot of specialty buyers consider the most
              structurally complete washed coffee in the world.
            </p>
          </div>
          <div className={styles['hero-deco']} aria-hidden="true">2,000m</div>
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
                <h2 className={styles['sec-title']}>Why Nyeri sits at the top of the cupping table</h2>
                <p className={styles.para}>
                  Nyeri County sits on the northern and northwestern slopes of Mount Kenya,
                  between 1,600 and 2,000 metres above sea level. The Aberdare Range runs
                  parallel to the west, shaping the two distinct rainy seasons the county
                  depends on for its main and fly crops.
                </p>
                <p className={styles.para}>
                  Almost every specialty-grade lot from Nyeri is built on SL28, with SL34
                  playing a supporting role. SL28 in particular performs best above 1,500
                  metres, where cooler temperatures slow cherry ripening and concentrate the
                  acids and sugars that define the cup — and Nyeri's altitude band sits
                  squarely in that zone.
                </p>
                <p className={styles.para}>
                  Cherries are processed through Kenya's signature double-washed method —
                  pulped, fermented, washed, fermented again, and dried slowly on raised beds.
                  It's a more demanding process than a single wash, and it's a large part of
                  why Nyeri coffee has the clarity it's known for.
                </p>
              </div>
              <div className={styles['story-aside']}>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Two harvests a year</p>
                  <p className={styles['aside-desc']}>
                    The main crop runs October through December; a smaller fly crop follows
                    from May to July. Mount Kenya's two rainy seasons make this possible
                    across most of the central highlands, Nyeri included.
                  </p>
                </div>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>SL28's natural home</p>
                  <p className={styles['aside-desc']}>
                    Kirinyaga, Murang'a, and Embu all grow excellent SL28 on the same Mount
                    Kenya massif. Nyeri's specific combination of altitude and northern
                    exposure is what specialty buyers point to when explaining why it so
                    often expresses more intensely here.
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
            <h2 className={styles['sec-title']} style={{ color: 'var(--color-parchment)' }}>What Nyeri tastes like</h2>
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

        {/* Where this fits */}
        <section className={styles.connection}>
          <div className={styles.container}>
            <div className={styles['connection-inner']}>
              <p className={styles['sec-eye']}>Where this fits</p>
              <h2 className={styles['connection-title']}>
                Part of the standard, not a permanent source
              </h2>
              <p className={styles['connection-body']}>
                We buy traceable, single origin, SCA-graded coffee from across Kenya —
                wherever we find it. Nyeri is exactly the kind of origin that meets that bar:
                high altitude, real traceability back to specific farms and washing stations,
                and a cup that consistently clears the SCA cupping threshold.
              </p>
              <p className={styles['connection-body']}>
                That doesn't mean it's what's currently in your bag. Our current lot is from{' '}
                <Link href="/origins/kiambu" className={styles['inline-link']}>Kiambu</Link> — see
                what's actually in stock below, or read about{' '}
                <Link href="/origins" className={styles['inline-link']}>the other Central Kenya regions</Link> we look to.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles['cta-title']}>See what's currently in stock</h2>
            <p className={styles['cta-sub']}>
              Every lot, whichever region it comes from, is single origin and SCA-graded before it reaches you.
            </p>
            <Link href="/shop" className={styles['cta-btn']}>Shop the beans</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
