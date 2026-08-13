import styles from './ScreenSizeDiagram.module.css'

// Real conversion: 1 screen size unit = 1/64 inch. AA = screen 17-18,
// AB = screen 15-16 (both stated in the GRADES data on this page).
// Circle diameters below are computed at 11px/mm from the midpoint of
// each range (AA: 6.95mm, AB: 6.15mm) -- not eyeballed. PB is peaberry:
// sorted by roundness on a dedicated peaberry sorter, not by the same
// flat-bean screen scale, so it's shown as a shape rather than placed
// on the same size axis.

export function ScreenSizeDiagram() {
  return (
    <svg viewBox="0 0 460 180" className={styles.diagram} role="img" aria-label="Relative size comparison of AA, AB, and peaberry coffee grades">
      <circle cx="85" cy="85" r="38.2" className={styles.circle} />
      <text x="85" y="150" textAnchor="middle" className={styles.label}>AA</text>
      <text x="85" y="165" textAnchor="middle" className={styles.sub}>Screen 17–18</text>
      <text x="85" y="176" textAnchor="middle" className={styles.sub}>6.75–7.14mm</text>

      <circle cx="235" cy="94" r="33.8" className={styles.circle} />
      <text x="235" y="150" textAnchor="middle" className={styles.label}>AB</text>
      <text x="235" y="165" textAnchor="middle" className={styles.sub}>Screen 15–16</text>
      <text x="235" y="176" textAnchor="middle" className={styles.sub}>5.95–6.35mm</text>

      <ellipse cx="380" cy="90" rx="26" ry="34" className={styles.circle} />
      <line x1="380" y1="60" x2="380" y2="120" className={styles.crease} />
      <text x="380" y="150" textAnchor="middle" className={styles.label}>PB</text>
      <text x="380" y="165" textAnchor="middle" className={styles.sub}>Sorted by shape,</text>
      <text x="380" y="176" textAnchor="middle" className={styles.sub}>not size</text>
    </svg>
  )
}
