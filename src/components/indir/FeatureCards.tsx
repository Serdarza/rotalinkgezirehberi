import { FEATURES } from "@/config/downloads";

const FEATURE_ICONS = ["🏛️", "🚔", "🏫", "🎖️", "🗺️", "🔄"] as const;

/**
 * Uygulama özellik kartları — sunucu bileşeni.
 */
export function FeatureCards() {
  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      aria-label="Uygulama özellikleri"
    >
      {FEATURES.map((feature, index) => (
        <li
          key={feature}
          className="group flex items-center gap-2.5 rounded-2xl border border-white/30 bg-white/40 px-4 py-3.5 text-sm font-medium text-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-base transition-transform group-hover:scale-110"
            aria-hidden="true"
          >
            {FEATURE_ICONS[index] ?? "✓"}
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
