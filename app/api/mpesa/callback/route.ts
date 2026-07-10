import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const OK = NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const callback = body?.Body?.stkCallback
    if (!callback) return OK

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback
    console.log('[65D CALLBACK]', { CheckoutRequestID, ResultCode, ResultDesc })

    const isSuccess   = ResultCode === 0
    const mpesaReceipt = CallbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value ?? null

    const supabase = createServiceClient()

    const { data: tx } = await supabase
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

    if (!tx?.order_id) return OK

    await supabase
      .from('orders')
      .update({
        payment_status: isSuccess ? 'completed' : 'failed',
        status:         isSuccess ? 'confirmed' : 'pending',
        mpesa_receipt:  mpesaReceipt,
        updated_at:     new Date().toISOString(),
      })
      .eq('id', tx.order_id)

    return OK
  } catch (err) {
    console.error('[65D callback error]', err)
    return OK
  }
}
