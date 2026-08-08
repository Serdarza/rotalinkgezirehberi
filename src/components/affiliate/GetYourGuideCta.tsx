import { ExternalLink, Ticket } from "lucide-react";
import {
  GETYOURGUIDE,
  getYourGuideHomeUrl,
  getYourGuideSearchUrl,
} from "@/config/affiliate";
import { cn } from "@/lib/utils";

type Props = {
  /** Şehir adı verilirse o şehrin tur araması açılır. */
  city?: string;
  className?: string;
  compact?: boolean;
};

export function GetYourGuideCta({ city, className, compact = false }: Props) {
  const href = city?.trim()
    ? getYourGuideSearchUrl(city.trim())
    : getYourGuideHomeUrl();
  const title = city?.trim()
    ? `${city} turları ve aktiviteleri`
    : "Turlar ve aktiviteler";
  const description = city?.trim()
    ? `${city} için rehberli tur, müze bileti ve deneyimleri GetYourGuide üzerinden inceleyin.`
    : "Rehberli turlar, müze biletleri ve yerel deneyimleri GetYourGuide ile keşfedin.";

  return (
    <aside
      className={cn(
        "rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm dark:border-teal-900/50 dark:from-teal-950/40 dark:to-slate-900 sm:p-5",
        className
      )}
    >
      <div
        className={cn(
          "flex gap-3",
          compact ? "items-center" : "flex-col sm:flex-row sm:items-center"
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
          <Ticket className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            Partner · {GETYOURGUIDE.label}
          </p>
          <h3 className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          {!compact && (
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {description}
            </p>
          )}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Turları gör
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </aside>
  );
}
