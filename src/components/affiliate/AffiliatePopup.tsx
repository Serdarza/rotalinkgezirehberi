"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AffiliateAdCard } from "./AffiliateAdCard";
import { getAffiliateAds } from "@/lib/affiliateAdsRepo";

const SEEN_KEY = "rl_aff_popup_seen";
const COOLDOWN_MS = 1000 * 60 * 60 * 24; // 24 saat

export function AffiliatePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    void getAffiliateAds().then((ads) => {
      if (cancelled || !ads.length) return;
      try {
        const raw = localStorage.getItem(SEEN_KEY);
        if (raw) {
          const t = Number(raw);
          if (Number.isFinite(t) && Date.now() - t < COOLDOWN_MS) return;
        }
      } catch {
        /* ignore */
      }

      // ~%40 olasılık + gecikme — her ziyarette zorla açılmaz
      if (Math.random() > 0.4) return;

      timer = window.setTimeout(() => {
        if (!cancelled) setOpen(true);
      }, 12000);
    });

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Sponsorlu kampanya"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg hover:bg-slate-100 dark:bg-slate-800 dark:text-white"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>
        <AffiliateAdCard slot="popup" variant="popup" className="shadow-2xl" />
      </div>
    </div>
  );
}
