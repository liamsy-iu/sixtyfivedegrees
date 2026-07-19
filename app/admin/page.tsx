import { redirect } from 'next/navigation'
import { checkAdminAuth, getOrders, getEnquiries, getProducts } from '@/lib/actions/admin'
import { getSubscriptions } from '@/lib/actions/subscriptions'
import { AdminDashboard } from './AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — 65 Degrees' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const isAuth = await checkAdminAuth()
  if (!isAuth) redirect('/admin/login')

  const [orders, enquiries, products, subscriptions] = await Promise.all([
    getOrders(),
    getEnquiries(),
    getProducts(),
    getSubscriptions(),
  ])

  return (
    <AdminDashboard
      orders={orders as any[]}
      enquiries={enquiries as any[]}
      products={products as any[]}
      subscriptions={subscriptions as any[]}
    />
  )
}
