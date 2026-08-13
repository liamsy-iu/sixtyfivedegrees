import styles from './ElevationChart.module.css'

// Real altitude ranges as stated on each region's own page. Y-axis
// geometry computed directly against a 1200-2100m scale (see the
// origins-elevation-chart working notes) -- not eyeballed.

const REGIONS = [
  { slug: 'kiambu', name: 'Kiambu', lo: 1400, hi: 1800, yTop: 120.0, yBot: 253.3 },
  { slug: 'nyeri', name: 'Nyeri', lo: 1600, hi: 2000, yTop: 53.3, yBot: 186.7 },
  { slug: 'kirinyaga', name: 'Kirinyaga', lo: 1400, hi: 1900, yTop: 86.7, yBot: 253.3 },
  { slug: 'muranga', name: "Murang'a", lo: 1340, hi: 1950, yTop: 70.0, yBot: 273.3 },
]

const TICKS = [1200, 1400, 1600, 1800, 2000]

function tickY(m: number) {
  return 320 - ((m - 1200) / 900) * 300
}

export function ElevationChart({ highlight }: { highlight?: string }) {
  return (
    <svg viewBox="0 0 400 340" className={styles.chart} role="img" aria-label="Comparison of altitude ranges across Kiambu, Nyeri, Kirinyaga, and Murang'a">
      <line x1="76" y1="20" x2="76" y2="320" className={styles.axis} />
      {TICKS.map((m) => (
        <g key={m}>
          <line x1="70" y1={tickY(m)} x2="76" y2={tickY(m)} className={styles.tick} />
          <text x="64" y={tickY(m) + 3} textAnchor="end" className={styles['tick-label']}>{m}m</text>
        </g>
      ))}
      {REGIONS.map((r, i) => {
        const x = 90 + i * 78
        const isActive = highlight === r.slug
        const dim = highlight && !isActive
        return (
          <g key={r.slug}>
            <rect
              x={x} y={r.yTop} width="55" height={r.yBot - r.yTop}
              className={isActive ? styles['bar-active'] : dim ? styles['bar-dim'] : styles.bar}
            />
            <text x={x + 27} y={r.yTop - 8} textAnchor="middle" className={isActive ? styles['name-active'] : styles.name}>
              {r.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
