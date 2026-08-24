'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useMerchCartStore } from '@/lib/store/merchCart'
import { saveMerchOrder } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'
import { formatKES } from '@/lib/utils/pricing'
import styles from './page.module.css'

const HOODIE_PRICE_CENTS = 400000 // KES 4,000

// STK push prompts on the customer's phone typically expire well before
// this window closes, whether they enter their PIN, explicitly cancel, or
// just dismiss it. This is a safety-net ceiling, not the expected wait --
// the "Cancel and try again" link below gives an immediate way out
// regardless of how long Safaricom's callback actually takes to arrive.
const MPESA_TIMEOUT_MS = 90000

type Step = 'details' | 'payment' | 'mpesa_wait' | 'success' | 'cod_success'

export function MerchCheckoutClient() {
  const router = useRouter()
  const cart = useMerchCartStore((s) => s.items)
  const clearCart = useMerchCartStore((s) => s.clearCart)
  const total = useMerchCartStore((s) => s.total())

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

  // Redirect if cart is empty (matches the coffee checkout's own pattern)
  useEffect(() => {
    if (cart.length === 0 && (step === 'details' || step === 'payment')) router.push('/merch')
  }, [cart, step, router])

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
      clearCart()
      setStep('success')
    } else if (data?.payment_status === 'failed') {
      stopWaiting()
      setStep('payment')
      setError('Payment was cancelled or failed. Please try again.')
    }
  }, [clearCart])

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
      setError('Still waiting on that payment — you can try again.')
    }, MPESA_TIMEOUT_MS)
  }

  function handleCancelWait() {
    stopWaiting()
    setStep('payment')
    setError('')
  }

  function handleContinueToPayment() {
    if (!name || !phone || !email) { setError('Please fill in your name, phone, and email.'); return }
    setError('')
    if (!mpesaPhone) setMpesaPhone(phone)
    setStep('payment')
  }

  async function handlePlaceOrder() {
    if (cart.length === 0) return
    setError('')
    setLoading(true)

    const result = await saveMerchOrder({
      name, email, phone, address, message,
      items: cart, total_kes: total / 100, paymentMethod: payment,
    })
    if ('error' in result && result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    setOrderRef(result.orderRef!)

    if (payment === 'cod') {
      setLoading(false)
      clearCart()
      setStep('cod_success')
      return
    }

    const normalized = mpesaPhone.startsWith('254') ? mpesaPhone : `254${mpesaPhone.replace(/^0/, '')}`
    const pushRes = await fetch('/api/mpesa/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: result.orderId, phone: normalized, amount: total,
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

  if (cart.length === 0 && step !== 'success' && step !== 'cod_success') return null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {step === 'details' && (
          <Link href="/merch" className={styles.back}>
            <ArrowLeft size={14} strokeWidth={1.5} /> Continue shopping
          </Link>
        )}
        {step === 'payment' && (
          <button className={styles.back} onClick={() => setStep('details')}>
            <ArrowLeft size={14} strokeWidth={1.5} /> Back to details
          </button>
        )}

        {(step === 'details' || step === 'payment') && (
          <div className={styles.layout}>
            <div>
              <p className={styles['sec-eye']}>{step === 'details' ? '01 — Delivery details' : '02 — Payment'}</p>
              <h1 className={styles.title}>{step === 'details' ? 'Where should we deliver?' : 'How would you like to pay?'}</h1>

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
                  <button className={styles['submit-btn']} onClick={handleContinueToPayment}>
                    Continue to payment
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div>
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
                      : payment === 'mpesa' ? 'Pay Now' : 'Place order — pay on delivery'}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.summary}>
              <h2 className={styles['summary-title']}>Your cart</h2>
              <div className={styles['summary-items']}>
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
                <div className={`${styles['summary-row']} ${styles['summary-total']}`}><span>Total</span><span>{formatKES(total)}</span></div>
              </div>
            </div>
          </div>
        )}

        {step === 'mpesa_wait' && (
          <div className={styles['status-screen']}>
            <Loader2 size={40} strokeWidth={1} className={`${styles.spin} ${styles['status-icon-wait']}`} />
            <h2 className={styles['status-title']}>Check your phone</h2>
            <p className={styles['status-sub']}>
              A payment prompt for {formatKES(total)} has been sent to {mpesaPhone}. Enter your M-Pesa PIN to complete the order.
            </p>
            <button className={styles['cancel-link']} onClick={handleCancelWait}>
              Cancel and try again
            </button>
          </div>
        )}

        {(step === 'success' || step === 'cod_success') && (
          <div className={styles['status-screen']}>
            <CheckCircle2 size={40} strokeWidth={1} className={styles['status-icon-success']} />
            <h2 className={styles['status-title']}>Order confirmed — {orderRef}</h2>
            <p className={styles['status-sub']}>
              {step === 'success'
                ? <>Payment received{mpesaReceipt ? ` (M-Pesa code ${mpesaReceipt})` : ''}. We'll be in touch to confirm delivery.</>
                : <>We'll be in touch to confirm delivery — pay {formatKES(total)} on arrival.</>}
            </p>
            <Link href="/shop" className={styles['cancel-link']}>Continue shopping →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
