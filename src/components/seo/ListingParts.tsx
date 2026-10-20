import Link from "next/link";
import { Clock, Download, MapPin } from "lucide-react";
import type { BlogPost } from "@/config/blog";
import { getBlogCategory } from "@/config/blog";
import { cn } from "@/lib/utils";

export type Accent = "blue" | "teal" | "amber" | "violet" | "rose" | "emerald";

export const ACCENT_STYLES: Record<
  Accent,
  { badge: string; bar: string; text: string; ring: string }
> = {
  blue: {
    badge: "bg-[#0F62FE]/10 text-[#0F62FE]",
    bar: "border-l-[#0F62FE]",
    text: "text-[#0F62FE]",
    ring: "hover:border-[#0F62FE]/50",
  },
  teal: {
    badge: "bg-teal-500/10 text-teal-600 dark:text-teal-300",
    bar: "border-l-teal-500",
    text: "text-teal-600 dark:text-teal-300",
    ring: "hover:border-teal-500/50",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    bar: "border-l-amber-500",
    text: "text-amber-600 dark:text-amber-300",
    ring: "hover:border-amber-500/50",
  },
  violet: {
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    bar: "border-l-violet-500",
    text: "text-violet-600 dark:text-violet-300",
    ring: "hover:border-violet-500/50",
  },
  rose: {
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    bar: "border-l-rose-500",
    text: "text-rose-600 dark:text-rose-300",
    ring: "hover:border-rose-500/50",
  },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    bar: "border-l-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
    ring: "hover:border-emerald-500/50",
  },
};

export function SeoSectionTitle({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="mb-5 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
    >
      {children}
    </h2>
  );
}

export function SeoFaq({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="sss-baslik" className="mt-12">
      <SeoSectionTitle id="sss-baslik">Sık sorulan sorular</SeoSectionTitle>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-slate-200 bg-white p-4 open:shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function AppCtaCard({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-[#0F62FE]/20 bg-gradient-to-br from-[#0F62FE]/5 to-[#14B8A6]/5 p-6 dark:border-[#0F62FE]/30 sm:p-8",
        className
      )}
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        Rotalink uygulamasıyla daha hızlı
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
        Telefon, harita ve yol tarifi bilgilerine tek dokunuşla ulaşın; favori tesislerinizi
        kaydedin. Rotalink rezervasyon yapmaz, doğru tesise ulaşmanız için rehberlik eder.
      </p>
      <Link
        href="/indir"
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#0043ce]"
      >
        <Download className="h-4 w-4" aria-hidden />
        Uygulamayı indir
      </Link>
    </section>
  );
}

export function LinkChips({
  items,
  className,
}: {
  items: { href: string; label: string; count?: number }[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-[#0F62FE] hover:text-white hover:ring-[#0F62FE] dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
          >
            {item.label}
            {typeof item.count === "number" && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {item.count}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FacilityLinkCard({
  href,
  name,
  type,
  address,
  accent = "blue",
}: {
  href: string;
  name: string;
  type: string;
  address?: string;
  accent?: Accent;
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex h-full flex-col rounded-2xl border border-l-4 border-slate-200 bg-white p-4 hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
          a.bar,
          a.ring
        )}
      >
        <span className={cn("mb-2 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold", a.badge)}>
          {type}
        </span>
        <span className="font-bold leading-snug text-slate-900 dark:text-white">{name}</span>
        {address && (
          <span className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {address}
          </span>
        )}
      </Link>
    </li>
  );
}

export function PlaceTextCard({
  name,
  description,
  address,
  accent = "teal",
}: {
  name: string;
  description?: string;
  address?: string;
  accent?: Accent;
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <li
      className={cn(
        "rounded-2xl border border-l-4 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900",
        a.bar
      )}
    >
      <h3 className="text-base font-bold leading-snug text-slate-900 dark:text-white">
        {name}
      </h3>
      {description && (
        <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>
      )}
      {address && (
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{address}</span>
        </p>
      )}
    </li>
  );
}

export function PostCard({ post }: { post: BlogPost }) {
  const cat = getBlogCategory(post.category);
  const a = ACCENT_STYLES[cat.accent];
  return (
    <li>
      <Link
        href={`/blog/${post.slug}/`}
        className={cn(
          "flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
          a.ring
        )}
      >
        <span
          className={cn(
            "mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold",
            a.badge
          )}
        >
          {cat.label}
        </span>
        <span className="text-base font-bold leading-snug text-slate-900 dark:text-white">
          {post.title}
        </span>
        <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {post.excerpt}
        </span>
        <span className="mt-auto flex items-center gap-3 pt-4 text-xs text-slate-500">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {post.readMinutes} dk
          </span>
        </span>
      </Link>
    </li>
  );
}

export function RelatedPostsGrid({
  posts,
  title = "İlgili rehber yazıları",
}: {
  posts: BlogPost[];
  title?: string;
}) {
  if (!posts.length) return null;
  return (
    <section className="mt-12" aria-labelledby="ilgili-yazilar">
      <SeoSectionTitle id="ilgili-yazilar">{title}</SeoSectionTitle>
      <ul className="grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </ul>
    </section>
  );
}
