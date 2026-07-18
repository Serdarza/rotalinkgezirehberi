import Link from "next/link";
import { Home, Search, Download } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { POPULAR_CITIES } from "@/config/site";
import { slugifyCity } from "@/lib/utils";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F62FE]">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Popüler şehirlerden devam
        edebilir veya uygulamayı indirebilirsiniz.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
        >
          <Home className="h-4 w-4" aria-hidden />
          Ana Sayfa
        </Link>
        <Link
          href="/#ara"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
        >
          <Search className="h-4 w-4" aria-hidden />
          Tesis ara
        </Link>
        <Link
          href="/indir"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#14B8A6] px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Download className="h-4 w-4" aria-hidden />
          Uygulamayı indir
        </Link>
      </div>

      <div className="mt-12 w-full max-w-2xl">
        <p className="mb-4 text-sm font-semibold text-slate-500">Popüler şehirler</p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city}
              href={`/sehir/${slugifyCity(city)}`}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#0F62FE] hover:text-white dark:bg-slate-800 dark:text-slate-300"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
