import { HeroSection } from "@/components/home/HeroSection";
import { WeatherWidget } from "@/components/home/WeatherWidget";
import { NearbyFacilities } from "@/components/home/NearbyFacilities";
import { StatsSection } from "@/components/home/StatsSection";
import { PopularCitiesSection } from "@/components/home/PopularCitiesSection";
import {
  FeaturedFacilitiesSection,
  CategoryFacilitiesSection,
} from "@/components/home/FacilitySections";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FAQSection } from "@/components/home/FAQSection";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";
import { AdSection } from "@/components/ads/AdSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { FACILITY_CATEGORIES } from "@/config/site";
import {
  getAllData,
  getFeaturedFacilities,
  getFacilitiesByCategory,
  getSiteStats,
} from "@/lib/data";
import { faqJsonLd } from "@/lib/seo";
import { FAQ_ITEMS } from "@/config/site";
import { Fragment } from "react";

export default async function HomePage() {
  const [stats, featured, { cities, tesis }] = await Promise.all([
    getSiteStats(),
    getFeaturedFacilities(8),
    getAllData(),
  ]);

  const categories = await Promise.all(
    FACILITY_CATEGORIES.map(async (cat) => ({
      ...cat,
      facilities: await getFacilitiesByCategory(cat.tips, 6),
    }))
  );

  return (
    <>
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <HeroSection
        cities={cities}
        facilities={tesis.map(({ isim, il }) => ({ isim, il }))}
      />
      <WeatherWidget />
      <NearbyFacilities
        facilities={tesis
          .filter(
            (t) =>
              typeof t.latitude === "number" &&
              typeof t.longitude === "number"
          )
          .map(({ isim, tip, il, latitude, longitude }) => ({
            isim,
            tip,
            il,
            latitude,
            longitude,
          }))}
      />
      <StatsSection stats={stats} />
      <PopularCitiesSection />
      <AdSection />
      <FeaturedFacilitiesSection facilities={featured} />
      <AdSection />
      {categories.map((cat, index) => (
        <Fragment key={cat.key}>
          <CategoryFacilitiesSection
            id={cat.key}
            title={cat.title}
            description={cat.description}
            facilities={cat.facilities}
          />
          {(index === 1 || index === 3) && <AdSection />}
        </Fragment>
      ))}
      <FeaturesSection />
      <TestimonialsSection />
      <BlogSection />
      <AdSection />
      <FAQSection />
      <AppDownloadSection />
    </>
  );
}
