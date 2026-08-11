'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useAnimate } from 'framer-motion'
import { Check, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatKES, formatSize, formatGrind } from '@/lib/utils/pricing'
import { getProductImage } from '@/lib/utils/productImages'
import styles from './ProductDetail.module.css'

interface Variant { id: string; size_grams: number; grind: string; price: number; is_available: boolean }
interface Product {
  id: string; name: string; slug: string; grade: string; roast: string
  description: string; tasting_notes: string[]; is_available: boolean; retail_variants: Variant[]
  origin_region?: string | null; origin_process?: string | null
}

const SIZES  = [250, 500, 1000]
const GRINDS = ['whole_bean', 'ground']

const CARD_COLORS: Record<string, string> = {
  'kenya-premium-dark':   '#5C2D0E',
  'kenya-premium-medium': '#1E4035',
  'kenya-classic-dark':   '#1A2744',
  'kenya-classic-medium': '#7A3120',
}

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize,  setSelectedSize]  = useState(250)
  const [selectedGrind, setSelectedGrind] = useState<'whole_bean' | 'ground'>('whole_bean')
  const [quantity,      setQuantity]      = useState(1)
  const [added,         setAdded]         = useState(false)

  const addItem  = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const btnRef   = useRef<HTMLButtonElement>(null)
  const [flyScope, flyAnimate] = useAnimate()

  const isPremium   = product.grade === 'premium'
  const notes       = product.tasting_notes as string[]
  const image       = getProductImage(product.slug)
  const isOOS       = !product.is_available
  const roastLabel  = product.roast === 'medium' ? 'Medium roast' : 'Dark roast'
  const cardColor   = CARD_COLORS[product.slug] ?? '#2D3A2E'

  const selectedVariant = product.retail_variants.find(
    (v) => v.size_grams === selectedSize && v.grind === selectedGrind
  )

  const handleAdd = useCallback(async () => {
    if (!selectedVariant || added) return
    addItem({
      variantId: selectedVariant.id, productId: product.id, productName: product.name,
      grade: product.grade as 'classic' | 'premium', roast: product.roast as 'medium' | 'dark',
      sizeGrams: selectedSize, grind: selectedGrind, price: selectedVariant.price,
    })
    setAdded(true)
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const flyEl = document.createElement('div')
      flyEl.style.cssText = `position:fixed;left:${rect.left+rect.width/2-12}px;top:${rect.top+rect.height/2-12}px;width:24px;height:24px;background:rgba(255,255,255,0.8);border-radius:50%;z-index:9999;pointer-events:none;font-size:12px;display:flex;align-items:center;justify-content:center;`
      flyEl.innerHTML = '☕'
      document.body.appendChild(flyEl)
      flyEl.animate([
        {transform:'translate(0,0) scale(1)',opacity:1},
        {transform:`translate(${window.innerWidth-60-(rect.left+rect.width/2-12)}px,${30-(rect.top+rect.height/2-12)}px) scale(0.3)`,opacity:0}
      ],{duration:600,easing:'cubic-bezier(0.16,1,0.3,1)'}).onfinish = () => flyEl.remove()
    }
    setTimeout(() => { setAdded(false); openCart() }, 1200)
  }, [selectedVariant, added, addItem, product, selectedSize, selectedGrind, openCart])

  return (
    <div className={styles.page} ref={flyScope}>
      {/* Full-color hero — same card color as shop/homepage */}
      <div className={styles.hero} style={{ background: cardColor }}>
        <div className={styles.container}>
          <Link href="/shop" className={styles.back}>
            <ArrowLeft size={14} strokeWidth={1.5} /> Back to shop
          </Link>
          <div className={styles['hero-inner']}>
            {/* Visual */}
            <div className={styles.visual}>
              {image ? (
                <Image src={image} alt={product.name} fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles['visual-img']} priority />
              ) : (
                <div className={styles['visual-typo']}>
                  <span className={styles['typo-origin']}>Kenya</span>
                  <span className={styles['typo-grade']}>{isPremium ? 'Premium' : 'Classic'}</span>
                </div>
              )}
            </div>
            {/* Hero info */}
            <div className={styles['hero-info']}>
              <p className={styles['hero-meta']}>{isPremium ? 'Premium' : 'Classic'} · {roastLabel}</p>
              <h1 className={styles['hero-title']}>{product.name}</h1>
              <p className={styles['hero-notes']}>{notes.join(' · ')}</p>
              <p className={styles['hero-origin']}>{product.origin_region ?? 'Kenya'}{product.origin_process ? ` · ${product.origin_process}` : ''} · 100% Arabica</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase panel */}
      <div className={styles.panel}>
        <div className={styles.container}>
          <div className={styles['panel-inner']}>
            <div className={styles.description}>
              <h2 className={styles['desc-title']}>About this coffee</h2>
              <p className={styles['desc-text']}>{product.description}</p>
            </div>

            <div className={styles.purchase}>
              {isOOS ? (
                <div className={styles['oos-notice']}>
                  <p className={styles['oos-title']}>Currently out of stock</p>
                  <p className={styles['oos-desc']}>Contact us at <a href="mailto:hello@sixtyfivedegrees.com">hello@sixtyfivedegrees.com</a> to be notified when this returns.</p>
                </div>
              ) : (
                <>
                  <div className={styles.section}>
                    <p className={styles['section-label']}>Size</p>
                    <div className={styles.options}>
                      {SIZES.map((size) => {
                        const v = product.retail_variants.find(v => v.size_grams === size && v.grind === selectedGrind)
                        const available = v?.is_available !== false
                        return (
                          <button key={size}
                            className={`${styles.option} ${selectedSize === size ? styles.selected : ''} ${!available ? styles.disabled : ''}`}
                            onClick={() => available && setSelectedSize(size)} disabled={!available}>
                            <span className={styles['option-size']}>{formatSize(size)}</span>
                            {v && <span className={styles['option-price']}>{formatKES(v.price)}</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className={styles.section}>
                    <p className={styles['section-label']}>Grind</p>
                    <div className={styles.options}>
                      {GRINDS.map((grind) => (
                        <button key={grind}
                          className={`${styles.option} ${selectedGrind === grind ? styles.selected : ''}`}
                          onClick={() => setSelectedGrind(grind as 'whole_bean' | 'ground')}>
                          {formatGrind(grind)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.section}>
                    <p className={styles['section-label']}>Quantity</p>
                    <div className={styles.qty}>
                      <button className={styles['qty-btn']} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                      <span className={styles['qty-val']}>{quantity}</span>
                      <button className={styles['qty-btn']} onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>

                  {selectedVariant && (
                    <div className={styles.total}>
                      <span className={styles['total-label']}>Total</span>
                      <span className={styles['total-price']}>{formatKES(selectedVariant.price * quantity)}</span>
                    </div>
                  )}

                  <motion.button ref={btnRef}
                    className={`${styles['add-btn']} ${added ? styles['add-done'] : ''}`}
                    style={{ background: added ? '#2D5A3D' : cardColor }}
                    onClick={handleAdd} disabled={!selectedVariant || added} whileTap={{ scale: 0.97 }}>
                    <AnimatePresence mode="wait">
                      {added ? (
                        <motion.span key="done" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className={styles['btn-inner']}>
                          <Check size={16} strokeWidth={2} /> Added to cart
                        </motion.span>
                      ) : (
                        <motion.span key="add" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className={styles['btn-inner']}>
                          <ShoppingBag size={16} strokeWidth={1.5} /> Add to cart
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <p className={styles['delivery-note']}>Free delivery on orders over KES 3,000 · Nairobi only</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
