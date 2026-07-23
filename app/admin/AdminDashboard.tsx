'use client'

import useSWR from 'swr'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logoutAction, updateOrderStatus, updateEnquiryStatus, toggleProductAvailability } from '@/lib/actions/admin'
import { updateSubscriptionStatus } from '@/lib/actions/subscriptions'
import { formatKES, formatSize } from '@/lib/utils/pricing'
import { ChevronDown, ChevronUp, LogOut, Package, MessageSquare, RefreshCw, Repeat, Coffee, Loader2 } from 'lucide-react'
import styles from './AdminDashboard.module.css'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const ORDER_STATUSES   = ['pending','confirmed','processing','shipped','delivered','cancelled']
const ENQUIRY_STATUSES = ['new','contacted','converted']
const SUB_STATUSES     = ['active','paused','cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending:'#f59e0b', confirmed:'#3b82f6', processing:'#8b5cf6',
  shipped:'#06b6d4', delivered:'#10b981', cancelled:'#ef4444',
  new:'#f59e0b', contacted:'#3b82f6', converted:'#10b981',
  active:'#10b981', paused:'#f59e0b',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={styles.badge} style={{
      background: `${STATUS_COLORS[status]}20`,
      color: STATUS_COLORS[status],
      border: `1px solid ${STATUS_COLORS[status]}40`,
    }}>
      {status}
    </span>
  )
}

type Tab = 'orders' | 'enquiries' | 'subscriptions' | 'products'

