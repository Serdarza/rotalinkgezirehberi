import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { PageHero, Breadcrumb } from "@/components/layout/PageHeader";
import { CampaignGrid } from "@/components/home/CampaignsSection";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { getCampaigns } from "@/lib/kampanyaRepo";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Kampanyalar — Kamu Personeline Özel İndirimler",
  description:
    "Öğretmen, TSK, emniyet, jandarma ve kamu çalışanlarına özel güncel indirim ve kampanyalar. Kampanya detaylarını Rotalink'te okuyun.",
  openGraph: {
    title: "Kampanyalar — Kamu Personeline Özel İndirimler | Rotalink",
    description:
      "Kamu personeline özel indirimler, protokoller ve fırsatlar tek sayfada.",
    url: `${SITE.url}/kampanyalar`,
  },
};

export default async function KampanyalarPage() {
  const campaigns = await getCampaigns();

  return (
    <>
      <PageHero
        title="Kampanyalar"
        description="Kamu personeline özel güncel indirimler, protokoller ve fırsatlar. Her kampanyanın tüm koşullarını sitemizde okuyabilirsiniz."
      />
      <Container className="max-w-6xl py-10 sm:py-14">
        <Breadcrumb
          items={[{ label: "Anasayfa", href: "/" }, { label: "Kampanyalar" }]}
        />

        <article className="mb-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Kamu çalışanlarına özel kampanyalar nedir?
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Türkiye’de birçok kurum; öğretmenler, Türk Silahlı Kuvvetleri,
            emniyet ve jandarma mensupları, infaz koruma memurları ve diğer kamu
            personeli için{" "}
            <strong className="font-semibold text-slate-800 dark:text-slate-100">
              protokollü indirim ve avantaj programları
            </strong>{" "}
            yürütür. Bu fırsatlar; ulaşım, araç kiralama, iletişim, giyim,
            konaklama ve market alışverişi gibi geniş bir alanı kapsar.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Rotalink bu kampanyaları tek listede toplar; kampanya başlığına
            dokunduğunuzda indirim oranı, kapsam, geçerlilik ve yararlanma
            koşullarını sitemizde okuyabilir, ardından kurumun resmi sayfasına
            geçebilirsiniz.
          </p>
          <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              Öğretmen ve MEB personeline özel tarifeler
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              TSK, emniyet ve jandarma indirimleri
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              Araç kiralama, kargo ve ulaşım fırsatları
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              Alışveriş ve kurumsal protokol avantajları
            </li>
          </ul>
        </article>

        <AdSenseUnit variant="banner" className="mb-8" />

        {campaigns.length ? (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Güncel kampanyalar
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {campaigns.length} kampanya · en yeniden eskiye
                </p>
              </div>
              <Link
                href="/indir"
                className="text-sm font-semibold text-[#0F62FE] hover:underline"
              >
                Uygulamada takip et →
              </Link>
            </div>

            <CampaignGrid campaigns={campaigns} />
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Şu an listelenecek kampanya yok
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Yeni fırsatlar eklendiğinde burada görünecek.
            </p>
          </div>
        )}

        <SourceDisclaimer className="mt-10" />
      </Container>
    </>
  );
}
