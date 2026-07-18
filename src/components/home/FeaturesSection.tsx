"use client";

import { motion } from "framer-motion";
import {
  MapPin, Phone, CalendarCheck, Wallet, Heart, Search,
  SlidersHorizontal, RefreshCw, type LucideIcon,
} from "lucide-react";
import { Container, Section, SectionHeading, GlassCard } from "@/components/ui/Section";
import { FEATURES } from "@/config/site";

const ICONS: Record<string, LucideIcon> = {
  MapPin, Phone, CalendarCheck, Wallet, Heart, Search, SlidersHorizontal, RefreshCw,
};

export function FeaturesSection() {
  return (
    <Section id="ozellikler" className="bg-slate-50 dark:bg-slate-900/50">
      <Container>
        <SectionHeading
          eyebrow="Özellikler"
          title="Seyahatinizi Kolaylaştıran Araçlar"
          description="Rotalink ile kamu tesislerine ulaşmak hiç bu kadar kolay olmamıştı."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] ?? MapPin;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="h-full text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F62FE]/10 text-[#0F62FE]">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{f.title}</h3>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
