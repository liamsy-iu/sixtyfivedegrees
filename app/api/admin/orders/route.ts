import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'

function getExpectedToken() {
  return Buffer.from(`65d-admin:${process.env.ADMIN_PASSWORD}`).toString('base64')
}

async function checkAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin-session-v1')?.value === getExpectedToken()
}

export async function GET(_req: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_ref, type, status, payment_status, payment_method,
      customer_name, customer_phone, customer_email,
      delivery_address, delivery_fee, subtotal, total,
      mpesa_receipt, created_at,
      order_items ( product_name, grade, roast, size, grind, quantity, unit_price, subtotal )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
