'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { formatKES } from '@/lib/utils/pricing'
import { Loader2 } from 'lucide-react'
import styles from './page.module.css'

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error('Order not found')
  return r.json()
})

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order received',  desc: 'Your order has been received and is awaiting confirmation.' },
  { key: 'confirmed',  label: 'Confirmed',        desc: "We've confirmed your order and are preparing it." },
  { key: 'processing', label: 'Being packed',     desc: 'Your coffee is being freshly packed for delivery.' },
  { key: 'shipped',    label: 'Out for delivery', desc: 'Your order is on its way to you.' },
  { key: 'delivered',  label: 'Delivered',        desc: 'Your order has been delivered. Enjoy your coffee!' },
]

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export function OrderStatusClient({ orderRef }: { orderRef: string }) {
  const { data: order, error, isLoading } = useSWR(
    `/api/orders/${orderRef}`,
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  )

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Loader2 size={24} strokeWidth={1.5} className={styles.spin} />
            <p>Looking up your order...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles['not-found']}>
            <p className={styles['not-found-title']}>Order not found</p>
            <p className={styles['not-found-desc']}>
              We could not find order <strong>{orderRef}</strong>. Check your ref or contact us at{' '}
              <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a>.
            </p>
            <Link href="/shop" className={styles['back-btn']}>Back to shop</Link>
          </div>
        </div>
      </div>
    )
  }

  const currentStep = STATUS_ORDER.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  const isDelivered = order.status === 'delivered'
  const addr = order.delivery_address as any

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <p className={styles.eye}>Order status</p>
          <h1 className={styles.title}>{order.order_ref}</h1>
          <p className={styles.date}>
            Placed on {new Date(order.created_at).toLocaleDateString('en-KE', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
          {!isCancelled && !isDelivered && (
            <p className={styles['live-badge']}>
              <span className={styles['live-dot']} />
              Updates automatically
            </p>
          )}
        </div>

        {isCancelled ? (
          <div className={styles.cancelled}>
            <p className={styles['cancelled-title']}>Order cancelled</p>
            <p className={styles['cancelled-desc']}>
              This order was cancelled. Contact us at{' '}
              <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a> for help.
            </p>
          </div>
        ) : (
          <div className={styles.progress}>
            {STATUS_STEPS.map((step, i) => {
              const isComplete = i < currentStep || (order.status === 'delivered' && i === currentStep)
              const isCurrent  = i === currentStep && order.status !== 'delivered'
              const isFuture   = i > currentStep
              return (
                <div key={step.key} className={`${styles.step} ${isComplete ? styles.complete : ''} ${isCurrent ? styles.current : ''} ${isFuture ? styles.future : ''}`}>
                  <div className={styles['step-left']}>
                    <div className={styles['step-dot']}>
                      {isComplete && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {isCurrent && <div className={styles['step-pulse']} />}
                    </div>
                    {i < STATUS_STEPS.length - 1 && <div className={styles['step-line']} />}
                  </div>
                  <div className={styles['step-right']}>
                    <p className={styles['step-label']}>{step.label}</p>
                    {isCurrent && <p className={styles['step-desc']}>{step.desc}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles['card-title']}>Your order</h2>
            <div className={styles.items}>
              {(order.order_items as any[]).map((item: any, i: number) => (
                <div key={i} className={styles.item}>
                  <div>
                    <p className={styles['item-name']}>{item.product_name}</p>
                    <p className={styles['item-meta']}>{item.product_type === 'merch' ? `${item.colour} · ${item.size}` : `${item.size} · ${item.grind === 'whole_bean' ? 'Whole bean' : 'Ground'}`} · x{item.quantity}</p>
                  </div>
                  <span className={styles['item-price']}>{formatKES(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className={styles.totals}>
              <div className={styles['total-row']}><span>Subtotal</span><span>{formatKES(order.subtotal)}</span></div>
              <div className={styles['total-row']}><span>Delivery</span><span>{order.delivery_fee > 0 ? formatKES(order.delivery_fee) : 'Free'}</span></div>
              <div className={`${styles['total-row']} ${styles['total-grand']}`}><span>Total</span><span>{formatKES(order.total)}</span></div>
            </div>
          </div>

          <div className={styles['side-cards']}>
            <div className={styles.card}>
              <h2 className={styles['card-title']}>Delivering to</h2>
              {addr && <p className={styles['card-text']}>{addr.line1}<br />{addr.area}, {addr.city}</p>}
            </div>

            <div className={styles.card}>
              <h2 className={styles['card-title']}>Payment</h2>
              <p className={styles['card-text']}>
                {order.payment_method === 'mpesa' ? 'M-Pesa' : 'Cash on delivery'}
                {' · '}
                <span className={`${styles['pay-status']} ${styles[`pay-${order.payment_status}`]}`}>
                  {order.payment_status === 'completed' ? 'Paid' : order.payment_status === 'pending' ? 'Pending' : 'Failed'}
                </span>
              </p>
              {order.mpesa_receipt && <p className={styles['mpesa-code']}>Code: {order.mpesa_receipt}</p>}
            </div>

            <div className={styles.card}>
              <h2 className={styles['card-title']}>Need help?</h2>
              <p className={styles['card-text']}>Contact us with ref <strong>{order.order_ref}</strong></p>
              <a href="mailto:hello@sixtyfivedegrees.com" className={styles['help-link']}>hello@sixtyfivedegrees.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
