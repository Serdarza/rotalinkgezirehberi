import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ACCENT_STYLES,
  AppCtaCard,
  LinkChips,
  RelatedPostsGrid,
  SeoFaq,
  SeoSectionTitle,
} from "@/components/seo/ListingParts";
import {
  CATEGORY_DEFS,
  HUB_DEFS,
  LODGING_CATEGORY_SLUGS,
  type CategorySlug,
  type HubDef,
} from "@/config/categories";
import { BLOG_POSTS, postsByCategory, type BlogCategorySlug } from "@/config/blog";
import { categoryCount, getCityBundles } from "@/lib/facilities";
import {
  breadcrumbJsonLd,
  buildMetadata,
  collectionPageJsonLd,
  itemListJsonLd,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

const HUB_BLOG: Partial<Record<CategorySlug, BlogCategorySlug>> = {
  ogretmenevi: "ogretmenevleri",
  "kamu-misafirhanesi": "kamu-misafirhaneleri",
  polisevi: "polisevleri-orduevleri",
  orduevi: "polisevleri-orduevleri",
  "belediye-sosyal-tesisleri": "belediye-sosyal-tesisleri",
};

export function hubDef(path: string): HubDef {
  const hub = HUB_DEFS.find((h) => h.path === path);
  if (!hub) throw new Error(`Bilinmeyen hub: ${path}`);
  return hub;
}

export function hubMetadata(path: string): Metadata {
  const hub = hubDef(path);
  return buildMetadata({ title: hub.title, description: hub.description, path: hub.path });
}

export async function HubPage({ path }: { path: string }) {
  const hub = hubDef(path);
  const bundles = [...(await getCityBundles()).values()];
  const category = hub.category ? CATEGORY_DEFS[hub.category] : undefined;
  const accent = ACCENT_STYLES[category?.accent ?? "blue"];

  const citiesForHub = category
    ? bundles
        .map((b) => ({ b, n: categoryCount(b, category) }))
        .filter((x) => x.n > 0)
        .sort((a, b) => a.b.city.localeCompare(b.b.city, "tr"))
    : bundles
        .map((b) => ({
          b,
          n:
            b.tesis.length + b.sosyal.length,
        }))
        .filter((x) => x.n > 0)
        .sort((a, b) => a.b.city.localeCompare(b.b.city, "tr"));

  const total = citiesForHub.reduce((sum, x) => sum + x.n, 0);

  const cityHref = (slug: string) =>
    category ? `/sehir/${slug}/${category.slug}/` : `/sehir/${slug}/`;
  const cityLabel = (name: string) => (category ? `${name} ${category.plural}` : name);

  const blogCat = hub.category ? HUB_BLOG[hub.category] : undefined;
  const posts = blogCat
    ? postsByCategory(blogCat).slice(0, 3)
    : BLOG_POSTS.filter((p) => p.featured).slice(0, 3);

  const overview = !category
    ? [...LODGING_CATEGORY_SLUGS, "belediye-sosyal-tesisleri" as CategorySlug].map((slug) => {
        const def = CATEGORY_DEFS[slug];
        const n = bundles.reduce((sum, b) => sum + categoryCount(b, def), 0);
        return { def, n };
      })
    : [];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: hub.h1, path: hub.path },
          ]),
          collectionPageJsonLd({ name: hub.h1, description: hub.description, path: hub.path }),
          itemListJsonLd(
            hub.h1,
            citiesForHub.map(({ b }) => ({
              name: cityLabel(b.displayCity),
              path: cityHref(b.slug),
            }))
          ),
        ]}
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumb items={[{ label: "Anasayfa", href: "/" }, { label: hub.h1 }]} />

        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {hub.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
            {hub.lead}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {category
              ? `Rotalink kaydında ${citiesForHub.length} ilde toplam ${total} ${category.singular} listeleniyor. ${category.explainer}`
              : `Rotalink kaydında ${citiesForHub.length} ilde konaklama ve belediye sosyal tesisi bulunuyor. Aşağıdaki türlerden birini seçebilir veya doğrudan ilinize gidebilirsiniz.`}
          </p>
        </header>

        {!category && (
          <section aria-labelledby="turler" className="mb-12">
            <SeoSectionTitle id="turler">Tesis türleri</SeoSectionTitle>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overview.map(({ def, n }) => {
                const a = ACCENT_STYLES[def.accent];
                return (
                  <li key={def.slug}>
                    <Link
                      href={def.hubPath ?? "/"}
                      className={cn(
                        "flex h-full flex-col rounded-2xl border border-l-4 border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
                        a.bar,
                        a.ring
                      )}
                    >
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {def.plural}
                      </span>
                      <span className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {n} kayıt
                      </span>
                      <span className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {def.explainer}
                      </span>
                      <span
                        className={cn(
                          "mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold",
                          a.text
                        )}
                      >
                        İl il görüntüle <ArrowRight className="h-3 w-3" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section aria-labelledby="iller">
          <SeoSectionTitle id="iller">
            {category ? `İllere göre ${category.plural.toLocaleLowerCase("tr")}` : "İllere göre kamu tesisleri"}
          </SeoSectionTitle>
          <LinkChips
            items={citiesForHub.map(({ b, n }) => ({
              href: cityHref(b.slug),
              label: cityLabel(b.displayCity),
              count: n,
            }))}
          />
        </section>

        {category && (
          <section className="mt-12" aria-labelledby="nelere-dikkat">
            <SeoSectionTitle id="nelere-dikkat">
              {category.plural} için dikkat edilecekler
            </SeoSectionTitle>
            <ul className="space-y-2.5">
              {category.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
                >
                  <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current", accent.text)} />
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        <SeoFaq
          items={
            category
              ? category.faq
              : [
                  {
                    q: "Kamu sosyal tesisleri nedir?",
                    a: "Kamu kurumlarının, belediyelerin ve kamu personeline hizmet eden kuruluşların işlettiği konaklama, yeme-içme ve dinlenme tesisleridir. Misafirhane, öğretmenevi, polisevi, orduevi ve belediye sosyal tesisleri bu gruba girer.",
                  },
                  {
                    q: "Bu tesislerde herkes konaklayabilir mi?",
                    a: "Çoğu tesis öncelikle bağlı olduğu kurumun personeline hizmet verir. Bazıları diğer kamu çalışanlarını ve misafirleri de kabul edebilir. Kabul koşulları tesisten tesise değiştiği için doğrudan tesisle iletişime geçmeniz gerekir.",
                  },
                  {
                    q: "Rotalink rezervasyon yapar mı?",
                    a: "Hayır. Rotalink rezervasyon yapmaz; tesis bilgilerini, haritadaki konumunu ve iletişim yollarını bir arada sunan bir rehberdir.",
                  },
                ]
          }
        />

        <RelatedPostsGrid posts={posts} />
        <AppCtaCard className="mt-12" />
      </Container>
    </>
  );
}
