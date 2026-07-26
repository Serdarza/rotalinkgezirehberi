"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Landmark,
  LocateFixed,
  Loader2,
  MapPinned,
  Navigation,
} from "lucide-react";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";
import { useMasterData } from "@/hooks/useMasterData";
import { ensureMasterDataLoaded, getMasterSnapshot } from "@/lib/masterDataRepo";
import { distanceKm, formatDistance } from "@/lib/geo";
import { getCurrentPositionRobust, GeoError } from "@/lib/location";
import {
  geocodeMany,
  mapsSearchUrl,
  matchProvince,
  reverseGeocodeDetailed,
} from "@/lib/placeGeo";
import { cn, slugifyCity } from "@/lib/utils";
import type { SosyalTesis } from "@/types";

export type BelediyeItem = {
  isim: string;
  il: string;
  ilce?: string;
  adres?: string;
  aciklama?: string;
};

type RankedItem = BelediyeItem & {
  distanceKm?: number;
};

type Props = {
  preview: BelediyeItem[];
  totals: Record<string, number>;
  defaultCity: string;
};

const VISIBLE_COUNT = 5;
const EXPANDED_LIMIT = 30;

function itemKey(item: BelediyeItem) {
  return `${slugifyCity(item.il)}|${slugifyCity(item.isim)}`;
}

function toItem(s: SosyalTesis): BelediyeItem {
  return {
    isim: s.isim,
    il: s.il,
    ilce: s.ilce,
    adres: s.adres,
    aciklama: s.aciklama,
  };
}

