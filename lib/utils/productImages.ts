/**
 * Maps product slugs to image paths in /public/products/
 * Add new images here as you photograph more products.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  'kenya-premium-dark':   '/products/kenya-premium.png',
  'kenya-premium-medium': '/products/kenya-premium.png',
}

export function getProductImage(slug: string): string | null {
  return PRODUCT_IMAGES[slug] ?? null
}
