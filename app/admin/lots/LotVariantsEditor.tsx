'use client'

import useSWR from 'swr'
import { useState } from 'react'
import styles from './LotsAdminClient.module.css'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Variant = {
  id: string; roast: string; grind: string; grind_size: string | null
  size_grams: number; price: number; is_available: boolean
}

export function LotVariantsEditor({ lotId }: { lotId: string }) {
  const { data: variants, mutate } = useSWR<Variant[]>(`/api/admin/lots/${lotId}/variants`, fetcher)
  const [generating, setGenerating] = useState(false)

  async function generate() {
    setGenerating(true)
    const res = await fetch(`/api/admin/lots/${lotId}/variants`, { method: 'POST' })
    if (res.ok) mutate()
    setGenerating(false)
  }

  async function updateVariant(id: string, patch: Partial<Pick<Variant, 'price' | 'is_available'>>) {
    await fetch(`/api/admin/variants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    mutate()
  }

  if (!variants) return <p className={styles.variantsEmpty}>Loading variants…</p>

  if (variants.length === 0) {
    return (
      <div className={styles.variantsPanel}>
        <div className={styles.variantsEmpty}>
          <span>No variants yet for this lot.</span>
          <button className={styles.generateBtn} onClick={generate} disabled={generating}>
            {generating ? 'Generating…' : 'Generate all combinations'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.variantsPanel}>
      <table className={styles.variantsTable}>
        <thead>
          <tr><th>Roast</th><th>Format</th><th>Grind size</th><th>Size</th><th>Price (KES)</th><th>Available</th></tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id} className={v.is_available ? undefined : styles.variantRowOff}>
              <td>{v.roast}</td>
              <td>{v.grind === 'whole_bean' ? 'Whole bean' : 'Ground'}</td>
              <td>{v.grind_size ?? '—'}</td>
              <td>{v.size_grams}g</td>
              <td>
                <input
                  className={styles.priceInput}
                  type="number"
                  value={v.price / 100}
                  onChange={(e) => updateVariant(v.id, { price: Math.round(Number(e.target.value) * 100) })}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={v.is_available}
                  onChange={(e) => updateVariant(v.id, { is_available: e.target.checked })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}