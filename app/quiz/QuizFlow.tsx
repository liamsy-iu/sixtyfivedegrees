'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lot } from '@/lib/lots'
import {
  getLotCardColor, getStartingPrice, getAvailableRoasts, isLotSoldOut,
} from '@/lib/utils/lotDisplay'
import styles from './QuizFlow.module.css'

type Roast = 'dark' | 'medium'
type Drink = 'black' | 'milk'
type Vibe = 'ritual' | 'adventure'

const RESULTS: Record<string, string> = {
  'milk-dark': 'Bold, familiar, no fuss.',
  'milk-medium': 'Smooth, balanced, reliable.',
  'black-dark': 'Intense, complex, unapologetic.',
  'black-medium': 'Vibrant, layered, worth slowing down for.',
}

const VIBE_LINES: Record<Vibe, string> = {
  ritual: 'daily ritual, sorted.',
  adventure: 'next adventure, brewing.',
}

const QUESTIONS = [
  {
    q: 'Pick your morning energy.',
    options: [
      { label: 'Bold & intense', value: 'dark' as Roast },
      { label: 'Bright & balanced', value: 'medium' as Roast },
    ],
  },
  {
    q: 'How do you take it?',
    options: [
      { label: 'Black. Let the coffee speak.', value: 'black' as Drink },
      { label: 'With milk. Every single day.', value: 'milk' as Drink },
    ],
  },
  {
    q: "What's coffee to you?",
    options: [
      { label: 'My daily ritual', value: 'ritual' as Vibe },
      { label: 'My daily adventure', value: 'adventure' as Vibe },
    ],
  },
]

// Roast decides which lots are eligible. Black drinkers get the highest-scoring
// eligible lot; milk drinkers get the best value (lowest starting price).
// If nothing in stock has the chosen roast, fall back to any in-stock lot.
function pickLot(lots: Lot[], roast: Roast, drink: Drink) {
  const inStock = lots.filter((l) => !isLotSoldOut(l))
  if (inStock.length === 0) return null

  const matching = inStock.filter((l) => getAvailableRoasts(l.variants).includes(roast))
  const pool = matching.length > 0 ? matching : inStock

  const sorted = [...pool].sort((a, b) => {
    if (drink === 'black') return Number(b.cupping_score ?? 0) - Number(a.cupping_score ?? 0)
    const pa = getStartingPrice(a.variants)?.price ?? Infinity
    const pb = getStartingPrice(b.variants)?.price ?? Infinity
    return pa - pb
  })

  return { lot: sorted[0], roastMatched: matching.length > 0 }
}

export function QuizFlow({ lots }: { lots: Lot[] }) {
  const [step, setStep] = useState(0)
  const [roast, setRoast] = useState<Roast | null>(null)
  const [drink, setDrink] = useState<Drink | null>(null)
  const [vibe, setVibe] = useState<Vibe | null>(null)

  function answer(index: number, value: string) {
    if (index === 0) setRoast(value as Roast)
    if (index === 1) setDrink(value as Drink)
    if (index === 2) setVibe(value as Vibe)
    setStep(index + 1)
  }

  function restart() {
    setStep(0); setRoast(null); setDrink(null); setVibe(null)
  }

  if (step < 3) {
    const question = QUESTIONS[step]
    return (
      <section className={styles.quiz}>
        <div className={styles.container}>
          <div className={styles.progress}>
            {QUESTIONS.map((_, i) => (
              <span key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`} />
            ))}
          </div>
          <p className={styles.qnum}>Question {step + 1} of 3</p>
          <h2 className={styles.question}>{question.q}</h2>
          <div className={styles.options}>
            {question.options.map((opt) => (
              <button key={opt.value} className={styles.option} onClick={() => answer(step, opt.value)}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const match = pickLot(lots, roast!, drink!)

  if (!match) {
    return (
      <section className={styles.result}>
        <div className={styles.container}>
          <div className={styles['result-empty']}>
            <p className={styles['result-empty-text']}>
              Our current lots are all sold out. New ones are on their way.
            </p>
            <Link href="/shop" className={styles['result-empty-link']}>See the shop →</Link>
          </div>
        </div>
      </section>
    )
  }

  const { lot, roastMatched } = match
  const lotRoasts = getAvailableRoasts(lot.variants)
  const shownRoast: Roast = roastMatched ? roast! : (lotRoasts[0] ?? roast!)
  const roastLabel = shownRoast === 'dark' ? 'Dark roast' : 'Medium roast'
  const title = RESULTS[`${drink}-${shownRoast}`]
  const line = VIBE_LINES[vibe!]

  return (
    <section className={styles.result}>
      <div className={styles.container}>
        <p className={styles['result-eye']}>Your match</p>
        <div className={styles['result-card']} style={{ '--card-color': getLotCardColor(lot.lot_code) } as React.CSSProperties}>
          <div className={styles['result-visual']}>
            {lot.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lot.image_url}
                alt={lot.name}
                className={styles['result-img']}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            ) : (
              <div className={styles['result-typo']}>
                <span className={styles['result-typo-name']}>{lot.name}</span>
                <span className={styles['result-typo-grade']}>{lot.grade} Grade</span>
              </div>
            )}
          </div>
          <div className={styles['result-info']}>
            <p className={styles['result-tag']}>{lot.grade} grade · {roastLabel}</p>
            <h2 className={styles['result-title']}>{title}</h2>
            <p className={styles['result-line']}>Your {line}</p>
            <p className={styles['result-lot']}>
              {lot.name} · {lot.region}{lot.process ? ` · ${lot.process}` : ''}
            </p>
            {!roastMatched && (
              <p className={styles['result-note']}>
                We don&apos;t have a {roast} roast in stock right now, so this is the best match we have.
              </p>
            )}
            <div className={styles['result-actions']}>
              <Link href={`/lots/${lot.lot_code}`} className={styles['result-cta']}>Shop this lot</Link>
              <button onClick={restart} className={styles['result-retry']}>Retake the quiz</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}