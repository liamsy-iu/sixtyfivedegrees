import { Nav } from '@/components/layout/Nav/Nav'
import { Footer } from '@/components/layout/Footer/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Brew Guide',
  description: 'SCA Golden Cup Standard brewing guides for pour over, French press, AeroPress, espresso, moka pot, and cold brew.',
}

const METHODS = [
  {
    id: 'pour-over',
    name: 'Pour Over',
    devices: 'V60 · Chemex · Kalita Wave',
    roast: 'Medium roast recommended',
    grind: 'Medium-fine',
    ratio: '60g per litre',
    water: '93–96°C',
    time: '3–4 minutes',
    sca: 'SCA Golden Cup Standard',
    steps: [
      { title: 'Grind', desc: 'Grind medium-fine — like coarse table salt. For 250ml water, use 15g of coffee.' },
      { title: 'Rinse', desc: 'Place filter in dripper, rinse with hot water to remove paper taste and preheat the vessel. Discard the water.' },
      { title: 'Bloom', desc: 'Add ground coffee, then pour 30g of water (2× the coffee weight). Wait 30–45 seconds. This releases CO₂ trapped in fresh coffee.' },
      { title: 'Pour', desc: 'Pour the remaining water in slow, steady spirals from centre outward. Keep water level consistent. Total pour time: 2.5–3 minutes.' },
      { title: 'Draw down', desc: 'Total brew time should be 3–4 minutes. If faster, grind finer. If slower, grind coarser.' },
    ],
    note: 'Best for tasting the full complexity of our Classic and Premium grades. The bright citrus and stone fruit notes shine through.',
  },
  {
    id: 'french-press',
    name: 'French Press',
    devices: 'Any French press',
    roast: 'Medium or dark roast',
    grind: 'Coarse',
    ratio: '75g per litre',
    water: '93–96°C',
    time: '4 minutes',
    sca: 'SCA Golden Cup Standard',
    steps: [
      { title: 'Grind', desc: 'Grind coarse — like breadcrumbs. For 350ml water, use 26g of coffee.' },
      { title: 'Preheat', desc: 'Pour a small amount of hot water into the French press, swirl, and discard.' },
      { title: 'Add coffee', desc: 'Add ground coffee to the press. Pour all the water at once.' },
      { title: 'Steep', desc: 'Place the lid on with the plunger pulled up. Steep for exactly 4 minutes.' },
      { title: 'Press and pour', desc: 'Press the plunger down slowly and steadily. Pour immediately — don\'t let it sit or it will over-extract and turn bitter.' },
    ],
    note: 'Full-bodied and rich. Our dark roast grades work exceptionally well here — the heavy body and low acidity are amplified by immersion brewing.',
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    devices: 'AeroPress · AeroPress Go',
    roast: 'Any roast',
    grind: 'Medium-fine',
    ratio: '75g per litre',
    water: '80–95°C',
    time: '1–2 minutes',
    sca: 'SCA Golden Cup Standard',
    steps: [
      { title: 'Set up', desc: 'Insert filter, rinse with hot water. For 200ml, use 15g of coffee. Use inverted method for more control.' },
      { title: 'Add coffee', desc: 'Add ground coffee. Pour 30ml of water at 90–95°C, stir, and wait 30 seconds to bloom.' },
      { title: 'Fill', desc: 'Pour remaining water to fill. Total water: 200ml. Stir 10 times.' },
      { title: 'Press', desc: 'After 1 minute total steep, flip onto cup and press down slowly over 20–30 seconds. Stop when you hear a hissing sound.' },
      { title: 'Adjust', desc: 'Too strong? Add hot water. Too weak or sour? Grind finer or increase steep time.' },
    ],
    note: 'The most forgiving method. Excellent for travel. The lower temperature (80–85°C) works well with our Premium grade for a cleaner, sweeter cup.',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    devices: 'Espresso machine',
    roast: 'Dark roast recommended',
    grind: 'Fine',
    ratio: '1:2 (dose to yield)',
    water: '90–96°C · 9 bar pressure',
    time: '25–30 seconds extraction',
    sca: 'SCA Golden Cup Standard',
    steps: [
      { title: 'Dose', desc: 'Use 18g of finely ground coffee for a double shot. Distribute evenly in the portafilter.' },
      { title: 'Tamp', desc: 'Tamp with 15–20kg of pressure. Level and even — uneven tamping causes channelling.' },
      { title: 'Extract', desc: 'Target yield: 36g of espresso (1:2 ratio) in 25–30 seconds. Time from first drop.' },
      { title: 'Adjust', desc: 'Extracts too fast (under 20s)? Grind finer. Too slow (over 35s)? Grind coarser. Adjust dose by 0.5g increments.' },
      { title: 'Steam milk', desc: 'For milk-based drinks, steam to 65°C. At exactly 65°, the natural lactose sugars reach peak sweetness — no burnt edges, silky microfoam.' },
    ],
    note: 'The 65° milk temperature is not arbitrary — it is where steamed milk is at its best. Our dark roast blends are built to hold up beautifully at this temperature.',
  },
  {
    id: 'moka-pot',
    name: 'Moka Pot',
    devices: 'Bialetti · Any stovetop moka',
    roast: 'Dark roast recommended',
    grind: 'Fine-medium',
    ratio: '1:7 coffee to water',
    water: 'Start cold or pre-boiled',
    time: '4–5 minutes',
    sca: null,
    steps: [
      { title: 'Fill', desc: 'Fill the bottom chamber with cold water to just below the safety valve.' },
      { title: 'Add coffee', desc: 'Fill the filter basket with ground coffee. Level off — do not tamp.' },
      { title: 'Assemble', desc: 'Screw the top and bottom together tightly. Place on medium-low heat.' },
      { title: 'Brew', desc: 'Keep the lid open. Watch for coffee to start flowing. Remove from heat when it turns from dark brown to golden yellow.' },
      { title: 'Pour immediately', desc: 'Run the bottom under cold water to stop extraction. Pour and serve immediately.' },
    ],
    note: 'Strong, concentrated, and bold. Not espresso — but close in character. Our Classic Dark Roast works very well in a moka pot.',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    devices: 'Mason jar · Cold brew bottle',
    roast: 'Medium or dark roast',
    grind: 'Coarse',
    ratio: '1:4 concentrate · 1:8 regular strength',
    water: 'Cold or room temperature',
    time: '12–24 hours',
    sca: null,
    steps: [
      { title: 'Grind', desc: 'Grind very coarse — coarser than French press. For 1 litre of regular-strength cold brew, use 125g of coffee.' },
      { title: 'Combine', desc: 'Add coffee to a jar or bottle. Pour cold or room-temperature water over it. Stir to saturate all grounds.' },
      { title: 'Steep', desc: 'Cover and refrigerate for 12–24 hours. 12 hours gives a lighter brew; 24 hours gives full body and stronger extraction.' },
      { title: 'Filter', desc: 'Strain through a paper filter or fine mesh. A second pass through a paper filter removes fine particles and brightens the cup.' },
      { title: 'Serve', desc: 'Serve over ice as-is, or dilute 1:1 with water or milk if brewed as concentrate. Keeps refrigerated for up to 2 weeks.' },
    ],
    note: 'Smooth, naturally sweet, and low acidity. Our medium roast grades work particularly well — the slow cold extraction brings out the fruit notes without bitterness.',
  },
]

