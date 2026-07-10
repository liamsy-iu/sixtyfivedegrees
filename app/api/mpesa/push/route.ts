import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { initiateSTKPush } from '@/lib/mpesa'

export async function POST(req: NextRequest) {
  try {
    const { orderId, phone, amount, orderRef } = await req.json()

    if (!orderId || !phone || !amount || !orderRef) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Callback URL — explicit env var, fallback to hardcoded production URL
    const callbackUrl =
      process.env.MPESA_CALLBACK_URL ??
      'https://sixtyfivedegrees.com/api/mpesa/callback'

    const normalized = phone.startsWith('254')
      ? phone
      : `254${phone.replace(/^0/, '')}`

    console.log('[65D push] orderId:', orderId)
    console.log('[65D push] phone:', normalized)
    console.log('[65D push] amount:', amount)
    console.log('[65D push] callbackUrl:', callbackUrl)

    const result = await initiateSTKPush({
      phone: normalized,
      amountCents: amount,
      orderRef,
      callbackUrl,
    })

    console.log('[65D push] Daraja response:', JSON.stringify(result))

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
  } catch (err: any) {
    console.error('[65D push error]', err?.message ?? err)
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}
