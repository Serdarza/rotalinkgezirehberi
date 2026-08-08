import { PageHero, Breadcrumb } from "@/components/layout/PageHeader";
import { NextHolidayCountdown } from "@/components/holidays/NextHolidayCountdown";
import {
  HOLIDAY_KIND_LABEL,
  HOLIDAY_YEARS,
  formatHolidayRange,
  holidayDate,
  holidayDayCount,
  holidayMonthLabel,
  type HolidayKind,
  type PublicHoliday,
} from "@/config/holidays";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { Flag, Moon, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "2026 - 2027 Resmi Tatiller Takvimi (Türkiye)",
  description:
    "Türkiye 2026 ve 2027 resmi tatil takvimi: Ramazan Bayramı, Kurban Bayramı, 23 Nisan, 19 Mayıs, 30 Ağustos, 29 Ekim ve kamu idari izin günleri tam liste.",
  openGraph: {
    title: "2026 - 2027 Resmi Tatiller Takvimi | Rotalink",
    description:
      "Türkiye'nin 2026 ve 2027 milli bayramları, dini bayramları ve kamu idari izin günleri tek takvimde.",
    url: `${SITE.url}/resmi-tatiller`,
  },
};

const KIND_STYLE: Record<
  HolidayKind,
  { icon: typeof Flag; badge: string; dot: string }
> = {
  milli: {
    icon: Flag,
    badge:
      "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    dot: "bg-red-500",
  },
  dini: {
    icon: Moon,
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  idari: {
    icon: Briefcase,
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
};

function HolidayRow({ holiday }: { holiday: PublicHoliday }) {
  const style = KIND_STYLE[holiday.kind];
  const Icon = style.icon;

  return (
    <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#0F62FE]/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50 py-2 dark:bg-slate-800/60">
        <span className="text-lg font-extrabold leading-none text-slate-900 dark:text-white">
          {holidayDate(holiday.start).getDate()}
        </span>
        <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {holidayMonthLabel(holiday).slice(0, 3)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {holiday.name}
          </h3>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
              style.badge
            )}
          >
            <Icon className="h-3 w-3" aria-hidden />
            {HOLIDAY_KIND_LABEL[holiday.kind]}
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {formatHolidayRange(holiday)}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {holiday.detail && (
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {holiday.detail}
            </span>
          )}
          <span>
            Toplam {holidayDayCount(holiday)} gün
          </span>
        </div>

        {holiday.note && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {holiday.note}
          </p>
        )}
      </div>
    </li>
  );
}

export default function ResmiTatillerPage() {
  return (
    <>
      <PageHero
        title="2026 – 2027 Resmi Tatil Takvimi"
        description="Türkiye'nin milli bayramları, dini bayramları ve kamu personeline verilen idari izin günleri tek takvimde."
      />
      <Container className="max-w-4xl py-10 sm:py-14">
        <Breadcrumb
          items={[
            { label: "Anasayfa", href: "/" },
            { label: "Resmi Tatiller" },
          ]}
        />

        <NextHolidayCountdown />

        <article className="mb-10 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Türkiye’de resmi tatiller nasıl belirlenir?
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Resmi tatiller{" "}
            <strong className="font-semibold text-slate-800 dark:text-slate-100">
              2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun
            </strong>{" "}
            ile düzenlenir. Milli bayramların tarihi her yıl sabittir; Ramazan
            ve Kurban bayramları ise hicri takvime bağlı olduğundan her yıl
            yaklaşık 10-11 gün öne kayar. Aşağıdaki dini bayram tarihleri
            Diyanet İşleri Başkanlığı takvimine göre verilmiştir.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            <strong className="font-semibold text-slate-800 dark:text-slate-100">
              İdari izin
            </strong>{" "}
            günleri resmi tatil değildir; Cumhurbaşkanlığı genelgesiyle yalnızca
            kamu personeline verilir ve özel sektörü kapsamaz. Bu günler
            takvimde ayrı bir etiketle gösterilmiştir.
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {(
              Object.keys(HOLIDAY_KIND_LABEL) as HolidayKind[]
            ).map((kind) => (
              <div
                key={kind}
                className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
              >
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", KIND_STYLE[kind].dot)}
                  aria-hidden
                />
                {HOLIDAY_KIND_LABEL[kind]}
              </div>
            ))}
          </div>
        </article>

        {HOLIDAY_YEARS.map(({ year, holidays }) => (
          <section key={year} className="mb-12">
            <div className="mb-5 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {year} Resmi Tatilleri
              </h2>
              <span className="text-sm text-slate-500">
                {holidays.length} kayıt
              </span>
            </div>

            <ul className="space-y-3">
              {holidays.map((holiday) => (
                <HolidayRow key={holiday.id} holiday={holiday} />
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Tatilde konaklama planlıyor musunuz?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Bayram tatillerinde kamu misafirhaneleri, öğretmenevleri,
            polisevleri ve orduevleri hızla dolar. Rotalink ile 81 ildeki
            tesisleri inceleyip iletişim bilgilerine ulaşabilirsiniz.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/#sehirler"
              className="inline-flex items-center rounded-2xl bg-[#0F62FE] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#0043ce]"
            >
              Şehirlere göz at
            </Link>
            <Link
              href="/kampanyalar"
              className="inline-flex items-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0F62FE] hover:text-[#0F62FE] dark:border-slate-700 dark:text-slate-200"
            >
              Kampanyalar
            </Link>
          </div>
        </section>

        <p className="mt-8 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Dini bayram tarihleri Diyanet İşleri Başkanlığı takvimine, idari izin
          bilgileri Cumhurbaşkanlığı açıklamalarına dayanır. Resmi kararlar
          değişebileceğinden seyahat planı öncesi güncel duyuruları kontrol
          etmeniz önerilir.
        </p>
      </Container>
    </>
  );
}
