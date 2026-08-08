import Link from 'next/link'
import Image from 'next/image'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { JourneyTimeline } from '@/components/home/JourneyTimeline/JourneyTimeline'
import { createClient } from '@/lib/supabase/server'
import { formatKES } from '@/lib/utils/pricing'
import { getProductImage } from '@/lib/utils/productImages'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '65 Degrees Coffee Roastery — Specialty Coffee Nairobi, Kenya',
  description: 'Buy fresh roasted single origin Kenyan coffee online. Classic and Premium arabica from Kiambu County. Whole bean or ground. Free delivery across Nairobi above KES 3,000. Wholesale from 5kg for cafés.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com' },
  openGraph: {
    title: '65 Degrees Coffee Roastery — Specialty Coffee Nairobi, Kenya',
    description: 'Fresh roasted single origin Kenyan coffee delivered to your door in Nairobi. Classic from KES 750, Premium from KES 1,100.',
    url: 'https://www.sixtyfivedegrees.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export const revalidate = 3600

const CARD_COLORS: Record<string, string> = {
  'kenya-premium-dark':   '#5C2D0E',
  'kenya-premium-medium': '#1E4035',
  'kenya-classic-dark':   '#1A2744',
  'kenya-classic-medium': '#7A3120',
}

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, grade, roast, description, tasting_notes, is_available')
    .order('grade', { ascending: false })
    .order('roast', { ascending: true })
  return data ?? []
}

async function getLowestRetailPrice(productId: string): Promise<number | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('retail_variants').select('price')
    .eq('product_id', productId).eq('size_grams', 250)
    .eq('grind', 'whole_bean').eq('is_available', true).single()
  return data?.price ?? null
}

const TESTIMONIALS = [
  { quote: "The freshest coffee I've had in Nairobi. You can taste the difference.", name: "Sarah M.", location: "Westlands" },
  { quote: "Switched our café to the Classic grade. Our customers noticed immediately.", name: "James K.", location: "Karen" },
  { quote: "Fast delivery, great beans. Finally a roastery that picks up the phone.", name: "Amina H.", location: "Kilimani" },
]

