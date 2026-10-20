"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPinned, Search, X } from "lucide-react";
import { StorePromoActions } from "@/components/layout/StorePromoActions";
import {
  dismissDownloadPrompt,
  markAppDownloadClicked,
  shouldShowDownloadPrompt,
} from "@/lib/downloadPrompt";

export function SearchAppPromo({ city }: { city: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldShowDownloadPrompt()) return;
    const timer = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, [city]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function dismiss() {
    dismissDownloadPrompt();
    setOpen(false);
  }

  function onStoreClick() {
    markAppDownloadClicked();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <>
    {/* Telefon: içeriği kapatmayan alt şerit (Google "müdahaleci geçiş" politikası). */}
    <div
      className="fixed inset-x-0 bottom-16 z-[60] px-3 sm:hidden"
      role="complementary"
      aria-label="Uygulama önerisi"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <Image
          src="/logo.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {city} rehberi uygulamada
          </p>
          <p className="truncate text-xs text-slate-500">Harita, telefon ve yol tarifi</p>
        </div>
        <a
          href="/indir/"
          onClick={onStoreClick}
          className="shrink-0 rounded-xl bg-[#0F62FE] px-3.5 py-2 text-xs font-semibold text-white"
        >
          İndir
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
    <div
      className="fixed inset-0 z-[100] hidden items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-app-promo-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative bg-gradient-to-br from-[#0F62FE] via-blue-600 to-[#14B8A6] px-6 pb-7 pt-9 text-center text-white">
          <button
            type="button"
            onClick={dismiss}
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

          <StorePromoActions onStoreClick={onStoreClick} />

          <button
            type="button"
            onClick={dismiss}
            className="w-full rounded-xl py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            Sonuçlarda devam et
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
