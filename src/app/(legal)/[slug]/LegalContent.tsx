"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import type { LEGAL_PAGES } from "@/config/legal";

type Page = (typeof LEGAL_PAGES)[number];

export default function LegalContent({ page }: { page: Page }) {
  const externalUrl =
    "externalUrl" in page ? (page.externalUrl as string | undefined) : undefined;

  useEffect(() => {
    if (!externalUrl) return;
    window.location.replace(externalUrl);
  }, [externalUrl]);

  return (
    <>
      <PageHero title={page.title} />
      <Container className="max-w-3xl py-16">
        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          {page.content.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {externalUrl && (
            <p>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0F62FE] underline"
              >
                Gizlilik Politikasını aç
              </a>
            </p>
          )}
        </div>
      </Container>
    </>
  );
}
