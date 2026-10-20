import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ACCENT_STYLES,
  AppCtaCard,
  FacilityLinkCard,
  LinkChips,
  PlaceTextCard,
  RelatedPostsGrid,
  SeoFaq,
  SeoSectionTitle,
} from "@/components/seo/ListingParts";
import {
  CATEGORY_DEFS,
  CATEGORY_SLUGS,
  categoryDescription,
  categoryH1,
  categoryTitle,
  isCategorySlug,
  type CategoryDef,
  type CategorySlug,
} from "@/config/categories";
import { postsByCategory, relatedPosts, type BlogCategorySlug } from "@/config/blog";
import {
  asText,
  categoryCount,
  displayFacilityType,
  getCityBundles,
  type CityBundle,
} from "@/lib/facilities";
import {
  breadcrumbJsonLd,
  buildMetadata,
  collectionPageJsonLd,
  itemListJsonLd,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ city: string; kategori: string }> };

const BLOG_FOR: Record<CategorySlug, BlogCategorySlug> = {
  ogretmenevi: "ogretmenevleri",
  "kamu-misafirhanesi": "kamu-misafirhaneleri",
  polisevi: "polisevleri-orduevleri",
  orduevi: "polisevleri-orduevleri",
  "belediye-sosyal-tesisleri": "belediye-sosyal-tesisleri",
  "gezilecek-yerler": "seyahat-ipuclari",
  "yemek-mekanlari": "seyahat-ipuclari",
};

