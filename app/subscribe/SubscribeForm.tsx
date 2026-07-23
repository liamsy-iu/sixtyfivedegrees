'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { createSubscriptionAction } from '@/lib/actions/subscriptions'
import { formatSize } from '@/lib/utils/pricing'
import styles from './page.module.css'

const NAIROBI_AREAS = [
  'CBD / City Centre', 'Westlands', 'Kilimani / Lavington', 'Karen / Langata',
  'Parklands / Highridge', 'Eastleigh', 'South B / South C',
  'Umoja / Donholm', 'Thika Road (Kasarani / Roysambu)', 'Rongai / Ngong', 'Other (Nairobi)',
]

export function SubscribeForm() {
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    grade: 'classic' as 'classic' | 'premium',
    roast: 'medium' as 'medium' | 'dark',
    sizeGrams: 500,
    grind: 'whole_bean' as 'whole_bean' | 'ground',
    quantity: 1,
    frequency: 'biweekly' as 'weekly' | 'biweekly' | 'monthly',
    line1: '', area: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.customerName || !form.customerPhone || !form.line1 || !form.area) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    const result = await createSubscriptionAction({
      customerName:    form.customerName,
      customerPhone:   form.customerPhone,
      customerEmail:   form.customerEmail,
      grade:           form.grade,
      roast:           form.roast,
      sizeGrams:       form.sizeGrams,
      grind:           form.grind,
      quantity:        form.quantity,
      frequency:       form.frequency,
      deliveryAddress: { line1: form.line1, area: form.area, city: 'Nairobi' },
    })
    setLoading(false)
    if ('error' in result && result.error) { setError(result.error); return }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <CheckCircle2 size={36} strokeWidth={1.5} className={styles['success-icon']} />
        <h3 className={styles['success-title']}>Subscription set up!</h3>
        <p className={styles['success-sub']}>
          We&apos;ll reach out when your first order is due. You can pause or cancel any time.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles['field-group']}>
        <p className={styles['group-label']}>Your details</p>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input className={styles.input} value={form.customerName} onChange={e => update('customerName', e.target.value)} placeholder="Full name" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone *</label>
            <input className={styles.input} type="tel" value={form.customerPhone} onChange={e => update('customerPhone', e.target.value)} placeholder="0712 345 678" />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email <span className={styles.optional}>(optional)</span></label>
          <input className={styles.input} type="email" value={form.customerEmail} onChange={e => update('customerEmail', e.target.value)} placeholder="you@example.com" />
        </div>
      </div>

      <div className={styles['field-group']}>
        <p className={styles['group-label']}>Your coffee</p>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Grade</label>
            <select className={styles.input} value={form.grade} onChange={e => update('grade', e.target.value)}>
              <option value="classic">Classic</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Roast</label>
            <select className={styles.input} value={form.roast} onChange={e => update('roast', e.target.value)}>
              <option value="medium">Medium roast</option>
              <option value="dark">Dark roast</option>
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Size</label>
            <select className={styles.input} value={form.sizeGrams} onChange={e => update('sizeGrams', Number(e.target.value))}>
              <option value={250}>250g</option>
              <option value={500}>500g</option>
              <option value={1000}>1kg</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Grind</label>
            <select className={styles.input} value={form.grind} onChange={e => update('grind', e.target.value)}>
              <option value="whole_bean">Whole bean</option>
              <option value="ground">Ground</option>
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Quantity per order</label>
          <select className={styles.input} value={form.quantity} onChange={e => update('quantity', Number(e.target.value))}>
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n} bag{n > 1 ? 's' : ''} ({formatSize(form.sizeGrams * n)} total)</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles['field-group']}>
        <p className={styles['group-label']}>Frequency</p>
        <div className={styles['freq-options']}>
          {(['weekly', 'biweekly', 'monthly'] as const).map(f => (
            <button
              key={f}
              className={`${styles['freq-option']} ${form.frequency === f ? styles['freq-active'] : ''}`}
              onClick={() => update('frequency', f)}
              type="button"
            >
              <span className={styles['freq-name']}>
                {f === 'weekly' ? 'Weekly' : f === 'biweekly' ? 'Every 2 weeks' : 'Monthly'}
              </span>
              <span className={styles['freq-sub']}>
                {f === 'weekly' ? 'Every 7 days' : f === 'biweekly' ? '250g–500g bags' : 'Best for 1kg bags'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles['field-group']}>
        <p className={styles['group-label']}>Delivery address</p>
        <div className={styles.field}>
          <label className={styles.label}>Street address *</label>
          <input className={styles.input} value={form.line1} onChange={e => update('line1', e.target.value)} placeholder="Apartment, street name" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Area *</label>
          <select className={styles.input} value={form.area} onChange={e => update('area', e.target.value)}>
            <option value="">Select your area</option>
            {NAIROBI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <button className={styles['submit-btn']} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Setting up…' : 'Set up subscription'}
      </button>
      <p className={styles.disclaimer}>No payment now. We&apos;ll contact you before each delivery.</p>
    </div>
  )
}
