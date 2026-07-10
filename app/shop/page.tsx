import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { ShopClient } from './ShopClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Shop' }
export const revalidate = 3600

export default async function ShopPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, slug, grade, roast, description, tasting_notes,
      retail_variants ( id, size_grams, grind, price, is_available )
    `)
    .eq('is_available', true)
    .order('grade', { ascending: true })
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
