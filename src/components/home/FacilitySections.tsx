"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ShareButton } from "@/components/share/ShareButton";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { FacilityPriceBox } from "@/components/facility/FacilityPriceBox";
import { CityMap } from "@/components/map/CityMap";
import { handleFacilityContact } from "@/lib/facilityContact";
import { useFacilityCardImage } from "@/hooks/useFacilityCardImage";
import { slugifyCity } from "@/lib/utils";
import type { Tesis } from "@/types";

function getDisplayFacilityType(type: string | null | undefined) {
  const normalized = String(type ?? "").trim().toLocaleLowerCase("tr");
  if (normalized === "orduevi") return "Orduevi";
  if (normalized === "polisevi") return "Polisevi";
  if (normalized === "öğretmenevi") return "Öğretmenevi";
  return "Misafirhane";
}

export function FacilityCard({ facility }: { facility: Tesis }) {
  const displayType = getDisplayFacilityType(facility.tip);
  const cityPath = `/sehir/${slugifyCity(facility.il)}`;
  const sharePath = `${cityPath}?q=${encodeURIComponent(facility.isim)}`;
  const imageSrc = useFacilityCardImage(facility);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#0F62FE]/20 border-l-4 border-l-[#0F62FE] bg-gradient-to-br from-sky-50 via-white to-blue-50/60 shadow-md shadow-blue-500/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 dark:border-[#0F62FE]/30 dark:border-l-[#0F62FE] dark:from-slate-800 dark:via-slate-800/80 dark:to-sky-950/50">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
        <Image
          src={imageSrc}
          alt={facility.isim}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 hover:scale-[1.03]"
          unoptimized={imageSrc.startsWith("http")}
        />
        <div className="absolute right-3 top-3">
          <FavoriteButton
            facility={{ isim: facility.isim, tip: String(facility.tip ?? ""), il: facility.il }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{facility.isim}</h3>
        <p className="mb-3 flex items-center gap-1 text-sm font-medium text-[#0F62FE] dark:text-sky-300">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {facility.il}
        </p>
        <FacilityPriceBox il={facility.il} isim={facility.isim} />
        <div className="mt-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleFacilityContact(facility.telefon)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#14B8A6] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0d9488]"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden /> İletişim
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.isim + " " + facility.il)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden /> Konum
          </a>
          <ShareButton
            compact
            title={facility.isim}
            text={`${facility.isim} (${facility.il}) — Rotalink`}
            path={sharePath}
          />
        </div>
      </div>
    </div>
  );
}

export function FeaturedFacilitiesSection({ facilities }: { facilities: Tesis[] }) {
  const withCoords = facilities.filter(
    (f) =>
      typeof f.latitude === "number" &&
      typeof f.longitude === "number" &&
      Number.isFinite(f.latitude) &&
      Number.isFinite(f.longitude)
  );

  if (!withCoords.length) return null;

  return (
    <Section id="tesisler" className="bg-slate-50 dark:bg-slate-900/50">
      <Container>
        <SectionHeading
          eyebrow="Öne Çıkanlar"
          title="Öne Çıkan Kamu Tesisleri"
          description="Türkiye genelinden seçilmiş tesisleri haritada keşfedin."
        />

        <div className="h-[380px] overflow-hidden rounded-3xl sm:h-[460px] lg:h-[560px]">
          <CityMap facilities={withCoords} className="h-full rounded-3xl" />
        </div>

        <div className="mt-10 text-center">
          <Link href="/sehir/istanbul" className="text-sm font-semibold text-[#0F62FE] hover:underline">
            Tüm tesisleri keşfet →
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export function CategoryFacilitiesSection({
  title,
  description,
  facilities,
  id,
}: {
  title: string;
  description: string;
  facilities: Tesis[];
  id?: string;
}) {
  if (!facilities.length) return null;
  return (
    <Section id={id} className="bg-white dark:bg-slate-950">
      <Container>
        <SectionHeading title={title} description={description} center={false} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <FacilityCard key={f.isim + f.il} facility={f} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
