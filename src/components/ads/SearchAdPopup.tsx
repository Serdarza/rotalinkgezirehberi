"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";

type Props = {
  city: string;
};

/**
 * İl araması sonuç sayfası açılınca bir kez gösterilen,
 * kapatılabilir popup reklam.
 */
export function SearchAdPopup({ city }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = `rotalink_search_ad_${city}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key)) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(key, "1");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [city]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Reklam"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Reklam
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Reklamı kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-4">
          <AdSenseUnit variant="banner" className="border-0 bg-transparent p-0 dark:bg-transparent" />
        </div>

        <div className="border-t border-slate-100 px-5 py-3 text-center dark:border-slate-800">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-[#0F62FE] hover:underline"
          >
            Kapat ve sonuçlara dön
          </button>
        </div>
      </div>
    </div>
  );
}
