import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Set up a recurring coffee subscription and never run out of beans.',
}

const FREQUENCIES = [
  { value: 'weekly',   label: 'Weekly',       desc: 'Fresh every 7 days' },
  { value: 'biweekly', label: 'Every 2 weeks', desc: 'Ideal for 250g–500g bags' },
  { value: 'monthly',  label: 'Monthly',       desc: 'Larger bags recommended' },
]

export default function SubscribePage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>Never run out</p>
            <h1 className={styles.title}>Coffee on<br /><em>repeat.</em></h1>
            <p className={styles.sub}>
              Set your preferred beans, grind, and schedule. We&apos;ll remind you
              when it&apos;s time to reorder — you pay the same way you always do.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.how}>
          <div className={styles.container}>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles['step-num']}>01</span>
                <h3 className={styles['step-title']}>Set your preferences</h3>
                <p className={styles['step-desc']}>Choose your grade, roast, grind, quantity, and frequency below.</p>
              </div>
              <div className={styles.step}>
                <span className={styles['step-num']}>02</span>
                <h3 className={styles['step-title']}>We remind you</h3>
                <p className={styles['step-desc']}>When your next order is due, we&apos;ll send you a message with a link to pay and confirm.</p>
              </div>
              <div className={styles.step}>
                <span className={styles['step-num']}>03</span>
                <h3 className={styles['step-title']}>Delivered fresh</h3>
                <p className={styles['step-desc']}>Pay via M-Pesa or cash on delivery. Same pricing, same delivery, same freshness.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Frequency options */}
        <section className={styles.freq}>
          <div className={styles.container}>
            <div className={styles['freq-grid']}>
              {FREQUENCIES.map(f => (
                <div key={f.value} className={styles['freq-card']}>
                  <p className={styles['freq-label']}>{f.label}</p>
                  <p className={styles['freq-desc']}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className={styles['form-section']}>
          <div className={styles.container}>
            <div className={styles['form-layout']}>
              <div className={styles['form-text']}>
                <h2 className={styles['form-title']}>Set up your subscription</h2>
                <p className={styles['form-sub']}>
                  No lock-in. Pause or cancel any time by messaging us.
                  Prices match our standard retail rates.
                </p>
                <div className={styles['form-note']}>
                  <p className={styles['note-label']}>Retail prices apply</p>
                  <div className={styles['price-table']}>
                    <div className={styles['price-row']}><span>Classic · 250g</span><span>KES 750</span></div>
                    <div className={styles['price-row']}><span>Classic · 500g</span><span>KES 1,350</span></div>
                    <div className={styles['price-row']}><span>Classic · 1kg</span><span>KES 2,400</span></div>
                    <div className={styles['price-row']}><span>Premium · 250g</span><span>KES 1,100</span></div>
                    <div className={styles['price-row']}><span>Premium · 500g</span><span>KES 2,000</span></div>
                    <div className={styles['price-row']}><span>Premium · 1kg</span><span>KES 3,600</span></div>
                  </div>
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
