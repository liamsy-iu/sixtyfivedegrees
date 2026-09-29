// Faint background texture for plain colour panels — a coffee-crema swirl.
// currentColor lets each usage tint it via CSS `color`.
export function LotCardMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
    </svg>
  )
}