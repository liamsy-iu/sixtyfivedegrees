'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './JourneyTimeline.module.css'

const JOURNEY = [
  {
    num: '01',
    title: 'Harvest',
    desc: 'Only ripe cherries are selected, picked by hand over multiple passes through the season rather than stripped all at once.',
    icon: 'harvest',
  },
  {
    num: '02',
    title: 'Process',
    desc: 'Cherries are pulped and fermented to remove the mucilage, then washed clean — a controlled process that shapes clarity and acidity in the cup.',
    icon: 'process',
  },
  {
    num: '03',
    title: 'Dry',
    desc: 'Parchment coffee is sun-dried on raised beds and turned by hand until it reaches the moisture level required for stable storage.',
    icon: 'dry',
  },
  {
    num: '04',
    title: 'Mill & Grade',
    desc: 'Dried parchment is hulled, then sorted by size, density, and defect count — the sorting that separates specialty lots from commercial ones.',
    icon: 'grade',
  },
  {
    num: '05',
    title: 'Cup & Score',
    desc: "Each lot is evaluated against the SCA's cupping protocol. Only coffee scoring 80 points or above earns the specialty grade.",
    icon: 'score',
  },
  {
    num: '06',
    title: 'Roast',
    desc: 'Green beans are roasted in small batches, the curve adjusted to each lot to develop its natural sweetness without masking origin character.',
    icon: 'roast',
  },
  {
    num: '07',
    title: 'Brew',
    desc: 'Ground fresh to order and brewed to a balanced ratio — the final, most fleeting step in a journey that starts months earlier at the farm.',
    icon: 'brew',
  },
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
    case 'process':
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
    case 'grade':
      return (
        <svg {...props}>
          <rect x="7" y="10" width="26" height="12" rx="1" />
          <line x1="13" y1="10" x2="13" y2="22" />
          <line x1="19" y1="10" x2="19" y2="22" />
          <line x1="25" y1="10" x2="25" y2="22" />
          <line x1="7" y1="16" x2="33" y2="16" />
          <circle cx="13" cy="29" r="2" fill="currentColor" stroke="none" />
          <circle cx="20" cy="33" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="27" cy="29" r="1" fill="currentColor" stroke="none" />
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

const COUNT = JOURNEY.length

export function JourneyTimeline() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [armed, setArmed] = useState(false)
  // Which step indices have individually scrolled into view.
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

  // The line grows to catch up with the furthest step revealed so far.
  const lastSeenIndex = seen.lastIndexOf(true)
  const lineProgress = armed ? (lastSeenIndex === -1 ? 0 : (lastSeenIndex + 1) / COUNT) : 1

  return (
    <div className={`${styles.track} ${armed ? styles.armed : ''}`}>
      <div className={styles.line} style={{ transform: `scaleY(${lineProgress})` }} aria-hidden="true" />
      {JOURNEY.map((step, i) => (
        <div
          key={step.num}
          ref={(el) => { stepRefs.current[i] = el }}
          data-idx={i}
          className={`${styles.step} ${seen[i] ? styles.seen : ''}`}
        >
          <div className={styles['icon-col']}>
            <div className={styles.badge}>
              <JourneyIcon type={step.icon} />
            </div>
          </div>
          <div className={styles.content}>
            <p className={styles.num}>{step.num}</p>
            <p className={styles.title}>{step.title}</p>
            <p className={styles.desc}>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
