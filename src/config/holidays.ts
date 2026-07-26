export type HolidayKind = "milli" | "dini" | "idari";

export interface PublicHoliday {
  /** Kararlı anahtar (liste render'ı ve anchor için). */
  id: string;
  name: string;
  /** ISO tarih (YYYY-MM-DD), tatilin ilk günü. */
  start: string;
  /** ISO tarih (YYYY-MM-DD), son gün dahil. */
  end: string;
  /** "3 gün", "Yarım gün", "İdari izin (kamu)" vb. */
  detail?: string;
  kind: HolidayKind;
  note?: string;
}

export const HOLIDAY_KIND_LABEL: Record<HolidayKind, string> = {
  milli: "Milli Bayram",
  dini: "Dini Bayram",
  idari: "İdari İzin",
};

/**
 * 2026 Türkiye resmi tatilleri + açıklanan kamu idari izinleri.
 * Dini bayram tarihleri Diyanet İşleri Başkanlığı takvimine göredir.
 */
export const HOLIDAYS_2026: PublicHoliday[] = [
  {
    id: "2026-yilbasi",
    name: "Yılbaşı",
    start: "2026-01-01",
    end: "2026-01-01",
    detail: "1 gün",
    kind: "milli",
    note: "Miladi yılın ilk günü; tüm kamu kurumları ve okullar tatildir.",
  },
  {
    id: "2026-ramazan-arife",
    name: "Ramazan Bayramı Arifesi",
    start: "2026-03-19",
    end: "2026-03-19",
    detail: "Yarım gün",
    kind: "dini",
    note: "Arife günü saat 13.00'ten itibaren tatil başlar.",
  },
  {
    id: "2026-ramazan",
    name: "Ramazan Bayramı",
    start: "2026-03-20",
    end: "2026-03-22",
    detail: "3 gün",
    kind: "dini",
    note: "Arife ile birlikte 3,5 günlük resmi tatil.",
  },
  {
    id: "2026-23-nisan",
    name: "Ulusal Egemenlik ve Çocuk Bayramı",
    start: "2026-04-23",
    end: "2026-04-23",
    detail: "1 gün",
    kind: "milli",
    note: "TBMM'nin açılışının yıl dönümü.",
  },
  {
    id: "2026-1-mayis",
    name: "Emek ve Dayanışma Günü",
    start: "2026-05-01",
    end: "2026-05-01",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2026-19-mayis",
    name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
    start: "2026-05-19",
    end: "2026-05-19",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2026-kurban-idari",
    name: "Kurban Bayramı Öncesi İdari İzin",
    start: "2026-05-25",
    end: "2026-05-25",
    detail: "İdari izin (kamu)",
    kind: "idari",
    note: "Cumhurbaşkanlığı kararıyla kamu personeline verilen ek izin; özel sektörü kapsamaz.",
  },
  {
    id: "2026-kurban-arife",
    name: "Kurban Bayramı Arifesi",
    start: "2026-05-26",
    end: "2026-05-26",
    detail: "Yarım gün (kamuda tam gün)",
    kind: "dini",
  },
  {
    id: "2026-kurban",
    name: "Kurban Bayramı",
    start: "2026-05-27",
    end: "2026-05-30",
    detail: "4 gün",
    kind: "dini",
    note: "İdari izinle birlikte kamu personeli için 9 güne uzayan tatil.",
  },
  {
    id: "2026-15-temmuz",
    name: "Demokrasi ve Milli Birlik Günü",
    start: "2026-07-15",
    end: "2026-07-15",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2026-30-agustos",
    name: "Zafer Bayramı",
    start: "2026-08-30",
    end: "2026-08-30",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2026-cumhuriyet-arife",
    name: "Cumhuriyet Bayramı Arifesi",
    start: "2026-10-28",
    end: "2026-10-28",
    detail: "Yarım gün",
    kind: "milli",
    note: "28 Ekim saat 13.00'ten itibaren tatil başlar.",
  },
  {
    id: "2026-cumhuriyet",
    name: "Cumhuriyet Bayramı",
    start: "2026-10-29",
    end: "2026-10-29",
    detail: "1 gün",
    kind: "milli",
  },
];

/**
 * 2027 Türkiye resmi tatilleri (2429 sayılı Kanun + Diyanet takvimi).
 * İdari izinler açıklandıkça güncellenir.
 */
