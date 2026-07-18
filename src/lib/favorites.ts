export type FavoriteFacility = {
  isim: string;
  tip: string;
  il: string;
};

const STORAGE_KEY = "rotalink_favorites_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getFavorites(): FavoriteFacility[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteFacility[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function favoriteKey(item: Pick<FavoriteFacility, "isim" | "il">) {
  return `${item.isim}::${item.il}`.toLocaleLowerCase("tr");
}

export function isFavorite(item: Pick<FavoriteFacility, "isim" | "il">) {
  const key = favoriteKey(item);
  return getFavorites().some((f) => favoriteKey(f) === key);
}

export function toggleFavorite(item: FavoriteFacility): FavoriteFacility[] {
  const current = getFavorites();
  const key = favoriteKey(item);
  const exists = current.some((f) => favoriteKey(f) === key);
  const next = exists
    ? current.filter((f) => favoriteKey(f) !== key)
    : [item, ...current];
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("rotalink-favorites"));
  }
  return next;
}

export function favoritesCount() {
  return getFavorites().length;
}
