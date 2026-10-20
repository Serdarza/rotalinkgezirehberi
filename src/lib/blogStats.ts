import { cache } from "react";
import { getAllData } from "@/lib/data";
import { facilityKind } from "@/lib/facilities";
import { slugifyCity } from "@/lib/utils";

/** Blog yazılarındaki sayılar canlı veriden gelir (uydurma rakam yok). */
export type ArticleContext = {
  totalLodging: number;
  ogretmenevi: number;
  polisevi: number;
  orduevi: number;
  misafirhane: number;
  sosyal: number;
  cities: number;
  /** `tip` metninde anahtar kelime geçen tesis sayısı */
  countTip: (...keywords: string[]) => number;
};

export const getArticleContext = cache(async (): Promise<ArticleContext> => {
  const { tesis, sosyal } = await getAllData();
  const counts = { ogretmenevi: 0, polisevi: 0, orduevi: 0, misafirhane: 0 };
  const tips = tesis.map((t) => String(t.tip ?? "").toLocaleLowerCase("tr"));
  for (const t of tesis) counts[facilityKind(t.tip)] += 1;
  const cities = new Set(
    [...tesis, ...sosyal].map((x) => slugifyCity(x.il ?? "")).filter(Boolean)
  );
  return {
    totalLodging: tesis.length,
    ...counts,
    sosyal: sosyal.length,
    cities: cities.size,
    countTip: (...keywords) => {
      const ks = keywords.map((k) => k.toLocaleLowerCase("tr"));
      return tips.filter((t) => ks.some((k) => t.includes(k))).length;
    },
  };
});

export function formatCount(n: number): string {
  return n.toLocaleString("tr-TR");
}
