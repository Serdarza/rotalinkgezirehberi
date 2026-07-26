import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";
import { slugifyCity } from "@/lib/utils";
import type { SosyalTesis } from "@/types";

type Group = {
  city: string;
  items: SosyalTesis[];
};

function groupByCity(items: SosyalTesis[]): Group[] {
  const map = new Map<string, SosyalTesis[]>();
  for (const item of items) {
    const city = (item.il || "").trim();
    if (!city) continue;
    const list = map.get(city) ?? [];
    list.push(item);
    map.set(city, list);
  }
  return [...map.entries()]
    .map(([city, list]) => ({ city, items: list }))
    .sort((a, b) => a.city.localeCompare(b.city, "tr"));
}

function hasLocation(s: SosyalTesis) {
  if (s.adres?.trim()) return true;
  return (
    typeof s.latitude === "number" &&
    typeof s.longitude === "number" &&
    Number.isFinite(s.latitude) &&
    Number.isFinite(s.longitude)
  );
}

function locationText(s: SosyalTesis): string | null {
  const parts: string[] = [];
  if (s.adres?.trim()) parts.push(s.adres.trim());
  if (
    typeof s.latitude === "number" &&
    typeof s.longitude === "number" &&
    Number.isFinite(s.latitude) &&
    Number.isFinite(s.longitude)
  ) {
    parts.push(`Konum: ${s.latitude.toFixed(5)}, ${s.longitude.toFixed(5)}`);
  }
  if (s.ilce?.trim()) parts.push(`${s.ilce.trim()} ilçesi`);
  if (s.belediye?.trim()) parts.push(s.belediye.trim());
  return parts.length ? parts.join(" · ") : null;
}

/**
 * Ana sayfada belediye sosyal tesislerini açık metin olarak listeler.
 * Konum (adres / koordinat) varsa metne dahil edilir — kart değil, okunabilir içerik.
 */
export function BelediyeSosyalSection({
  facilities,
}: {
  facilities: SosyalTesis[];
}) {
  if (!facilities.length) return null;

  const withLocation = facilities.filter(hasLocation);
  const source = withLocation.length ? withLocation : facilities;
  const groups = groupByCity(source);

  // Ana sayfa yükünü makul tut: iller sıralı, her ilden birkaç örnek + toplam sayım.
  const featured = groups
    .map((g) => ({
      ...g,
      items: g.items.slice(0, 4),
      total: g.items.length,
    }))
    .filter((g) => g.items.length > 0)
    .slice(0, 24);

  return (
    <Section
      id="belediye-sosyal-tesisleri"
      className="bg-white dark:bg-slate-950"
    >
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Belediye Sosyal Tesisleri"
          title="Türkiye genelinde belediye sosyal tesisleri"
          description="Belediye sosyal tesisleri; restoran, kafe, dinlenme ve spor alanları sunan kamu işletmeleridir. Aşağıda konum bilgisi bulunan tesisler açık metin olarak listelenmiştir."
        />

        <div className="space-y-8">
          {featured.map((group) => (
            <article key={group.city} className="border-b border-slate-100 pb-8 last:border-0 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                <Link
                  href={`/sehir/${slugifyCity(group.city)}?sekme=sosyal`}
                  className="hover:text-[#0F62FE]"
                >
                  {group.city}
                </Link>
                <span className="ml-2 text-sm font-medium text-slate-400">
                  {group.total} tesis
                </span>
              </h3>

              <div className="mt-3 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-[15px]">
                {group.items.map((s) => {
                  const loc = locationText(s);
                  return (
                    <p key={`${group.city}-${s.isim}`}>
                      <strong className="font-semibold text-slate-900 dark:text-white">
                        {s.isim}
                      </strong>
                      {loc ? ` — ${loc}.` : "."}
                      {s.aciklama?.trim() ? ` ${s.aciklama.trim()}` : ""}
                    </p>
                  );
                })}
                {group.total > group.items.length && (
                  <p className="text-sm text-slate-500">
                    <Link
                      href={`/sehir/${slugifyCity(group.city)}?sekme=sosyal`}
                      className="font-semibold text-[#0F62FE] hover:underline"
                    >
                      {group.city} belediye sosyal tesislerinin tamamını gör
                      ({group.total}) →
                    </Link>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <SourceDisclaimer className="mt-10" />
      </Container>
    </Section>
  );
}
