import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
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
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold">Bize Ulaşın</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Yeni tesis önerisi, hata bildirimi veya geri bildirimleriniz için e-posta gönderebilirsiniz.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex rounded-2xl bg-[#0F62FE] px-6 py-3 font-semibold text-white"
          >
            {SITE.email}
          </a>
        </div>
      </Container>
    </>
  );
}
