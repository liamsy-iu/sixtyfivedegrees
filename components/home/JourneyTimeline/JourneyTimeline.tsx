'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './JourneyTimeline.module.css'

const JOURNEY = [
  { num: '01', title: 'Harvest', desc: 'Hand-picked ripe cherries, Kiambu', icon: 'harvest' },
  { num: '02', title: 'Wash', desc: 'Pulped and fermented clean', icon: 'wash' },
  { num: '03', title: 'Dry', desc: 'Sun-dried on raised beds', icon: 'dry' },
  { num: '04', title: 'Roast', desc: 'Small batch, Nairobi', icon: 'roast' },
  { num: '05', title: 'Grind', desc: 'Fresh, to order', icon: 'grind' },
  { num: '06', title: 'Brew', desc: 'Steamed to 65°', icon: 'brew' },
] as const

function JourneyIcon({ type }: { type: string }) {
  const props = { viewBox: '0 0 40 40', className: styles.icon, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 } as const
  switch (type) {
    case 'harvest':
      return (
        <svg {...props}>
          <line x1="6" y1="34" x2="30" y2="8" />
          <circle cx="14" cy="27" r="4.5" />
          <circle cx="24" cy="16" r="4.5" />
        </svg>
      )
    case 'wash':
      return (
        <svg {...props}>
          <path d="M20 5 C26 15 31 21 20 34 C9 21 14 15 20 5 Z" />
        </svg>
      )
    case 'dry':
      return (
        <svg {...props}>
          <circle cx="20" cy="20" r="7" />
          <line x1="20" y1="4" x2="20" y2="9" />
          <line x1="20" y1="31" x2="20" y2="36" />
          <line x1="4" y1="20" x2="9" y2="20" />
          <line x1="31" y1="20" x2="36" y2="20" />
          <line x1="8" y1="8" x2="11.5" y2="11.5" />
          <line x1="28.5" y1="28.5" x2="32" y2="32" />
          <line x1="32" y1="8" x2="28.5" y2="11.5" />
          <line x1="11.5" y1="28.5" x2="8" y2="32" />
        </svg>
      )
    case 'roast':
      return (
        <svg {...props}>
          <ellipse cx="20" cy="25" rx="9" ry="12" />
          <path d="M20 14 C16 18 24 22 20 25 C16 28 24 32 20 36" />
          <path d="M13 10 C11 7 15 6 13 2" />
          <path d="M20 10 C18 7 22 6 20 2" />
          <path d="M27 10 C25 7 29 6 27 2" />
        </svg>
      )
    case 'grind':
      return (
        <svg {...props}>
          <path d="M10 8 L30 8 L20 19 Z" />
          <line x1="20" y1="19" x2="20" y2="27" />
          <rect x="13" y="27" width="14" height="6" />
          <circle cx="14" cy="37" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="20" cy="37" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="26" cy="37" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'brew':
      return (
        <svg {...props}>
          <path d="M14 15 C12 11 15 9 13 5" />
          <path d="M22 15 C20 11 23 9 21 5" />
          <path d="M10 18 L30 18 L27 33 L13 33 Z" />
          <path d="M30 20 C36 20 36 29 30 29" />
        </svg>
      )
    default:
      return null
  }
}

export function JourneyTimeline() {
  const trackRef = useRef<HTMLDivElement>(null)
  // "armed" = JS has taken over and it's now safe to hide content pre-reveal.
  // Stays false (content stays visible, no animation) if JS never runs or the
  // user prefers reduced motion — this is a progressive enhancement, not a
  // requirement for seeing the section.
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
  }, [])

  useEffect(() => {
    if (!armed) return
    const el = trackRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [armed])

  const trackClass = [styles.track, armed && styles.armed, visible && styles.visible].filter(Boolean).join(' ')

  return (
    <div ref={trackRef} className={trackClass}>
      {JOURNEY.map((step, i) => (
        <div key={step.num} className={styles.step} style={{ transitionDelay: `${i * 150}ms` }}>
          <div className={styles['icon-wrap']}>
            <JourneyIcon type={step.icon} />
          </div>
          <span className={styles.dot} aria-hidden="true" />
          <p className={styles.num}>{step.num}</p>
          <p className={styles.title}>{step.title}</p>
          <p className={styles.desc}>{step.desc}</p>
        </div>
      ))}
    </div>
  )
}
