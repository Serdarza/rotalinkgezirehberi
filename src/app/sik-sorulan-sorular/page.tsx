import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { FAQSection } from "@/components/home/FAQSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { FAQ_ITEMS } from "@/config/site";

export const metadata = buildMetadata({
  title: "Sık Sorulan Sorular",
  description: "Rotalink hakkında sık sorulan sorular ve yanıtları.",
  path: "/sik-sorulan-sorular",
});

export default function SSSPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <PageHero title="Sık Sorulan Sorular" />
      <FAQSection />
    </>
  );
}
