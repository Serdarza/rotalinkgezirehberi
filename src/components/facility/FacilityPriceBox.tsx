"use client";

import { Lock, Smartphone } from "lucide-react";
import { openAppOrStore } from "@/lib/facilityContact";

type Props = {
  className?: string;
};

/** Fiyatlar yalnızca uygulamada gösterilir; buton uygulamayı açar veya mağazaya yönlendirir. */
export function FacilityPriceBox({ className }: Props) {
  return (
    <div
      className={`mb-4 rounded-2xl bg-slate-50 px-3 py-3 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
    >
      <div className="mb-2.5 flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0F62FE]/10 text-[#0F62FE]">
          <Lock className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-bold text-slate-800 dark:text-slate-100">Fiyat bilgisi</p>
          <p className="mt-0.5 leading-relaxed text-slate-500 dark:text-slate-400">
            Güncel konaklama ücretleri Rotalink uygulamasında.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={openAppOrStore}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F62FE] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0043ce]"
      >
        <Smartphone className="h-3.5 w-3.5" aria-hidden />
        Fiyatları göster
      </button>
    </div>
  );
}
