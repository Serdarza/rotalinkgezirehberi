/**
 * Tesis görselleri — Flutter ile aynı mantık, Google Maps/Places YOK.
 *
 * Kaynak sırası (ücretsiz):
 * 1) Siteye gömülü `/data/tesisler_gorseller.json` (build önbelleği)
 * 2) localStorage
 * 3) GitHub / jsDelivr (Bunny CDN URL listesi)
 *
 * Fotoğraflar `rotalink-media.b-cdn.net` üzerinden gelir; runtime Google çekimi yok.
 */

import { facilityMatchKey } from "@/lib/searchNormalize";

const LOCAL_URL = "/data/tesisler_gorseller.json";
const RAW_URL =
  "https://raw.githubusercontent.com/Serdarza/rotalink-data/refs/heads/main/tesisler_gorseller.json";
const CDN_URL =
  "https://cdn.jsdelivr.net/gh/Serdarza/rotalink-data@main/tesisler_gorseller.json";

const CACHE_KEY = "rotalink_tesisler_gorseller_v2";
const CACHE_VERSION_KEY = "rotalink_tesisler_gorseller_version_v2";
const MAX_URLS = 3;

type IndexMap = Map<string, string[]>;

let index: IndexMap = new Map();
let loadPromise: Promise<void> | null = null;
let ready = false;

function pickStr(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (value == null) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return "";
}

function parseUrls(row: Record<string, unknown>): string[] {
  const raw = row.image_urls ?? row.images ?? row.gorseller ?? row.urls;
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    const s = String(item ?? "").trim();
    // Google Places / Maps runtime URL'lerini reddet
    if (!s.startsWith("http")) continue;
    if (/maps\.googleapis\.com|maps\.gstatic\.com|lh3\.googleusercontent\.com/i.test(s)) {
      continue;
    }
    out.push(s);
    if (out.length >= MAX_URLS) break;
  }
  return out;
}

function applyDecoded(root: unknown) {
  const next: IndexMap = new Map();
  let list: unknown[] | null = null;

  if (Array.isArray(root)) {
    list = root;
  } else if (root && typeof root === "object") {
    const obj = root as Record<string, unknown>;
    const raw = obj.items ?? obj.tesisler ?? obj.gorseller;
    if (Array.isArray(raw)) list = raw;
  }

  if (!list) {
    index = next;
    ready = true;
    return;
  }

  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const isim = pickStr(row, ["isim", "name", "tesis_adi"]);
    const il = pickStr(row, ["il", "sehir", "province"]);
    if (!isim && !il) continue;
    const urls = parseUrls(row);
    if (!urls.length) continue;
    next.set(facilityMatchKey(il, isim), urls);
  }

  index = next;
  ready = true;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      // site gömülü dosya uzun cache; remote için no-store
      cache: url.startsWith("/") ? "force-cache" : "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function readLocalCache(): unknown | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeLocalCache(data: unknown, version: string | null) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    if (version) localStorage.setItem(CACHE_VERSION_KEY, version);
  } catch {
    // quota / private mode
  }
}

async function fetchRemoteVersion(): Promise<string | null> {
  try {
    const res = await fetch(RAW_URL, { method: "HEAD", cache: "no-store" });
    if (!res.ok) return null;
    const etag = res.headers.get("etag");
    if (etag) return etag;
    const lm = res.headers.get("last-modified") ?? "";
    const len = res.headers.get("content-length") ?? "";
    if (lm || len) return `${lm}|${len}`;
    return null;
  } catch {
    return null;
  }
}

async function downloadAndApply() {
  // 1) Site gömülü → 2) CDN → 3) raw GitHub
  const data =
    (await fetchJson(LOCAL_URL)) ??
    (await fetchJson(CDN_URL)) ??
    (await fetchJson(RAW_URL));
  if (!data) return;
  applyDecoded(data);
  const version = (await fetchRemoteVersion()) ?? "bundled";
  writeLocalCache(data, version);
}

/**
 * Flutter `ensureLocalDataReady` karşılığı — önce site önbelleği, sonra remote.
 */
export function ensureFacilityImagesLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const cached = readLocalCache();
    if (cached) {
      applyDecoded(cached);
      // arka planda: önce gömülü dosya, gerekirse remote güncelle
      void (async () => {
        const bundled = await fetchJson(LOCAL_URL);
        if (bundled) {
          applyDecoded(bundled);
          writeLocalCache(bundled, "bundled");
        }
        const remote = await fetchRemoteVersion();
        const local = localStorage.getItem(CACHE_VERSION_KEY);
        if (remote && local && remote === local) return;
        if (remote) await downloadAndApply();
      })();
      return;
    }
    await downloadAndApply();
  })().catch(() => {
    // sessiz — kategori fallback kullanılır
  });

  return loadPromise;
}

export function isFacilityImageIndexReady() {
  return ready;
}

export function lookupFacilityImages(il: string, isim: string): string[] {
  return index.get(facilityMatchKey(il, isim)) ?? [];
}

export function facilityImageCount() {
  return index.size;
}
