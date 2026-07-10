import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { ProductDetailClient } from './ProductDetailClient'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name').eq('slug', slug).single()
  return { title: data?.name ?? 'Product' }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      id, name, slug, grade, roast, description, tasting_notes,
      retail_variants ( id, size_grams, grind, price, is_available )
    `)
    .eq('slug', slug)
    .eq('is_available', true)
    .single()

  if (!product) notFound()

  return (
    <>
      <Nav />
      <main>
        <ProductDetailClient product={product as any} />
      </main>
      <Footer />
    </>
  )
}
