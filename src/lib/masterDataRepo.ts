/**
 * Master veritabanı — Flutter ile aynı kaynak:
 * GitHub `Serdarza/rotalink-data` → master_database_updated.json
 *
 * Sıra: Cache API / site gömülü `/data/master_database.json` → jsDelivr → raw GitHub.
 * Build-time SSG için `data/master_database.json` ayrıca kullanılır; tarayıcıda
 * GitHub sürümü değişince liste güncellenir.
 */

import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";

const LOCAL_URL = "/data/master_database.json";
const RAW_URL =
  "https://raw.githubusercontent.com/Serdarza/rotalink-data/refs/heads/main/master_database_updated.json";
const RAW_URL_ALT =
  "https://raw.githubusercontent.com/Serdarza/rotalink-data/main/master_database_updated.json";
const CDN_URL =
  "https://cdn.jsdelivr.net/gh/Serdarza/rotalink-data@main/master_database_updated.json";

const CACHE_NAME = "rotalink-master-v1";
const CACHE_REQ = "/__rotalink_master_database__";
const CACHE_VERSION_KEY = "rotalink_master_version_v1";

export type MasterSnapshot = {
  tesis: Tesis[];
  gezi: GeziYeri[];
  yemek: YemekMekani[];
  sosyal: SosyalTesis[];
  cities: string[];
};

const EMPTY: MasterSnapshot = {
  tesis: [],
  gezi: [],
  yemek: [],
  sosyal: [],
  cities: [],
};

let snapshot: MasterSnapshot = EMPTY;
let loadPromise: Promise<void> | null = null;
let ready = false;

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore listener errors
    }
  });
}

export function subscribeMasterData(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function asString(value: unknown): string {
  return value == null ? "" : String(value).trim();
}

function parseTesisList(raw: unknown): Tesis[] {
  if (!Array.isArray(raw)) return [];
  const out: Tesis[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const isim = asString(row.isim ?? row.name);
    const il = asString(row.il ?? row.sehir);
    if (!isim || !il) continue;
    out.push({
      isim,
      tip: asString(row.tip ?? row.type) || "Kamu Misafirhanesi",
      il,
      adres: asString(row.adres) || undefined,
      telefon: asString(row.telefon ?? row.tel) || undefined,
      latitude:
        typeof row.latitude === "number"
          ? row.latitude
          : typeof row.lat === "number"
            ? row.lat
            : undefined,
      longitude:
        typeof row.longitude === "number"
          ? row.longitude
          : typeof row.lng === "number"
            ? row.lng
            : typeof row.lon === "number"
              ? row.lon
              : undefined,
      aciklama: asString(row.aciklama) || undefined,
    });
  }
  return out;
}

function parseNamedList<T extends { isim: string; il: string }>(
  raw: unknown,
  mapRow: (row: Record<string, unknown>, isim: string, il: string) => T | null
): T[] {
  if (!Array.isArray(raw)) return [];
  const out: T[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const isim = asString(row.isim ?? row.name);
    const il = asString(row.il ?? row.sehir);
    if (!isim || !il) continue;
    const mapped = mapRow(row, isim, il);
    if (mapped) out.push(mapped);
  }
  return out;
}

function looksLikeValidMaster(root: unknown): boolean {
  if (!root || typeof root !== "object" || Array.isArray(root)) return false;
  const obj = root as Record<string, unknown>;
  const tesis = obj.tesisler ?? obj.misafirhaneler;
  return Array.isArray(tesis) && tesis.length > 0;
}

function applyDecoded(root: unknown) {
  if (!looksLikeValidMaster(root)) return;

  const obj = root as Record<string, unknown>;
  const tesis = parseTesisList(obj.tesisler ?? obj.misafirhaneler);
  const gezi = parseNamedList<GeziYeri>(obj.geziler, (_row, isim, il) => ({
    isim,
    il,
    adres: asString(_row.adres) || undefined,
    aciklama: asString(_row.aciklama) || undefined,
  }));
  const yemek = parseNamedList<YemekMekani>(obj.yemekler, (_row, isim, il) => ({
    isim,
    il,
    adres: asString(_row.adres) || undefined,
    aciklama: asString(_row.aciklama) || undefined,
  }));
  const sosyal = parseNamedList<SosyalTesis>(obj.sosyal, (row, isim, il) => ({
    isim,
    il,
    ilce: asString(row.ilce) || undefined,
    belediye: asString(row.belediye) || undefined,
    adres: asString(row.adres) || undefined,
    aciklama: asString(row.aciklama) || undefined,
  }));

  const citySet = new Set<string>();
  for (const item of [...tesis, ...gezi, ...yemek, ...sosyal]) {
    if (item.il) citySet.add(item.il.trim());
  }

  snapshot = {
    tesis,
    gezi,
    yemek,
    sosyal,
    cities: [...citySet].sort((a, b) => a.localeCompare(b, "tr")),
  };
  ready = true;
  notify();
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      cache: url.startsWith("/") ? "force-cache" : "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!looksLikeValidMaster(data)) return null;
    return data;
  } catch {
    return null;
  }
}

