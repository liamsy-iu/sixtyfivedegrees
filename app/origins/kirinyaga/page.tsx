import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { KenyaMap } from '@/components/illustrations/KenyaMap/KenyaMap'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Kirinyaga County Coffee — A Kenyan Sourcing Region | 65 Degrees',
  description: 'Kirinyaga County produces some of Kenya\'s most complex arabica — 1,400–1,900m on Mount Kenya\'s eastern slopes, floral and blackcurrant notes, full body.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/origins/kirinyaga' },
}

const FACTS = [
  { label: 'Region', value: 'Kirinyaga County, Central Kenya' },
  { label: 'Altitude', value: '1,400 – 1,900m above sea level' },
  { label: 'Soil', value: 'Deep volcanic red soil' },
  { label: 'Process', value: 'Washed (double fermentation)' },
  { label: 'Variety', value: 'SL28, SL34' },
  { label: 'Main harvest', value: 'October – December' },
  { label: 'Fly crop', value: 'May – July' },
]

const TASTING = [
  { note: 'Blackcurrant & cranberry', desc: 'Vibrant, tart fruit acidity — related to Nyeri’s profile but with a brighter, more cranberry-leaning edge.' },
  { note: 'Floral', desc: 'A perfumed lift that shows up more consistently here than in most other Mount Kenya regions.' },
  { note: 'Chocolate & citrus', desc: 'A fuller, sweeter base under the fruit, with a clean citrus finish.' },
  { note: 'Full body', desc: 'Structured and full despite the lively acidity, holding up well as the cup cools.' },
]

export default function KirinyagaPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles['hero-inner']}>
              <div>
                <p className={styles.eye}>Origin · Central Kenya</p>
                <h1 className={styles.title}>Kirinyaga</h1>
                <p className={styles.sub}>
                  Nyeri's eastern neighbour on the slopes of Mount Kenya, Kirinyaga's varied
                  terrain — from steep upper mountain ground to gentler hillsides — produces
                  some of Kenya's most layered, complex cups.
                </p>
              </div>
              <div className={styles['hero-map']}>
                <KenyaMap highlight="kirinyaga" />
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
                <h2 className={styles['sec-title']}>Why Kirinyaga's terrain produces such layered coffee</h2>
                <p className={styles.para}>
                  Kirinyaga County sits on the eastern slopes of Mount Kenya, between 1,400
                  and 1,900 metres above sea level. Unlike Nyeri's more uniform northern
                  exposure, Kirinyaga's terrain ranges from steep, high mountain ground down
                  to gentler hillside farms — a genuine range of microclimates within one
                  county.
                </p>
                <p className={styles.para}>
                  That variation is a large part of why Kirinyaga lots tend to read as more
                  layered in the cup. Farms at different elevations and aspects on the same
                  mountain ripen at different rates, and cooperatives blending lots across
                  that range end up with real complexity rather than a single flat note.
                </p>
                <p className={styles.para}>
                  Like its neighbours, Kirinyaga runs on SL28 and SL34, processed washed with
                  a double fermentation step that's become close to a regional signature —
                  pulp, ferment, wash, ferment again, then a long dry on raised beds.
                </p>
              </div>
              <div className={styles['story-aside']}>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Bimodal rains</p>
                  <p className={styles['aside-desc']}>
                    Around 1,100–1,500mm of rain a year, split across two seasons. That's what
                    makes the October–December main crop and the smaller May–July fly crop
                    possible, the same rhythm as the rest of the Mount Kenya counties.
                  </p>
                </div>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Snow-capped neighbour</p>
                  <p className={styles['aside-desc']}>
                    Kirinyaga's farms look directly up at Mount Kenya's peak. At this altitude
                    and latitude, the cooler air alone does real work — slowing ripening and
                    concentrating the sugars and acids that end up in the cup.
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
            <h2 className={styles['sec-title']} style={{ color: 'var(--color-parchment)' }}>What Kirinyaga tastes like</h2>
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
                wherever we find it. Kirinyaga is exactly the kind of origin that meets that
                bar: real elevation, real traceability to specific washing stations, and a
                cup that clears the SCA threshold consistently.
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
