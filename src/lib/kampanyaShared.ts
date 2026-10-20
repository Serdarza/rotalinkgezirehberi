/**
 * Uygulama ile aynı kampanya kaynağı:
 * https://github.com/Serdarza/kampanya/blob/main/kampanya.json
 * (Flutter: GithubKampanyaConfig.rawDatabaseUrl)
 */

import type { Campaign } from "@/types";
import { slugifyCity } from "@/lib/utils";

export const KAMPANYA_RAW_URL =
  "https://raw.githubusercontent.com/Serdarza/kampanya/refs/heads/main/kampanya.json";

export const KAMPANYA_CDN_URL =
  "https://cdn.jsdelivr.net/gh/Serdarza/kampanya@main/kampanya.json";

/** Tarayıcı yedekleri. Önce uygulamanın okuduğu ham dosya. */
export const KAMPANYA_CLIENT_URLS = [
  KAMPANYA_RAW_URL,
  KAMPANYA_CDN_URL,
  "/data/kampanya.json",
];

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

function parseParagraphs(summary: string): string[] {
  return summary
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildSlug(title: string, index: number): string {
  const base = slugifyCity(title).slice(0, 70).replace(/-+$/, "");
  return base || `kampanya-${index}`;
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
    slug: buildSlug(title, index),
    title,
    organization,
    summary,
    paragraphs: parseParagraphs(summary),
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
  const usedSlugs = new Set<string>();
  list.forEach((item, index) => {
    const campaign = parseCampaign(item, index);
    if (!campaign) return;
    let slug = campaign.slug;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${campaign.slug}-${suffix++}`;
    }
    usedSlugs.add(slug);
    out.push({ ...campaign, slug });
  });

  out.sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    return tb - ta;
  });
  return out;
}
