/**
 * Kategori bazlı varsayılan tesis görselleri.
 * Gerçek tesis fotoğrafları GitHub `tesisler_gorseller.json` üzerinden
 * `facilityImageRepo` + `useFacilityCardImage` ile gelir; eşleşme yoksa buraya düşer.
 */

export type FacilityImageKey = "orduevi" | "polisevi" | "ogretmenevi" | "misafirhane";

const IMAGE_BY_KEY: Record<FacilityImageKey, string> = {
  orduevi: "/facilities/orduevi.jpg",
  polisevi: "/facilities/polisevi.jpg",
  ogretmenevi: "/facilities/ogretmenevi.jpg",
  misafirhane: "/facilities/misafirhane.jpg",
};

export function getFacilityImageKey(tip: string | null | undefined): FacilityImageKey {
  const n = String(tip ?? "")
    .trim()
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (n.includes("orduevi")) return "orduevi";
  if (n.includes("polisevi")) return "polisevi";
  if (n.includes("ogretmenevi")) return "ogretmenevi";
  return "misafirhane";
}

export function getFacilityImageSrc(tip: string | null | undefined): string {
  return IMAGE_BY_KEY[getFacilityImageKey(tip)];
}