function excerpt(text?: string, max = 140) {
  const clean = text?.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function BelediyeSosyalList({ preview, totals, defaultCity }: Props) {
  const master = useMasterData();
  const [city, setCity] = useState(defaultCity);
  const [located, setLocated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [ranked, setRanked] = useState<RankedItem[] | null>(null);

  const cityOptions = useMemo(
    () => Object.keys(totals).sort((a, b) => a.localeCompare(b, "tr")),
    [totals]
  );

  const cityItems = useMemo(() => {
    const key = slugifyCity(city);
    const fromMaster =
      master.ready && master.sosyal.length
        ? master.sosyal
            .filter((s) => slugifyCity(s.il ?? "") === key)
            .map(toItem)
        : [];
    return fromMaster.length
      ? fromMaster
      : preview.filter((p) => slugifyCity(p.il) === key);
  }, [city, master.ready, master.sosyal, preview]);

  const items: RankedItem[] =
    located && ranked ? ranked : cityItems.map((item) => ({ ...item }));

  const total =
    items.length > (totals[city] ?? 0) ? items.length : totals[city] ?? items.length;
  const visible = expanded
    ? items.slice(0, EXPANDED_LIMIT)
    : items.slice(0, VISIBLE_COUNT);
  const remaining = Math.max(total - visible.length, 0);

  function resetLocationState() {
    setLocated(false);
    setRanked(null);
    setExpanded(false);
    setStatus("");
    setError("");
  }

  async function detectLocation() {
    setLoading(true);
    setError("");
    setStatus("Konumunuz alınıyor…");
    try {
      const pos = await getCurrentPositionRobust();
      const place = await reverseGeocodeDetailed(pos.latitude, pos.longitude);
      const matched = matchProvince(place, cityOptions);

      if (!matched) {
        setError(
          `${place.province || place.locality} için kayıtlı belediye sosyal tesisi bulunamadı. Listeden bir il seçebilirsiniz.`
        );
        setStatus("");
        return;
      }

      setCity(matched);
      setStatus(`${matched} içindeki tesisler konumunuza göre sıralanıyor…`);

      await ensureMasterDataLoaded();
      const snapshot = getMasterSnapshot();
      const key = slugifyCity(matched);
      const pool =
        snapshot.sosyal.length
          ? snapshot.sosyal
              .filter((s) => slugifyCity(s.il ?? "") === key)
              .map(toItem)
          : preview.filter((p) => slugifyCity(p.il) === key);

      const points = await geocodeMany(
        pool.map((item) => ({
          key: itemKey(item),
          name: item.isim,
          city: matched,
          address: item.adres,
        })),
        { latitude: pos.latitude, longitude: pos.longitude }
      );

      const withDistance: RankedItem[] = pool
        .map((item) => {
          const point = points.get(itemKey(item));
          if (!point) return { ...item };
          return {
            ...item,
            distanceKm: distanceKm(
              pos.latitude,
              pos.longitude,
              point.latitude,
              point.longitude
            ),
          };
        })
        .sort((a, b) => {
          const da = a.distanceKm ?? Number.POSITIVE_INFINITY;
          const db = b.distanceKm ?? Number.POSITIVE_INFINITY;
          return da - db;
        });

      const measured = withDistance.filter((i) => typeof i.distanceKm === "number")
        .length;

      setRanked(withDistance);
      setLocated(true);
      setExpanded(false);
      setStatus(
        measured
          ? `${place.locality}, ${matched} — size en yakın ${Math.min(
              VISIBLE_COUNT,
              withDistance.length
            )} tesis`
          : `${matched} tesisleri listelendi (mesafe hesaplanamadı)`
      );
    } catch (err) {
      setError(
        err instanceof GeoError && err.denied
          ? "Konum izni verilmedi. Aşağıdan il seçebilirsiniz."
          : "Konum alınamadı. Aşağıdan il seçebilirsiniz."
      );
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Size en yakın tesisler
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Konum izniyle bulunduğunuz ildeki en yakın 5 sosyal tesisi
            sıralarız.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={detectLocation}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F62FE] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#0043ce] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <LocateFixed className="h-4 w-4" aria-hidden />
            )}
            {loading ? "Sıralanıyor..." : "Bana en yakınları göster"}
          </button>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="sr-only sm:not-sr-only sm:shrink-0">İl:</span>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                resetLocationState();
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F62FE] dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-44"
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
      </div>

      {error && (
        <p
          className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200"
          role="alert"
        >
          {error}
        </p>
      )}

      {(status || located) && !error && (
        <p className="mb-4 text-sm font-medium text-[#0F62FE]">{status}</p>
      )}

      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {city} belediye sosyal tesisleri
        </h3>
        <span className="text-sm text-slate-500">
          {located
            ? `En yakın ${Math.min(VISIBLE_COUNT, total)} / ${total} tesis`
            : `${total} tesis`}
        </span>
      </div>

      <ul className="space-y-3">
        {visible.map((item, index) => {
          const summary = excerpt(item.aciklama);
          const mapsUrl = mapsSearchUrl(item.isim, item.il);
          return (
            <li
              key={itemKey(item)}
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#0F62FE]/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
            >
              <div className="flex gap-3 sm:gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                  aria-hidden
                >
                  <Landmark className="h-5 w-5" strokeWidth={2.1} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {located && typeof item.distanceKm === "number"
                          ? `#${index + 1} en yakın`
                          : item.ilce || item.il}
                      </p>
                      <h4 className="mt-0.5 text-base font-bold leading-snug text-slate-900 dark:text-white">
                        {item.isim}
                      </h4>
                    </div>
                    {typeof item.distanceKm === "number" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0F62FE]/10 px-2.5 py-1 text-xs font-bold text-[#0F62FE]">
                        <Navigation className="h-3 w-3" aria-hidden />
                        {formatDistance(item.distanceKm)}
                      </span>
                    )}
                  </div>

                  {(item.adres || item.ilce) && (
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <MapPinned
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                        aria-hidden
                      />
                      <span>
                        {item.adres?.trim() ||
                          `${item.ilce}, ${item.il}`}
                      </span>
                    </p>
                  )}

                  {summary && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {summary}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F62FE] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#0043ce]"
                    >
                      <MapPinned className="h-3.5 w-3.5" aria-hidden />
                      Konum
                    </a>
                    <Link
                      href={`/sehir/${slugifyCity(item.il)}?sekme=sosyal`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#0F62FE] hover:text-[#0F62FE] dark:border-slate-700 dark:text-slate-200"
                    >
                      İl sayfası
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {!visible.length && (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
          Bu il için henüz belediye sosyal tesisi kaydı bulunmuyor.
        </p>
      )}

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0F62FE] hover:text-[#0F62FE] dark:border-slate-700 dark:text-slate-200 sm:w-auto"
          aria-expanded={expanded}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180"
            )}
            aria-hidden
          />
          {expanded ? "Listeyi daralt" : `Diğer ${remaining} tesisi göster`}
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

      <nav
        className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800"
        aria-label="İllere göre belediye sosyal tesisleri"
      >
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
