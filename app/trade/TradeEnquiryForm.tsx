'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { saveTradeEnquiry } from '@/lib/actions/admin'
import styles from './TradeEnquiryForm.module.css'

export function TradeEnquiryForm() {
  const [form, setForm] = useState({
    name: '', business: '', email: '', phone: '',
    grade: '', volume: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.email) return
    setLoading(true)
    await saveTradeEnquiry({
      name: form.name,
      business: form.business,
      email: form.email,
      phone: form.phone,
      grade: form.grade,
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
          We'll be in touch within 24 hours with a tailored quote and sample kit offer.
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
          <label className={styles.label}>Business name</label>
          <input className={styles.input} value={form.business} onChange={e => update('business', e.target.value)} placeholder="Café / restaurant name" />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Email *</label>
          <input className={styles.input} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Phone *</label>
          <input className={styles.input} type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0712 345 678" />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Grade interested in</label>
          <select className={styles.input} value={form.grade} onChange={e => update('grade', e.target.value)}>
            <option value="">Select grade</option>
            <option value="classic">Classic</option>
            <option value="premium">Premium</option>
            <option value="both">Both — help me decide</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Estimated monthly volume</label>
          <select className={styles.input} value={form.volume} onChange={e => update('volume', e.target.value)}>
            <option value="">Select range</option>
            <option value="5-30kg">5 – 30 kg</option>
            <option value="31-100kg">31 – 100 kg</option>
            <option value="100kg+">100 kg +</option>
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Anything else</label>
        <textarea
          className={styles.textarea}
          value={form.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Roast preferences, delivery area, current supplier, questions…"
          rows={4}
        />
      </div>
      <button className={styles.submit} onClick={handleSubmit} disabled={loading || !form.name || !form.phone || !form.email}>
        {loading ? 'Sending…' : 'Send enquiry'}
      </button>
    </div>
  )
}
