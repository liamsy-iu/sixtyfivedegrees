import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/">
            <Image
              src="/logo-white.png"
              alt="65 Degrees Coffee Roastery"
              width={100}
              height={100}
              className={styles['logo-img']}
            />
          </Link>
          <p className={styles.tagline}>
            Single origin Kenyan coffee,<br />roasted in Nairobi.
          </p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h4 className={styles['col-title']}>Shop</h4>
            <ul className={styles['col-links']}>
              <li><Link href="/shop">All products</Link></li>
              <li><Link href="/shop?roast=medium">Medium roast</Link></li>
              <li><Link href="/shop?roast=dark">Dark roast</Link></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4 className={styles['col-title']}>Trade</h4>
            <ul className={styles['col-links']}>
              <li><Link href="/trade">Wholesale</Link></li>
              <li><Link href="/trade#pricing">Pricing</Link></li>
              <li><Link href="/trade#enquiry">Enquiry</Link></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4 className={styles['col-title']}>Company</h4>
            <ul className={styles['col-links']}>
              <li><Link href="/about">About us</Link></li>
              <li><a href="mailto:hello@sixtyfivedegrees.com">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} 65 Degrees Coffee Roastery. Nairobi, Kenya.
        </p>
        <div className={styles.temp}>
          <span className={styles['temp-num']}>65°</span>
          <span className={styles['temp-label']}>optimal milk temperature</span>
        </div>
      </div>
    </footer>
  )
}
