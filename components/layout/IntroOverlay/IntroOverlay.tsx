import Image from 'next/image'
import styles from './IntroOverlay.module.css'

/**
 * A brief, one-time brand moment on arrival. Deliberately NOT a client
 * component — no useEffect, no state. It's plain server-rendered HTML
 * with a pure-CSS animation, so it's part of the very first paint the
 * browser produces, before any JS has downloaded or hydrated. That's
 * the whole point: this is the one thing on the page that doesn't wait
 * on JavaScript.
 *
 * It naturally only appears on a real page load (typing the URL,
 * clicking a search result, a hard refresh) and not on in-app
 * navigation between pages — Next.js's App Router keeps this layout
 * mounted across client-side navigations, so this markup isn't
 * re-inserted or re-animated when someone clicks around the site.
 */
export function IntroOverlay() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <Image
        src="/logo-white.png"
        alt=""
        width={140}
        height={102}
        className={styles.mark}
        priority
      />
    </div>
  )
}
