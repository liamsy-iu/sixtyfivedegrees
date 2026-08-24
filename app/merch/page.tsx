import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { MerchSection } from './MerchSection'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Shop Merch — 65 Degrees Coffee Roastery',
  description: '65 Degrees hoodies, KES 4,000. Five colourways, pay securely with M-Pesa or on delivery.',
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
            <h1 className={styles.title}>Shop Merch</h1>
          </div>
        </section>

        <section className={styles.products}>
          <div className={styles.container}>
            <MerchSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
