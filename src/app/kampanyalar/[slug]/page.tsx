import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, Building2 } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/layout/PageHeader";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { InArticleAd } from "@/components/ads/InArticleAd";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";
import {
  CampaignCard,
  formatCampaignDate,
} from "@/components/home/CampaignsSection";
import {
  getCampaignBySlug,
  getCampaigns,
  getRelatedCampaigns,
} from "@/lib/kampanyaRepo";
import { campaignAccent, campaignSmartIcon } from "@/lib/campaignSmartIcon";
import { SITE } from "@/config/site";

export async function generateStaticParams() {
  const campaigns = await getCampaigns();
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return {};

  const description = campaign.summary
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);

  return {
    title: campaign.title,
    description,
    openGraph: {
      title: `${campaign.title} | Rotalink Kampanyalar`,
      description,
      url: `${SITE.url}/kampanyalar/${campaign.slug}`,
      type: "article",
    },
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  const related = await getRelatedCampaigns(slug, 3);
  const Icon = campaignSmartIcon(campaign.title, campaign.summary);
  const accent = campaignAccent(campaign.title, campaign.summary);
  const dateLabel = formatCampaignDate(campaign.createdAt);

  /** Uzun madde listelerinde okumayı bölmeden reklam yerleştir. */
  const adAfter = campaign.paragraphs.length > 6 ? 4 : 0;

  return (
    <Container className="max-w-3xl py-8 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: "Kampanyalar", href: "/kampanyalar" },
          { label: campaign.title },
        ]}
      />

      <header className="mb-6">
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: accent.bg, color: accent.icon }}
            aria-hidden
          >
            <Icon className="h-6 w-6" strokeWidth={2.25} />
          </span>
          {campaign.organization && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F62FE]/10 px-3 py-1 text-xs font-bold text-[#0F62FE]">
              <Building2 className="h-3.5 w-3.5" aria-hidden />
              {campaign.organization}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-3xl">
          {campaign.title}
        </h1>

        {dateLabel && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" aria-hidden />
            Yayın tarihi: {dateLabel}
          </p>
        )}

        {campaign.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {campaign.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <AdSenseUnit variant="banner" className="mb-8" />

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Kampanya detayları
        </h2>
        <div className="space-y-3">
          {campaign.paragraphs.map((line, index) => (
            <Fragment key={`${index}-${line.slice(0, 24)}`}>
              <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 sm:text-base">
                {line}
              </p>
              {adAfter > 0 && index + 1 === adAfter && (
                <InArticleAd className="my-6" />
              )}
            </Fragment>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Nasıl yararlanılır?
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <li>
            Kampanya, ilgili kurum personeline yöneliktir; yararlanmak için
            genellikle <strong>kurum kimlik kartı</strong> ibrazı istenir.
          </li>
          <li>
            İndirim oranı, geçerlilik süresi ve kapsam kampanyayı sunan
            firmaya göre değişebilir.
          </li>
          <li>
            Başvuru ve güncel koşullar için aşağıdaki resmi bağlantıyı
            kullanın.
          </li>
        </ul>

        {campaign.linkUrl && (
          <a
            href={campaign.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#0043ce]"
          >
            Resmi kampanya sayfasına git
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </section>

      <SourceDisclaimer className="mt-8" />

      <AdSenseUnit variant="banner" className="mt-8" />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
            Diğer kampanyalar
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((c) => (
              <CampaignCard key={c.slug} campaign={c} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link
          href="/kampanyalar"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F62FE] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Tüm kampanyalar
        </Link>
      </div>
    </Container>
  );
}
