// Maps a lot's region string (as entered in admin) to its dedicated
// /origins/[slug] page, when one exists. Regions without a page yet
// render as plain text rather than a broken link.
const ORIGIN_SLUGS: Record<string, string> = {
  kiambu: 'kiambu',
  nyeri: 'nyeri',
  kirinyaga: 'kirinyaga',
  "murang'a": 'muranga',
  muranga: 'muranga',
  kisii: 'kisii',
}

export function getOriginSlug(region: string): string | null {
  return ORIGIN_SLUGS[region.trim().toLowerCase()] ?? null
}