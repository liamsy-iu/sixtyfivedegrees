'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Shirt } from 'lucide-react'
import { useMerchCartStore } from '@/lib/store/merchCart'
import { formatKES } from '@/lib/utils/pricing'
import styles from './MerchCartDrawer.module.css'

const UNIT_PRICE_CENTS = 400000 // KES 4,000

export function MerchCartDrawer() {
  const isOpen     = useMerchCartStore((s) => s.isOpen)
  const closeCart  = useMerchCartStore((s) => s.closeCart)
  const items      = useMerchCartStore((s) => s.items)
  const total      = useMerchCartStore((s) => s.total())
  const updateQty  = useMerchCartStore((s) => s.updateQuantity)
  const removeItem = useMerchCartStore((s) => s.removeItem)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles['header-left']}>
                <Shirt size={18} strokeWidth={1.5} />
                <span className={styles['header-title']}>Your cart</span>
                {items.length > 0 && (
                  <span className={styles['header-count']}>{items.reduce((s, i) => s + i.quantity, 0)}</span>
                )}
              </div>
              <button className={styles.close} onClick={closeCart} aria-label="Close cart">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className={styles.empty}>
                <Shirt size={36} strokeWidth={1} className={styles['empty-icon']} />
                <p className={styles['empty-title']}>Your cart is empty</p>
                <p className={styles['empty-sub']}>Add a hoodie to get started.</p>
                <button className={styles['empty-btn']} onClick={closeCart}>Browse merch</button>
              </div>
            ) : (
              <>
                <div className={styles.items}>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.colour}-${item.size}`}
                        className={styles.item}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, padding: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className={styles['item-visual']}>
                          <span className={styles['item-initial']}>65</span>
                        </div>
                        <div className={styles['item-info']}>
                          <p className={styles['item-name']}>65 Degrees Hoodie</p>
                          <p className={styles['item-meta']}>
                            {item.colour} · {item.size}
                          </p>
                          <div className={styles['item-row']}>
                            <div className={styles['item-qty']}>
                              <button
                                className={styles['qty-btn']}
                                onClick={() => updateQty(item.colour, item.size, -1)}
                              >
                                <Minus size={12} strokeWidth={2} />
                              </button>
                              <span className={styles['qty-val']}>{item.quantity}</span>
                              <button
                                className={styles['qty-btn']}
                                onClick={() => updateQty(item.colour, item.size, 1)}
                              >
                                <Plus size={12} strokeWidth={2} />
                              </button>
                            </div>
                            <span className={styles['item-price']}>
                              {formatKES(UNIT_PRICE_CENTS * item.quantity)}
                            </span>
                          </div>
                        </div>
                        <button
                          className={styles['item-remove']}
                          onClick={() => removeItem(item.colour, item.size)}
                          aria-label="Remove item"
                        >
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Totals */}
                <div className={styles.totals}>
                  <div className={`${styles['total-row']} ${styles['total-grand']}`}>
                    <span>Total</span>
                    <span>{formatKES(total)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <div className={styles.footer}>
                  <Link
                    href="/merch/checkout"
                    className={styles['checkout-btn']}
                    onClick={closeCart}
                  >
                    Proceed to checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
