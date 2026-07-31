import type { Metadata, Viewport } from 'next'
import { CartDrawer } from '@/components/shop/CartDrawer/CartDrawer'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: '65 Degrees Coffee Roastery — Specialty Coffee Nairobi, Kenya',
    template: '%s | 65 Degrees Coffee Roastery Nairobi',
  },
  description: 'Kenya\'s premier specialty coffee roastery. Single origin Kiambu coffee roasted fresh in Nairobi. Buy whole bean or ground coffee online — Classic and Premium grades. Free delivery across Nairobi.',
  keywords: [
    'specialty coffee Kenya',
    'coffee roastery Nairobi',
    'Kenyan coffee online',
    'buy coffee Nairobi',
    'single origin Kenya coffee',
    'Kiambu coffee',
    'fresh roasted coffee Kenya',
    'wholesale coffee Kenya',
    'coffee beans Nairobi',
    'specialty coffee roaster Kenya',
    '65 degrees coffee',
    'arabica coffee Kenya',
  ],
  metadataBase: new URL('https://www.sixtyfivedegrees.com'),
  alternates: { canonical: 'https://www.sixtyfivedegrees.com' },
  openGraph: {
    siteName: '65 Degrees Coffee Roastery',
    locale: 'en_KE',
    type: 'website',
    title: '65 Degrees Coffee Roastery — Specialty Coffee Nairobi, Kenya',
    description: 'Kenya\'s premier specialty coffee roastery. Single origin Kiambu coffee roasted fresh in Nairobi. Buy online, free delivery across Nairobi.',
    url: 'https://www.sixtyfivedegrees.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '65 Degrees Coffee Roastery — Specialty Coffee Nairobi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '65 Degrees Coffee Roastery — Specialty Coffee Nairobi',
    description: 'Single origin Kenyan coffee roasted fresh in Nairobi. Buy online.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
