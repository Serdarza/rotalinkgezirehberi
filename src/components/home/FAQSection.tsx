"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { FAQ_ITEMS } from "@/config/site";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="sss" className="bg-slate-50 dark:bg-slate-900/50">
      <Container>
        <SectionHeading
          eyebrow="SSS"
          title="Sık Sorulan Sorular"
          description="Merak ettiklerinizin yanıtları burada."
        />
        <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-slate-900 dark:text-white">{item.q}</span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", open === i && "rotate-180")} aria-hidden />
              </button>
              {open === i && (
                <p className="px-6 pb-5 text-slate-600 dark:text-slate-400">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
