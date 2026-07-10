import type { Metadata, Viewport } from 'next'
import { CartDrawer } from '@/components/shop/CartDrawer/CartDrawer'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: { default: '65 Degrees Coffee Roastery', template: '%s — 65 Degrees Coffee' },
  description: 'Single origin Kenyan coffee roasted in Nairobi. Classic and Premium grades.',
  metadataBase: new URL('https://sixtyfivedegrees.com'),
  openGraph: { siteName: '65 Degrees Coffee Roastery', locale: 'en_KE', type: 'website' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1410',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CartDrawer />
      </body>
    </html>
  )
}
