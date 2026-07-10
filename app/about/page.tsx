import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'About' }

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
                  We source Kenyan green beans from specialty suppliers and roast them in Nairobi.
                  We sell two grades — Classic and Premium — both available in medium and dark roasts.
                  The Classic grade is exceptional everyday drinking coffee. The Premium grade is
                  top-tier Kenyan beans for those who want more complexity.
                </p>
                <p className={styles.para}>
                  We don't sell blends. We don't sell coffee from other countries. Kenya grows some
                  of the finest coffee in the world and we think it deserves to be the focus.
                </p>
              </div>

              <div className={styles['content-aside']}>
                <div className={styles.stat}>
                  <span className={styles['stat-num']}>65°</span>
                  <span className={styles['stat-label']}>Optimal milk temperature</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles['stat-num']}>2</span>
                  <span className={styles['stat-label']}>Grades — Classic and Premium</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles['stat-num']}>100%</span>
                  <span className={styles['stat-label']}>Kenyan single origin</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
