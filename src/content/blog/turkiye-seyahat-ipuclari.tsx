import Link from "next/link";

export function TurkiyeSeyahatIpuclariContent() {
  return (
    <article className="space-y-10">
      <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        <strong className="font-semibold text-slate-900 dark:text-white">
          Rotalink Kamu Seyahat Rehberiniz
        </strong>{" "}
        ile Türkiye&apos;nin 81 ilindeki kamu tesislerini en kolay ve ekonomik şekilde
        keşfedin.{" "}
        <Link href="/" className="font-semibold text-[#0F62FE] hover:underline">
          rotalink.tr
        </Link>{" "}
        üzerinden sunduğumuz rehber, kamu tesisleriyle seyahati pratik ve planlı hale
        getirir.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Kamu Tesisleri ile Seyahat Fırsatı
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Öğretmenevleri, polisevleri, orduevleri, DSİ, Karayolları, Orman
          misafirhaneleri ve belediye sosyal tesisleri ile uygun fiyatlı, güvenli ve
          konforlu bir Türkiye turu artık mümkün.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Neden Rotalink Kamu Seyahat Rehberiniz?
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "81 ilde 1.200’den fazla kamu tesisi tek platformda",
            "Güncel telefon ve adres bilgileri",
            "Rota planlamaya özel pratik öneriler",
            "Bütçe dostu seyahat rehberi",
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
          2026 Güncel Fiyat Aralığı (Yaklaşık)
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Fiyatlar tesise, şehre, sezona ve misafir statüsüne göre değişebilir. Aşağıdaki
          aralıklar yaklaşık bilgilendirme amaçlıdır:
        </p>
        <ul className="space-y-3">
          {[
            { label: "Polisevleri", value: "848 TL – 2.200 TL" },
            { label: "Öğretmenevleri", value: "750 TL – 2.650 TL" },
            {
              label: "DSİ / Karayolları Misafirhaneleri",
              value: "180 TL – 1.350 TL (sivil misafirler)",
            },
          ].map((item) => (
            <li
              key={item.label}
              className="flex flex-col gap-1 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-800/60"
            >
              <span className="font-semibold text-slate-900 dark:text-white">
                {item.label}
              </span>
              <span className="text-sm text-[#0F62FE] dark:text-sky-300">{item.value}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Diğer tesisler de benzer ekonomik aralıkta hizmet verebilir. Güncel ücret için
          ilgili tesisle iletişime geçmenizi öneririz.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Rotalink’ten Pratik Seyahat İpuçları
        </h2>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              1. Rezervasyon
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Tesisleri doğrudan arayın. Yaz ve bayram dönemlerinde en az 7–15 gün
              önceden yer ayırtın.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              2. Rota Planlama
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Karayolları ve DSİ tesislerini rota üzeri mola noktası olarak kullanın. İlçe
              tesisleri de büyük şehirlere güzel alternatif olur.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              3. Kim Kalabilir?
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Kamu personeli önceliklidir; ancak sivil vatandaşlar da müsaitlik durumunda
              konaklayabilir. Öncelik ve ücretlendirme tesis kurallarına göre değişir.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
              4. Önerilen Rotalar
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                {
                  title: "Akdeniz & Ege Rotası",
                  text: "Antalya, Muğla, İzmir sahil tesisleri",
                },
                {
                  title: "Karadeniz Rotası",
                  text: "Trabzon, Rize, Artvin, Kastamonu",
                },
                {
                  title: "İç Anadolu Geçiş Rotası",
                  text: "Ankara merkezli kolay konaklamalar",
                },
                {
                  title: "Doğu ve Güneydoğu Rotası",
                  text: "Doğal ve sakin kamu tesisleri",
                },
              ].map((route) => (
                <li
                  key={route.title}
                  className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {route.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {route.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#0F62FE]/20 bg-gradient-to-br from-[#0F62FE]/5 to-[#14B8A6]/5 p-8 dark:border-[#0F62FE]/30">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Rotalink Kamu Seyahat Rehberiniz
        </h2>
        <p className="mt-2 text-sm font-medium text-[#0F62FE]">
          Sizin Seyahatiniz, Bizim Rehberliğimiz
        </p>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
          <Link href="/" className="font-semibold text-[#0F62FE] hover:underline">
            rotalink.tr
          </Link>{" "}
          üzerinden tüm kamu tesislerini il il inceleyebilir, konum bilgilerine
          ulaşabilir ve rotanızı oluşturabilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F62FE]/90"
          >
            Tesisleri Keşfet
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
          Bu rehber düzenli olarak güncellenmektedir. Bir sonraki seyahatinizde{" "}
          <strong className="font-semibold text-slate-900 dark:text-white">
            Rotalink Kamu Seyahat Rehberiniz
          </strong>{" "}
          ile tasarruflu ve keyifli yolculuklar dileriz.
        </p>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          Deneyimlerinizi bizimle paylaşın; birlikte daha güzel rotalar oluşturalım.
        </p>
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Not: Fiyat ve müsaitlik bilgileri değişkenlik gösterebilir. Güncel durum için
          tesisleri doğrudan aramanızı öneririz.
        </p>
      </section>
    </article>
  );
}
