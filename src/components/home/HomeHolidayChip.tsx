"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import {
  ALL_HOLIDAYS,
  HOLIDAY_KIND_LABEL,
  formatHolidayShort,
  holidayDate,
  type PublicHoliday,
} from "@/config/holidays";

function nextHoliday(now: Date): PublicHoliday | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return (
    ALL_HOLIDAYS.filter((h) => holidayDate(h.end) >= today).sort(
      (a, b) => holidayDate(a.start).getTime() - holidayDate(b.start).getTime()
    )[0] ?? null
  );
}

function countdownLabel(days: number): string {
  if (days <= 0) return "Bugün";
  if (days === 1) return "Yarın";
  return `${days} gün kaldı`;
}

/**
 * Ana sayfa hero — sıradaki milli / dini / idari tatil için tek satırlık sinyal.
 * Tam takvim /resmi-tatiller sayfasında.
 */
export function HomeHolidayChip() {
  const [state, setState] = useState<{
    holiday: PublicHoliday;
    days: number;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    const holiday = nextHoliday(now);
    if (!holiday) return;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round(
      (holidayDate(holiday.start).getTime() - today.getTime()) / 86_400_000
    );
    setState({ holiday, days });
  }, []);

  if (!state) return null;

  const { holiday, days } = state;
  const kind = HOLIDAY_KIND_LABEL[holiday.kind];
  const dateShort = formatHolidayShort(holiday);

  return (
    <Link
      href="/resmi-tatiller"
      className="relative z-0 mx-auto mt-5 flex max-w-3xl flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left text-white backdrop-blur-md transition hover:bg-white/15 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
      aria-label={`${holiday.name}, ${dateShort}, ${countdownLabel(days)}. Resmi tatil takvimine git.`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <CalendarDays className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">
            Sıradaki resmi tatil
          </p>
          <p className="mt-0.5 truncate text-sm font-bold sm:text-base">
            <span>{holiday.name}</span>
            <span className="mx-1.5 font-normal text-white/50">·</span>
            <span className="font-medium text-white/85">{dateShort}</span>
            <span className="mx-1.5 font-normal text-white/50">·</span>
            <span className="text-sky-200">{countdownLabel(days)}</span>
          </p>
          <p className="mt-0.5 text-xs text-white/60">{kind}</p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 self-end text-xs font-semibold text-sky-200 sm:self-center">
        Takvimi gör
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </span>
    </Link>
  );
}
