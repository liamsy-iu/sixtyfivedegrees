import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Kiambu — Our Coffee Origin',
  description: 'Our beans are sourced from Kiambu County, Central Kenya — grown at 1,400–1,800m on the Aberdare foothills. Washed process, red volcanic soil, exceptional cup quality.',
}

const FACTS = [
  { label: 'Region', value: 'Kiambu County, Central Kenya' },
  { label: 'Altitude', value: '1,400 – 1,800m above sea level' },
  { label: 'Soil', value: 'Deep red volcanic soil' },
  { label: 'Process', value: 'Washed (wet process)' },
  { label: 'Main harvest', value: 'October – December' },
  { label: 'Fly crop', value: 'June – August' },
  { label: 'Distance from roastery', value: '~30km from Nairobi' },
]

const TASTING = [
  { note: 'Blackcurrant', desc: 'The signature of Kiambu — a deep, jammy fruit note that comes from the altitude and slow ripening.' },
  { note: 'Bright citrus', desc: 'Clean, sharp acidity characteristic of fully washed Central Kenya coffees.' },
  { note: 'Brown sugar', desc: 'Natural sweetness from the red volcanic soil and careful processing.' },
  { note: 'Full body', desc: 'Weight in the cup that holds up beautifully in milk drinks at 65°.' },
]

export default function KiambuPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>Origin · Central Kenya</p>
            <h1 className={styles.title}>Kiambu</h1>
            <p className={styles.sub}>
              Thirty kilometres from our roastery in Nairobi, the slopes of the Aberdare range
              produce some of Kenya's finest coffee. This is where our beans come from.
            </p>
          </div>
          <div className={styles['hero-deco']} aria-hidden="true">1,700m</div>
        </section>

        {/* Fast facts */}
        <section className={styles.facts}>
          <div className={styles.container}>
            <div className={styles['facts-grid']}>
              {FACTS.map(f => (
                <div key={f.label} className={styles.fact}>
                  <span className={styles['fact-label']}>{f.label}</span>
                  <span className={styles['fact-val']}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className={styles.story}>
          <div className={styles.container}>
            <div className={styles['story-layout']}>
              <div className={styles['story-text']}>
                <p className={styles['sec-eye']}>The land</p>
                <h2 className={styles['sec-title']}>Why Kiambu produces exceptional coffee</h2>
                <p className={styles.para}>
                  Kiambu County sits on the southern slopes of the Aberdare mountain range, 
                  at elevations between 1,400 and 1,800 metres above sea level. At this altitude,
                  coffee cherries ripen slowly — sometimes over nine months — which concentrates
                  sugars and develops the complex flavour compounds that specialty buyers seek.
                </p>
                <p className={styles.para}>
                  The soil is deep red volcanic earth, rich in minerals and excellent at retaining
                  moisture between the rains. Combined with Kiambu's two distinct rainy seasons,
                  the conditions produce two harvests per year — the main crop from October to
                  December, and a smaller fly crop from June to August.
                </p>
                <p className={styles.para}>
                  After picking, the cherries are processed using the washed method — pulped,
                  fermented to remove the mucilage, washed with clean water, and dried on
                  raised beds. This process produces the clean, bright, fruit-forward cup that
                  Kenyan coffee is celebrated for worldwide.
                </p>
              </div>
              <div className={styles['story-aside']}>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>30km from cup to roastery</p>
                  <p className={styles['aside-desc']}>
                    Kiambu is one of the closest major coffee-growing regions to Nairobi. 
                    Our green beans travel less than an hour from county to roastery —
                    shorter than most coffee travels in a single city.
                  </p>
                </div>
                <div className={styles['aside-card']}>
                  <p className={styles['aside-title']}>Kenya's coffee heritage</p>
                  <p className={styles['aside-desc']}>
                    Kiambu has been growing coffee since the early 1900s. The county's
                    smallholder farmers and cooperatives have refined their craft over
                    generations, producing beans that consistently score above 85 on
                    the SCA cupping scale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tasting notes */}
        <section className={styles.tasting}>
          <div className={styles.container}>
            <p className={styles['sec-eye']} style={{ color: 'var(--color-crema)' }}>In the cup</p>
            <h2 className={styles['sec-title']} style={{ color: 'var(--color-parchment)' }}>What Kiambu tastes like</h2>
            <div className={styles['tasting-grid']}>
              {TASTING.map(t => (
                <div key={t.note} className={styles['tasting-card']}>
                  <h3 className={styles['tasting-note']}>{t.note}</h3>
                  <p className={styles['tasting-desc']}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 65° connection */}
        <section className={styles.connection}>
          <div className={styles.container}>
            <div className={styles['connection-inner']}>
              <p className={styles['sec-eye']}>The 65° connection</p>
              <h2 className={styles['connection-title']}>
                Built for milk drinks
              </h2>
              <p className={styles['connection-body']}>
                Kiambu coffee has a full, heavy body that holds up beautifully when steamed milk
                is introduced. The blackcurrant and brown sugar notes don&apos;t disappear behind
                the milk — they complement it. This is not an accident. The altitude, soil, and
                washed processing conspire to produce a bean that is as good in a flat white
                as it is as a black filter.
              </p>
              <p className={styles['connection-body']}>
                At 65°C — the temperature at which milk reaches its natural sweetness — a
                Kiambu-sourced espresso reveals a depth that cheaper beans simply don&apos;t have.
                That&apos;s why we source exclusively from this region.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles['cta-title']}>Taste Kiambu for yourself</h2>
            <p className={styles['cta-sub']}>
              Available in Classic and Premium grades, medium and dark roast.
              Delivered to your door in Nairobi.
            </p>
            <Link href="/shop" className={styles['cta-btn']}>Shop the beans</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
