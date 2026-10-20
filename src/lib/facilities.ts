import { cache } from "react";
import { getAllData } from "@/lib/data";
import { capitalizeCity, slugifyCity } from "@/lib/utils";
import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";

/** Veride sayı gibi bozuk gelen alanlar için güvenli metin (yoksa undefined). */
export function asText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const t = value.replace(/\s+/g, " ").trim();
  return t.length >= 3 ? t : undefined;
}

/** Konaklama tesisi türü (cityGuide.countFacilityTips ile aynı sınıflandırma). */
export type FacilityKind = "ogretmenevi" | "polisevi" | "orduevi" | "misafirhane";

export function facilityKind(tip?: string | null): FacilityKind {
  const n = String(tip ?? "")
    .trim()
    .toLocaleLowerCase("tr");
  if (n.includes("orduevi")) return "orduevi";
  if (n.includes("polisevi")) return "polisevi";
  if (n.includes("öğretmenevi") || n.includes("ogretmenevi")) return "ogretmenevi";
  return "misafirhane";
}

/** Verideki ham `tip` değerinden okunabilir etiket üretir ("F", boş vb. temizlenir). */
export function displayFacilityType(tip?: string | null): string {
  const raw = String(tip ?? "").trim();
  const kind = facilityKind(raw);
  if (kind === "orduevi") return "Orduevi";
  if (kind === "polisevi") return "Polisevi";
  if (kind === "ogretmenevi") return "Öğretmenevi";
  if (raw.length < 4 || raw.toLowerCase() === "null") return "Kamu Misafirhanesi";
  return raw;
}

export type FacilityEntry = {
  facility: Tesis;
  citySlug: string;
  slug: string;
  /** `/tesis/<il>/<tesis>/` */
  path: string;
  kind: FacilityKind;
};

export function facilityPath(il: string, slug: string): string {
  return `/tesis/${slugifyCity(il)}/${slug}/`;
}

/**
 * Tüm tesisler için tekil URL'ler. Aynı ilde aynı ada sahip kayıtlar için
 * ikincisine `-2` eklenir; ilk kayıt uygulamadaki `rotalinkSlug` ile birebir kalır.
 */
export const getFacilityIndex = cache(async (): Promise<FacilityEntry[]> => {
  const { tesis } = await getAllData();
  const used = new Set<string>();
  const out: FacilityEntry[] = [];
  for (const facility of tesis) {
    const citySlug = slugifyCity(facility.il ?? "");
    const base = slugifyCity(facility.isim ?? "");
    if (!citySlug || !base) continue;
    let slug = base;
    let n = 2;
    while (used.has(`${citySlug}/${slug}`)) slug = `${base}-${n++}`;
    used.add(`${citySlug}/${slug}`);
    out.push({
      facility,
      citySlug,
      slug,
      path: facilityPath(facility.il, slug),
      kind: facilityKind(facility.tip),
    });
  }
  return out;
});

export const getFacilityPathMap = cache(async () => {
  const index = await getFacilityIndex();
  const map = new Map<string, string>();
  for (const e of index) map.set(`${e.citySlug}/${slugifyCity(e.facility.isim)}`, e.path);
  return map;
});

export type CityBundle = {
  city: string;
  displayCity: string;
  slug: string;
  tesis: FacilityEntry[];
  gezi: GeziYeri[];
  yemek: YemekMekani[];
  sosyal: SosyalTesis[];
};

/** Slug → il verisi (tesisler yol bilgisiyle birlikte). */
export const getCityBundles = cache(async (): Promise<Map<string, CityBundle>> => {
  const { cities, gezi, yemek, sosyal } = await getAllData();
  const index = await getFacilityIndex();
  const map = new Map<string, CityBundle>();
  for (const city of cities) {
    const slug = slugifyCity(city);
    if (!slug || map.has(slug)) continue;
    map.set(slug, {
      city,
      displayCity: capitalizeCity(city),
      slug,
      tesis: [],
      gezi: [],
      yemek: [],
      sosyal: [],
    });
  }
  for (const e of index) map.get(e.citySlug)?.tesis.push(e);
  for (const g of gezi) map.get(slugifyCity(g.il ?? ""))?.gezi.push(g);
  for (const y of yemek) map.get(slugifyCity(y.il ?? ""))?.yemek.push(y);
  for (const s of sosyal) map.get(slugifyCity(s.il ?? ""))?.sosyal.push(s);
  return map;
});

/** Bir ilin belirli kategorideki kayıt sayısı. */
export function categoryCount(
  bundle: CityBundle,
  def: { source: "tesis" | "sosyal" | "gezi" | "yemek"; kind?: FacilityKind }
): number {
  switch (def.source) {
    case "tesis":
      return bundle.tesis.filter((e) => e.kind === def.kind).length;
    case "sosyal":
      return bundle.sosyal.length;
    case "gezi":
      return bundle.gezi.length;
    case "yemek":
      return bundle.yemek.length;
  }
}

export function cityKindCounts(entries: { kind: FacilityKind }[]) {
  const c = { ogretmenevi: 0, polisevi: 0, orduevi: 0, misafirhane: 0 };
  for (const e of entries) c[e.kind] += 1;
  return c;
}
