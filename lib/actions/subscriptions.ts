'use server'

import { createServiceClient } from '@/lib/supabase/server'

export interface CreateSubscriptionInput {
  customerName: string
  customerPhone: string
  customerEmail: string
  grade: 'classic' | 'premium'
  roast: 'medium' | 'dark'
  sizeGrams: number
  grind: 'whole_bean' | 'ground'
  quantity: number
  frequency: 'weekly' | 'biweekly' | 'monthly'
  deliveryAddress: { line1: string; area: string; city: string }
}

function nextOrderDate(frequency: string): string {
  const date = new Date()
  if (frequency === 'weekly')   date.setDate(date.getDate() + 7)
  if (frequency === 'biweekly') date.setDate(date.getDate() + 14)
  if (frequency === 'monthly')  date.setMonth(date.getMonth() + 1)
  return date.toISOString().split('T')[0]
}

export async function createSubscriptionAction(input: CreateSubscriptionInput) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      customer_name:    input.customerName,
      customer_phone:   input.customerPhone,
      customer_email:   input.customerEmail || null,
      grade:            input.grade,
      roast:            input.roast,
      size_grams:       input.sizeGrams,
      grind:            input.grind,
      quantity:         input.quantity,
      frequency:        input.frequency,
      delivery_address: input.deliveryAddress,
      next_order_date:  nextOrderDate(input.frequency),
      status:           'active',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Subscription creation failed', error)
    return { error: 'Failed to set up subscription. Please try again.' }
  }

  return { id: data.id }
}

export async function getSubscriptions() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function updateSubscriptionStatus(id: string, status: string) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('subscriptions')
    .update({ status })
    .eq('id', id)
  return { error: error?.message }
}
