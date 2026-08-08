/** GetYourGuide Partner (affiliate) — partner portal ID. */
export const GETYOURGUIDE = {
  partnerId: "SB2C6FV",
  label: "GetYourGuide",
  /** Genel keşif (şehir yok). */
  homePath: "https://www.getyourguide.com/tr-tr/",
} as const;

/**
 * Şehir / arama için takip linki.
 * Format: https://www.getyourguide.com/s/?q=...&partner_id=...
 */
export function getYourGuideSearchUrl(query?: string): string {
  const q = query?.trim() ?? "";
  const url = new URL("https://www.getyourguide.com/tr-tr/s/");
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("partner_id", GETYOURGUIDE.partnerId);
  return url.toString();
}

/** Ana sayfa / footer için partner linki. */
export function getYourGuideHomeUrl(): string {
  const url = new URL(GETYOURGUIDE.homePath);
  url.searchParams.set("partner_id", GETYOURGUIDE.partnerId);
  return url.toString();
}
