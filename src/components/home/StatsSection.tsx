"use client";

import { useEffect, useRef, useState } from "react";
import { BedDouble, Landmark, MapPinned, UtensilsCrossed } from "lucide-react";
import type { SiteStats } from "@/types";
import { useMasterData } from "@/hooks/useMasterData";
import { cn } from "@/lib/utils";

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
  icon: Icon,
  active,
  delay = 0,
  tone,
}: {
  target: number;
  label: string;
  icon: typeof BedDouble;
  active: boolean;
  delay?: number;
  tone: string;
}) {
  const [started, setStarted] = useState(false);
  const value = useCountUp(target, 1600, started);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timer);
  }, [active, delay]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/25 bg-white/95 px-3 py-3 text-center shadow-lg shadow-black/10 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 sm:px-4 sm:py-4"
      )}
    >
      <span
        className={cn(
          "mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl sm:h-9 sm:w-9",
          tone
        )}
        aria-hidden
      >
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <p className="text-xl font-extrabold tabular-nums text-[#0F62FE] sm:text-2xl lg:text-3xl">
        {formatNumber(value)}+
      </p>
      <p className="mt-0.5 text-[11px] font-semibold leading-tight text-slate-600 dark:text-slate-300 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

type Props = {
  stats: SiteStats;
  /** Hero içinde arama çubuğunun altında gösterilir. */
  embedded?: boolean;
};

export function StatsSection({ stats, embedded = false }: Props) {
  const master = useMasterData();
  const liveStats: SiteStats =
    master.ready && master.tesis.length
      ? {
          konaklamaCount: master.tesis.length,
          geziCount: master.gezi.length,
          yemekCount: master.yemek.length,
          belediyeCount: master.sosyal.length,
        }
      : stats;

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
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cards = (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      <StatCard
        target={liveStats.konaklamaCount}
        label="Konaklama"
        icon={BedDouble}
        tone="bg-blue-50 text-[#0F62FE] dark:bg-blue-950/50"
        active={inView}
        delay={0}
      />
      <StatCard
        target={liveStats.geziCount}
        label="Gezi"
        icon={MapPinned}
        tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
        active={inView}
        delay={100}
      />
      <StatCard
        target={liveStats.yemekCount}
        label="Yemek"
        icon={UtensilsCrossed}
        tone="bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
        active={inView}
        delay={200}
      />
      <StatCard
        target={liveStats.belediyeCount}
        label="Belediye Sosyal Tesisleri"
        icon={Landmark}
        tone="bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
        active={inView}
        delay={300}
      />
    </div>
  );

  if (embedded) {
    return (
      <section ref={ref} className="mx-auto mt-6 max-w-3xl" aria-label="İstatistikler">
        {cards}
      </section>
    );
  }

  return (
    <section ref={ref} className="relative z-20 pb-8 pt-2">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{cards}</div>
    </section>
  );
}
