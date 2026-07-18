"use client";

import { Fragment, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BedDouble,
  MapPinned,
  UtensilsCrossed,
  Building2,
  ExternalLink,
  ImageIcon,
  Download,
  List,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { FacilityCard } from "@/components/home/FacilitySections";
import { CityMap } from "@/components/map/CityMap";
import { WeatherWidget } from "@/components/home/WeatherWidget";
import { AdSenseUnit } from "@/components/ads/AdSenseUnit";
import { StickyAdBanner } from "@/components/ads/StickyAdBanner";
import { ShareButton } from "@/components/share/ShareButton";
import { Breadcrumb } from "@/components/layout/PageHeader";
import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";
import { cn, slugifyCity } from "@/lib/utils";
import { POPULAR_CITIES } from "@/config/site";

type Tab = "tesis" | "gezi" | "yemek" | "sosyal";

type KonaklamaFilter = "all" | "Orduevi" | "Öğretmenevi" | "Polisevi";

const KONAKLAMA_FILTERS: { key: KonaklamaFilter; label: string }[] = [
  { key: "all", label: "Tüm Tesisler" },
  { key: "Orduevi", label: "Orduevi" },
  { key: "Öğretmenevi", label: "Öğretmenevi" },
  { key: "Polisevi", label: "Polisevi" },
];

/** URL ?sekme= değeri ↔ iç sekme anahtarı */
const TAB_TO_SEKME: Record<Tab, string> = {
  tesis: "konaklama",
  gezi: "gezi",
  yemek: "yemek",
  sosyal: "sosyal",
};

const SEKME_TO_TAB: Record<string, Tab> = {
  konaklama: "tesis",
  tesis: "tesis",
  gezi: "gezi",
  yemek: "yemek",
  sosyal: "sosyal",
  belediye: "sosyal",
};

function parseTabFromParams(sekme: string | null): Tab {
  if (!sekme) return "tesis";
  return SEKME_TO_TAB[sekme.toLocaleLowerCase("tr")] ?? "tesis";
}

function parseKonaklamaFilter(tip: string | null | undefined): KonaklamaFilter {
  if (!tip) return "all";
  const value = tip.toLocaleLowerCase("tr");
  if (value.includes("orduevi")) return "Orduevi";
  if (value.includes("öğretmenevi") || value.includes("ogretmenevi")) return "Öğretmenevi";
  if (value.includes("polisevi")) return "Polisevi";
  return "all";
}

function matchesFacilityTip(facilityTip: string | null | undefined, filter: KonaklamaFilter) {
  if (filter === "all") return true;
  const tip = String(facilityTip ?? "").toLocaleLowerCase("tr").trim();
  const needle = filter.toLocaleLowerCase("tr");
  return tip === needle || tip.includes(needle);
}

function shareCopy(city: string, tab: Tab, konaklamaFilter: KonaklamaFilter) {
  if (tab === "gezi") {
    return {
      title: `${city} gezi yerleri — Rotalink`,
      text: `${city} ilindeki gezi yerleri Rotalink’te:`,
    };
  }
  if (tab === "yemek") {
    return {
      title: `${city} yemek mekanları — Rotalink`,
      text: `${city} ilindeki yemek mekanları Rotalink’te:`,
    };
  }
  if (tab === "sosyal") {
    return {
      title: `${city} belediye tesisleri — Rotalink`,
      text: `${city} ilindeki belediye sosyal tesisleri Rotalink’te:`,
    };
  }
  if (konaklamaFilter !== "all") {
    return {
      title: `${city} ${konaklamaFilter} — Rotalink`,
      text: `${city} ilindeki ${konaklamaFilter} listesi Rotalink’te:`,
    };
  }
  return {
    title: `${city} kamu tesisleri — Rotalink`,
    text: `${city} ilindeki kamu misafirhaneleri, polisevleri, öğretmenevleri ve gezi yerleri Rotalink’te:`,
  };
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

function EmptyState({
  label,
  city,
  suggestions = [],
}: {
  label: string;
  city: string;
  suggestions?: Tesis[];
}) {
  const nearbyCities = POPULAR_CITIES.filter(
    (c) => c.toLocaleLowerCase("tr") !== city.toLocaleLowerCase("tr")
  ).slice(0, 6);

  return (
    <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white px-6 py-10 dark:border-slate-700 dark:from-slate-900/60 dark:to-slate-900">
      <p className="text-center text-base font-semibold text-slate-800 dark:text-slate-200">
        Bu kategoride {label} bulunamadı
      </p>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-500">
        Filtreyi değiştirmeyi deneyin veya yakın illere / popüler tesislere göz atın.
      </p>

      {suggestions.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            {city} içinde popüler tesisler
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {suggestions.slice(0, 4).map((f) => (
              <li key={f.isim + f.il}>
                <Link
                  href={`/sehir/${slugifyCity(f.il)}?q=${encodeURIComponent(f.isim)}`}
                  className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[#0F62FE]/40 hover:text-[#0F62FE] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                >
                  {f.isim}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
          Yakın / popüler iller
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {nearbyCities.map((c) => (
            <Link
              key={c}
              href={`/sehir/${slugifyCity(c)}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-[#0F62FE] hover:text-white hover:ring-[#0F62FE] dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/indir"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#14B8A6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20"
        >
          <Download className="h-4 w-4" aria-hidden />
          Uygulamayı indir
        </Link>
      </div>
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
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition",
        tone === "gezi" && "bg-[#14B8A6] hover:bg-[#0d9488]",
        tone === "yemek" && "bg-amber-500 hover:bg-amber-600",
        tone === "sosyal" && "bg-violet-600 hover:bg-violet-700"
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
      <ExternalLink className="h-3 w-3 opacity-80" aria-hidden />
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tipParam = searchParams.get("tip");
  const sekmeParam = searchParams.get("sekme");
  const nameFilter = searchParams.get("q")?.trim() || undefined;

  const tab = parseTabFromParams(sekmeParam);
  const konaklamaFilter = parseKonaklamaFilter(tipParam);
  /** Chip dışı tip (ör. Kamu Misafirhanesi) URL'den gelsin */
  const customTip =
    tipParam && konaklamaFilter === "all" && tipParam.trim() ? tipParam.trim() : undefined;

  const cityPath = `/sehir/${slugifyCity(city)}`;
  const sharePath = (() => {
    const params = new URLSearchParams();
    if (tab !== "tesis") {
      params.set("sekme", TAB_TO_SEKME[tab]);
    }
    if (tab === "tesis") {
      if (konaklamaFilter !== "all") params.set("tip", konaklamaFilter);
      else if (customTip) params.set("tip", customTip);
    }
    if (nameFilter) params.set("q", nameFilter);
    const qs = params.toString();
    return qs ? `${cityPath}?${qs}` : cityPath;
  })();
  const share =
    tab === "tesis" && customTip
      ? {
          title: `${city} ${customTip} — Rotalink`,
          text: `${city} ilindeki ${customTip} listesi Rotalink’te:`,
        }
      : shareCopy(city, tab, konaklamaFilter);

  /** Sadece görsel vurgu — içerik sekmesi değişmez */
  const [spotlight, setSpotlight] = useState<Tab | null>(null);
  const [tourDone, setTourDone] = useState(false);
  /** Konaklama görünümü: liste veya harita */
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const hasDeepLink = Boolean(sekmeParam || tipParam || nameFilter);

  function replaceQuery(next: { tab?: Tab; tip?: KonaklamaFilter }) {
    const nextTab = next.tab ?? tab;
    const nextTip =
      next.tip !== undefined
        ? next.tip
        : nextTab === "tesis"
          ? konaklamaFilter
          : "all";
    const params = new URLSearchParams();

    if (nextTab !== "tesis") {
      params.set("sekme", TAB_TO_SEKME[nextTab]);
    }
    if (nextTab === "tesis" && nextTip !== "all") {
      params.set("tip", nextTip);
    }
    if (nameFilter) {
      params.set("q", nameFilter);
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => {
    // Paylaşılan / filtrelenmiş linkte sekme turunu atla
    if (hasDeepLink) {
      setTourDone(true);
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setTourDone(true);
      return;
    }

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
  }, [city, hasDeepLink]);

  const tesis = useMemo(
    () =>
      data.tesis.filter((facility) => {
        const matchesType = customTip
          ? String(facility.tip ?? "")
              .toLocaleLowerCase("tr")
              .includes(customTip.toLocaleLowerCase("tr"))
          : matchesFacilityTip(facility.tip, konaklamaFilter);
        const matchesName =
          !nameFilter ||
          facility.isim.toLocaleLowerCase("tr").includes(nameFilter.toLocaleLowerCase("tr"));
        return matchesType && matchesName;
      }),
    [data.tesis, konaklamaFilter, nameFilter, customTip]
  );

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
    replaceQuery({
      tab: key,
      tip: key === "tesis" ? konaklamaFilter : "all",
    });
  }

  function handleKonaklamaFilter(filter: KonaklamaFilter) {
    setSpotlight(null);
    setTourDone(true);
    replaceQuery({ tab: "tesis", tip: filter });
  }

  const filterLabel =
    konaklamaFilter !== "all" ? konaklamaFilter : customTip;

  return (
    <Container className="py-12">
      <StickyAdBanner storageKey={`rotalink_sticky_ad_${cityPath}`} />
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: city },
        ]}
      />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {city} — Arama Sonuçları
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {city} ilindeki{" "}
            {tab === "gezi"
              ? "gezi yerleri"
              : tab === "yemek"
                ? "yemek mekanları"
                : tab === "sosyal"
                  ? "belediye tesisleri"
                  : "konaklama, gezi, yemek ve belediye tesisleri"}
            {filterLabel && tab === "tesis" ? ` · ${filterLabel}` : ""}
            {nameFilter ? ` · “${nameFilter}”` : ""}
          </p>
        </div>
        <ShareButton title={share.title} text={share.text} path={sharePath} />
      </div>

      <div className="mb-8">
        <WeatherWidget city={city} withContainer={false} />
      </div>

      <AdSenseUnit variant="banner" className="mb-8" />

      <div className="sticky top-16 z-40 -mx-4 mb-6 space-y-3 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95 sm:-mx-6 sm:px-6 lg:top-[72px]">
        <div className="overflow-x-auto pb-1" role="tablist" aria-label="Sonuç kategorileri">
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
        </div>

        {tab === "tesis" && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Konaklama filtresi">
            {KONAKLAMA_FILTERS.map((filter) => {
              const active = konaklamaFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => handleKonaklamaFilter(filter.key)}
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
      </div>

      {!tourDone && (
        <p className="mb-4 text-center text-xs text-slate-400 sm:text-left" aria-hidden>
          Diğer kategorileri keşfedebilirsiniz
        </p>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
              {tab === "tesis" && filterLabel ? ` · ${filterLabel}` : ""}
            </h2>
            <p className="text-sm text-slate-500">
              {tab === "tesis" ? tesis.length : counts[tab]} sonuç · {city}
            </p>
          </div>
        </div>

        {tab === "tesis" && (
          <div
            className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900"
            role="group"
            aria-label="Görünüm seçimi"
          >
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition",
                viewMode === "list"
                  ? "bg-[#0F62FE] text-white shadow-md shadow-[#0F62FE]/25"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              <List className="h-4 w-4" aria-hidden />
              Liste
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              aria-pressed={viewMode === "map"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition",
                viewMode === "map"
                  ? "bg-[#0F62FE] text-white shadow-md shadow-[#0F62FE]/25"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              <MapIcon className="h-4 w-4" aria-hidden />
              Harita
            </button>
          </div>
        )}
      </div>

      {tab === "tesis" && viewMode === "list" && (
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
            <EmptyState
              label="konaklama tesisi"
              city={city}
              suggestions={data.tesis.slice(0, 4)}
            />
          )}
        </div>
      )}

      {tab === "tesis" && viewMode === "map" && (
        <>
          {tesis.length ? (
            <div className="h-[480px] sm:h-[560px] lg:h-[calc(100vh-16rem)]">
              <CityMap facilities={tesis} />
            </div>
          ) : (
            <EmptyState
              label="konaklama tesisi"
              city={city}
              suggestions={data.tesis.slice(0, 4)}
            />
          )}
        </>
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
            <EmptyState label="gezi yeri" city={city} suggestions={data.tesis.slice(0, 4)} />
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
            <EmptyState label="yemek mekanı" city={city} suggestions={data.tesis.slice(0, 4)} />
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
            <EmptyState label="belediye tesisi" city={city} suggestions={data.tesis.slice(0, 4)} />
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
