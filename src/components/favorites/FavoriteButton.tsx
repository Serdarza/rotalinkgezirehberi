"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { isFavorite, toggleFavorite, type FavoriteFacility } from "@/lib/favorites";
import { cn } from "@/lib/utils";

type Props = {
  facility: FavoriteFacility;
  className?: string;
  compact?: boolean;
};

export function FavoriteButton({ facility, className, compact = true }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isFavorite(facility));
    const sync = () => setActive(isFavorite(facility));
    window.addEventListener("rotalink-favorites", sync);
    return () => window.removeEventListener("rotalink-favorites", sync);
  }, [facility]);

  return (
    <button
      type="button"
      onClick={() => {
        toggleFavorite(facility);
        setActive(isFavorite(facility));
      }}
      aria-pressed={active}
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition",
        compact
          ? "bg-white p-2 text-slate-600 ring-1 ring-slate-200 hover:bg-rose-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
          : "gap-1.5 px-3 py-2 text-xs font-semibold",
        active && "text-rose-600 ring-rose-200 dark:text-rose-400",
        className
      )}
    >
      <Heart className={cn("h-3.5 w-3.5", active && "fill-current")} aria-hidden />
      {!compact && (active ? "Favoride" : "Favori")}
    </button>
  );
}
