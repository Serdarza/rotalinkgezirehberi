"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import {
  ALL_HOLIDAYS,
  formatHolidayRange,
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

/** Sıradaki resmi tatile kalan gün — statik export nedeniyle istemcide hesaplanır. */
export function NextHolidayCountdown() {
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
  const label =
    days <= 0 ? "Bugün tatil!" : days === 1 ? "Yarın başlıyor" : `${days} gün kaldı`;

  return (
    <div className="mb-10 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#0F62FE] to-[#0043ce] p-6 text-white shadow-xl shadow-blue-500/20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <CalendarClock className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Sıradaki resmi tatil
          </p>
          <p className="mt-1 text-xl font-bold leading-tight">{holiday.name}</p>
          <p className="mt-1 text-sm text-white/80">
            {formatHolidayRange(holiday)}
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-white/15 px-5 py-3 text-center">
        <p className="text-2xl font-extrabold">{label}</p>
      </div>
    </div>
  );
}
