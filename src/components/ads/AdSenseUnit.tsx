"use client";

import { useEffect, useRef, useState } from "react";
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

type FillState = "pending" | "filled" | "empty";

/** Dolmayan reklam alanı boş gri kutu bırakmasın diye tamamen kaldırılır. */
const FILL_TIMEOUT_MS = 5000;

export function AdSenseUnit({ variant = "banner", className }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);
  const [state, setState] = useState<FillState>("pending");

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      setState("empty");
      return;
    }

    const ins = insRef.current;
    if (!ins) return;

    const read = () => {
      const status = ins.getAttribute("data-ad-status");
      if (status === "filled") setState("filled");
      else if (status === "unfilled") setState("empty");
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(ins, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    const timer = window.setTimeout(() => {
      if (!ins.getAttribute("data-ad-status")) setState("empty");
    }, FILL_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  if (state === "empty") return null;

  const isFeed = variant === "inFeed";
  const isSidebar = variant === "sidebar";
  const filled = state === "filled";

  return (
    <aside
      className={cn(
        "w-full overflow-hidden",
        filled &&
          "rounded-2xl border border-slate-200/70 bg-slate-50/70 px-2 py-3 dark:border-slate-800 dark:bg-slate-900/50",
        filled && isSidebar && "rounded-xl px-1 py-2",
        className
      )}
      aria-label="Reklam"
    >
      {filled && (
        <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-widest text-slate-400">
          Reklam
        </p>
      )}
      <ins
        ref={insRef}
        className={cn(
          "adsbygoogle block w-full",
          isSidebar ? "min-h-[600px]" : "min-h-[100px]"
        )}
        style={{ display: "block" }}
        data-ad-client={ADSENSE.client}
        data-ad-slot={isFeed ? ADSENSE.slots.inFeed : ADSENSE.slots.banner}
        data-ad-format={isFeed ? "fluid" : "auto"}
        data-ad-layout-key={isFeed ? ADSENSE.inFeedLayoutKey : undefined}
        data-full-width-responsive={isSidebar ? "false" : "true"}
      />
    </aside>
  );
}
