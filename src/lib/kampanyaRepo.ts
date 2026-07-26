/**
 * Keşfet kampanyaları — Flutter ile aynı kaynak:
 * GitHub `Serdarza/kampanya` → kampanya.json
 *
 * Sıra: site gömülü `/data/kampanya.json` → jsDelivr → raw GitHub.
 */

import { readFile } from "fs/promises";
import path from "path";
import type { Campaign } from "@/types";

const LOCAL_URL = "/data/kampanya.json";
const RAW_URL =
  "https://raw.githubusercontent.com/Serdarza/kampanya/refs/heads/main/kampanya.json";
const CDN_URL =
  "https://cdn.jsdelivr.net/gh/Serdarza/kampanya@main/kampanya.json";

function asString(value: unknown): string {
  return value == null ? "" : String(value).trim();
}

function firstNonBlank(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const s = asString(row[key]);
    if (s) return s;
  }
  return "";
}

function parseTags(row: Record<string, unknown>, organization: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (raw: string) => {
    const t = raw.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  if (organization) add(organization);
  const e = row.etiketler;
  if (typeof e === "string") {
    for (const part of e.split(",")) add(part);
  } else if (Array.isArray(e)) {
    for (const x of e) add(asString(x));
  }
  return out;
}

function parseCampaign(raw: unknown, index: number): Campaign | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const title = firstNonBlank(row, ["baslik", "kampanyaBaslik"]);
  if (!title) return null;
  const organization = firstNonBlank(row, ["kurum", "kurulus", "kampanyaKurumu"]);
  const summary = asString(row.aciklama);
  const linkUrl = firstNonBlank(row, ["link", "detayLink", "detaylink"]) || null;
  const dateRaw = firstNonBlank(row, ["tarih", "eklenmeTarihi"]);
  const createdAt = dateRaw ? new Date(dateRaw) : null;
  const id = asString(row.id) || `kampanya-${index}`;

  return {
    id,
    title,
    organization,
    summary,
    linkUrl,
    createdAt:
      createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.toISOString()
        : null,
    tags: parseTags(row, organization),
  };
}

export function parseKampanyalar(root: unknown): Campaign[] {
  if (!root || typeof root !== "object") return [];
  const list = (root as { kampanyalar?: unknown }).kampanyalar;
  if (!Array.isArray(list)) return [];

  const out: Campaign[] = [];
  list.forEach((item, index) => {
    const campaign = parseCampaign(item, index);
    if (campaign) out.push(campaign);
  });

  out.sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    return tb - ta;
  });
  return out;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "force-cache",
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

/** Build / SSR: gömülü dosya → CDN → raw GitHub. Hata olursa []. */
export async function getCampaigns(): Promise<Campaign[]> {
  const bundled = await readBundledFile();
  if (bundled) {
    const parsed = parseKampanyalar(bundled);
    if (parsed.length) return parsed;
  }

  for (const url of [CDN_URL, RAW_URL, LOCAL_URL]) {
    const json = await fetchJson(url);
    if (!json) continue;
    const parsed = parseKampanyalar(json);
    if (parsed.length) return parsed;
  }
  return [];
}

export async function getFeaturedCampaigns(limit = 6): Promise<Campaign[]> {
  const all = await getCampaigns();
  return all.slice(0, limit);
}
