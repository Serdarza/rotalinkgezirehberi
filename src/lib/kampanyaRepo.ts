/**
 * Keşfet kampanyaları — Flutter ile aynı dosya:
 * GitHub `Serdarza/kampanya` → kampanya.json
 *
 * Derlemede sıra: ham GitHub → jsDelivr → siteye gömülü yedek dosya.
 * Ziyaretçi sayfayı açınca liste ayrıca aynı adresten yenilenir.
 */

import { readFile } from "fs/promises";
import path from "path";
import type { Campaign } from "@/types";
import {
  KAMPANYA_CDN_URL,
  KAMPANYA_RAW_URL,
  parseKampanyalar,
} from "@/lib/kampanyaShared";

export { parseKampanyalar } from "@/lib/kampanyaShared";

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function readBundledFile(): Promise<unknown | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "kampanya.json");
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

async function loadCampaigns(): Promise<Campaign[]> {
  for (const url of [KAMPANYA_RAW_URL, KAMPANYA_CDN_URL]) {
    const json = await fetchJson(url);
    if (!json) continue;
    const parsed = parseKampanyalar(json);
    if (parsed.length) return parsed;
  }

  const bundled = await readBundledFile();
  if (bundled) {
    const parsed = parseKampanyalar(bundled);
    if (parsed.length) return parsed;
  }
  return [];
}

let loading: Promise<Campaign[]> | null = null;

/** Derleme boyunca bir kez okunur. Kaynak, uygulamanın kampanya listesidir. */
export function getCampaigns(): Promise<Campaign[]> {
  loading ??= loadCampaigns();
  return loading;
}

export async function getFeaturedCampaigns(limit = 6): Promise<Campaign[]> {
  const all = await getCampaigns();
  return all.slice(0, limit);
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const all = await getCampaigns();
  return all.find((c) => c.slug === slug) ?? null;
}

/** Detay sayfasında "diğer kampanyalar" için. */
export async function getRelatedCampaigns(slug: string, limit = 3): Promise<Campaign[]> {
  const all = await getCampaigns();
  return all.filter((c) => c.slug !== slug).slice(0, limit);
}
