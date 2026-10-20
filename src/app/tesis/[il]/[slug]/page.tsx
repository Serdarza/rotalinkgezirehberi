import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { FacilityPageActions } from "@/components/facility/FacilityPageActions";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";
import { ACCENT_STYLES, SeoSectionTitle } from "@/components/seo/ListingParts";
import { CATEGORY_DEFS, type CategorySlug } from "@/config/categories";
import {
  asText,
  displayFacilityType,
  getCityBundles,
  getFacilityIndex,
  type FacilityKind,
} from "@/lib/facilities";
import { breadcrumbJsonLd, buildMetadata, lodgingJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ il: string; slug: string }> };

const KIND_TO_CATEGORY: Record<FacilityKind, CategorySlug> = {
  ogretmenevi: "ogretmenevi",
  misafirhane: "kamu-misafirhanesi",
  polisevi: "polisevi",
  orduevi: "orduevi",
};

export async function generateStaticParams() {
  const index = await getFacilityIndex();
  return index.map((e) => ({ il: e.citySlug, slug: e.slug }));
}

async function findEntry(il: string, slug: string) {
  const index = await getFacilityIndex();
  const entry = index.find((e) => e.citySlug === il && e.slug === slug);
  return { index, entry };
}

function clip(text: string, max: number) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

function titleFor(isim: string, il: string) {
  const hasCity = isim.toLocaleLowerCase("tr").includes(il.toLocaleLowerCase("tr"));
  return hasCity
    ? `${isim} Adres, Konum ve İletişim`
    : `${isim} (${il}) Adres, Konum ve İletişim`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { il, slug } = await params;
  const { entry } = await findEntry(il, slug);
  if (!entry) return {};
  const f = entry.facility;
  const adres = asText(f.adres);
  const type = displayFacilityType(f.tip);
  const desc = `${f.isim}, ${f.il} ilindeki ${type.toLocaleLowerCase("tr")}. ${
    adres ? `Adres: ${clip(adres, 70)}. ` : ""
  }Harita konumu ve iletişim yolları Rotalink'te.`;
  return buildMetadata({
    title: titleFor(f.isim, f.il),
    description: clip(desc, 160),
    path: entry.path,
  });
}

export default async function FacilityPage({ params }: Props) {
  const { il, slug } = await params;
  const { index, entry } = await findEntry(il, slug);
  if (!entry) notFound();

  const f = entry.facility;
  const adres = asText(f.adres);
  const type = displayFacilityType(f.tip);
  const typeLower = type.toLocaleLowerCase("tr");
  const bundle = (await getCityBundles()).get(entry.citySlug);
  const displayCity = bundle?.displayCity ?? f.il;
  const categorySlug = KIND_TO_CATEGORY[entry.kind];
  const def = CATEGORY_DEFS[categorySlug];
  const accent = ACCENT_STYLES[def.accent];
  const categoryPath = `/sehir/${entry.citySlug}/${categorySlug}/`;
  const cityPath = `/sehir/${entry.citySlug}/`;

  const sameKind = index.filter((e) => e.citySlug === entry.citySlug && e.kind === entry.kind);
  const pos = sameKind.findIndex((e) => e.path === entry.path);
  const siblings: typeof sameKind = [];
  for (let k = 1; k < sameKind.length && siblings.length < 4; k++) {
    siblings.push(sameKind[(pos + k) % sameKind.length]);
  }

  const hasGeo =
    typeof f.latitude === "number" &&
    typeof f.longitude === "number" &&
    Number.isFinite(f.latitude) &&
    Number.isFinite(f.longitude);

  const intro =
    `${f.isim}, ${f.il} ilinde yer alan bir ${typeLower}. ` +
    (adres ? `Rotalink kaydındaki adresi: ${adres}. ` : "") +
    `${displayCity} için Rotalink'te ${sameKind.length} ${def.singular} listeleniyor.`;

  const faq = [
    {
      q: `${f.isim} için rezervasyon Rotalink üzerinden yapılır mı?`,
      a: `Hayır. Rotalink rezervasyon yapmaz ve oda tahsis etmez. Müsaitlik ve kabul koşullarını öğrenmek için tesisle doğrudan iletişime geçin.`,
    },
    {
      q: `${f.isim} tesisinden kimler yararlanabilir?`,
      a: `${def.explainer} Güncel kabul koşullarını tesisten teyit etmenizi öneririz.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: displayCity, path: cityPath },
            { name: def.plural, path: categoryPath },
            { name: f.isim, path: entry.path },
          ]),
          lodgingJsonLd({
            name: f.isim,
            path: entry.path,
            il: f.il,
            description: clip(intro, 300),
            adres,
            latitude: f.latitude,
            longitude: f.longitude,
          }),
        ]}
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumb
          items={[
            { label: "Anasayfa", href: "/" },
            { label: displayCity, href: cityPath },
            { label: def.plural, href: categoryPath },
            { label: f.isim },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-widest", accent.text)}>
              {type} · {displayCity}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {f.isim}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 dark:text-slate-200">
              {intro}
            </p>

            <dl className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Tesis türü</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-white">{type}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">İl</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                  <Link href={cityPath} className="hover:text-[#0F62FE] hover:underline">
                    {displayCity}
                  </Link>
                </dd>
              </div>
              {adres && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-slate-500">Adres</dt>
                  <dd className="mt-1 flex items-start gap-1.5 font-medium text-slate-900 dark:text-white">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0F62FE]" aria-hidden />
                    {adres}
                  </dd>
                </div>
              )}
              {hasGeo && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-slate-500">Koordinatlar</dt>
                  <dd className="mt-1 font-medium tabular-nums text-slate-900 dark:text-white">
                    {f.latitude!.toFixed(5)}, {f.longitude!.toFixed(5)}
                  </dd>
                </div>
              )}
            </dl>

            <SourceDisclaimer className="mt-6" />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-[#0F62FE]/20 bg-sky-50/60 p-5 dark:border-[#0F62FE]/30 dark:bg-slate-800">
              <FacilityPageActions
                isim={f.isim}
                il={f.il}
                tip={String(f.tip ?? "")}
                telefon={f.telefon}
                path={entry.path}
              />
            </div>
          </aside>
        </div>

        {siblings.length > 0 && (
          <section className="mt-10" aria-labelledby="benzer">
            <SeoSectionTitle id="benzer">
              {displayCity} içindeki diğer {def.plural.toLocaleLowerCase("tr")}
            </SeoSectionTitle>
            <ul className="grid gap-2 sm:grid-cols-2">
              {siblings.map((s) => (
                <li key={s.path}>
                  <Link
                    href={s.path}
                    className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:border-[#0F62FE]/50 hover:text-[#0F62FE] dark:border-slate-800 dark:text-slate-200"
                  >
                    {s.facility.isim}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <Link href={categoryPath} className={cn("inline-flex items-center gap-1 hover:underline", accent.text)}>
                {displayCity} {def.plural.toLocaleLowerCase("tr")} listesi <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href={cityPath} className="text-[#0F62FE] hover:underline">
                {displayCity} tüm tesisler ve harita
              </Link>
              {def.hubPath && (
                <Link href={def.hubPath} className="text-[#0F62FE] hover:underline">
                  Tüm illerdeki {def.plural.toLocaleLowerCase("tr")}
                </Link>
              )}
            </p>
          </section>
        )}

        <section className="mt-10" aria-labelledby="sss-baslik">
          <SeoSectionTitle id="sss-baslik">Sık sorulan sorular</SeoSectionTitle>
          <div className="space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
