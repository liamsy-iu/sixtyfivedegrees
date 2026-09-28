import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['active', 'sold_out', 'archived']
const TEXT_FIELDS = ['farm', 'process', 'altitude', 'variety', 'tasting_notes', 'story', 'image_url'] as const

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const patch: Record<string, any> = {}

  if ('status' in body) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    patch.status = body.status
  }

  if ('region' in body) {
    const region = String(body.region ?? '').trim()
    if (!region) return NextResponse.json({ error: 'Region cannot be empty' }, { status: 400 })
    patch.region = region
  }

  for (const field of TEXT_FIELDS) {
    if (field in body) patch[field] = String(body[field] ?? '').trim() || null
  }

  if ('cupping_score' in body) {
    if (body.cupping_score === null || body.cupping_score === '') {
      patch.cupping_score = null
    } else {
      const n = Number(body.cupping_score)
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        return NextResponse.json({ error: 'Cupping score must be between 0 and 100' }, { status: 400 })
      }
      patch.cupping_score = n
    }
  }

  if ('harvest_date' in body) patch.harvest_date = body.harvest_date || null

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('lots').update(patch).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}