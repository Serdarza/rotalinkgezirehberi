"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AdSenseUnit } from "./AdSenseUnit";
import { cn } from "@/lib/utils";

type Props = {
  storageKey: string;
  className?: string;
};

/**
 * Şehir sonuç sayfasında altta sabit, kapatılabilir reklam bandı.
 * Popup’a göre daha az müdahaleci; AdSense için daha güvenli.
 */
export function StickyAdBanner({ storageKey, className }: Props) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey)) return;

    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
  }

  if (!mounted || !visible) return null;

  return (
    <>
      {/* Sticky bar içerik altına çakışmasın — mobilde alt nav yüksekliği dahil */}
      <div className="h-[112px] sm:h-[120px] md:h-[112px]" aria-hidden />
      <div className="h-16 md:hidden" aria-hidden />

      <div
        className={cn(
          "fixed inset-x-0 bottom-16 z-[70] border-t border-slate-200/80 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 md:bottom-0",
          "pb-[env(safe-area-inset-bottom)] md:pb-[env(safe-area-inset-bottom)]",
          className
        )}
        role="complementary"
        aria-label="Reklam bandı"
      >
        <div className="mx-auto flex max-w-5xl items-start gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="min-w-0 flex-1">
            <AdSenseUnit
              variant="banner"
              className="rounded-xl border-slate-200/60 bg-transparent p-0 dark:border-slate-800 dark:bg-transparent"
            />
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="mt-1 shrink-0 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Reklamı kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
