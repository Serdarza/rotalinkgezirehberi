"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { slugifyCity } from "@/lib/utils";

const TIP_OPTIONS = [
  { value: "", label: "Tüm Tesis Türleri" },
  { value: "Kamu Misafirhanesi", label: "Kamu Misafirhanesi" },
  { value: "Polisevi", label: "Polisevi" },
  { value: "Öğretmenevi", label: "Öğretmenevi" },
  { value: "Orduevi", label: "Orduevi" },
];

type FacilitySearchItem = { isim: string; il: string };

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;

    const normalized = normalize(value);
    const matchedCity =
      cities.find((city) => normalize(city) === normalized) ??
      cities.find((city) => normalize(city).startsWith(normalized));

    const matchedFacility =
      facilities.find((facility) => normalize(facility.isim) === normalized) ??
      facilities.find((facility) => normalize(facility.isim).includes(normalized));

    const destinationCity = matchedCity ?? matchedFacility?.il;
    if (!destinationCity) {
      setError("Eşleşen il veya konaklama tesisi bulunamadı.");
      return;
    }

    const params = new URLSearchParams();
    if (tip) params.set("tip", tip);
    if (matchedFacility && !matchedCity) params.set("q", matchedFacility.isim);

    setError("");
    const search = params.toString();
    startTransition(() =>
      router.push(`/sehir/${slugifyCity(destinationCity)}${search ? `?${search}` : ""}`)
    );
  }

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F62FE]/40" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&q=80')",
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
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  list="search-suggestions"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="İl veya misafirhane arayın..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  aria-label="İl veya misafirhane adı"
                  aria-describedby="search-help"
                  required
                />
                <datalist id="search-suggestions">
                  {cities.map((c) => (
                    <option key={`city-${c}`} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="relative sm:w-56">
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
                <select
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none focus:border-[#0F62FE] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  aria-label="Tesis türü"
                >
                  {TIP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
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
                  İl adı veya konaklama tesisi yazın; listeden seçim yaparak hızlıca sonuçlara ulaşın.
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </Container>
    </section>
  );
}
