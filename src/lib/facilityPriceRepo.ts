/**
 * Tesis fiyatları — Flutter ile aynı kaynak:
 * GitHub `Serdarza/rotalink-data` → fiyatlar.json
 * Eşleştirme: normalize(il) + normalize(isim)
 */

import { facilityMatchKey } from "@/lib/searchNormalize";

const RAW_URL =
  "https://raw.githubusercontent.com/Serdarza/rotalink-data/refs/heads/main/fiyatlar.json";
const CDN_URL =
  "https://cdn.jsdelivr.net/gh/Serdarza/rotalink-data@main/fiyatlar.json";

const CACHE_KEY = "rotalink_fiyatlar_v1";
const CACHE_VERSION_KEY = "rotalink_fiyatlar_version";

export type FacilityPriceEntry = {
  il: string;
  isim: string;
  fiyatSivil: string | null;
  fiyatKamuPersoneli: string | null;
  fiyatKurumPersoneli: string | null;
  fiyatSivilDefined: boolean;
  fiyatKamuDefined: boolean;
  fiyatKurumDefined: boolean;
};

export const DEFAULT_PRICE_NOTE =
  "Fiyatlar yaklaşıktır; tesise ve oda tipine göre değişebilir.";

type IndexMap = Map<string, FacilityPriceEntry>;

let index: IndexMap = new Map();
let note = DEFAULT_PRICE_NOTE;
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

/** Alan JSON'da varsa present=true; değer null ise "Kalamaz". */
function priceField(
  row: Record<string, unknown>,
  keys: string[]
): { present: boolean; value: string | null } {
  for (const key of keys) {
    if (!(key in row)) continue;
    const v = row[key];
    if (v == null) return { present: true, value: null };
    const s = String(v).trim();
    if (!s || s.toLowerCase() === "null") return { present: true, value: null };
    return { present: true, value: s };
  }
  return { present: false, value: null };
}

function tryParseEntry(raw: unknown): FacilityPriceEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const isim = pickStr(row, ["isim", "tesis_adi", "name", "title"]);
  const il = pickStr(row, ["il", "il_adi", "province", "sehir"]);
  if (!isim || !il) return null;

  const sivil = priceField(row, ["fiyat_sivil", "sivil"]);
  const kamu = priceField(row, [
    "fiyat_kamu_personeli",
    "fiyat_kamu",
    "kamu_personeli",
  ]);
  const kurum = priceField(row, [
    "fiyat_kurum_personeli",
    "fiyat_kurum",
    "kurum_personeli",
  ]);

  if (!sivil.present && !kamu.present && !kurum.present) return null;

  return {
    il,
    isim,
    fiyatSivil: sivil.present ? sivil.value : null,
    fiyatKamuPersoneli: kamu.present ? kamu.value : null,
    fiyatKurumPersoneli: kurum.present ? kurum.value : null,
    fiyatSivilDefined: sivil.present,
    fiyatKamuDefined: kamu.present,
    fiyatKurumDefined: kurum.present,
  };
}

function applyDecoded(root: unknown) {
  const next: IndexMap = new Map();
  let nextNote = DEFAULT_PRICE_NOTE;

  if (root && typeof root === "object" && !Array.isArray(root)) {
    const obj = root as Record<string, unknown>;
    const n = obj.not ?? obj.note ?? obj.aciklama;
    if (n != null && String(n).trim()) nextNote = String(n).trim();
    const list = obj.tesisler ?? obj.fiyatlar ?? obj.items;
    if (Array.isArray(list)) {
      for (const item of list) {
        const e = tryParseEntry(item);
        if (!e) continue;
        next.set(facilityMatchKey(e.il, e.isim), e);
      }
    }
  } else if (Array.isArray(root)) {
    for (const item of root) {
      const e = tryParseEntry(item);
      if (!e) continue;
      next.set(facilityMatchKey(e.il, e.isim), e);
    }
  }

  note = nextNote;
  index = next;
  ready = true;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
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
    // ignore
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
  const data = (await fetchJson(CDN_URL)) ?? (await fetchJson(RAW_URL));
  if (!data) return;
  applyDecoded(data);
  const version = await fetchRemoteVersion();
  writeLocalCache(data, version);
}

export function ensureFacilityPricesLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const cached = readLocalCache();
    if (cached) {
      applyDecoded(cached);
      void (async () => {
        const remote = await fetchRemoteVersion();
        const local = localStorage.getItem(CACHE_VERSION_KEY);
        if (remote && local && remote === local) return;
        await downloadAndApply();
      })();
      return;
    }
    await downloadAndApply();
  })().catch(() => {
    // sessiz
  });

  return loadPromise;
}

export function isFacilityPriceIndexReady() {
  return ready;
}

export function getFacilityPriceNote() {
  return note;
}

export function lookupFacilityPrice(
  il: string,
  isim: string
): FacilityPriceEntry | null {
  return index.get(facilityMatchKey(il, isim)) ?? null;
}
