"use client";

import { useEffect, useRef } from "react";
import { ADSENSE } from "@/config/ads";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type Props = {
  variant?: "banner" | "inFeed" | "sidebar";
  className?: string;
};

export function AdSenseUnit({ variant = "banner", className }: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Reklam engelleyici veya henüz yüklenmemiş AdSense sayfayı etkilemesin.
    }
  }, []);

  const isFeed = variant === "inFeed";
  const isSidebar = variant === "sidebar";

  return (
    <aside
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/70 px-2 py-3 dark:border-slate-800 dark:bg-slate-900/50",
        isSidebar && "rounded-xl px-1 py-2",
        className
      )}
      aria-label="Reklam"
    >
      <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-widest text-slate-400">
        Reklam
      </p>
      <ins
        className={cn(
          "adsbygoogle block w-full",
          isSidebar ? "min-h-[600px]" : "min-h-[100px]"
        )}
        style={{ display: "block" }}
        data-ad-client={ADSENSE.client}
        data-ad-slot={isFeed ? ADSENSE.slots.inFeed : ADSENSE.slots.banner}
        data-ad-format={isFeed ? "fluid" : isSidebar ? "auto" : "auto"}
        data-ad-layout-key={isFeed ? ADSENSE.inFeedLayoutKey : undefined}
        data-full-width-responsive={isSidebar ? "false" : "true"}
      />
    </aside>
  );
}
