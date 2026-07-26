/**
 * Tesis / medya görselleri — Flutter `RotalinkImageCache` karşılığı.
 * İlk görüntüde indirir, Cache Storage'a yazar; sonraki ziyaretlerde ağa gitmez.
 */

const CACHE_NAME = "rotalink_media_v1";
const META_PREFIX = "rotalink-media-meta:";
/** Flutter ile aynı: ~180 gün. */
const STALE_MS = 180 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 800;

const memory = new Map<string, string>();
let pruneScheduled = false;

function isRemoteHttp(url: string) {
  return /^https?:\/\//i.test(url.trim());
}

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  const uri = (() => {
    try {
      return new URL(trimmed);
    } catch {
      return null;
    }
  })();
  if (!uri) return trimmed;

  // Pexels: AVIF/WebP yerine jpg zorla (Flutter ile aynı)
  if (uri.host.toLowerCase().includes("pexels.com")) {
    uri.searchParams.set("fm", "jpg");
    if (!uri.searchParams.has("auto")) uri.searchParams.set("auto", "compress");
    if (!uri.searchParams.has("cs")) uri.searchParams.set("cs", "tinysrgb");
    if (!uri.searchParams.has("w")) uri.searchParams.set("w", "960");
    return uri.toString();
  }
  return trimmed;
}

function readCachedAt(url: string): number {
  try {
    return Number(localStorage.getItem(META_PREFIX + url) ?? "0") || 0;
  } catch {
    return 0;
  }
}

function writeCachedAt(url: string) {
  try {
    localStorage.setItem(META_PREFIX + url, String(Date.now()));
  } catch {
    // quota
  }
}

function isFresh(url: string) {
  const at = readCachedAt(url);
  return at > 0 && Date.now() - at < STALE_MS;
}

async function openCache() {
  if (typeof window === "undefined" || !("caches" in window)) return null;
  return caches.open(CACHE_NAME);
}

async function pruneIfNeeded(cache: Cache) {
  if (pruneScheduled) return;
  pruneScheduled = true;
  try {
    const keys = await cache.keys();
    if (keys.length <= MAX_ENTRIES) return;

    const scored = keys.map((req) => ({
      req,
      at: readCachedAt(req.url),
    }));
    scored.sort((a, b) => a.at - b.at);
    const removeCount = scored.length - MAX_ENTRIES;
    await Promise.all(
      scored.slice(0, removeCount).map(async ({ req }) => {
        await cache.delete(req);
        try {
          localStorage.removeItem(META_PREFIX + req.url);
        } catch {
          // ignore
        }
      })
    );
  } catch {
    // ignore
  } finally {
    pruneScheduled = false;
  }
}

async function blobUrlFromCache(cache: Cache, url: string): Promise<string | null> {
  const hit = await cache.match(url);
  if (!hit) return null;
  if (!isFresh(url)) {
    // Eski kayıt — arka planda yenilenecek; şimdilik yine göster
  }
  const blob = await hit.blob();
  if (!blob || blob.size < 32) return null;
  return URL.createObjectURL(blob);
}

async function fetchAndStore(
  cache: Cache,
  url: string
): Promise<string | null> {
  const res = await fetch(url, {
    mode: "cors",
    credentials: "omit",
    // Tarayıcı HTTP önbelleğini de kullan; biz üstüne kalıcı Cache Storage yazarız
    cache: "force-cache",
  });
  if (!res.ok) return null;

  const blob = await res.blob();
  if (!blob || blob.size < 32) return null;

  const type = blob.type || "image/jpeg";
  await cache.put(
    url,
    new Response(blob, {
      headers: {
        "Content-Type": type,
        "X-Cached-At": String(Date.now()),
      },
    })
  );
  writeCachedAt(url);
  void pruneIfNeeded(cache);
  return URL.createObjectURL(blob);
}

/**
 * Uzak görseli Cache Storage'dan (veya ağdan) çözüp blob: URL döner.
 * Yerel path (/facilities/...) olduğu gibi bırakılır.
 * CORS engeli olursa orijinal URL'ye düşer (tarayıcı cache'i).
 */
export async function resolveCachedMediaSrc(rawUrl: string): Promise<string> {
  const url = normalizeUrl(rawUrl);
  if (!isRemoteHttp(url)) return url;

  const memo = memory.get(url);
  if (memo) return memo;

  try {
    const cache = await openCache();
    if (!cache) return url;

    const fromDisk = await blobUrlFromCache(cache, url);
    if (fromDisk) {
      memory.set(url, fromDisk);
      // Stale ise arka planda yenile
      if (!isFresh(url)) {
        void fetchAndStore(cache, url).then((fresh) => {
          if (!fresh) return;
          const old = memory.get(url);
          memory.set(url, fresh);
          if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
        });
      }
      return fromDisk;
    }

    const stored = await fetchAndStore(cache, url);
    if (stored) {
      memory.set(url, stored);
      return stored;
    }
  } catch {
    // CORS / quota / private mode
  }

  return url;
}

/** Görünen URL listesini sessizce önbelleğe alır (prefetch). */
export function prefetchMediaUrls(urls: string[]) {
  if (typeof window === "undefined") return;
  const unique = [...new Set(urls.map(normalizeUrl).filter(isRemoteHttp))];
  void (async () => {
    const cache = await openCache();
    if (!cache) return;
    for (const url of unique.slice(0, 40)) {
      if (memory.has(url) || (await cache.match(url))) continue;
      try {
        await fetchAndStore(cache, url);
      } catch {
        // ignore
      }
    }
  })();
}
