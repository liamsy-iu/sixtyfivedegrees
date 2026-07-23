'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useAnimate } from 'framer-motion'
import { Check, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatKES, formatSize, formatGrind } from '@/lib/utils/pricing'
import styles from './page.module.css'

interface Variant { id: string; size_grams: number; grind: string; price: number; is_available: boolean }
interface Product {
  id: string; name: string; slug: string; grade: string; roast: string
  description: string; tasting_notes: string[]; retail_variants: Variant[]
}

const SIZES  = [250, 500, 1000]
const GRINDS = ['whole_bean', 'ground']

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize,  setSelectedSize]  = useState(250)
  const [selectedGrind, setSelectedGrind] = useState<'whole_bean' | 'ground'>('whole_bean')
  const [quantity,      setQuantity]      = useState(1)
  const [added,         setAdded]         = useState(false)

  const addItem   = useCartStore((s) => s.addItem)
  const openCart  = useCartStore((s) => s.openCart)
  const btnRef    = useRef<HTMLButtonElement>(null)
  const [flyScope, flyAnimate] = useAnimate()

  const isPremium = product.grade === 'premium'
  const notes     = product.tasting_notes as string[]

  const selectedVariant = product.retail_variants.find(
    (v) => v.size_grams === selectedSize && v.grind === selectedGrind
  )

  const handleAdd = useCallback(async () => {
    if (!selectedVariant || added) return

    addItem({
      variantId:   selectedVariant.id,
      productId:   product.id,
      productName: product.name,
      grade:       product.grade as 'classic' | 'premium',
      roast:       product.roast as 'medium' | 'dark',
      sizeGrams:   selectedSize,
      grind:       selectedGrind,
      price:       selectedVariant.price,
    })

    setAdded(true)

    // Flying animation — element goes from button toward top-right (cart area)
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const flyEl = document.createElement('div')
      flyEl.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2 - 12}px;
        top: ${rect.top + rect.height / 2 - 12}px;
        width: 24px; height: 24px;
        background: var(--color-crema);
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px;
      `
      flyEl.innerHTML = '☕'
      document.body.appendChild(flyEl)

      const cartX = window.innerWidth - 60
      const cartY = 30

      flyEl.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${cartX - (rect.left + rect.width / 2 - 12)}px, ${cartY - (rect.top + rect.height / 2 - 12)}px) scale(0.3)`, opacity: 0 },
      ], { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }).onfinish = () => {
        flyEl.remove()
      }
    }

    setTimeout(() => { setAdded(false); openCart() }, 1200)
  }, [selectedVariant, added, addItem, product, selectedSize, selectedGrind, openCart])

  return (
    <div className={styles.page} ref={flyScope}>
      <div className={styles.container}>
        <Link href="/shop" className={styles.back}>
          <ArrowLeft size={14} strokeWidth={1.5} /> Back to shop
        </Link>

        <div className={styles.layout}>
          {/* Visual — typographic, no bag illustration */}
          <div className={styles.visual}>
            <div className={`${styles.visual_inner} ${styles[product.roast]}`}>
              <div className={styles.badge} data-grade={product.grade}>
                {isPremium ? 'Premium' : 'Classic'}
              </div>
              <div className={styles['type-visual']}>
                <span className={styles['tv-mark']}>65°</span>
                <span className={styles['tv-origin']}>Kenya</span>
                <span className={styles['tv-grade']}>{isPremium ? 'Premium' : 'Classic'} · {product.roast} roast</span>
                <div className={styles['tv-notes']}>
                  {notes.map((n, i) => (
                    <span key={i} className={styles['tv-note']}>{n}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p className={styles.eye}>Kenya · {product.roast} roast</p>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.desc}>{product.description}</p>

            <div className={styles.notes}>
              {notes.map((note) => (
                <span key={note} className={styles.note}>{note}</span>
              ))}
            </div>

            {/* Size */}
            <div className={styles.section}>
              <p className={styles['section-label']}>Size</p>
              <div className={styles.options}>
                {SIZES.map((size) => {
                  const variant = product.retail_variants.find(
                    (v) => v.size_grams === size && v.grind === selectedGrind
                  )
                  const available = variant?.is_available !== false
                  return (
                    <button
                      key={size}
                      className={`${styles.option} ${selectedSize === size ? styles.selected : ''} ${!available ? styles.disabled : ''}`}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available}
                    >
                      <span className={styles['option-size']}>{formatSize(size)}</span>
                      {variant && <span className={styles['option-price']}>{formatKES(variant.price)}</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Grind */}
            <div className={styles.section}>
              <p className={styles['section-label']}>Grind</p>
              <div className={styles.options}>
                {GRINDS.map((grind) => (
                  <button
                    key={grind}
                    className={`${styles.option} ${selectedGrind === grind ? styles.selected : ''}`}
                    onClick={() => setSelectedGrind(grind as 'whole_bean' | 'ground')}
                  >
                    {formatGrind(grind)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className={styles.section}>
              <p className={styles['section-label']}>Quantity</p>
              <div className={styles.qty}>
                <button className={styles['qty-btn']} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className={styles['qty-val']}>{quantity}</span>
                <button className={styles['qty-btn']} onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* CTA */}
            <div className={styles.cta}>
              {selectedVariant && (
                <div className={styles.total}>
                  <span className={styles['total-label']}>Total</span>
                  <span className={styles['total-price']}>{formatKES(selectedVariant.price * quantity)}</span>
                </div>
              )}
              <motion.button
                ref={btnRef}
                className={`${styles['add-btn']} ${added ? styles['add-btn-done'] : ''}`}
                onClick={handleAdd}
                disabled={!selectedVariant || added}
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={styles['add-btn-inner']}>
                      <Check size={16} strokeWidth={2} /> Added to cart
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={styles['add-btn-inner']}>
                      <ShoppingBag size={16} strokeWidth={1.5} /> Add to cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            <p className={styles['delivery-note']}>
              Free delivery on orders over KES 3,000 · Nairobi only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
