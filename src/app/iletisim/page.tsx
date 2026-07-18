import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
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
        <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
            Sosyal medya
          </h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Güncellemeler ve duyurular için bizi takip edin.
          </p>
          <SocialLinks variant="full" />
        </div>
      </Container>
    </>
  );
}
