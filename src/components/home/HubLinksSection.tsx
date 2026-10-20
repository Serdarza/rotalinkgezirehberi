import Link from "next/link";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Landmark,
  Shield,
  TreePalm,
  Hotel,
} from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ACCENT_STYLES } from "@/components/seo/ListingParts";
import { CATEGORY_DEFS, type CategorySlug } from "@/config/categories";
import { categoryCount, getCityBundles } from "@/lib/facilities";
import { cn } from "@/lib/utils";

const ITEMS: { slug: CategorySlug; icon: typeof Building2; blurb: string }[] = [
  {
    slug: "kamu-misafirhanesi",
    icon: Hotel,
    blurb: "Bakanlık, kurum, belediye ve üniversite misafirhaneleri.",
  },
  {
    slug: "ogretmenevi",
    icon: GraduationCap,
    blurb: "Eğitim çalışanlarına ve misafirlere hizmet veren öğretmenevleri.",
  },
  {
    slug: "polisevi",
    icon: Shield,
    blurb: "Emniyet mensuplarına ve yakınlarına yönelik polisevleri.",
  },
  {
    slug: "orduevi",
    icon: Landmark,
    blurb: "Askerî personel ve ailelerine yönelik orduevleri.",
  },
  {
    slug: "belediye-sosyal-tesisleri",
    icon: TreePalm,
    blurb: "Kafe, restoran ve dinlenme alanları sunan belediye tesisleri.",
  },
];

/** Ana sayfadan tüm tür hub sayfalarına sunucuda üretilen iç bağlantılar. */
export async function HubLinksSection() {
  const bundles = [...(await getCityBundles()).values()];
  return (
    <Section className="bg-slate-50 dark:bg-slate-900/50">
      <Container>
        <SectionHeading
          eyebrow="Tesis Türleri"
          title="Kamu Sosyal Tesislerini Türe Göre Keşfedin"
          description="Kamu misafirhaneleri, öğretmenevleri, polisevleri, orduevleri ve belediye sosyal tesisleri il il listelenir."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ slug, icon: Icon, blurb }) => {
            const def = CATEGORY_DEFS[slug];
            const a = ACCENT_STYLES[def.accent];
            const total = bundles.reduce((s, b) => s + categoryCount(b, def), 0);
            return (
              <li key={slug}>
                <Link
                  href={def.hubPath ?? "/"}
                  className={cn(
                    "flex h-full flex-col rounded-2xl border border-l-4 border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
                    a.bar,
                    a.ring
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        a.badge
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-slate-900 dark:text-white">
                        {def.plural}
                      </span>
                      <span className="block text-xs text-slate-500">{total} kayıt</span>
                    </span>
                  </span>
                  <span className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {blurb}
                  </span>
                  <span
                    className={cn(
                      "mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold",
                      a.text
                    )}
                  >
                    İl il görüntüle <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/kamu-sosyal-tesisleri/"
              className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-[#0F62FE]/40 bg-white p-5 text-center transition hover:bg-[#0F62FE]/5 dark:bg-slate-900"
            >
              <span className="text-lg font-bold text-[#0F62FE]">Tüm kamu sosyal tesisleri</span>
              <span className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Türlere ve illere göre tam rehber
              </span>
            </Link>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