export function AdminDashboard({ products }: { products: any[] }) {
  const [tab, setTab] = useState<Tab>('orders')

  const {
    data: orders = [],
    isLoading: ordersLoading,
    mutate: mutateOrders,
  } = useSWR('/api/admin/orders', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  const {
    data: enquiries = [],
    isLoading: enquiriesLoading,
    mutate: mutateEnquiries,
  } = useSWR('/api/admin/enquiries', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  const {
    data: subscriptions = [],
    isLoading: subsLoading,
    mutate: mutateSubs,
  } = useSWR('/api/admin/subscriptions', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  const [, startTransition] = useTransition()

  const newOrders    = orders.filter((o: any) => o.status === 'pending').length
  const newEnquiries = enquiries.filter((e: any) => e.status === 'new').length
  const activeSubs   = subscriptions.filter((s: any) => s.status === 'active').length
  const todayRevenue = orders
    .filter((o: any) => o.payment_status === 'completed' && new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((s: number, o: any) => s + (o.total ?? 0), 0)

  function refreshAll() {
    mutateOrders()
    mutateEnquiries()
    mutateSubs()
  }

  const isLoading = ordersLoading || enquiriesLoading || subsLoading

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles['header-inner']}>
          <div className={styles.brand}>
            <span className={styles['brand-mark']}>65°</span>
            <span className={styles['brand-name']}>Admin</span>
          </div>
          <div className={styles['header-actions']}>
            <button className={styles['icon-btn']} onClick={refreshAll} title="Refresh">
              {isLoading
                ? <Loader2 size={16} strokeWidth={1.5} className={styles.spin} />
                : <RefreshCw size={16} strokeWidth={1.5} />}
            </button>
            <form action={logoutAction}>
              <button className={styles['icon-btn']} type="submit" title="Sign out">
                <LogOut size={16} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles['stat-val']}>{newOrders}</span>
            <span className={styles['stat-label']}>New orders</span>
          </div>
          <div className={styles.stat}>
            <span className={styles['stat-val']}>{formatKES(todayRevenue)}</span>
            <span className={styles['stat-label']}>Revenue today</span>
          </div>
          <div className={styles.stat}>
            <span className={styles['stat-val']}>{activeSubs}</span>
            <span className={styles['stat-label']}>Active subscriptions</span>
          </div>
          <div className={styles.stat}>
            <span className={styles['stat-val']}>{newEnquiries}</span>
            <span className={styles['stat-label']}>New enquiries</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab==='orders'?styles['tab-active']:''}`} onClick={() => setTab('orders')}>
            <Package size={15} strokeWidth={1.5} /> Orders
            {newOrders > 0 && <span className={styles['tab-badge']}>{newOrders}</span>}
          </button>
          <button className={`${styles.tab} ${tab==='subscriptions'?styles['tab-active']:''}`} onClick={() => setTab('subscriptions')}>
            <Repeat size={15} strokeWidth={1.5} /> Subscriptions
            {activeSubs > 0 && <span className={styles['tab-badge']}>{activeSubs}</span>}
          </button>
          <button className={`${styles.tab} ${tab==='enquiries'?styles['tab-active']:''}`} onClick={() => setTab('enquiries')}>
            <MessageSquare size={15} strokeWidth={1.5} /> Enquiries
            {newEnquiries > 0 && <span className={styles['tab-badge']}>{newEnquiries}</span>}
          </button>
          <button className={`${styles.tab} ${tab==='products'?styles['tab-active']:''}`} onClick={() => setTab('products')}>
            <Coffee size={15} strokeWidth={1.5} /> Products
          </button>
        </div>

        {/* Orders */}
        {tab === 'orders' && (
          <div className={styles.list}>
            {ordersLoading && <p className={styles.loading}>Loading orders…</p>}
            {!ordersLoading && orders.length === 0 && <p className={styles.empty}>No orders yet</p>}
            {orders.map((o: any) => (
              <OrderCard key={o.id} order={o} onUpdate={() => mutateOrders()} />
            ))}
          </div>
        )}

        {/* Subscriptions */}
        {tab === 'subscriptions' && (
          <div className={styles.list}>
            {subsLoading && <p className={styles.loading}>Loading subscriptions…</p>}
            {!subsLoading && subscriptions.length === 0 && <p className={styles.empty}>No subscriptions yet</p>}
            {subscriptions.map((s: any) => (
              <SubCard key={s.id} sub={s} onUpdate={() => mutateSubs()} />
            ))}
          </div>
        )}

        {/* Enquiries */}
        {tab === 'enquiries' && (
          <div className={styles.list}>
            {enquiriesLoading && <p className={styles.loading}>Loading enquiries…</p>}
            {!enquiriesLoading && enquiries.length === 0 && <p className={styles.empty}>No enquiries yet</p>}
            {enquiries.map((e: any) => (
              <EnquiryCard key={e.id} enquiry={e} onUpdate={() => mutateEnquiries()} />
            ))}
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className={styles.list}>
            {products.map((p: any) => (
              <ProductRow key={p.id} product={p} onUpdate={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order, onUpdate }: { order: any; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const addr = order.delivery_address

  async function handleStatus(status: string) {
    setLoading(true)
    await updateOrderStatus(order.id, status)
    setLoading(false)
    onUpdate()
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']} onClick={() => setExpanded(!expanded)}>
        <div className={styles['card-left']}>
          <span className={styles['order-ref']}>{order.order_ref}</span>
          <span className={styles['order-date']}>
            {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={styles['card-right']}>
          <StatusBadge status={order.status} />
          <span className={styles['order-total']}>{formatKES(order.total)}</span>
          {expanded ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
            <div className={styles['card-body']}>
              <div className={styles.section}>
                <p className={styles['section-label']}>Customer</p>
                <p className={styles['section-val']}>{order.customer_name}</p>
                <p className={styles['section-val']}>{order.customer_phone}</p>
                {order.customer_email && <p className={styles['section-val']}>{order.customer_email}</p>}
                {addr && <p className={styles['section-val']}>{addr.line1}, {addr.area}</p>}
              </div>
              <div className={styles.section}>
                <p className={styles['section-label']}>Payment</p>
                <p className={styles['section-val']}>{order.payment_method?.toUpperCase()} · <StatusBadge status={order.payment_status} /></p>
                {order.mpesa_receipt && <p className={styles['section-val']}>Code: <strong>{order.mpesa_receipt}</strong></p>}
              </div>
              <div className={styles.section}>
                <p className={styles['section-label']}>Items</p>
                {order.order_items?.map((item: any, i: number) => (
                  <p key={i} className={styles['section-val']}>
                    {item.quantity}× {item.product_name} ({item.size} · {item.grind === 'whole_bean' ? 'Whole bean' : 'Ground'}) — {formatKES(item.subtotal)}
                  </p>
                ))}
                <p className={styles['section-val']} style={{ marginTop: 8 }}>
                  Delivery: {order.delivery_fee > 0 ? formatKES(order.delivery_fee) : 'Free'} · <strong>Total: {formatKES(order.total)}</strong>
                </p>
              </div>
              <div className={styles['status-actions']}>
                <p className={styles['section-label']}>Update status</p>
                <div className={styles['action-btns']}>
                  {ORDER_STATUSES.filter(s => s !== order.status).map(s => (
                    <button key={s} className={styles['action-btn']} onClick={() => handleStatus(s)} disabled={loading}
                      style={{ borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] }}>
                      → {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SubCard({ sub, onUpdate }: { sub: any; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const addr = sub.delivery_address
  const FREQ: Record<string, string> = { weekly: 'Weekly', biweekly: 'Every 2 weeks', monthly: 'Monthly' }

  async function handleStatus(status: string) {
    setLoading(true)
    await updateSubscriptionStatus(sub.id, status)
    setLoading(false)
    onUpdate()
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']} onClick={() => setExpanded(!expanded)}>
        <div className={styles['card-left']}>
          <span className={styles['order-ref']}>{sub.customer_name}</span>
          <span className={styles['order-date']}>{FREQ[sub.frequency]} · {sub.grade} {sub.roast} · {formatSize(sub.size_grams)} × {sub.quantity}</span>
        </div>
        <div className={styles['card-right']}>
          <StatusBadge status={sub.status} />
          <span className={styles['order-date']}>Next: {sub.next_order_date}</span>
          {expanded ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
            <div className={styles['card-body']}>
              <div className={styles.section}>
                <p className={styles['section-label']}>Customer</p>
                <p className={styles['section-val']}>{sub.customer_phone}</p>
                {sub.customer_email && <p className={styles['section-val']}>{sub.customer_email}</p>}
                {addr && <p className={styles['section-val']}>{addr.line1}, {addr.area}</p>}
              </div>
              <div className={styles.section}>
                <p className={styles['section-label']}>Order</p>
                <p className={styles['section-val']}>{sub.quantity}× {sub.grade} {sub.roast} {formatSize(sub.size_grams)} · {sub.grind === 'whole_bean' ? 'Whole bean' : 'Ground'}</p>
                <p className={styles['section-val']}>Frequency: {FREQ[sub.frequency]}</p>
              </div>
              <div className={styles['status-actions']}>
                <p className={styles['section-label']}>Update status</p>
                <div className={styles['action-btns']}>
                  {SUB_STATUSES.filter(s => s !== sub.status).map(s => (
                    <button key={s} className={styles['action-btn']} onClick={() => handleStatus(s)} disabled={loading}
                      style={{ borderColor: STATUS_COLORS[s] || '#6b7280', color: STATUS_COLORS[s] || '#6b7280' }}>
                      → {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EnquiryCard({ enquiry, onUpdate }: { enquiry: any; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleStatus(status: string) {
    setLoading(true)
    await updateEnquiryStatus(enquiry.id, status)
    setLoading(false)
    onUpdate()
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']} onClick={() => setExpanded(!expanded)}>
        <div className={styles['card-left']}>
          <span className={styles['order-ref']}>{enquiry.name}</span>
          {enquiry.business && <span className={styles['order-date']}>{enquiry.business}</span>}
        </div>
        <div className={styles['card-right']}>
          <StatusBadge status={enquiry.status} />
          <span className={styles['order-date']}>{new Date(enquiry.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</span>
          {expanded ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
            <div className={styles['card-body']}>
              <div className={styles.section}>
                <p className={styles['section-label']}>Contact</p>
                <p className={styles['section-val']}>{enquiry.email}</p>
                <p className={styles['section-val']}>{enquiry.phone}</p>
              </div>
              <div className={styles.section}>
                <p className={styles['section-label']}>Interest</p>
                {enquiry.grade && <p className={styles['section-val']}>Grade: {enquiry.grade}</p>}
                {enquiry.volume && <p className={styles['section-val']}>Volume: {enquiry.volume}</p>}
              </div>
              {enquiry.message && (
                <div className={styles.section}>
                  <p className={styles['section-label']}>Message</p>
                  <p className={styles['section-val']}>{enquiry.message}</p>
                </div>
              )}
              <div className={styles['status-actions']}>
                <p className={styles['section-label']}>Update status</p>
                <div className={styles['action-btns']}>
                  {ENQUIRY_STATUSES.filter(s => s !== enquiry.status).map(s => (
                    <button key={s} className={styles['action-btn']} onClick={() => handleStatus(s)} disabled={loading}
                      style={{ borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] }}>
                      → {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductRow({ product, onUpdate }: { product: any; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false)
  const [available, setAvailable] = useState(product.is_available)

  async function handleToggle() {
    setLoading(true)
    setAvailable(!available) // optimistic update
    await toggleProductAvailability(product.id, !available)
    setLoading(false)
    onUpdate()
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']} style={{ cursor: 'default' }}>
        <div className={styles['card-left']}>
          <span className={styles['order-ref']}>{product.name}</span>
          <span className={styles['order-date']}>{product.grade} · {product.roast} roast</span>
        </div>
        <div className={styles['card-right']}>
          <StatusBadge status={available ? 'active' : 'cancelled'} />
          <button
            className={styles['toggle-btn']}
            onClick={handleToggle}
            disabled={loading}
            style={{
              background: available ? '#fef2f2' : '#f0fdf4',
              color: available ? '#b91c1c' : '#166534',
              border: `1px solid ${available ? '#fecaca' : '#86efac'}`,
            }}
          >
            {loading ? '…' : available ? 'Mark out of stock' : 'Mark available'}
          </button>
        </div>
      </div>
    </div>
  )
}
