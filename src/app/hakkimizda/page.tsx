import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/config/site";

export const metadata = buildMetadata({
  title: "Hakkımızda",
  description: "Rotalink — Türkiye'nin kamu seyahat rehberi hakkında bilgi edinin.",
  path: "/hakkimizda",
});

export default function HakkimizdaPage() {
  return (
    <>
      <PageHero title="Hakkımızda" description="Türkiye'nin en kapsamlı kamu seyahat platformu." />
      <Container className="prose prose-slate max-w-3xl py-16 dark:prose-invert">
        <p>
          <strong>{SITE.name}</strong>, Türkiye genelindeki kamu misafirhaneleri, polisevleri,
          öğretmenevleri, orduevleri ve sosyal tesisleri tek platformda sunan dijital bir
          seyahat rehberidir.
        </p>
        <p>
          Amacımız, kamu personeli ve vatandaşların uygun fiyatlı konaklama ve sosyal tesis
          imkânlarına kolayca ulaşmasını sağlamaktır.
        </p>
        <p>
          Platformumuz sürekli güncellenmekte olup, mobil uygulamamız ile her an yanınızındayız.
        </p>
      </Container>
    </>
  );
}
