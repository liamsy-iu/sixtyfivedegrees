'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './HeroVideo.module.css'

// Five segments, in order. Files are NOT bundled with this component --
// they must be downloaded from the source URLs below and placed at these
// exact paths under /public/videos/. See the comment block at the bottom
// of this file for the full list and instructions.
const SOURCES = [
  '/videos/hero-1-roasting.mp4',
  '/videos/hero-2-falling-beans.mp4',
  '/videos/hero-3-grinder.mp4',
  '/videos/hero-4-extraction.mp4',
  '/videos/hero-5-finished-drink.mp4',
]

// Playback speed for all hero clips. 1.5x keeps footage looking natural
// (2x+ tends to look choppy/unnatural for handheld or slow-motion source
// footage) while still visibly picking up the pace and cycling faster.
const PLAYBACK_RATE = 1.5

export function HeroVideo() {
  const [active, setActive] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const current = videoRefs.current[active]
    if (current) {
      current.currentTime = 0
      current.playbackRate = PLAYBACK_RATE
      current.play().catch(() => {})
    }
  }, [active])

  function handleEnded() {
    setActive((prev) => (prev + 1) % SOURCES.length)
  }

  return (
    <div className={styles.wrap} aria-hidden="true">
      {SOURCES.map((src, i) => (
        <video
          key={src}
          ref={(el) => { videoRefs.current[i] = el }}
          className={`${styles.video} ${i === active ? styles.active : ''}`}
          src={src}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'none'}
          onEnded={i === active ? handleEnded : undefined}
        />
      ))}
      <div className={styles.scrim} />
    </div>
  )
}

/*
 * Download each clip from its Pexels page (the "Free download" button),
 * choosing the HD or SD size -- not the 4K/UHD option, which is far
 * heavier than a hero background needs. Rename and place as follows:
 *
 * hero-1-roasting.mp4         <- https://www.pexels.com/video/a-coffee-machine-is-being-used-to-grind-coffee-beans-17645750/
 * hero-2-falling-beans.mp4    <- https://www.pexels.com/video/falling-roasted-coffee-beans-8608578/
 * hero-3-grinder.mp4          <- https://www.pexels.com/video/a-coffee-beans-on-a-coffee-grinder-8936254/
 * hero-4-extraction.mp4       <- https://www.pexels.com/video/close-up-of-espresso-machine-brewing-coffee-32698835/
 * hero-5-finished-drink.mp4   <- https://www.pexels.com/video/a-cup-of-hot-coffee-2853794/
 *
 * All five go in /public/videos/. See the README note in this component's
 * folder for compression guidance before deploying.
 */
