'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './ProductGridReveal.module.css'

/**
 * Wraps an existing grid container (pass its layout class via `className`)
 * and reveals its direct children with a quick, staggered fade/rise the
 * first time it scrolls into view. Deliberately lighter and faster than
 * the storytelling sections (molecule, journey) — this grid is where
 * people click "buy," so the animation gets out of the way quickly
 * rather than lingering.
 */
export function ProductGridReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [settled, setSettled] = useState(false)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
  }, [])

  useEffect(() => {
    if (!armed) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [armed])

  useEffect(() => {
    if (!visible) return
    // Once the reveal has visibly finished, drop our transition override so
    // the cards' own fast hover transition takes back over permanently —
    // otherwise hover would feel sluggish forever after, stuck on our
    // slower entrance timing.
    const t = setTimeout(() => setSettled(true), 650)
    return () => clearTimeout(t)
  }, [visible])

  const cls = [className, !settled && armed && styles.armed, !settled && visible && styles.visible]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  )
}
