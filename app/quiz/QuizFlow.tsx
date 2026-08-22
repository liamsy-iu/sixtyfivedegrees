'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProductImage } from '@/lib/utils/productImages'
import styles from './QuizFlow.module.css'

type Roast = 'dark' | 'medium'
type Grade = 'classic' | 'premium'
type Vibe = 'ritual' | 'adventure'

const CARD_COLORS: Record<string, string> = {
  'kenya-premium-dark': '#5C2D0E',
  'kenya-premium-medium': '#1E4035',
  'kenya-classic-dark': '#1A2744',
  'kenya-classic-medium': '#7A3120',
}

const RESULTS: Record<string, { title: string; line: string }> = {
  'kenya-classic-dark': { title: 'Bold, familiar, no fuss.', line: 'daily ritual, sorted.' },
  'kenya-classic-medium': { title: 'Smooth, balanced, reliable.', line: 'daily ritual, sorted.' },
  'kenya-premium-dark': { title: 'Intense, complex, unapologetic.', line: 'next adventure, brewing.' },
  'kenya-premium-medium': { title: 'Vibrant, layered, worth slowing down for.', line: 'next adventure, brewing.' },
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
      { label: 'Black. Let the coffee speak.', value: 'premium' as Grade },
      { label: 'With milk. Every single day.', value: 'classic' as Grade },
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

export function QuizFlow() {
  const [step, setStep] = useState(0)
  const [roast, setRoast] = useState<Roast | null>(null)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [vibe, setVibe] = useState<Vibe | null>(null)

  function answer(index: number, value: string) {
    if (index === 0) setRoast(value as Roast)
    if (index === 1) setGrade(value as Grade)
    if (index === 2) setVibe(value as Vibe)
    setStep(index + 1)
  }

  function restart() {
    setStep(0); setRoast(null); setGrade(null); setVibe(null)
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

  const slug = `kenya-${grade}-${roast}`
  const result = RESULTS[slug]
  const image = getProductImage(slug)
  const cardColor = CARD_COLORS[slug]
  const gradeLabel = grade === 'classic' ? 'Classic' : 'Premium'
  const roastLabel = roast === 'dark' ? 'Dark roast' : 'Medium roast'

  return (
    <section className={styles.result}>
      <div className={styles.container}>
        <p className={styles['result-eye']}>Your match</p>
        <div className={styles['result-card']} style={{ '--card-color': cardColor } as React.CSSProperties}>
          <div className={styles['result-visual']}>
            {image && <Image src={image} alt={`${gradeLabel} ${roastLabel}`} fill className={styles['result-img']} />}
          </div>
          <div className={styles['result-info']}>
            <p className={styles['result-tag']}>{gradeLabel} · {roastLabel}</p>
            <h2 className={styles['result-title']}>{result.title}</h2>
            <p className={styles['result-line']}>Your {result.line}</p>
            <div className={styles['result-actions']}>
              <Link href={`/shop/${slug}`} className={styles['result-cta']}>Shop this roast</Link>
              <button onClick={restart} className={styles['result-retry']}>Retake the quiz</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
