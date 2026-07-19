'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'

const ADMIN_TOKEN = 'admin-session-v1'

function getExpectedToken() {
  return Buffer.from(`65d-admin:${process.env.ADMIN_PASSWORD}`).toString('base64')
}

export async function loginAction(_prev: { error: string | undefined }, formData: FormData) {
  const password = formData.get('password') as string
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Wrong password.' }
  }
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_TOKEN, getExpectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  redirect('/admin')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_TOKEN)
  redirect('/admin/login')
}

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_TOKEN)?.value
  return token === getExpectedToken()
}

export async function getOrders() {
  const supabase = createServiceClient()
  const { data } = await supabase
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
  return data ?? []
}

export async function getEnquiries() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('trade_enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return data ?? []
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
  return { error: error?.message }
}

export async function updateEnquiryStatus(enquiryId: string, status: string) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('trade_enquiries')
    .update({ status })
    .eq('id', enquiryId)
  return { error: error?.message }
}

export async function saveTradeEnquiry(data: {
  name: string; business: string; email: string; phone: string
  grade: string; volume: string; message: string
}) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('trade_enquiries').insert(data)
  return { error: error?.message }
}

export async function getProducts() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, grade, roast, is_available')
    .order('grade').order('roast')
  return data ?? []
}

export async function toggleProductAvailability(productId: string, isAvailable: boolean) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('products')
    .update({ is_available: isAvailable })
    .eq('id', productId)
  return { error: error?.message }
}
