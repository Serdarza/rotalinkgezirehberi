"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, MapPinned, Search, X } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/downloads";

export function SearchAppPromo({ city }: { city: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, [city]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-app-promo-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative bg-gradient-to-br from-[#0F62FE] via-blue-600 to-[#14B8A6] px-6 pb-7 pt-9 text-center text-white">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 transition hover:bg-white/25"
            aria-label="Tanıtımı kapat"
          >
            <X className="h-5 w-5" />
          </button>

          <Image
            src="/logo.png"
            alt="Rotalink"
            width={72}
            height={72}
            className="mx-auto mb-4 h-[72px] w-[72px] rounded-full object-cover shadow-xl"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Aramanızı cebinize taşıyın
          </p>
          <h2 id="search-app-promo-title" className="mt-2 text-2xl font-extrabold">
            {city} rehberi Rotalink uygulamasında
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            Tesisleri, haritaları ve iletişim bilgilerini uygulamada daha hızlı keşfedin.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
              <MapPinned className="h-4 w-4 text-[#14B8A6]" />
              Haritalı keşif
            </span>
            <span className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
              <Search className="h-4 w-4 text-[#0F62FE]" />
              Hızlı arama
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              <Download className="h-4 w-4" />
              Google Play
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#0F62FE] hover:text-[#0F62FE] dark:border-slate-700 dark:text-white"
            >
              <Download className="h-4 w-4" />
              App Store
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-xl py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            Sonuçlarda devam et
          </button>
        </div>
      </div>
    </div>
  );
}
