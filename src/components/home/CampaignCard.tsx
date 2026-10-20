import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { campaignAccent, campaignSmartIcon } from "@/lib/campaignSmartIcon";
import type { Campaign } from "@/types";
import { cn } from "@/lib/utils";

export function formatCampaignDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function excerpt(text: string, max = 140) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function CampaignCard({
  campaign,
  featured = false,
  onOpen,
}: {
  campaign: Campaign;
  featured?: boolean;
  /** Derlemede sayfası olmayan yeni kampanyayı yerinde açar. */
  onOpen?: (campaign: Campaign) => void;
}) {
  const Icon = campaignSmartIcon(campaign.title, campaign.summary);
  const accent = campaignAccent(campaign.title, campaign.summary);
  const dateLabel = formatCampaignDate(campaign.createdAt);
  const className =
    "group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F62FE]/30 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900 sm:p-6";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: accent.bg, color: accent.icon }}
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
        {dateLabel && (
          <time className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {dateLabel}
          </time>
        )}
      </div>

      <h3
        className={cn(
          "mt-4 font-bold leading-snug text-slate-900 group-hover:text-[#0F62FE] dark:text-white",
          featured ? "text-lg" : "text-base"
        )}
      >
        {campaign.title}
      </h3>

      {campaign.organization && (
        <p className="mt-1.5 text-xs font-semibold text-[#0F62FE]">{campaign.organization}</p>
      )}

      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {excerpt(campaign.summary, featured ? 170 : 120)}
      </p>

      {campaign.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {campaign.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F62FE]">
        Kampanyayı oku
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </>
  );

  if (onOpen) {
    return (
      <button type="button" onClick={() => onOpen(campaign)} className={className}>
        {body}
      </button>
    );
  }

  return (
    <Link href={`/kampanyalar/${campaign.slug}/`} className={className}>
      {body}
    </Link>
  );
}

export function CampaignGrid({
  campaigns,
  onOpen,
}: {
  campaigns: Campaign[];
  onOpen?: (campaign: Campaign) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => (
        <CampaignCard key={c.slug} campaign={c} featured onOpen={onOpen} />
      ))}
    </div>
  );
}
