'use client'

import { useState, Fragment } from 'react'
import useSWR from 'swr'
import { LotVariantsEditor } from './LotVariantsEditor'
import styles from './LotsAdminClient.module.css'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Lot = {
  id: string; lot_code: string; name: string; grade: 'AA' | 'AB'; region: string
  farm: string | null; process: string | null; altitude: string | null; variety: string | null
  tasting_notes: string | null; cupping_score: number | string | null; harvest_date: string | null
  story: string | null; image_url: string | null
  status: 'active' | 'sold_out' | 'archived'
}
type NameWord = { id: string; word: string; grade: 'AA' | 'AB' }

// Fields that can be changed after a lot is created. Grade, name and lot_code
// are fixed on purpose: lot_code is printed on stickers and must never change.
type LotFields = {
  region: string; farm: string; process: string; altitude: string; variety: string
  tasting_notes: string; cupping_score: string; harvest_date: string; story: string; image_url: string
}

const emptyForm = {
  grade: 'AA' as 'AA' | 'AB', name_word_id: '', region: '', farm: '', process: '',
  altitude: '', variety: '', tasting_notes: '', cupping_score: '', harvest_date: '', story: '', image_url: '',
}

const BADGE_CLASS: Record<Lot['status'], string> = {
  active: 'badgeActive',
  sold_out: 'badgeSoldOut',
  archived: 'badgeArchived',
}

function toFields(lot: Lot): LotFields {
  return {
    region: lot.region ?? '',
    farm: lot.farm ?? '',
    process: lot.process ?? '',
    altitude: lot.altitude ?? '',
    variety: lot.variety ?? '',
    tasting_notes: lot.tasting_notes ?? '',
    cupping_score: lot.cupping_score == null ? '' : String(lot.cupping_score),
    harvest_date: lot.harvest_date ?? '',
    story: lot.story ?? '',
    image_url: lot.image_url ?? '',
  }
}

