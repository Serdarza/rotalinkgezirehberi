import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/config/site";
import { getSiteStats } from "@/lib/data";

export const metadata = buildMetadata({
  title: "Hakkımızda",
  description:
    "Rotalink kimdir, verilerini nereden derler, nasıl günceller? Türkiye'nin kamu seyahat rehberi hakkında ayrıntılı bilgi.",
  path: "/hakkimizda",
});

export default async function HakkimizdaPage() {
  const stats = await getSiteStats();

  const numbers = [
    { value: stats.konaklamaCount, label: "Konaklama tesisi" },
    { value: stats.geziCount, label: "Gezi noktası" },
    { value: stats.yemekCount, label: "Yemek mekânı" },
    { value: stats.belediyeCount, label: "Belediye sosyal tesisi" },
  ];

  return (
    <>
      <PageHero
        title="Hakkımızda"
        description="Kamu tesislerini tek çatı altında toplayan bağımsız bir seyahat rehberi."
      />
      <Container className="max-w-3xl py-12 sm:py-16">
        <section className="space-y-4 text-slate-700 dark:text-slate-300">
          <p className="text-base leading-relaxed sm:text-lg">
            <strong className="font-semibold text-slate-900 dark:text-white">
              {SITE.name}
            </strong>
            , Türkiye genelindeki kamu misafirhaneleri, polisevleri,
            öğretmenevleri, orduevleri ve belediye sosyal tesislerini; gezilecek
            yerler ve yeme-içme noktalarıyla birlikte tek platformda sunan
            bağımsız bir dijital seyahat rehberidir.
          </p>
          <p className="text-sm leading-relaxed sm:text-base">
            Rotalink herhangi bir kamu kurumunun resmi yayın organı değildir,
            hiçbir kurumla bağlı çalışmaz ve rezervasyon aracılığı yapmaz.
            Amacımız kamu personelinin ve vatandaşların dağınık hâlde bulunan
            tesis bilgilerine tek yerden, hızlı ve ücretsiz şekilde
            ulaşabilmesidir.
          </p>
        </section>

        <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {numbers.map((n) => (
            <div
              key={n.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-xl font-extrabold text-[#0F62FE] sm:text-2xl">
                {n.value.toLocaleString("tr-TR")}+
              </p>
              <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-600 dark:text-slate-400 sm:text-xs">
                {n.label}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Verilerimizi nasıl derliyoruz?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Tesis adı, adres, telefon ve açıklama bilgileri; kurumların kendi
            resmi web siteleri, valilik ve belediye duyuruları, kamu kurumlarının
            yayınladığı tesis listeleri gibi herkese açık kaynaklardan derlenir.
            Derlenen kayıtlar il bazında gruplanır, tekrar eden kayıtlar
            temizlenir ve tesis türüne göre sınıflandırılır.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            <li className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F62FE]" aria-hidden />
              <span>
                <strong className="font-semibold text-slate-800 dark:text-slate-100">
                  Güncelleme:
                </strong>{" "}
                Veri tabanı düzenli aralıklarla gözden geçirilir; kullanıcı
                bildirimleri öncelikli olarak işlenir.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F62FE]" aria-hidden />
              <span>
                <strong className="font-semibold text-slate-800 dark:text-slate-100">
                  Doğruluk:
                </strong>{" "}
                Fiyat ve müsaitlik bilgileri tesisler tarafından habersiz
                değiştirilebildiği için, yola çıkmadan önce tesisi aramanızı
                öneririz.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F62FE]" aria-hidden />
              <span>
                <strong className="font-semibold text-slate-800 dark:text-slate-100">
                  Düzeltme:
                </strong>{" "}
                Hatalı bir kayıt gördüğünüzde iletişim formundan bildirin;
                inceleyip düzeltiyoruz.
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Platformda neler var?
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "81 il sayfası",
                text: "Her il için konaklama, gezi, yemek ve belediye tesisleri ayrı sekmelerde.",
                href: "/#sehirler",
              },
              {
                title: "Kampanyalar",
                text: "Kamu personeline özel indirim ve protokollerin derlendiği güncel liste.",
                href: "/kampanyalar",
              },
              {
                title: "Resmi tatil takvimi",
                text: "2026-2027 milli, dini bayramlar ve kamu idari izin günleri.",
                href: "/resmi-tatiller",
              },
              {
                title: "Mobil uygulama",
                text: "Konuma göre yakındaki tesisler, favoriler ve çevrimdışı erişim.",
                href: "/indir",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#0F62FE]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  {item.text}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Platform nasıl finanse ediliyor?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Rotalink kullanıcılardan ücret almaz. Sunucu ve geliştirme
            maliyetleri sitede gösterilen reklamlarla karşılanır. Reklam
            içerikleri Rotalink tarafından seçilmez ve editoryal içeriğimizi
            etkilemez.
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            İletişim:{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-[#0F62FE] hover:underline"
              data-copyable="true"
            >
              {SITE.email}
            </a>
          </p>
        </section>
      </Container>
    </>
  );
}
