import { HeroSection } from "@/components/home/HeroSection";
import { WeatherWidget } from "@/components/home/WeatherWidget";
import { NearbyFacilities } from "@/components/home/NearbyFacilities";
import { PopularCitiesSection } from "@/components/home/PopularCitiesSection";
import {
  FeaturedFacilitiesSection,
  CategoryFacilitiesSection,
} from "@/components/home/FacilitySections";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BelediyeSosyalSection } from "@/components/home/BelediyeSosyalSection";
import { CampaignsSection } from "@/components/home/CampaignsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FAQSection } from "@/components/home/FAQSection";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";
import { FACILITY_CATEGORIES } from "@/config/site";
import {
  getAllData,
  getFeaturedFacilities,
  getFacilitiesByCategory,
  getSiteStats,
} from "@/lib/data";
import { getFeaturedCampaigns } from "@/lib/kampanyaRepo";
import { buildMetadata } from "@/lib/seo";
import { HubLinksSection } from "@/components/home/HubLinksSection";

export const metadata = buildMetadata({
  title: "Kamu Misafirhanesi, Öğretmenevi, Polisevi ve Orduevi Rehberi | Rotalink",
  description:
    "Kamu misafirhaneleri, öğretmenevleri, polisevleri, orduevleri ve belediye sosyal tesislerini il il keşfedin. Adres, harita konumu ve iletişim yolları tek rehberde.",
  path: "/",
});

export default async function HomePage() {
  const [stats, featured, { cities, tesis, sosyal }, campaigns] =
    await Promise.all([
      getSiteStats(),
      getFeaturedFacilities(8),
      getAllData(),
      getFeaturedCampaigns(6),
    ]);

  const categories = await Promise.all(
    FACILITY_CATEGORIES.map(async (cat) => ({
      ...cat,
      facilities: await getFacilitiesByCategory(cat.tips, 6),
    }))
  );

  return (
    <>
      <HeroSection
        cities={cities}
        facilities={tesis.map(({ isim, il }) => ({ isim, il }))}
        stats={stats}
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
      <PopularCitiesSection />
      <HubLinksSection />
      <FeaturedFacilitiesSection facilities={featured} />
      {categories.map((cat) => (
        <CategoryFacilitiesSection
          key={cat.key}
          id={cat.key}
          title={cat.title}
          description={cat.description}
          tips={cat.tips}
          facilities={cat.facilities}
        />
      ))}
      <BelediyeSosyalSection facilities={sosyal} />
      <FeaturesSection />
      <TestimonialsSection />
      <CampaignsSection campaigns={campaigns} />
      <BlogSection />
      <FAQSection />
      <AppDownloadSection />
    </>
  );
}
