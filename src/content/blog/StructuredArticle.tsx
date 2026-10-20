import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Sıralı adımlar */
  steps?: string[];
  note?: string;
  links?: { href: string; label: string }[];
};

export type ArticleDef = {
  intro: string[];
  sections: ArticleSection[];
  faq?: { q: string; a: string }[];
  cta?: {
    title: string;
    text: string;
    links: { href: string; label: string }[];
  };
};

const h2 = "scroll-mt-24 text-2xl font-bold text-slate-900 dark:text-white";
const p = "leading-relaxed text-slate-600 dark:text-slate-300";

export function StructuredArticle({ def }: { def: ArticleDef }) {
  return (
    <article className="space-y-10">
      <div className="space-y-4">
        {def.intro.map((text, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-lg leading-relaxed text-slate-700 dark:text-slate-200"
                : p
            }
          >
            {text}
          </p>
        ))}
      </div>

      {def.sections.length >= 4 && (
        <nav
          aria-label="İçindekiler"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            İçindekiler
          </p>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {def.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-[#0F62FE] hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {def.sections.map((s) => (
        <section key={s.id} id={s.id} className="space-y-4">
          <h2 className={h2}>{s.title}</h2>
          {s.paragraphs?.map((text, i) => (
            <p key={i} className={p}>
              {text}
            </p>
          ))}
          {s.bullets && (
            <ul className="grid gap-2.5">
              {s.bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#14B8A6]" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {s.steps && (
            <ol className="space-y-3">
              {s.steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F62FE] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className={`${p} pt-0.5`}>{step}</span>
                </li>
              ))}
            </ol>
          )}
          {s.note && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              {s.note}
            </p>
          )}
          {s.links && (
            <ul className="flex flex-wrap gap-2">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0F62FE] ring-1 ring-[#0F62FE]/30 transition hover:bg-[#0F62FE] hover:text-white dark:bg-slate-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {def.faq && def.faq.length > 0 && (
        <section id="sss" className="space-y-4">
          <h2 className={h2}>Sık Sorulan Sorular</h2>
          <div className="space-y-3">
            {def.faq.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-900 dark:text-white">
                  {item.q}
                </summary>
                <p className={`${p} mt-3 text-sm`}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {def.cta && (
        <section className="rounded-2xl border border-[#0F62FE]/20 bg-gradient-to-br from-[#0F62FE]/5 to-[#14B8A6]/5 p-8 dark:border-[#0F62FE]/30">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{def.cta.title}</h2>
          <p className={`${p} mt-3`}>{def.cta.text}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {def.cta.links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  i === 0
                    ? "inline-flex items-center rounded-xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0043ce]"
                    : "inline-flex items-center rounded-xl border border-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-[#0F62FE] transition hover:bg-[#0F62FE]/5"
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        Not: Bu yazı genel bilgilendirme amaçlıdır. Kabul koşulları, müsaitlik ve ücretler
        tesise göre değişir ve zamanla güncellenir; güncel bilgi için ilgili tesisle doğrudan
        iletişime geçin. Rotalink rezervasyon yapmaz.
      </p>
    </article>
  );
}
