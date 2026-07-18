import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import type { LEGAL_PAGES } from "@/config/legal";

type Page = (typeof LEGAL_PAGES)[number];

export default function LegalContent({ page }: { page: Page }) {
  return (
    <>
      <PageHero title={page.title} />
      <Container className="max-w-3xl py-16">
        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          {page.content.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Container>
    </>
  );
}
