import Link from "next/link";

export function KamuMisafirhanesiRehberiContent() {
  return (
    <article className="space-y-10">
      <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        Kamu misafirhaneleri, kamu kurum ve kuruluşları tarafından işletilen; başta kamu
        personeli olmak üzere belirli şartları sağlayan kişilere güvenli, ekonomik ve
        konforlu konaklama imkânı sunan tesislerdir. Türkiye&apos;nin birçok il ve
        ilçesinde hizmet veren bu tesisler, iş seyahatleri, geçici görevlendirmeler,
        eğitimler ve turistik geziler sırasında uygun maliyetli konaklama alternatifi
        sunar.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Kamu Misafirhanesi Nedir?
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Kamu misafirhaneleri; bakanlıklar, üniversiteler, belediyeler, emniyet
          teşkilatı, askeri kurumlar ve diğer kamu kuruluşları tarafından işletilen
          konaklama tesisleridir. Bu tesislerin temel amacı, kamu personeline ve
          kurumun belirlediği hak sahiplerine güvenli ve uygun fiyatlı konaklama
          sağlamaktır.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Kimler Yararlanabilir?
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Yararlanma şartları kuruma göre değişiklik gösterebilir. Genel olarak aşağıdaki
          kişiler kamu misafirhanelerinden faydalanabilir:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "Kamu kurumlarında görev yapan personel",
            "Emekli kamu personeli (kurum kurallarına bağlı olarak)",
            "Görevli memurlar",
            "Akademik ve idari personel",
            "Kurum misafirleri",
            "Hak sahibi yakınlar (kurumun uygulamasına göre)",
            "Kontenjan bulunması hâlinde diğer vatandaşlar (bazı tesislerde)",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F62FE]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Konaklama hakkı ve öncelik sırası tamamen ilgili kurumun yönetmeliklerine göre
          belirlenir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Rezervasyon Nasıl Yapılır?
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Birçok kamu misafirhanesinde rezervasyon işlemleri telefon, e-posta veya ilgili
          kurumun resmi internet sitesi üzerinden yapılmaktadır. Yoğun dönemlerde yer
          bulabilmek için önceden rezervasyon yaptırmanız tavsiye edilir.
        </p>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Rezervasyon sırasında genellikle şu bilgiler istenir:
        </p>
        <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
          <li>Ad ve soyad</li>
          <li>T.C. Kimlik Numarası</li>
          <li>Kurum bilgisi</li>
          <li>Konaklama tarihleri</li>
          <li>İletişim bilgileri</li>
          <li>Görev veya ziyaret amacı (gerekli durumlarda)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Konaklama Ücretleri
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Kamu misafirhanelerindeki ücretler, özel otellere kıyasla oldukça ekonomiktir.
          Fiyatlar şu kriterlere göre değişebilir:
        </p>
        <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
          <li>Misafirin statüsü</li>
          <li>Kurum personeli olup olmaması</li>
          <li>Oda tipi</li>
          <li>Şehir</li>
          <li>Sezon</li>
          <li>Kahvaltı veya yemek hizmeti</li>
        </ul>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          En güncel fiyat bilgileri için ilgili tesis ile iletişime geçilmesi önerilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sunulan Hizmetler
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Misafirhaneye göre değişmekle birlikte aşağıdaki hizmetler sunulabilir:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Tek, çift ve aile odaları",
            "Ücretsiz veya ücretli Wi-Fi",
            "Otopark",
            "Klima ve merkezi ısıtma",
            "Televizyon",
            "Restoran veya yemekhane",
            "Çamaşırhane",
            "Toplantı salonları",
            "24 saat güvenlik",
            "Ortak dinlenme alanları",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              <span className="text-[#14B8A6]">✓</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Konaklama Kuralları
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Her kamu misafirhanesinin kendine ait işletme kuralları bulunur. Genel olarak
          dikkat edilmesi gereken hususlar şunlardır:
        </p>
        <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
          <li>Giriş ve çıkış saatlerine uyulmalıdır.</li>
          <li>Kimlik ibrazı zorunludur.</li>
          <li>Tesisin ortak kullanım kurallarına uyulmalıdır.</li>
          <li>Oda kapasitesi aşılmamalıdır.</li>
          <li>Rezervasyon iptalleri zamanında bildirilmelidir.</li>
          <li>Tesisin iç düzenine ve güvenlik kurallarına riayet edilmelidir.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-[#0F62FE]/20 bg-gradient-to-br from-[#0F62FE]/5 to-[#14B8A6]/5 p-8 dark:border-[#0F62FE]/30">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Rotalink ile Kamu Misafirhanelerini Kolayca Keşfedin
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
          Rotalink, Türkiye genelindeki kamu misafirhanelerini tek platformda bir araya
          getirerek kullanıcıların ihtiyaç duydukları bilgilere hızlı ve kolay şekilde
          ulaşmasını sağlar.
        </p>
        <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">
          Rotalink üzerinden;
        </p>
        <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Türkiye genelindeki kamu misafirhanelerini inceleyebilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            İllere göre tesis araması yapabilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Telefon ve adres bilgilerine ulaşabilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Harita üzerinden konum görüntüleyebilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Güncel konaklama bilgilerini takip edebilirsiniz.
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F62FE]/90"
          >
            Tesis Ara
          </Link>
          <Link
            href="/indir"
            className="inline-flex items-center rounded-xl border border-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-[#0F62FE] transition hover:bg-[#0F62FE]/5"
          >
            Uygulamayı İndir
          </Link>
        </div>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-10 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Seyahatinizi Güvenle Planlayın
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          İster resmi görev, ister kısa süreli konaklama veya tatil planlıyor olun; kamu
          misafirhaneleri ekonomik, güvenli ve konforlu bir seçenek sunar. Seyahatiniz
          öncesinde rezervasyon durumunu ve tesis kurallarını kontrol ederek daha planlı
          bir konaklama deneyimi yaşayabilirsiniz.
        </p>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          <strong className="font-semibold text-slate-900 dark:text-white">Rotalink</strong>
          , Türkiye&apos;nin dört bir yanındaki kamu misafirhanelerini keşfetmenize
          yardımcı olan kapsamlı rehberinizdir. Güncel bilgiler, kolay erişim ve kullanıcı
          dostu arayüz ile kamu tesislerine ulaşmak artık çok daha kolay.
        </p>
      </section>
    </article>
  );
}
