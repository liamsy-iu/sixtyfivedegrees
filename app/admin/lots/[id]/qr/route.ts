import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateLotQrPng } from '@/lib/qr'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lot, error } = await supabase
    .from('lots')
    .select('lot_code')
    .eq('id', id)
    .maybeSingle()

  if (error || !lot) {
    return NextResponse.json({ error: 'Lot not found' }, { status: 404 })
  }

  const png = await generateLotQrPng(lot.lot_code)
  return new NextResponse(png, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="lot-${lot.lot_code}-qr.png"`,
    },
  })
}