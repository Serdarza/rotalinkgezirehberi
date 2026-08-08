"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AffiliateAdCard } from "./AffiliateAdCard";
import { getAffiliateAds } from "@/lib/affiliateAdsRepo";

const DISMISS_KEY = "rl_aff_sheet_dismiss";
const DISMISS_MS = 1000 * 60 * 60 * 6; // 6 saat

export function AffiliateBottomSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    void getAffiliateAds().then((ads) => {
      if (cancelled || !ads.length) return;
      try {
        const raw = sessionStorage.getItem(DISMISS_KEY);
        if (raw) {
          const t = Number(raw);
          if (Number.isFinite(t) && Date.now() - t < DISMISS_MS) return;
        }
      } catch {
        /* ignore */
      }
      timer = window.setTimeout(() => {
        if (!cancelled) setOpen(true);
      }, 4500);
    });

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
      role="dialog"
      aria-label="Sponsorlu öneri"
    >
      <div className="relative mx-auto max-w-lg shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute -right-1 -top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md hover:bg-slate-700"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>
        <AffiliateAdCard slot="bottom-sheet" variant="sheet" />
      </div>
    </div>
  );
}
