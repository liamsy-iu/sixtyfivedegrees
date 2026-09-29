'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lot } from '@/lib/lots'
import {
  getLotCardColor, getLotCardColorForIndex, getAvailableRoasts, isLotSoldOut,
} from '@/lib/utils/lotDisplay'
import styles from './QuizFlow.module.css'

type BrewMethod = 'espresso' | 'moka' | 'pourover' | 'drip' | 'frenchpress' | 'coldbrew' | 'wholebean'
type Taste = 'bright' | 'balanced' | 'bold'
type Drink = 'black' | 'milk'
type GrindSize = 'coarse' | 'medium-coarse' | 'medium' | 'fine'
type Roast = 'medium' | 'dark'

const BREW_CONFIG: Record<BrewMethod, {
  label: string
  grind: 'whole_bean' | 'ground'
  grindSize: GrindSize | null
  why: string
}> = {
  espresso: {
    label: 'Espresso machine',
    grind: 'ground', grindSize: 'fine',
    why: 'Water passes through in under 30 seconds, so a fine grind gives enough resistance to extract fully in that time.',
  },
  moka: {
    label: 'Moka pot / stovetop',
    grind: 'ground', grindSize: 'fine',
    why: 'Moka pots brew under pressure on a similar timescale to espresso, so they need the same fine grind.',
  },
  pourover: {
    label: 'Pour-over (V60, Kalita, Chemex)',
    grind: 'ground', grindSize: 'medium',
    why: 'A 2 to 4 minute contact time calls for a medium grind, fine enough to extract fully but coarse enough not to clog the filter.',
  },
  drip: {
    label: 'Drip coffee maker',
    grind: 'ground', grindSize: 'medium-coarse',
    why: 'Drip machines brew for several minutes with no control over pour rate, so a touch coarser than pour-over avoids over-extraction.',
  },
  frenchpress: {
    label: 'French press',
    grind: 'ground', grindSize: 'coarse',
    why: 'French press steeps for about 4 minutes with no paper filter, so a coarse grind keeps the cup from turning muddy and bitter.',
  },
  coldbrew: {
    label: 'Cold brew',
    grind: 'ground', grindSize: 'coarse',
    why: 'Steeping for 12 to 24 hours means even a medium grind would badly over-extract. Coarse is essential here.',
  },
  wholebean: {
    label: "I'll grind it myself",
    grind: 'whole_bean', grindSize: null,
    why: "Grinding right before brewing is the single biggest thing you can do for flavour, so we'll leave this to you.",
  },
}

const TASTE_KEYWORDS: Record<Taste, string[]> = {
  bright: ['citrus', 'lime', 'lemon', 'orange', 'berry', 'blackcurrant', 'currant', 'grape', 'wine', 'floral', 'jasmine', 'bergamot', 'tropical', 'fruit', 'acidity'],
  balanced: ['caramel', 'brown sugar', 'honey', 'vanilla', 'nutty', 'almond', 'toffee', 'sweet', 'balanced'],
  bold: ['chocolate', 'cocoa', 'spice', 'smoky', 'earthy', 'tobacco', 'molasses', 'bold', 'rich', 'full body'],
}

const TASTE_LABEL: Record<Taste, string> = {
  bright: 'Bright & fruity',
  balanced: 'Balanced & sweet',
  bold: 'Bold & rich',
}

const QUESTIONS: Array<{ key: 'brew' | 'taste' | 'drink'; q: string; options: Array<{ label: string; value: string }> }> = [
  {
    key: 'brew',
    q: 'How do you brew your coffee?',
    options: [
      { label: 'Espresso machine', value: 'espresso' },
      { label: 'Moka pot / stovetop', value: 'moka' },
      { label: 'Pour-over (V60, Kalita, Chemex)', value: 'pourover' },
      { label: 'Drip coffee maker', value: 'drip' },
      { label: 'French press', value: 'frenchpress' },
      { label: 'Cold brew', value: 'coldbrew' },
      { label: "I'll grind it myself", value: 'wholebean' },
    ],
  },
  {
    key: 'taste',
    q: 'Which sounds best to you?',
    options: [
      { label: 'Bright & fruity', value: 'bright' },
      { label: 'Balanced & sweet', value: 'balanced' },
      { label: 'Bold & rich', value: 'bold' },
    ],
  },
  {
    key: 'drink',
    q: 'How do you take it?',
    options: [
      { label: 'Black. Let the coffee speak.', value: 'black' },
      { label: 'With milk. Every single day.', value: 'milk' },
    ],
  },
]

