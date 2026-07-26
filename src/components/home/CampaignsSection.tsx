import Link from "next/link";
import { ExternalLink, ArrowRight, Megaphone } from "lucide-react";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/ui/Section";
import {
  campaignAccent,
  campaignSmartIcon,
} from "@/lib/campaignSmartIcon";
import type { Campaign } from "@/types";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null) {
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
}: {
  campaign: Campaign;
  featured?: boolean;
}) {
  const Icon = campaignSmartIcon(campaign.title, campaign.summary);
  const accent = campaignAccent(campaign.title, campaign.summary);
  const dateLabel = formatDate(campaign.createdAt);
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
          "mt-4 font-bold leading-snug text-slate-900 dark:text-white",
          featured ? "text-lg sm:text-xl" : "text-base"
        )}
      >
        {campaign.title}
      </h3>
      {campaign.organization && (
        <p className="mt-1.5 text-xs font-semibold text-[#0F62FE]">
          {campaign.organization}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {excerpt(campaign.summary, featured ? 180 : 120)}
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
        Detayları gör
        {campaign.linkUrl ? (
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        )}
      </span>
    </>
  );

  const className = cn(
    "group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F62FE]/30 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900",
    featured && "sm:p-6"
  );

  if (campaign.linkUrl) {
    return (
      <a
        href={campaign.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    );
  }

  return <article className={className}>{body}</article>;
}

/** Ana sayfa — mobil Keşfet kampanyaları (GitHub kampanya.json). */
export function CampaignsSection({ campaigns }: { campaigns: Campaign[] }) {
  if (!campaigns.length) return null;

  return (
    <Section id="kampanyalar" className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <Container>
        <SectionHeading
          eyebrow="Keşfet"
          title="Güncel kamu personeli kampanyaları"
          description="Öğretmen, TSK, emniyet ve kamu çalışanlarına özel indirim ve fırsatları Rotalink Keşfet’ten takip edin. Bilgiler resmi kurum ve iş ortaklarından derlenir."
        />

        <div className="mb-8 rounded-3xl border border-[#0F62FE]/15 bg-[#0F62FE]/5 px-5 py-4 dark:border-[#0F62FE]/25 dark:bg-[#0F62FE]/10 sm:px-6">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F62FE] text-white">
              <Megaphone className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Mobil uygulamadaki Keşfet içerikleri burada
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Kampanya koşulları sağlayıcıya aittir; güncel şartlar için her
                fırsatın resmi sayfasını kontrol edin. Rotalink yalnızca
                bilgilendirme amaçlı derleme sunar.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} featured />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/kampanyalar"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#0043ce]"
          >
            Tüm kampanyaları gör
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
