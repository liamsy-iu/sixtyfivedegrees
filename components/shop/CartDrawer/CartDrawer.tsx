'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatKES, formatSize, formatGrind } from '@/lib/utils/pricing'
import styles from './CartDrawer.module.css'

const FREE_DELIVERY_THRESHOLD = 300000 // KES 3,000 in cents
const DELIVERY_FEE = 20000             // KES 200 in cents

export function CartDrawer() {
  const isOpen       = useCartStore((s) => s.isOpen)
  const closeCart    = useCartStore((s) => s.closeCart)
  const items        = useCartStore((s) => s.items)
  const total        = useCartStore((s) => s.total())
  const updateQty    = useCartStore((s) => s.updateQuantity)
  const removeItem   = useCartStore((s) => s.removeItem)

  const delivery = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const grandTotal = total + delivery

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
                <ShoppingBag size={18} strokeWidth={1.5} />
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
                <ShoppingBag size={36} strokeWidth={1} className={styles['empty-icon']} />
                <p className={styles['empty-title']}>Your cart is empty</p>
                <p className={styles['empty-sub']}>Add some Kenyan coffee to get started.</p>
                <button className={styles['empty-btn']} onClick={closeCart}>Browse the shop</button>
              </div>
            ) : (
              <>
                <div className={styles.items}>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.variantId}-${item.grind}`}
                        className={styles.item}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, padding: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className={styles['item-visual']} data-grade={item.grade}>
                          <span className={styles['item-initial']}>K</span>
                        </div>
                        <div className={styles['item-info']}>
                          <p className={styles['item-name']}>{item.productName}</p>
                          <p className={styles['item-meta']}>
                            {formatSize(item.sizeGrams)} · {formatGrind(item.grind)}
                          </p>
                          <div className={styles['item-row']}>
                            <div className={styles['item-qty']}>
                              <button
                                className={styles['qty-btn']}
                                onClick={() => updateQty(item.variantId, item.grind, item.quantity - 1)}
                              >
                                <Minus size={12} strokeWidth={2} />
                              </button>
                              <span className={styles['qty-val']}>{item.quantity}</span>
                              <button
                                className={styles['qty-btn']}
                                onClick={() => updateQty(item.variantId, item.grind, item.quantity + 1)}
                              >
                                <Plus size={12} strokeWidth={2} />
                              </button>
                            </div>
                            <span className={styles['item-price']}>
                              {formatKES(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                        <button
                          className={styles['item-remove']}
                          onClick={() => removeItem(item.variantId, item.grind)}
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
                  <div className={styles['total-row']}>
                    <span>Subtotal</span>
                    <span>{formatKES(total)}</span>
                  </div>
                  <div className={styles['total-row']}>
                    <span>Delivery</span>
                    <span>{delivery === 0 ? 'Free' : formatKES(delivery)}</span>
                  </div>
                  {delivery > 0 && (
                    <p className={styles['delivery-note']}>
                      Free delivery on orders over KES 3,000
                    </p>
                  )}
                  <div className={`${styles['total-row']} ${styles['total-grand']}`}>
                    <span>Total</span>
                    <span>{formatKES(grandTotal)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <div className={styles.footer}>
                  <Link
                    href="/checkout"
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
