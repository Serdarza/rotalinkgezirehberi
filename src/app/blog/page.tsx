import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ACCENT_STYLES,
  AppCtaCard,
  PostCard,
  SeoSectionTitle,
} from "@/components/seo/ListingParts";
import { BLOG_CATEGORIES, BLOG_POSTS, postsByCategory } from "@/config/blog";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Blog: Kamu Sosyal Tesisleri, Misafirhane ve Seyahat Rehberi",
  description:
    "Kamu sosyal tesisleri, kamu misafirhaneleri, öğretmenevleri, polisevleri, orduevleri ve belediye tesisleri hakkında rehber yazıları ve seyahat ipuçları.",
  path: "/blog/",
});

export default function BlogPage() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const featured = sorted.filter((p) => p.featured).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: "Blog", path: "/blog/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Rotalink Blog",
            url: absoluteUrl("/blog/"),
            inLanguage: "tr-TR",
          },
          itemListJsonLd(
            "Rotalink blog yazıları",
            sorted.map((p) => ({ name: p.title, path: `/blog/${p.slug}/` }))
          ),
        ]}
      />

      <header className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/50 sm:py-16">
        <Container>
          <Breadcrumb items={[{ label: "Anasayfa", href: "/" }, { label: "Blog" }]} />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Rotalink Blog
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Kamu sosyal tesisleri, kamu misafirhaneleri, öğretmenevleri, polisevleri ve
            orduevleri hakkında rehber yazıları; seyahatinizi planlamanız için pratik ipuçları.
          </p>
        </Container>
      </header>

      <Container className="py-12 sm:py-16">
        <section aria-labelledby="konular">
          <SeoSectionTitle id="konular">Konulara göre keşfedin</SeoSectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_CATEGORIES.map((cat) => {
              const a = ACCENT_STYLES[cat.accent];
              const n = postsByCategory(cat.slug).length;
              return (
                <li key={cat.slug}>
                  <a
                    href={`#${cat.slug}`}
                    className={cn(
                      "flex h-full flex-col rounded-2xl border border-l-4 border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
                      a.bar,
                      a.ring
                    )}
                  >
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {cat.label}
                    </span>
                    <span className="mt-1 text-xs font-semibold text-slate-500">{n} yazı</span>
                    <span className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {cat.description}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {featured.length > 0 && (
          <section className="mt-14" aria-labelledby="one-cikanlar">
            <SeoSectionTitle id="one-cikanlar">Öne çıkan rehberler</SeoSectionTitle>
            <ul className="grid gap-4 md:grid-cols-2">
              {featured.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </ul>
          </section>
        )}

        {BLOG_CATEGORIES.map((cat) => {
          const posts = postsByCategory(cat.slug).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          if (!posts.length) return null;
          const a = ACCENT_STYLES[cat.accent];
          return (
            <section
              key={cat.slug}
              id={cat.slug}
              className="mt-14 scroll-mt-24"
              aria-labelledby={`h-${cat.slug}`}
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id={`h-${cat.slug}`}
                    className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
                  >
                    {cat.label}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {cat.description}
                  </p>
                </div>
                <Link
                  href={cat.hubPath}
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-semibold hover:underline",
                    a.text
                  )}
                >
                  {cat.hubLabel} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </ul>
            </section>
          );
        })}

        <AppCtaCard className="mt-16" />
      </Container>
    </>
  );
}
