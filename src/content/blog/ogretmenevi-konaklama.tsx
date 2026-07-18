import Link from "next/link";

export function OgretmeneviKonaklamaContent() {
  return (
    <article className="space-y-10">
      <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        Türkiye&apos;nin dört bir yanında hizmet veren öğretmenevleri, uygun fiyatlı ve
        güvenilir konaklama seçenekleri arasında önemli bir yere sahiptir. Millî Eğitim
        Bakanlığına bağlı olarak faaliyet gösteren bu sosyal tesisler, öncelikle
        öğretmenler ve eğitim çalışanlarının ihtiyaçlarını karşılamak amacıyla kurulmuş
        olsa da, uygunluk durumuna göre farklı kullanıcı gruplarına da hizmet
        verebilmektedir. Yararlanma önceliği ve ücret tarifeleri ilgili mevzuat ile
        belirlenirken, uygulamalar tesisin kapasitesine göre değişiklik gösterebilir.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Öğretmenevi Nedir?
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Öğretmenevleri; konaklama, dinlenme, yeme-içme, toplantı ve sosyal etkinlik
          hizmetleri sunan kamu sosyal tesisleridir. Birçok öğretmenevi şehir
          merkezlerinde veya ulaşımı kolay noktalarda bulunduğundan hem iş seyahatleri
          hem de turistik geziler için tercih edilmektedir. Ayrıca bazı öğretmenevlerinde
          restoran, kafeterya, toplantı salonu ve organizasyon alanları da
          bulunmaktadır.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Kimler Konaklayabilir?
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Öğretmenevlerinde öncelik eğitim çalışanlarına verilse de, tesisin doluluk
          durumuna bağlı olarak farklı gruplar da konaklama imkânı bulabilir. Genel
          olarak yararlanabilecek kişiler şunlardır:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "Öğretmenler ve Millî Eğitim Bakanlığı personeli",
            "Emekli öğretmenler ve emekli MEB personeli",
            "Diğer kamu kurumlarında görev yapan personel",
            "Kurum misafirleri",
            "Bazı tesislerde kontenjan olması hâlinde diğer vatandaşlar",
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
          Konaklama hakkı, ücretlendirme ve öncelik sırası öğretmenevinin uyguladığı
          kurallara göre değişebilir. Bu nedenle rezervasyon öncesinde ilgili
          öğretmenevinden güncel bilgi alınması tavsiye edilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Öğretmenevlerinin Avantajları
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Öğretmenevleri ekonomik fiyatlarının yanında sunduğu güvenli ortam ile de öne
          çıkar. Başlıca avantajları:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Uygun fiyatlı konaklama",
            "Merkezi konumlarda hizmet",
            "Güvenli ve düzenli tesisler",
            "Aile dostu ortam",
            "Restoran ve kafeterya hizmetleri",
            "Toplantı ve etkinlik salonları",
            "Temiz ve düzenli odalar",
            "Kamu güvencesiyle hizmet",
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
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Özellikle uzun süreli görevler, seminerler ve şehir dışı seyahatlerde
          öğretmenevleri bütçe dostu bir alternatif sunmaktadır.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Rezervasyon Nasıl Yapılır?
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Çoğu öğretmenevinde rezervasyon telefon, e-posta veya ilgili tesisin çevrim içi
          rezervasyon sistemi üzerinden yapılmaktadır. Yoğun dönemlerde önceden
          rezervasyon yaptırılması önerilir. Giriş sırasında kimlik ibrazı zorunludur ve
          tesis kuralları doğrultusunda kayıt işlemleri gerçekleştirilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Konaklama Kuralları
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Her öğretmenevinin kendine özgü işletme kuralları bulunsa da genel olarak
          aşağıdaki hususlar uygulanır:
        </p>
        <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
          <li>Girişte kimlik belgesi ibraz edilmelidir.</li>
          <li>Giriş ve çıkış saatlerine uyulmalıdır.</li>
          <li>Rezervasyon iptal koşulları tesis tarafından belirlenir.</li>
          <li>Tesis kurallarına ve ortak yaşam düzenine uyulması beklenir.</li>
          <li>Fiyat tarifeleri misafirin statüsüne göre farklılık gösterebilir.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Konaklama Ücretleri
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Öğretmenevlerinde ücretler; oda tipi, şehir, sezon, misafirin statüsü ve
          tesisin sunduğu hizmetlere göre değişebilir. Eğitim çalışanları ve belirli hak
          sahipleri için farklı tarifeler uygulanabilir. Güncel fiyat bilgisi için
          doğrudan ilgili öğretmenevi ile iletişime geçmek en doğru yöntemdir.
        </p>
      </section>

      <section className="rounded-2xl border border-[#0F62FE]/20 bg-gradient-to-br from-[#0F62FE]/5 to-[#14B8A6]/5 p-8 dark:border-[#0F62FE]/30">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Rotalink ile Öğretmenevlerini Kolayca Bulun
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
          Rotalink, Türkiye genelindeki öğretmenevlerini tek platformda bir araya
          getirerek konaklama planlamanızı kolaylaştırır. İl veya ilçe bazında arama
          yapabilir, iletişim bilgilerine ulaşabilir, konumlarını harita üzerinde
          görüntüleyebilir ve seyahatiniz için en uygun tesisi kısa sürede
          bulabilirsiniz.
        </p>
        <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">
          Rotalink üzerinden:
        </p>
        <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Öğretmenevlerini şehir bazında listeleyebilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Telefon ve adres bilgilerine ulaşabilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Harita üzerinden yol tarifi alabilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Güncel tesis bilgilerini takip edebilir,
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0F62FE]">→</span>
            Kamu sosyal tesislerini tek platformdan keşfedebilirsiniz.
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F62FE]/90"
          >
            Öğretmenevi Ara
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sonuç</h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Öğretmenevleri; ekonomik fiyatları, güvenli ortamları ve yaygın hizmet ağı
          sayesinde kamu personeli başta olmak üzere birçok kullanıcı için önemli bir
          konaklama alternatifidir. Seyahatiniz öncesinde rezervasyon koşullarını ve
          tesisin güncel uygulamalarını kontrol ederek konforlu bir konaklama deneyimi
          yaşayabilirsiniz.
        </p>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          <strong className="font-semibold text-slate-900 dark:text-white">Rotalink</strong>{" "}
          ile Türkiye&apos;nin dört bir yanındaki öğretmenevlerini hızlı ve kolay bir
          şekilde keşfedebilir, seyahatlerinizi daha planlı hale getirebilirsiniz.
        </p>
      </section>
    </article>
  );
}
