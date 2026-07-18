import { HeroSection } from "@/components/home/HeroSection";
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
      <StatsSection stats={stats} />
      <PopularCitiesSection />
      <FeaturedFacilitiesSection facilities={featured} />
      {categories.map((cat) => (
        <CategoryFacilitiesSection
          key={cat.key}
          id={cat.key}
          title={cat.title}
          description={cat.description}
          facilities={cat.facilities}
        />
      ))}
      <FeaturesSection />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection />
      <AppDownloadSection />
    </>
  );
}
