import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import { KenyaMap } from '@/components/illustrations/KenyaMap/KenyaMap'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Kenya’s Coffee Regions — Where We Source | 65 Degrees',
  description: 'A guide to Kenya’s coffee-growing regions, from Central Kenya’s Mount Kenya highlands to the areas beyond it. Traceable, single origin, SCA-graded.',
  alternates: { canonical: 'https://www.sixtyfivedegrees.com/origins' },
}

const REGIONS = [
  {
    slug: 'kiambu', name: 'Kiambu', current: true,
    meta: '1,400 – 1,800m · Washed',
    desc: 'Our current lot. Thirty kilometres from our roastery, on the southern slopes of the Aberdare range.',
  },
  {
    slug: 'nyeri', name: 'Nyeri', current: false,
    meta: '1,600 – 2,000m · Washed',
    desc: 'Mount Kenya’s northern slopes. Widely considered the most structurally complete washed coffee in Kenya.',
  },
  {
    slug: 'kirinyaga', name: 'Kirinyaga', current: false,
    meta: '1,400 – 1,900m · Washed',
    desc: 'Nyeri’s eastern neighbour. Varied terrain produces some of Kenya’s most layered, floral cups.',
  },
  {
    slug: 'muranga', name: 'Murang’a', current: false,
    meta: '1,340 – 1,950m · Washed',
    desc: 'Between Kiambu and Nyeri on the Aberdare Ridge. Classic Central Kenya character, less individually documented.',
  },
]

const BEYOND = [
  {
    name: 'Eastern Kenya', counties: 'Embu, Meru, Machakos, Tharaka-Nithi',
    desc: 'The eastern highlands of Mount Kenya and the Nyambene hills, roughly 1,280–1,970m. Embu in particular is known for bright fruit acidity and pronounced sweetness — berry, citrus, honey. Machakos and Makueni, further from the mountain, are more arid and produce less overall.',
  },
  {
    name: 'Rift Valley & Western', counties: 'Nakuru, Kericho, Bungoma, Kisii, Nandi',
    desc: 'A second growing belt running from the slopes of Mount Elgon toward the Eastern Rift. Fertile soils and consistent rainfall, though these regions don’t carry the specialty reputation of the Mount Kenya counties.',
  },
  {
    name: 'The Coast', counties: 'Taita Taveta',
    desc: 'Mostly arid land that doesn’t suit coffee well, with Taita Taveta the notable exception — strong, consistent sunshine compensates for lower rainfall.',
  },
]

export default function OriginsPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles['hero-inner']}>
              <div>
                <p className={styles.eye}>Where we source</p>
                <h1 className={styles.title}>Kenya&apos;s coffee,<br /><em>region by region.</em></h1>
                <p className={styles.sub}>
                  We buy traceable, single origin, SCA-graded coffee from across Kenya — wherever
                  we find it. Most of that has been Central Kenya so far: the band of high-altitude,
                  volcanic-soil counties surrounding Mount Kenya and the Aberdare Range that produces
                  the country&apos;s most celebrated arabica.
                </p>
              </div>
              <div className={styles['hero-map']}>
                <KenyaMap showAll highlight="kiambu" />
              </div>
            </div>
          </div>
        </section>

        {/* Central Kenya regions */}
        <section className={styles.regions}>
          <div className={styles.container}>
            <p className={styles['sec-eye']}>Central Kenya</p>
            <h2 className={styles['sec-title']}>The Mount Kenya &amp; Aberdare band</h2>
            <p className={styles['sec-sub']}>
              Around 60% of Kenya&apos;s coffee comes from here. Four counties, one mountain,
              broadly the same SL28 and SL34 varieties on the same volcanic red soil — and
              still four genuinely different cups.
            </p>
            <div className={styles['region-grid']}>
              {REGIONS.map(r => (
                <Link key={r.slug} href={`/origins/${r.slug}`} className={styles['region-card']}>
                  {r.current && <span className={styles['region-badge']}>Current stock</span>}
                  <h3 className={styles['region-name']}>{r.name}</h3>
                  <p className={styles['region-meta']}>{r.meta}</p>
                  <p className={styles['region-desc']}>{r.desc}</p>
                  <span className={styles['region-link']}>Read more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Beyond Central Kenya */}
        <section className={styles.beyond}>
          <div className={styles.container}>
            <p className={styles['sec-eye']}>Beyond Central Kenya</p>
            <h2 className={styles['sec-title']}>The rest of the country</h2>
            <p className={styles['sec-sub']}>
              Central Kenya isn&apos;t the whole picture. We don&apos;t have detailed sourcing
              relationships in these regions yet, but they&apos;re part of why &quot;we buy from
              anywhere in Kenya&quot; is a real standard and not just a Central Kenya story with
              extra steps.
            </p>
            <div className={styles['beyond-grid']}>
              {BEYOND.map(z => (
                <div key={z.name} className={styles['zone-card']}>
                  <h3 className={styles['zone-name']}>{z.name}</h3>
                  <p className={styles['zone-counties']}>{z.counties}</p>
                  <p className={styles['zone-desc']}>{z.desc}</p>
                </div>
              ))}
            </div>
            <p className={styles['beyond-note']}>
              If we buy from any of these regions, we&apos;ll build a page for it the same way
              we did for Kiambu, Nyeri, Kirinyaga, and Murang&apos;a — real data, not filler.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
