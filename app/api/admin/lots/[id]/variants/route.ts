import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SIZES = [250, 500, 1000]
const ROASTS = ['medium', 'dark'] as const
const GRIND_SIZES = ['coarse', 'medium-coarse', 'medium', 'fine'] as const

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('retail_variants').select('*').eq('lot_id', id)
    .order('roast').order('grind').order('grind_size').order('size_grams')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// Creates every roast × format × grind_size × pack_size combination,
// price 0 / is_available false — admin turns on and prices only what's actually stocked.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: lotId } = await params
  const supabase = await createClient()

  const { count } = await supabase
    .from('retail_variants').select('id', { count: 'exact', head: true }).eq('lot_id', lotId)
  if (count && count > 0) {
    return NextResponse.json({ error: 'Variants already exist for this lot' }, { status: 409 })
  }

  const rows: any[] = []
  for (const roast of ROASTS) {
    for (const size_grams of SIZES) {
      rows.push({ lot_id: lotId, roast, grind: 'whole_bean', grind_size: null, size_grams, price: 0, is_available: false })
      for (const grind_size of GRIND_SIZES) {
        rows.push({ lot_id: lotId, roast, grind: 'ground', grind_size, size_grams, price: 0, is_available: false })
      }
    }
  }

  const { data, error } = await supabase.from('retail_variants').insert(rows).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}