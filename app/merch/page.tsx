import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { MerchGrid } from './MerchGrid'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Merch — 65 Degrees Coffee Roastery',
  description: '65 Degrees hoodies, coming soon. Five colourways, roasted in Nairobi spirit.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/merch' },
}

export default function MerchPage() {
  return (
    <>
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>Wear the roast</p>
            <h1 className={styles.title}>Merch</h1>
            <p className={styles.sub}>
              Five hoodie colourways, carrying the 65° mark. Not orderable yet —
              we're finalising sizing and pricing before this goes live.
            </p>
          </div>
        </section>

        <section className={styles.products}>
          <div className={styles.container}>
            <MerchGrid />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
