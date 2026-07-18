import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/config/site";

export const metadata = buildMetadata({
  title: "İletişim",
  description: `Rotalink ile iletişime geçin — ${SITE.email}`,
  path: "/iletisim",
});

export default function IletisimPage() {
  return (
    <>
      <PageHero title="İletişim" description="Sorularınız ve önerileriniz için bize ulaşın." />
      <Container className="max-w-xl py-16">
        <ContactForm />
      </Container>
    </>
  );
}
