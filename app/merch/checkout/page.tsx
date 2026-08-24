import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { MerchCheckoutClient } from './MerchCheckoutClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Checkout — 65 Degrees Merch' }

export default function MerchCheckoutPage() {
  return (
    <>
      <Nav />
      <main>
        <MerchCheckoutClient />
      </main>
      <Footer />
    </>
  )
}
