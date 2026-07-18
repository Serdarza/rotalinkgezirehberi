import { readFile } from "fs/promises";
import path from "path";
import { cache } from "react";
import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";
import { FACILITY_CATEGORIES } from "@/config/site";

/** Tek kaynak: uygulama master veritabanı */
const MASTER_DB_PATH = path.join(process.cwd(), "data", "master_database.json");

type MasterDatabase = {
  tesisler: Tesis[];
  geziler: GeziYeri[];
  yemekler: YemekMekani[];
  sosyal: SosyalTesis[];
};

const loadMasterDatabase = cache(async (): Promise<MasterDatabase> => {
  try {
    const raw = await readFile(MASTER_DB_PATH, "utf-8");
    const data = JSON.parse(raw) as Partial<MasterDatabase>;
    return {
      tesisler: Array.isArray(data.tesisler) ? data.tesisler : [],
      geziler: Array.isArray(data.geziler) ? data.geziler : [],
      yemekler: Array.isArray(data.yemekler) ? data.yemekler : [],
      sosyal: Array.isArray(data.sosyal) ? data.sosyal : [],
    };
  } catch {
    return { tesisler: [], geziler: [], yemekler: [], sosyal: [] };
  }
});

export const getTesisData = cache(async (): Promise<Tesis[]> => {
  const db = await loadMasterDatabase();
  return db.tesisler;
});

export const getGeziData = cache(async (): Promise<GeziYeri[]> => {
  const db = await loadMasterDatabase();
  return db.geziler;
});

export const getYemekData = cache(async (): Promise<YemekMekani[]> => {
  const db = await loadMasterDatabase();
  return db.yemekler;
});

export const getSosyalData = cache(async (): Promise<SosyalTesis[]> => {
  const db = await loadMasterDatabase();
  return db.sosyal;
});

export const getAllData = cache(async () => {
  const db = await loadMasterDatabase();
  const { tesisler: tesis, geziler: gezi, yemekler: yemek, sosyal } = db;

  const citySet = new Set<string>();
  [...tesis, ...gezi, ...yemek, ...sosyal].forEach((item) => {
    if (item.il) citySet.add(item.il.trim());
  });
  const cities = [...citySet].sort((a, b) => a.localeCompare(b, "tr"));

  return { tesis, gezi, yemek, sosyal, cities };
});

export const getSiteStats = cache(async () => {
  const { tesis, gezi, cities } = await getAllData();
  return {
    cityCount: cities.length || 81,
    facilityCount: tesis.length,
    geziCount: gezi.length,
    monthlyUsers: "100.000+",
  };
});

export async function getFacilitiesByCity(city: string) {
  const { tesis, gezi, yemek, sosyal } = await getAllData();
  const match = (il?: string) =>
    (il ?? "").toLocaleLowerCase("tr") === city.toLocaleLowerCase("tr");
  return {
    tesis: tesis.filter((t) => match(t.il)),
    gezi: gezi.filter((g) => match(g.il)),
    yemek: yemek.filter((y) => match(y.il)),
    sosyal: sosyal.filter((s) => match(s.il)),
  };
}

export async function getFeaturedFacilities(limit = 8) {
  const tesis = await getTesisData();
  return tesis.slice(0, limit);
}

export async function getFacilitiesByCategory(
  tips: readonly string[],
  limit = 6
) {
  const tesis = await getTesisData();
  return tesis.filter((t) => tips.includes(t.tip)).slice(0, limit);
}

export function getCategoryTips(key: string) {
  return FACILITY_CATEGORIES.find((c) => c.key === key)?.tips ?? [];
}
