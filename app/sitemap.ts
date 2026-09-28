import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

// Regenerate hourly so new lots appear without a redeploy.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.sixtyfivedegrees.com'
  const now = new Date()

  // A database hiccup should never take the whole sitemap down.
  let lotEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('lots')
      .select('lot_code, date_received')
      .in('status', ['active', 'sold_out'])
    if (error) throw error

    lotEntries = (data ?? []).map((lot) => ({
      url: `${base}/lots/${lot.lot_code}`,
      lastModified: new Date(lot.date_received),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (err) {
    console.error('[sitemap] failed to load lots', err)
  }

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...lotEntries,
    { url: `${base}/trade`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/origins/kiambu`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/brew`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/subscribe`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/delivery`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]
}