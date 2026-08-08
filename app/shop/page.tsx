import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { ShopClient } from './ShopClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buy Kenyan Coffee Online — Single Origin Specialty Coffee',
  description: 'Shop fresh roasted Kenyan specialty coffee. Single origin Kiambu County arabica. Classic from KES 750, Premium from KES 1,100. 250g to 1kg bags. Free delivery across Nairobi above KES 3,000.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/shop' },
  openGraph: {
    title: 'Buy Kenyan Coffee Online | 65 Degrees Coffee Roastery Nairobi',
    description: 'Single origin Kiambu arabica. Classic from KES 750, Premium from KES 1,100. Free Nairobi delivery.',
    url: 'https://www.sixtyfivedegrees.com/shop',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export const revalidate = 3600

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select(`id, name, slug, grade, roast, description, tasting_notes, is_available,
      retail_variants ( id, size_grams, grind, price, is_available )`)
    .order('grade', { ascending: false })
    .order('roast', { ascending: true })

  return (
    <>
      <Nav />
      <main>
        <ShopClient products={products ?? []} />
      </main>
      <Footer />
    </>
  )
}
