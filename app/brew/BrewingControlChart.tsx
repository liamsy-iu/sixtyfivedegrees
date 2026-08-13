import styles from './BrewingControlChart.module.css'

// Real SCA Golden Cup Standard values: ideal extraction yield 18-22%,
// ideal strength (TDS) 1.15-1.35%. Coordinates below are computed directly
// from those ranges against a 70-380 x / 24-260 y plot area -- not
// eyeballed. See the axis ticks for the mapping.

export function BrewingControlChart() {
  return (
    <svg viewBox="0 0 420 300" className={styles.chart} role="img" aria-label="SCA Coffee Brewing Control Chart showing ideal extraction yield and strength ranges">
      {/* Zone labels */}
      <text x="225" y="38" textAnchor="middle" className={styles.zone}>STRONG</text>
      <text x="225" y="252" textAnchor="middle" className={styles.zone}>WEAK</text>
      <text x="90" y="145" className={styles.zone}>UNDER-EXTRACTED</text>
      <text x="360" y="145" textAnchor="end" className={styles.zone}>OVER-EXTRACTED</text>

      {/* Ideal box */}
      <rect x="173.3" y="142.0" width="103.3" height="52.4" className={styles.ideal} />
      <text x="225" y="172" textAnchor="middle" className={styles['ideal-label']}>IDEAL</text>

      {/* Axes */}
      <line x1="70" y1="24" x2="70" y2="260" className={styles.axis} />
      <line x1="70" y1="260" x2="380" y2="260" className={styles.axis} />

      {/* X ticks: extraction yield */}
      {[14, 16, 18, 20, 22, 24, 26].map((ey, i) => {
        const x = 70 + (i * 310) / 6
        return (
          <g key={ey}>
            <line x1={x} y1="260" x2={x} y2="264" className={styles.tick} />
            <text x={x} y="276" textAnchor="middle" className={styles['tick-label']}>{ey}</text>
          </g>
        )
      })}
      <text x="225" y="296" textAnchor="middle" className={styles['axis-title']}>Extraction Yield (%)</text>

      {/* Y ticks: TDS / strength */}
      {[0.90, 1.05, 1.20, 1.35, 1.50, 1.65, 1.80].map((tds, i) => {
        const y = 260 - (i * 236) / 6
        return (
          <g key={tds}>
            <line x1="66" y1={y} x2="70" y2={y} className={styles.tick} />
            <text x="60" y={y + 3} textAnchor="end" className={styles['tick-label']}>{tds.toFixed(2)}</text>
          </g>
        )
      })}
      <text x="20" y="142" textAnchor="middle" className={styles['axis-title']} transform="rotate(-90 20 142)">Strength — TDS (%)</text>
    </svg>
  )
}
