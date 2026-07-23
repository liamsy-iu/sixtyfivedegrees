import type { Metadata, Viewport } from 'next'
import { CartDrawer } from '@/components/shop/CartDrawer/CartDrawer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import '../styles/globals.css'

const BASE_URL = 'https://www.sixtyfivedegrees.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '65 Degrees Coffee Roastery — Single Origin Kenyan Coffee',
    template: '%s | 65 Degrees Coffee Roastery',
  },
  description: 'Single origin Kenyan specialty coffee roasted in Nairobi. Classic and Premium grades. Retail 250g–1kg. Wholesale from 5kg for cafés.',
  keywords: ['Kenyan coffee', 'specialty coffee Nairobi', 'single origin coffee Kenya', 'coffee roastery Nairobi', '65 degrees coffee', 'buy coffee online Kenya', 'wholesale coffee Kenya'],
  openGraph: {
    type: 'website', locale: 'en_KE', url: BASE_URL,
    siteName: '65 Degrees Coffee Roastery',
    title: '65 Degrees Coffee Roastery — Single Origin Kenyan Coffee',
    description: 'Single origin Kenyan specialty coffee roasted in Nairobi.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: '65 Degrees Coffee Roastery', images: ['/og-image.png'] },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#1A1410' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CartDrawer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