export default function BrewPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eye}>Brew guide</p>
            <h1 className={styles.title}>How to brew<br /><em>great coffee</em></h1>
            <p className={styles.sub}>
              All recipes follow the SCA Golden Cup Standard — the Specialty Coffee
              Association&apos;s framework for optimal extraction. Adjust to taste from there.
            </p>
          </div>
          <div className={styles['hero-deco']} aria-hidden="true">65°</div>
        </section>

        {/* SCA Standard callout */}
        <section className={styles.sca}>
          <div className={styles.container}>
            <div className={styles['sca-inner']}>
              <div className={styles['sca-stat']}>
                <span className={styles['sca-num']}>55g/L</span>
                <span className={styles['sca-label']}>SCA Golden Cup coffee ratio (±10%)</span>
              </div>
              <div className={styles['sca-stat']}>
                <span className={styles['sca-num']}>90–96°C</span>
                <span className={styles['sca-label']}>Ideal brew water temperature</span>
              </div>
              <div className={styles['sca-stat']}>
                <span className={styles['sca-num']}>18–22%</span>
                <span className={styles['sca-label']}>Target extraction yield</span>
              </div>
              <div className={styles['sca-stat']}>
                <span className={styles['sca-num']}>65°C</span>
                <span className={styles['sca-label']}>Optimal milk temperature for espresso drinks</span>
              </div>
            </div>
          </div>
        </section>

        {/* Method nav */}
        <div className={styles['method-nav']}>
          <div className={styles.container}>
            <div className={styles['method-links']}>
              {METHODS.map(m => (
                <a key={m.id} href={`#${m.id}`} className={styles['method-link']}>
                  {m.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Methods */}
        <div className={styles.methods}>
          <div className={styles.container}>
            {METHODS.map((method, i) => (
              <section key={method.id} id={method.id} className={styles.method}>
                <div className={styles['method-header']}>
                  <div className={styles['method-title-row']}>
                    <span className={styles['method-num']}>0{i + 1}</span>
                    <h2 className={styles['method-name']}>{method.name}</h2>
                    {method.sca && (
                      <span className={styles['sca-badge']}>SCA Standard</span>
                    )}
                  </div>
                  <p className={styles['method-devices']}>{method.devices}</p>
                </div>

                <div className={styles['method-body']}>
                  {/* Specs */}
                  <div className={styles.specs}>
                    <div className={styles.spec}>
                      <span className={styles['spec-label']}>Grind</span>
                      <span className={styles['spec-val']}>{method.grind}</span>
                    </div>
                    <div className={styles.spec}>
                      <span className={styles['spec-label']}>Ratio</span>
                      <span className={styles['spec-val']}>{method.ratio}</span>
                    </div>
                    <div className={styles.spec}>
                      <span className={styles['spec-label']}>Water</span>
                      <span className={styles['spec-val']}>{method.water}</span>
                    </div>
                    <div className={styles.spec}>
                      <span className={styles['spec-label']}>Time</span>
                      <span className={styles['spec-val']}>{method.time}</span>
                    </div>
                    <div className={styles.spec}>
                      <span className={styles['spec-label']}>Best with</span>
                      <span className={styles['spec-val']}>{method.roast}</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className={styles.steps}>
                    {method.steps.map((step, j) => (
                      <div key={j} className={styles.step}>
                        <div className={styles['step-left']}>
                          <span className={styles['step-num']}>{j + 1}</span>
                        </div>
                        <div className={styles['step-right']}>
                          <h3 className={styles['step-title']}>{step.title}</h3>
                          <p className={styles['step-desc']}>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className={styles['method-note']}>
                  <p>{method.note}</p>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles['cta-title']}>Ready to brew?</h2>
            <p className={styles['cta-sub']}>
              All our beans are roasted fresh in Nairobi. Order online, delivered to your door.
            </p>
            <Link href="/shop" className={styles['cta-btn']}>Shop the beans</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
