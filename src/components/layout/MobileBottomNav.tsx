"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Heart, Home, Search } from "lucide-react";
import { favoritesCount } from "@/lib/favorites";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/#ara", label: "Ara", icon: Search },
  { href: "/favoriler", label: "Favoriler", icon: Heart },
  { href: "/indir", label: "İndir", icon: Download },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(favoritesCount());
    sync();
    window.addEventListener("rotalink-favorites", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("rotalink-favorites", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
      aria-label="Mobil gezinme"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 pt-1.5 pb-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-semibold transition",
                  active
                    ? "text-[#0F62FE]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn("h-5 w-5", active && "fill-[#0F62FE]/15")}
                    strokeWidth={active ? 2.4 : 2}
                    aria-hidden
                  />
                  {item.href === "/favoriler" && count > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0F62FE] px-1 text-[9px] font-bold text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
