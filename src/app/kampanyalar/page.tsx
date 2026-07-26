import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { PageHero, Breadcrumb } from "@/components/layout/PageHeader";
import { CampaignCard } from "@/components/home/CampaignsSection";
import { getCampaigns } from "@/lib/kampanyaRepo";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Keşfet — Kamu Personeli Kampanyaları",
  description:
    "Öğretmen, TSK, emniyet ve kamu çalışanlarına özel güncel indirim ve kampanyalar. Rotalink Keşfet ile resmi fırsatları takip edin.",
  openGraph: {
    title: "Keşfet — Kamu Personeli Kampanyaları | Rotalink",
    description:
      "Mobil uygulamadaki Keşfet kampanyaları web’de: kamu personeline özel indirimler ve fırsatlar.",
    url: `${SITE.url}/kampanyalar`,
  },
};

export default async function KampanyalarPage() {
  const campaigns = await getCampaigns();

  return (
    <>
      <PageHero
        title="Keşfet — Kampanyalar"
        description="Kamu personeline özel güncel indirimler, protokoller ve fırsatlar. Mobil Rotalink uygulamasındaki Keşfet içeriğinin web karşılığı."
      />
      <Container className="max-w-6xl py-10 sm:py-14">
        <Breadcrumb
          items={[
            { label: "Anasayfa", href: "/" },
            { label: "Kampanyalar" },
          ]}
        />

        <article className="mb-10 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F62FE] text-white">
              <Megaphone className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Bu sayfa ne işe yarar?
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Rotalink Keşfet; öğretmenler, TSK ve emniyet mensupları, jandarma,
            kamu kurumları personeli ile ailelerine sunulan{" "}
            <strong className="font-semibold text-slate-800 dark:text-slate-100">
              resmi veya protokol kaynaklı kampanyaları
            </strong>{" "}
            tek yerde toplar. Konaklama ararken aynı anda indirimli ulaşım,
            iletişim, alışveriş ve hizmet fırsatlarını da görebilirsiniz.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Listelenen başlıklar mobil uygulamadaki Keşfet bölümüyle aynı
            kaynaktan gelir. Kampanya şartları, süreleri ve kimlik ibrazı
            koşulları ilgili kuruma aittir; Rotalink bilgilendirme amaçlı
            derleme yapar. Güncel koşullar için her karttaki resmi bağlantıyı
            kontrol edin.
          </p>
          <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              Öğretmen ve MEB personeline özel tarifeler
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              TSK, emniyet ve jandarma indirimleri
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              Araç kiralama ve ulaşım kampanyaları
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              Alışveriş ve kurumsal protokol fırsatları
            </li>
          </ul>
        </article>

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
                Uygulamada Keşfet →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
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

        <p className="mt-10 text-center text-xs leading-relaxed text-slate-400">
          Bilgiler bilgilendirme amaçlıdır. Kampanya koşulları, geçerlilik
          tarihleri ve yararlanma şartları kampanyayı sunan kuruma aittir.
        </p>
      </Container>
    </>
  );
}
