'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { saveExportEnquiry } from '@/lib/actions/admin'
import styles from './ExportEnquiryForm.module.css'

export function ExportEnquiryForm() {
  const [form, setForm] = useState({
    name: '', company: '', country: '', email: '', phone: '',
    product: '', volume: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.company || !form.country || !form.email) return
    setLoading(true)
    await saveExportEnquiry({
      name: form.name,
      company: form.company,
      country: form.country,
      email: form.email,
      phone: form.phone,
      product: form.product,
      volume: form.volume,
      message: form.message,
    })
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <CheckCircle2 size={32} strokeWidth={1.5} className={styles['success-icon']} />
        <h3 className={styles['success-title']}>Enquiry received</h3>
        <p className={styles['success-sub']}>
          We'll follow up within 2 business days to discuss samples, lot availability, and next steps.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Your name *</label>
          <input className={styles.input} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Full name" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Company *</label>
          <input className={styles.input} value={form.company} onChange={e => update('company', e.target.value)} placeholder="Roastery / importer name" />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Country *</label>
          <input className={styles.input} value={form.country} onChange={e => update('country', e.target.value)} placeholder="Where you're based" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email *</label>
          <input className={styles.input} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@company.com" />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Phone</label>
          <input className={styles.input} type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="Include country code" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Grade preference</label>
          <select className={styles.input} value={form.product} onChange={e => update('product', e.target.value)}>
            <option value="">Select grade</option>
            <option value="AA">AA</option>
            <option value="AB">AB</option>
            <option value="PB">PB (Peaberry)</option>
            <option value="Other/any grade — SCA 80+">Other / no preference — just SCA 80+</option>
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Estimated order volume</label>
        <select className={styles.input} value={form.volume} onChange={e => update('volume', e.target.value)}>
          <option value="">Select range</option>
          <option value="Sample only">Sample only, for now</option>
          <option value="1-5 bags (60kg)">1 – 5 bags (60kg each)</option>
          <option value="Part container">Part container</option>
          <option value="Full container">Full container (FCL)</option>
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Anything else</label>
        <textarea
          className={styles.textarea}
          value={form.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Target roast profile, certifications needed, shipping timeline, questions…"
          rows={4}
        />
      </div>
      <button className={styles.submit} onClick={handleSubmit} disabled={loading || !form.name || !form.company || !form.country || !form.email}>
        {loading ? 'Sending…' : 'Request samples'}
      </button>
    </div>
  )
}
