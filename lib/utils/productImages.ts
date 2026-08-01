/**
 * Maps product slugs to image paths in /public/products/
 * Add new images here as you photograph more products.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  'kenya-premium-dark':   '/products/kenya-premium-dark.png',
  'kenya-premium-medium': '/products/kenya-premium-medium.png',
  'kenya-classic-dark':   '/products/kenya-classic-dark.png',
  'kenya-classic-medium': '/products/kenya-classic-medium.png',
}

export function getProductImage(slug: string): string | null {
  return PRODUCT_IMAGES[slug] ?? null
}
