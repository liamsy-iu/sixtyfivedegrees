import { redirect } from 'next/navigation'
import { checkAdminAuth, getProducts } from '@/lib/actions/admin'
import { AdminDashboard } from './AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — 65 Degrees' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const isAuth = await checkAdminAuth()
  if (!isAuth) redirect('/admin/login')

  // Products don't change often — fetch server-side once
  const products = await getProducts()

  return <AdminDashboard products={products as any[]} />
}
