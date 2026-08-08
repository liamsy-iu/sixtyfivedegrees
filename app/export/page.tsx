import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { ExportProcess } from './ExportProcess'
import { ExportEnquiryForm } from './ExportEnquiryForm'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Green Coffee Export — Kenyan Specialty Coffee, SCA Graded',
  description: 'Kenyan green coffee for international roasters, graded and cupped to SCA standards from mill to shipment. AA, AB, and PB available. Request samples.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/export' },
}

const STANDARDS = [
  { value: '< 0.70 aw', label: 'Water activity', desc: 'SCA ceiling for specialty grade — the strongest predictor of spoilage risk in transit.' },
  { value: '0 + ≤5', label: 'Defects per 350g', desc: 'Zero primary defects, no more than five secondary defects, per the SCA two-category system.' },
  { value: '80+', label: 'Cupping score', desc: 'Every offered lot is sample roasted and cupped to the SCA protocol before it’s listed.' },
  { value: '350g', label: 'Grading sample', desc: 'The SCA standard sample size for green grading, screened and sorted under calibrated light.' },
]

const GRADES = [
  { name: 'AA', screen: 'Screen 17–18', desc: 'The largest standard bean size. Not a cup-quality guarantee on its own — every lot is still cupped and scored regardless of size grade.' },
  { name: 'AB', screen: 'Screen 15–16', desc: 'A mix of two adjacent screen sizes, and the most widely planted grade in Kenya. Frequently outscores AA from the same lot in the cup.' },
  { name: 'PB', screen: 'Peaberry', desc: 'A single rounded bean formed when only one seed develops in the cherry, graded separately from the standard flat-bean sizes.' },
]

export default function ExportPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>For roasters &amp; importers</p>
            <h1 className={styles.title}>Green coffee,<br /><em>graded to standard.</em></h1>
            <p className={styles.sub}>
              We work directly with coffee farmers in Kiambu County, and we're opening that
              sourcing to international buyers for the first time. Every lot is milled, graded,
              and cupped against SCA green coffee standards before it's offered for export —
              nothing shipped that hasn't been verified first.
            </p>
          </div>
          <div className={styles.deco}>65°</div>
        </section>

        {/* Standards at a glance */}
        <section className={styles.standards}>
          <div className={styles.container}>
            <div className={styles['standards-grid']}>
              {STANDARDS.map((s) => (
                <div key={s.label} className={styles.standard}>
                  <p className={styles['standard-value']}>{s.value}</p>
                  <p className={styles['standard-label']}>{s.label}</p>
                  <p className={styles['standard-desc']}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className={styles.process}>
          <div className={styles.container}>
            <p className={styles['sec-eye']}>Mill to shipment</p>
            <h2 className={styles['sec-title']}>Our export process</h2>
            <ExportProcess />
          </div>
        </section>

        {/* Grades */}
        <section className={styles.grades}>
          <div className={styles.container}>
            <p className={styles['sec-eye']}>What's available</p>
            <h2 className={styles['sec-title']}>Grades we offer</h2>
            <div className={styles['grades-grid']}>
              {GRADES.map((g) => (
                <div key={g.name} className={styles['grade-card']}>
                  <p className={styles['grade-name']}>{g.name}</p>
                  <p className={styles['grade-screen']}>{g.screen}</p>
                  <p className={styles['grade-desc']}>{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enquiry */}
        <section className={styles.enquiry}>
          <div className={styles.container}>
            <div className={styles['enquiry-layout']}>
              <div>
                <p className={styles['sec-eye']}>Get in touch</p>
                <h2 className={styles['sec-title']}>Request samples</h2>
                <p className={styles['enquiry-sub']}>
                  Tell us about your roastery and what you're looking for. We'll follow up with
                  availability, current lot specs, and a sample offer.
                </p>
                <div className={styles['enquiry-contact']}>
                  <p className={styles['contact-label']}>Or email directly</p>
                  <a href="mailto:hello@sixtyfivedegrees.com" className={styles['contact-link']}>hello@sixtyfivedegrees.com</a>
                </div>
              </div>
              <ExportEnquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
