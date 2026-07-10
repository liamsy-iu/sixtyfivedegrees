'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { createOrderAction } from '@/lib/actions/orders'
import { formatKES, formatSize, formatGrind } from '@/lib/utils/pricing'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

const FREE_DELIVERY = 300000
const DELIVERY_FEE  = 20000

const NAIROBI_AREAS = [
  'CBD / City Centre',
  'Westlands',
  'Kilimani / Lavington',
  'Karen / Langata',
  'Parklands / Highridge',
  'Eastleigh',
  'South B / South C',
  'Umoja / Donholm',
  'Thika Road (Kasarani / Roysambu)',
  'Rongai / Ngong',
  'Other (Nairobi)',
]

type Step = 'details' | 'payment' | 'mpesa_wait' | 'success'

export function CheckoutClient() {
  const router = useRouter()
  const items   = useCartStore((s) => s.items)
  const total   = useCartStore((s) => s.total())
  const clear   = useCartStore((s) => s.clearCart)

  const subtotal  = total
  const delivery  = subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE
  const grandTotal = subtotal + delivery

  const [step,    setStep]   = useState<Step>('details')
  const [loading, setLoading] = useState(false)
  const [error,   setError]  = useState('')

  // Form state
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [address, setAddress] = useState('')
  const [area,    setArea]    = useState('')
  const [payment, setPayment] = useState<'mpesa' | 'cod'>('mpesa')
  const [mpesaPhone, setMpesaPhone] = useState('')

  // M-Pesa state
  const [orderId,   setOrderId]   = useState('')
  const [orderRef,  setOrderRef]  = useState('')
  const [mpesaCode, setMpesaCode] = useState('')
  const channelRef = useRef<any>(null)
  const pollRef    = useRef<NodeJS.Timeout | null>(null)

  // Redirect if cart empty
  useEffect(() => {
    if (items.length === 0 && step === 'details') router.push('/shop')
  }, [items, step, router])

  async function handleSubmitDetails() {
    if (!name || !phone || !address || !area) { setError('Please fill in all required fields.'); return }
    setError('')
    setStep('payment')
    if (!mpesaPhone) setMpesaPhone(phone)
  }

  async function handlePlaceOrder() {
    setLoading(true)
    setError('')

    try {
      const normalized = phone.startsWith('254') ? phone : `254${phone.replace(/^0/, '')}`
      const result = await createOrderAction({
        type: 'retail',
        customerName:  name,
        customerEmail: email,
        customerPhone: normalized,
        deliveryAddress: { line1: address, area, city: 'Nairobi' },
        deliveryFee: delivery,
        items: items.map(i => ({
          productName: i.productName,
          grade:       i.grade,
          roast:       i.roast,
          size:        `${formatSize(i.sizeGrams)}`,
          grind:       i.grind,
          quantity:    i.quantity,
          unitPrice:   i.price,
        })),
        paymentMethod: payment,
      })

      if ('error' in result) { setError(result.error ?? 'Order failed.'); setLoading(false); return }

      setOrderId(result.orderId)
      setOrderRef(result.orderRef)

      if (payment === 'cod') {
        clear()
        setStep('success')
        setLoading(false)
        return
      }

      // M-Pesa STK push
      const mpesaNorm = mpesaPhone.startsWith('254') ? mpesaPhone : `254${mpesaPhone.replace(/^0/, '')}`
      const pushRes = await fetch('/api/mpesa/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: result.orderId, phone: mpesaNorm, amount: grandTotal, orderRef: result.orderRef }),
      })

      if (!pushRes.ok) { setError('Failed to send M-Pesa prompt. Try again.'); setLoading(false); return }

      setLoading(false)
      setStep('mpesa_wait')
      startPolling(result.orderId)
    } catch (e) {
      console.error(e)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const checkStatus = useCallback(async (oid: string) => {
    const supabase = createClient()
    const { data } = await supabase.from('orders').select('payment_status, mpesa_receipt').eq('id', oid).single()
    if (data?.payment_status === 'completed') {
      stopPolling()
      setMpesaCode(data.mpesa_receipt ?? '')
      clear()
      setStep('success')
    } else if (data?.payment_status === 'failed') {
      stopPolling()
      setStep('payment')
      setError('Payment was cancelled or failed. Please try again.')
    }
  }, [clear])

  function startPolling(oid: string) {
    const supabase = createClient()
    channelRef.current = supabase.channel(`order-${oid}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${oid}` },
        () => checkStatus(oid))
      .subscribe()

    pollRef.current = setInterval(() => checkStatus(oid), 3000)

    const handleVisible = () => { if (!document.hidden) checkStatus(oid) }
    document.addEventListener('visibilitychange', handleVisible)

    setTimeout(() => {
      stopPolling()
      if (step === 'mpesa_wait') { setStep('payment'); setError('Payment timed out. Please try again.') }
    }, 180000)
  }

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    if (channelRef.current) { channelRef.current.unsubscribe(); channelRef.current = null }
  }

  useEffect(() => () => stopPolling(), [])

  if (items.length === 0 && step === 'details') return null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back link */}
        {step === 'details' && (
          <Link href="/shop" className={styles.back}>
            <ArrowLeft size={14} strokeWidth={1.5} /> Continue shopping
          </Link>
        )}
        {step === 'payment' && (
          <button className={styles.back} onClick={() => setStep('details')}>
            <ArrowLeft size={14} strokeWidth={1.5} /> Back to details
          </button>
        )}

        {step !== 'mpesa_wait' && step !== 'success' && (
          <div className={styles.layout}>
            {/* Left — form */}
            <div className={styles.form}>
              <p className={styles['sec-eye']}>
                {step === 'details' ? '01 — Delivery details' : '02 — Payment'}
              </p>
              <h1 className={styles.title}>
                {step === 'details' ? 'Where should we deliver?' : 'How would you like to pay?'}
              </h1>

              {error && (
                <div className={styles.error}>
                  <AlertCircle size={16} strokeWidth={1.5} />
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 'details' && (
                  <motion.div key="details" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                    <div className={styles.field}>
                      <label className={styles.label}>Full name *</label>
                      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="John Kamau" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Phone *</label>
                      <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678" type="tel" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Email <span className={styles.optional}>(optional)</span></label>
                      <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" type="email" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Street address *</label>
                      <input className={styles.input} value={address} onChange={e => setAddress(e.target.value)} placeholder="Apartment, street name" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Area *</label>
                      <select className={styles.input} value={area} onChange={e => setArea(e.target.value)}>
                        <option value="">Select your area</option>
                        {NAIROBI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <button className={styles['submit-btn']} onClick={handleSubmitDetails}>
                      Continue to payment
                    </button>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
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

                    <button
                      className={styles['submit-btn']}
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? (
                        <><Loader2 size={16} strokeWidth={1.5} className={styles.spin} /> Processing…</>
                      ) : (
                        payment === 'mpesa' ? `Pay ${formatKES(grandTotal)} via M-Pesa` : `Place order — Pay on delivery`
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right — order summary */}
            <div className={styles.summary}>
              <h2 className={styles['summary-title']}>Order summary</h2>
              <div className={styles['summary-items']}>
                {items.map(item => (
                  <div key={`${item.variantId}-${item.grind}`} className={styles['summary-item']}>
                    <div>
                      <p className={styles['summary-item-name']}>{item.productName}</p>
                      <p className={styles['summary-item-meta']}>
                        {formatSize(item.sizeGrams)} · {formatGrind(item.grind)} · ×{item.quantity}
                      </p>
                    </div>
                    <span className={styles['summary-item-price']}>{formatKES(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className={styles['summary-totals']}>
                <div className={styles['summary-row']}><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
                <div className={styles['summary-row']}><span>Delivery</span><span>{delivery === 0 ? 'Free' : formatKES(delivery)}</span></div>
                <div className={`${styles['summary-row']} ${styles['summary-total']}`}><span>Total</span><span>{formatKES(grandTotal)}</span></div>
              </div>
              <p className={styles['summary-note']}>Delivery within Nairobi · 1–2 business days</p>
            </div>
          </div>
        )}

        {/* M-Pesa waiting */}
        {step === 'mpesa_wait' && (
          <div className={styles['mpesa-screen']}>
            <Loader2 size={40} strokeWidth={1} className={styles.spin} style={{ color: 'var(--color-crema)' }} />
            <h2 className={styles['mpesa-title']}>Check your phone</h2>
            <p className={styles['mpesa-sub']}>
              A payment prompt of <strong>{formatKES(grandTotal)}</strong> has been sent to <strong>{mpesaPhone}</strong>.
              Enter your M-Pesa PIN to complete the purchase.
            </p>
            <div className={styles['mpesa-order']}>
              <span>Order</span>
              <span className={styles['mpesa-ref']}>{orderRef}</span>
            </div>
            <button className={styles['mpesa-cancel']} onClick={() => setStep('payment')}>
              Cancel and go back
            </button>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className={styles['success-screen']}>
            <motion.div
              className={styles['success-check']}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 300 }}
            >
              <CheckCircle2 size={40} strokeWidth={1.5} color="#fff" />
            </motion.div>
            <h1 className={styles['success-title']}>Order confirmed!</h1>
            <p className={styles['success-sub']}>
              Thank you, {name.split(' ')[0]}. We've received your order and will process it shortly.
            </p>
            <div className={styles['success-details']}>
              <div className={styles['detail-row']}><span>Order ref</span><span className={styles['detail-val']}>{orderRef}</span></div>
              <div className={styles['detail-row']}><span>Delivery to</span><span className={styles['detail-val']}>{area}</span></div>
              <div className={styles['detail-row']}><span>Total</span><span className={styles['detail-val']}>{formatKES(grandTotal)}</span></div>
              {mpesaCode && <div className={styles['detail-row']}><span>M-Pesa code</span><span className={styles['detail-val']}>{mpesaCode}</span></div>}
            </div>
            <div className={styles['success-actions']}>
              <Link href="/shop" className={styles['success-btn']}>Continue shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
