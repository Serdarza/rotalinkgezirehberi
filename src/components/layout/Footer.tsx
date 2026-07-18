import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { VisitorCounter } from "@/components/layout/VisitorCounter";
import { FOOTER_LINKS, SITE } from "@/config/site";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/config/downloads";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">{SITE.name}</span>
            </div>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {SITE.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                Google Play
              </a>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold dark:border-slate-600">
                App Store
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Kurumsal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.kurumsal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-600 hover:text-[#0F62FE] dark:text-slate-400">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Yasal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.yasal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-600 hover:text-[#0F62FE] dark:text-slate-400">{l.label}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <a href={`mailto:${SITE.email}`} className="text-sm font-medium text-[#0F62FE]">{SITE.email}</a>
            </p>
          </div>
        </div>

        <div className="mt-12">
          <VisitorCounter />
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-800">
          © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
        </div>
      </Container>
    </footer>
  );
}
