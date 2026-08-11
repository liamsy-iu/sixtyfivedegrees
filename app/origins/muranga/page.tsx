import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Murang’a County Coffee — A Kenyan Sourcing Region | 65 Degrees',
  description: 'Murang’a County grows coffee on the Aberdare Ridge foothills at 1,340–1,950m — classic Central Kenya SL28/SL34 character, blackcurrant and citrus.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/origins/muranga' },
}

const FACTS = [
  { label: 'Region', value: 'Murang’a County, Central Kenya' },
  { label: 'Altitude', value: '1,340 – 1,950m above sea level' },
  { label: 'Soil', value: 'Volcanic, Aberdare Ridge foothills' },
  { label: 'Process', value: 'Washed' },
  { label: 'Variety', value: 'SL28, SL34' },
  { label: 'Growing areas', value: 'Maragua, Murang’a, Mitubiri, Makuyu' },
  { label: 'Rainfall', value: '~1,305mm annually' },
]

export default function MurangaPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>Origin · Central Kenya</p>
            <h1 className={styles.title}>Murang&apos;a</h1>
            <p className={styles.sub}>
              On the foothills of the Aberdare Ridge, between Kiambu and Nyeri, Murang&apos;a
              is one of Central Kenya&apos;s major growing counties — and one that rarely
              gets marketed on its own.
            </p>
          </div>
          <div className={styles['hero-deco']} aria-hidden="true">1,950m</div>
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
                <h2 className={styles['sec-title']}>A major growing county without a singular reputation</h2>
                <p className={styles.para}>
                  Murang&apos;a County sits on the foothills of the Aberdare Ridge, at
                  altitudes between 1,340 and 1,950 metres — comparable to its neighbours
                  Kiambu and Nyeri, and covering four main growing areas: Maragua, Murang&apos;a,
                  Mitubiri, and Makuyu.
                </p>
                <p className={styles.para}>
                  Being honest about it: Murang&apos;a doesn&apos;t have quite the singular
                  reputation that Nyeri or Kirinyaga have built in specialty circles. That's
                  partly circumstance rather than a difference in growing conditions — the
                  altitude, volcanic soil, and SL28/SL34 varieties are the same broad Central
                  Kenya story. A lot of Murang&apos;a coffee ends up in cooperative lots
                  blended with neighbouring counties rather than marketed as a distinct
                  single-origin name, which is exactly why it doesn't have the same
                  standalone name recognition — not because the coffee is lesser.
                </p>
                <p className={styles.para}>
                  When it is separated out and cupped on its own, Murang&apos;a coffee reads
                  as classic Central Kenya: SL28-driven blackcurrant and citrus acidity, on
                  the same volcanic red soil that defines the whole Mount Kenya–Aberdare band.
                </p>
              </div>
              <div className={styles['story-aside']}>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Between two well-known neighbours</p>
                  <p className={styles['aside-desc']}>
                    Murang&apos;a sits geographically between Kiambu to the south and Nyeri
                    to the north — sharing growing conditions with both, and often overlooked
                    for it.
                  </p>
                </div>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Why this page exists</p>
                  <p className={styles['aside-desc']}>
                    We&apos;d rather tell you what we genuinely know about a region — real
                    altitude, real geography, an honest note on why it&apos;s less
                    individually documented — than invent a tasting profile we can&apos;t
                    back up.
                  </p>
                </div>
              </div>
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
                wherever we find it. Murang&apos;a meets that bar on the same terms as its
                better-known neighbours: real elevation, real traceability, a cup that clears
                the SCA cupping threshold.
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
