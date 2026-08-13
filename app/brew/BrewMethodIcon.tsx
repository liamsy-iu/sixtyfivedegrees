export function BrewMethodIcon({ id, className }: { id: string; className?: string }) {
  const props = { viewBox: '0 0 40 40', className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (id) {
    case 'pour-over':
      return (
        <svg {...props}>
          <path d="M11 9 L29 9 L21 31 L19 31 Z" />
          <line x1="14" y1="14" x2="17" y2="14" />
          <line x1="26" y1="14" x2="23" y2="14" />
        </svg>
      )
    case 'french-press':
      return (
        <svg {...props}>
          <rect x="11" y="15" width="16" height="19" rx="1" />
          <circle cx="19" cy="8" r="2.5" />
          <line x1="19" y1="10.5" x2="19" y2="15" />
          <path d="M27 19 C33 19 33 27 27 27" />
        </svg>
      )
    case 'aeropress':
      return (
        <svg {...props}>
          <rect x="10" y="21" width="20" height="11" rx="1" />
          <rect x="16" y="6" width="8" height="15" />
          <rect x="12" y="3" width="16" height="4" rx="1" />
          <line x1="8" y1="32" x2="32" y2="32" />
        </svg>
      )
    case 'espresso':
      return (
        <svg {...props}>
          <path d="M11 14 L27 14 L23 27 L15 27 Z" />
          <rect x="27" y="18" width="9" height="4" />
          <circle cx="38" cy="20" r="2.5" />
        </svg>
      )
    case 'moka-pot':
      return (
        <svg {...props}>
          <path d="M13 32 L27 32 L24 21 L16 21 Z" />
          <path d="M16 21 L24 21 L22 10 L18 10 Z" />
          <path d="M27 24 C32 24 32 29 27 29" />
          <circle cx="20" cy="8" r="1.8" />
        </svg>
      )
    case 'cold-brew':
      return (
        <svg {...props}>
          <rect x="12" y="13" width="16" height="20" rx="1.5" />
          <rect x="14" y="8" width="12" height="5" rx="1" />
          <rect x="17" y="18" width="3" height="3" />
          <rect x="21" y="23" width="3" height="3" />
        </svg>
      )
    default:
      return null
  }
}
