import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { LEGAL_PAGES, LEGAL_UPDATED_AT, type LegalPageConfig } from "@/config/legal";
import { SITE } from "@/config/site";

export default function LegalContent({ page }: { page: LegalPageConfig }) {
  const others = LEGAL_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <>
      <PageHero title={page.title} description={page.description} />
      <Container className="max-w-3xl py-12 sm:py-16">
        <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
          Son güncelleme: {LEGAL_UPDATED_AT}
        </p>

        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {page.intro}
        </p>

        <div className="mt-10 space-y-9">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {section.heading}
              </h2>
              {section.paragraphs?.map((text) => (
                <p
                  key={text.slice(0, 40)}
                  className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]"
                >
                  {text}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((item) => (
                    <li
                      key={item.slice(0, 40)}
                      className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F62FE]"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Sorunuz mu var?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Bu metinle ilgili her türlü soru ve talebiniz için{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-[#0F62FE] hover:underline"
              data-copyable="true"
            >
              {SITE.email}
            </a>{" "}
            adresine yazabilir veya iletişim formunu kullanabilirsiniz.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="inline-flex items-center rounded-2xl bg-[#0F62FE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0043ce]"
            >
              İletişim formu
            </Link>
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="inline-flex items-center rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0F62FE] hover:text-[#0F62FE] dark:border-slate-700 dark:text-slate-200"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
