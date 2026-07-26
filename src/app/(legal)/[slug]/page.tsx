import { notFound } from "next/navigation";
import { LEGAL_PAGES } from "@/config/legal";
import { SITE } from "@/config/site";
import LegalContent from "./LegalContent";

export function generateStaticParams() {
  return LEGAL_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE.url}/${page.slug}` },
    openGraph: {
      title: `${page.title} | ${SITE.name}`,
      description: page.description,
      url: `${SITE.url}/${page.slug}`,
    },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();
  return <LegalContent page={page} />;
}
