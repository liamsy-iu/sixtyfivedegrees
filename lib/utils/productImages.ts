/**
 * Maps product slugs to image paths in /public/products/
 * Add new images here as you photograph more products.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  'kenya-premium-dark':   '/products/kenya-premium.jpg',
  'kenya-premium-medium': '/products/kenya-premium.jpg',
}

export function getProductImage(slug: string): string | null {
  return PRODUCT_IMAGES[slug] ?? null
}
