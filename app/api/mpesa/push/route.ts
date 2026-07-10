import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { initiateSTKPush } from '@/lib/mpesa'

export async function POST(req: NextRequest) {
  try {
    const { orderId, phone, amount, orderRef } = await req.json()
    if (!orderId || !phone || !amount || !orderRef) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const callbackUrl = process.env.MPESA_CALLBACK_URL
      ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`

    console.log('[65D push] callback URL:', callbackUrl)
    const normalized = phone.startsWith('254') ? phone : `254${phone.replace(/^0/, '')}`

    const result = await initiateSTKPush({
      phone: normalized,
      amountCents: amount,
      orderRef,
      callbackUrl,
    })

    const supabase = createServiceClient()
    await supabase.from('mpesa_transactions').insert({
      order_id:            orderId,
      checkout_request_id: result.CheckoutRequestID,
      merchant_request_id: result.MerchantRequestID,
      phone:               normalized,
      amount,
      status: 'pending',
    })

    return NextResponse.json({ checkoutRequestId: result.CheckoutRequestID })
  } catch (err) {
    console.error('[65D push]', err)
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}
