import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['active', 'sold_out', 'archived']

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status } = await req.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lots').update({ status }).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}