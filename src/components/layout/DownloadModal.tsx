"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, MapPin, Phone, Search } from "lucide-react";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/downloads";

const STORAGE_KEY = "rotalink_download_modal_dismissed";

export function DownloadModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.includes("/indir")) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative bg-gradient-to-br from-[#0F62FE] to-[#14B8A6] px-6 pb-8 pt-10 text-center text-white">
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/30"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Image src="/logo.svg" alt="Rotalink" width={40} height={40} className="brightness-0 invert" />
          </div>
          <h2 id="download-modal-title" className="text-2xl font-extrabold">
            Rotalink&apos;i İndirin
          </h2>
          <p className="mt-2 text-sm text-white/90">
            Kamu tesisleri ve gezi rehberi artık cebinizde
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="flex flex-wrap justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
              <MapPin className="h-3.5 w-3.5 text-[#0F62FE]" />
              Haritalı yol tarifi
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
              <Phone className="h-3.5 w-3.5 text-[#0F62FE]" />
              Telefon bilgileri
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
              <Search className="h-3.5 w-3.5 text-[#0F62FE]" />
              Hızlı arama
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Google Play&apos;den İndir
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-[#0F62FE] hover:text-[#0F62FE] dark:border-slate-700 dark:text-white"
            >
              App Store&apos;dan İndir
            </a>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="w-full rounded-xl py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            Şimdi değil
          </button>
        </div>
      </div>
    </div>
  );
}
