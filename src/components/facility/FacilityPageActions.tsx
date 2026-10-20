"use client";

import { MapPin, Phone } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { FacilityPriceBox } from "@/components/facility/FacilityPriceBox";
import { ShareButton } from "@/components/share/ShareButton";
import { facilityActionPath, handleFacilityContact } from "@/lib/facilityContact";
import { slugifyCity } from "@/lib/utils";

type Props = {
  isim: string;
  il: string;
  tip: string;
  telefon?: string;
  /** Sayfanın kendi yolu (paylaşım için) */
  path: string;
};

/** Tesis sayfasındaki etkileşimli butonlar (iletişim, konum, favori, paylaş). */
export function FacilityPageActions({ isim, il, tip, telefon, path }: Props) {
  return (
    <div>
      <FacilityPriceBox />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleFacilityContact(telefon, { il, isim })}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d9488]"
        >
          <Phone className="h-4 w-4" aria-hidden /> İletişim
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${isim} ${il}`)}`}
          data-rl-path={facilityActionPath(il, isim, "konum")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
        >
          <MapPin className="h-4 w-4" aria-hidden /> Konum
        </a>
        <FavoriteButton facility={{ isim, tip, il }} />
        <ShareButton
          compact
          title={isim}
          text={`${isim} (${il}) — Rotalink`}
          path={path || `/tesis/${slugifyCity(il)}/${slugifyCity(isim)}/`}
        />
      </div>
    </div>
  );
}
