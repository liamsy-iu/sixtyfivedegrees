import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { notifyNewOrder, notifyMerchOrder } from '@/lib/notify'

const OK = NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[65D callback] received:', JSON.stringify(body))

    const callback = body?.Body?.stkCallback
    if (!callback) return OK

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback
    console.log('[65D callback]', { CheckoutRequestID, ResultCode, ResultDesc })

    const isSuccess    = ResultCode === 0
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
      .select('order_id, phone, order_type')
      .single()

    console.log('[65D callback] tx update:', { tx, txError })
    if (!tx?.order_id) return OK

    // ── Merch order branch ──────────────────────────────────────────
    if (tx.order_type === 'merch') {
      await supabase
        .from('merch_orders')
        .update({
          payment_status: isSuccess ? 'completed' : 'failed',
          mpesa_receipt:  mpesaReceipt,
        })
        .eq('id', tx.order_id)

      if (isSuccess) {
        const { data: order } = await supabase
          .from('merch_orders')
          .select('order_ref, name, email, phone, items, address, message, total_kes')
          .eq('id', tx.order_id)
          .single()

        if (order) {
          notifyMerchOrder({
            name: order.name, email: order.email, phone: order.phone,
            items: order.items, address: order.address, message: order.message, total_kes: order.total_kes,
            orderRef: order.order_ref, mpesaReceipt: mpesaReceipt ?? undefined,
          }).catch(err => console.error('[notify merch order]', err))
        }
      }

      return OK
    }

    // ── Coffee order branch (unchanged from before) ────────────────
    await supabase
      .from('orders')
      .update({
        payment_status: isSuccess ? 'completed' : 'failed',
        status:         isSuccess ? 'confirmed' : 'pending',
        mpesa_receipt:  mpesaReceipt,
        updated_at:     new Date().toISOString(),
      })
      .eq('id', tx.order_id)

    // Notify you by email after successful M-Pesa payment
    if (isSuccess) {
      const { data: order } = await supabase
        .from('orders')
        .select(`
          order_ref, customer_name, customer_phone,
          delivery_address, total,
          order_items ( product_name, size, grind, quantity, subtotal )
        `)
        .eq('id', tx.order_id)
        .single()

      if (order) {
        notifyNewOrder({
          orderRef:        order.order_ref,
          customerName:    order.customer_name,
          customerPhone:   order.customer_phone,
          items:           order.order_items as any[],
          deliveryAddress: order.delivery_address as any,
          total:           order.total,
          paymentMethod:   'mpesa',
          mpesaReceipt:    mpesaReceipt ?? undefined,
        }).catch(err => console.error('[notify order]', err))
      }
    }

    return OK
  } catch (err: any) {
    console.error('[65D callback error]', err?.message ?? err)
    return OK
  }
}
