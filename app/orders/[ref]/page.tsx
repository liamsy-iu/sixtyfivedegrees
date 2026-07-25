import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { OrderStatusClient } from './OrderStatusClient'
import type { Metadata } from 'next'

interface Props { params: Promise<{ ref: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params
  return { title: `Order ${ref.toUpperCase()} — 65 Degrees Coffee` }
}

export default async function OrderStatusPage({ params }: Props) {
  const { ref } = await params
  return (
    <>
      <Nav />
      <main>
        <OrderStatusClient orderRef={ref.toUpperCase()} />
      </main>
      <Footer />
    </>
  )
}
