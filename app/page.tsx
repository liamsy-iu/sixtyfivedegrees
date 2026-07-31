import Link from 'next/link'
import Image from 'next/image'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatKES } from '@/lib/utils/pricing'
import { getProductImage } from '@/lib/utils/productImages'
import { ArrowRight } from 'lucide-react'
import styles from './page.module.css'

export const revalidate = 3600

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
    .from('retail_variants')
    .select('price')
    .eq('product_id', productId)
    .eq('size_grams', 250)
    .eq('grind', 'whole_bean')
    .eq('is_available', true)
    .single()
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

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles['hero-inner']}>
            <div className={styles['hero-left']}>
              <p className={styles['hero-eye']}>Single origin · Kiambu, Kenya</p>
              <h1 className={styles['hero-title']}>
                Kenya&apos;s finest<br /><em>beans.</em>
              </h1>
              <p className={styles['hero-sub']}>
                65° is the temperature at which milk reaches its natural sweetness.
                We roast the coffee worthy of it.
              </p>
              <div className={styles['hero-actions']}>
                <Link href="/shop" className={styles['btn-primary']}>Shop the beans</Link>
                <Link href="/trade" className={styles['btn-secondary']}>Wholesale enquiry</Link>
              </div>
            </div>
            <div className={styles['hero-right']}>
              <div className={styles['hero-stat']}>
                <p className={styles['hero-stat-num']}>1,700m</p>
                <p className={styles['hero-stat-label']}>Altitude — Aberdare foothills</p>
              </div>
              <div className={styles['hero-stat']}>
                <p className={styles['hero-stat-num']}>30km</p>
                <p className={styles['hero-stat-label']}>From farm to our Nairobi roastery</p>
              </div>
              <div className={styles['hero-stat']}>
                <p className={styles['hero-stat-num']}>65°C</p>
                <p className={styles['hero-stat-label']}>Optimal milk temperature</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why us ── */}
        <section className={styles.why}>
          <div className={styles.container}>
            <p className={styles['why-eye']}>Why 65 Degrees</p>
            <div className={styles['why-grid']}>
              <div className={styles['why-item']}>
                <span className={styles['why-num']}>01</span>
                <h3 className={styles['why-title']}>Single origin Kenya</h3>
                <p className={styles['why-desc']}>Sourced from Kiambu County — one of Kenya's finest growing regions, 30 minutes from our roastery.</p>
              </div>
              <div className={styles['why-item']}>
                <span className={styles['why-num']}>02</span>
                <h3 className={styles['why-title']}>Roasted in Nairobi</h3>
                <p className={styles['why-desc']}>Small batch roasting. Your coffee ships within days of roasting, not weeks or months.</p>
              </div>
              <div className={styles['why-item']}>
                <span className={styles['why-num']}>03</span>
                <h3 className={styles['why-title']}>To your door</h3>
                <p className={styles['why-desc']}>Free delivery across Nairobi on orders above KES 3,000. Same day available in most areas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Products ── */}
        <section className={styles.products}>
          <div className={styles.container}>
            <div className={styles['sec-header']}>
              <p className={styles['sec-eye']}>The beans · 250g to 1kg</p>
              <p className={styles['sec-title']}>Kenyan single origin</p>
            </div>
            <div className={styles['product-grid']}>
              {productsWithPrices.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className={styles['all-link']}>
              <Link href="/shop" className={styles['btn-primary']}>View all products</Link>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className={styles.testimonials}>
          <div className={styles.container}>
            <div className={styles['sec-header']}>
              <p className={styles['sec-eye']}>What people say</p>
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

        {/* ── Story ── */}
        <section className={styles.story}>
          <div className={styles.container}>
            <div className={styles['story-inner']}>
              <p className={styles['story-quote']}>
                At <em>65°</em>, steamed milk reaches its natural sweetness —
                no burnt edges, no flat foam. We source and roast the coffee
                that deserves to meet it at exactly that temperature.
              </p>
              <p className={styles['story-attr']}>65 Degrees Coffee Roastery · Nairobi, Kenya</p>
            </div>
          </div>
        </section>

        {/* ── Trade ── */}
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
                <div className={styles['tier-card']}>
                  <p className={styles['tier-grade']}>Classic grade</p>
                  <div className={styles['tier-row']}><span>5 – 30 kg</span><span>KES 1,500/kg</span></div>
                  <div className={styles['tier-row']}><span>31 – 100 kg</span><span>KES 1,400/kg</span></div>
                  <div className={styles['tier-row']}><span>100 kg+</span><span className={styles['tier-custom']}>Custom</span></div>
                </div>
                <div className={styles['tier-card']}>
                  <p className={styles['tier-grade']}>Premium grade</p>
                  <div className={styles['tier-row']}><span>5 – 30 kg</span><span>KES 2,000/kg</span></div>
                  <div className={styles['tier-row']}><span>31 – 100 kg</span><span>KES 1,900/kg</span></div>
                  <div className={styles['tier-row']}><span>100 kg+</span><span className={styles['tier-custom']}>Custom</span></div>
                </div>
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
  const isPremium = product.grade === 'premium'
  const notes     = product.tasting_notes as string[]
  const image     = getProductImage(product.slug)
  const isOOS     = !product.is_available
  const roastLabel = product.roast === 'medium' ? 'Medium roast' : 'Dark roast'

  if (!isPremium) {
    return (
      <Link href={`/shop/${product.slug}`} className={`${styles['product-card']} ${styles['classic-card']} ${isOOS ? styles['product-card-oos'] : ''}`}>
        <div className={styles['classic-body']}>
          <p className={styles['classic-grade']}>Classic · {roastLabel}</p>
          <h2 className={styles['classic-name']}>{product.name}</h2>
          <div className={styles['classic-notes']}>
            {notes.map((n: string, i: number) => (
              <span key={i} className={styles['classic-note']}>{n}</span>
            ))}
          </div>
          <div className={styles['classic-footer']}>
            {isOOS ? (
              <span className={styles['oos-label']}>Currently unavailable</span>
            ) : (
              <div className={styles['classic-price-block']}>
                <span className={styles['classic-price']}>{product.startingPrice ? formatKES(product.startingPrice) : '—'}</span>
                <span className={styles['classic-per']}>/250g</span>
              </div>
            )}
            <ArrowRight size={14} strokeWidth={1.5} className={styles['product-arrow']} />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/shop/${product.slug}`} className={`${styles['product-card']} ${styles['premium-card']} ${isOOS ? styles['product-card-oos'] : ''}`}>
      <div className={styles['product-visual']}>
        {image && <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 100vw, 25vw" className={styles['product-img']} />}
        {isOOS && <div className={styles['oos-banner']}>Out of stock</div>}
      </div>
      <div className={styles['product-info']}>
        <p className={styles['product-grade']}>Premium · {roastLabel}</p>
        <h2 className={styles['product-name']}>{product.name}</h2>
        {isOOS ? (
          <span className={styles['oos-label']}>Currently unavailable</span>
        ) : (
          <div className={styles['product-price-row']}>
            <span className={styles['product-price']}>{product.startingPrice ? formatKES(product.startingPrice) : '—'}</span>
            <span className={styles['product-per']}>/250g</span>
          </div>
        )}
        <div className={styles['product-notes']}>
          {notes.map((n: string, i: number) => (
            <span key={i} className={styles['product-note']}>{n}</span>
          ))}
        </div>
        <div className={styles['product-footer']}>
          <span className={styles['product-cta']}>{isOOS ? 'View product' : 'Shop now'}</span>
          <ArrowRight size={14} strokeWidth={1.5} className={styles['product-arrow']} />
        </div>
      </div>
    </Link>
  )
}
