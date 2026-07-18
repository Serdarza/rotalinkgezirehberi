"use client";

import { Star } from "lucide-react";
import { Container, Section, SectionHeading, GlassCard } from "@/components/ui/Section";
import { TESTIMONIALS } from "@/config/site";

export function TestimonialsSection() {
  return (
    <Section className="bg-white dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="Yorumlar"
          title="Kullanıcılarımız Ne Diyor?"
          description="Binlerce kullanıcı Rotalink ile kamu tesislerine kolayca ulaşıyor."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <GlassCard key={t.name}>
              <div className="mb-4 flex gap-0.5" aria-label={`${t.rating} yıldız`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <p className="mb-6 text-slate-600 dark:text-slate-300">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
