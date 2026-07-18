export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i",
};

export function slugifyCity(city: string): string {
  return city
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (c) => TR_MAP[c] ?? c)
    .replace(/\s+/g, "-");
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
