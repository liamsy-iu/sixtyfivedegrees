import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { QuizFlow } from './QuizFlow'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Find Your Roast — 65 Degrees Coffee Roastery',
  description: 'Three questions. One match. Find the 65 Degrees grade and roast built for how you actually drink coffee.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/quiz' },
}

export default function QuizPage() {
  return (
    <>
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>60 seconds, no signup</p>
            <h1 className={styles.title}>Find your roast.</h1>
          </div>
        </section>
        <QuizFlow />
      </main>
      <Footer />
    </>
  )
}
