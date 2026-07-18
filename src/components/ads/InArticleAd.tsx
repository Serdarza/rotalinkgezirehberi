import { AdSenseUnit } from "./AdSenseUnit";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Blog yazıları için içerik arası native reklam bandı */
export function InArticleAd({ className }: Props) {
  return (
    <div
      className={cn(
        "my-10 overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white px-3 py-4 dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-900",
        className
      )}
      role="complementary"
      aria-label="Sponsorlu içerik"
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Sponsorlu
      </p>
      <AdSenseUnit
        variant="inFeed"
        className="border-0 bg-transparent p-0 dark:bg-transparent"
      />
    </div>
  );
}
