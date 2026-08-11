'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from '@/components/home/JourneyTimeline/JourneyTimeline.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Send an enquiry',
    desc: 'Tell us your volume, grade preference, and delivery schedule. We\u2019ll get back to you within 24 hours.',
    icon: 'envelope',
  },
  {
    num: '02',
    title: 'Taste the beans',
    desc: 'We\u2019ll send a sample kit before your first full order so you can taste both grades and pick the right fit for your menu.',
    icon: 'score',
  },
  {
    num: '03',
    title: 'Regular supply',
    desc: 'Order as needed. Pay via M-Pesa or bank transfer. Free delivery in Nairobi, worldwide shipping on request.',
    icon: 'repeat',
  },
] as const

function StepIcon({ type }: { type: string }) {
  const props = { viewBox: '0 0 40 40', className: styles.icon, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 } as const
  switch (type) {
    case 'envelope':
      return (
        <svg {...props}>
          <rect x="6" y="10" width="28" height="20" rx="1" />
          <path d="M6 11 L20 24 L34 11" />
        </svg>
      )
    case 'score':
      return (
        <svg {...props}>
          <ellipse cx="14" cy="13" rx="6" ry="8" transform="rotate(-25 14 13)" />
          <line x1="18" y1="19" x2="32" y2="33" />
          <path d="M30 4 L31.3 8.7 L36 10 L31.3 11.3 L30 16 L28.7 11.3 L24 10 L28.7 8.7 Z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'repeat':
      return (
        <svg {...props} strokeLinecap="round">
          <path d="M 28.4 11.0 A 13 13 0 1 1 10.0 12.6" />
          <path d="M 28.4 11.0 L 23.4 10.8 M 28.4 11.0 L 29.7 6.2" />
        </svg>
      )
    default:
      return null
  }
}

const COUNT = STEPS.length

export function TradeProcess() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [armed, setArmed] = useState(false)
  const [seen, setSeen] = useState<boolean[]>(() => Array(COUNT).fill(false))

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
  }, [])

  useEffect(() => {
    if (!armed) return
    const observer = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          const next = [...prev]
          let changed = false
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const idx = Number((entry.target as HTMLElement).dataset.idx)
            if (!next[idx]) {
              next[idx] = true
              changed = true
            }
            observer.unobserve(entry.target)
          }
          return changed ? next : prev
        })
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [armed])

  const lastSeenIndex = seen.lastIndexOf(true)
  const lineProgress = armed ? (lastSeenIndex === -1 ? 0 : (lastSeenIndex + 1) / COUNT) : 1

  return (
    <div className={`${styles.track} ${armed ? styles.armed : ''}`}>
      <div className={styles.line} style={{ transform: `scaleY(${lineProgress})` }} aria-hidden="true" />
      {STEPS.map((step, i) => (
        <div
          key={step.num}
          ref={(el) => { stepRefs.current[i] = el }}
          data-idx={i}
          className={`${styles.step} ${seen[i] ? styles.seen : ''}`}
        >
          <div className={styles['icon-col']}>
            <div className={styles.badge}>
              <StepIcon type={step.icon} />
            </div>
          </div>
          <div className={styles.content}>
            <span className={styles['big-num']} aria-hidden="true">{step.num}</span>
            <p className={styles.num}>{step.num}</p>
            <p className={styles.title}>{step.title}</p>
            <p className={styles.desc}>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
