'use client'
import React from 'react';
import { useState } from 'react'
import useSWR from 'swr'
import { LotVariantsEditor } from './LotVariantsEditor'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Lot = {
  id: string; lot_code: string; name: string; grade: 'AA' | 'AB'; region: string
  farm: string | null; status: 'active' | 'sold_out' | 'archived'
}
type NameWord = { id: string; word: string; grade: 'AA' | 'AB' }

const emptyForm = {
  grade: 'AA' as 'AA' | 'AB', name_word_id: '', region: '', farm: '', process: '',
  altitude: '', variety: '', tasting_notes: '', cupping_score: '', harvest_date: '', story: '',
}

export function LotsAdminClient() {
  const { data: lots, mutate: mutateLots } = useSWR<Lot[]>('/api/admin/lots', fetcher)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [expandedLotId, setExpandedLotId] = useState<string | null>(null)

  const { data: words } = useSWR<NameWord[]>(`/api/admin/name-words?grade=${form.grade}`, fetcher)

  function update<K extends keyof typeof emptyForm>(key: K, value: typeof emptyForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
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

  return (
    <div className="admin-lots">
      <section className="admin-lots-form">
        <h2>New Lot</h2>
        <form onSubmit={handleSubmit}>
          <label>Grade
            <select value={form.grade} onChange={(e) => { update('grade', e.target.value as 'AA' | 'AB'); update('name_word_id', '') }}>
              <option value="AA">AA</option>
              <option value="AB">AB</option>
            </select>
          </label>

          <label>Name
            <select value={form.name_word_id} onChange={(e) => update('name_word_id', e.target.value)}>
              <option value="">Select a name…</option>
              {words?.map((w) => <option key={w.id} value={w.id}>{w.word}</option>)}
            </select>
            {words && words.length === 0 && (
              <span className="admin-lots-warning">No available names left for grade {form.grade}.</span>
            )}
          </label>

          <label>Region<input value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="e.g. Kirinyaga" /></label>
          <label>Farm / Cooperative<input value={form.farm} onChange={(e) => update('farm', e.target.value)} /></label>
          <label>Process<input value={form.process} onChange={(e) => update('process', e.target.value)} placeholder="e.g. Washed" /></label>
          <label>Altitude<input value={form.altitude} onChange={(e) => update('altitude', e.target.value)} placeholder="e.g. 1,700–1,900 masl" /></label>
          <label>Variety<input value={form.variety} onChange={(e) => update('variety', e.target.value)} placeholder="e.g. SL28, SL34" /></label>
          <label>Cupping Score<input type="number" step="0.25" value={form.cupping_score} onChange={(e) => update('cupping_score', e.target.value)} /></label>
          <label>Harvest Date<input type="date" value={form.harvest_date} onChange={(e) => update('harvest_date', e.target.value)} /></label>
          <label>Tasting Notes<textarea value={form.tasting_notes} onChange={(e) => update('tasting_notes', e.target.value)} /></label>
          <label>Story<textarea value={form.story} onChange={(e) => update('story', e.target.value)} /></label>

          {formError && <p className="admin-lots-error">{formError}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Create Lot'}</button>
        </form>
      </section>

      <section className="admin-lots-list">
        <h2>Lots</h2>
        <table>
          <thead><tr><th>Name</th><th>Grade</th><th>Region</th><th>Status</th><th>QR</th><th>Variants</th><th>Actions</th></tr></thead>
          <tbody>
            {lots?.map((lot) => (
              <React.Fragment key={lot.id}>
                <tr key={lot.id}>
                  <td>{lot.name}</td>
                  <td>{lot.grade}</td>
                  <td>{lot.region}{lot.farm ? ` · ${lot.farm}` : ''}</td>
                  <td>{lot.status}</td>
                  <td><a href={`/admin/lots/${lot.id}/qr`} target="_blank" rel="noopener noreferrer">Download</a></td>
                  <td>
                    <button onClick={() => setExpandedLotId(expandedLotId === lot.id ? null : lot.id)}>
                      {expandedLotId === lot.id ? 'Hide variants' : 'Manage variants'}
                    </button>
                  </td>
                  <td>
                    {lot.status === 'active' && <button onClick={() => updateStatus(lot.id, 'sold_out')}>Mark sold out</button>}
                    {lot.status === 'sold_out' && <button onClick={() => updateStatus(lot.id, 'active')}>Reactivate</button>}
                    {lot.status !== 'archived' && <button onClick={() => updateStatus(lot.id, 'archived')}>Archive</button>}
                  </td>
                </tr>
                {expandedLotId === lot.id && (
                  <tr>
                    <td colSpan={7}>
                      <LotVariantsEditor lotId={lot.id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}