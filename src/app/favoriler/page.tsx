import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { FavoritesClient } from "@/components/favorites/FavoritesClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Favoriler",
  description: "Kaydettiğiniz kamu tesisleri — Rotalink favorileriniz.",
  path: "/favoriler",
  noIndex: true,
});

export default function FavorilerPage() {
  return (
    <>
      <PageHero
        title="Favoriler"
        description="Beğendiğiniz tesisler bu cihazda saklanır. Hesap gerekmez."
      />
      <Container className="py-12 sm:py-16">
        <FavoritesClient />
      </Container>
    </>
  );
}