export const HOLIDAYS_2027: PublicHoliday[] = [
  {
    id: "2027-yilbasi",
    name: "Yılbaşı",
    start: "2027-01-01",
    end: "2027-01-01",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2027-ramazan-arife",
    name: "Ramazan Bayramı Arifesi",
    start: "2027-03-08",
    end: "2027-03-08",
    detail: "Yarım gün",
    kind: "dini",
  },
  {
    id: "2027-ramazan",
    name: "Ramazan Bayramı",
    start: "2027-03-09",
    end: "2027-03-11",
    detail: "3 gün",
    kind: "dini",
  },
  {
    id: "2027-23-nisan",
    name: "Ulusal Egemenlik ve Çocuk Bayramı",
    start: "2027-04-23",
    end: "2027-04-23",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2027-1-mayis",
    name: "Emek ve Dayanışma Günü",
    start: "2027-05-01",
    end: "2027-05-01",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2027-kurban-arife",
    name: "Kurban Bayramı Arifesi",
    start: "2027-05-15",
    end: "2027-05-15",
    detail: "Yarım gün",
    kind: "dini",
  },
  {
    id: "2027-kurban",
    name: "Kurban Bayramı",
    start: "2027-05-16",
    end: "2027-05-19",
    detail: "4 gün",
    kind: "dini",
    note: "Bayramın 4. günü 19 Mayıs ile aynı güne denk gelir.",
  },
  {
    id: "2027-19-mayis",
    name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
    start: "2027-05-19",
    end: "2027-05-19",
    detail: "1 gün",
    kind: "milli",
    note: "Kurban Bayramı'nın son günü ile çakışır.",
  },
  {
    id: "2027-15-temmuz",
    name: "Demokrasi ve Milli Birlik Günü",
    start: "2027-07-15",
    end: "2027-07-15",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2027-30-agustos",
    name: "Zafer Bayramı",
    start: "2027-08-30",
    end: "2027-08-30",
    detail: "1 gün",
    kind: "milli",
  },
  {
    id: "2027-cumhuriyet-arife",
    name: "Cumhuriyet Bayramı Arifesi",
    start: "2027-10-28",
    end: "2027-10-28",
    detail: "Yarım gün",
    kind: "milli",
  },
  {
    id: "2027-cumhuriyet",
    name: "Cumhuriyet Bayramı",
    start: "2027-10-29",
    end: "2027-10-29",
    detail: "1 gün",
    kind: "milli",
  },
];

export const HOLIDAY_YEARS = [
  { year: 2026, holidays: HOLIDAYS_2026 },
  { year: 2027, holidays: HOLIDAYS_2027 },
] as const;

export const ALL_HOLIDAYS: PublicHoliday[] = [
  ...HOLIDAYS_2026,
  ...HOLIDAYS_2027,
];

const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const WEEKDAYS_TR = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

/** ISO tarihi yerel saat kaymasından etkilenmeden Date'e çevirir. */
export function holidayDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatHolidayRange(holiday: PublicHoliday): string {
  const a = holidayDate(holiday.start);
  const b = holidayDate(holiday.end);
  const dayA = `${a.getDate()} ${MONTHS_TR[a.getMonth()]}`;
  const dayB = `${b.getDate()} ${MONTHS_TR[b.getMonth()]}`;

  if (holiday.start === holiday.end) {
    return `${dayA} ${a.getFullYear()}, ${WEEKDAYS_TR[a.getDay()]}`;
  }
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()} – ${b.getDate()} ${MONTHS_TR[a.getMonth()]} ${a.getFullYear()} (${WEEKDAYS_TR[a.getDay()]} – ${WEEKDAYS_TR[b.getDay()]})`;
  }
  return `${dayA} – ${dayB} ${b.getFullYear()}`;
}

/** Ana sayfa chip için kısa tarih: "30 Ağustos" / "27 – 30 Mayıs" */
export function formatHolidayShort(holiday: PublicHoliday): string {
  const a = holidayDate(holiday.start);
  const b = holidayDate(holiday.end);
  if (holiday.start === holiday.end) {
    return `${a.getDate()} ${MONTHS_TR[a.getMonth()]}`;
  }
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()} – ${b.getDate()} ${MONTHS_TR[a.getMonth()]}`;
  }
  return `${a.getDate()} ${MONTHS_TR[a.getMonth()]} – ${b.getDate()} ${MONTHS_TR[b.getMonth()]}`;
}

export function holidayMonthLabel(holiday: PublicHoliday): string {
  return MONTHS_TR[holidayDate(holiday.start).getMonth()];
}

/** Toplam tatil günü (arifeler yarım sayılır). */
export function holidayDayCount(holiday: PublicHoliday): number {
  const a = holidayDate(holiday.start).getTime();
  const b = holidayDate(holiday.end).getTime();
  const days = Math.round((b - a) / 86_400_000) + 1;
  return holiday.detail === "Yarım gün" ? 0.5 : days;
}
