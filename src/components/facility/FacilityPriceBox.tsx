"use client";

import { useFacilityPricing } from "@/hooks/useFacilityPricing";

type Props = {
  il: string;
  isim: string;
  className?: string;
};

function PriceRow({
  label,
  defined,
  value,
}: {
  label: string;
  defined: boolean;
  value: string | null;
}) {
  if (!defined) return null;

  return (
    <p className="flex items-center justify-between gap-2">
      <span className="font-medium text-slate-500 dark:text-slate-400">{label}</span>
      {value ? (
        <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
          {value}
        </span>
      ) : (
        <span className="rounded-md bg-red-50 px-1.5 py-0.5 font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400">
          Kalamaz
        </span>
      )}
    </p>
  );
}

/** Flutter `FacilityOvernightPriceBox` web karşılığı — GitHub fiyatlar.json. */
export function FacilityPriceBox({ il, isim, className }: Props) {
  const { ready, entry, note } = useFacilityPricing(il, isim);

  if (!ready) {
    return (
      <div
        className={`mb-4 space-y-1.5 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
      >
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div
        className={`mb-4 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
        title={note}
      >
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          Ücret bilgisi kayıtlı değil
        </p>
        <p className="mt-0.5 text-slate-500 dark:text-slate-400">
          Güncel ücreti öğrenmek için tesisi arayabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mb-4 space-y-1 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700 ${className ?? ""}`}
      title={note}
    >
      <PriceRow
        label="Sivil misafir"
        defined={entry.fiyatSivilDefined}
        value={entry.fiyatSivil}
      />
      <PriceRow
        label="Kamu personeli"
        defined={entry.fiyatKamuDefined}
        value={entry.fiyatKamuPersoneli}
      />
      <PriceRow
        label="Kurum personeli"
        defined={entry.fiyatKurumDefined}
        value={entry.fiyatKurumPersoneli}
      />
    </div>
  );
}
