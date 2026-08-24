'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { generateOrderRef } from '@/lib/utils/pricing'
import { notifyNewOrder } from '@/lib/notify'

export interface OrderItem {
  productName: string
  productType: 'coffee' | 'merch'
  grade: string | null; roast: string | null
  size: string; grind: string | null; colour: string | null
  quantity: number; unitPrice: number
}

export interface CreateOrderInput {
  type: 'retail'; customerName: string; customerEmail: string
  customerPhone: string; deliveryAddress: { line1: string; area: string; city: string }
  deliveryFee: number; items: OrderItem[]; paymentMethod: 'mpesa' | 'cod'
}

export async function createOrderAction(input: CreateOrderInput) {
  const supabase = createServiceClient()
  const subtotal = input.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const total    = subtotal + input.deliveryFee
  const orderRef = generateOrderRef()

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_ref: orderRef, type: input.type,
      customer_name: input.customerName, customer_email: input.customerEmail || null,
      customer_phone: input.customerPhone, delivery_address: input.deliveryAddress,
      delivery_fee: input.deliveryFee, subtotal, total,
      payment_method: input.paymentMethod, payment_status: 'pending',
      status: input.paymentMethod === 'cod' ? 'confirmed' : 'pending',
    })
    .select('id, order_ref, total')
    .single()

  if (error || !order) {
    console.error('Order creation failed', error)
    return { error: 'Failed to create order. Please try again.' }
  }

  await supabase.from('order_items').insert(
    input.items.map(i => ({
      order_id: order.id, product_name: i.productName, product_type: i.productType,
      grade: i.grade, roast: i.roast, size: i.size, grind: i.grind, colour: i.colour,
      quantity: i.quantity, unit_price: i.unitPrice, subtotal: i.unitPrice * i.quantity,
    }))
  )

  // Notify you by email for COD orders immediately
  // M-Pesa orders are notified after callback confirms payment
  if (input.paymentMethod === 'cod') {
    notifyNewOrder({
      orderRef:        order.order_ref,
      customerName:    input.customerName,
      customerPhone:   input.customerPhone,
      items:           input.items.map(i => ({
        product_name: i.productName, size: i.size, grind: i.grind, colour: i.colour,
        quantity: i.quantity, subtotal: i.unitPrice * i.quantity,
      })),
      deliveryAddress: input.deliveryAddress,
      total:           order.total,
      paymentMethod:   'cod',
    }).catch(err => console.error('[notify order]', err))
  }

  return { orderId: order.id, orderRef: order.order_ref, total: order.total }
}

export async function getOrdersByPhone(phone: string) {
  const supabase = createServiceClient()
  const normalized = phone.startsWith('254') ? phone : `254${phone.replace(/^0/, '')}`
  const { data } = await supabase
    .from('orders').select('id, order_ref, status, payment_status, total, created_at')
    .eq('customer_phone', normalized).order('created_at', { ascending: false }).limit(20)
  return data ?? []
}
