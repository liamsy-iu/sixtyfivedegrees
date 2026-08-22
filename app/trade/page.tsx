import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { TradeEnquiryForm } from './TradeEnquiryForm'
import { TradeProcess } from './TradeProcess'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Wholesale Coffee Kenya — Specialty Coffee for Cafés and Businesses',
  description: 'Wholesale specialty coffee for Nairobi cafés, restaurants and offices. Single origin Kenyan arabica from 5kg, Classic and Premium grades. Request pricing.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/trade' },
}

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

        {/* At a glance */}
        <section className={styles.glance}>
          <div className={styles.container}>
            <div className={styles['glance-grid']}>
              <div className={styles.stat}>
                <p className={styles['stat-value']}>5kg</p>
                <p className={styles['stat-label']}>Minimum order</p>
              </div>
              <div className={styles.stat}>
                <p className={styles['stat-value']}>24 hrs</p>
                <p className={styles['stat-label']}>Enquiry response time</p>
              </div>
              <div className={styles.stat}>
                <p className={styles['stat-value']}>2</p>
                <p className={styles['stat-label']}>Grades available</p>
              </div>
              <div className={styles.stat}>
                <p className={styles['stat-value']}>Free</p>
                <p className={styles['stat-label']}>Delivery in Nairobi</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.how}>
          <div className={styles.container}>
            <p className={styles['sec-eye']}>How it works</p>
            <h2 className={styles['sec-title']}>Simple supply chain</h2>
            <TradeProcess />
          </div>
        </section>

        {/* Pricing */}
        <section className={styles.pricing} id="pricing">
          <div className={styles.container}>
            <p className={styles['sec-eye']} style={{ color: 'var(--color-crema)' }}>Wholesale rates</p>
            <h2 className={styles['sec-title']} style={{ color: 'var(--color-parchment)' }}>Get pricing for your business</h2>
            <p className={styles['pricing-note']}>Minimum order 5kg. Rates depend on volume — tell us what you need and we'll quote you directly.</p>
            <div className={styles['pricing-grid']}>
              <div className={styles['pricing-card']}>
                <svg viewBox="0 0 40 40" className={styles['grade-icon']} fill="none" stroke="currentColor" strokeWidth="1.6">
                  <ellipse cx="20" cy="20" rx="9" ry="13" />
                  <path d="M20 8 C15 13 15 27 20 32" />
                </svg>
                <p className={styles['pricing-grade']}>Classic grade</p>
                <p className={styles['pricing-desc']}>Excellent everyday drinking coffee. Perfect for house blends and filter programmes.</p>
                <a href="#enquiry" className={styles['pricing-cta']}>Request pricing</a>
              </div>
              <div className={styles['pricing-card']}>
                <svg viewBox="0 0 40 40" className={styles['grade-icon']} fill="none" stroke="currentColor" strokeWidth="1.6">
                  <ellipse cx="20" cy="20" rx="9" ry="13" />
                  <path d="M20 8 C15 13 15 27 20 32" />
                </svg>
                <p className={styles['pricing-grade']}>Premium grade</p>
                <p className={styles['pricing-desc']}>Top-grade Kenyan beans. Complex, vibrant, and exceptional as single origin on your espresso bar.</p>
                <a href="#enquiry" className={styles['pricing-cta']}>Request pricing</a>
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
                  <a href="mailto:hello@sixtyfivedegrees.com" className={styles['contact-link']}>hello@sixtyfivedegrees.com</a>
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
