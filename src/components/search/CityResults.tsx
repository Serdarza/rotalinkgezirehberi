"use client";

import { Fragment, Suspense, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  BedDouble,
  MapPinned,
  UtensilsCrossed,
  Building2,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Section";
import { FacilityCard } from "@/components/home/FacilitySections";
import { WeatherWidget } from "@/components/home/WeatherWidget";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { Breadcrumb } from "@/components/layout/PageHeader";
import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "tesis" | "gezi" | "yemek" | "sosyal";

type KonaklamaFilter = "all" | "Orduevi" | "Öğretmenevi" | "Polisevi";

const KONAKLAMA_FILTERS: { key: KonaklamaFilter; label: string }[] = [
  { key: "all", label: "Tüm Tesisler" },
  { key: "Orduevi", label: "Orduevi" },
  { key: "Öğretmenevi", label: "Öğretmenevi" },
  { key: "Polisevi", label: "Polisevi" },
];

function matchesFacilityTip(facilityTip: string | null | undefined, filter: KonaklamaFilter) {
  if (filter === "all") return true;
  const tip = String(facilityTip ?? "").toLocaleLowerCase("tr").trim();
  const needle = filter.toLocaleLowerCase("tr");
  return tip === needle || tip.includes(needle);
}

const TABS: {
  key: Tab;
  label: string;
  icon: typeof BedDouble;
  activeClass: string;
  badgeClass: string;
}[] = [
  {
    key: "tesis",
    label: "Konaklama",
    icon: BedDouble,
    activeClass: "bg-[#0F62FE] text-white shadow-lg shadow-[#0F62FE]/25",
    badgeClass: "bg-white/20 text-white",
  },
  {
    key: "gezi",
    label: "Gezi",
    icon: MapPinned,
    activeClass: "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/25",
    badgeClass: "bg-white/20 text-white",
  },
  {
    key: "yemek",
    label: "Yemek",
    icon: UtensilsCrossed,
    activeClass: "bg-amber-500 text-white shadow-lg shadow-amber-500/25",
    badgeClass: "bg-white/20 text-white",
  },
  {
    key: "sosyal",
    label: "Belediye Tesisleri",
    icon: Building2,
    activeClass: "bg-violet-600 text-white shadow-lg shadow-violet-600/25",
    badgeClass: "bg-white/20 text-white",
  },
];

function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleImagesUrl(query: string) {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
}

type Props = {
  city: string;
  data: {
    tesis: Tesis[];
    gezi: GeziYeri[];
    yemek: YemekMekani[];
    sosyal: SosyalTesis[];
  };
};

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <p className="text-slate-500 dark:text-slate-400">
        Bu kategoride {label} bulunamadı.
      </p>
    </div>
  );
}

function SearchLinkButton({
  href,
  label,
  tone = "gezi",
}: {
  href: string;
  label: string;
  tone?: "gezi" | "yemek" | "sosyal";
}) {
  const Icon = tone === "yemek" ? ImageIcon : MapPinned;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90",
        tone === "gezi" && "bg-[#14B8A6]",
        tone === "yemek" && "bg-amber-500",
        tone === "sosyal" && "bg-violet-600"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      <ExternalLink className="h-3 w-3 opacity-60" />
    </a>
  );
}

type PlaceCardVariant = "gezi" | "yemek" | "sosyal";

const PLACE_CARD_STYLES: Record<
  PlaceCardVariant,
  { card: string; title: string }
> = {
  gezi: {
    card: "border-teal-200 border-l-[#14B8A6] bg-gradient-to-br from-teal-50 via-white to-emerald-50/60 shadow-teal-500/10 hover:shadow-teal-500/20 dark:border-teal-900 dark:border-l-[#14B8A6] dark:from-slate-800 dark:via-slate-800/80 dark:to-teal-950/50",
    title: "text-teal-900 dark:text-teal-100",
  },
  yemek: {
    card: "border-amber-200 border-l-amber-500 bg-gradient-to-br from-amber-50 via-white to-orange-50/60 shadow-amber-500/10 hover:shadow-amber-500/20 dark:border-amber-900 dark:border-l-amber-500 dark:from-slate-800 dark:via-slate-800/80 dark:to-amber-950/50",
    title: "text-amber-900 dark:text-amber-100",
  },
  sosyal: {
    card: "border-violet-200 border-l-violet-600 bg-gradient-to-br from-violet-50 via-white to-purple-50/60 shadow-violet-500/10 hover:shadow-violet-500/20 dark:border-violet-900 dark:border-l-violet-500 dark:from-slate-800 dark:via-slate-800/80 dark:to-violet-950/50",
    title: "text-violet-950 dark:text-violet-100",
  },
};