export function LotsAdminClient() {
  const { data: lots, mutate: mutateLots } = useSWR<Lot[]>('/api/admin/lots', fetcher)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [panel, setPanel] = useState<{ id: string; kind: 'variants' | 'edit' } | null>(null)
  const [editForm, setEditForm] = useState<LotFields | null>(null)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const { data: words } = useSWR<NameWord[]>(`/api/admin/name-words?grade=${form.grade}`, fetcher)

  function update<K extends keyof typeof emptyForm>(key: K, value: typeof emptyForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function updateEdit<K extends keyof LotFields>(key: K, value: string) {
    setEditForm((f) => (f ? { ...f, [key]: value } : f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!form.name_word_id) return setFormError('Pick a name for this lot.')
    if (!form.region.trim()) return setFormError('Region is required.')

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cupping_score: form.cupping_score ? Number(form.cupping_score) : null,
          harvest_date: form.harvest_date || null,
        }),
      })
      const body = await res.json()
      if (!res.ok) return setFormError(body.error ?? 'Failed to create lot')
      setForm(emptyForm)
      mutateLots()
    } finally {
      setSubmitting(false)
    }
  }

  async function updateStatus(id: string, status: Lot['status']) {
    await fetch(`/api/admin/lots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    mutateLots()
  }

  function toggleVariants(lot: Lot) {
    setPanel(panel?.id === lot.id && panel.kind === 'variants' ? null : { id: lot.id, kind: 'variants' })
  }

  function toggleEdit(lot: Lot) {
    if (panel?.id === lot.id && panel.kind === 'edit') {
      setPanel(null)
      return
    }
    setEditForm(toFields(lot))
    setEditError(null)
    setPanel({ id: lot.id, kind: 'edit' })
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!panel || !editForm) return
    setEditError(null)
    if (!editForm.region.trim()) return setEditError('Region is required.')

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/lots/${panel.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          cupping_score: editForm.cupping_score === '' ? null : Number(editForm.cupping_score),
          harvest_date: editForm.harvest_date || null,
        }),
      })
      const body = await res.json()
      if (!res.ok) return setEditError(body.error ?? 'Failed to save changes')
      await mutateLots()
      setPanel(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Coffee Lots</h1>

      <section className={styles.card}>
        <h2 className={styles['section-title']}>New Lot</h2>
        <form className={styles['form-grid']} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Grade
            <select value={form.grade} onChange={(e) => { update('grade', e.target.value as 'AA' | 'AB'); update('name_word_id', '') }}>
              <option value="AA">AA</option>
              <option value="AB">AB</option>
            </select>
          </label>

          <label className={styles.field}>
            Name
            <select value={form.name_word_id} onChange={(e) => update('name_word_id', e.target.value)}>
              <option value="">Select a name…</option>
              {words?.map((w) => <option key={w.id} value={w.id}>{w.word}</option>)}
            </select>
            {words && words.length === 0 && (
              <span className={styles.warning}>No available names left for grade {form.grade}.</span>
            )}
          </label>

          <label className={styles.field}>
            Region
            <input value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="e.g. Kirinyaga" />
          </label>
          <label className={styles.field}>
            Farm / Cooperative
            <input value={form.farm} onChange={(e) => update('farm', e.target.value)} />
          </label>
          <label className={styles.field}>
            Process
            <input value={form.process} onChange={(e) => update('process', e.target.value)} placeholder="e.g. Washed" />
          </label>
          <label className={styles.field}>
            Altitude
            <input value={form.altitude} onChange={(e) => update('altitude', e.target.value)} placeholder="e.g. 1,700–1,900 masl" />
          </label>
          <label className={styles.field}>
            Variety
            <input value={form.variety} onChange={(e) => update('variety', e.target.value)} placeholder="e.g. SL28, SL34" />
          </label>
          <label className={styles.field}>
            Cupping Score
            <input type="number" step="0.25" value={form.cupping_score} onChange={(e) => update('cupping_score', e.target.value)} />
          </label>
          <label className={styles.field}>
            Harvest Date
            <input type="date" value={form.harvest_date} onChange={(e) => update('harvest_date', e.target.value)} />
          </label>
          <label className={`${styles.field} ${styles['field-wide']}`}>
            Image URL
            <input value={form.image_url} onChange={(e) => update('image_url', e.target.value)} placeholder="https://..." />
          </label>
          <label className={`${styles.field} ${styles['field-wide']}`}>
            Tasting Notes
            <textarea value={form.tasting_notes} onChange={(e) => update('tasting_notes', e.target.value)} />
          </label>
          <label className={`${styles.field} ${styles['field-wide']}`}>
            Story
            <textarea value={form.story} onChange={(e) => update('story', e.target.value)} />
          </label>

          {formError && <p className={styles.error}>{formError}</p>}
          <button className={styles.submitBtn} type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Create Lot'}
          </button>
        </form>
      </section>

      <section className={styles.card}>
        <h2 className={styles['section-title']}>Lots</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Grade</th><th>Region</th><th>Status</th><th>QR</th><th>Variants</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {lots?.map((lot) => (
              <Fragment key={lot.id}>
                <tr>
                  <td>{lot.name}</td>
                  <td>{lot.grade}</td>
                  <td>{lot.region}{lot.farm ? ` · ${lot.farm}` : ''}</td>
                  <td><span className={`${styles.badge} ${styles[BADGE_CLASS[lot.status]]}`}>{lot.status.replace('_', ' ')}</span></td>
                  <td><a className={styles.qrLink} href={`/admin/lots/${lot.id}/qr`} target="_blank" rel="noopener noreferrer">Download</a></td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => toggleVariants(lot)}>
                      {panel?.id === lot.id && panel.kind === 'variants' ? 'Hide' : 'Manage'}
                    </button>
                  </td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => toggleEdit(lot)}>
                      {panel?.id === lot.id && panel.kind === 'edit' ? 'Close' : 'Edit'}
                    </button>
                    {lot.status === 'active' && <button className={styles.actionBtn} onClick={() => updateStatus(lot.id, 'sold_out')}>Mark sold out</button>}
                    {lot.status === 'sold_out' && <button className={styles.actionBtn} onClick={() => updateStatus(lot.id, 'active')}>Reactivate</button>}
                    {lot.status !== 'archived' && <button className={styles.actionBtn} onClick={() => updateStatus(lot.id, 'archived')}>Archive</button>}
                  </td>
                </tr>

                {panel?.id === lot.id && panel.kind === 'variants' && (
                  <tr>
                    <td colSpan={7}>
                      <LotVariantsEditor lotId={lot.id} />
                    </td>
                  </tr>
                )}

                {panel?.id === lot.id && panel.kind === 'edit' && editForm && (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.variantsPanel}>
                        <form className={styles['form-grid']} onSubmit={saveEdit}>
                          <label className={styles.field}>
                            Region
                            <input value={editForm.region} onChange={(e) => updateEdit('region', e.target.value)} />
                          </label>
                          <label className={styles.field}>
                            Farm / Cooperative
                            <input value={editForm.farm} onChange={(e) => updateEdit('farm', e.target.value)} />
                          </label>
                          <label className={styles.field}>
                            Process
                            <input value={editForm.process} onChange={(e) => updateEdit('process', e.target.value)} />
                          </label>
                          <label className={styles.field}>
                            Altitude
                            <input value={editForm.altitude} onChange={(e) => updateEdit('altitude', e.target.value)} />
                          </label>
                          <label className={styles.field}>
                            Variety
                            <input value={editForm.variety} onChange={(e) => updateEdit('variety', e.target.value)} />
                          </label>
                          <label className={styles.field}>
                            Cupping Score
                            <input type="number" step="0.25" value={editForm.cupping_score} onChange={(e) => updateEdit('cupping_score', e.target.value)} />
                          </label>
                          <label className={styles.field}>
                            Harvest Date
                            <input type="date" value={editForm.harvest_date} onChange={(e) => updateEdit('harvest_date', e.target.value)} />
                          </label>
                          <label className={`${styles.field} ${styles['field-wide']}`}>
                            Image URL
                            <input value={editForm.image_url} onChange={(e) => updateEdit('image_url', e.target.value)} placeholder="https://..." />
                          </label>
                          <label className={`${styles.field} ${styles['field-wide']}`}>
                            Tasting Notes
                            <textarea value={editForm.tasting_notes} onChange={(e) => updateEdit('tasting_notes', e.target.value)} />
                          </label>
                          <label className={`${styles.field} ${styles['field-wide']}`}>
                            Story
                            <textarea value={editForm.story} onChange={(e) => updateEdit('story', e.target.value)} />
                          </label>

                          <p className={`${styles.warning} ${styles['field-wide']}`}>
                            Name, grade and QR code can&apos;t be changed, so printed stickers stay valid.
                          </p>
                          {editError && <p className={styles.error}>{editError}</p>}
                          <button className={styles.submitBtn} type="submit" disabled={saving}>
                            {saving ? 'Saving…' : 'Save changes'}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}