export async function generateStaticParams() {
  const bundles = await getCityBundles();
  const out: { city: string; kategori: string }[] = [];
  for (const bundle of bundles.values()) {
    for (const slug of CATEGORY_SLUGS) {
      if (categoryCount(bundle, CATEGORY_DEFS[slug]) > 0) {
        out.push({ city: bundle.slug, kategori: slug });
      }
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, kategori } = await params;
  if (!isCategorySlug(kategori)) return {};
  const bundle = (await getCityBundles()).get(city);
  if (!bundle) return {};
  const def = CATEGORY_DEFS[kategori];
  const count = categoryCount(bundle, def);
  if (!count) return {};
  return buildMetadata({
    title: categoryTitle(def, bundle.displayCity, count),
    description: categoryDescription(def, bundle.displayCity, count).slice(0, 160),
    path: `/sehir/${bundle.slug}/${def.slug}/`,
  });
}

function joinTr(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} ve ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`;
}

function buildLead(def: CategoryDef, city: string, bundle: CityBundle, count: number) {
  const names: string[] =
    def.source === "tesis"
      ? bundle.tesis
          .filter((e) => e.kind === def.kind)
          .slice(0, 3)
          .map((e) => e.facility.isim)
      : def.source === "sosyal"
        ? bundle.sosyal.slice(0, 3).map((s) => s.isim)
        : def.source === "gezi"
          ? bundle.gezi.slice(0, 3).map((g) => g.isim)
          : bundle.yemek.slice(0, 3).map((y) => y.isim);

  const first =
    def.source === "tesis"
      ? `${city} ilinde Rotalink kaydında ${count} ${def.singular} bulunuyor.`
      : `${city} için Rotalink kaydında ${count} ${def.singular} listeleniyor.`;
  const second = names.length
    ? ` Aralarında ${joinTr(names)} yer alıyor.`
    : "";
  const geo =
    def.source === "tesis"
      ? (() => {
          const withGeo = bundle.tesis.filter(
            (e) =>
              e.kind === def.kind &&
              typeof e.facility.latitude === "number" &&
              typeof e.facility.longitude === "number"
          ).length;
          return withGeo
            ? ` ${withGeo} tesis için harita konumu mevcut.`
            : "";
        })()
      : "";
  return `${first}${second}${geo}`;
}

export default async function CityCategoryPage({ params }: Props) {
  const { city, kategori } = await params;
  if (!isCategorySlug(kategori)) notFound();
  const bundles = await getCityBundles();
  const bundle = bundles.get(city);
  if (!bundle) notFound();

  const def = CATEGORY_DEFS[kategori];
  const count = categoryCount(bundle, def);
  if (!count) notFound();

  const cityName = bundle.displayCity;
  const path = `/sehir/${bundle.slug}/${def.slug}/`;
  const accent = ACCENT_STYLES[def.accent];
  const h1 = categoryH1(def, cityName);

  const lodging = bundle.tesis.filter((e) => e.kind === def.kind);

  const otherCategories = CATEGORY_SLUGS.filter(
    (s) => s !== def.slug && categoryCount(bundle, CATEGORY_DEFS[s]) > 0
  ).map((s) => ({
    href: `/sehir/${bundle.slug}/${s}/`,
    label: `${cityName} ${CATEGORY_DEFS[s].plural}`,
    count: categoryCount(bundle, CATEGORY_DEFS[s]),
  }));

  const otherCities = [...bundles.values()]
    .filter((b) => b.slug !== bundle.slug)
    .map((b) => ({ b, n: categoryCount(b, def) }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.b.city.localeCompare(b.b.city, "tr"))
    .slice(0, 12)
    .map(({ b, n }) => ({
      href: `/sehir/${b.slug}/${def.slug}/`,
      label: `${b.displayCity} ${def.plural}`,
      count: n,
    }));

  const blogCat = BLOG_FOR[def.slug];
  const categoryPosts = postsByCategory(blogCat);
  const posts =
    categoryPosts.length >= 3
      ? categoryPosts.slice(0, 3)
      : relatedPosts("", blogCat, 3);

  const jsonLd: object[] = [
    breadcrumbJsonLd([
      { name: "Anasayfa", path: "/" },
      { name: cityName, path: `/sehir/${bundle.slug}/` },
      { name: def.plural, path },
    ]),
    collectionPageJsonLd({
      name: h1,
      description: categoryDescription(def, cityName, count),
      path,
    }),
  ];
  if (def.source === "tesis") {
    jsonLd.push(
      itemListJsonLd(
        h1,
        lodging.map((e) => ({ name: e.facility.isim, path: e.path }))
      )
    );
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="py-8 sm:py-12">
        <Breadcrumb
          items={[
            { label: "Anasayfa", href: "/" },
            { label: cityName, href: `/sehir/${bundle.slug}/` },
            { label: def.plural },
          ]}
        />

        <header className="mb-8 max-w-3xl">
          <p className={cn("text-xs font-bold uppercase tracking-widest", accent.text)}>
            {cityName} rehberi
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
            {buildLead(def, cityName, bundle, count)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {def.explainer}
          </p>
        </header>

        <section aria-labelledby="liste-baslik">
          <SeoSectionTitle id="liste-baslik">
            {cityName} {def.plural.toLocaleLowerCase("tr")} listesi ({count})
          </SeoSectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {def.source === "tesis" &&
              lodging.map((e) => (
                <FacilityLinkCard
                  key={e.path}
                  href={e.path}
                  name={e.facility.isim}
                  type={displayFacilityType(e.facility.tip)}
                  address={asText(e.facility.adres)}
                  accent={def.accent}
                />
              ))}
            {def.source === "sosyal" &&
              bundle.sosyal.map((s, i) => (
                <PlaceTextCard
                  key={s.isim + i}
                  name={s.isim}
                  description={s.aciklama}
                  address={asText(s.adres)}
                  accent={def.accent}
                />
              ))}
            {def.source === "gezi" &&
              bundle.gezi.map((g, i) => (
                <PlaceTextCard
                  key={g.isim + i}
                  name={g.isim}
                  description={g.aciklama}
                  address={asText(g.adres)}
                  accent={def.accent}
                />
              ))}
            {def.source === "yemek" &&
              bundle.yemek.map((y, i) => (
                <PlaceTextCard
                  key={y.isim + i}
                  name={y.isim}
                  description={y.aciklama}
                  address={asText(y.adres)}
                  accent={def.accent}
                />
              ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Bilgiler açık kaynaklardan derlenir ve değişebilir. Güncel adres, kabul koşulları ve
            müsaitlik için tesisle doğrudan iletişime geçin. Rotalink rezervasyon yapmaz.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="ipuclari">
          <SeoSectionTitle id="ipuclari">
            {cityName} {def.singular} için dikkat edilecekler
          </SeoSectionTitle>
          <ul className="space-y-2.5">
            {def.tips.map((tip) => (
              <li
                key={tip}
                className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
              >
                <CheckCircle2 className={cn("mt-0.5 h-5 w-5 shrink-0", accent.text)} aria-hidden />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="diger-kategoriler">
          <SeoSectionTitle id="diger-kategoriler">{cityName} için diğer rehberler</SeoSectionTitle>
          <LinkChips
            items={[
              { href: `/sehir/${bundle.slug}/`, label: `${cityName} tüm tesisler ve harita` },
              ...otherCategories,
            ]}
          />
        </section>

        <SeoFaq items={def.faq} />

        {otherCities.length > 0 && (
          <section className="mt-12" aria-labelledby="diger-iller">
            <SeoSectionTitle id="diger-iller">Diğer illerde {def.plural.toLocaleLowerCase("tr")}</SeoSectionTitle>
            <LinkChips items={otherCities} />
            {def.hubPath && (
              <p className="mt-4">
                <Link
                  href={def.hubPath}
                  className={cn("inline-flex items-center gap-1 text-sm font-semibold hover:underline", accent.text)}
                >
                  Tüm illerdeki {def.plural.toLocaleLowerCase("tr")} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </p>
            )}
          </section>
        )}

        <RelatedPostsGrid posts={posts} />

        <AppCtaCard className="mt-12" />
      </Container>
    </>
  );
}
