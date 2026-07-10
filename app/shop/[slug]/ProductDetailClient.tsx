'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatKES, formatSize, formatGrind } from '@/lib/utils/pricing'
import styles from './page.module.css'

interface Variant { id: string; size_grams: number; grind: string; price: number; is_available: boolean }
interface Product {
  id: string; name: string; slug: string; grade: string; roast: string
  description: string; tasting_notes: string[]; retail_variants: Variant[]
}

const SIZES = [250, 500, 1000]
const GRINDS = ['whole_bean', 'ground']

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize,  setSelectedSize]  = useState(250)
  const [selectedGrind, setSelectedGrind] = useState<'whole_bean' | 'ground'>('whole_bean')
  const [quantity,      setQuantity]      = useState(1)
  const [added,         setAdded]         = useState(false)

  const addItem   = useCartStore((s) => s.addItem)
  const openCart  = useCartStore((s) => s.openCart)

  const isPremium = product.grade === 'premium'

  const selectedVariant = product.retail_variants.find(
    (v) => v.size_grams === selectedSize && v.grind === selectedGrind
  )

  function handleAdd() {
    if (!selectedVariant) return
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
    setTimeout(() => { setAdded(false); openCart() }, 1200)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/shop" className={styles.back}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to shop
        </Link>

        <div className={styles.layout}>
          {/* Visual */}
          <div className={styles.visual}>
            <div className={`${styles.visual_inner} ${styles[product.roast]}`}>
              <div className={styles.badge} data-grade={product.grade}>
                {isPremium ? 'Premium' : 'Classic'}
              </div>
              <BagLarge grade={product.grade} roast={product.roast} />
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p className={styles.eye}>Kenya · {product.roast} roast</p>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.desc}>{product.description}</p>

            <div className={styles.notes}>
              {(product.tasting_notes as string[]).map((note) => (
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

            {/* Total + CTA */}
            <div className={styles.cta}>
              {selectedVariant && (
                <div className={styles.total}>
                  <span className={styles['total-label']}>Total</span>
                  <span className={styles['total-price']}>{formatKES(selectedVariant.price * quantity)}</span>
                </div>
              )}
              <motion.button
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

            {/* Delivery note */}
            <p className={styles['delivery-note']}>
              Free delivery on orders over KES 3,000 · Nairobi only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BagLarge({ grade, roast }: { grade: string; roast: string }) {
  const isPremium = grade === 'premium'
  const accent = isPremium ? '#C8922A' : 'rgba(245,240,232,0.35)'
  const fill   = isPremium ? 'rgba(200,146,42,0.1)' : 'rgba(245,240,232,0.05)'
  return (
    <div className={styles['bag-large']}>
      <svg viewBox="0 0 140 200" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect x="8" y="28" width="124" height="160" rx="7" fill={fill} stroke={accent} strokeWidth="1"/>
        <rect x="28" y="10" width="84" height="24" rx="4" fill={fill} stroke={accent} strokeWidth="0.6"/>
        <line x1="24" y1="80" x2="116" y2="80" stroke={accent} strokeWidth="0.5" strokeOpacity="0.5"/>
        <line x1="24" y1="140" x2="116" y2="140" stroke={accent} strokeWidth="0.5" strokeOpacity="0.5"/>
      </svg>
      <div className={styles['bag-content']}>
        <div className={styles['bag-65']}>65°</div>
        <div className={styles['bag-origin']} style={{ color: isPremium ? '#C8922A' : 'rgba(245,240,232,0.5)' }}>Kenya</div>
        <div className={styles['bag-grade']}>{isPremium ? 'Premium' : 'Classic'}</div>
        <div className={styles['bag-roast']}>{roast} roast</div>
      </div>
    </div>
  )
}
