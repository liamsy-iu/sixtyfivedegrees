import { notFound } from 'next/navigation'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { createServiceClient } from '@/lib/supabase/server'
import { formatKES, formatSize, formatGrind } from '@/lib/utils/pricing'
import type { Metadata } from 'next'
import styles from './page.module.css'

interface Props { params: Promise<{ ref: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params
  return { title: `Order ${ref.toUpperCase()}` }
}

export const dynamic = 'force-dynamic'

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order received',  desc: 'Your order has been received and is awaiting confirmation.' },
  { key: 'confirmed',  label: 'Confirmed',        desc: 'We\'ve confirmed your order and are preparing it.' },
  { key: 'processing', label: 'Being packed',     desc: 'Your coffee is being freshly packed for delivery.' },
  { key: 'shipped',    label: 'Out for delivery', desc: 'Your order is on its way to you.' },
  { key: 'delivered',  label: 'Delivered',        desc: 'Your order has been delivered. Enjoy your coffee!' },
]

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function getStepIndex(status: string) {
  return STATUS_ORDER.indexOf(status)
}

export default async function OrderStatusPage({ params }: Props) {
  const { ref } = await params
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      id, order_ref, status, payment_status, payment_method,
      customer_name, delivery_address, delivery_fee, subtotal, total,
      mpesa_receipt, created_at, updated_at,
      order_items ( product_name, grade, roast, size, grind, quantity, unit_price, subtotal )
    `)
    .eq('order_ref', ref.toUpperCase())
    .single()

  if (!order) notFound()

  const currentStep = getStepIndex(order.status)
  const isCancelled = order.status === 'cancelled'
  const addr = order.delivery_address as any

  return (
    <>
      <Nav />
      <main>
        <div className={styles.page}>
          <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
              <p className={styles.eye}>Order status</p>
              <h1 className={styles.title}>{order.order_ref}</h1>
              <p className={styles.date}>
                Placed on {new Date(order.created_at).toLocaleDateString('en-KE', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>

            {/* Cancelled state */}
            {isCancelled ? (
              <div className={styles.cancelled}>
                <p className={styles['cancelled-title']}>Order cancelled</p>
                <p className={styles['cancelled-desc']}>
                  This order was cancelled. If you have any questions, contact us at{' '}
                  <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a>.
                </p>
              </div>
            ) : (
              /* Progress tracker */
              <div className={styles.progress}>
                {STATUS_STEPS.map((step, i) => {
                  const isComplete = i < currentStep
                  const isCurrent  = i === currentStep
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

            {/* Details grid */}
            <div className={styles.grid}>

              {/* Items */}
              <div className={styles.card}>
                <h2 className={styles['card-title']}>Your order</h2>
                <div className={styles.items}>
                  {(order.order_items as any[]).map((item, i) => (
                    <div key={i} className={styles.item}>
                      <div>
                        <p className={styles['item-name']}>{item.product_name}</p>
                        <p className={styles['item-meta']}>
                          {item.size} · {item.grind === 'whole_bean' ? 'Whole bean' : 'Ground'} · ×{item.quantity}
                        </p>
                      </div>
                      <span className={styles['item-price']}>{formatKES(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.totals}>
                  <div className={styles['total-row']}>
                    <span>Subtotal</span>
                    <span>{formatKES(order.subtotal)}</span>
                  </div>
                  <div className={styles['total-row']}>
                    <span>Delivery</span>
                    <span>{order.delivery_fee > 0 ? formatKES(order.delivery_fee) : 'Free'}</span>
                  </div>
                  <div className={`${styles['total-row']} ${styles['total-grand']}`}>
                    <span>Total</span>
                    <span>{formatKES(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery & payment */}
              <div className={styles['side-cards']}>
                <div className={styles.card}>
                  <h2 className={styles['card-title']}>Delivering to</h2>
                  {addr && (
                    <p className={styles['card-text']}>
                      {addr.line1}<br />{addr.area}, {addr.city}
                    </p>
                  )}
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
                  {order.mpesa_receipt && (
                    <p className={styles['mpesa-code']}>Code: {order.mpesa_receipt}</p>
                  )}
                </div>

                <div className={styles.card}>
                  <h2 className={styles['card-title']}>Need help?</h2>
                  <p className={styles['card-text']}>
                    Contact us with your order ref <strong>{order.order_ref}</strong>
                  </p>
                  <a href="mailto:hello@sixtyfivedegrees.com" className={styles['help-link']}>
                    hello@sixtyfivedegrees.com
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
