import Image from 'next/image'
import styles from './IntroOverlay.module.css'

/**
 * A brief, one-time brand moment on arrival. Plain server-rendered HTML
 * with a pure-CSS animation sequence — no JS, no state — so it's part
 * of the very first paint, before anything has to hydrate.
 *
 * The logo asset is a raster PNG, not an SVG, so true stroke-drawing
 * (like the caffeine molecule on the homepage) isn't possible here —
 * there are no vector paths to animate. Instead this borrows the same
 * "precision instrument" feeling: corner brackets acquire the mark like
 * a viewfinder focusing, a scan-line sweeps across as it wipes into
 * view, then it settles into the same warm glow pulse the molecule uses.
 */
export function IntroOverlay() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.frame}>
        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />
        <div className={styles['glow-wrap']}>
          <div className={styles['mark-wrap']}>
            <Image
              src="/logo-white.png"
              alt=""
              width={140}
              height={102}
              className={styles.mark}
              priority
            />
            <span className={styles.scan} />
          </div>
        </div>
      </div>
    </div>
  )
}
