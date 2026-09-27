import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
const supabase = createServiceClient()

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const patch: Record<string, any> = {}
  if ('price' in body) patch.price = body.price
  if ('is_available' in body) patch.is_available = body.is_available

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('retail_variants').update(patch).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}