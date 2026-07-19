import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Delivery Information',
  description: 'Delivery areas, timelines, and fees for 65 Degrees Coffee Roastery in Nairobi.',
}

const AREAS = [
  { zone: 'CBD & City Centre', fee: 'KES 200', time: 'Same day or next day' },
  { zone: 'Westlands, Parklands, Highridge', fee: 'KES 200', time: 'Same day or next day' },
  { zone: 'Kilimani, Lavington, Kileleshwa', fee: 'KES 200', time: 'Same day or next day' },
  { zone: 'Karen, Langata', fee: 'KES 200', time: 'Next day' },
  { zone: 'South B, South C, Nairobi West', fee: 'KES 200', time: 'Same day or next day' },
  { zone: 'Eastleigh, Pangani, Ngara', fee: 'KES 200', time: 'Same day or next day' },
  { zone: 'Kasarani, Roysambu, Thika Road', fee: 'KES 200', time: 'Next day' },
  { zone: 'Umoja, Donholm, Embakasi', fee: 'KES 200', time: 'Next day' },
  { zone: 'Rongai, Ngong, Athi River', fee: 'KES 300', time: '1–2 business days' },
]

export default function DeliveryPage() {
  return (
    <>
      <Nav />
      <main>
        <div className={styles.page}>
          <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
              <p className={styles.eye}>Delivery</p>
              <h1 className={styles.title}>We deliver across Nairobi</h1>
              <p className={styles.sub}>
                Fresh-roasted coffee, delivered to your door. Free delivery on all orders above KES 3,000.
              </p>
            </div>

            {/* Key info cards */}
            <div className={styles.cards}>
              <div className={styles.card}>
                <p className={styles['card-num']}>1–2</p>
                <p className={styles['card-label']}>Business days delivery</p>
              </div>
              <div className={styles.card}>
                <p className={styles['card-num']}>KES 200</p>
                <p className={styles['card-label']}>Standard delivery fee</p>
              </div>
              <div className={styles.card}>
                <p className={styles['card-num']}>KES 3,000</p>
                <p className={styles['card-label']}>Free delivery above</p>
              </div>
            </div>

            {/* How it works */}
            <section className={styles.section}>
              <h2 className={styles.h2}>How delivery works</h2>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles['step-num']}>01</span>
                  <div>
                    <h3 className={styles['step-title']}>Place your order</h3>
                    <p className={styles['step-desc']}>
                      Order online and pay via M-Pesa or cash on delivery. You'll see a confirmation immediately.
                    </p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles['step-num']}>02</span>
                  <div>
                    <h3 className={styles['step-title']}>We confirm and pack</h3>
                    <p className={styles['step-desc']}>
                      We'll call or WhatsApp you within a few hours to confirm your delivery window. Orders placed before 12pm are usually delivered the same day.
                    </p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles['step-num']}>03</span>
                  <div>
                    <h3 className={styles['step-title']}>Delivered to your door</h3>
                    <p className={styles['step-desc']}>
                      Our rider will call when they're nearby. Please make sure someone is available to receive the order. If you miss us, we'll reschedule once at no extra charge.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery areas */}
            <section className={styles.section}>
              <h2 className={styles.h2}>Delivery areas &amp; fees</h2>
              <p className={styles.note}>
                All areas below are within Nairobi. We do not currently deliver outside Nairobi —
                if you're outside Nairobi, contact us for a custom quote.
              </p>
              <div className={styles.table}>
                <div className={styles['table-header']}>
                  <span>Area</span>
                  <span>Delivery fee</span>
                  <span>Estimated time</span>
                </div>
                {AREAS.map((area) => (
                  <div key={area.zone} className={styles['table-row']}>
                    <span>{area.zone}</span>
                    <span className={styles['fee']}>{area.fee}</span>
                    <span className={styles['time']}>{area.time}</span>
                  </div>
                ))}
                <div className={styles['table-row']} style={{ background: 'var(--color-crema-dim)' }}>
                  <span style={{ color: 'var(--color-highlands)', fontWeight: 500 }}>
                    Any area — order above KES 3,000
                  </span>
                  <span className={styles['fee']} style={{ color: 'var(--color-highlands)' }}>
                    Free
                  </span>
                  <span className={styles['time']}>As above</span>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className={styles.section}>
              <h2 className={styles.h2}>Common questions</h2>
              <div className={styles.faqs}>
                <div className={styles.faq}>
                  <h3 className={styles['faq-q']}>Can I pick up instead of delivery?</h3>
                  <p className={styles['faq-a']}>
                    Not yet — we&apos;re working on a collection point. For now, delivery only.
                  </p>
                </div>
                <div className={styles.faq}>
                  <h3 className={styles['faq-q']}>What if my order arrives damaged?</h3>
                  <p className={styles['faq-a']}>
                    Contact us within 24 hours at{' '}
                    <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a>{' '}
                    or WhatsApp us. We&apos;ll replace it at no cost.
                  </p>
                </div>
                <div className={styles.faq}>
                  <h3 className={styles['faq-q']}>Do you deliver on weekends?</h3>
                  <p className={styles['faq-a']}>
                    Yes — Saturday deliveries are available. Sunday is by arrangement only.
                  </p>
                </div>
                <div className={styles.faq}>
                  <h3 className={styles['faq-q']}>Can I change my delivery address after ordering?</h3>
                  <p className={styles['faq-a']}>
                    Yes, as long as the order hasn&apos;t been dispatched. Call or WhatsApp us as soon as possible.
                  </p>
                </div>
                <div className={styles.faq}>
                  <h3 className={styles['faq-q']}>Do you ship outside Kenya?</h3>
                  <p className={styles['faq-a']}>
                    Not through the website — contact us directly at{' '}
                    <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a>{' '}
                    for international shipping quotes.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className={styles.contact}>
              <h2 className={styles['contact-title']}>Questions about your order?</h2>
              <p className={styles['contact-sub']}>
                We&apos;re a small team and we respond fast.
              </p>
              <div className={styles['contact-links']}>
                <a href="mailto:hello@sixtyfivedegrees.com" className={styles['contact-link']}>
                  hello@sixtyfivedegrees.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
