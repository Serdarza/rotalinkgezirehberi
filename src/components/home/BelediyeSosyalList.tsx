"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, LocateFixed, Loader2, MapPin } from "lucide-react";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";
import { useMasterData } from "@/hooks/useMasterData";
import { getCurrentPositionRobust, GeoError } from "@/lib/location";
import { reverseGeocode } from "@/lib/weather";
import { cn, slugifyCity } from "@/lib/utils";
import type { SosyalTesis } from "@/types";

export type BelediyeItem = {
  isim: string;
  il: string;
  ilce?: string;
  adres?: string;
  aciklama?: string;
};

type Props = {
  /** Statik HTML'de yer alan ön izleme (il başına sınırlı sayıda kayıt). */
  preview: BelediyeItem[];
  /** İl başına toplam tesis sayısı. */
  totals: Record<string, number>;
  /** Konum alınamadığında gösterilecek varsayılan il. */
  defaultCity: string;
};

const VISIBLE_COUNT = 5;
const EXPANDED_LIMIT = 30;

function toItem(s: SosyalTesis): BelediyeItem {
  return {
    isim: s.isim,
    il: s.il,
    ilce: s.ilce,
    adres: s.adres,
    aciklama: s.aciklama,
  };
}

function locationLine(item: BelediyeItem): string | null {
  const parts: string[] = [];
  if (item.adres?.trim()) parts.push(item.adres.trim());
  else if (item.ilce?.trim()) parts.push(`${item.ilce.trim()}, ${item.il}`);
  return parts.length ? parts.join(" · ") : null;
}

/** Aynı ilçedeki tesisler önce gelsin — koordinat olmadığı için en yakın yaklaşımı. */
function sortByProximity(items: BelediyeItem[], district?: string) {
  if (!district) return items;
  const d = slugifyCity(district);
  return [...items].sort((a, b) => {
    const aMatch = a.ilce && slugifyCity(a.ilce) === d ? 0 : 1;
    const bMatch = b.ilce && slugifyCity(b.ilce) === d ? 0 : 1;
    return aMatch - bMatch;
  });
}

export function BelediyeSosyalList({ preview, totals, defaultCity }: Props) {
  const master = useMasterData();
  const [city, setCity] = useState(defaultCity);
  const [district, setDistrict] = useState<string | undefined>();
  const [located, setLocated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const cityOptions = useMemo(
    () =>
      Object.keys(totals).sort((a, b) => a.localeCompare(b, "tr")),
    [totals]
  );

  const items = useMemo(() => {
    const key = slugifyCity(city);
    const fromMaster =
      master.ready && master.sosyal.length
        ? master.sosyal.filter((s) => slugifyCity(s.il ?? "") === key).map(toItem)
        : [];
    const base = fromMaster.length
      ? fromMaster
      : preview.filter((p) => slugifyCity(p.il) === key);
    return sortByProximity(base, district);
  }, [city, district, master.ready, master.sosyal, preview]);

  const total = items.length > (totals[city] ?? 0) ? items.length : totals[city] ?? items.length;
  const visible = expanded ? items.slice(0, EXPANDED_LIMIT) : items.slice(0, VISIBLE_COUNT);
  const remaining = Math.max(total - visible.length, 0);

  async function detectLocation() {
    setLoading(true);
    setError("");
    try {
      const pos = await getCurrentPositionRobust();
      const place = await reverseGeocode(pos.latitude, pos.longitude);
      const matched = cityOptions.find(
        (c) => slugifyCity(c) === slugifyCity(place.city)
      );
      if (!matched) {
        setError(
          `${place.city} için kayıtlı belediye sosyal tesisi bulunamadı. Listeden bir il seçebilirsiniz.`
        );
        return;
      }
      setCity(matched);
      setDistrict(place.district);
      setLocated(true);
      setExpanded(false);
    } catch (err) {
      setError(
        err instanceof GeoError && err.denied
          ? "Konum izni verilmedi. Aşağıdan il seçebilirsiniz."
          : "Konum alınamadı. Aşağıdan il seçebilirsiniz."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={detectLocation}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F62FE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0043ce] disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <LocateFixed className="h-4 w-4" aria-hidden />
          )}
          {loading ? "Konum alınıyor..." : "Bana en yakınları göster"}
        </button>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="shrink-0">İl seçin:</span>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict(undefined);
              setLocated(false);
              setExpanded(false);
              setError("");
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F62FE] dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-48"
            aria-label="Belediye sosyal tesisleri için il seçin"
          >
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c} ({totals[c]})
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="mb-4 text-sm font-medium text-amber-700 dark:text-amber-400">
          {error}
        </p>
      )}

      <h3 className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <MapPin className="h-4 w-4 text-[#0F62FE]" aria-hidden />
        {city} belediye sosyal tesisleri
        <span className="text-sm font-medium text-slate-400">
          {located ? "size en yakın 5 tesis" : `${total} tesis`}
        </span>
      </h3>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-[15px]">
        {visible.map((item) => {
          const loc = locationLine(item);
          return (
            <p key={`${item.il}-${item.isim}`}>
              <strong className="font-semibold text-slate-900 dark:text-white">
                {item.isim}
              </strong>
              {loc ? (
                <>
                  {" — "}
                  <span data-copyable="true">{loc}</span>.
                </>
              ) : (
                "."
              )}
              {item.aciklama?.trim() ? ` ${item.aciklama.trim()}` : ""}
            </p>
          );
        })}
        {!visible.length && (
          <p className="text-slate-500">
            Bu il için henüz belediye sosyal tesisi kaydı bulunmuyor.
          </p>
        )}
      </div>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0F62FE] hover:text-[#0F62FE] dark:border-slate-700 dark:text-slate-200"
          aria-expanded={expanded}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
            aria-hidden
          />
          {expanded
            ? "Listeyi daralt"
            : `Diğer ${remaining} tesisi göster`}
        </button>
      )}

      {expanded && total > EXPANDED_LIMIT && (
        <p className="mt-4 text-sm">
          <Link
            href={`/sehir/${slugifyCity(city)}?sekme=sosyal`}
            className="font-semibold text-[#0F62FE] hover:underline"
          >
            {city} ilindeki {total} tesisin tamamını şehir sayfasında gör →
          </Link>
        </p>
      )}

      <nav className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800" aria-label="İllere göre belediye sosyal tesisleri">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          İllere göre belediye sosyal tesisleri
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {cityOptions.map((c, index) => (
            <span key={c}>
              {index > 0 && " · "}
              <Link
                href={`/sehir/${slugifyCity(c)}?sekme=sosyal`}
                className="hover:text-[#0F62FE] hover:underline"
              >
                {c} ({totals[c]})
              </Link>
            </span>
          ))}
        </p>
      </nav>

      <SourceDisclaimer className="mt-8" />
    </>
  );
}