function tasteScore(notes: string | null, taste: Taste): number {
  const text = (notes ?? '').toLowerCase()
  return TASTE_KEYWORDS[taste].reduce((score, kw) => score + (text.includes(kw) ? 1 : 0), 0)
}

function pickRoast(taste: Taste, drink: Drink): Roast {
  if (taste === 'bright') return 'medium'
  if (taste === 'bold') return 'dark'
  return drink === 'milk' ? 'dark' : 'medium'
}

function pickLot(lots: Lot[], roast: Roast, taste: Taste) {
  const inStock = lots.filter((l) => !isLotSoldOut(l))
  if (inStock.length === 0) return null

  const withRoast = inStock.filter((l) => getAvailableRoasts(l.variants).includes(roast))
  const pool = withRoast.length > 0 ? withRoast : inStock

  const sorted = [...pool].sort((a, b) => {
    const diff = tasteScore(b.tasting_notes, taste) - tasteScore(a.tasting_notes, taste)
    if (diff !== 0) return diff
    return Number(b.cupping_score ?? 0) - Number(a.cupping_score ?? 0)
  })

  return { lot: sorted[0], roastMatched: withRoast.length > 0 }
}

export function QuizFlow({ lots }: { lots: Lot[] }) {
  const [step, setStep] = useState(0)
  const [brew, setBrew] = useState<BrewMethod | null>(null)
  const [taste, setTaste] = useState<Taste | null>(null)
  const [drink, setDrink] = useState<Drink | null>(null)

  function answer(index: number, value: string) {
    if (index === 0) setBrew(value as BrewMethod)
    if (index === 1) setTaste(value as Taste)
    if (index === 2) setDrink(value as Drink)
    setStep(index + 1)
  }

  function restart() {
    setStep(0); setBrew(null); setTaste(null); setDrink(null)
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

  const brewConfig = BREW_CONFIG[brew!]
  const roast = pickRoast(taste!, drink!)
  const match = pickLot(lots, roast, taste!)

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
  const shownRoast: Roast = roastMatched ? roast : (lotRoasts[0] ?? roast)
  const roastLabel = shownRoast === 'dark' ? 'Dark roast' : 'Medium roast'

  const params = new URLSearchParams({ roast: shownRoast, grind: brewConfig.grind })
  if (brewConfig.grindSize) params.set('grindSize', brewConfig.grindSize)
  const lotHref = `/lots/${lot.lot_code}?${params.toString()}`

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
            <p className={styles['result-tag']}>{lot.grade} grade · {roastLabel} · {brewConfig.label}</p>
            <h2 className={styles['result-title']}>{lot.name}</h2>
            <p className={styles['result-lot']}>{lot.region}{lot.process ? ` · ${lot.process}` : ''}</p>

            {!roastMatched && (
              <p className={styles['result-note']}>
                We don&apos;t have a {roast} roast in stock right now, so this is the best match we have.
              </p>
            )}

            <div className={styles['result-why']}>
              <p className={styles['result-why-line']}>
                <strong>{roastLabel}:</strong> {taste === 'bright'
                  ? 'Lighter roasting preserves more of the acidity and aromatics behind bright, fruity flavours.'
                  : taste === 'bold'
                  ? 'Darker roasting develops more caramelised, chocolatey flavour from the bean itself.'
                  : drink === 'milk'
                  ? 'A fuller-bodied dark roast holds up better once milk is added.'
                  : 'A medium roast keeps things balanced without milk to soften it.'}
              </p>
              <p className={styles['result-why-line']}>
                <strong>{brewConfig.grind === 'whole_bean' ? 'Whole bean' : (brewConfig.grindSize ?? 'Ground')}:</strong> {brewConfig.why}
              </p>
            </div>

            <div className={styles['result-actions']}>
              <Link href={lotHref} className={styles['result-cta']}>Shop this match</Link>
              <button onClick={restart} className={styles['result-retry']}>Retake the quiz</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}