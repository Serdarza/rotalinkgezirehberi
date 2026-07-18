import { readFile } from "fs/promises";
import path from "path";
import { cache } from "react";
import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";
import { FACILITY_CATEGORIES } from "@/config/site";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

export const getTesisData = cache(async (): Promise<Tesis[]> => {
  try {
    return await readJson<Tesis[]>("data.json");
  } catch {
    return [];
  }
});

export const getGeziData = cache(async (): Promise<GeziYeri[]> => {
  try {
    return await readJson<GeziYeri[]>("gezi.json");
  } catch {
    return [];
  }
});

export const getYemekData = cache(async (): Promise<YemekMekani[]> => {
  try {
    return await readJson<YemekMekani[]>("yemek.json");
  } catch {
    return [];
  }
});

export const getSosyalData = cache(async (): Promise<SosyalTesis[]> => {
  try {
    return await readJson<SosyalTesis[]>("sosyal.json");
  } catch {
    return [];
  }
});

export const getAllData = cache(async () => {
  const [tesis, gezi, yemek, sosyal] = await Promise.all([
    getTesisData(),
    getGeziData(),
    getYemekData(),
    getSosyalData(),
  ]);
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
  return (
    FACILITY_CATEGORIES.find((c) => c.key === key)?.tips ?? []
  );
}
