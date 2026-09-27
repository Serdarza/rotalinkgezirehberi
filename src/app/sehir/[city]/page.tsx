import { notFound } from "next/navigation";
import { CityResults } from "@/components/search/CityResults";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllData, getFacilitiesByCity } from "@/lib/data";
import { buildCityGuide, countFacilityTips } from "@/lib/cityGuide";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { cityFromSlug, capitalizeCity, slugifyCity } from "@/lib/utils";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  const { cities } = await getAllData();
  return cities.map((city) => ({ city: slugifyCity(city) }));
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
    title: `${city} Kamu Tesisleri, Öğretmenevi ve Gezi Rehberi`,
    description: guide.lead.slice(0, 155),
    path: `/sehir/${slug}`,
  });
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
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
      <CityResults city={displayCity} data={data} />
    </>
  );
}
