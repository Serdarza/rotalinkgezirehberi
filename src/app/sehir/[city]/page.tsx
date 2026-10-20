import Link from "next/link";
import { notFound } from "next/navigation";
import { CityResults } from "@/components/search/CityResults";
import { CityGuideSection } from "@/components/search/CityGuideSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/layout/PageHeader";
import {
  ACCENT_STYLES,
  LinkChips,
  RelatedPostsGrid,
  SeoSectionTitle,
} from "@/components/seo/ListingParts";
import { CATEGORY_DEFS, CATEGORY_SLUGS } from "@/config/categories";
import { BLOG_POSTS } from "@/config/blog";
import { getAllData, getFacilitiesByCity } from "@/lib/data";
import { buildCityGuide, countFacilityTips } from "@/lib/cityGuide";
import { categoryCount, getCityBundles } from "@/lib/facilities";
import {
  buildMetadata,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";
import { cityFromSlug, capitalizeCity, slugifyCity, cn } from "@/lib/utils";
import { POPULAR_CITIES } from "@/config/site";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  const { cities } = await getAllData();
  return [...new Set(cities.map((city) => slugifyCity(city)))].map((city) => ({ city }));
}

function cityTitle(displayCity: string) {
  return `${displayCity} Öğretmenevi, Kamu Misafirhanesi ve Gezi Rehberi`;
}

export async function generateMetadata({ params }: Props) {
  const { city: slug } = await params;
  const { cities } = await getAllData();
  const city = cityFromSlug(slug, cities);
  if (!city) return {};

  const data = await getFacilitiesByCity(city);
  const tips = countFacilityTips(data.tesis);
  const guide = buildCityGuide(city, {
    konaklama: data.tesis.length,
    ...tips,
    gezi: data.gezi.length,
    yemek: data.yemek.length,
    belediye: data.sosyal.length,
  });

  return buildMetadata({
    title: cityTitle(capitalizeCity(city)),
    description: guide.lead.slice(0, 155),
    path: `/sehir/${slug}/`,
  });
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
  const { cities } = await getAllData();
  const city = cityFromSlug(slug, cities);

  if (!city) notFound();

  const data = await getFacilitiesByCity(city);
  const displayCity = capitalizeCity(city);
  const tips = countFacilityTips(data.tesis);
  const guide = buildCityGuide(displayCity, {
    konaklama: data.tesis.length,
    ...tips,
    gezi: data.gezi.length,
    yemek: data.yemek.length,
    belediye: data.sosyal.length,
  });

  const bundles = await getCityBundles();
  const bundle = bundles.get(slugifyCity(city));
  const categories = bundle
    ? CATEGORY_SLUGS.map((s) => ({
        def: CATEGORY_DEFS[s],
        count: categoryCount(bundle, CATEGORY_DEFS[s]),
      })).filter((c) => c.count > 0)
    : [];

  const nearby = POPULAR_CITIES.filter((c) => slugifyCity(c) !== slugifyCity(city)).slice(0, 8);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: displayCity, path: `/sehir/${slug}/` },
          ]),
          collectionPageJsonLd({
            name: cityTitle(displayCity),
            description: guide.lead,
            path: `/sehir/${slug}/`,
          }),
        ]}
      />

      <Container className="pt-5 sm:pt-12">
        <Breadcrumb
          items={[
            { label: "Anasayfa", href: "/" },
            { label: displayCity },
          ]}
        />
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {cityTitle(displayCity)}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          {guide.lead}
        </p>
      </Container>

      <CityResults city={displayCity} data={data} />

      <Container className="pb-12">
        {categories.length > 0 && (
          <section aria-labelledby="kategori-rehberleri" className="mb-10">
            <SeoSectionTitle id="kategori-rehberleri">
              {displayCity} kategori rehberleri
            </SeoSectionTitle>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(({ def, count }) => {
                const a = ACCENT_STYLES[def.accent];
                return (
                  <li key={def.slug}>
                    <Link
                      href={`/sehir/${slugifyCity(city)}/${def.slug}/`}
                      className={cn(
                        "flex h-full items-center justify-between gap-3 rounded-2xl border border-l-4 border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
                        a.bar,
                        a.ring
                      )}
                    >
                      <span>
                        <span className="block text-base font-bold text-slate-900 dark:text-white">
                          {displayCity} {def.plural}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {count} kayıt · liste ve konum bilgisi
                        </span>
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
                          a.badge
                        )}
                      >
                        {count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <CityGuideSection city={displayCity} data={data} />

        <section aria-labelledby="diger-iller" className="mt-10">
          <SeoSectionTitle id="diger-iller">Diğer popüler iller</SeoSectionTitle>
          <LinkChips
            items={nearby.map((c) => ({
              href: `/sehir/${slugifyCity(c)}/`,
              label: c,
            }))}
          />
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#0F62FE]">
            <Link href="/kamu-sosyal-tesisleri/" className="hover:underline">
              Tüm kamu sosyal tesisleri →
            </Link>
            <Link href="/ogretmenevleri/" className="hover:underline">
              Öğretmenevleri →
            </Link>
            <Link href="/kamu-misafirhaneleri/" className="hover:underline">
              Kamu misafirhaneleri →
            </Link>
          </p>
        </section>

        <RelatedPostsGrid posts={BLOG_POSTS.filter((p) => p.featured).slice(0, 3)} />
      </Container>
    </>
  );
}
