import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { CheckoutClient } from './CheckoutClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <>
      <Nav />
      <main>
        <CheckoutClient />
      </main>
      <Footer />
    </>
  )
}
