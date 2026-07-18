import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { capitalizeCity } from "@/lib/utils";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-[#0F62FE]">{item.label}</Link>
            ) : (
              <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50">
      <Container>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{description}</p>}
      </Container>
    </div>
  );
}
