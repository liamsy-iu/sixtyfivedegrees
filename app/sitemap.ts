import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.sixtyfivedegrees.com'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/shop/kenya-premium-dark`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/shop/kenya-premium-medium`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/shop/kenya-classic-dark`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/shop/kenya-classic-medium`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/trade`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/origins/kiambu`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/brew`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/subscribe`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/delivery`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]
}
