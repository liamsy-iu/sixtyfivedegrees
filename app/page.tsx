import Link from 'next/link'
import Image from 'next/image'
import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatKES } from '@/lib/utils/pricing'
import { ArrowRight } from 'lucide-react'
import styles from './page.module.css'

export const revalidate = 3600

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, grade, roast, description, tasting_notes')
    .eq('is_available', true)
    .order('grade', { ascending: true })
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

export default async function HomePage() {
  const products = await getProducts()

  const productsWithPrices = await Promise.all(
    products.map(async (p) => ({
      ...p,
      startingPrice: await getLowestRetailPrice(p.id),
    }))
  )

  const medium = productsWithPrices.filter((p) => p.roast === 'medium')
  const dark   = productsWithPrices.filter((p) => p.roast === 'dark')

  return (
    <>
      <Nav />
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles['hero-inner']}>
            <p className={styles['hero-eye']}>Single origin · Kenyan specialty</p>
            <h1 className={styles['hero-title']}>
              Kenya's finest<br />
              <em>beans.</em>
            </h1>
            <p className={styles['hero-sub']}>
              65° is the temperature at which milk reaches its natural sweetness.
              We roast the coffee worthy of it.
            </p>
            <div className={styles['hero-actions']}>
              <Link href="/shop" className={styles['btn-primary']}>
                Shop retail
              </Link>
              <Link href="/trade" className={styles['btn-secondary']}>
                Trade enquiry
              </Link>
            </div>
          </div>
          <div className={styles['hero-deco']} aria-hidden="true">
            <Image src="/logo-white.png" alt="" width={400} height={400} />
          </div>
        </section>

        {/* ── Products preview ──────────────────────────────── */}
        <section className={styles.products}>
          <div className={styles.container}>
            <div className={styles['sec-header']}>
              <p className={styles['sec-eye']}>The beans</p>
              <h2 className={styles['sec-title']}>Kenyan single origin</h2>
              <div className={styles.rule} />
            </div>

            {/* Medium roast */}
            <div className={styles['roast-group']}>
              <div className={styles['roast-label']}>
                <span>Medium roast</span>
                <div className={styles['roast-line']} />
              </div>
              <div className={styles['product-grid']}>
                {medium.map((product) => (
                  <Link href={`/shop/${product.slug}`} key={product.id} className={styles['product-card']}>
                    <div className={`${styles['product-visual']} ${styles.medium}`}>
                      <div className={styles['grade-badge']} data-grade={product.grade}>
                        {product.grade === 'premium' ? 'Premium' : 'Classic'}
                      </div>
                      <div className={styles.bag}>
                        <BagIllustration grade={product.grade} roast="medium" />
                      </div>
                    </div>
                    <div className={styles['product-info']}>
                      <h3 className={styles['product-name']}>{product.name}</h3>
                      <p className={styles['product-meta']}>Medium · Whole bean or ground</p>
                      <p className={styles['product-notes']}>
                        {(product.tasting_notes as string[]).join(' · ')}
                      </p>
                      <div className={styles['product-footer']}>
                        <div>
                          <div className={styles['product-price']}>
                            {product.startingPrice ? formatKES(product.startingPrice) : '—'}
                          </div>
                          <div className={styles['product-price-label']}>/ 250g</div>
                        </div>
                        <span className={styles['product-arrow']}>
                          <ArrowRight size={16} strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Dark roast */}
            <div className={styles['roast-group']}>
              <div className={styles['roast-label']}>
                <span>Dark roast</span>
                <div className={styles['roast-line']} />
              </div>
              <div className={styles['product-grid']}>
                {dark.map((product) => (
                  <Link href={`/shop/${product.slug}`} key={product.id} className={styles['product-card']}>
                    <div className={`${styles['product-visual']} ${styles.dark}`}>
                      <div className={styles['grade-badge']} data-grade={product.grade}>
                        {product.grade === 'premium' ? 'Premium' : 'Classic'}
                      </div>
                      <div className={styles.bag}>
                        <BagIllustration grade={product.grade} roast="dark" />
                      </div>
                    </div>
                    <div className={styles['product-info']}>
                      <h3 className={styles['product-name']}>{product.name}</h3>
                      <p className={styles['product-meta']}>Dark · Whole bean or ground</p>
                      <p className={styles['product-notes']}>
                        {(product.tasting_notes as string[]).join(' · ')}
                      </p>
                      <div className={styles['product-footer']}>
                        <div>
                          <div className={styles['product-price']}>
                            {product.startingPrice ? formatKES(product.startingPrice) : '—'}
                          </div>
                          <div className={styles['product-price-label']}>/ 250g</div>
                        </div>
                        <span className={styles['product-arrow']}>
                          <ArrowRight size={16} strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles['all-link']}>
              <Link href="/shop" className={styles['btn-primary']}>
                View all products
              </Link>
            </div>
          </div>
        </section>

        {/* ── Brand story ───────────────────────────────────── */}
        <section className={styles.story}>
          <div className={styles['story-inner']}>
            <p className={styles['story-quote']}>
              At <em>65°</em>, steamed milk reaches its natural sweetness —
              no burnt edges, no flat foam. We source and roast the coffee
              that deserves to meet it at exactly that temperature.
            </p>
            <p className={styles['story-attr']}>
              65 Degrees Coffee Roastery · Nairobi, Kenya
            </p>
          </div>
        </section>

        {/* ── Wholesale teaser ──────────────────────────────── */}
        <section className={styles.trade}>
          <div className={styles.container}>
            <div className={styles['trade-inner']}>
              <div className={styles['trade-text']}>
                <p className={styles['sec-eye']} style={{ color: 'var(--color-crema)' }}>
                  For cafés and businesses
                </p>
                <h2 className={styles['trade-title']}>
                  Supply your café<br />with Kenyan specialty
                </h2>
                <p className={styles['trade-sub']}>
                  Wholesale from 5kg. Free delivery within Nairobi.
                  Worldwide shipping available.
                </p>
                <Link href="/trade" className={styles['btn-crema']}>
                  View trade pricing
                </Link>
              </div>
              <div className={styles['trade-tiers']}>
                <div className={styles['tier-card']}>
                  <p className={styles['tier-grade']}>Classic grade</p>
                  <div className={styles['tier-row']}>
                    <span>5 – 30 kg</span>
                    <span>KES 1,500/kg</span>
                  </div>
                  <div className={styles['tier-row']}>
                    <span>31 – 100 kg</span>
                    <span>KES 1,400/kg</span>
                  </div>
                  <div className={styles['tier-row']}>
                    <span>100 kg +</span>
                    <span className={styles['tier-custom']}>Custom pricing</span>
                  </div>
                </div>
                <div className={styles['tier-card']}>
                  <p className={styles['tier-grade']}>Premium grade</p>
                  <div className={styles['tier-row']}>
                    <span>5 – 30 kg</span>
                    <span>KES 2,000/kg</span>
                  </div>
                  <div className={styles['tier-row']}>
                    <span>31 – 100 kg</span>
                    <span>KES 1,900/kg</span>
                  </div>
                  <div className={styles['tier-row']}>
                    <span>100 kg +</span>
                    <span className={styles['tier-custom']}>Custom pricing</span>
                  </div>
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

/* ── Bag illustration ──────────────────────────────────────────────────────── */
function BagIllustration({
  grade,
  roast,
}: {
  grade: string
  roast: string
}) {
  const isPremium = grade === 'premium'
  const accentColor = isPremium ? '#C8922A' : 'rgba(245,240,232,0.35)'
  const accentAlpha = isPremium ? 'rgba(200,146,42,0.12)' : 'rgba(245,240,232,0.05)'

  return (
    <div className={styles['bag-wrap']}>
      <svg viewBox="0 0 100 140" fill="none" className={styles['bag-svg']}>
        <rect x="6" y="18" width="88" height="114" rx="5"
          fill={accentAlpha} stroke={accentColor} strokeWidth="0.8" />
        <rect x="20" y="7" width="60" height="16" rx="3"
          fill={accentAlpha} stroke={accentColor} strokeWidth="0.5" />
        <line x1="18" y1="56" x2="82" y2="56"
          stroke={accentColor} strokeWidth="0.4" strokeOpacity="0.5" />
        <line x1="18" y1="100" x2="82" y2="100"
          stroke={accentColor} strokeWidth="0.4" strokeOpacity="0.5" />
      </svg>
      <div className={styles['bag-text']}>
        <div className={styles['bag-65']}>65°</div>
        <div className={styles['bag-origin']} style={{ color: accentColor }}>Kenya</div>
        <div className={styles['bag-grade']}>{isPremium ? 'Premium' : 'Classic'}</div>
        <div className={styles['bag-roast']}>{roast} roast</div>
      </div>
    </div>
  )
}