export default async function HomePage() {
  const products = await getProducts()
  const productsWithPrices = await Promise.all(
    products.map(async (p) => ({ ...p, startingPrice: await getLowestRetailPrice(p.id) }))
  )

  return (
    <>
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className={styles['hero-inner']}>
            <div className={styles['hero-left']}>
              <p className={styles['hero-eye']}>Single origin</p>
              <h1 className={styles['hero-title']}>Kenya&apos;s finest<br /><em>coffee.</em></h1>
              <p className={styles['hero-sub']}>65° is the temperature at which milk reaches its natural sweetness. We roast the coffee worthy of it.</p>
              <div className={styles['hero-actions']}>
                <Link href="/shop" className={styles['btn-primary']}>Shop the beans</Link>
                <Link href="/trade" className={styles['btn-secondary']}>Wholesale enquiry</Link>
              </div>
            </div>
            <div className={styles['hero-right']}>
              <div className={styles['hero-molecule']}>
                <svg viewBox="-20 -25 300 260" className={styles['molecule-svg']} role="img" aria-label="Skeletal chemical structure of caffeine">
                  <g fill="none" stroke="currentColor" strokeWidth="1.6" className={styles['molecule-lines']}>
                    <polygon points="70,75 70,40 100,25 130,40 130,75 100,90" strokeDasharray={204.16} strokeDashoffset={204.16} />
                    <polygon points="130,40 160,32 178,57 160,82 130,75" strokeDasharray={158.47} strokeDashoffset={158.47} />
                    <line x1="127" y1="42" x2="127" y2="73" strokeDasharray={31} strokeDashoffset={31} />
                    <line x1="163" y1="36" x2="174" y2="55" strokeDasharray={21.95} strokeDashoffset={21.95} />
                    <line x1="68" y1="38" x2="46" y2="23" strokeDasharray={26.63} strokeDashoffset={26.63} />
                    <line x1="73" y1="42" x2="51" y2="27" strokeDasharray={26.63} strokeDashoffset={26.63} />
                    <line x1="98" y1="92" x2="98" y2="113" strokeDasharray={21} strokeDashoffset={21} />
                    <line x1="103" y1="92" x2="103" y2="113" strokeDasharray={21} strokeDashoffset={21} />
                    <line x1="68" y1="77" x2="46" y2="90" strokeDasharray={25.55} strokeDashoffset={25.55} />
                    <line x1="100" y1="25" x2="100" y2="3" strokeDasharray={22} strokeDashoffset={22} />
                    <line x1="162" y1="84" x2="184" y2="98" strokeDasharray={26.08} strokeDashoffset={26.08} />
                  </g>
                  <g className={styles['molecule-text']} fontFamily="var(--font-mono)" fontSize="11">
                    <text x="52" y="70" textAnchor="middle">N1</text>
                    <text x="78" y="16" textAnchor="middle">N3</text>
                    <text x="172" y="14" textAnchor="middle">N9</text>
                    <text x="146" y="86" textAnchor="middle">N7</text>
                    <text x="38" y="18" textAnchor="middle">O</text>
                    <text x="100" y="124" textAnchor="middle">O</text>
                    <text x="34" y="98" textAnchor="middle">CH3</text>
                    <text x="100" y="-8" textAnchor="middle">CH3</text>
                    <text x="198" y="104" textAnchor="middle">CH3</text>
                  </g>
                </svg>
                <p className={styles['molecule-label']}>Caffeine</p>
                <p className={styles['molecule-formula']}>1,3,7-Trimethylxanthine · C8H10N4O2</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.why}>
          <div className={styles.container}>
            <p className={styles['why-eye']}>Why 65 Degrees</p>
            <div className={styles['why-grid']}>
              <div className={styles['why-item']}><span className={styles['why-num']}>01</span><h3 className={styles['why-title']}>Single origin Kenya</h3><p className={styles['why-desc']}>Sourced from Kiambu County — one of Kenya's finest growing regions, 30 minutes from our roastery.</p></div>
              <div className={styles['why-item']}><span className={styles['why-num']}>02</span><h3 className={styles['why-title']}>Roasted in Nairobi</h3><p className={styles['why-desc']}>Small batch roasting. Your coffee ships within days of roasting, not weeks or months.</p></div>
              <div className={styles['why-item']}><span className={styles['why-num']}>03</span><h3 className={styles['why-title']}>To your door</h3><p className={styles['why-desc']}>Free delivery across Nairobi on orders above KES 3,000. Same day available in most areas.</p></div>
            </div>
          </div>
        </section>

        <section className={styles.journey}>
          <div className={styles.container}>
            <div className={styles['sec-header']}>
              <p className={styles['sec-eye']}>The journey</p>
              <p className={styles['sec-title']}>Bean to cup</p>
            </div>
            <JourneyTimeline />
          </div>
        </section>

        <section className={styles.products}>
          <div className={styles.container}>
            <div className={styles['sec-header']}>
              <p className={styles['sec-eye']}>The beans · 250g to 1kg</p>
              <p className={styles['sec-title']}>Kenyan single origin</p>
            </div>
            <div className={styles['product-grid']}>
              {productsWithPrices.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            <div className={styles['all-link']}>
              <Link href="/shop" className={styles['btn-primary']}>View all products</Link>
            </div>
          </div>
        </section>

        <section className={styles.testimonials}>
          <div className={styles.container}>
            <div className={styles['sec-header']}>
              <p className={styles['sec-eye']}>What people say</p>
              <p className={styles['sec-title']}>From our customers</p>
            </div>
            <div className={styles['testimonial-grid']}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={styles.testimonial}>
                  <p className={styles['testimonial-quote']}>&ldquo;{t.quote}&rdquo;</p>
                  <p className={styles['testimonial-attr']}>— {t.name}, {t.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.story}>
          <div className={styles.container}>
            <div className={styles['story-inner']}>
              <p className={styles['story-quote']}>At <em>65°</em>, steamed milk reaches its natural sweetness — no burnt edges, no flat foam. We source and roast the coffee that deserves to meet it at exactly that temperature.</p>
              <p className={styles['story-attr']}>65 Degrees Coffee Roastery · Nairobi, Kenya</p>
            </div>
          </div>
        </section>

        <section className={styles.trade}>
          <div className={styles.container}>
            <div className={styles['trade-inner']}>
              <div>
                <p className={styles['sec-eye']}>For cafés &amp; businesses</p>
                <h2 className={styles['trade-title']}>Supply your café with Kenyan specialty</h2>
                <p className={styles['trade-sub']}>Wholesale from 5kg. Consistent quality, reliable delivery, direct pricing.</p>
                <Link href="/trade" className={styles['btn-primary']}>View trade pricing</Link>
              </div>
              <div className={styles['trade-tiers']}>
                <div className={styles['tier-card']}><p className={styles['tier-grade']}>Classic grade</p><div className={styles['tier-row']}><span>5 – 30 kg</span><span>KES 1,500/kg</span></div><div className={styles['tier-row']}><span>31 – 100 kg</span><span>KES 1,400/kg</span></div><div className={styles['tier-row']}><span>100 kg+</span><span className={styles['tier-custom']}>Custom</span></div></div>
                <div className={styles['tier-card']}><p className={styles['tier-grade']}>Premium grade</p><div className={styles['tier-row']}><span>5 – 30 kg</span><span>KES 2,000/kg</span></div><div className={styles['tier-row']}><span>31 – 100 kg</span><span>KES 1,900/kg</span></div><div className={styles['tier-row']}><span>100 kg+</span><span className={styles['tier-custom']}>Custom</span></div></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ProductCard({ product }: { product: any }) {
  const notes      = product.tasting_notes as string[]
  const image      = getProductImage(product.slug)
  const isOOS      = !product.is_available
  const isPremium  = product.grade === 'premium'
  const roastLabel = product.roast === 'medium' ? 'Medium roast' : 'Dark roast'
  const cardColor  = CARD_COLORS[product.slug] ?? '#2D3A2E'

  return (
    <Link href={`/shop/${product.slug}`}
      className={`${styles['product-card']} ${isOOS ? styles['product-card-oos'] : ''}`}
      style={{ '--card-bg': cardColor } as React.CSSProperties}>
      <div className={styles['product-visual']}>
        {image ? (
          <Image src={image} alt={product.name} fill
            sizes="(max-width: 640px) 100vw, 25vw"
            className={styles['product-img']} />
        ) : (
          <div className={styles['product-typo']}>
            <span className={styles['typo-origin']}>Kenya</span>
            <span className={styles['typo-grade']}>{isPremium ? 'Premium' : 'Classic'}</span>
          </div>
        )}
        {isOOS && <div className={styles['oos-band']}>Out of stock</div>}
      </div>
      <div className={styles['product-info']}>
        <div className={styles['product-meta']}>
          <span className={styles['product-tag']}>{isPremium ? 'Premium' : 'Classic'}</span>
          <span className={styles['product-dot']}>·</span>
          <span className={styles['product-tag']}>{roastLabel}</span>
        </div>
        <h2 className={styles['product-name']}>{product.name}</h2>
        <p className={styles['product-notes']}>{notes.join(' · ')}</p>
        <p className={styles['product-origin']}>Kiambu, Kenya · Washed</p>
      </div>
      <div className={styles['product-footer']}>
        <span className={styles['product-price']}>
          {isOOS ? 'Unavailable' : product.startingPrice ? `${formatKES(product.startingPrice)} /250g` : '—'}
        </span>
        <span className={styles['product-btn']}>
          {isOOS ? 'View' : 'Shop now'} <ArrowRight size={12} strokeWidth={2} />
        </span>
      </div>
    </Link>
  )
}
