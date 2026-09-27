import { createClient } from '@/lib/supabase/server'

export type Lot = {
  id: string
  lot_code: string
  name: string
  grade: 'AA' | 'AB'
  region: string
  farm: string | null
  process: string | null
  altitude: string | null
  variety: string | null
  tasting_notes: string | null
  cupping_score: number | null
  harvest_date: string | null
  date_received: string
  story: string | null
  status: 'active' | 'sold_out' | 'archived'
  variants: Variant[]
}

export type Variant = {
  id: string
  lot_id: string
  roast: 'medium' | 'dark'
  grind: 'ground' | 'whole_bean'
  grind_size: 'coarse' | 'medium-coarse' | 'medium' | 'fine' | null
  size_grams: number
  price: number
  is_available: boolean
}

function mapLotRow(row: any): Lot {
  return {
    ...row,
    name: row.name_words?.word ?? 'Unnamed Lot',
    variants: (row.retail_variants ?? []) as Variant[],
  }
}

export async function getActiveLots(): Promise<Lot[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lots')
    .select('*, name_words(word), retail_variants(*)')
    .in('status', ['active', 'sold_out'])
    .order('date_received', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapLotRow)
}

export async function getLotByCode(lotCode: string): Promise<Lot | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lots')
    .select('*, name_words(word), retail_variants(*)')
    .eq('lot_code', lotCode)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return mapLotRow(data)
}