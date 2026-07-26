import { Container, Section, SectionHeading } from "@/components/ui/Section";
import {
  BelediyeSosyalList,
  type BelediyeItem,
} from "@/components/home/BelediyeSosyalList";
import type { SosyalTesis } from "@/types";

/** Statik HTML'i şişirmemek için il başına taşınan kayıt sayısı. */
const PREVIEW_PER_CITY = 6;
const SUMMARY_MAX_LENGTH = 220;

const DEFAULT_CITY = "Ankara";

function trim(text?: string) {
  const value = text?.trim();
  if (!value) return undefined;
  return value.length > SUMMARY_MAX_LENGTH
    ? `${value.slice(0, SUMMARY_MAX_LENGTH - 1).trimEnd()}…`
    : value;
}

/**
 * Belediye sosyal tesislerini ana sayfada açık metin olarak sunar.
 * Kullanıcı konumuna göre en yakın 5 tesis listelenir, kalanlar tıklamayla açılır.
 */
export function BelediyeSosyalSection({
  facilities,
}: {
  facilities: SosyalTesis[];
}) {
  if (!facilities.length) return null;

  const byCity = new Map<string, SosyalTesis[]>();
  for (const item of facilities) {
    const city = item.il?.trim();
    if (!city || !item.isim?.trim()) continue;
    const list = byCity.get(city) ?? [];
    list.push(item);
    byCity.set(city, list);
  }
  if (!byCity.size) return null;

  const totals: Record<string, number> = {};
  const preview: BelediyeItem[] = [];

  for (const [city, list] of byCity) {
    totals[city] = list.length;
    for (const item of list.slice(0, PREVIEW_PER_CITY)) {
      preview.push({
        isim: item.isim.trim(),
        il: city,
        ilce: item.ilce?.trim() || undefined,
        adres: item.adres?.trim() || undefined,
        aciklama: trim(item.aciklama),
      });
    }
  }

  const defaultCity = totals[DEFAULT_CITY]
    ? DEFAULT_CITY
    : [...byCity.keys()].sort((a, b) => a.localeCompare(b, "tr"))[0];

  return (
    <Section
      id="belediye-sosyal-tesisleri"
      className="bg-white dark:bg-slate-950"
    >
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Belediye Sosyal Tesisleri"
          title="Size en yakın belediye sosyal tesisleri"
          description="Belediye sosyal tesisleri; restoran, kafe, dinlenme ve spor alanları sunan, halka açık kamu işletmeleridir. Konumunuza izin verirseniz bulunduğunuz ildeki en yakın 5 tesisi listeleriz; kalanları tek dokunuşla açabilirsiniz."
        />

        <BelediyeSosyalList
          preview={preview}
          totals={totals}
          defaultCity={defaultCity}
        />
      </Container>
    </Section>
  );
}
