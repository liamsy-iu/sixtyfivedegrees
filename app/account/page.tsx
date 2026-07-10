'use client'

import { useState } from 'react'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { getOrdersByPhone } from '@/lib/actions/orders'
import { formatKES } from '@/lib/utils/pricing'
import styles from './page.module.css'

export default function AccountPage() {
  const [phone,   setPhone]   = useState('')
  const [orders,  setOrders]  = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleLookup() {
    if (!phone) return
    setLoading(true)
    const result = await getOrdersByPhone(phone)
    setOrders(result)
    setSearched(true)
    setLoading(false)
  }

  const STATUS_LABELS: Record<string, string> = {
    pending:    'Pending',
    confirmed:  'Confirmed',
    processing: 'Processing',
    shipped:    'Shipped',
    delivered:  'Delivered',
    cancelled:  'Cancelled',
  }

  const PAY_LABELS: Record<string, string> = {
    pending:   'Awaiting payment',
    completed: 'Paid',
    failed:    'Payment failed',
  }

  return (
    <>
      <Nav />
      <main>
        <div className={styles.page}>
          <div className={styles.container}>
            <p className={styles.eye}>Order history</p>
            <h1 className={styles.title}>Your orders</h1>
            <p className={styles.sub}>Enter the phone number you used at checkout to view your orders.</p>

            <div className={styles.lookup}>
              <input
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                type="tel"
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              />
              <button className={styles['lookup-btn']} onClick={handleLookup} disabled={loading || !phone}>
                {loading ? 'Looking up…' : 'Find orders'}
              </button>
            </div>

            {searched && (
              <div className={styles.results}>
                {orders.length === 0 ? (
                  <div className={styles.empty}>
                    <p>No orders found for this number.</p>
                    <p className={styles['empty-hint']}>Make sure you're using the exact number you checked out with.</p>
                  </div>
                ) : (
                  <>
                    <p className={styles['results-count']}>{orders.length} {orders.length === 1 ? 'order' : 'orders'} found</p>
                    <div className={styles['orders-list']}>
                      {orders.map((order) => (
                        <div key={order.id} className={styles['order-card']}>
                          <div className={styles['order-header']}>
                            <div>
                              <p className={styles['order-ref']}>{order.order_ref}</p>
                              <p className={styles['order-date']}>
                                {new Date(order.created_at).toLocaleDateString('en-KE', {
                                  day: 'numeric', month: 'long', year: 'numeric',
                                })}
                              </p>
                            </div>
                            <span className={styles['order-total']}>{formatKES(order.total)}</span>
                          </div>
                          <div className={styles['order-footer']}>
                            <span className={`${styles['order-status']} ${styles[`status-${order.status}`]}`}>
                              {STATUS_LABELS[order.status] ?? order.status}
                            </span>
                            <span className={`${styles['order-pay-status']} ${styles[`pay-${order.payment_status}`]}`}>
                              {PAY_LABELS[order.payment_status] ?? order.payment_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
