import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const OK = NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[65D callback] received:', JSON.stringify(body))

    const callback = body?.Body?.stkCallback
    if (!callback) return OK

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback
    console.log('[65D callback]', { CheckoutRequestID, ResultCode, ResultDesc })

    const isSuccess   = ResultCode === 0
    const mpesaReceipt = CallbackMetadata?.Item?.find(
      (i: any) => i.Name === 'MpesaReceiptNumber'
    )?.Value ?? null

    const supabase = createServiceClient()

    const { data: tx, error: txError } = await supabase
      .from('mpesa_transactions')
      .update({
        status:             isSuccess ? 'completed' : 'failed',
        result_code:        ResultCode,
        result_description: ResultDesc,
        mpesa_receipt:      mpesaReceipt,
        completed_at:       new Date().toISOString(),
      })
      .eq('checkout_request_id', CheckoutRequestID)
      .select('order_id, phone')
      .single()

    console.log('[65D callback] tx update:', { tx, txError })

    if (!tx?.order_id) return OK

    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: isSuccess ? 'completed' : 'failed',
        status:         isSuccess ? 'confirmed' : 'pending',
        mpesa_receipt:  mpesaReceipt,
        updated_at:     new Date().toISOString(),
      })
      .eq('id', tx.order_id)

    console.log('[65D callback] order update error:', orderError)

    return OK
  } catch (err: any) {
    console.error('[65D callback error]', err?.message ?? err)
    return OK
  }
}
