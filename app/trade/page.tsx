import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { TradeEnquiryForm } from './TradeEnquiryForm'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Trade — Wholesale Coffee' }

export default function TradePage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>For cafés and businesses</p>
            <h1 className={styles.title}>Supply your café with<br /><em>Kenyan specialty</em></h1>
            <p className={styles.sub}>
              Direct wholesale from a Nairobi roastery. Classic and Premium grades
              from 5kg. Free delivery within Nairobi. We ship worldwide.
            </p>
          </div>
          <div className={styles.deco}>65°</div>
        </section>

        {/* How it works */}
        <section className={styles.how}>
          <div className={styles.container}>
            <p className={styles['sec-eye']}>How it works</p>
            <h2 className={styles['sec-title']}>Simple supply chain</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles['step-num']}>01</span>
                <h3 className={styles['step-title']}>Send an enquiry</h3>
                <p className={styles['step-desc']}>Tell us your volume, grade preference, and delivery schedule. We'll get back to you within 24 hours.</p>
              </div>
              <div className={styles.step}>
                <span className={styles['step-num']}>02</span>
                <h3 className={styles['step-title']}>Taste the beans</h3>
                <p className={styles['step-desc']}>We'll send a sample kit before your first full order so you can taste both grades and pick the right fit for your menu.</p>
              </div>
              <div className={styles.step}>
                <span className={styles['step-num']}>03</span>
                <h3 className={styles['step-title']}>Regular supply</h3>
                <p className={styles['step-desc']}>Order as needed. Pay via M-Pesa or bank transfer. Free delivery in Nairobi. Worldwide shipping on request.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className={styles.pricing} id="pricing">
          <div className={styles.container}>
            <p className={styles['sec-eye']} style={{ color: 'var(--color-crema)' }}>Transparent pricing</p>
            <h2 className={styles['sec-title']} style={{ color: 'var(--color-parchment)' }}>Trade rates</h2>
            <p className={styles['pricing-note']}>Minimum order 5kg. All prices per kilogram of roasted coffee.</p>
            <div className={styles['pricing-grid']}>
              <div className={styles['pricing-card']}>
                <p className={styles['pricing-grade']}>Classic grade</p>
                <p className={styles['pricing-desc']}>Excellent everyday drinking coffee. Perfect for house blends and filter programmes.</p>
                <div className={styles.tiers}>
                  <div className={styles.tier}><span>5 – 30 kg</span><span>KES 1,500 / kg</span></div>
                  <div className={styles.tier}><span>31 – 100 kg</span><span>KES 1,400 / kg</span></div>
                  <div className={styles.tier}><span>100 kg +</span><span className={styles.custom}>Custom pricing</span></div>
                </div>
              </div>
              <div className={styles['pricing-card']}>
                <p className={styles['pricing-grade']}>Premium grade</p>
                <p className={styles['pricing-desc']}>Top-grade Kenyan beans. Complex, vibrant, and exceptional as single origin on your espresso bar.</p>
                <div className={styles.tiers}>
                  <div className={styles.tier}><span>5 – 30 kg</span><span>KES 2,000 / kg</span></div>
                  <div className={styles.tier}><span>31 – 100 kg</span><span>KES 1,900 / kg</span></div>
                  <div className={styles.tier}><span>100 kg +</span><span className={styles.custom}>Custom pricing</span></div>
                </div>
              </div>
            </div>
            <p className={styles['delivery-note']}>
              Free delivery within Nairobi · Worldwide shipping quoted per order
            </p>
          </div>
        </section>

        {/* Enquiry form */}
        <section className={styles.enquiry} id="enquiry">
          <div className={styles.container}>
            <div className={styles['enquiry-layout']}>
              <div className={styles['enquiry-text']}>
                <p className={styles['sec-eye']}>Get started</p>
                <h2 className={styles['sec-title']}>Send an enquiry</h2>
                <p className={styles['enquiry-sub']}>
                  Fill in the form and we'll reach out within 24 hours with a tailored quote and a sample kit offer.
                </p>
                <div className={styles['enquiry-contact']}>
                  <p className={styles['contact-label']}>Or reach us directly</p>
                  <a href="mailto:trade@sixtyfivedegrees.com" className={styles['contact-link']}>trade@sixtyfivedegrees.com</a>
                </div>
              </div>
              <TradeEnquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
