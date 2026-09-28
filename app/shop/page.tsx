import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { ShopClient } from './ShopClient'
import { getActiveLots } from '@/lib/lots'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buy Kenyan Coffee Online — Single Origin Specialty Coffee',
  description: 'Shop fresh roasted Kenyan specialty coffee. Small-lot, traceable single origin arabica, AA and AB grades, sourced across Kenya. 250g to 1kg bags. Free delivery across Nairobi above KES 3,000.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/shop' },
  openGraph: {
    title: 'Buy Kenyan Coffee Online | 65 Degrees Coffee Roastery Nairobi',
    description: 'Small-lot, traceable single origin Kenyan arabica. Free Nairobi delivery above KES 3,000.',
    url: 'https://www.sixtyfivedegrees.com/shop',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

// Short revalidate so availability and new lots show up within a minute.
export const revalidate = 60

export default async function ShopPage() {
  const lots = await getActiveLots()

  return (
    <>
      <Nav />
      <main>
        <ShopClient lots={lots} />
      </main>
      <Footer />
    </>
  )
}