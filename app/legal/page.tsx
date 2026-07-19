import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms',
  description: 'Privacy policy and terms of service for 65 Degrees Coffee Roastery.',
}

const LAST_UPDATED = 'July 2026'

export default function LegalPage() {
  return (
    <>
      <Nav />
      <main>
        <div className={styles.page}>
          <div className={styles.container}>
            <div className={styles.header}>
              <p className={styles.eye}>Legal</p>
              <h1 className={styles.title}>Privacy Policy &amp; Terms</h1>
              <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>
            </div>

            <div className={styles.content}>

              {/* Privacy Policy */}
              <section className={styles.section}>
                <h2 className={styles.h2}>Privacy Policy</h2>
                <p className={styles.lead}>
                  65 Degrees Coffee Roastery (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data
                  in accordance with the Kenya Data Protection Act, 2019.
                </p>

                <h3 className={styles.h3}>What we collect</h3>
                <p>When you place an order, we collect:</p>
                <ul className={styles.list}>
                  <li>Your name and phone number</li>
                  <li>Your email address (optional)</li>
                  <li>Your delivery address</li>
                  <li>Your order and payment details</li>
                </ul>
                <p>We do not store M-Pesa PINs or card numbers. Payment processing is handled by Safaricom M-Pesa.</p>

                <h3 className={styles.h3}>How we use your data</h3>
                <ul className={styles.list}>
                  <li>To process and deliver your order</li>
                  <li>To contact you about your order status</li>
                  <li>To respond to enquiries you send us</li>
                  <li>To improve our products and service</li>
                </ul>
                <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

                <h3 className={styles.h3}>How long we keep it</h3>
                <p>
                  We retain order records for 7 years as required by Kenyan tax law. You may request deletion
                  of your personal data at any time by contacting us — we will delete everything not required
                  for legal or financial compliance.
                </p>

                <h3 className={styles.h3}>Your rights</h3>
                <p>Under the Kenya Data Protection Act, you have the right to:</p>
                <ul className={styles.list}>
                  <li>Access the personal data we hold about you</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                </ul>
                <p>
                  To exercise any of these rights, email us at{' '}
                  <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a>.
                </p>

                <h3 className={styles.h3}>Cookies</h3>
                <p>
                  We use a single session cookie to keep your cart while you browse. We do not use
                  advertising or tracking cookies.
                </p>
              </section>

              <div className={styles.divider} />

              {/* Terms */}
              <section className={styles.section}>
                <h2 className={styles.h2}>Terms of Service</h2>
                <p className={styles.lead}>
                  By placing an order with 65 Degrees Coffee Roastery, you agree to the following terms.
                </p>

                <h3 className={styles.h3}>Orders and payment</h3>
                <ul className={styles.list}>
                  <li>All prices are in Kenyan Shillings (KES) and include VAT where applicable.</li>
                  <li>Orders are confirmed once payment is received or, for cash on delivery, once we confirm the order by phone.</li>
                  <li>We reserve the right to cancel an order if a product becomes unavailable after you have placed it. You will receive a full refund.</li>
                </ul>

                <h3 className={styles.h3}>Delivery</h3>
                <ul className={styles.list}>
                  <li>We currently deliver within Nairobi only.</li>
                  <li>Delivery takes 1–2 business days from order confirmation.</li>
                  <li>We will contact you to arrange a delivery window.</li>
                  <li>If you are unavailable at delivery, we will attempt to reschedule once.</li>
                  <li>Delivery fees are non-refundable once an order has been dispatched.</li>
                </ul>

                <h3 className={styles.h3}>Returns and refunds</h3>
                <ul className={styles.list}>
                  <li>If your order arrives damaged or incorrect, contact us within 24 hours and we will replace it at no cost.</li>
                  <li>We do not accept returns on opened coffee products for hygiene reasons.</li>
                  <li>If you are unsatisfied with the quality, contact us — we will make it right.</li>
                </ul>

                <h3 className={styles.h3}>Wholesale orders</h3>
                <ul className={styles.list}>
                  <li>Wholesale pricing applies to orders of 5kg and above.</li>
                  <li>Wholesale orders are confirmed by invoice. Payment terms are agreed per customer.</li>
                  <li>Custom pricing for orders above 100kg is negotiated directly.</li>
                </ul>

                <h3 className={styles.h3}>Contact</h3>
                <p>
                  For any questions about these terms, contact us at{' '}
                  <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a>.
                  We aim to respond within 1 business day.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
