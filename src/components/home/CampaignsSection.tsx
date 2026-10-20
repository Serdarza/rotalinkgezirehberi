import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";
import { LiveCampaignGrid } from "@/components/home/LiveCampaigns";
import type { Campaign } from "@/types";

export { CampaignCard, CampaignGrid, formatCampaignDate } from "@/components/home/CampaignCard";

/** Ana sayfa — güncel kamu personeli kampanyaları. */
export function CampaignsSection({
  campaigns,
  knownSlugs,
}: {
  campaigns: Campaign[];
  knownSlugs: string[];
}) {
  if (!campaigns.length) return null;

  return (
    <Section
      id="kampanyalar"
      className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950"
    >
      <Container>
        <SectionHeading
          eyebrow="Kampanyalar"
          title="Kamu personeline özel güncel kampanyalar"
          description="Öğretmen, TSK, emniyet, jandarma ve kamu çalışanlarına sunulan indirim ve protokol fırsatları. Başlığa dokunarak kampanyanın tüm detaylarını sitemizde okuyabilirsiniz."
        />

        <LiveCampaignGrid initial={campaigns} knownSlugs={knownSlugs} limit={6} />

        <SourceDisclaimer className="mt-8" />

        <div className="mt-8 text-center">
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
