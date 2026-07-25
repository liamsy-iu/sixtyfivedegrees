import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_ref, status, payment_status, payment_method,
      customer_name, delivery_address, delivery_fee, subtotal, total,
      mpesa_receipt, created_at, updated_at,
      order_items ( product_name, grade, roast, size, grind, quantity, unit_price, subtotal )
    `)
    .eq('order_ref', ref.toUpperCase())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
