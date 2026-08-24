'use client'

import { useState, useRef, useCallback } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { saveMerchOrder } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'
import { formatKES } from '@/lib/utils/pricing'
import { HOODIE_PRICE_CENTS } from './MerchSection'
import styles from '@/app/trade/TradeEnquiryForm.module.css'

const COLOURS = ['Roast Brown', 'Black', 'White', 'Stone Grey', 'Crema Orange']
const SIZES = ['S', 'M', 'L', 'XL']

type Step = 'form' | 'mpesa_wait' | 'success' | 'cod_success'

export function MerchOrderForm({ defaultColour }: { defaultColour?: string }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    colour: defaultColour ?? '', size: '', quantity: '1',
    address: '', message: '',
  })
  const [payment, setPayment] = useState<'mpesa' | 'cod'>('mpesa')
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mpesaReceipt, setMpesaReceipt] = useState('')
  const [orderRef, setOrderRef] = useState('')

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const qty = Math.max(1, parseInt(form.quantity, 10) || 1)
  const totalKES = (HOODIE_PRICE_CENTS / 100) * qty

  function stopWaiting() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    if (channelRef.current) { channelRef.current.unsubscribe(); channelRef.current = null }
  }

  const checkStatus = useCallback(async (orderId: string) => {
    const supabase = createClient()
    const { data } = await supabase.from('merch_orders').select('payment_status, mpesa_receipt').eq('id', orderId).single()
    if (data?.payment_status === 'completed') {
      stopWaiting()
      setMpesaReceipt(data.mpesa_receipt ?? '')
      setStep('success')
    } else if (data?.payment_status === 'failed') {
      stopWaiting()
      setStep('form')
      setError('Payment was cancelled or failed. Please try again.')
    }
  }, [])

  function startWaiting(orderId: string) {
    const supabase = createClient()
    channelRef.current = supabase.channel(`merch-order-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'merch_orders', filter: `id=eq.${orderId}` },
        () => checkStatus(orderId))
      .subscribe()

    pollRef.current = setInterval(() => checkStatus(orderId), 3000)

    timeoutRef.current = setTimeout(() => {
      stopWaiting()
      setStep('form')
      setError('Payment timed out. Please try again.')
    }, 180000) // 3 minutes, same window as the main checkout
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.email || !form.colour || !form.size) return
    setError('')
    setLoading(true)

    const result = await saveMerchOrder({ ...form, total_kes: totalKES, paymentMethod: payment })
    if ('error' in result && result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    setOrderRef(result.orderRef!)

    if (payment === 'cod') {
      setLoading(false)
      setStep('cod_success')
      return
    }

    // M-Pesa STK push
    const normalized = form.phone.startsWith('254') ? form.phone : `254${form.phone.replace(/^0/, '')}`
    const pushRes = await fetch('/api/mpesa/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: result.orderId, phone: normalized, amount: totalKES * 100,
        orderRef: result.orderRef, orderType: 'merch',
      }),
    })

    if (!pushRes.ok) {
      setError('Failed to send M-Pesa prompt. Try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('mpesa_wait')
    startWaiting(result.orderId!)
  }

  if (step === 'success' || step === 'cod_success') {
    return (
      <div className={styles.success}>
        <CheckCircle2 size={32} strokeWidth={1.5} className={styles['success-icon']} />
        <h3 className={styles['success-title']}>Order confirmed — {orderRef}</h3>
        <p className={styles['success-sub']}>
          {step === 'success'
            ? <>Payment received{mpesaReceipt ? ` (M-Pesa code ${mpesaReceipt})` : ''}. We'll be in touch to confirm delivery.</>
            : <>We'll be in touch to confirm delivery — pay {formatKES(totalKES * 100)} on arrival.</>}
        </p>
      </div>
    )
  }

  if (step === 'mpesa_wait') {
    return (
      <div className={styles.success}>
        <Loader2 size={32} strokeWidth={1.5} className={styles['success-icon']} style={{ animation: 'spin 1.5s linear infinite' }} />
        <h3 className={styles['success-title']}>Check your phone</h3>
        <p className={styles['success-sub']}>
          A payment prompt for {formatKES(totalKES * 100)} has been sent to {form.phone}. Enter your M-Pesa PIN to complete the order — this can take up to a minute.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      {error && <p style={{ color: '#b91c1c', fontSize: '13px' }}>{error}</p>}
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
        <label className={styles.label}>Payment method</label>
        <select className={styles.input} value={payment} onChange={e => setPayment(e.target.value as 'mpesa' | 'cod')}>
          <option value="mpesa">M-Pesa — pay now</option>
          <option value="cod">Pay on delivery</option>
        </select>
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
        {loading ? 'Sending…' : payment === 'mpesa' ? `Pay ${formatKES(totalKES * 100)} via M-Pesa` : 'Place order — pay on delivery'}
      </button>
    </div>
  )
}
