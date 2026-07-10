'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import styles from './Nav.module.css'

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())
  const openCart = useCartStore((s) => s.openCart)

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles['logo-mark']}>65°</span>
          <span className={styles['logo-text']}>Degrees Coffee Roastery</span>
        </Link>

        <ul className={styles.links}>
          <li><Link href="/shop" className={styles.link}>Shop</Link></li>
          <li><Link href="/trade" className={styles.link}>Trade</Link></li>
          <li><Link href="/about" className={styles.link}>About</Link></li>
        </ul>

        <div className={styles.actions}>
          <button
            className={styles['cart-btn']}
            onClick={openCart}
            aria-label={`Cart — ${itemCount} items`}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className={styles['cart-count']}>{itemCount}</span>
            )}
          </button>

          <button
            className={styles['menu-btn']}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobile}>
          <Link href="/shop" className={styles['mobile-link']} onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/trade" className={styles['mobile-link']} onClick={() => setMenuOpen(false)}>Trade</Link>
          <Link href="/about" className={styles['mobile-link']} onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      )}
    </header>
  )
}
