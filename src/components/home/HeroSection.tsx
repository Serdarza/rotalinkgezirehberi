"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, BedDouble } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { cn, slugifyCity } from "@/lib/utils";

const TIP_OPTIONS = [
  { value: "", label: "Tüm Tesis Türleri" },
  { value: "Kamu Misafirhanesi", label: "Kamu Misafirhanesi" },
  { value: "Polisevi", label: "Polisevi" },
  { value: "Öğretmenevi", label: "Öğretmenevi" },
  { value: "Orduevi", label: "Orduevi" },
];

const MAX_CITY_SUGGESTIONS = 5;
const MAX_FACILITY_SUGGESTIONS = 4;

type FacilitySearchItem = { isim: string; il: string };

type Suggestion =
  | { kind: "city"; label: string; city: string }
  | { kind: "facility"; label: string; city: string; facilityName: string };

type Props = {
  cities: string[];
  facilities: FacilitySearchItem[];
};

function normalize(value: string) {
  return slugifyCity(value).replace(/-/g, " ");
}

export function HeroSection({ cities, facilities }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tip, setTip] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo((): Suggestion[] => {
    const q = query.trim();
    if (q.length < 1) return [];

    const n = normalize(q);

    const cityMatches = cities
      .filter((city) => {
        const nc = normalize(city);
        return nc.startsWith(n) || nc.includes(n);
      })
      .sort((a, b) => {
        const na = normalize(a);
        const nb = normalize(b);
        const aStarts = na.startsWith(n) ? 0 : 1;
        const bStarts = nb.startsWith(n) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.localeCompare(b, "tr");
      })
      .slice(0, MAX_CITY_SUGGESTIONS)
      .map((city): Suggestion => ({ kind: "city", label: city, city }));

    const facilityMatches = facilities
      .filter((f) => {
        const ni = normalize(f.isim);
        return ni.startsWith(n) || ni.includes(n);
      })
      .sort((a, b) => {
        const na = normalize(a.isim);
        const nb = normalize(b.isim);
        const aStarts = na.startsWith(n) ? 0 : 1;
        const bStarts = nb.startsWith(n) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.isim.localeCompare(b.isim, "tr");
      })
      .slice(0, MAX_FACILITY_SUGGESTIONS)
      .map(
        (f): Suggestion => ({
          kind: "facility",
          label: f.isim,
          city: f.il,
          facilityName: f.isim,
        })
      );

    return [...cityMatches, ...facilityMatches];
  }, [query, cities, facilities]);

  useEffect(() => {
    setHighlight(0);
  }, [suggestions]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function goTo(destinationCity: string, facilityName?: string) {
    const params = new URLSearchParams();
    if (tip) params.set("tip", tip);
    if (facilityName) params.set("q", facilityName);
    const search = params.toString();
    setOpen(false);
    setError("");
    startTransition(() =>
      router.push(`/sehir/${slugifyCity(destinationCity)}${search ? `?${search}` : ""}`)
    );
  }

  function runSearch() {
    const value = query.trim();
    if (!value) {
      setError("Lütfen bir il veya tesis adı yazın.");
      return;
    }

    if (suggestions[highlight]) {
      const s = suggestions[highlight];
      goTo(s.city, s.kind === "facility" ? s.facilityName : undefined);
      return;
    }

    const normalized = normalize(value);
    const matchedCity =
      cities.find((c) => normalize(c) === normalized) ??
      cities.find((c) => normalize(c).startsWith(normalized));

    const matchedFacility =
      facilities.find((f) => normalize(f.isim) === normalized) ??
      facilities.find((f) => normalize(f.isim).includes(normalized));

    const destinationCity = matchedCity ?? matchedFacility?.il;
    if (!destinationCity) {
      setError("Eşleşen il veya konaklama tesisi bulunamadı.");
      return;
    }

    goTo(destinationCity, matchedFacility && !matchedCity ? matchedFacility.isim : undefined);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    runSearch();
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!suggestions.length) return;
      setOpen(true);
      setHighlight((h) => (h + 1) % suggestions.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!suggestions.length) return;
      setOpen(true);
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      runSearch();
    }
  }

  const showDropdown = open && suggestions.length > 0;
  const cityItems = suggestions.filter((s) => s.kind === "city");
  const facilityItems = suggestions.filter((s) => s.kind === "facility");

  return (
    <section id="ara" className="relative min-h-[92vh] overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F62FE]/40" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=60')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/50 to-transparent" />

      <Container className="relative z-10 flex min-h-[92vh] flex-col justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
            🇹🇷 Türkiye&apos;nin Kamu Seyahat Platformu
          </p>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Kamu Seyahatinin En Akıllı Yolu
          </h1>
          <p className="mb-10 text-lg text-slate-200 sm:text-xl">
            Kamu misafirhaneleri, polisevleri, öğretmenevleri, orduevleri ve yüzlerce kamu sosyal tesisini tek platformda keşfedin.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95 sm:p-4"
            role="search"
            aria-label="İl veya konaklama tesisi ara"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div ref={rootRef} className="relative flex-1 text-left">
                <MapPin className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                    if (error) setError("");
                  }}
                  onFocus={() => setOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  type="search"
                  enterKeyHint="search"
                  inputMode="search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="İl veya misafirhane arayın..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  aria-label="İl veya misafirhane adı"
                  aria-describedby="search-help"
                  aria-expanded={showDropdown}
                  aria-controls="search-suggestion-list"
                  aria-autocomplete="list"
                  role="combobox"
                  required
                />

                {showDropdown && (
                  <div
                    id="search-suggestion-list"
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                  >
                    {cityItems.length > 0 && (
                      <div>
                        <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          İller
                        </p>
                        {cityItems.map((s) => {
                          const index = suggestions.indexOf(s);
                          return (
                            <button
                              key={`city-${s.city}`}
                              type="button"
                              role="option"
                              aria-selected={highlight === index}
                              onMouseEnter={() => setHighlight(index)}
                              onClick={() => goTo(s.city)}
                              className={cn(
                                "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition",
                                highlight === index
                                  ? "bg-[#0F62FE]/10 text-[#0F62FE]"
                                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                              )}
                            >
                              <MapPin className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                              <span className="font-semibold">{s.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {facilityItems.length > 0 && (
                      <div className={cn(cityItems.length > 0 && "border-t border-slate-100 dark:border-slate-800")}>
                        <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Tesisler
                        </p>
                        {facilityItems.map((s) => {
                          const index = suggestions.indexOf(s);
                          return (
                            <button
                              key={`fac-${s.facilityName}-${s.city}`}
                              type="button"
                              role="option"
                              aria-selected={highlight === index}
                              onMouseEnter={() => setHighlight(index)}
                              onClick={() => goTo(s.city, s.facilityName)}
                              className={cn(
                                "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition",
                                highlight === index
                                  ? "bg-[#0F62FE]/10 text-[#0F62FE]"
                                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                              )}
                            >
                              <BedDouble className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                              <span className="min-w-0 flex-1 truncate font-medium">{s.label}</span>
                              <span className="shrink-0 text-xs text-slate-400">{s.city}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative sm:w-56">
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
                <select
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  tabIndex={-1}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none focus:border-[#0F62FE] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  aria-label="Tesis türü"
                >
                  {TIP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" size="lg" className="shrink-0" disabled={pending}>
                <Search className="h-5 w-5" aria-hidden />
                {pending ? "Aranıyor..." : "Ara"}
              </Button>
            </div>
            <div className="px-2 pt-3 text-left">
              {error ? (
                <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
                  {error}
                </p>
              ) : (
                <p id="search-help" className="text-xs text-slate-500 dark:text-slate-400">
                  İl veya tesis adı yazın — eşleşen önerilerden seçin.
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </Container>
    </section>
  );
}
