import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
const supabase = createServiceClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const grade = searchParams.get('grade')

  const supabase = await createServiceClient()
  let query = supabase.from('name_words').select('*').eq('status', 'available')
  if (grade) query = query.eq('grade', grade)

  const { data, error } = await query.order('word', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}