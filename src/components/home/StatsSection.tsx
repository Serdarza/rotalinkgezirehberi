"use client";

import { useEffect, useRef, useState } from "react";
import { Container, GlassCard } from "@/components/ui/Section";
import type { SiteStats } from "@/types";

function formatNumber(value: number) {
  return Math.round(value).toLocaleString("tr-TR");
}

function useCountUp(target: number, durationMs = 1600, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // easeOutCubic — hızlı başlar, sonda yumuşar
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, target]);

  return value;
}

function StatCard({
  target,
  label,
  suffix = "",
  active,
  delay = 0,
}: {
  target: number;
  label: string;
  suffix?: string;
  active: boolean;
  delay?: number;
}) {
  const [started, setStarted] = useState(false);
  const value = useCountUp(target, 1600, started);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timer);
  }, [active, delay]);

  return (
    <GlassCard className="text-center">
      <p className="text-3xl font-extrabold tabular-nums text-[#0F62FE] sm:text-4xl">
        {formatNumber(value)}
        {suffix}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </p>
    </GlassCard>
  );
}

export function StatsSection({ stats }: { stats: SiteStats }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="-mt-16 relative z-20 pb-8">
      <Container>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            target={stats.cityCount}
            label="İl"
            active={inView}
            delay={0}
          />
          <StatCard
            target={stats.facilityCount}
            label="Kamu Tesisi"
            suffix="+"
            active={inView}
            delay={120}
          />
          <StatCard
            target={stats.geziCount}
            label="Gezi Yeri"
            suffix="+"
            active={inView}
            delay={240}
          />
        </div>
      </Container>
    </section>
  );
}
