import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { KenyaMap } from '@/components/illustrations/KenyaMap/KenyaMap'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About 65 Degrees Coffee Roastery — Nairobi Roasted, Kenya Sourced',
  description: 'Traceable, single origin, SCA-graded coffee sourced from farmers across Kenya and roasted fresh in Nairobi. The story behind 65 Degrees, our grades, and where we currently source from.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/about' },
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>Our story</p>
            <h1 className={styles.title}>Nairobi roasted.<br /><em>Kenya sourced.</em></h1>
          </div>
          <div className={styles.deco}>65°</div>
        </section>

        <section className={styles.body}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles['content-text']}>
                <h2 className={styles['content-title']}>The name</h2>
                <p className={styles.para}>
                  65 Degrees refers to the ideal temperature at which milk should be steamed for
                  espresso drinks. At 65°C, the natural sugars in milk caramelise just enough — the
                  foam is silky, the sweetness is present, and the coffee isn't overwhelmed. Go above
                  this and you're drinking scalded milk. Stay below and the texture is wrong.
                </p>
                <p className={styles.para}>
                  It's a detail that most people don't notice when it's right, but immediately notice
                  when it's wrong. That precision — the kind that shows in the cup, not on a label —
                  is what we apply to everything we do.
                </p>

                <h2 className={styles['content-title']} style={{ marginTop: 'var(--space-8)' }}>The beans</h2>
                <p className={styles.para}>
                  We buy traceable, single origin, SCA-graded coffee from farmers across Kenya —
                  wherever we find it that clears that bar. Right now, that's Kiambu County; we're
                  also building relationships in Nyeri, Kirinyaga, and Murang&apos;a. Every lot is
                  roasted here in Nairobi into two grades — Classic and Premium — both available in
                  medium and dark roasts.
                </p>
                <p className={styles.para}>
                  We don&apos;t sell blends. We don&apos;t sell coffee from other countries. Kenya
                  grows some of the finest coffee in the world and we think it deserves to be the
                  focus. <Link href="/origins" className={styles['inline-link']}>See where we currently source from →</Link>
                </p>
              </div>

              <div className={styles['content-aside']}>
                <KenyaMap showAll highlight="kiambu" />
                <div className={styles.stat}>
                  <span className={styles['stat-num']}>100%</span>
                  <span className={styles['stat-label']}>Kenyan single origin</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles['stat-num']}>2</span>
                  <span className={styles['stat-label']}>Grades — Classic and Premium</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beyond retail */}
        <section className={styles.beyond}>
          <div className={styles.container}>
            <p className={styles.eye}>Beyond the cup</p>
            <h2 className={styles['content-title']}>The rest of the business</h2>
            <div className={styles['beyond-grid']}>
              <Link href="/trade" className={styles['beyond-card']}>
                <p className={styles['beyond-name']}>Trade</p>
                <p className={styles['beyond-desc']}>
                  We supply cafés and businesses in Nairobi with wholesale Classic and Premium
                  grade, from 5kg upward.
                </p>
                <span className={styles['beyond-link']}>View trade pricing →</span>
              </Link>
              <Link href="/export" className={styles['beyond-card']}>
                <p className={styles['beyond-name']}>Export</p>
                <p className={styles['beyond-desc']}>
                  We're opening our sourcing to international roasters — green coffee, graded and
                  cupped to SCA standards from mill to shipment.
                </p>
                <span className={styles['beyond-link']}>See the export program →</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
