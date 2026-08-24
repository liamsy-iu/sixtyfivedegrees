'use client'

import { useState, useRef, useCallback } from 'react'
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { saveMerchOrder } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'
import { formatKES } from '@/lib/utils/pricing'
import type { CartItem } from './MerchSection'
import { HOODIE_PRICE_CENTS } from './MerchSection'
import styles from './MerchOrderForm.module.css'

type Step = 'details' | 'payment' | 'mpesa_wait' | 'success' | 'cod_success'

export function MerchOrderForm({ cart, totalKES }: { cart: CartItem[]; totalKES: number }) {
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [payment, setPayment] = useState<'mpesa' | 'cod'>('mpesa')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mpesaReceipt, setMpesaReceipt] = useState('')
  const [orderRef, setOrderRef] = useState('')

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  function handleContinueToPayment() {
    if (!name || !phone || !email) { setError('Please fill in your name, phone, and email.'); return }
    setError('')
    if (!mpesaPhone) setMpesaPhone(phone)
    setStep('payment')
  }

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
      setStep('payment')
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
      setStep('payment')
      setError('Payment timed out. Please try again.')
    }, 180000)
  }

  async function handlePlaceOrder() {
    if (cart.length === 0) return
    setError('')
    setLoading(true)

    const result = await saveMerchOrder({
      name, email, phone, address, message,
      items: cart, total_kes: totalKES, paymentMethod: payment,
    })
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

    const normalized = mpesaPhone.startsWith('254') ? mpesaPhone : `254${mpesaPhone.replace(/^0/, '')}`
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

  if (step === 'mpesa_wait') {
    return (
      <div className={styles['status-screen']}>
        <Loader2 size={40} strokeWidth={1} className={`${styles.spin} ${styles['status-icon-wait']}`} />
        <h2 className={styles['status-title']}>Check your phone</h2>
        <p className={styles['status-sub']}>
          A payment prompt for {formatKES(totalKES * 100)} has been sent to {mpesaPhone}. Enter your M-Pesa PIN to complete the order — this can take up to a minute.
        </p>
      </div>
    )
  }

  if (step === 'success' || step === 'cod_success') {
    return (
      <div className={styles['status-screen']}>
        <CheckCircle2 size={40} strokeWidth={1} className={styles['status-icon-success']} />
        <h2 className={styles['status-title']}>Order confirmed — {orderRef}</h2>
        <p className={styles['status-sub']}>
          {step === 'success'
            ? <>Payment received{mpesaReceipt ? ` (M-Pesa code ${mpesaReceipt})` : ''}. We'll be in touch to confirm delivery.</>
            : <>We'll be in touch to confirm delivery — pay {formatKES(totalKES * 100)} on arrival.</>}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      {/* Left — form */}
      <div>
        <p className={styles['sec-eye']}>{step === 'details' ? '01 — Delivery details' : '02 — Payment'}</p>
        <h2 className={styles.title}>{step === 'details' ? 'Where should we deliver?' : 'How would you like to pay?'}</h2>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} strokeWidth={1.5} />
            {error}
          </div>
        )}

        {step === 'details' && (
          <div>
            <div className={styles.field}>
              <label className={styles.label}>Full name *</label>
              <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone *</label>
              <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678" type="tel" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email *</label>
              <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Delivery address</label>
              <input className={styles.input} value={address} onChange={e => setAddress(e.target.value)} placeholder="Apartment, street, area" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Anything else <span className={styles.optional}>(optional)</span></label>
              <textarea className={styles.textarea} value={message} onChange={e => setMessage(e.target.value)} placeholder="Questions, sizing help…" rows={3} />
            </div>
            <button className={styles['submit-btn']} onClick={handleContinueToPayment} disabled={cart.length === 0}>
              Continue to payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div>
            <button className={styles['back-btn']} onClick={() => setStep('details')}>
              <ArrowLeft size={13} strokeWidth={1.5} /> Back to delivery details
            </button>
            <div className={styles['pay-options']}>
              <button
                className={`${styles['pay-option']} ${payment === 'mpesa' ? styles['pay-active'] : ''}`}
                onClick={() => setPayment('mpesa')}
              >
                <span className={styles['pay-name']}>M-Pesa</span>
                <span className={styles['pay-desc']}>STK push to your phone</span>
              </button>
              <button
                className={`${styles['pay-option']} ${payment === 'cod' ? styles['pay-active'] : ''}`}
                onClick={() => setPayment('cod')}
              >
                <span className={styles['pay-name']}>Cash on delivery</span>
                <span className={styles['pay-desc']}>Pay when you receive</span>
              </button>
            </div>

            {payment === 'mpesa' && (
              <div className={styles.field}>
                <label className={styles.label}>M-Pesa phone number</label>
                <input
                  className={styles.input}
                  value={mpesaPhone}
                  onChange={e => setMpesaPhone(e.target.value)}
                  placeholder="0712 345 678"
                  type="tel"
                />
                <p className={styles.hint}>You'll receive a payment prompt on this number</p>
              </div>
            )}

            <button className={styles['submit-btn']} onClick={handlePlaceOrder} disabled={loading}>
              {loading
                ? <><Loader2 size={16} strokeWidth={1.5} className={styles.spin} /> Processing…</>
                : payment === 'mpesa' ? `Pay ${formatKES(totalKES * 100)} via M-Pesa` : 'Place order — pay on delivery'}
            </button>
          </div>
        )}
      </div>

      {/* Right — cart summary */}
      <div className={styles.summary}>
        <h2 className={styles['summary-title']}>Your cart</h2>
        <div className={styles['summary-items']}>
          {cart.length === 0 && <p className={styles['summary-item-meta']}>No items yet — add a hoodie above.</p>}
          {cart.map(item => (
            <div key={`${item.colour}-${item.size}`} className={styles['summary-item']}>
              <div>
                <p className={styles['summary-item-name']}>65 Degrees Hoodie</p>
                <p className={styles['summary-item-meta']}>{item.colour} · {item.size} · ×{item.quantity}</p>
              </div>
              <span className={styles['summary-item-price']}>{formatKES(HOODIE_PRICE_CENTS * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className={styles['summary-totals']}>
          <div className={`${styles['summary-row']} ${styles['summary-total']}`}><span>Total</span><span>{formatKES(totalKES * 100)}</span></div>
        </div>
      </div>
    </div>
  )
}
