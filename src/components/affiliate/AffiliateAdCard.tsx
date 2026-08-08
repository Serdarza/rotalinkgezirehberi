"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Tag } from "lucide-react";
import {
  getAffiliateAds,
  pickAffiliateAdStable,
  type AffiliateAd,
} from "@/lib/affiliateAdsRepo";
import { cn } from "@/lib/utils";

type Variant = "rail" | "feed" | "sheet" | "popup";

type Props = {
  slot: string;
  variant?: Variant;
  className?: string;
  /** Sabit seçim için ek tuz (liste indexi vb.). */
  salt?: number;
};

function useAd(slot: string, salt: number) {
  const [ad, setAd] = useState<AffiliateAd | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getAffiliateAds().then((ads) => {
      if (cancelled) return;
      setAd(pickAffiliateAdStable(ads, slot, salt));
    });
    return () => {
      cancelled = true;
    };
  }, [slot, salt]);

  return ad;
}

export function AffiliateAdCard({
  slot,
  variant = "feed",
  className,
  salt = 0,
}: Props) {
  const ad = useAd(slot, salt);
  if (!ad) return null;

  const isRail = variant === "rail";
  const isSheet = variant === "sheet";
  const isPopup = variant === "popup";

  return (
    <a
      href={ad.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={cn(
        "group block overflow-hidden border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-amber-900/40 dark:from-amber-950/30 dark:to-slate-900",
        isRail && "rounded-2xl",
        isSheet && "rounded-2xl",
        isPopup && "rounded-3xl",
        !isRail && !isSheet && !isPopup && "rounded-3xl",
        className
      )}
    >
      <div className={cn("flex gap-3", isRail ? "flex-col p-3" : "p-3 sm:p-4")}>
        {ad.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.imageUrl}
            alt=""
            className={cn(
              "shrink-0 rounded-xl object-cover bg-slate-100 dark:bg-slate-800",
              isRail ? "h-28 w-full" : "h-20 w-20 sm:h-24 sm:w-24"
            )}
            loading="lazy"
          />
        ) : (
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
              isRail ? "h-28 w-full" : "h-20 w-20 sm:h-24 sm:w-24"
            )}
            aria-hidden
          >
            <Tag className="h-7 w-7" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/80 dark:text-amber-400/80">
            Sponsorlu
          </p>
          <p
            className={cn(
              "mt-1 font-bold leading-snug text-slate-900 group-hover:text-[#0F62FE] dark:text-white",
              isRail ? "text-sm line-clamp-3" : "text-sm sm:text-base line-clamp-2"
            )}
          >
            {ad.title}
          </p>
          {ad.subtitle && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
              {ad.subtitle}
            </p>
          )}
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0F62FE]">
            İncele
            <ExternalLink className="h-3 w-3" aria-hidden />
          </span>
        </div>
      </div>
    </a>
  );
}

/** Liste / bölüm aralarına yatay sponsor bandı. */
export function AffiliateInFeed({
  slot,
  salt = 0,
  className,
}: {
  slot: string;
  salt?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} role="complementary" aria-label="Sponsorlu içerik">
      <AffiliateAdCard slot={slot} variant="feed" salt={salt} />
    </div>
  );
}
