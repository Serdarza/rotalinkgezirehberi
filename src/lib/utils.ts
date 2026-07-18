export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const TR_MAP: Record<string, string> = {
  ç: "c", Ç: "c",
  ğ: "g", Ğ: "g",
  ı: "i", I: "i", İ: "i",
  ö: "o", Ö: "o",
  ş: "s", Ş: "s",
  ü: "u", Ü: "u",
};

export function slugifyCity(city: string): string {
  return city
    .trim()
    // Türkçe karakterleri toLowerCase'den ÖNCE dönüştür ("İ".toLowerCase()
    // görünmez birleşik nokta (U+0307) üretir ve URL eşleşmesini bozar)
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (c) => TR_MAP[c] ?? c)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cityFromSlug(slug: string, cities: string[]): string | null {
  const normalized = slug.toLowerCase();
  return (
    cities.find((c) => slugifyCity(c) === normalized) ??
    cities.find((c) => c.toLowerCase() === normalized) ??
    null
  );
}

export function capitalizeCity(city: string): string {
  if (!city) return city;
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
}

export function phoneHref(phone?: string): string {
  const d = String(phone ?? "").replace(/[^0-9+]/g, "");
  return d ? `tel:${d}` : "";
}
