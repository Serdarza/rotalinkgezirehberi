"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { CREDITS_PER_REWARD } from "@/lib/priceUnlockStore";

const MIN_WATCH_SECONDS = 5;

type Props = {
  open: boolean;
  facilityName: string;
  onClose: () => void;
  onUnlocked: () => void;
};

/** İndirmiş kullanıcı için fiyat açma reklamı (AdSense + kısa bekleme). */
export function PriceUnlockAdModal({
  open,
  facilityName,
  onClose,
  onUnlocked,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(MIN_WATCH_SECONDS);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(MIN_WATCH_SECONDS);
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const ready = secondsLeft <= 0;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-unlock-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2
              id="price-unlock-title"
              className="text-base font-bold text-slate-900 dark:text-white"
            >
              Fiyat bilgisini aç
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {facilityName} — kısa bir reklam sonrası {CREDITS_PER_REWARD} tesis
              hakkı kazanırsınız.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <AdSenseUnit variant="banner" />

          <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            {ready
              ? "Reklam tamam — fiyatları açabilirsiniz."
              : `Lütfen ${secondsLeft} sn bekleyin…`}
          </p>

          <button
            type="button"
            disabled={!ready}
            onClick={onUnlocked}
            className="w-full rounded-2xl bg-[#0F62FE] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ready ? "Fiyatları aç" : `Bekleyin (${secondsLeft})`}
          </button>
        </div>
      </div>
    </div>
  );
}
