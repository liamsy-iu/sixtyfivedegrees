import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function generateLotCode(region: string, grade: string) {
  const slug = region.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${slug}-${grade.toLowerCase()}-${suffix}`
}

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('lots')
    .select('*, name_words(word)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
    (data ?? []).map((row: any) => ({ ...row, name: row.name_words?.word ?? 'Unnamed Lot' }))
  )
}

export async function POST(req: Request) {
  const supabase = createServiceClient()
  const body = await req.json()
  const {
    grade, name_word_id, region, farm, process, altitude, variety,
    tasting_notes, cupping_score, harvest_date, story, image_url,
  } = body

  if (!grade || !name_word_id || !region) {
    return NextResponse.json({ error: 'grade, name_word_id, and region are required' }, { status: 400 })
  }

  const { data: word, error: wordError } = await supabase
    .from('name_words').select('id, status, grade').eq('id', name_word_id).maybeSingle()

  if (wordError || !word) {
    return NextResponse.json({ error: 'Name word not found' }, { status: 400 })
  }
  if (word.status !== 'available') {
    return NextResponse.json({ error: 'That name is no longer available' }, { status: 409 })
  }
  if (word.grade !== grade) {
    return NextResponse.json({ error: 'Name word does not match the selected grade' }, { status: 400 })
  }

  const { data: lot, error: lotError } = await supabase
    .from('lots')
    .insert({
      grade, name_word_id, region,
      farm: farm || null, process: process || null, altitude: altitude || null,
      variety: variety || null, tasting_notes: tasting_notes || null,
      cupping_score: cupping_score || null, harvest_date: harvest_date || null,
      story: story || null, image_url: image_url || null,
      lot_code: generateLotCode(region, grade),
      status: 'active',
    })
    .select()
    .single()

  if (lotError) return NextResponse.json({ error: lotError.message }, { status: 500 })

  const { error: flipError } = await supabase
    .from('name_words').update({ status: 'in_use' }).eq('id', name_word_id)

  if (flipError) {
    await supabase.from('lots').delete().eq('id', lot.id)
    return NextResponse.json({ error: 'Failed to reserve name word, lot not created' }, { status: 500 })
  }

  return NextResponse.json(lot, { status: 201 })
}