'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './IntroOverlay.module.css'

/**
 * A brief, one-time brand moment shown on first arrival — sits on top of
 * the real page (which is already loading normally underneath), never
 * gates it. Capped at ~580ms total. Shown once per browser session
 * (sessionStorage, not on every client-side navigation — this component
 * only mounts once anyway, since it lives in the root layout, which
 * persists across route changes in the App Router). Skipped entirely
 * for reduced-motion users and on any load after the first in this tab.
 */
export function IntroOverlay() {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (sessionStorage.getItem('introShown')) return
    sessionStorage.setItem('introShown', '1')

    setVisible(true)
    const exitTimer = setTimeout(() => setExiting(true), 320)
    const removeTimer = setTimeout(() => setVisible(false), 580)
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`${styles.overlay} ${exiting ? styles.exiting : ''}`} aria-hidden="true">
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
