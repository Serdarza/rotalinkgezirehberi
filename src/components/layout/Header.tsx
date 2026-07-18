"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { ThemeToggle } from "@/components/indir/ThemeToggle";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#sehirler", label: "Şehirler" },
  { href: "/#tesisler", label: "Tesisler" },
  { href: "/#ozellikler", label: "Özellikler" },
  { href: "/blog", label: "Blog" },
  { href: "/sik-sorulan-sorular", label: "SSS" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} anasayfa`}>
            <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" priority />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {SITE.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0F62FE] dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/indir"
              className="hidden items-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] sm:inline-flex"
            >
              <Download className="h-4 w-4" aria-hidden />
              İndir
            </Link>
            <button
              type="button"
              className="rounded-xl p-2 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Menüyü aç"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <nav
          className={cn(
            "overflow-hidden transition-all lg:hidden",
            open ? "max-h-96 pb-4" : "max-h-0"
          )}
          aria-label="Mobil menü"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/indir"
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#0F62FE] px-4 py-3 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" /> Uygulamayı İndir
          </Link>
        </nav>
      </Container>
    </header>
  );
}
