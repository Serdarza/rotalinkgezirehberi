import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Görsel, fiyat ve bilgi kaynağı uyarısı — kampanya ve tesis listelerinde
 * kullanıcıyı doğru bilgi için kurumla iletişime yönlendirir.
 */
export function SourceDisclaimer({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-amber-200/70 bg-amber-50/70 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/20",
        className
      )}
    >
      <div className="flex gap-3">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden
        />
        <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90 sm:text-sm">
          Görsel, fiyat ve bilgiler açık kaynaklardan derlenmektedir. Güncel ve
          doğru bilgi için tesisler ile iletişime geçmeniz önerilir.
        </p>
      </div>
    </aside>
  );
}
