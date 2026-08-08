'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from '@/components/home/JourneyTimeline/JourneyTimeline.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Mill & Grade',
    desc: 'Parchment is hulled, then sorted by screen size and density — the same convention behind Kenya’s AA, AB, and PB grades.',
    icon: 'grade',
  },
  {
    num: '02',
    title: 'Defect Grading',
    desc: 'Each 350g sample is checked against the SCA’s two-category system: zero primary defects (full black, full sour, foreign matter), no more than five secondary defects, to qualify as specialty.',
    icon: 'magnify',
  },
  {
    num: '03',
    title: 'Moisture & Water Activity',
    desc: 'Every lot is tested for both moisture content and water activity, held below the SCA’s 0.70aw ceiling — the more reliable predictor of spoilage risk in transit.',
    icon: 'gauge',
  },
  {
    num: '04',
    title: 'Cupping & Scoring',
    desc: 'Sample roasted and cupped to the SCA protocol — 8.25g to 150ml, water at 92.2–94.4°C, evaluated 8 to 24 hours after roasting. Only lots scoring 80 or above are offered as specialty.',
    icon: 'score',
  },
  {
    num: '05',
    title: 'Sample Approval',
    desc: 'Approved lots ship out as pre-shipment samples so you can cup and confirm the profile yourself before committing to a contract.',
    icon: 'seal',
  },
  {
    num: '06',
    title: 'Packaging & Documentation',
    desc: 'Hermetic, GrainPro-lined bags protect moisture and water activity in transit. Every lot travels with full traceability — farm, elevation, variety, process — plus certificate of origin and phytosanitary paperwork.',
    icon: 'package',
  },
  {
    num: '07',
    title: 'Shipment',
    desc: 'FOB Mombasa, with cupping notes and lot documentation accompanying every shipment so what you ordered is what arrives.',
    icon: 'ship',
  },
] as const

function StepIcon({ type }: { type: string }) {
  const props = { viewBox: '0 0 40 40', className: styles.icon, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 } as const
  switch (type) {
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
    case 'magnify':
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="10" />
          <line x1="23.5" y1="23.5" x2="34" y2="34" />
          <ellipse cx="16" cy="16" rx="4.5" ry="6.5" />
          <path d="M16 10 C13.5 13 13.5 19 16 22" />
        </svg>
      )
    case 'gauge':
      return (
        <svg {...props}>
          <path d="M20 5 C26 15 31 21 20 34 C9 21 14 15 20 5 Z" />
          <line x1="12" y1="20" x2="28" y2="20" />
          <line x1="24" y1="17" x2="24" y2="23" />
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
    case 'seal':
      return (
        <svg {...props}>
          <circle cx="20" cy="20" r="14" />
          <path d="M13 20 L18 25 L28 13" />
        </svg>
      )
    case 'package':
      return (
        <svg {...props}>
          <rect x="9" y="13" width="22" height="19" />
          <line x1="9" y1="22.5" x2="31" y2="22.5" />
          <line x1="20" y1="13" x2="20" y2="32" />
          <rect x="27" y="5" width="7" height="7" transform="rotate(20 30.5 8.5)" />
          <circle cx="32.2" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'ship':
      return (
        <svg {...props}>
          <path d="M6 27 C10 33 30 33 34 27" />
          <line x1="9" y1="27" x2="31" y2="27" />
          <rect x="16" y="17" width="8" height="10" />
          <line x1="20" y1="17" x2="20" y2="7" />
          <path d="M20 7 L29 10.5 L20 13.5 Z" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return null
  }
}

const COUNT = STEPS.length

export function ExportProcess() {
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
