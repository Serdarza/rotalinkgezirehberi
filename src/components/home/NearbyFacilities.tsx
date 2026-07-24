"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LocateFixed, MapPin, Navigation, Phone } from "lucide-react";
import { Container, GlassCard, SectionHeading } from "@/components/ui/Section";
import { ShareButton } from "@/components/share/ShareButton";
import { getFacilityPricing, PRICING_NOTE } from "@/config/pricing";
import { handleFacilityContact } from "@/lib/facilityContact";
import { useFacilityCardImage } from "@/hooks/useFacilityCardImage";
import { distanceKm, formatDistance } from "@/lib/geo";
import { getCurrentPositionRobust, GeoError } from "@/lib/location";
import { cn, slugifyCity } from "@/lib/utils";
import type { Tesis } from "@/types";

type Status = "idle" | "loading" | "ready" | "denied" | "error";

type NearbyItem = Tesis & { distance: number };

type Props = {
  facilities: Tesis[];
  limit?: number;
  className?: string;
};

function NearbyFacilityCard({ facility }: { facility: NearbyItem }) {
  const cityPath = `/sehir/${slugifyCity(facility.il)}`;
  const sharePath = `${cityPath}?q=${encodeURIComponent(facility.isim)}`;
  const imageSrc = useFacilityCardImage(facility);
  const pricing = getFacilityPricing(facility.tip);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#0F62FE]/15 border-l-4 border-l-[#0F62FE] bg-white shadow-md shadow-blue-500/10 dark:border-[#0F62FE]/25 dark:bg-slate-900">
      <div className="relative aspect-[16/10] w-full bg-slate-200 dark:bg-slate-700">
        <Image
          src={imageSrc}
          alt={facility.isim}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          unoptimized={imageSrc.startsWith("http")}
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold tabular-nums text-[#0f766e] shadow-sm dark:bg-slate-900/90 dark:text-teal-300">
          <Navigation className="h-3 w-3" aria-hidden />
          {formatDistance(facility.distance)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{facility.isim}</h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm font-medium text-[#0F62FE] dark:text-sky-300">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {facility.il}
        </p>
        <div
          className="mt-3 space-y-1 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs ring-1 ring-slate-200/70 dark:bg-slate-950/60 dark:ring-slate-700"
          title={PRICING_NOTE}
        >
          <p className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500 dark:text-slate-400">Kamu personeli</span>
            <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
              {pricing.kamu}
            </span>
          </p>
          <p className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500 dark:text-slate-400">Sivil misafir</span>
            {pricing.sivil ? (
              <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
                {pricing.sivil}
              </span>
            ) : (
              <span className="rounded-md bg-red-50 px-1.5 py-0.5 font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400">
                Konaklayamaz
              </span>
            )}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            onClick={() => handleFacilityContact(facility.telefon)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#14B8A6] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0d9488]"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden /> İletişim
          </button>
          <Link
            href={cityPath}
            className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-700"
          >
            İl sayfası
          </Link>
          <ShareButton
            compact
            title={facility.isim}
            text={`${facility.isim} (${facility.il}) — Rotalink`}
            path={sharePath}
          />
        </div>
      </div>
    </article>
  );
}

export function NearbyFacilities({ facilities, limit = 6, className }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const requestLocation = useCallback(() => {
    setStatus("loading");
    getCurrentPositionRobust()
      .then((pos) => {
        setCoords({ lat: pos.latitude, lon: pos.longitude });
        setStatus("ready");
      })
      .catch((err) => {
        setStatus(err instanceof GeoError && err.denied ? "denied" : "error");
      });
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const nearby = useMemo((): NearbyItem[] => {
    if (!coords) return [];
    return facilities
      .filter(
        (f): f is Tesis & { latitude: number; longitude: number } =>
          typeof f.latitude === "number" &&
          typeof f.longitude === "number" &&
          Number.isFinite(f.latitude) &&
          Number.isFinite(f.longitude)
      )
      .map((f) => ({
        ...f,
        distance: distanceKm(coords.lat, coords.lon, f.latitude, f.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }, [coords, facilities, limit]);

  return (
    <section id="yakin" className={cn("relative z-10 scroll-mt-24 bg-slate-50 py-14 dark:bg-slate-900/40", className)}>
      <Container>
        <SectionHeading
          eyebrow="Bana Yakın"
          title="Konumunuza En Yakın Tesisler"
          description="Konum izninizle size en yakın kamu konaklama tesislerini mesafeye göre sıralıyoruz."
        />

        <AnimatePresence mode="wait">
          {status === "ready" && nearby.length > 0 && (
            <motion.div
              key="nearby-ready"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {nearby.map((facility, index) => (
                  <li key={`${facility.isim}-${facility.il}-${index}`}>
                    <NearbyFacilityCard facility={facility} />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {(status === "idle" || status === "loading") && (
            <motion.div
              key="nearby-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="flex items-center justify-center gap-3 py-8 text-sm text-slate-500">
                <LocateFixed className="h-5 w-5 animate-pulse text-[#0F62FE]" />
                Konumunuz alınıyor, yakındaki tesisler hazırlanıyor...
              </GlassCard>
            </motion.div>
          )}

          {(status === "denied" || status === "error" || (status === "ready" && nearby.length === 0)) && (
            <motion.div
              key="nearby-prompt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F62FE]/10 text-[#0F62FE]">
                    <LocateFixed className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Yakındaki tesisleri görün
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {status === "denied"
                        ? "Konum izni verilmedi. En yakın kamu tesislerini sıralamak için konumunuza ihtiyacımız var."
                        : status === "ready"
                          ? "Yakınınızda koordinatlı tesis bulunamadı."
                          : "Konum alınamadı. Tekrar deneyebilirsiniz."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={requestLocation}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
                >
                  <MapPin className="h-4 w-4" />
                  Konumu Aç
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
