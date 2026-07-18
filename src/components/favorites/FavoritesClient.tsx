"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { FacilityCard } from "@/components/home/FacilitySections";
import { getFavorites, type FavoriteFacility } from "@/lib/favorites";
import { slugifyCity } from "@/lib/utils";
import type { Tesis } from "@/types";

export function FavoritesClient() {
  const [items, setItems] = useState<FavoriteFacility[]>([]);

  useEffect(() => {
    const sync = () => setItems(getFavorites());
    sync();
    window.addEventListener("rotalink-favorites", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("rotalink-favorites", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <Heart className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Henüz favori yok
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Beğendiğiniz tesislerin yanındaki kalp ikonuna dokunarak favorilerinize ekleyin.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/#ara"
            className="rounded-2xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Tesis ara
          </Link>
          <Link
            href="/indir"
            className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
          >
            Uygulamayı indir
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const facility = {
          isim: item.isim,
          tip: item.tip,
          il: item.il,
        } as Tesis;
        return (
          <div key={`${item.isim}-${item.il}`} className="relative">
            <FacilityCard facility={facility} />
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" aria-hidden />
              <Link
                href={`/sehir/${slugifyCity(item.il)}`}
                className="font-medium text-[#0F62FE] hover:underline"
              >
                {item.il} sayfasına git
              </Link>
            </p>
          </div>
        );
      })}
    </div>
  );
}
