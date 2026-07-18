import { notFound } from "next/navigation";
import { CityResults } from "@/components/search/CityResults";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllData, getFacilitiesByCity } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { cityFromSlug, capitalizeCity } from "@/lib/utils";

export const revalidate = 3600;

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ tip?: string }>;
};

import { slugifyCity } from "@/lib/utils";

export async function generateStaticParams() {
  const { cities } = await getAllData();
  return cities.map((city) => ({ city: slugifyCity(city) }));
}

export async function generateMetadata({ params }: Props) {
  const { city: slug } = await params;
  const { cities } = await getAllData();
  const city = cityFromSlug(slug, cities);
  if (!city) return {};
  return buildMetadata({
    title: `${city} Kamu Tesisleri ve Gezi Rehberi`,
    description: `${city} ilindeki orduevleri, polisevleri, öğretmenevleri ve gezilecek yerler — Rotalink.`,
    path: `/sehir/${slug}`,
  });
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city: slug } = await params;
  const { tip } = await searchParams;
  const { cities } = await getAllData();
  const city = cityFromSlug(slug, cities);

  if (!city) notFound();

  const data = await getFacilitiesByCity(city);
  const displayCity = capitalizeCity(city);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: displayCity, path: `/sehir/${slug}` },
        ])}
      />
      <CityResults city={displayCity} data={data} tipFilter={tip} />
    </>
  );
}
