import { slugifyCity } from "@/lib/utils";

export type ReversePlace = {
  /** İlçe / yerleşim adı */
  locality: string;
  /** İl (admin1) adı — mümkünse */
  province: string;
  latitude: number;
  longitude: number;
};

export type GeocodedPoint = {
  latitude: number;
  longitude: number;
};

/**
 * BigDataCloud reverse geocode — Türkiye için il (principalSubdivision)
 * ve ilçe (locality/city) ayrı döner.
 */
export async function reverseGeocodeDetailed(
  lat: number,
  lon: number
): Promise<ReversePlace> {
  const url =
    `https://api.bigdatacloud.net/data/reverse-geocode-client` +
    `?latitude=${lat}&longitude=${lon}&localityLanguage=tr`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Konum adı alınamadı");
  const data = await res.json();

  const province =
    (data.principalSubdivision as string | undefined)?.trim() ||
    (data.city as string | undefined)?.trim() ||
    "Konumunuz";

  const locality =
    (data.locality as string | undefined)?.trim() ||
    (data.city as string | undefined)?.trim() ||
    province;

  return { locality, province, latitude: lat, longitude: lon };
}

/** Bilinen il listesinden en iyi eşleşmeyi bulur (önce il, sonra yerleşim). */
export function matchProvince(
  place: ReversePlace,
  provinces: string[]
): string | null {
  const candidates = [place.province, place.locality].filter(Boolean);
  for (const candidate of candidates) {
    const key = slugifyCity(candidate);
    const hit = provinces.find((p) => slugifyCity(p) === key);
    if (hit) return hit;
  }
  // "Kayseri Province" / "Ankara İli" gibi sonekleri temizle
  for (const candidate of candidates) {
    const cleaned = candidate
      .replace(/\s+(ili|province|provinsi)$/i, "")
      .trim();
    const key = slugifyCity(cleaned);
    const hit = provinces.find((p) => slugifyCity(p) === key);
    if (hit) return hit;
  }
  return null;
}

const geocodeCache = new Map<string, GeocodedPoint | null>();

/**
 * Tesis adını Photon (OSM) ile geocode eder.
 * Kullanıcı konumuna bias vererek aynı isimli uzak sonuçları eler.
 */
export async function geocodeFacility(
  name: string,
  city: string,
  near?: { latitude: number; longitude: number },
  address?: string
): Promise<GeocodedPoint | null> {
  const cacheKey = `${slugifyCity(city)}|${slugifyCity(name)}|${slugifyCity(address ?? "")}`;
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey) ?? null;

  const query = address?.trim()
    ? `${name}, ${address}, ${city}, Türkiye`
    : `${name}, ${city}, Türkiye`;

  const params = new URLSearchParams({
    q: query,
    limit: "1",
    lang: "tr",
  });
  if (near) {
    params.set("lat", String(near.latitude));
    params.set("lon", String(near.longitude));
  }

  try {
    const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      geocodeCache.set(cacheKey, null);
      return null;
    }
    const data = await res.json();
    const feature = Array.isArray(data.features) ? data.features[0] : null;
    const coords = feature?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) {
      geocodeCache.set(cacheKey, null);
      return null;
    }
    // GeoJSON: [lon, lat]
    const point: GeocodedPoint = {
      longitude: Number(coords[0]),
      latitude: Number(coords[1]),
    };
    if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) {
      geocodeCache.set(cacheKey, null);
      return null;
    }
    geocodeCache.set(cacheKey, point);
    return point;
  } catch {
    geocodeCache.set(cacheKey, null);
    return null;
  }
}

/** Paralel ama sınırlı geocode — Photon'u boğmamak için. */
export async function geocodeMany(
  items: {
    key: string;
    name: string;
    city: string;
    address?: string;
  }[],
  near: { latitude: number; longitude: number },
  concurrency = 4
): Promise<Map<string, GeocodedPoint>> {
  const result = new Map<string, GeocodedPoint>();
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = items[index++];
      const point = await geocodeFacility(
        current.name,
        current.city,
        near,
        current.address
      );
      if (point) result.set(current.key, point);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );
  await Promise.all(workers);
  return result;
}

export function mapsSearchUrl(name: string, city: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name} ${city}`
  )}`;
}