async function readLocalCache(): Promise<unknown | null> {
  try {
    if (!("caches" in window)) return null;
    const cache = await caches.open(CACHE_NAME);
    const res = await cache.match(CACHE_REQ);
    if (!res) return null;
    const data = await res.json();
    if (!looksLikeValidMaster(data)) return null;
    return data;
  } catch {
    return null;
  }
}

async function writeLocalCache(data: unknown, version: string | null) {
  try {
    if (version) localStorage.setItem(CACHE_VERSION_KEY, version);
    if (!("caches" in window)) return;
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      CACHE_REQ,
      new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    // quota / private mode
  }
}

async function fetchRemoteVersion(): Promise<string | null> {
  for (const url of [RAW_URL, RAW_URL_ALT, CDN_URL]) {
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (!res.ok) continue;
      const etag = res.headers.get("etag");
      if (etag) return etag;
      const lm = res.headers.get("last-modified") ?? "";
      const len = res.headers.get("content-length") ?? "";
      if (lm || len) return `${lm}|${len}`;
    } catch {
      // try next
    }
  }
  return null;
}

/** Günde 1 kez HEAD ile sürüm kontrolü; ~2 MB dosya sadece etag değişince iner. */
const UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const LAST_CHECK_KEY = `${CACHE_VERSION_KEY}_checked_at`;

function shouldCheckRemote(): boolean {
  try {
    const last = Number(localStorage.getItem(LAST_CHECK_KEY) ?? "0");
    return !Number.isFinite(last) || Date.now() - last >= UPDATE_CHECK_INTERVAL_MS;
  } catch {
    return false;
  }
}

function markRemoteChecked() {
  try {
    localStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/** Sadece etag değiştiyse tam dosyayı indirir (jsDelivr → raw GitHub). */
async function updateFromRemoteIfChanged() {
  markRemoteChecked();
  const remote = await fetchRemoteVersion();
  if (!remote) return;
  const local = localStorage.getItem(CACHE_VERSION_KEY);
  if (local === remote) return;

  const data =
    (await fetchJson(CDN_URL)) ??
    (await fetchJson(RAW_URL)) ??
    (await fetchJson(RAW_URL_ALT));
  if (!data) return;
  applyDecoded(data);
  await writeLocalCache(data, remote);
}

async function loadBundledAndApply(): Promise<boolean> {
  const data = await fetchJson(LOCAL_URL);
  if (!data) return false;
  applyDecoded(data);
  await writeLocalCache(data, "bundled");
  return true;
}

/**
 * Flutter `ensureLocalDataReady` karşılığı:
 * Cache API → site gömülü dosya → (ilk kurulumda) GitHub.
 * Remote yalnızca günde 1 kez, o da sürüm değişmişse indirilir.
 */
export function ensureMasterDataLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const cached = await readLocalCache();
    if (cached) {
      applyDecoded(cached);
    } else if (!(await loadBundledAndApply())) {
      // Gömülü dosya da yoksa ilk kurulum GitHub'dan
      const data =
        (await fetchJson(CDN_URL)) ??
        (await fetchJson(RAW_URL)) ??
        (await fetchJson(RAW_URL_ALT));
      if (data) {
        applyDecoded(data);
        await writeLocalCache(data, (await fetchRemoteVersion()) ?? "remote");
        markRemoteChecked();
      }
      return;
    }

    if (shouldCheckRemote()) void updateFromRemoteIfChanged();
  })().catch(() => {
    // sessiz — build-time props fallback
  });

  return loadPromise;
}

export function isMasterDataReady() {
  return ready;
}

export function getMasterSnapshot(): MasterSnapshot {
  return snapshot;
}

export function getMasterTesis() {
  return snapshot.tesis;
}

export function getMasterCities() {
  return snapshot.cities;
}

export function filterMasterByCity(city: string): Omit<MasterSnapshot, "cities"> {
  const match = (il?: string) =>
    (il ?? "").toLocaleLowerCase("tr") === city.toLocaleLowerCase("tr");
  return {
    tesis: snapshot.tesis.filter((t) => match(t.il)),
    gezi: snapshot.gezi.filter((g) => match(g.il)),
    yemek: snapshot.yemek.filter((y) => match(y.il)),
    sosyal: snapshot.sosyal.filter((s) => match(s.il)),
  };
}
