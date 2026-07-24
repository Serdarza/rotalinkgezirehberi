/** Flutter `normalizeForSearch` ile aynı — Türkçe karakter + boşluksuz. */
export function normalizeForSearch(value: string): string {
  return String(value ?? "")
    .replaceAll("ç", "c")
    .replaceAll("Ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("Ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("İ", "i")
    .replaceAll("ö", "o")
    .replaceAll("Ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("Ş", "s")
    .replaceAll("ü", "u")
    .replaceAll("Ü", "u")
    .toLowerCase()
    .replaceAll(" ", "");
}

export function facilityMatchKey(il: string, isim: string): string {
  return `${normalizeForSearch(il)}\u0001${normalizeForSearch(isim)}`;
}
