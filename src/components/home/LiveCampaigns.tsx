"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, ExternalLink, X } from "lucide-react";
import { CampaignCard, formatCampaignDate } from "@/components/home/CampaignCard";
import { KAMPANYA_CLIENT_URLS, parseKampanyalar } from "@/lib/kampanyaShared";
import type { Campaign } from "@/types";

type Props = {
  initial: Campaign[];
  /** Bu derlemede sayfası üretilen kampanya adresleri. */
  knownSlugs: string[];
  limit?: number;
};

let clientLoad: Promise<Campaign[] | null> | null = null;

function loadLiveCampaigns(): Promise<Campaign[] | null> {
  clientLoad ??= (async () => {
    for (const url of KAMPANYA_CLIENT_URLS) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const parsed = parseKampanyalar(await res.json());
        if (parsed.length) return parsed;
      } catch {
        // sonraki kaynağı dene
      }
    }
    return null;
  })();
  return clientLoad;
}

export function LiveCampaignGrid({ initial, knownSlugs, limit }: Props) {
  const [campaigns, setCampaigns] = useState(initial);
  const [preview, setPreview] = useState<Campaign | null>(null);
  const known = useMemo(() => new Set(knownSlugs), [knownSlugs]);

  useEffect(() => {
    let cancelled = false;
    loadLiveCampaigns().then((parsed) => {
      if (!parsed || cancelled) return;
      setCampaigns(limit ? parsed.slice(0, limit) : parsed);
    });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const visible = limit ? campaigns.slice(0, limit) : campaigns;
  if (!visible.length) return null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((campaign) => (
          <CampaignCard
            key={campaign.slug}
            campaign={campaign}
            featured
            onOpen={known.has(campaign.slug) ? undefined : () => setPreview(campaign)}
          />
        ))}
      </div>
      {preview && <CampaignPreview campaign={preview} onClose={() => setPreview(null)} />}
    </>
  );
}

function CampaignPreview({
  campaign,
  onClose,
}: {
  campaign: Campaign;
  onClose: () => void;
}) {
  const dateLabel = formatCampaignDate(campaign.createdAt);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-preview-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {campaign.organization && (
              <p className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-[#0F62FE]">
                <Building2 className="h-3.5 w-3.5" aria-hidden />
                {campaign.organization}
              </p>
            )}
            <h2 id="campaign-preview-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
              {campaign.title}
            </h2>
            {dateLabel && <p className="mt-1 text-sm text-slate-500">{dateLabel}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          {campaign.paragraphs.map((line, index) => (
            <p
              key={`${index}-${line.slice(0, 24)}`}
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
            >
              {line}
            </p>
          ))}
        </div>
        {campaign.linkUrl && (
          <a
            href={campaign.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-3 text-sm font-semibold text-white"
          >
            Resmi kampanya sayfasına git
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}

export function LiveCampaignCount({
  initialCount,
}: {
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;
    loadLiveCampaigns().then((parsed) => {
      if (!parsed || cancelled) return;
      setCount(parsed.length);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <p className="mt-1 text-sm text-slate-500">{count} kampanya · en yeniden eskiye</p>
  );
}
