import { SOCIAL_LINKS } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** compact: sadece ikon; full: ikon + etiket */
  variant?: "icons" | "full";
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

const ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

export function SocialLinks({ className, variant = "icons" }: Props) {
  return (
    <nav
      aria-label="Sosyal medya hesaplarımız"
      className={cn(
        variant === "icons" ? "flex items-center gap-2.5" : "flex flex-col gap-2.5",
        className
      )}
    >
      {SOCIAL_LINKS.map((item) => {
        const Icon = ICONS[item.id];
        if (variant === "full") {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#0F62FE]/35 hover:bg-[#0F62FE]/5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-[#0F62FE]/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-[#0F62FE] group-hover:text-white dark:bg-slate-800 dark:text-slate-200">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                  {item.handle}
                </span>
              </span>
            </a>
          );
        }

        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label} — ${item.handle}`}
            title={`${item.label} — ${item.handle}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0F62FE]/40 hover:bg-[#0F62FE] hover:text-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#0F62FE] dark:hover:bg-[#0F62FE] dark:hover:text-white"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        );
      })}
    </nav>
  );
}
