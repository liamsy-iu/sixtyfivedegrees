'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { saveMerchOrder } from '@/lib/actions/admin'
import { formatKES } from '@/lib/utils/pricing'
import { HOODIE_PRICE_CENTS } from './MerchSection'
import styles from '@/app/trade/TradeEnquiryForm.module.css'

const COLOURS = ['Roast Brown', 'Black', 'White', 'Stone Grey', 'Crema Orange']
const SIZES = ['S', 'M', 'L', 'XL']

export function MerchOrderForm({ defaultColour }: { defaultColour?: string }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    colour: defaultColour ?? '', size: '', quantity: '1',
    address: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const qty = Math.max(1, parseInt(form.quantity, 10) || 1)
  const totalKES = (HOODIE_PRICE_CENTS / 100) * qty

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.email || !form.colour || !form.size) return
    setLoading(true)
    await saveMerchOrder({ ...form, total_kes: totalKES })
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <CheckCircle2 size={32} strokeWidth={1.5} className={styles['success-icon']} />
        <h3 className={styles['success-title']}>Order received</h3>
        <p className={styles['success-sub']}>
          We'll be in touch to confirm delivery and payment — {formatKES(totalKES * 100)} for {qty} {qty === 1 ? 'hoodie' : 'hoodies'}.
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
          <label className={styles.label}>Quantity</label>
          <input className={styles.input} type="number" min="1" value={form.quantity} onChange={e => update('quantity', e.target.value)} />
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
          <label className={styles.label}>Colour *</label>
          <select className={styles.input} value={form.colour} onChange={e => update('colour', e.target.value)}>
            <option value="">Select colour</option>
            {COLOURS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Size *</label>
          <select className={styles.input} value={form.size} onChange={e => update('size', e.target.value)}>
            <option value="">Select size</option>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Delivery address</label>
        <input className={styles.input} value={form.address} onChange={e => update('address', e.target.value)} placeholder="Where should this be delivered?" />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Anything else</label>
        <textarea
          className={styles.textarea}
          value={form.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Questions, sizing help, anything else…"
          rows={4}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Total</label>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'var(--color-roast)' }}>
          {formatKES(totalKES * 100)}
          <span style={{ fontSize: '13px', color: 'var(--color-bark)', marginLeft: '8px' }}>
            ({qty} × {formatKES(HOODIE_PRICE_CENTS)})
          </span>
        </p>
      </div>
      <button className={styles.submit} onClick={handleSubmit} disabled={loading || !form.name || !form.phone || !form.email || !form.colour || !form.size}>
        {loading ? 'Sending…' : 'Place order'}
      </button>
    </div>
  )
}
