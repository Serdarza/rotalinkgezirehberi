import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { GetYourGuideCta } from "@/components/affiliate/GetYourGuideCta";
import { POPULAR_CITIES } from "@/config/site";
import { getYourGuideSearchUrl } from "@/config/affiliate";
import { ExternalLink } from "lucide-react";

export function ToursAffiliateSection() {
  return (
    <Section id="turlar" className="bg-white dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="Turlar"
          title="Şehir turları ve aktiviteler"
          description="Konaklamanın yanında rehberli tur ve deneyimleri partnerimiz GetYourGuide üzerinden keşfedin."
        />
        <GetYourGuideCta className="mb-8" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_CITIES.map((city) => (
            <a
              key={city}
              href={getYourGuideSearchUrl(city)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-700 dark:hover:bg-teal-950/40"
            >
              <span>{city} turları</span>
              <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-teal-600" />
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}
