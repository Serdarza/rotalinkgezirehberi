"use client";

import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "rotalink_visit_counted";
const CACHE_KEY = "rotalink_visit_count_cache";

type Status = "loading" | "ready" | "error";

function formatCount(value: number) {
  return Math.round(value).toLocaleString("tr-TR");
}

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || target <= 0) {
      setValue(target > 0 ? target : 0);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const from = Math.max(0, Math.floor(target * 0.72));

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, target]);

  return value;
}

function parseCount(data: unknown): number {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const obj = data as Record<string, unknown>;
  const raw = obj.count ?? obj.value;
  const count = Number(raw);
  if (!Number.isFinite(count) || count < 0) throw new Error("Invalid count");
  return count;
}

async function fetchWithTimeout(url: string, ms = 8000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseCount(await res.json());
  } finally {
    window.clearTimeout(timer);
  }
}

/** Birincil: CounterAPI · Yedek: CountAPI (ücretsiz, kayıt yok) */
async function fetchVisitCount(increment: boolean): Promise<number> {
  const primary = increment
    ? "https://api.counterapi.dev/v1/rotalink/site_visits/up"
    : "https://api.counterapi.dev/v1/rotalink/site_visits";

  try {
    return await fetchWithTimeout(primary);
  } catch {
    const fallback = increment
      ? "https://countapi.mileshilliard.com/api/v1/hit/rotalink.tr_site_visits"
      : "https://countapi.mileshilliard.com/api/v1/get/rotalink.tr_site_visits";
    return await fetchWithTimeout(fallback);
  }
}

/**
 * Site geneli ziyaretçi sayacı.
 * Oturum başına bir kez artırır (aynı ziyarette her sayfada şişmez).
 */
export function VisitorCounter({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      const cached = Number(localStorage.getItem(CACHE_KEY) || 0);
      if (cached > 0) {
        setCount(cached);
        setStatus("ready");
      }

      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";
        const next = await fetchVisitCount(!alreadyCounted);
        if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, "1");
        localStorage.setItem(CACHE_KEY, String(next));
        setCount(next);
        setStatus("ready");
      } catch {
        if (cached > 0) {
          setCount(cached);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      }
    };

    void run();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const display = useCountUp(count, status === "ready" && inView);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F62FE]/80 p-5 text-white shadow-lg shadow-slate-900/20 dark:border-slate-700",
        className
      )}
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#14B8A6]/20 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-[#0F62FE]/30 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
          <Users className="h-6 w-6 text-[#5eead4]" strokeWidth={1.75} aria-hidden />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Canlı ziyaretçi sayacı
          </p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight sm:text-4xl">
            {status === "loading" && count === 0 ? (
              <span className="inline-block min-w-[5ch] animate-pulse text-white/40">····</span>
            ) : status === "error" ? (
              <span className="text-lg font-semibold text-white/70">Şu an alınamadı</span>
            ) : (
              <>
                {formatCount(display)}
                <span className="ml-1.5 text-base font-semibold text-white/50">kişi</span>
              </>
            )}
          </p>
          <p className="mt-1 text-sm text-white/60">
            Rotalink&apos;i ziyaret eden toplam kullanıcı
          </p>
        </div>
      </div>
    </div>
  );
}
