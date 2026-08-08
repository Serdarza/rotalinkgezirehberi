import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";
import {
  buildCityGuide,
  countFacilityTips,
  type CityGuideStats,
} from "@/lib/cityGuide";
import type { GeziYeri, SosyalTesis, Tesis, YemekMekani } from "@/types";
import { SourceDisclaimer } from "@/components/campaign/SourceDisclaimer";

type Props = {
  city: string;
  data: {
    tesis: Tesis[];
    gezi: GeziYeri[];
    yemek: YemekMekani[];
    sosyal: SosyalTesis[];
  };
};

export function CityGuideSection({ city, data }: Props) {
  const tips = countFacilityTips(data.tesis);
  const stats: CityGuideStats = {
    konaklama: data.tesis.length,
    ...tips,
    gezi: data.gezi.length,
    yemek: data.yemek.length,
    belediye: data.sosyal.length,
  };

  const guide = buildCityGuide(city, stats);

  return (
    <article
      className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-8 sm:p-7"
      aria-labelledby="city-guide-heading"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0F62FE]/10 text-[#0F62FE]">
          <BookOpen className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0F62FE]">
            İl rehberi
          </p>
          <h2
            id="city-guide-heading"
            className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl"
          >
            {guide.title}
          </h2>
        </div>
      </div>

      <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200 sm:text-[15px]">
        {guide.lead}
      </p>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]">
        {guide.paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>

      <ul className="mt-5 space-y-2.5">
        {guide.tips.map((tip) => (
          <li
            key={tip}
            className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-[#0F62FE]"
              aria-hidden
            />
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm text-slate-500">
        Ayrıntılı tatil planı için{" "}
        <Link
          href="/resmi-tatiller"
          className="font-semibold text-[#0F62FE] hover:underline"
        >
          2026–2027 resmi tatil takvimine
        </Link>{" "}
        ve kamu personeli fırsatları için{" "}
        <Link
          href="/kampanyalar"
          className="font-semibold text-[#0F62FE] hover:underline"
        >
          kampanyalara
        </Link>{" "}
        göz atabilirsiniz.
      </p>

      <SourceDisclaimer className="mt-5" />
    </article>
  );
}
