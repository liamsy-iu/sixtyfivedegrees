import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { ProductDetailClient } from './ProductDetailClient'
import { formatKES } from '@/lib/utils/pricing'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

const BASE_URL = 'https://www.sixtyfivedegrees.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, grade, roast, description, tasting_notes, retail_variants ( price, size_grams )')
    .eq('slug', slug)
    .single()

  if (!product) return { title: 'Product not found' }

  const lowestPrice = (product.retail_variants as any[])
    ?.filter((v: any) => v.size_grams === 250)
    .map((v: any) => v.price)
    .sort((a: number, b: number) => a - b)[0]

  const gradeLabel = product.grade === 'premium' ? 'Premium grade' : 'Classic grade'
  const roastLabel = product.roast === 'medium' ? 'medium roast' : 'dark roast'
  const notes = (product.tasting_notes as string[])?.join(', ')

  const title = product.name
  const description = `${gradeLabel} Kenyan single origin coffee, ${roastLabel}. Tasting notes: ${notes}. ${product.description} From ${lowestPrice ? formatKES(lowestPrice) : 'KES 750'} per 250g. Free delivery in Nairobi above KES 3,000.`

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} | 65 Degrees Coffee Roastery`,
      description,
      url: `${BASE_URL}/shop/${slug}`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    alternates: { canonical: `${BASE_URL}/shop/${slug}` },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      id, name, slug, grade, roast, description, tasting_notes, is_available,
      retail_variants ( id, size_grams, grind, price, is_available )
    `)
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  // Build JSON-LD structured data for Google rich results
  const variants = product.retail_variants as any[]
  const lowestPrice = variants
    ?.map((v: any) => v.price / 100)
    .sort((a: number, b: number) => a - b)[0]
  const highestPrice = variants
    ?.map((v: any) => v.price / 100)
    .sort((a: number, b: number) => b - a)[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: '65 Degrees Coffee Roastery' },
    category: 'Coffee',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'KES',
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: variants?.length ?? 0,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: '65 Degrees Coffee Roastery' },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <ProductDetailClient product={product as any} />
      </main>
      <Footer />
    </>
  )
}
