/**
 * Paylaş-kazan / affiliate reklamlar.
 *
 * Dosya yolu (buraya yeni link ekleyin):
 *   public/data/affiliate_ads.json
 *
 * Alanlar:
 *   id, title, subtitle?, imageUrl?, url, active
 *
 * imageUrl: gerçek görsel adresi olmalı (cdn.dsmcdn.com vb.).
 * ty.gl kısa linkini imageUrl olarak kullanmayın — o alan ürün sayfasına gider.
 */

export type AffiliateAd = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  url: string;
  active: boolean;
};

const LOCAL_URL = "/data/affiliate_ads.json";

let cache: AffiliateAd[] | null = null;
let loadPromise: Promise<AffiliateAd[]> | null = null;

function looksLikeImageUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return false;
  if (/ty\.gl\//i.test(url) || /trendyol\.com\/s\//i.test(url)) return false;
  return (
    /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url) ||
    /cdn\.dsmcdn\.com|images\.|img\./i.test(url)
  );
}

function parseAds(root: unknown): AffiliateAd[] {
  if (!root || typeof root !== "object") return [];
  const list = (root as { ads?: unknown }).ads;
  if (!Array.isArray(list)) return [];

  const out: AffiliateAd[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const id = String(row.id ?? "").trim();
    const title = String(row.title ?? "").trim();
    const url = String(row.url ?? "").trim();
    if (!id || !title || !url) continue;
    if (row.active === false) continue;

    const rawImage = String(row.imageUrl ?? "").trim();
    out.push({
      id,
      title,
      subtitle: String(row.subtitle ?? "").trim(),
      imageUrl: rawImage && looksLikeImageUrl(rawImage) ? rawImage : null,
      url,
      active: true,
    });
  }
  return out;
}

export async function getAffiliateAds(): Promise<AffiliateAd[]> {
  if (typeof window === "undefined") return [];
  if (cache) return cache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch(LOCAL_URL, { cache: "no-store" });
      if (!res.ok) return [];
      const data = parseAds(await res.json());
      cache = data;
      return data;
    } catch {
      return [];
    }
  })();

  return loadPromise;
}

/** Aynı slot için sabit seçim (render sırasında değişmesin). */
export function pickAffiliateAdStable(
  ads: AffiliateAd[],
  slot: string,
  salt = 0
): AffiliateAd | null {
  if (!ads.length) return null;
  let h = salt;
  for (let i = 0; i < slot.length; i++) h = (h * 31 + slot.charCodeAt(i)) >>> 0;
  return ads[h % ads.length] ?? null;
}
