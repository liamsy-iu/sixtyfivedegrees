import { LotsAdminClient } from './LotsAdminClient'

export const metadata = { title: 'Admin · Lots' }

export default function AdminLotsPage() {
  return (
    <main className="admin-lots-page">
      <h1>Coffee Lots</h1>
      <LotsAdminClient />
    </main>
  )
}