function PlaceCard({
  title,
  description,
  action,
  variant = "gezi",
}: {
  title: string;
  description?: string;
  action: ReactNode;
  variant?: PlaceCardVariant;
}) {
  const styles = PLACE_CARD_STYLES[variant];
  return (
    <li
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-l-4 p-5 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg",
        styles.card
      )}
    >
      <div>
        <h3 className={cn("text-base font-bold", styles.title)}>{title}</h3>
        {description && (
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      <div className="mt-4">{action}</div>
    </li>
  );
}

function CityResultsInner({ city, data }: Props) {
  const searchParams = useSearchParams();
  const tipFilter = searchParams.get("tip") ?? undefined;
  const nameFilter = searchParams.get("q")?.trim();
  const [tab, setTab] = useState<Tab>("tesis");
  const [konaklamaFilter, setKonaklamaFilter] = useState<KonaklamaFilter>(() => {
    if (!tipFilter) return "all";
    const tip = tipFilter.toLocaleLowerCase("tr");
    if (tip.includes("orduevi")) return "Orduevi";
    if (tip.includes("öğretmenevi") || tip.includes("ogretmenevi")) return "Öğretmenevi";
    if (tip.includes("polisevi")) return "Polisevi";
    return "all";
  });
  /** Sadece görsel vurgu — içerik sekmesi değişmez */
  const [spotlight, setSpotlight] = useState<Tab | null>(null);
  const [tourDone, setTourDone] = useState(false);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setTourDone(true);
      return;
    }

    // Konaklama → Gezi → Yemek → Belediye → Konaklama
    const sequence: Tab[] = ["tesis", "gezi", "yemek", "sosyal", "tesis"];
    const stepMs = 520;
    const startDelay = 450;
    const timers: number[] = [];

    sequence.forEach((key, index) => {
      timers.push(
        window.setTimeout(() => {
          setSpotlight(key);
          if (index === sequence.length - 1) {
            timers.push(
              window.setTimeout(() => {
                setSpotlight(null);
                setTourDone(true);
              }, 380)
            );
          }
        }, startDelay + index * stepMs)
      );
    });

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [city]);

  const tesis = data.tesis.filter((facility) => {
    const matchesType = matchesFacilityTip(facility.tip, konaklamaFilter);
    const matchesName =
      !nameFilter ||
      facility.isim.toLocaleLowerCase("tr").includes(nameFilter.toLocaleLowerCase("tr"));
    return matchesType && matchesName;
  });

  const konaklamaCounts = {
    all: data.tesis.length,
    Orduevi: data.tesis.filter((f) => matchesFacilityTip(f.tip, "Orduevi")).length,
    Öğretmenevi: data.tesis.filter((f) => matchesFacilityTip(f.tip, "Öğretmenevi")).length,
    Polisevi: data.tesis.filter((f) => matchesFacilityTip(f.tip, "Polisevi")).length,
  };

  const counts = {
    tesis: data.tesis.length,
    gezi: data.gezi.length,
    yemek: data.yemek.length,
    sosyal: data.sosyal.length,
  };

  const activeTab = TABS.find((t) => t.key === tab)!;
  const ActiveIcon = activeTab.icon;
  const visualKey = spotlight ?? tab;

  function handleTabClick(key: Tab) {
    setSpotlight(null);
    setTourDone(true);
    setTab(key);
  }

  return (
    <Container className="py-12">
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: city },
        ]}
      />
      <h1 className="mb-2 text-3xl font-extrabold text-slate-900 dark:text-white">
        {city} — Arama Sonuçları
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        {city} ilindeki konaklama, gezi, yemek ve belediye tesisleri
        {tipFilter ? ` · ${tipFilter}` : ""}
        {nameFilter ? ` · “${nameFilter}”` : ""}
      </p>

      <div className="mb-8">
        <WeatherWidget city={city} withContainer={false} />
      </div>

      <AdSenseUnit variant="banner" className="mb-8" />

      {/* Kategori sekmeleri */}
      <div className="mb-8 overflow-x-auto pb-1" role="tablist" aria-label="Sonuç kategorileri">
        <div className="inline-flex min-w-full gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/80 sm:min-w-0 sm:flex sm:flex-wrap">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isSelected = tab === t.key;
            const isLit = visualKey === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleTabClick(t.key)}
                className={cn(
                  "group flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ease-out",
                  isLit
                    ? cn(t.activeClass, !tourDone && spotlight === t.key && "scale-[1.03]")
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-opacity duration-300",
                    isLit ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                  )}
                  strokeWidth={2.25}
                />
                <span>{t.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums transition-colors duration-300",
                    isLit
                      ? t.badgeClass
                      : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                  )}
                >
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>
        {!tourDone && (
          <p className="mt-2 text-center text-xs text-slate-400 sm:text-left" aria-hidden>
            Diğer kategorileri keşfedebilirsiniz
          </p>
        )}
      </div>

      {/* Aktif kategori başlığı */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-white",
            tab === "tesis" && "bg-[#0F62FE]",
            tab === "gezi" && "bg-[#14B8A6]",
            tab === "yemek" && "bg-amber-500",
            tab === "sosyal" && "bg-violet-600"
          )}
        >
          <ActiveIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeTab.label}
            {tab === "tesis" && konaklamaFilter !== "all" ? ` · ${konaklamaFilter}` : ""}
          </h2>
          <p className="text-sm text-slate-500">
            {tab === "tesis" ? tesis.length : counts[tab]} sonuç · {city}
          </p>
        </div>
      </div>

      {tab === "tesis" && (
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Konaklama filtresi">
          {KONAKLAMA_FILTERS.map((filter) => {
            const active = konaklamaFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setKonaklamaFilter(filter.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-[#0F62FE] text-white shadow-md shadow-[#0F62FE]/25"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                  )}
                >
                  {konaklamaCounts[filter.key]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {tab === "tesis" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tesis.length ? (
            tesis.map((f, index) => (
              <Fragment key={f.isim + f.il + f.tip + index}>
                <FacilityCard facility={f} />
                {(index + 1) % 6 === 0 && index < tesis.length - 1 && (
                  <AdSenseUnit variant="inFeed" className="col-span-full" />
                )}
              </Fragment>
            ))
          ) : (
            <EmptyState label="konaklama tesisi" />
          )}
        </div>
      )}

      {tab === "gezi" && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.gezi.length ? (
            data.gezi.map((g, index) => (
              <Fragment key={g.isim + index}>
                <PlaceCard
                  title={g.isim}
                  description={g.aciklama}
                  variant="gezi"
                  action={
                    <SearchLinkButton
                      href={googleMapsUrl(`${g.isim} ${city}`)}
                      label="İncele"
                      tone="gezi"
                    />
                  }
                />
                {(index + 1) % 6 === 0 && index < data.gezi.length - 1 && (
                  <li className="col-span-full list-none">
                    <AdSenseUnit variant="inFeed" />
                  </li>
                )}
              </Fragment>
            ))
          ) : (
            <EmptyState label="gezi yeri" />
          )}
        </ul>
      )}

      {tab === "yemek" && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.yemek.length ? (
            data.yemek.map((y, index) => (
              <Fragment key={y.isim + index}>
                <PlaceCard
                  title={y.isim}
                  description={y.aciklama}
                  variant="yemek"
                  action={
                    <SearchLinkButton
                      href={googleImagesUrl(`${y.isim} ${city}`)}
                      label="İncele"
                      tone="yemek"
                    />
                  }
                />
                {(index + 1) % 6 === 0 && index < data.yemek.length - 1 && (
                  <li className="col-span-full list-none">
                    <AdSenseUnit variant="inFeed" />
                  </li>
                )}
              </Fragment>
            ))
          ) : (
            <EmptyState label="yemek mekanı" />
          )}
        </ul>
      )}

      {tab === "sosyal" && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.sosyal.length ? (
            data.sosyal.map((s, index) => (
              <Fragment key={s.isim + index}>
                <PlaceCard
                  title={s.isim}
                  description={s.aciklama}
                  variant="sosyal"
                  action={
                    <SearchLinkButton
                      href={googleMapsUrl(`${s.isim} ${city}`)}
                      label="İncele"
                      tone="sosyal"
                    />
                  }
                />
                {(index + 1) % 6 === 0 && index < data.sosyal.length - 1 && (
                  <li className="col-span-full list-none">
                    <AdSenseUnit variant="inFeed" />
                  </li>
                )}
              </Fragment>
            ))
          ) : (
            <EmptyState label="belediye tesisi" />
          )}
        </ul>
      )}
    </Container>
  );
}

export function CityResults(props: Props) {
  return (
    <Suspense
      fallback={
        <Container className="py-12 text-center text-slate-500">Yükleniyor...</Container>
      }
    >
      <CityResultsInner {...props} />
    </Suspense>
  );
}
